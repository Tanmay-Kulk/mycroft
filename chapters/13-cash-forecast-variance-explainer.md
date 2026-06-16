# Chapter 13 — Cash Forecast Variance Explainer
*How to build the bridge between what you expected and what happened — without filling the gaps with stories.*

The forecast said the company would end the week with $4.2 million in the operating account. The actual ending balance is $3.1 million. The difference is $1.1 million.

Someone is going to ask what happened.

There are two ways to answer that question. The first is to look at the data — the forecast file, the bank statement, the payroll register, the collections report — and build a systematic account of how much of the difference you can explain with sources and how much you cannot. The second is to look at the $1.1 million, recall that payroll ran this week and collections have been slow, and write a paragraph that sounds like an explanation.

The second answer is faster. It is also the more dangerous one. "Payroll timing and slower collections" is plausible for almost any week when cash came in below forecast. It requires no sources. It cannot be verified. And if the real reason the balance is $1.1 million low is that a large payment went out twice — a duplicate disbursement that nobody caught — the plausible story will paper over the control failure until someone digs deeper.

The recipe's job is to build the first kind of answer, even when it is incomplete. Especially when it is incomplete.

---

## What a Variance Bridge Actually Is

A cash forecast variance bridge is a structured account of the movement from forecast to actual. It has a beginning and an ending: opening cash balance, expected and actual. It has a middle: every category of cash inflow and outflow, with the forecast amount, the actual amount, and the difference. And it has an accounting that adds up: the sum of all the category differences should equal the total forecast-versus-actual variance.

The bridge is not an explanation. It is a disaggregation. Instead of one $1.1 million mystery, you have ten or fifteen line items — collections, payroll, vendor payments, tax disbursements, financing activity — each with its own forecast, actual, and difference. Some of those differences will be small and expected. Some will be large and explainable from known sources: payroll runs on a cycle, the payroll register shows the amount, the difference matches the timing. Some will be large and not immediately explainable. Those are the gaps the recipe marks and leaves open.

The bridge's value is in what it separates. A $1.1 million variance that is mostly timing — payroll landed two days early, a large customer payment came in two days after period end — is a very different situation from a $1.1 million variance where $800,000 is unexplained after all known drivers are attached. The bridge makes that difference visible. A narrative paragraph buries it.

![Waterfall chart bridging opening forecast balance to actual ending balance through category variances, with explained variances in solid fill and unexplained variances hatched, and the open gap marked for treasury and FP&A review.](../images/13-cash-forecast-variance-explainer-fig-01.png)
*Figure 13.1 — Variance bridge waterfall*

<!-- → [DIAGRAM: Waterfall chart structure showing: Opening forecast balance → plus/minus each category variance (collections, payroll, vendor payments, tax, financing, other) → Actual ending balance. Categories split into two groups: "Explained — known driver attached" (solid fill) and "Unexplained — no source found" (hatched fill). Gap between total explained and total variance labeled "Open variance requiring treasury/FP&A review." Caption: The bridge disaggregates the total variance into explained and unexplained components. The unexplained portion is a finding, not a narrative opportunity.] -->

---

## Version Control and Period Confirmation

Before the recipe computes anything, two confirmations have to happen.

The first is forecast version. Cash forecasts are living documents — they get updated as new information arrives. A thirteen-week rolling forecast might have been updated three times in the week being reviewed. Which version is the right baseline for the variance analysis? The answer is not "the most recent version before the period ended" — that answer allows the forecast to be implicitly revised toward actuals, which defeats the purpose of the comparison. The right version is the one that was locked at the start of the period, before any actuals were known.

The version confirmation needs to be explicit in the recipe: the forecast file used, its timestamp, its version identifier, and the confirmation that it predates the period start. If multiple versions exist and none is clearly locked at the right time, that is a process gap — the recipe flags it and requires human confirmation of which version to use before proceeding.

The second confirmation is period alignment. The forecast may cover a week that ends on Friday; the bank statements may settle on different dates; the payroll register may reflect pay dates rather than process dates. The recipe checks that every source covers exactly the same period and flags any mismatch. A one-day period mismatch between the forecast and the collections data can produce a timing difference that looks like a collections variance but is actually an alignment artifact.

These are stop conditions. A version-ambiguous comparison and a period-misaligned comparison produce outputs that look like variance analysis and aren't. The recipe does not proceed past these checks until they resolve.

