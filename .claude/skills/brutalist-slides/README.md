# brutalist-slides

A self-contained skill that turns a chapter or topic into a **runnable D3 + HTML
slide deck** following the Brutalist slide-design principles. The visual-layout
counterpart to a course outline.

## Invoke

Say "make slides for chapter N", "build a live deck + study artifact", "present
this chapter", or just `slides`. Claude will declare intent (Phase 0), generate
slides through the SLIDES.md workflow, and assemble a navigable HTML deck.

## What you get

`slides/<chapter-slug>.html` (or `-live.html` / `-study.html`) — opens in any
browser, no build step. Keyboard: → next · ← back · `f` fullscreen · `s`
presenter view · `o` overview · `?` help. Study mode renders speaker notes
inline and turns transfer prompts into click-to-reveal.

## Files

| File | Role |
|---|---|
| `SKILL.md` | Skill definition + workflow |
| `SLIDES.md` | Slide-decision authority (Phase 0–4, 12 failure modes, checklists) |
| `DESIGN.md` | Visual authority (palette, type, contrast, dark mode) |
| `D3-CODING.md` | D3 v7 coding constitution for figures |
| `deck-template.html` | The deck runtime you fill with slides (3 worked example slides included) |

Authority order: DESIGN.md (visuals) · SLIDES.md (slide decisions) · D3-CODING.md (figure code).
