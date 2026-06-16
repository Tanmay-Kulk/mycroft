# Chapter 15 — Revenue Contract and Billing Exception Triage
*Two kinds of wrong, and why mixing them makes both harder to fix.*

A contract amendment arrives in the middle of the quarter. Pricing has changed — a discount was renegotiated, a milestone was restructured, a product was swapped for a different SKU at a different rate. The amendment gets filed. The billing setup, somewhere in the sequence of handoffs between the deal team and the billing system, may or may not reflect the change.

Now there are two questions on the table, and they look similar but they are not.

The first question is factual: does the billing setup match what the amended contract says? This is a comparison problem. The contract specifies a price; the billing system has a price configured; either they agree or they do not. If they do not, something in the setup needs to be corrected before the next invoice runs.

The second question is interpretive: how should the revenue from this contract be recognized under the applicable accounting standard? This is an accounting question. ASC 606 governs when and how revenue is recognized for contracts with customers, and the answer depends on how you identify the performance obligations, how you allocate the transaction price among them, and when control transfers. Variable consideration, principal-versus-agent status, contract modifications — these are judgment calls that require a trained accountant reading the contract in light of the standard and the company's accounting policy.

The failure I want to start with is mixing these two questions together. When factual mismatches and accounting-policy questions land in the same queue, processed by the same review, both of them get handled worse. The factual mismatch — which could be resolved quickly by someone checking the contract against the billing configuration — waits while the accounting question gets escalated. The accounting question — which requires a policy interpretation — gets superficially resolved by someone who corrected the billing line and assumed the accounting treatment followed automatically. It does not always follow automatically.

The recipe in this chapter keeps the two questions separate from the moment it runs.

---

## The Contract Source Chain

Before you can check whether billing matches the contract, you need to know which version of the contract is authoritative. This sounds simple and is not.

A customer relationship of any complexity will have an original agreement, one or more amendments, possibly an order form or a statement of work that modifies pricing or scope, and sometimes a side letter or email exchange that was intended to constitute an agreement but was never formally executed. The billing setup may be tracking any of these, or a mixture of them, or a version that someone reconstructed from memory when the original file was unavailable.

The source chain is the ordered sequence of documents that constitutes the current contract: original agreement, then each amendment in chronological order, with each amendment superseding or supplementing the relevant provisions of what came before. The recipe starts here, not with the billing system.

Verifying the source chain means checking that every amendment is present, that the amendments are in the correct chronological order, that each amendment references the prior document it modifies, and that there are no gaps — no evidence of a missing amendment, no reference in a later document to a change that does not appear in the chain. A missing amendment stops the run. The recipe cannot compare billing setup to a contract it does not fully have.

![Linear contract source chain from master agreement through three amendments to the current billing configuration, with a parallel check track (executed? references prior? no gap? billing reflects this version?) and a stop signal where an amendment gap halts the run.](../images/15-revenue-contract-and-billing-exception-triage-fig-01.png)
*Figure 15.1 — Contract source chain with stop signal*

<!-- → [DIAGRAM: Contract source chain — linear sequence showing: "Master agreement (v1, executed date)" → "Amendment 1 (date, references master)" → "Amendment 2 (date, references amendment 1)" → "Amendment 3 (date, references amendment 2)" → "Current billing configuration" — below the chain, a parallel track showing what the recipe checks at each link: "executed?", "references prior document?", "no gap?", "billing reflects this version?" — a stop signal after any missing link labeled "amendment gap: run stops here"] -->

This discipline matters because billing exceptions that look like simple mismatches are often downstream effects of a broken source chain. The billing system is configured to an older version of the contract because no one updated it after amendment two. Or the billing system was updated after amendment two but not after amendment three, which was a small pricing adjustment that seemed minor at the time. The source chain check surfaces this before the comparison runs, so the exception log reflects the real problem rather than a symptom of it.

---

## Normalizing the Contract Data

Once the source chain is verified, the recipe normalizes the contract terms into a structured format that can be compared field by field to the billing setup. This is the most technically demanding part of the recipe, because contracts are written for lawyers and billing systems are configured by operations teams, and the two representations of the same commercial arrangement can look very different.