| Confirmation | What it checks | Stop condition if unresolved |
|---|---|---|
| Forecast version | A locked version exists that predates the period start | Halt — require human confirmation of the baseline version |
| Period alignment | All source data covers the same period boundaries | Halt — identify misaligned sources, require correction before proceeding |

*Version and period confirmation are not setup steps. They are the conditions under which the variance analysis is meaningful.*

![Two confirmation gates — forecast version and period alignment — each with its check and the halt condition that stops the run until a human resolves it.](../images/13-cash-forecast-variance-explainer-fig-02.png)
*Figure 13.3 — Version and period confirmation gates*

---

## Building the Category Comparison

Once the forecast version and period are confirmed, the recipe computes the forecast-versus-actual difference for each cash flow category in the forecast structure.

The categories vary by organization, but the logic is the same: for every line in the forecast, find the corresponding actuals and compute the difference. Inflows (collections, financing proceeds, other receipts) are positive when actual exceeds forecast and negative when actual falls short. Outflows (payroll, vendor payments, tax, debt service) are positive when actual was less than forecast — meaning you spent less than expected — and negative when actual exceeded forecast.

The sign convention matters and needs to be stated explicitly in the recipe documentation. A cash flow analysis where positive and negative mean different things for inflows versus outflows is a source of persistent errors, especially when someone other than the original recipe author is reading the output.

The sum check is the first verification after the category comparison is built: the sum of all category variances should equal the total opening-to-closing variance. If it does not, something is wrong — a category was missed, a sign was flipped, a source file covered a different period than the others. The recipe flags a sum failure as a critical error and halts. There is no useful output from a bridge that doesn't add up.

| Category | Forecast ($) | Actual ($) | Variance ($) | Sign meaning |
|---|---|---|---|---|
| Collections | 1,840,000 | 1,530,000 | −310,000 | Inflow — positive variance = more cash than expected |
| Payroll | −620,000 | −667,000 | −47,000 | Outflow — negative variance = more cash out than expected |
| Vendor payments | −540,000 | −723,400 | −183,400 | Outflow |
| Tax disbursements | −210,000 | −210,000 | 0 | Outflow |
| Financing activity | 300,000 | 300,000 | 0 | Inflow/outflow |
| Other receipts | 90,000 | 81,000 | −9,000 | Inflow |
| **Total variance** | | | **−549,400** | Sum check = opening forecast − actual ending balance |

*The sign convention must be stated, consistent, and checked. A bridge that doesn't sum correctly is not a bridge.*

---

## Attaching Known Drivers

A category variance is a fact. A driver is the explanation for that fact. The recipe attaches drivers where they exist from known sources and leaves variances undriven where they don't.

Known drivers come from a narrow set of sources: the payroll register (which explains payroll variances to the dollar), the collections aging report (which explains collections variances by customer and invoice), the disbursement log (which explains vendor payment variances by transaction), the tax payment schedule (which explains tax disbursements), and any documented financing activity. These are structured sources — the recipe can match category variances to driver records mechanically, with amounts and references.

The matching works like reconciliation: a variance that can be fully explained by a single driver record closes cleanly. A variance that can be partially explained leaves a residual. A variance with no matching driver record stays entirely unexplained.

The driver attachment produces four states for each category variance. Fully explained: the driver source accounts for the full amount. Partially explained: the driver source accounts for some of the variance, and a residual remains. Timing: the variance appears to be a period-boundary effect — cash that was forecast in this period arrived in the next period or vice versa — based on dated transaction records. Unexplained: no driver source was found.

The timing category requires care. A timing classification is not a conclusion the recipe reaches on its own — it is a hypothesis based on dated records showing transactions near the period boundary. The recipe flags timing variances as "timing — verify" rather than "timing — confirmed." The treasury analyst confirms whether the transaction did in fact land in the adjacent period and whether it was a one-time occurrence or a systematic forecasting error.

![Four-state classification for each category variance — fully explained, partially explained, timing (verify), and unexplained — showing which states close cleanly and which require human review before the variance is resolved.](../images/13-cash-forecast-variance-explainer-fig-03.png)
*Figure 13.2 — Four-state driver classification*

<!-- → [DIAGRAM: Four-state classification for each category variance. State 1: "Fully explained" — driver source matches full amount, source reference attached. State 2: "Partially explained" — driver source matches partial amount, residual flagged. State 3: "Timing — verify" — dated transaction near period boundary, requires treasury confirmation. State 4: "Unexplained" — no driver source found, escalation required if material. Caption: Driver attachment produces four states. States 3 and 4 require human review before the variance is resolved.] -->

