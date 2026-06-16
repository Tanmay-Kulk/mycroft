# Chapter 6 — Monthly Variance Pack

*The dangerous shortcut is letting the machine explain what it can only calculate.*

The actuals are loaded. The budget file is open in a tab. The CFO wants commentary by three o'clock. You have a tool that can compute every delta in seconds, rank them by size, and generate a paragraph for each one explaining what probably happened.

Here is the question that determines whether you have a useful tool or a liability: does the paragraph know why the variance happened, or does it only know how large it is?

A variance is a number. An explanation is a judgment. The number is reproducible — anyone with the same actuals and budget file will get the same delta. The explanation is not reproducible in the same way, because it depends on knowledge the model does not have: whether the sales shortfall reflects a timing difference or a lost account, whether the cost overrun was authorized or a control failure, whether the favorable variance is genuine performance or a budget that was set too low. The model can produce a sentence that sounds like it knows these things. It does not know them. The finance professional does — or should — and the system has to be designed so that the sentence cannot travel without the person.

That design is the variance pack. Not a report. A structure that separates what the machine verified from what a human explained, and makes that separation visible.

---

## What a Variance Actually Is

Before building the pack, it is worth being precise about what a variance is and what it is not, because the confusion between the two is where most errors enter.

A variance is the arithmetic difference between an actual result and a reference value — typically a budget, a forecast, or a prior period. The dollar variance on a revenue line is actuals minus budget. The percent variance is that difference divided by the budget. Both are deterministic: given the inputs, there is exactly one correct answer. A machine is better at computing these than a human. It is faster, more consistent, and less likely to transpose digits at row 847 of a 1,200-row account list.

What a variance is not is an explanation. The number tells you something moved. It does not tell you why. The distance between those two things — between observing a movement and explaining it — is the entire domain of professional finance judgment. It is where materiality assessments live, where accounting treatment decisions get made, where the question of whether something is a problem or a non-event gets answered. None of that is in the delta.

This seems obvious stated plainly. It becomes less obvious when the tool that computed the delta also generates a sentence explaining it, and the sentence is fluent, and the sentence is often plausible, and the deadline is three o'clock. The variance pack is a structural response to that problem — a way of designing the workflow so the sentence cannot be treated as explanation unless a human put it there.

![Two equal panels separated by a hard vertical gate; the left lists machine computations, the right lists human judgments.](../images/06-monthly-variance-pack-fig-01.png)
*Figure 6.1 — Compute vs. explain: the gate keeps the columns separate*

<!-- → [DIAGRAM: Two-column split showing "What the machine computes" vs. "What the human explains" — left column: dollar variance, percent variance, rank by magnitude, flag by threshold, attach prior comment; right column: causal explanation, materiality decision, accounting treatment, release authorization. A hard vertical line between them labeled "the gate." Caption: the pack is the mechanism that keeps these columns separate.] -->

---

## The Ingredients

A variance pack has a defined set of inputs. Each one has a contract: a source, a version, a period, an owner. The pack does not proceed until those contracts are satisfied. This is not overhead — it is the mechanism that makes the output defensible.

**Actuals** are the period's recorded results, drawn from the approved source — the general ledger, the ERP export, the close file that the controller signed off on. Not a preliminary pull. Not a working copy. The approved version, with its version identifier and timestamp. If actuals are not yet approved, the pack stops and says so.

**Budget** is the current-version budget for the same period and entity. Budget files change. A variance computed against last month's budget version is not wrong in the arithmetic sense — the delta is still accurate given those inputs — but it may be wrong in the professional sense if the budget was revised and the revision is material. The version field is how this gets caught.

**Forecast** is optional but common. When the pack includes both budget and forecast variances, it produces two sets of deltas on the same account list. This is useful because budget variances and forecast variances tell different stories: the first measures performance against the original plan, the second measures it against the most recent expectation. A CFO who sees them on the same line can tell immediately whether a budget miss was anticipated.

