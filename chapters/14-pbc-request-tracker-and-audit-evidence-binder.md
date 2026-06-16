# Chapter 14 — PBC Request Tracker and Audit-Evidence Binder

*The risk is not just missing a file. It is sharing the wrong one.*

The audit request list arrives in a spreadsheet. Thirty line items, each one a question the auditors need answered with documentation. Item 7: support for the Q3 revenue recognition entries. Item 14: the board-approved budget for the fiscal year. Item 22: legal correspondence related to the pending litigation.

Five people own pieces of this list. Ten folders of support exist somewhere across the shared drive, the accounting system, and three people's local desktops. The audit manager wants a status update by Thursday.

The preparation problem is real and tractable: matching thirty requests to five owners to ten folders, tracking what is submitted, flagging what is overdue, building an index so the auditors can navigate the binder. A recipe can do all of that. It can ingest the PBC list, assign owners, map support files to request IDs, check which items have reviewer sign-off, surface the gaps.

But there is a second problem running alongside the preparation problem, and it is not tractable by recipe. Item 22 — the legal correspondence. Does it go to the auditors? Maybe. It depends on what the correspondence covers, whether it touches matters that are legally privileged, whether in-house counsel has reviewed it, and whether the decision to share it has been made by someone with the authority to make that decision. A recipe that automatically bundles every file mapped to a request ID and packages it for external delivery has crossed a line that the preparation problem does not authorize it to cross.

The PBC tracker is the tool that handles the preparation problem. The adequacy and privilege judgments are the tool that cannot be automated. The binder is the artifact that records, for every item, which side of that line it is on.

---

## What PBC Means and Why It Has a Gate

PBC stands for "provided by client." It is the audit term for the documents and data that the organization assembles in response to auditor requests. Every audit has a PBC list. It is, in effect, the auditors' shopping list — a structured set of requests for the evidence they need to form their opinions on the financial statements.

The PBC process is a high-stakes version of the preparation/judgment pattern that runs through this entire book. The preparation work — gathering documents, matching them to requests, tracking status — is genuinely automatable and benefits from the speed and consistency a recipe brings. The judgment work — deciding whether a document is adequate for the request it answers, whether it can be shared, whether the auditors' question has been fully addressed — is not automatable and carries real consequences if it goes wrong.

The consequences have two shapes. The first is adequacy failure: the organization provides a document that does not actually answer the auditor's request, either because it covers the wrong period, the wrong entity, or the wrong transaction. The auditors come back with a follow-up request. The close schedule slips. Credibility takes a small hit. The second is privilege failure: the organization provides a document that should not have been shared — one that contains attorney-client privileged communications, board-level deliberations that were not intended for external review, or strategic information that is responsive to the literal request but whose disclosure was a mistake. Once shared with auditors, certain documents can be difficult or impossible to unshare. The consequences can extend well beyond the audit.

Neither failure announces itself in advance. Both look, at the preparation layer, like a document matched to a request ID. The gate exists because the preparation layer cannot see what the judgment layer sees.

![Two parallel PBC tracks — a preparation layer (ingest list, assign owners, map files, check sign-off, flag gaps, build index) and a judgment layer (adequacy, privilege, approval) — converging at a single delivery gate before any document reaches the auditors.](../images/14-pbc-request-tracker-and-audit-evidence-binder-fig-01.png)
*Figure 14.1 — Two parallel tracks converging at the delivery gate*

<!-- → [DIAGRAM: PBC workflow showing two parallel tracks — top track: preparation layer (ingest PBC list, assign owners, map support files, check sign-off status, flag gaps, build index) → work surface produced; bottom track: judgment layer (adequacy review: does this document answer the request? privilege review: can this document be shared? approval: who authorized external delivery?). Both tracks converge at a gate before any document moves to the auditors. Caption: the binder organizes the preparation layer; the gate is where the judgment layer takes control.] -->

---

## The Structure of a PBC Request

Each item on the PBC list is a structured request. Understanding its components is how the recipe knows what to track and how the reviewer knows what to evaluate.