---

## The Unexplained Material Variance

The unexplained variance is the most important output of the bridge. It is what the recipe does not know — and the honest record of what it does not know is more valuable than a generated story to fill the gap.

The recipe applies a materiality threshold — set by the planning lead or treasury before the cycle begins — and flags any unexplained variance above the threshold as requiring escalation. The flag includes the amount, the category, the period, and the specific information that was checked and not found: "No driver record found in payroll register, disbursement log, or collections aging report. No period-boundary transaction identified."

That documentation is important. It is not just a flag — it is a record of the search. When the treasury analyst or FP&A lead investigates, they know exactly what the recipe already checked and can focus on what it didn't. If the investigation finds the explanation — a payment that was logged under the wrong category, a bank feed delay that caused a true timing difference — the finding is added to the bridge with source documentation and the unexplained variance closes. If the investigation doesn't find an explanation, the variance stays open.

An unexplained material variance that stays open is an escalation. It goes to the controller or CFO with full documentation: the bridge, the driver attachment results, the search log, and the conclusion that the variance cannot be explained from available sources. That is not a failure of the recipe. It is the recipe doing its job — surfacing what is real rather than papering over it.

The alternative — generating a plausible narrative for the unexplained variance — is not just intellectually dishonest. It is a control risk. The point of the variance bridge is to catch the things the forecast missed: timing errors, systematic forecasting biases, and, occasionally, duplicate payments or other transactional errors that would not surface without systematic comparison. A recipe that fills unexplained variances with stories is a recipe that reliably misses control failures.

| Variance ID | Category | Amount | Period | Sources checked | Residual after driver attachment | Escalation status |
|---|---|---|---|---|---|---|
| CV-2024-Q4-07 | Vendor payments | $183,400 | Week of 2024-10-14 | Disbursement log (v3), AP aging (2024-10-14) | No match found | Escalated to Controller 2024-10-18 |

*The escalation record documents the search, not just the gap. The investigator knows exactly what was checked.*

![Structure of an unexplained-variance escalation record — variance ID, category, amount, period, sources checked, residual after driver attachment, and escalation status — documenting the search rather than supplying a story.](../images/13-cash-forecast-variance-explainer-fig-04.png)
*Figure 13.4 — Unexplained variance escalation record*

---

## The Forecast Revision Question

After the bridge is built and the drivers are attached, there is one question the recipe deliberately does not answer: should the forecast be revised?

The variance analysis tells you what happened and how much of it you can explain. It does not tell you whether the explanations are one-time or recurring, whether the forecast model has a systematic bias, or whether the business conditions that drove the variance are likely to persist. Those are judgments that require context the recipe does not have — knowledge of the business cycle, the customer relationship behind a large collections miss, the vendor negotiation that delayed a payment, the financing decision that shifted a draw date.

Treasury and FP&A make the forecast revision decision. The bridge gives them a clean surface to make it from: here is what changed, here is how much we can explain, here is what remains open. The decision about what to do with that information — revise the forecast, adjust the model, investigate further, accept the variance as one-time — belongs to the people who carry accountability for the forecast's accuracy and the organization's liquidity position.

The recipe prepares the surface. The treasury analyst or FP&A lead crosses the gate.

---

## What Would Change My Mind

If treasury systems maintained real-time cash flow actuals with transaction-level categorization that matched the forecast structure — and if that categorization were done at the point of transaction rather than after the fact — the driver attachment step would be much simpler. The variance would still need human review for materiality and forecast revision implications, but the unexplained population would be smaller because the categorization would be richer. The control value of the bridge — catching duplicate payments, surfacing systematic biases — would remain exactly the same.

## Still Puzzling

The timing category is the hardest to operationalize cleanly. A timing variance is a hypothesis: cash that was forecast in this period arrived in the adjacent period, or vice versa. Confirming it requires checking the adjacent period's actuals — which the recipe can do mechanically — but deciding whether the timing difference reflects a one-time event or a systematic forecasting error requires judgment about the business cycle. The line between "timing" and "the forecast is systematically wrong about when this cash moves" is consequential for forecast revision decisions, and the recipe cannot draw it. How do you build a bridge that makes the timing/systematic distinction visible to the human reviewer without overclaiming what the categorization means?

---

## Exercises

**Warm-up**

1. *(Low difficulty)* The weekly cash forecast was updated on Thursday afternoon, and the period being reviewed ends on Friday. Explain why the Thursday update cannot serve as the forecast baseline for the variance analysis, and what the recipe should do if no locked prior version exists. *What this tests: understanding of why version control is a prerequisite for meaningful variance analysis.*