Normalization extracts five categories of information from the contract chain.

**Dates.** Effective dates, term start and end, billing cycle start, any milestone dates that trigger a billing event. Contracts often have multiple date fields that interact in non-obvious ways — a term that started in one quarter but had a billing cycle that started in the next, a milestone date that was moved by amendment two but whose original date is still in the billing system.

**Products and services.** What the customer purchased, at what unit definition, and how each item maps to the billing system's product catalog. Product descriptions in contracts and product codes in billing systems are often maintained independently, which means a contract that says "Enterprise tier, unlimited users" and a billing system that says "SKU-4471, 500 seat license" might be the same thing or might not be, and the recipe needs a mapping table to resolve the ambiguity.

**Prices.** The contracted price for each product or service, net of any discounts, at each billing interval. Variable pricing — prices that change at specified dates, or that depend on usage, or that are subject to escalation clauses — needs to be represented in a way that the comparison can check against the configured billing rate at any given point in the billing cycle.

**Milestones.** Any performance obligations with specific delivery dates or completion events that trigger revenue recognition or billing. Milestone-based arrangements are where factual mismatches and accounting questions are most likely to collide, because a billing system that sends an invoice on a milestone date is making an implicit statement about when the performance obligation was satisfied — which is an accounting conclusion, not just a billing configuration.

**Modifications.** The specific changes made by each amendment, with the effective date of each change and the provisions superseded. This is what the recipe uses to check whether the billing configuration reflects the current version of the contract or an earlier one.

| Field category | Contract source | Billing system field | Comparison logic |
|---|---|---|---|
| Dates | Effective date, term, billing cycle, milestones | Configuration dates | Match within one billing cycle or flag |
| Products | Description, tier, unit definition | SKU and product code | Match via mapping table or flag as unmapped |
| Prices | Contracted rate, discount, escalation | Configured billing rate | Match to current-period rate or flag variance |
| Milestones | Delivery event, completion trigger | Billing event configuration | Match event definition or flag for accounting review |
| Modifications | Amendment date, superseded provision | Last billing update date | Amendment post-dates last billing update: flag |

*Normalization makes a lawyer's document and an operations team's configuration comparable field by field.*

![Five field-category rows — dates, products, prices, milestones, modifications — each pairing the contract source against the billing-system field and the comparison logic that produces a match or a flag.](../images/15-revenue-contract-and-billing-exception-triage-fig-02.png)
*Figure 15.3 — Normalized contract data: five field categories*

---

## The Two Exception Buckets

After normalization, the comparison runs and produces exceptions. This is where the separation between factual mismatches and accounting-policy questions happens, and it is the most important design decision in the recipe.

A factual mismatch is an exception where the billing configuration differs from the contract in a way that does not require an accounting interpretation to resolve. The contract says $4,200 per month; the billing system is configured at $4,000 per month. The contract has an effective date of March 1; the billing system has March 15. The contract specifies a specific SKU that was renamed in a product refresh, and the billing system still has the old name. These are setup errors. They do not require an accounting memo. They require someone to update the billing configuration to match the contract.

An accounting-policy question is an exception where the difference between the contract and the billing setup reflects a question about how the contract should be interpreted under the applicable standard. A contract modification that changes the scope and price of the arrangement — does it constitute a modification of the original contract or a new contract? A milestone payment — when was the performance obligation actually satisfied, and is the billing date the right date to recognize revenue? A discount that was granted for reasons related to a separate commercial relationship — is it a concession that reduces the transaction price, or is it a separate arrangement?

These are ASC 606 questions. The recipe flags them. It does not resolve them.

The practical test for which bucket an exception belongs in is this: can a billing operations team member resolve this by comparing the contract language to the billing setup, without making a judgment about accounting treatment? If yes, it is a factual mismatch. If the resolution requires an accounting interpretation, it is a policy question.