**Request ID** is the auditor's reference number for the item. Every piece of support maps to at least one request ID. A document that cannot be mapped to any request ID does not belong in the binder, regardless of how relevant it seems. A document that maps to multiple request IDs appears in the index under each one.

**Description** is the auditor's stated request. It defines what the document needs to cover: which account, which period, which transaction, which assertion. The description is the standard against which adequacy is measured. A support document that covers the right account but the wrong period fails the description. A document that covers the right period but a different entity fails it. The reviewer uses the description to evaluate whether the mapped document actually answers the question.

**Owner** is the person in the organization responsible for providing the support. Not the person who has the file — the person who is accountable for the request being answered completely and on time. Owner assignment is a human decision, made at the start of the audit, based on who has the relevant knowledge and access. The recipe tracks owner assignments and surfaces overdue items by owner.

**Due date** is when the auditors need the item. PBC lists typically have tiered due dates — some items are needed early for planning procedures, others come later in fieldwork, others at the end before the opinion is issued. The recipe tracks due dates and flags items approaching or past their deadline.

**Status** is where the item is in the workflow: open, in progress, submitted for review, reviewed and approved, or delivered to auditors. Status is maintained by the owner and the reviewer. The recipe reads status; it does not set it unilaterally. An item moves to "delivered" only when a human reviewer has approved it and authorized external sharing.

**Support path** is the file location of the document or documents that answer the request. The recipe maps support paths to request IDs and confirms that the files exist at the stated paths. File existence is a conformance check. File adequacy is a judgment check.

**Privilege flag** is a binary indicator that the item or its support has been flagged for legal review before sharing. The recipe can apply this flag automatically to categories of documents that warrant it — legal correspondence, board minutes, attorney invoices, certain contract files. Human review is required before the flag is cleared. An item with an uncleared privilege flag does not move to the delivery queue regardless of its other status fields.

| Field | What it contains | Who sets it | What the recipe checks |
|---|---|---|---|
| Request ID | Auditor reference | Auditors, in the PBC list | Confirms every support path maps to at least one ID |
| Description | Scope of the request | Auditors | Human reviewer evaluates adequacy against description |
| Owner | Accountable internal contact | Finance lead, at audit start | Flags overdue items by owner |
| Due date | Tiered audit deadline | Auditors | Flags approaching and past-due items |
| Status | Workflow stage | Owner and reviewer maintain | Reads and reports; does not advance unilaterally |
| Support path | File location of responsive documents | Owner provides | Confirms file existence; human reviewer confirms adequacy |
| Privilege flag | Legal review required | Recipe applies by category | Blocks delivery queue until a human clears it |

*The recipe tracks all seven fields; it can set none of them on behalf of a human.*

![Seven-field PBC request panel distinguishing fields the recipe merely tracks from fields a human sets — request ID, description, owner, due date, status, support path, and privilege flag.](../images/14-pbc-request-tracker-and-audit-evidence-binder-fig-02.png)
*Figure 14.3 — Seven PBC request fields: set vs. track*

---

## Building the Binder Index

The binder index is the navigation layer of the audit evidence package. It is not the evidence itself — it is the structured record of where each piece of evidence lives, what request it answers, who reviewed it, and when it was cleared for delivery.

A binder index built by recipe has a defined structure. Every request ID appears exactly once. Every mapped support file is listed under its request ID with its file path, file name, date of the document, and the period it covers. If a request has multiple support files, each one is listed separately. If a request has no support file mapped, it appears in the index as open — flagged, not hidden.

The reviewer sign-off column is the critical field. For each mapped support file, this column records whether a human reviewer has confirmed that the document is adequate for the request it answers. An adequacy confirmation requires the reviewer to have read the description, examined the document, and concluded that the document addresses the auditor's question for the stated period and entity. A file that exists and is mapped to a request ID is not the same as a file that has been reviewed for adequacy. The index makes this distinction visible.

The privilege review column is the second critical field. For items in privileged categories, this column records whether in-house counsel or designated legal reviewer has evaluated the document and cleared it for external sharing. An item with a privilege flag and an empty privilege review column does not move to the auditor delivery package. The recipe enforces this structurally.