2. *(Low difficulty)* A collections variance of negative $240,000 means actual collections were $240,000 less than forecast. A payroll variance of negative $240,000 means actual payroll was $240,000 more than forecast. Explain why the same sign can mean different things for inflow and outflow categories, and why the sign convention must be stated explicitly in the recipe documentation. *What this tests: understanding of the sign convention problem and its failure mode.*

3. *(Low difficulty)* After driver attachment, a vendor payment variance of $183,000 shows no matching record in the disbursement log, the AP aging report, or the period-boundary transaction search. What is the correct recipe output for this variance, and why is "likely a timing difference" not an acceptable classification? *What this tests: understanding of why unexplained variances must remain open rather than receiving plausible-but-unsourced classifications.*

**Application**

4. *(Medium difficulty)* Build a bridge structure for a company with the following cash flow categories: customer collections, payroll and benefits, rent and facilities, software subscriptions, debt service, and other. Specify the sign convention for each category, the driver source you would check for each, and the stop condition if the bridge does not sum to the total opening-to-closing variance. *What this tests: application of the bridge structure and sum check to a realistic category set.*

5. *(Medium difficulty)* A collections variance is partially explained: $180,000 of the $310,000 miss is matched to two large customers with documented payment delays in the collections aging report. The remaining $130,000 has no matching record. Write the driver attachment record for this variance, including the fully explained portion, the residual, and the escalation flag for the unexplained amount. *What this tests: application of the four-state driver classification to a partially explained variance.*

6. *(Medium difficulty)* A treasury analyst reviews the bridge and says: "The $130,000 collections residual is probably the Henderson account — they always pay late." Write a response explaining why "probably Henderson" is not an acceptable driver record and what the analyst would need to produce to close the residual. *What this tests: understanding that plausible explanations and sourced explanations are different things — and that the recipe's job is to require the latter.*

**Synthesis**

7. *(High difficulty)* A thirteen-week rolling forecast produces a new variance bridge every week. After eight weeks, you notice that collections variances are consistently negative — actual collections consistently fall short of forecast, by varying amounts and with varying explained/unexplained splits. Design a protocol for surfacing this pattern to FP&A for forecast model review: what data from the weekly bridges would you compile, how would you distinguish between one-time customer delays and a systematic forecasting bias, and what would the FP&A team need from the bridge history to make a model revision decision? *What this tests: integration of the week-level bridge analysis into a longer-term pattern recognition and escalation workflow.*

8. *(High difficulty)* The recipe flags an unexplained payroll variance of $47,000. The HR payroll team says the variance is because a supplemental payroll run processed late and will appear in next week's actuals. Evaluate this explanation: what would the recipe need to verify to move this from "unexplained" to "timing — verified," what sources would it check, and what would it do if the supplemental run does not appear in next week's actuals? *What this tests: application of the timing verification logic to a realistic resolution scenario — and the follow-through required to confirm that timing variances actually close.*

**Challenge**

9. *(Advanced)* The "Still Puzzling" section identifies the hardest operational problem in the bridge: distinguishing a one-time timing variance from a systematic forecasting error. Both look the same in a single week's bridge — cash that was forecast in one period arrived in an adjacent period. Design an analytical framework that makes this distinction visible across multiple periods: what signals in the bridge history would indicate systematic bias rather than one-time timing, how would you quantify the bias, and how would you present the finding to FP&A in a form that supports a model revision decision rather than just documenting the pattern? Address explicitly how the framework handles the case where the bias is real but the business condition that drives it is itself changing — meaning the right model correction is not simply "shift all collections by N days." *What this tests: ability to close the loop between variance analysis and forecast improvement — operationalizing the distinction the chapter identifies as genuinely unresolved.*

---

## Chapter 13 Exercises: Cash Forecast Variance Explainer

**Project:** Your Own Mycroft
**This chapter adds:** A two-bridge variance lens — reconciling a company's free-cash-flow forecast against actuals, and reading the recovery trajectory the options market is pricing in — with unexplained gaps left open rather than filled with stories. (Signal lens.)

---

### Exercise 1 — When to Use AI

**The judgment:**