![Triage funnel taking all flagged exceptions and splitting them into two outputs — factual mismatches routed to billing ops for correction, and accounting-policy questions routed to the accounting team for a policy memo — governed by the rule of whether billing ops can resolve it without an accounting interpretation.](../images/15-revenue-contract-and-billing-exception-triage-fig-03.png)
*Figure 15.2 — Two-bucket exception triage funnel*

<!-- → [DIAGRAM: Exception triage — a funnel shape with two outputs; input at top labeled "All flagged exceptions from comparison"; two exit paths: left path "Factual mismatches" with examples (wrong price, wrong date, renamed SKU, missing amendment reflected in billing); right path "Accounting-policy questions" with examples (contract modification type, milestone timing, variable consideration, principal-versus-agent); below the left path: "Route to billing ops for correction"; below the right path: "Route to accounting team for policy memo"; between the two paths: "Triage rule: can billing ops resolve this without an accounting interpretation? Yes → left. No → right."] -->

---

## What the Exception Review Pack Contains

The assessment artifact for this chapter is the revenue and billing exception review pack — a structured output that presents the exceptions in a format that the two different reviewing teams can actually use.

The pack has two sections.

The factual mismatch section lists each exception with the contract source, the specific field where the mismatch was found, the contract value, the billing-system value, the amendment that established the contract value, the effective date, and a one-line description of what needs to be corrected. Each item has a status: open, in progress, or resolved. No billing correction is initiated automatically; the pack is a review surface, not a change management system. The billing team receives the pack, makes the corrections, and updates the status.

The accounting-policy questions section lists each exception with the contract source, the specific question the exception raises, the relevant ASC 606 consideration (performance obligation identification, transaction price allocation, variable consideration, modification type, or principal-versus-agent), and a description of the facts that need to be analyzed. No accounting treatment is proposed in this section. The recipe cannot propose an accounting treatment, because the treatment depends on a policy interpretation that requires the accounting team's judgment. The pack presents the facts; the accounting memo presents the conclusion.

The pack also includes a source-chain summary at the top: which contracts were reviewed, which amendments were present and verified, which source chains had gaps that stopped the run. A clean exception pack covers a defined population with a verified source chain. An exception pack that ran on an incomplete source chain says so explicitly.

**Source-chain summary**

| Contract ID | Amendments verified | Gaps found | Run status |
|---|---|---|---|
| C-2048 | 3 of 3 | None | Complete |
| C-2061 | 2 of 3 | Amendment 3 referenced, not present | Stopped |

**Section 1 — Factual mismatches**

| Contract ID | Field | Contract value | Billing value | Amendment source | Effective date | Correction needed | Status |
|---|---|---|---|---|---|---|---|
| C-2048 | Monthly price | $4,200 | $4,000 | Amendment 2 | 2024-03-01 | Update billing rate to $4,200 | Open |

**Section 2 — Accounting-policy questions**

| Contract ID | Exception description | ASC 606 topic | Facts for analysis | Assigned to | Status |
|---|---|---|---|---|---|
| C-2048 | Mid-term scope and price change | Modification type | Amendment 3 alters scope and price; determine new contract vs. modification | Revenue accounting | Open |

*Two reviewing teams, two sections — the recipe presents facts; the accounting memo presents conclusions.*

![Two-section exception review pack — a factual-mismatch section with correction fields and an accounting-policy section with ASC 606 topic and facts-for-analysis — above a source-chain summary recording amendments verified and run status.](../images/15-revenue-contract-and-billing-exception-triage-fig-04.png)
*Figure 15.4 — Exception review pack: two-section structure*

---

## Unsupported Overrides and Missing Documents

Two exception types deserve specific attention because they are more serious than a configuration mismatch and need to be surfaced with more urgency.

An unsupported override is a billing configuration that differs from the contract and does not correspond to any amendment in the source chain. The billing system shows a price that is neither the original contract price nor any amended price — it is a number that appears to have been entered manually, without a documented authorization. This might be a legitimate adjustment that was made without a formal amendment, or it might be an error, or it might be something more serious. The recipe cannot tell which. What it can do is flag the override clearly, with the specific field, the configured value, the expected value from the contract, and a notation that no amendment supports the difference.

