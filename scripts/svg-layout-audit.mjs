#!/usr/bin/env node
// svg-layout-audit.mjs — PURELY GEOMETRIC layout audit for figure SVGs.
//
// Checks LAYOUT ONLY (no facts, no notation, no spelling):
//   OOB        text extends outside the viewBox (clipping)
//   OVERFLOW   text spills outside the rect/polygon it sits in
//   TEXT/LINE  text sits on top of a connector or arrow line
//   TEXT/TEXT  two text labels overlap each other
//   GLYPH      text uses a non-ASCII glyph that may render as a missing box (warn)
//
// Deterministic. No network, no API, Node builtins only. Shapes (rect/line/
// polygon) use exact coordinates; only text WIDTH is estimated (conservatively),
// so edge calls are tunable with TOL.
//
// Usage:
//   node scripts/svg-layout-audit.mjs                # audit ./images
//   node scripts/svg-layout-audit.mjs path|dir       # audit a file or dir
//   node scripts/svg-layout-audit.mjs --json         # machine-readable
//   TOL=2 node scripts/svg-layout-audit.mjs          # px tolerance (default 1.5)
//   --strict                                         # GLYPH warnings also fail
// Exit: 0 = clean, 1 = layout errors found.

import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const ARGS = process.argv.slice(2);
const JSON_OUT = ARGS.includes('--json');
const STRICT = ARGS.includes('--strict');
const TARGET = ARGS.find(a => !a.startsWith('--')) || 'images';
const TOL = Number(process.env.TOL ?? 1.5);

// ── text width model (em fractions), tuned for the librsvg/DejaVu fallback ──
const NARROW = new Set("iIl.,:;'|!ftrj()[]{}- /");
const WIDE   = new Set("mwMW@—–");
const UPPER  = new Set("ABCDEFGHJKLNOPQRSTUVXYZ");
const charEm = c => NARROW.has(c) ? 0.30 : WIDE.has(c) ? 0.92 : UPPER.has(c) ? 0.68 : /[0-9]/.test(c) ? 0.56 : 0.52;
const textW = (s, fs, ls = 0) => [...s].reduce((a, c) => a + charEm(c) * fs, 0) + Math.max(0, [...s].length - 1) * ls;

const decode = s => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const num = (v, d = 0) => { const n = parseFloat(String(v ?? '').replace(/[a-z%]+$/i, '')); return Number.isFinite(n) ? n : d; };
const attr = (s, n) => { const m = s.match(new RegExp(n + '\\s*=\\s*"([^"]*)"')); return m ? m[1] : null; };

// glyphs known to render in the fallback fonts; anything else non-ASCII is flagged
const SAFE_EXTRA = new Set([...'—–·•…→←↑↓×÷✓✗“”‘’°≤≥±≈→']);
const glyphRisk = s => {
  const bad = new Set();
  for (const ch of s) { const cp = ch.codePointAt(0); if (cp < 0x7f || SAFE_EXTRA.has(ch)) continue; bad.add(ch); }
  return [...bad];
};

const rot = (x, y, a, cx, cy) => { const r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), dx = x - cx, dy = y - cy; return [cx + dx * c - dy * s, cy + dx * s + dy * c]; };
const pointInPoly = (x, y, pts) => {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
};
const segSeg = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  const d = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3); if (d === 0) return false;
  const t = ((x3 - x1) * (y4 - y3) - (y3 - y1) * (x4 - x3)) / d, u = ((x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1)) / d;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
};
const segHitsBox = (s, b) => {
  const inside = (x, y) => x >= b.l && x <= b.r && y >= b.t && y <= b.b;
  if (inside(s.x1, s.y1) || inside(s.x2, s.y2)) return true;
  const E = [[b.l, b.t, b.r, b.t], [b.r, b.t, b.r, b.b], [b.r, b.b, b.l, b.b], [b.l, b.b, b.l, b.t]];
  return E.some(e => segSeg(s.x1, s.y1, s.x2, s.y2, e[0], e[1], e[2], e[3]));
};
const boxOverlap = (A, B, t = 0) => A.l < B.r - t && A.r > B.l + t && A.t < B.b - t && A.b > B.t + t;