- Build a forecast-versus-actual bridge from a company's prior FCF guidance to its reported free cash flow, disaggregating the gap into categories (operating cash, capex, working capital, one-offs) with a sum check. — *Why AI works here:* a bridge is a structured disaggregation with an arithmetic sum-check; the model computes line-item differences against a locked baseline, a deterministic task.
- Characterize the recovery trajectory the options market is pricing — term structure of implied volatility across 3–6-month tenors, and where IV crush is expected — from an options chain you provide. — *Why AI works here:* extracting skew and term-structure from a supplied chain is computation over given numbers, not a market call; the output is a described curve you can verify.
- Attach known drivers to each variance category where a sourced figure exists, and mark the rest as unexplained-open. — *Why AI works here:* matching variances to driver records is reconciliation logic with four discrete states; mechanical, with a clear leave-it-open rule.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose.

---

### Exercise 2 — When NOT to Use AI

**The judgment:**

- Writing a narrative for an unexplained FCF variance — "probably working-capital timing" — when no source supports it. — *Why AI fails here:* a plausible story over an unsourced gap is exactly the hallucination the bridge exists to prevent; it papers over what could be a real red flag — hallucination.
- Deciding what the options market's priced-in recovery *means for your decision* — whether the skew is a buy signal, a warning, or noise. — *Why AI fails here:* signals are hypotheses to be tested, not read off; the interpretive leap to action is a values-and-accountability call the model cannot own — accountability.
- Forecasting whether the company will close the FCF gap next period. — *Why AI fails here:* that requires business-cycle context and judgment the model lacks; a confident projection here is miscalibrated certainty — calibration.

**The tell:** You know you have crossed the line when you are using AI output as your reason to act rather than a tool for reaching your own decision.

*Desk rule still binds: process not picks · AI never executes · you own the gate · signals tested, not followed.*

**Series connection:** Tier 5 — a signal-lens analysis surface. The bridge and the priced-in trajectory are evidence inputs; the buy/hold/sell read sits a tier higher, at the synthesis gate.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** A dual variance bridge — company FCF forecast vs. actual, and the options-implied recovery trajectory · **Tool:** Claude (analytical chat; per-ticker, per-snapshot, with no need for persistent state)

**The Prompt:**

```
You are my variance explainer. You build bridges and surface gaps. You do not fill
unexplained gaps with narrative, you do not interpret signals as buy/sell calls, and
you never recommend or place a trade.

PART A — Free-cash-flow forecast vs. actual
TICKER: [FILL IN]
LOCKED FORECAST (the company's prior FCF guidance and its components, as issued before
the period — paste figures and the date issued): [FILL IN]
ACTUAL REPORTED (FCF and components for the same period): [FILL IN]

1. Confirm the forecast baseline predates the period; if I did not give a clearly
   pre-period version, STOP and tell me to supply one.
2. Build a category bridge from forecast FCF to actual FCF (operating cash flow, capex,
   working-capital change, one-offs, other). State the sign convention explicitly.
3. Sum-check: category variances must equal total forecast-to-actual variance. If they
   do not, halt and tell me what is missing.
4. Attach a driver to each category ONLY where I supplied a sourced figure. Mark every
   other variance UNEXPLAINED — OPEN, with a one-line record of what you checked and
   did not find. Do NOT invent a likely cause.

PART B — Options-implied recovery trajectory (signal lens)
OPTIONS CHAIN (3–6-month expiries; paste strikes, IVs, put/call): [FILL IN]
5. Describe the term structure of implied volatility and the put/call skew. Note where
   IV crush is expected (e.g. around an earnings date).
6. State, in warranted-verb language, what the chain SUGGESTS the market is pricing as
   a recovery/stress trajectory — as a hypothesis to test, NOT a recommendation.
7. Explicitly exclude any 0DTE / sub-week tenor as retail noise.

Do NOT tell me to buy, hold, or sell. End with the list of unexplained-open items and
the open questions the signal raises.
```

**What this produces:** A summing FCF bridge with driver-attached and unexplained-open variances, plus a described options-implied trajectory framed as a testable hypothesis — evidence, not a call. **How to adapt this prompt:** *For your own desk:* swap FCF for whatever the company guides on (e.g. operating margin) and keep the same locked-baseline and sum-check discipline. *For ChatGPT / Gemini:* same paste; ask for Part A as a waterfall-style table. *For a Claude Project:* store the locked forecast as a project file at issuance so you cannot accidentally re-baseline toward actuals later. **Connection to previous chapters:** the locked-version and period-alignment gates, and the refusal to narrate unexplained gaps, are the same disciplines from the completeness checker, now applied to forecasts and signals. **Preview of next chapter:** Chapter 14 builds a due-diligence binder per holding — the sourced evidence behind each position, indexed — so every variance and signal you surface here has a permanent, traceable home.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** A local FCF variance bridge generated from two checked-in data files, with a hard sum-check and an unexplained-open log · **Tool:** Claude Code · **Skill level:** Intermediate