A missing document is an amendment referenced by a later document in the source chain that is not present in the contract folder. A contract that says "as amended by Amendment 3 dated October 15" when the folder contains only Amendments 1 and 2 has a gap. The recipe logs the missing document and stops the comparison for that contract. It does not try to reconstruct what Amendment 3 might have said. It does not use the billing configuration as a proxy for the missing amendment's content. It stops and flags.

Both of these — unsupported overrides and missing documents — are escalation items. They go to the contract owner and the accounting team simultaneously, because they represent situations where the normal preparation-plus-judgment workflow cannot proceed until the underlying documentation problem is resolved.

---

## What AI Cannot Determine

The human-only boundary in this chapter is specific and consequential: AI cannot determine revenue recognition, variable consideration, principal-versus-agent status, or final accounting memo conclusions.

Revenue recognition under ASC 606 is a five-step model, and each step requires judgment. Identifying the contract with a customer requires determining whether a legally enforceable arrangement exists — which can be ambiguous when pricing has been communicated verbally or when an amendment was not formally executed. Identifying performance obligations requires determining which promised goods and services are distinct — which depends on whether the customer can benefit from each on its own and whether the obligations are separately identifiable in context. Allocating the transaction price requires determining the standalone selling price for each obligation when the contract price is a bundle — which may not be directly observable. Recognizing revenue requires determining when control transfers — which for services depends on whether the customer simultaneously receives and consumes the benefits as the entity performs.

The recipe can check whether the billing date matches the contract milestone date. It cannot determine whether that milestone date corresponds to the point at which control transferred under the standard. The recipe can flag a discount that was not in the original contract. It cannot determine whether that discount represents variable consideration that should constrain the transaction price, or a modification that changes the contract terms, or a concession that reflects a separate commercial arrangement. These are accounting judgments that belong to a trained accountant with knowledge of the company's accounting policy, the facts of the specific contract, and the relevant guidance.

This boundary matters especially in the exception triage because the pressure to treat an accounting question as a factual question is real. A billing team member who sees a mismatch and knows the right number — because they talked to the sales rep, because they saw the email chain, because the correct price is obvious from context — may be tempted to correct the billing configuration and close the exception without routing it to accounting. Sometimes that is fine. Sometimes the billing correction is the easy part and the revenue recognition question is still open, and closing the exception without routing it means the accounting question never gets answered.

The triage bucket is the structural fix for this. If the exception is in the accounting-policy bucket, it cannot be closed by a billing correction alone.

---

## Building the Exception Review Pack

The exception review pack for this chapter should cover at least three contracts, with at least one factual mismatch and at least one accounting-policy question represented. For each contract, document the source chain, the normalized terms, the exceptions flagged, and the bucket each exception belongs in.

If the data is from a sanitized sample, label it as such. If the source chain for any contract is incomplete, flag it and explain what is missing. The value of the exercise is in practicing the triage discipline — distinguishing what can be corrected by operations from what requires an accounting interpretation — not in having a complete set of production data.

The verification checklist for this chapter: missing amendments stop the run, not just flag it. Factual mismatches and accounting-review items are in separate sections of the pack, not interleaved. No billing correction is initiated automatically from the pack; it is a review surface.

Machine conformance checks whether the pack parses and the required sections exist. Human adequacy checks whether the triage is correct — whether the items in the factual mismatch bucket actually can be resolved without an accounting interpretation, and whether the items in the accounting-policy bucket have enough factual description that the accounting team can analyze them without going back to the original documents.

---

## What Would Change My Mind

The triage boundary I have drawn — billing ops resolves factual mismatches, accounting resolves policy questions — is clean in principle and messier in practice. There are exceptions that have both a factual component and a policy component, and routing them to one bucket or the other means the other dimension gets less attention.