The delivery authorization column records who approved the completed package for transmission to the auditors, and when. This is the final gate. It is not the reviewer's sign-off on individual items — it is the senior finance or legal officer's confirmation that the package as a whole is ready, complete, and appropriately scoped. Audit packages are delivered by a person who is accountable for their contents.

![Binder index schematic with rows per request ID and columns for support path, period, reviewer sign-off, privilege review, and delivery authorization — items with an uncleared privilege flag are structurally held out of the delivery queue.](../images/14-pbc-request-tracker-and-audit-evidence-binder-fig-04.png)
*Figure 14.4 — Binder index with privilege-block on delivery*

---

## What the Recipe Cannot Judge

Three judgment calls appear in every PBC process that the recipe cannot make.

The first is adequacy. A support document either answers the auditor's request or it does not. This seems like it should be easy to automate — compare the document's period to the request's period, compare the entity to the request's entity, check the account. But adequacy in audit is not a field-matching problem. It is a professional judgment about whether the evidence is sufficient to support the assertion being tested. An auditor testing the completeness of revenue recognition for Q3 needs documentation that demonstrates not just that revenue was recorded but that it was recorded in the right amount, in the right period, for the right transactions. Whether a given set of supporting schedules meets that standard depends on the auditor's testing approach, the risk level of the assertion, and the judgment of the engagement team. The organization's reviewer cannot know exactly what the auditor needs without communication — and that communication is itself a judgment call about how to engage.

The second is privilege. Attorney-client privilege is a legal doctrine with specific requirements — a communication must be made in confidence, between an attorney and a client, for the purpose of obtaining legal advice. Whether a specific document in the binder satisfies those requirements, and whether the privilege has been waived by prior disclosure, is a legal question. Finance professionals can flag categories of documents that typically require legal review. They cannot make the privilege determination themselves, and neither can a recipe. A recipe that clears a privilege flag based on document type or content matching is performing legal analysis it is not qualified to perform.

The third is scope. The auditors' PBC list defines what they asked for. The organization's response defines what it provides. There is often a gap between the two — auditors ask for everything in a category, the organization provides what it judges to be responsive and appropriate. Decisions about what falls within the scope of a response, and what can be provided in a narrower form, are made through communication between the audit team and the client's legal and finance leadership. A recipe that automatically expands or narrows the scope of a response — by including documents not in the request or excluding documents that match the request criteria — has substituted its own judgment for a negotiation that requires humans on both sides.

![Three columns — adequacy, privilege, and scope — each splitting what the recipe can do (confirm matches, flag, map) from the judgment that belongs to a human (evaluate support, determine privilege, negotiate scope).](../images/14-pbc-request-tracker-and-audit-evidence-binder-fig-03.png)
*Figure 14.2 — Three judgment boundaries: adequacy, privilege, scope*