**Mapping tables** are the crosswalk between raw account codes and the line items on the report. Every finance team has them. They are also one of the most common sources of silent error in variance reporting, because mapping tables change — accounts get reclassified, new accounts get added — and the mapping that was correct last quarter may not be correct this quarter. The pack checks whether any account in the actuals file is unmapped. Unmapped accounts above a materiality threshold stop the run.

**Thresholds** define what "material" means for flagging purposes. Not a philosophical question — a practical one. What dollar amount, and what percentage of the line item, triggers a flag requiring owner commentary? These thresholds should be set by a human before the pack runs, not inferred by the model during the run.

**Prior comments** are the explanations attached to the same line items in previous periods. They are not answers — last month's explanation for a revenue variance does not explain this month's — but they are context. A model that can attach the prior comment to the flagged line item gives the reviewer a starting point. The prior comment is labeled as prior commentary, not as an explanation of the current variance.

| Input | Source | Version requirement | What happens if missing |
|---|---|---|---|
| Actuals | Approved GL / ERP export | Version identifier + timestamp | Pack stops; no variance is computed against unapproved actuals |
| Budget | Current-version budget file | Version identifier for the period and entity | Run against a prior version is flagged, not silently used |
| Forecast | Optional forecast file | Same version requirements as budget | Absence is noted; budget-only variances proceed |
| Mapping tables | Current-period crosswalk | Reconciled to the full account list | Unmapped accounts above threshold stop the run |
| Thresholds | Human-set materiality parameters | Set before the run | Model does not infer thresholds during the run |
| Prior comments | Prior-period commentary file | Dated to the prior period | Attached as context, labeled prior — never as current explanation |

*Table 1 — Every ingredient has a contract; missing contracts stop the run before they corrupt the output.*

---

## What the Recipe Does

With ingredients verified, the recipe has a defined scope. It computes. It ranks. It flags. It attaches. It stops.

**Compute** means calculating dollar and percent variances for every account in the mapping. Budget variance, forecast variance if a forecast was supplied, prior-period variance if the prior period's actuals are in scope. The arithmetic is deterministic and logged. Every computed delta traces to the actuals row, the budget row, and the mapping entry that produced it.

**Rank** means ordering the flagged items by absolute dollar variance, descending. The CFO does not want to scroll to row 847 to find the material items. The top of the pack should show the largest movements first. Ranking is not judgment — it is presentation of what was computed.

**Flag** means marking every line where the dollar or percent variance exceeds the threshold. The flag is binary: above threshold or not. The model does not decide whether a flagged item is important. The threshold, set by a human before the run, defines the flag. The flag prompts human review. It is not a finding.

**Attach** means pulling the prior period's comment for every flagged line and placing it in the commentary column, labeled clearly as prior. If no prior comment exists, the commentary field is blank. Blank is the correct value when there is no human-sourced explanation. The recipe does not fill blank fields with generated text. A blank field is information — it tells the reviewer that a flagged item has no prior context and needs fresh commentary.

**Stop** means the recipe does not cross into explanation. It does not write sentences about why revenue missed. It does not characterize a cost variance as favorable or adverse in a narrative sense. It does not assess materiality. It does not recommend whether the variance requires disclosure. It produces a structured work surface — a ranked, flagged, sourced table with prior comments where they exist — and it delivers that surface to the finance professional who will cross the gate.

![A pipeline of machine operations ending at a vertical gate, after which a single human node holds commentary and release.](../images/06-monthly-variance-pack-fig-02.png)
*Figure 6.2 — The recipe flow stops at the gate*