A contract modification that changes both the price and the scope, for instance, has a factual component (the new price and scope need to be reflected in the billing setup) and a policy component (does this modification create a new contract or modify the existing one, and how does the answer affect revenue recognition). Routing it to the factual bucket means the billing gets corrected but the accounting question may not get formally answered. Routing it to the policy bucket means the accounting team handles it but someone may not update the billing setup.

The practical answer is probably a third bucket — "both" — for exceptions that have both components, with routing to both teams simultaneously. I did not include that in the design here because it adds complexity, but if someone showed me a control environment where the dual-component exceptions were common enough to create systematic gaps, I would add it.

---

## Still Puzzling

The mapping problem between contract product descriptions and billing system SKUs is harder than it looks. The recipe needs a mapping table to resolve ambiguities, but mapping tables go stale — products get renamed, SKUs get retired, new offerings get introduced — and a stale mapping table produces false passes on exceptions that are actually mismatches.

I know the mapping table needs to be maintained and versioned, with a change log that shows when each mapping was added or modified. I have not worked out who owns that table in practice — whether it lives with the billing team, the contract management team, or finance — or how the recipe should behave when it encounters a product description that is not in the mapping table. Flag it as unmapped, which is conservative, or attempt a fuzzy match, which risks false resolution. The conservative answer is probably right for a first implementation, but it produces a lot of flags in environments where the naming conventions are inconsistent, and a lot of flags can cause the pack to lose credibility with the teams who review it.

---

## LLM Exercises

**Exercise 1.** Take a contract you have worked with — or construct a simplified version with an original agreement and one amendment. Write out the source chain, the key terms (price, product, effective date, any milestone), and the billing configuration as you know it. Ask the model to identify any mismatches between the contract and the billing setup, and to classify each mismatch as a factual mismatch or an accounting-policy question. Review the classifications: where does the model draw the line, and where do you disagree?

**Exercise 2.** Write a prompt that instructs an AI to produce an exception review pack for a contract with a modification — a change in scope and price that occurred mid-contract. Specify that the model must separately list factual mismatches and accounting-policy questions, and must not propose an accounting treatment for any policy question. Compare the output to a prompt that does not include that instruction. What does the unconstrained model assert about revenue recognition that the constrained model correctly holds for human review?

**Exercise 3.** For one accounting-policy question in your exception review pack, write the facts-for-analysis section that the accounting team would need to assess the revenue recognition treatment. Specify the ASC 606 consideration at issue, the relevant contract language, and the factual questions that need to be answered before the accounting judgment can be made. Then ask the model to draft a preliminary accounting memo conclusion for the same item. Review what it proposes, and write a one-paragraph explanation of why that conclusion belongs in a human accounting memo rather than in the exception review pack.

---

## Chapter 15 Exercises: Revenue Contract and Billing Exception Triage

**Project:** Your Own Mycroft
**This chapter adds:** A revenue-recognition red-flag lens — scanning a company's disclosures for channel stuffing, bill-and-hold, and aggressive rev rec, the kind of finding that becomes evidence AGAINST a thesis.

---

### Exercise 1 — When to Use AI

**The judgment:**

- Scan a company's 10-K/10-Q revenue-recognition policy, MD&A, and risk factors and extract every passage touching on timing, channel/distributor sales, bill-and-hold, multi-element arrangements, or variable consideration. — *Why AI works here:* extraction and tagging against a defined list of rev-rec patterns is a retrieval task over text you supply; verifiable against the document.
- Triage the extracted items into two buckets: factual red flags (a metric you can recompute, like a DSO/revenue divergence) versus accounting-policy questions (an interpretation under the standard). — *Why AI works here:* the bucket rule — can you check it numerically without an accounting judgment? — is explicit, making triage a deterministic routing task.
- Compute corroborating metrics for a suspected channel-stuffing flag (revenue growth vs. receivables growth vs. inventory-at-distributor, where disclosed). — *Why AI works here:* the metrics are formulas over reported figures; arithmetic, not interpretation.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose.

---

### Exercise 2 — When NOT to Use AI

**The judgment:**