function parse(svg) {
  const vb = svg.match(/viewBox\s*=\s*"([\d.\s-]+)"/);
  let W = 700, H = 420;
  if (vb) { const p = vb[1].trim().split(/\s+/).map(Number); W = p[2] || W; H = p[3] || H; }
  const texts = [], rects = [], lines = [], polys = [];
  const re = /<(\/?)(svg|g)\b([^>]*?)(\/?)>|<text\b([^>]*?)>([\s\S]*?)<\/text>|<rect\b([^>]*?)\/?>|<line\b([^>]*?)\/?>|<polygon\b([^>]*?)\/?>/g;
  const stack = [{ fs: 16, anchor: 'start' }];
  let m;
  while ((m = re.exec(svg))) {
    if (m[2] === 'svg' || m[2] === 'g') {
      if (m[1] === '/') { if (stack.length > 1) stack.pop(); }
      else { const a = m[3] || '', top = stack[stack.length - 1], fs = attr(a, 'font-size'), an = attr(a, 'text-anchor');
        if (m[4] !== '/') stack.push({ fs: fs != null ? num(fs, top.fs) : top.fs, anchor: an || top.anchor }); }
      continue;
    }
    const top = stack[stack.length - 1];
    if (m[5] != null) {
      const a = m[5], content = decode((m[6] || '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
      if (!content) continue;
      const fs = attr(a, 'font-size') != null ? num(attr(a, 'font-size'), top.fs) : top.fs;
      const anchor = attr(a, 'text-anchor') || top.anchor;
      const ls = num(attr(a, 'letter-spacing'), 0);
      const tl = num(attr(a, 'textLength'), 0);
      const x = num(attr(a, 'x')), y = num(attr(a, 'y'));
      const w = tl > 0 ? tl : textW(content, fs, ls);
      const l = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
      let corners = [[l, y - 0.80 * fs], [l + w, y - 0.80 * fs], [l + w, y + 0.22 * fs], [l, y + 0.22 * fs]];
      const tr = attr(a, 'transform');
      const rm = tr && tr.match(/rotate\(\s*(-?[\d.]+)(?:[ ,]+(-?[\d.]+)[ ,]+(-?[\d.]+))?\s*\)/);
      if (rm) { const ang = +rm[1], cx = rm[2] != null ? +rm[2] : 0, cy = rm[3] != null ? +rm[3] : 0; corners = corners.map(([px, py]) => rot(px, py, ang, cx, cy)); }
      const xs = corners.map(c => c[0]), ys = corners.map(c => c[1]);
      texts.push({ content, bbox: { l: Math.min(...xs), r: Math.max(...xs), t: Math.min(...ys), b: Math.max(...ys) } });
    } else if (m[7] != null) {
      const a = m[7], x = num(attr(a, 'x')), y = num(attr(a, 'y')), w = num(attr(a, 'width')), h = num(attr(a, 'height'));
      rects.push({ l: x, t: y, r: x + w, b: y + h, area: w * h, pts: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]] });
    } else if (m[8] != null) {
      const a = m[8]; lines.push({ x1: num(attr(a, 'x1')), y1: num(attr(a, 'y1')), x2: num(attr(a, 'x2')), y2: num(attr(a, 'y2')) });
    } else if (m[9] != null) {
      const pts = (attr(m[9], 'points') || '').trim().split(/\s+/).map(p => p.split(',').map(Number)).filter(p => p.length === 2);
      if (pts.length >= 3) { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); polys.push({ l: Math.min(...xs), t: Math.min(...ys), r: Math.max(...xs), b: Math.max(...ys), area: (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys)), pts }); }
    }
  }
  return { W, H, texts, rects, lines, polys };
}