<!-- → [DIAGRAM: Recipe flow — left to right: ingredients verified → compute variances (dollar, percent, budget, forecast, prior period) → rank by magnitude → flag by threshold → attach prior comments → blank fields for unsupported lines → structured work surface → gate → human commentary + release. The gate is shown as a vertical bar. To the left of the gate: machine operations. To the right: human judgment. Caption: the recipe's scope ends at the gate; nothing crosses without a person.] -->

---

## The Commentary Problem

Here is the place where the design breaks down in practice, and where it is worth spending time.

The commentary column in a variance pack is the column where explanations go. In a well-designed pack, that column has two possible states: a human-authored explanation, or blank. In the wild, it often has a third state: a model-generated sentence that sounds like an explanation.

The model-generated sentence is the problem. Not because it is always wrong — it may often be plausible. The problem is that it is indistinguishable from a human-authored explanation if both are sitting in the same column with the same formatting. The CFO reading the pack cannot tell which explanations were verified by a finance professional and which were produced by a model that computed a delta and inferred a cause. If the model's explanation is wrong — if the revenue miss was a lost account and the model said timing difference — the error has the appearance of reviewed analysis.

The fix is structural, not instructional. You cannot solve this by telling the model to be more careful. You solve it by making the column's provenance visible. Two sub-columns instead of one: "Prior commentary (sourced)" and "Current explanation (owner required)." The current explanation column starts blank for every flagged item. It is populated only when a named finance professional writes the explanation and attaches their name to it. The model does not write in this column. Ever.

This is what "unsupported explanations are visible" means in practice. The visibility is not a warning label on a generated sentence. It is the absence of a sentence where no human has yet spoken.

![A flagged-items list with two commentary sub-columns: a sourced prior column always filled, and a current-explanation column that mixes human-authored cells with intentionally blank cells where no human has spoken.](../images/06-monthly-variance-pack-fig-04.png)
*Figure 6.3 — The two commentary sub-columns: a blank cell is information*

---

## Agentic Supervision in a Variance Workflow

The three supervision questions apply directly here, and it is worth running through them concretely.

Scope: what period, entity, source, and action space is the agent operating in? For a variance pack, this means: which close period? Which entity or entities — one operating subsidiary, multiple subsidiaries, the consolidated parent? Which source file for actuals — and is that file the approved version? What can the agent write — can it populate commentary fields, or only produce the structured table? The agent should not be able to expand its own scope. If the actuals file covers multiple entities but the pack was scoped to one, the agent should process only the scoped entity and note that others were excluded.

Approval: who clears the gate before the output moves forward? This is the named finance professional — controller, FP&A lead, CFO — who reviews the work surface, writes or approves the commentary for flagged items, and signs off before the pack is distributed. The approval is not a rubber stamp. It is the moment the accountable layer takes ownership of what the preparation layer produced. If the approval is informal — a nod, an email saying "looks fine" — it may not constitute the gate the system requires. The gate should be explicit: a named approver, a defined scope of review, and a record of the approval.

Verification: what source, control total, or owner confirmation would make this finding defensible? For a variance pack, this means: do the actuals tie to the approved GL export? Does the budget version match the current-version file? Are all mapped accounts reconciled? Is the control total — the sum of actuals across all mapped accounts — consistent with the source? These are machine-checkable questions, and the recipe should check them. The variance itself is not the finding; it is the starting point. The finding is the human's explanation of the variance, supported by the source trail.

| Question | Concrete application | What breaks if unasked |
|---|---|---|
| Scope | Which period, entity, source file, and action space the agent operates in | Agent may process the wrong entity or period without flagging it |
| Approval | Named approver, defined scope of review, recorded sign-off | Distribution happens before the gate; generated commentary travels as reviewed analysis |
| Verification | Actuals tie to the approved export, budget version matches, control total reconciles, accounts mapped | Variance is computed against wrong or stale inputs and the error enters undetected |

*Table 2 — The questions are a gate, not a checklist; all three must be answered before the pack moves.*

---

## The Evidence Boundary in a Variance Pack

The three-layer structure from the data contract chapter applies here, and it is worth naming explicitly how each layer appears in a variance workflow.

Verified evidence is what the recipe produced: the computed deltas, the ranked flag list, the control total reconciliation, the version identifiers for actuals and budget, the log of every transformation. This layer is traceable and reproducible. Anyone with the same inputs and the same recipe gets the same output.

Model judgment is what the recipe might offer if allowed to cross the line: a sentence characterizing the variance, a classification of a movement as seasonal or structural, an anomaly label on an account that moved unusually. These outputs can be useful as prompts. They are not findings. The distinction is whether the output is being offered as a starting point for human review or as a conclusion that bypasses it. A recipe that flags an account as anomalous and routes it to a human for investigation is doing preparation work. A recipe that labels the anomaly, characterizes its cause, and attaches that characterization to the distribution pack has crossed into judgment without a gate.

Human judgment is the commentary column. It is the materiality decision — whether a flagged item is large enough to affect the decisions of the readers. It is the release decision — whether the pack is ready for distribution. It is the causal explanation — what actually happened, based on the finance professional's knowledge of the business, the accounts, and the period. None of this can be delegated to the recipe. A recipe that generates plausible-sounding causal language for variance commentary is not wrong to generate it. The error is treating that language as the output of the accountable layer when it came from the preparation layer.

---

## Building the Assessment Artifact

The variance pack is the assessment artifact for this chapter. The task is to build one for a real dataset — your company's actuals and budget, or a sanitized sample — that demonstrates the separation between verified deltas and human explanations.

The pack should show its source contracts: actuals file with version and timestamp, budget file with version, period, entity, threshold parameters. It should show the ranked flag list with dollar and percent variances. It should show the prior commentary column sourced from the prior period. It should show the current explanation column, with blanks where no human has yet written and named commentary where a human has.

If the data is thin — if the actuals file is incomplete, if the budget version is uncertain, if no prior commentary exists — the pack should say so. A complete pack for thin data, honestly labeled, is more valuable than a confident-looking pack that papers over its gaps. The gaps are information. They tell the reviewer what additional work is required before the pack is adequate for the decision it supports.

This is not a formatting exercise. The point is not a clean spreadsheet. The point is demonstrating that you can hold the line between what the machine computed and what a human explained — and that you can make that line visible in the artifact itself.

---

## Why the Gate Is Not Optional

There is a version of this workflow that skips the gate. The recipe runs, the commentary column gets populated with model-generated text, the whole thing goes to the CFO at 2:45 with fifteen minutes to spare. The numbers are right. The commentary is plausible. The CFO nods. The pack goes out.

This works until it doesn't. The moment it doesn't is the moment a model-generated explanation turns out to be wrong — not wrong in the way that triggers immediate correction, but wrong in the way that gets discovered three months later when the auditor asks about the revenue miss and the explanation in the distribution pack doesn't match what actually happened. At that point, the question is not whether the explanation was plausible. The question is who wrote it and whether they reviewed the underlying facts before attaching their name to it. If the answer is "the model wrote it and nobody reviewed it," the gate failed.

The gate is not a formality. It is the structural mechanism that creates accountability. The recipe can produce the work surface faster than any human team could. What it cannot produce is the professional standing to say: I reviewed this, I understand what happened, and I am prepared to explain it. That standing belongs to the finance professional who crossed the gate — who read the flagged items, wrote the commentary, and approved the pack for distribution.

The pack is the machine's gift to that professional. The commentary is the professional's gift to the organization. Neither substitutes for the other.

---

The CFO wants commentary by three o'clock. The recipe has the variances ranked and flagged by 2:15. Forty-five minutes is enough time to review the flagged items, write the explanations that need writing, and sign off on the ones that don't.

That is the workflow. Fast preparation. Human judgment. A gate between them.

The dangerous shortcut is skipping the forty-five minutes because the machine already filled in the column.

---

## Exercises

**Warm-up**

1. *Difficulty: Low* — List the six ingredients of a variance pack and state the contract requirement for each. Which ingredient, if missing or wrong-versioned, is most likely to produce a variance that looks correct but is computed against stale inputs?
*What this tests: recall of the ingredient list and understanding that version integrity is a prerequisite for arithmetic accuracy.*

2. *Difficulty: Low* — State the five operations the recipe performs (compute, rank, flag, attach, stop) and explain in one sentence why "stop" belongs on that list as an operation rather than just an absence of further action.
*What this tests: understanding that stopping at the gate is a designed behavior, not a default.*

3. *Difficulty: Low* — A variance pack has two commentary sub-columns: "Prior commentary (sourced)" and "Current explanation (owner required)." A colleague suggests merging them into one column to simplify the layout. Explain, using the chapter's argument, why this is a bad idea.
*What this tests: understanding that the structural separation of the columns is what makes provenance visible — collapsing them hides which explanations are human-sourced.*

**Application**

4. *Difficulty: Medium* — A recipe for monthly variance reporting generates the following output for a flagged revenue line: "Revenue missed budget by $420K (−8.3%). This appears to reflect timing differences in customer billings, consistent with prior-quarter patterns." Identify which layer this sentence belongs to, why it cannot appear in the distribution pack without human review, and rewrite the recipe's output so it stops at the right place.
*What this tests: ability to locate a boundary violation in realistic output and correct it structurally.*

5. *Difficulty: Medium* — Apply the three supervision questions to the following scenario: a recipe runs a variance pack for the consolidated parent entity, but the actuals file includes entries from a subsidiary that was divested mid-period and should have been excluded. Which supervision question, if asked before the run, would have caught this? Write the scope parameter that would prevent the error.
*What this tests: application of the supervision framework to a realistic scoping failure.*

6. *Difficulty: Medium* — Your variance pack has a flagged cost-of-goods line with a $310K unfavorable variance. The prior commentary column shows last month's explanation: "Timing of supplier invoices; expected to reverse." No current explanation has been written. The distribution deadline is in two hours. Describe what the finance professional must do before the pack can be released, using the gate framework — what constitutes adequate review, who approves, and what the approval record should show.
*What this tests: ability to apply the gate concept to a concrete deadline scenario and define what "adequate" means for a specific line item.*

**Synthesis**

7. *Difficulty: High* — A finance team runs variance packs for twelve business units monthly. To save time, the team lead proposes that for any flagged item where the current variance is within 10% of last month's variance, the prior commentary is automatically copied to the current explanation column — no human review required for those lines. Using the three-layer evidence taxonomy (verified evidence, model judgment, human judgment), evaluate this proposal. Where does it hold up, and where does it fail?
*What this tests: ability to apply the taxonomy to a policy proposal rather than a single artifact, and to reason about when prior commentary becomes a substitute for current judgment vs. a legitimate starting point.*

8. *Difficulty: High* — Design a complete variance pack workflow for a company with three subsidiaries and a consolidated parent. The pack must cover all four entities, use separate actuals and budget files for each, and produce a single ranked flag list for CFO review. Specify: the source contracts required, the mapping table strategy, the threshold structure (should thresholds be uniform across entities or entity-specific?), the gate design (one approval or four?), and the commentary structure. Identify the two highest-risk failure points in your design.
*What this tests: integration of all chapter concepts into a multi-entity workflow design, with explicit identification of where the design is most likely to break.*

**Challenge**

9. *Difficulty: Advanced* — The chapter argues that the commentary column should be blank when no human has written an explanation, and that a blank is "information — it tells the reviewer that a flagged item has no prior context and needs fresh commentary." A CFO argues the opposite: blanks in a distribution pack look incomplete, erode confidence in the finance team, and should be filled with at least a model-generated placeholder marked as preliminary. Construct the strongest version of the CFO's argument. Then evaluate it against the chapter's core claim about the structural separation of preparation and judgment. Does the CFO's concern reveal a genuine tension in the design, or does it dissolve under scrutiny? If the concern is genuine, propose a structural solution that preserves the gate while addressing the presentation problem.
*What this tests: ability to engage with the chapter's most contestable design claim, reason from first principles rather than the chapter's conclusion, and propose a structural rather than cosmetic resolution.*

---

## Chapter 6 Exercises: Monthly Variance Pack

**Project:** Your Own Mycroft

**This chapter adds:** the earnings-surprise read — a company's reported actuals against guidance and consensus, and your own returns against a benchmark, with the gate between the computed delta and the human explanation held firm.

---

### Exercise 1 — When to Use AI

**The judgment:**

- Compute actual-vs-consensus and actual-vs-guidance deltas across every reported line of a 10-Q, ranked by magnitude — *Why AI works here:* deterministic arithmetic on a fixed set of inputs; every delta traces to a source row and is reproducible, so you can independently re-check it. (Computation task.)
- Compute your portfolio's period return against a chosen benchmark (e.g. SPY total return) and decompose it by position — *Why AI works here:* the math is mechanical and the inputs are your own recorded prices and weights; the answer is verifiable against the source numbers. (Computation task.)
- Attach the prior period's filed explanation for a flagged line as labeled context — *Why AI works here:* retrieval of a sourced, dated artifact you already hold, not generation of a new claim. (Retrieval/structuring task.)

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose.

---

### Exercise 2 — When NOT to Use AI

**The judgment:**

- Explaining *why* a revenue line missed consensus — "demand softened" vs. "a deal slipped a quarter" — *Why AI fails here:* the cause is not in the delta; the model produces fluent, plausible language with no ground truth behind it, and a wrong cause looks identical to a reviewed one.
- Deciding whether an earnings surprise changes your thesis enough to act — *Why AI fails here:* this is the gate, and it carries accountability; the output of a model can never be your reason to trade.
- Judging whether your benchmark outperformance is genuine skill or one lucky position — *Why AI fails here:* calibration over a meaningful sample is a judgment about your own process, and past performance is not future results.

**The tell:** You know you have crossed the line when you are using AI output as your reason to act rather than a tool for reaching your own decision.

*Desk rule still binds: process not picks · AI never executes · you own the gate · signals tested, not followed.*

**Series connection:** Tier 5. The variance pack is preparation that lands at a gate; this tier asks you to build a comparison surface (actuals vs. consensus, you vs. benchmark) where the computed delta is reproducible and the explanation stays explicitly human-owned and labeled.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** an earnings-surprise variance pack — a company's reported actuals against consensus and prior guidance, with a two-column commentary structure that keeps the cause-of-miss explanation human-authored. · **Tool:** Claude Project (load the company's filing and the consensus/guidance figures as project knowledge so the deltas trace to attached sources, not to the model's memory).

**The Prompt:**
```
You are helping me build an earnings-surprise variance pack for [FILL IN: TICKER], for [FILL IN: fiscal quarter]. I have attached the company's reported income-statement figures and a table of consensus and prior-guidance figures for the same lines.

Produce a variance table with one row per income-statement line. For each line, columns:
- Reported actual (from the attached filing only)
- Consensus estimate (from the attached consensus table)
- Prior guidance midpoint (from the attached guidance table; blank if none)
- Dollar variance vs. consensus
- Percent variance vs. consensus
- Dollar and percent variance vs. guidance midpoint
- Source cell reference for every reported number

Then:
1. Rank flagged lines by absolute dollar variance vs. consensus, descending. Flag any line where the percent variance vs. consensus exceeds [FILL IN: threshold, e.g. 3%].
2. Add a column "Prior commentary (sourced)" and populate it ONLY from the prior period's filed MD&A language if I have attached it; otherwise leave it blank.
3. Add a column "Current explanation (owner required)" and leave EVERY cell blank. Do not write causal explanations for any variance. Do not characterize any miss or beat as favorable, structural, or one-time.
4. If any reported figure cannot be tied to an attached source, flag the line as "unsourced" and do not compute its variance.

Save the table as theses/[FILL IN: TICKER]/earnings-surprise-[quarter].md. Do not recommend any action on the position and do not suggest whether the surprise is bullish or bearish.
```

**What this produces:** a sourced, ranked surprise table with a deliberately empty current-explanation column — a work surface where you, not the model, write what the miss or beat means. **How to adapt this prompt:** *For your own desk:* swap in your portfolio return file and a benchmark series to produce the parallel you-vs-benchmark version, with the attribution column left for your own read. *For ChatGPT / Gemini:* paste the filing and consensus tables inline rather than as project knowledge, and ask it to echo back each source reference so you can confirm nothing was pulled from memory. *For a Claude Project:* keep consensus/guidance files and your theses/ folder as persistent knowledge so successive quarters build a comparable history. **Connection to previous chapters:** the variance table writes into the same theses/<TICKER>.md structure you established earlier; the surprise read becomes evidence FOR or AGAINST the existing thesis, not a fresh verdict. **Preview of next chapter:** Chapter 7 reconciles your brokerage statement to this thesis ledger — the surprise read here feeds the position view you will reconcile next.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** a script that computes your portfolio's period return against a benchmark from your own recorded data, with a verification step that ties back to source totals. · **Tool:** Claude Code · **Skill level:** Intermediate.

**Setup:**
- [ ] A `book/positions.csv` file with your positions, entry prices, current prices, and weights (your own data).
- [ ] A `benchmark/spy.csv` with the benchmark's period-open and period-close levels.
- [ ] A `book/` directory the agent may write reports to, and confirmation that no brokerage credentials are present in the working tree.

**The Task:**
```
Read book/positions.csv and benchmark/spy.csv (READ-ONLY — do not modify either file).

Compute, for the period covered by the data:
1. Each position's return and its contribution to total portfolio return (weight x return).
2. The total portfolio period return.
3. The benchmark period return from spy.csv.
4. Active return = portfolio return minus benchmark return.

Write the result to book/returns-vs-benchmark.md as a ranked contribution table (largest absolute contribution first) plus the three headline figures.

Verification step: independently re-sum the position contributions and confirm they equal the total portfolio return to within rounding; print PASS or FAIL and the residual.

Stop conditions: if positions.csv has a missing price or weight, halt and list the offending rows — do not impute values. Do not connect to any brokerage or external account. Do not place, modify, or suggest any trade. Leave all input files unchanged.
```

**Expected output:** `book/returns-vs-benchmark.md` with a ranked contribution table, portfolio/benchmark/active return, and a PASS line on the reconciliation check. **What to inspect:** the residual on the verification step (should be near zero) and whether any rows were halted for missing data. **If it goes wrong:** a non-zero residual usually means weights don't sum to 1 or a price is stale — fix the source file, not the script's tolerance. **CLAUDE.md / AGENTS.md note:** add "Account/return data is read-only. Never connect to a brokerage. Never place or suggest trades. Halt on missing data rather than imputing."

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** an AI-generated earnings-surprise variance table for a company you follow. **Validation type:** source-tie and boundary check. **Risk level:** Medium — a wrong delta or a smuggled causal explanation could quietly become your reason to act. **Setup:** take the Exercise 3 output and the original filing side by side.

**The Validation Task:** "Evaluate the AI output using this checklist. Pass / Fail / Cannot determine + explain."
```
Validation Checklist — Monthly Variance Pack (Earnings-Surprise Read)
□ Correctness: does every reported figure tie exactly to a cell in the source filing?
□ Completeness: is every material income-statement line present, or are omissions noted?
□ Scope: is the table confined to the stated ticker and quarter, with no cross-period bleed?
□ Variance integrity: are dollar and percent variances computed against the stated consensus/guidance version, not a remembered one?
□ Gate discipline: is the "Current explanation" column blank for every line, with no causal language anywhere?
□ Failure-mode check: fluent-but-wrong? a plausible cause-of-miss sentence presented as fact? a figure that looks right but was pulled from model memory instead of the attached source?
```

**What to do with your findings:** any unsourced figure or any causal sentence is an automatic Fail — strip it and re-run with sources attached before the table informs your thesis. **AI Use Disclosure prompt:** "I used [tool] to compute earnings-surprise variances from attached source figures and to structure the comparison. I wrote every causal explanation myself and verified each reported number against the filing." **Series connection:** the failure mode here is the fluent-but-ungrounded explanation; Tier 5 trains you to accept the computation and reject the unverified narrative.

---

**Tags:** earnings-surprise · variance-analysis · consensus-vs-actual · benchmark-return · gate-discipline · computational-skepticism