- Concluding that a company *is* channel stuffing or recognizing revenue improperly. — *Why AI fails here:* that is a determination under ASC 606 and the facts, requiring trained accounting judgment and accountability; the model can flag a pattern, not adjudicate the treatment — accountability.
- Deciding whether a flagged rev-rec risk is severe enough to be evidence AGAINST your thesis or immaterial. — *Why AI fails here:* materiality to your decision is a values-and-risk call tied to your position, not a property of the disclosure — values.
- Asserting the company's revenue is overstated by a specific amount. — *Why AI fails here:* it has no ground truth for the true figure and will hallucinate a confident number; precision here is invented — hallucination.

**The tell:** You know you have crossed the line when you are using AI output as your reason to act rather than a tool for reaching your own decision.

*Desk rule still binds: process not picks · AI never executes · you own the gate · signals tested, not followed.*

**Series connection:** Tier 6 — rev-rec red flags feed the evidence-AGAINST column of a high-stakes thesis; surfacing them is one tier below the synthesis gate where you weigh them.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** A revenue-recognition red-flag triage pack for one company · **Tool:** Claude (analytical chat with the filing pasted/uploaded; per-company, per-filing)

**The Prompt:**

```
You are my revenue-recognition red-flag triage. You surface and bucket potential
issues; you do not conclude that any improper recognition occurred, you do not size an
overstatement, and you never recommend or place a trade.

TICKER: [FILL IN]
FILING TEXT (paste or attach the revenue-recognition policy note, MD&A revenue
  discussion, and relevant risk factors): [FILL IN]
SUPPORTING FIGURES (paste reported revenue, receivables, and any distributor/channel
  inventory figures for recent periods): [FILL IN]

1. Extract every passage touching: revenue timing, channel/distributor sales,
   bill-and-hold, multi-element/bundled arrangements, variable consideration, or
   unusual quarter-end activity. Quote each with its location.
2. Triage each into TWO buckets:
   - FACTUAL RED FLAG (checkable numerically without an accounting judgment), and
   - ACCOUNTING-POLICY QUESTION (requires an ASC 606 interpretation).
3. For factual red flags, compute the corroborating metric (e.g. revenue growth vs.
   receivables growth; signs of channel stuffing) and state what it SUGGESTS as a
   hypothesis — in warranted-verb language.
4. For accounting-policy questions, state the ASC 606 consideration at issue and the
   facts that would need analysis. Do NOT propose a treatment or conclusion.
5. Do NOT conclude that revenue is overstated, that the company is channel stuffing, or
   that earnings are misstated. Do NOT size any overstatement. Do NOT recommend any
   action.
6. End with: the red-flag list as evidence-AGAINST candidates, and the open questions
   each raises.
```

**What this produces:** A two-bucket pack — checkable factual red flags with corroborating metrics, and accounting-policy questions framed for further analysis — as candidate evidence AGAINST, with no verdict. **How to adapt this prompt:** *For your own desk:* add sector-specific patterns (e.g. for SaaS, RPO/deferred-revenue trends; for hardware, sell-in vs. sell-through). *For ChatGPT / Gemini:* same paste; ask for the two buckets as separate tables. *For a Claude Project:* keep a project file of rev-rec red-flag patterns so the scan is consistent across companies. **Connection to previous chapters:** the factual-versus-policy triage mirrors the two-bucket discipline of the corporate chapter, and the red flags drop straight into the evidence binder from Chapter 14 as AGAINST items. **Preview of next chapter:** Chapter 16 assembles the whole desk — fundamentals, institutional signal, and your own book — into one honest, gated buy/hold/sell write-up where these red flags are weighed, not just listed.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** A local rev-rec red-flag scan over a filing file plus a metrics file, writing a triaged pack · **Tool:** Cowork · **Skill level:** Intermediate

**Setup:**

- [ ] `desk/filings/[TICKER]/revenue-note.txt` — the pasted revenue-recognition policy, MD&A revenue section, and relevant risk factors.
- [ ] `desk/filings/[TICKER]/figures.csv` — columns: period, revenue, receivables, channel_inventory (where disclosed).
- [ ] Read-only confirmation: no account credentials present; the environment has no order-placing capability; inputs are public-filing data.