<!-- → [DIAGRAM: Three judgment boundaries in PBC — three vertical columns labeled "Adequacy," "Privilege," "Scope." Under each: what the recipe can do (adequacy: confirm period/entity match, flag period mismatches; privilege: flag by category, block delivery until cleared; scope: map files to request IDs, flag unmapped items) and what requires human judgment (adequacy: evaluate whether document supports the audited assertion; privilege: determine whether document is legally privileged and whether privilege is waived; scope: negotiate what falls within and outside the auditors' request). Caption: the recipe handles the logistics of all three; none of the three judgments belongs to the recipe.] -->

---

## Supervision in an Audit Context

The three supervision questions have particular weight in an audit context, because the output of the PBC process is delivered to external parties whose job is to scrutinize it.

Scope: what period, entity, documents, and action space is the recipe operating in? The entity question matters because audits often cover multiple entities — the consolidated parent and its subsidiaries — with different document sets. A recipe scoped to the subsidiary should not pull parent-level documents into the binder. The action space must be explicitly limited: the recipe can assemble and index; it cannot deliver. The delivery queue is a staging area, not a transmission channel. A human moves documents from staging to transmission.

Approval: who clears the gate before the binder goes to the auditors? This is the senior finance officer — typically the CFO or controller — or the designated legal officer for items involving privileged communications. The approval is not a rubber stamp. It is a representation by a named person that the binder is complete, accurate, and appropriately scoped. That representation carries weight in the audit relationship and potentially in regulatory contexts if the audit becomes the subject of later scrutiny.

Verification: what would make a delivered item defensible? For each item in the binder, the answer should be: the document exists at the stated path, its period and entity match the request, a named reviewer confirmed its adequacy, the privilege flag was evaluated and resolved, and the delivery was authorized by the designated approver. Any item that cannot satisfy all of these conditions is not ready for the delivery queue. The recipe can check the first and second conditions mechanically. The remaining three require humans.

---

## The Assessment Artifact

The PBC tracker and binder index is the assessment artifact for this chapter. Build it for a real or sanitized audit request list — ten to fifteen items is sufficient to demonstrate the pattern — and show that the artifact organizes the preparation layer without making the judgment calls.

The artifact should show the full request structure for each item: request ID, description, owner, due date, status, support path, reviewer sign-off, privilege flag, and delivery authorization. It should show which items are open, in progress, or complete. It should show which items have uncleared privilege flags. It should show which items are overdue.

The artifact should not show automated adequacy determinations, automated privilege clearances, or delivered items that lack human authorization. The gaps in the judgment columns — the empty reviewer sign-off fields, the uncleared privilege flags — are part of the artifact. They show where the preparation layer ends and the judgment layer begins.

If the support files are not available — if the artifact is built on a sanitized sample with placeholder paths — say so. A binder index that accurately represents the state of incomplete support is more useful than one that implies completeness where none exists.

---

Thirty items. Five owners. Ten folders. Thursday deadline.

The recipe built the index. It mapped the files, flagged the gaps, surfaced the overdue items, blocked the privilege-flagged documents from the delivery queue.

Item 22 — the legal correspondence — sat in the staging area with its flag uncleared. It was not in the binder that went to the auditors. Not because the recipe decided it should not be there. Because no one with the authority to clear the flag had yet made that call.

That is the right outcome. The preparation was fast. The judgment took as long as it needed to take. The binder reflected both.

---

## Exercises

**Warm-up**

1. *Difficulty: Low* — Name the seven fields of a PBC request record and state, for each, whether the recipe sets it or tracks it. What is the difference between those two verbs in this context?
*What this tests: understanding of the recipe's role as reader-and-reporter rather than decision-maker, applied to the specific field structure of the PBC tracker.*

2. *Difficulty: Low* — A binder index has a support file mapped to request ID 7. The file exists at the stated path. The reviewer sign-off column is empty. Is this item ready for the delivery queue? Explain why or why not using the distinction between file existence and adequacy confirmation.
*What this tests: understanding that conformance checks (file exists) and judgment checks (adequacy confirmed) are distinct, and that the first does not satisfy the second.*

3. *Difficulty: Low* — What is a privilege flag, and why does an uncleared privilege flag block the delivery queue regardless of the item's other status fields? Name two document categories that typically warrant a privilege flag.
*What this tests: understanding of the privilege concept, why it is a hard gate rather than a soft warning, and ability to identify document categories that commonly implicate it.*

**Application**

4. *Difficulty: Medium* — An auditor requests "all board minutes for fiscal year 2024." A recipe maps twelve board minute files to the request ID, confirms they all exist at their stated paths, and marks the item as "files mapped." A reviewer signs off on adequacy. The item moves to the delivery queue. What step was skipped, and what is the risk if the delivery proceeds without it?
*What this tests: ability to identify the missing privilege review step in a realistic scenario and articulate the specific consequence — board minutes may contain privileged deliberations or strategic information not intended for external review.*

5. *Difficulty: Medium* — Apply the three supervision questions to this scenario: a PBC recipe is scoped to the consolidated parent entity but the PBC list includes requests that are specific to a wholly-owned subsidiary. The recipe automatically includes subsidiary documents in the parent's binder because they share the same document management system. Which supervision question catches this, and what scope parameter would prevent it?
*What this tests: application of the scope question to an entity-boundary failure in an audit context and ability to write a corrective parameter.*

6. *Difficulty: Medium* — Request ID 18 asks for "support for the accrued compensation balance as of December 31." The mapped support file is a payroll summary from November 30. The reviewer signs off. The item moves to the delivery queue. When the auditor reviews it, they send a follow-up: the document covers the wrong period. Trace where in the PBC workflow this failure occurred, and redesign the adequacy review step to catch it.
*What this tests: ability to diagnose a period-mismatch failure in the adequacy review and propose a structural fix — the reviewer should be evaluating period match as part of adequacy, not just confirming a file exists.*

**Synthesis**

7. *Difficulty: High* — A CFO proposes using an AI model to draft adequacy determinations for each PBC item — the model reads the request description and the support document and generates a sentence confirming whether the document is responsive. The reviewer then either accepts or rejects the draft. Using the three-layer evidence taxonomy (verified evidence, model judgment, human judgment), evaluate this proposal. Does the model's adequacy draft belong to the model judgment layer or the human judgment layer, and does accepting a model draft without independent review satisfy the adequacy gate?
*What this tests: ability to reason about whether human confirmation of a model-generated adequacy determination constitutes genuine human judgment or rubber-stamp, and to identify the conditions under which the gate holds versus collapses.*

8. *Difficulty: High* — Design a PBC tracker for a company undergoing its first-year audit with three operating entities, a holding company, and a shared services entity. The audit has 45 PBC items covering all five entities, with some requests applying to multiple entities. Specify: the owner assignment structure, the privilege flag categories and review process, the binder index structure (one binder or five?), the gate sequence (entity-level reviewer sign-off, then CFO authorization?), and the delivery authorization structure. Identify the two highest-risk failure points in your design.
*What this tests: integration of all chapter concepts into a multi-entity audit support design, with explicit gate sequencing and risk identification for a high-complexity scenario.*

**Challenge**

9. *Difficulty: Advanced* — The chapter argues that adequacy, privilege, and scope are judgment calls that cannot be automated because they require professional standing, legal expertise, and negotiation with external parties. A legal technology argument holds that AI-assisted privilege review is already deployed in large-scale document review (e-discovery), that adequacy determinations follow patterns recognizable from prior audit cycles, and that scope negotiation is increasingly codified in audit standards — suggesting all three judgments are, in principle, automatable with sufficient training data and oversight structure. Construct the strongest version of this argument, drawing on what AI-assisted legal review and audit analytics platforms actually do. Then evaluate it: does the existence of AI-assisted privilege tagging in e-discovery mean the privilege judgment can be delegated to a recipe in the PBC context? Is there a meaningful difference between AI-assisted review (human confirms model output) and human review (human evaluates independently), and if so, where does that difference matter most in an audit binder context?
*What this tests: ability to engage with the chapter's most sophisticated challenge — the existence of deployed AI tools in adjacent legal and audit contexts — and reason about whether those tools relocate or eliminate the judgment requirement, rather than simply asserting that judgment cannot be automated.*

---

## Chapter 14 Exercises: PBC Request Tracker and Audit-Evidence Binder

**Project:** Your Own Mycroft
**This chapter adds:** A due-diligence binder per holding — the sourced evidence behind each position, indexed, so every claim in your thesis traces back to a file, a version, and a date.

---

### Exercise 1 — When to Use AI

**The judgment:**

- Build an indexed evidence binder for one holding: every claim in your thesis mapped to the source that supports it, with file path, version, and as-of date. — *Why AI works here:* indexing claims to sources is structured tracking with a clear schema; the model populates and cross-references fields, a mechanical task.
- Flag every thesis claim that has no mapped source, and every source that is stale (older than your refresh cycle) or maps to nothing. — *Why AI works here:* presence, mapping, and timestamp checks are deterministic conformance checks against the binder structure.
- Apply a "needs-legal/needs-caution" flag to evidence categories that carry special risk (e.g. non-public information you should not be acting on, or a source you cannot verify). — *Why AI works here:* category-tagging by rule is a routing task; the recipe flags, a human clears.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose.

---

### Exercise 2 — When NOT to Use AI

**The judgment:**

- Concluding that the binder is "adequate" — that the evidence actually supports the thesis well enough to hold the position. — *Why AI fails here:* adequacy is a professional judgment about sufficiency, not field-matching; a fully-indexed binder can still rest on weak sources — accountability.
- Clearing a caution-flagged source for use (e.g. deciding a tip is fine to act on). — *Why AI fails here:* whether a source is legitimate to trade on can be a legal/ethical determination the model is not qualified to make and cannot be held responsible for — values.
- Deciding which sources are reliable enough to anchor a claim versus which are noise. — *Why AI fails here:* source reliability depends on independence and credibility the model cannot assess from the file; it will rate confidently anyway — missing ground truth.

**The tell:** You know you have crossed the line when you are using AI output as your reason to act rather than a tool for reaching your own decision.

*Desk rule still binds: process not picks · AI never executes · you own the gate · signals tested, not followed.*

**Series connection:** Tier 6 — the binder is the auditable foundation under the pre-trade gate; assembling it is high-stakes because the position you hold is only as defensible as the evidence indexed behind it.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** A due-diligence evidence binder per holding — claims indexed to sources, gaps and caution-flags surfaced · **Tool:** Claude Project (a persistent project, one binder per holding, evidence accumulating over time)

**The Prompt:**

```
You are my due-diligence binder builder. You index evidence and surface gaps. You do
not judge whether the evidence is adequate, you do not clear caution flags, and you
never recommend or place a trade.

HOLDING: [FILL IN ticker and current position]
THESIS CLAIMS (paste each claim you make in your thesis, FOR and AGAINST): [FILL IN]
EVIDENCE ON HAND (paste each item: a short description, the source, the file/URL, the
  version or as-of date): [FILL IN]
REFRESH CYCLE (how old a source can be before it is stale, e.g. 90 days): [FILL IN]

1. Build a binder index: one row per claim, mapped to the evidence item(s) that
   support it, with source, version, and as-of date.
2. Flag every claim with NO mapped source as UNSUPPORTED.
3. Flag every evidence item that maps to no claim as ORPHAN, and every item older than
   the refresh cycle as STALE.
4. Apply a CAUTION flag to any evidence category that warrants special review before
   use — non-public or unverifiable information, or a source whose provenance is
   unclear. Do NOT clear these flags; leave them for me.
5. Do NOT conclude that the binder is adequate or that the thesis is supported. Do NOT
   rate source reliability. Do NOT recommend any action.
6. End with three lists: unsupported claims, stale/orphan evidence, and caution-flagged
   items awaiting my review.
```

**What this produces:** An indexed binder for one holding plus three gap-lists (unsupported claims, stale/orphan evidence, caution-flagged items) — the preparation layer, with the adequacy judgment left to you. **How to adapt this prompt:** *For your own desk:* add a column for which decision input each claim serves (fundamentals / signal / your book) so you can see if any one leg is thin. *For ChatGPT / Gemini:* same paste; keep the binder in a saved doc since these lack project files. *For a Claude Project:* one project per holding, evidence files uploaded, so the binder grows and re-indexes as you add sources. **Connection to previous chapters:** the support-path-exists-versus-adequacy-confirmed distinction, and the privilege/caution hard-gate, come straight from the audit lens — here it is your own thesis under examination. **Preview of next chapter:** Chapter 15 sharpens the evidence side further with revenue-recognition red flags — channel stuffing, bill-and-hold, aggressive rev rec — the kind of finding that belongs in this binder as evidence AGAINST.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** A local binder-index generator that maps a claims file to an evidence file and writes a gap report · **Tool:** Claude Code · **Skill level:** Intermediate

**Setup:**

- [ ] `desk/holdings/[TICKER]/claims.csv` — columns: claim_id, direction (for/against), claim_text.
- [ ] `desk/holdings/[TICKER]/evidence.csv` — columns: evidence_id, claim_id, description, source, asof_date, category.
- [ ] Read-only confirmation: no account credentials in the repo; Claude Code has no order capability configured.

**The Task:**

```
Work only inside desk/holdings/[TICKER]/. READ-ONLY on all data. Do not connect to any
brokerage or account, do not place/draft/simulate any order, and do not modify
claims.csv or evidence.csv.

1. Read claims.csv and evidence.csv. Build a binder index joining evidence to claims
   on claim_id.
2. Flag any claim with no matching evidence as UNSUPPORTED. Flag any evidence row whose
   claim_id matches no claim as ORPHAN. Flag any evidence with asof_date older than 90
   days as STALE. Flag any evidence whose category is "nonpublic" or "unverified" as
   CAUTION — DO NOT CLEAR.
3. WRITE desk/holdings/[TICKER]/out/binder-index.md (the indexed binder) and
   desk/holdings/[TICKER]/out/gap-report.md (unsupported, orphan, stale, caution lists).
4. Do NOT write any adequacy judgment, source-reliability rating, or buy/hold/sell
   language. Do NOT clear any CAUTION flag.
5. STOP after writing both files and print the counts of each flag type.

Verification step: re-read both files and confirm (a) every UNSUPPORTED claim genuinely
has no evidence row, (b) no CAUTION flag was cleared, and (c) no recommendation or
reliability rating appears. Report any discrepancy.
```

**Expected output:** A `binder-index.md` and a `gap-report.md` under `out/`, source CSVs untouched, with flag counts echoed to the terminal. **What to inspect:** confirm each UNSUPPORTED claim really lacks evidence (not just a claim_id typo), and that every nonpublic/unverified item is flagged CAUTION and left uncleared. **If it goes wrong:** if everything reads ORPHAN or UNSUPPORTED, the join key likely mismatches — check that claim_id values are consistent across both files before re-running. **CLAUDE.md / AGENTS.md note:** "Personal due-diligence repo. Read-only on all account data; never connect to a brokerage or place/draft/simulate orders. CAUTION flags (nonpublic/unverified sources) are never auto-cleared. The binder indexes evidence; it never judges adequacy or recommends."

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** A binder index and gap report the AI produced for one holding. **Validation type:** completeness-and-scope check (is the mapping right, and did it refuse the adequacy/clearance calls?). **Risk level:** High — a binder that looks complete but rests on unsupported claims or a wrongly-cleared caution flag licenses an indefensible position. **Setup:** take the Exercise 3/4 output, the claims, and the evidence.

**The Validation Task:** "Evaluate the AI output using this checklist. Pass / Fail / Cannot determine + explain."

```
Validation Checklist — PBC Request Tracker and Audit-Evidence Binder
□ Correctness: does every claim-to-evidence mapping in the index reflect a real row in
  the evidence file?
□ Completeness: is every claim accounted for (mapped or flagged UNSUPPORTED), with none
  silently omitted?
□ Scope: did the output avoid any adequacy judgment, any source-reliability rating, and
  any buy/hold/sell language?
□ Caution integrity: are all nonpublic/unverified items flagged CAUTION and left
  UNCLEARED?
□ Staleness: do the STALE flags match the actual age of the source against the refresh
  cycle?
□ Failure-mode check: fluent-but-wrong (asserted a claim is "well supported")? a caution
  flag silently cleared? missing ground truth on source reliability?
```

**What to do with your findings:** treat unsupported claims and uncleared caution flags as blocks — resolve each yourself before relying on the position; the binder is permission to make your own adequacy call, not the adequacy call. **AI Use Disclosure prompt:** "I used [tool] to index the evidence behind one holding and to flag unsupported claims and caution items. It made no adequacy judgment, rated no source, cleared no flag, and recommended nothing; I verified the mappings and judged adequacy myself." **Series connection:** the failure mode is completeness-mistaken-for-adequacy — an indexed binder that looks decision-ready but isn't — plus a wrongly cleared caution flag; Tier 6.

---

**Tags:** due-diligence-binder · evidence-index · claim-to-source · adequacy-vs-completeness · caution-flag-gate · per-holding-binder