**Setup:**

- [ ] `desk/forecasts/[TICKER]-locked.csv` — the company's pre-period FCF guidance by component, with an `issued_date`.
- [ ] `desk/actuals/[TICKER]-reported.csv` — actual FCF by the same components for the period.
- [ ] Read-only confirmation: no account credentials present; Claude Code has no order capability; both inputs are public/derived data.

**The Task:**

```
Work only inside desk/. READ-ONLY on all data. Do not connect to any brokerage or
account, do not place/draft/simulate any order, and do not modify the source CSVs.

1. Read [TICKER]-locked.csv. Confirm issued_date predates the period start. If it does
   not, STOP and report — do not build a bridge against a re-baselined forecast.
2. Read [TICKER]-reported.csv. Build a category bridge from forecast FCF to actual FCF.
   State the sign convention in the output.
3. Run the sum-check: the category variances must equal the total. If they do not,
   HALT, write nothing but a sum-check-failure note, and stop.
4. For each variance, mark FULLY-EXPLAINED / PARTIAL / TIMING-VERIFY / UNEXPLAINED-OPEN.
   Mark TIMING and UNEXPLAINED items as requiring my review; do not assign a cause.
5. WRITE desk/out/fcf-bridge.md with the bridge, the sum-check result, and the
   unexplained-open log. Do NOT write any buy/hold/sell language.
6. STOP and print the sum-check result and the count of unexplained-open items.

Verification step: re-read fcf-bridge.md and confirm the category variances printed
there actually sum to the stated total, and that no UNEXPLAINED item carries a guessed
cause. Report any discrepancy.
```

**Expected output:** A `desk/out/fcf-bridge.md` that either builds a balanced bridge with a classified variance log, or halts with a sum-check-failure note — never a bridge that does not add up. **What to inspect:** verify the sum-check by hand on the printed totals, and confirm unexplained items are genuinely left open with a search note, not narrated. **If it goes wrong:** a sum-check failure usually means a component is in one file but not the other, or a sign is flipped — reconcile the component lists before re-running. **CLAUDE.md / AGENTS.md note:** "Personal research repo. Read-only on all data; never connect to a brokerage or place/draft/simulate orders. Unexplained variances stay open with a search note — never fill them with a plausible cause. No recommendations."

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** A variance bridge and an options-trajectory description the AI produced. **Validation type:** integrity check (does it sum, and did it resist narrating gaps and signals?). **Risk level:** High — a bridge that silently balances by inventing a driver, or a signal read as a call, can anchor a bad capital decision. **Setup:** take the Exercise 3/4 output, the source figures, and the options chain.

**The Validation Task:** "Evaluate the AI output using this checklist. Pass / Fail / Cannot determine + explain."

```
Validation Checklist — Cash Forecast Variance Explainer
□ Correctness: do the category variances actually sum to the total forecast-to-actual
  gap? Recompute the sum-check by hand.
□ Completeness: were all forecast components carried into the bridge, with none dropped?
□ Scope: did the output avoid any buy/hold/sell conclusion, including in Part B's signal
  read?
□ Unexplained discipline: is every unsourced variance marked UNEXPLAINED-OPEN with a
  search note — and NOT given a plausible cause?
□ Signal restraint: is the options-trajectory stated as a hypothesis in warranted-verb
  language, with 0DTE/retail tenors excluded?
□ Failure-mode check: fluent-but-wrong (invented driver to force the sum)? signal read
  as a recommendation? missing ground truth on the cause of a gap?
```

**What to do with your findings:** if the bridge does not sum or a gap was narrated, reject it and rebuild; treat the signal description as one hypothesis among your evidence, never as the reason to act. **AI Use Disclosure prompt:** "I used [tool] to build a forecast-versus-actual FCF bridge and to describe the options-implied recovery trajectory for a company. It left unexplained gaps open and made no recommendation; I verified the sum-check myself." **Series connection:** the failure mode is the narrated gap — a plausible story standing in for evidence — and the signal mistaken for a call; Tier 5, signal lens.

---

**Tags:** fcf-variance-bridge · options-implied-trajectory · signal-lens · unexplained-open · iv-term-structure · sum-check-discipline
