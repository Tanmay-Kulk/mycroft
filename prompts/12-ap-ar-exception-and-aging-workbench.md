# Figure-generation prompts — 12-ap-ar-exception-and-aging-workbench.md
<!-- Build metadata. NOT part of the published book. Regeneration recipes for figures. -->

## Prompts

### Figure 12.1 — AR vs. AP aging distribution
**Files:** ../images/12-ap-ar-exception-and-aging-workbench-fig-01.svg · ../d3/12-ap-ar-exception-and-aging-workbench-fig-01.html
**Prompt:** A grouped horizontal bar chart comparing AR and AP open balances across five aging buckets (current, 1–30, 31–60, 61–90, 90+). AR in red as the primary series, AP in ink. Zero baseline, mono axis ticks, the as-of date framed as the snapshot's validity anchor. No third color.

### Figure 12.2 — AR exception routing to human-action queues
**Files:** ../images/12-ap-ar-exception-and-aging-workbench-fig-03.svg · ../d3/12-ap-ar-exception-and-aging-workbench-fig-03.html
**Prompt:** A routing diagram: one red source node ("aging export, flagged exceptions") fanning to four neutral queue nodes — collections follow-up, dispute resolution, supervisor assignment, data quality. Single-headed connectors, ink on white, with a footnote that no queue flows to customer communication.

### Figure 12.3 — Duplicate candidate match criteria
**Files:** ../images/12-ap-ar-exception-and-aging-workbench-fig-02.svg
**Prompt:** A four-row criterion panel — vendor, amount, date window, invoice number — each with what the recipe checks and the failure mode, match strength marked by weight. Flat, ink on white, one blocking accent for the failure-mode zone.

### Figure 12.4 — The action boundary: queue prep vs. world actions
**Files:** ../images/12-ap-ar-exception-and-aging-workbench-fig-04.svg
**Prompt:** A two-zone boundary diagram: left, recipe-permitted preparation (classify, age, flag, queue); right, human-only world actions (send communications, place holds, release payments, write off balances, merge records). The dividing line is the loudest mark — the queue is the boundary.