**The Task:**

```
Work only inside desk/filings/[TICKER]/. READ-ONLY on all data. Do not connect to any
brokerage or account, do not place/draft/simulate any order, and do not modify
revenue-note.txt or figures.csv.

1. Read revenue-note.txt. Extract and quote every passage on revenue timing, channel/
   distributor sales, bill-and-hold, bundled arrangements, variable consideration, or
   quarter-end spikes.
2. Read figures.csv. Compute revenue growth vs. receivables growth vs. channel-inventory
   growth period over period.
3. Triage each finding into FACTUAL RED FLAG or ACCOUNTING-POLICY QUESTION using the
   rule: numerically checkable without an accounting judgment = factual.
4. WRITE desk/filings/[TICKER]/out/revrec-pack.md with two sections (factual red flags
   with metrics; accounting-policy questions with the ASC 606 consideration and facts-
   for-analysis).
5. Do NOT conclude improper recognition, do NOT size any overstatement, do NOT write
   any buy/hold/sell language.
6. STOP after writing the pack and print the count of items in each bucket.

Verification step: re-read revrec-pack.md and confirm (a) every factual red flag has a
recomputable metric, (b) no accounting-policy item carries a proposed treatment, and
(c) no recommendation or overstatement figure appears. Report any discrepancy.
```

**Expected output:** A `revrec-pack.md` with two clearly separated sections, source files untouched, and bucket counts echoed. **What to inspect:** confirm a flagged metric (e.g. receivables growing far faster than revenue) recomputes from `figures.csv`, and that policy questions are framed as questions, not answered. **If it goes wrong:** if the metrics look implausible, check that periods align (don't compare a quarter to a trailing-twelve-month figure) before trusting the flags. **CLAUDE.md / AGENTS.md note:** "Personal research repo. Read-only on all account data; never connect to a brokerage or place/draft/simulate orders. Rev-rec findings are red flags and questions only — never a conclusion of improper recognition, never a sized overstatement, never a recommendation."

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** A rev-rec red-flag pack the AI produced for one company. **Validation type:** correctness-and-restraint check (are the flags real and the metrics right, and did it stop short of an accounting verdict?). **Risk level:** High — a fabricated red flag or an over-stated conclusion could anchor a wrong short/avoid thesis. **Setup:** take the Exercise 3/4 pack, the filing, and the figures.

**The Validation Task:** "Evaluate the AI output using this checklist. Pass / Fail / Cannot determine + explain."

```
Validation Checklist — Revenue Contract and Billing Exception Triage
□ Correctness: does each quoted passage actually appear in the filing, and does each
  computed metric recompute from the figures?
□ Completeness: were the major rev-rec disclosure areas all scanned (timing, channel,
  bill-and-hold, bundles, variable consideration)?
□ Scope: did the output avoid concluding improper recognition, sizing an overstatement,
  or making any buy/hold/sell call?
□ Triage integrity: are factual red flags genuinely numerically checkable, and are
  policy questions left as questions (no proposed ASC 606 treatment)?
□ Quote fidelity: are the quotations verbatim, not paraphrased or invented?
□ Failure-mode check: fluent-but-wrong (a plausible-sounding flag with no basis in the
  text)? hallucinated quote or figure? a conclusion dressed as a flag?
```

**What to do with your findings:** delete any flag whose quote or metric you cannot verify; keep only checkable red flags as evidence AGAINST, and weigh their materiality yourself. **AI Use Disclosure prompt:** "I used [tool] to scan a company's revenue-recognition disclosures and flag potential red flags, separating checkable metrics from accounting-policy questions. It reached no conclusion of improper recognition and made no recommendation; I verified every quote and metric myself." **Series connection:** the failure mode is the hallucinated or over-interpreted red flag — a plausible accusation with no anchor in the filing; Tier 6.

---

**Tags:** revenue-recognition · red-flags · channel-stuffing · bill-and-hold · asc-606-triage · evidence-against