function audit(file) {
  const { W, H, texts, rects, lines, polys } = parse(file.svg);
  const issues = [];
  const canvas = W * H;
  // containers = rects + polygons that are big enough to hold text but not the full canvas
  const containers = [...rects, ...polys].filter(s => s.area >= 200 && s.area < 0.85 * canvas);
  for (const tx of texts) {
    const b = tx.bbox, lab = tx.content.length > 34 ? tx.content.slice(0, 34) + '…' : tx.content;
    if (b.l < -TOL || b.t < -TOL || b.r > W + TOL || b.b > H + TOL)
      issues.push({ code: 'OOB', msg: `"${lab}" outside viewBox (r=${b.r.toFixed(0)} b=${b.b.toFixed(0)} vs ${W}x${H})` });
    const cx = (b.l + b.r) / 2, cy = (b.t + b.b) / 2;
    const owners = containers.filter(s => pointInPoly(cx, cy, s.pts)).sort((p, q) => p.area - q.area);
    if (owners.length) {
      const o = owners[0];
      // probe text extremes against the actual shape outline
      const probes = [[b.l + 1, cy], [b.r - 1, cy], [cx, b.t + 1], [cx, b.b - 1]];
      const out = probes.filter(([px, py]) => !pointInPoly(px, py, o.pts));
      if (out.length) {
        const dl = Math.max(0, o.l - b.l), dr = Math.max(0, b.r - o.r), dtp = Math.max(0, o.t - b.t), db = Math.max(0, b.b - o.b);
        if (dl > TOL || dr > TOL || dtp > TOL || db > TOL || out.length)
          issues.push({ code: 'OVERFLOW', msg: `"${lab}" spills its box (${dl.toFixed(0)}L ${dr.toFixed(0)}R ${dtp.toFixed(0)}T ${db.toFixed(0)}B px)` });
      }
    }
    // TEXT/LINE: flag only a real strike-through — a line crossing the text's
    // horizontal or vertical centerline (ignores lines that merely clip a corner).
    const px = Math.min(3, (b.r - b.l) / 4), py = Math.min(3, (b.b - b.t) / 4);
    const strike = lines.some(ln =>
      segSeg(ln.x1, ln.y1, ln.x2, ln.y2, b.l + px, cy, b.r - px, cy) ||
      segSeg(ln.x1, ln.y1, ln.x2, ln.y2, cx, b.t + py, cx, b.b - py));
    if (strike) issues.push({ code: 'TEXT/LINE', msg: `"${lab}" sits on an arrow/line` });
    const bad = glyphRisk(tx.content);
    if (bad.length) issues.push({ code: 'GLYPH', warn: true, msg: `"${lab}" → glyph ${bad.map(c => JSON.stringify(c)).join(',')} may not render` });
  }
  for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++)
    if (boxOverlap(texts[i].bbox, texts[j].bbox, 2))
      issues.push({ code: 'TEXT/TEXT', msg: `"${texts[i].content.slice(0, 22)}" overlaps "${texts[j].content.slice(0, 22)}"` });
  return issues;
}

function walk(p) {
  const st = statSync(p);
  if (st.isFile()) return p.toLowerCase().endsWith('.svg') ? [p] : [];
  return readdirSync(p).flatMap(e => walk(join(p, e)));
}

let files = [];
try { files = walk(TARGET).sort(); } catch { console.error(`Path not found: ${TARGET}`); process.exit(0); }
const report = [];
let nErr = 0, nWarn = 0, nBad = 0;
for (const f of files) {
  const issues = audit({ svg: readFileSync(f, 'utf8') });
  if (!issues.length) continue;
  nBad++;
  const errs = issues.filter(i => !i.warn).length, warns = issues.filter(i => i.warn).length;
  nErr += errs; nWarn += warns;
  report.push({ file: f, issues });
}
if (JSON_OUT) { console.log(JSON.stringify({ files: files.length, flagged: nBad, errors: nErr, warnings: nWarn, report }, null, 2)); }
else {
  for (const r of report) {
    console.log(`\n### ${r.file}`);
    for (const i of r.issues) console.log(`  [${i.code}]${i.warn ? ' (warn)' : ''} ${i.msg}`);
  }
  console.log(`\n==== ${nBad}/${files.length} SVGs flagged | ${nErr} layout errors | ${nWarn} glyph warnings ====`);
  console.log('Codes: OOB=outside-canvas  OVERFLOW=spills-box  TEXT/LINE=on-arrow  TEXT/TEXT=labels-overlap  GLYPH=may-not-render');
}
process.exit((nErr > 0 || (STRICT && nWarn > 0)) ? 1 : 0);
