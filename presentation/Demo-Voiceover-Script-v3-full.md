# A-CLM Demo — Loom Voiceover Script (v3)
**Format: Screen recording · Tool: Loom**
**Target: 6:00–6:30 minutes · ~920 words**
**Navigation: Executive Dashboard (30s) → Deal Approvals teaser → A-CLM Framework (main) → Business Value Cockpit → Deal Approvals detailed → AI Evals**

---
> **Before you hit record:**
> - Open `localhost:5173` — land on the Executive Dashboard (`/`)
> - Background tabs ready: `/deal-approvals`, `/aclm`, `/aclm-cockpit`, `/evals`
> - Full-screen the browser, dashboard scrolled to top
---

## [INTRO — Executive Dashboard]
*[~0:30]*

Hello and welcome to my quick demo of AI-Driven Deal Approvals.
My name is Fernando Abreu and I've spent the last 10yrs at Microsoft
working as a Principal Project Manager. I specialize in lead-to-order, complex deal shaping,
and the delivery excellence side of the MCEM model. Before Microsoft I worked as a SW engineer and Agile/PMO Practicioner back in Brasil,
then I moved to Québec to run an App Dev Practice.
I'm a girl dad, loving husband, and pet parent who enjoys Formula 1, world travel and running.
I live with my family in Richmond, VA.

*[Gesture at the dashboard]*

What you're looking at is a environment prototype based on React, Python, and SQLite that I built
on Claude Code Terminal and WisprFlow.
This executive dashboard is just for context simulating MSX,
MDM and ESXP for pipeline, contracting ande delivery purposes.
The model I created to address the problem statement lives here.

---

## [AI DEAL APPROVALS — teaser]
*[~0:25]*

*[Click AI Deal Approvals → /deal-approvals]*

This is the AI-driven deal approvals framework
where the cycle takes place: dashboard with business
OKRs/KPIs, Tiered approval workflow, deal health scores based on playbooks,
AI recommendations founded on pipeline and delivery metrics available to approvers.
For now, just take in the shape of it. We'll come back here.

*[Pause — let it breathe]*

Let me walk you through the thought process behind this engine.

---

## [A-CLM FRAMEWORK — click "A-CLM Framework →", top right]
*[~2:00]*

*[Navigate to /aclm]*

This is the Agentic Contract Lifecycle Management platform.
Quick disclaimer: this is just a concept model. It's how I've been thinking about
embracing AI to reimagine the deal approval process.

It's grounded in my experience in the field studying and educating
 stakeholders on how to navigate the process. THAT combined with research on where the industry is heading in this space:
Gartner, McKinsey&Accenture benchmark, how competitors such as
Google, and SalesForce are tackling this opportunity.

Also, this is how I'd approach this as a Technical PM to enable business readiness and
drive the Conversation with Engineering for enterprise-level deployment.

The problem I'm addressing is one I've seen first hand: thousands of approval transactions a year,
managed manually — dragging deal cycles across multiple weeks on average —
every week that a deal sits in a queue is a week of revenue not recognised, clients not achieving their outcomes.

*[Scroll to Strategic Foundation]*

**Strategic Foundation.** Six pillars grounding the model in today's market.


*[Scroll to Governance Framework]*

**Governance Framework.** 

Six tenets around empowerment tables, Authorization policies. Regional business rules, approval playbooks.
Legal compliance. And responsible AI as a design principle.


*[Scroll to Deal Approval Process — scroll through it quickly]*

I won't belabour Deal Approval Process as it's
intended to demostrate what MDM does today, oversimplifed for the purposes of this
 demo.

*[Scroll to Agent Ecosystem — slow down here]*

**Agent Ecosystem.** 

Three agents in a closed loop.
In on hand we have A Pipeline Agent sending signals on deal types, complexity tiers, where bottlenecks are likely to form.
A Delivery Agent on the other side, feeding live performance metrics
 from projects now in delivery.
the A-CLM Cockpit at the centre as an orchestrator, connecting both as a basis for the
 Business Value Testing and AI-Model evals.

The idea is: approved deals shouldn't disappear from the system.
They should feed back and make the next approval smarter.

*[Scroll down to the blue A-CLM Cockpit card — click it → /aclm-cockpit]*

---

## [BUSINESS VALUE COCKPIT — /aclm-cockpit]
*[~0:50]*

I anchored the model to the business case at hand.

*[Point to the dark baseline strip]*

Roughly 70,000 approval transactions take place each per year. Massive man-hours consumed annually.
2-3 week average deal cycle.
This is thinking the problem at scale.


*[Gesture to the two lever cards]*

In this prototype I built two levers. The first is Simplification, processes that can be decomissioned or streamlined.

The second is Acceleration — AI routing and playbook enforcement compress approving cycle driving velocity.


*[Scroll briefly to the Value Scorecard]*

The Value Scorecard tracks what that means across five dimensions:
cycle time, hours spent per transaction, rework rate, compliance exceptions,
and approval accuracy. These are the metrics the Business Value Testing framework is anchored to.

*[Gesture to the agent signal panels — Pipeline and Delivery]*

And down here — the live signals from the Pipeline and Delivery agents.
The Pipeline Agent tells you what's coming into the funnel.
The Delivery Agent tells you how approved deals are actually performing.
Together they close the loop — the model learns from reality,
not just from the data it was designed around.

Now that we've framed the business case — let me show you what it looks like in action.

---

## [AI DEAL APPROVALS — detailed demo]
*[~1:20]*

*[Navigate back to /deal-approvals]*

*[Scroll to Tiered Workflow]*

The tier model is central to everything.
Tier 1: low-risk, standard-scope deals where the AI acts on behalf of the approver.
Tier 2: AI-pre-scored and pre-approved in principle;executive confirms conditions and signs off.
Tier 3: high-stakes contracts where the agent''s job is to best prepare
executives for the approval at hand. That's the tier I focus on today.

*[Scroll to a high-scoring Tier 1 or Tier 2 deal — point to the score]*

The deal health score is weighted, each grounded in the approval playbook.
It follows the same logic a seasoned approver would, at scale.

Here are a few deals scoring in the high 80s.
It qualifies for AI-driven approval on the executive's behalf.

*[Scroll to a complex deal with APPROVE_WITH_CONDITIONS]*

Contrast that with this. Large, The AI recommendation is Approve with Conditions.
It's surfacing the three highest-risk factors, with conditions attached.
for better-informed decision.

*[Take the conditionally approved action — type a name and a brief note]*

Approve with conditions: SOX regulated environment, knowing who approved and what conditions were attached for a clean audit-ready environment.

*[Scroll to a RECOMMEND_REVIEW deal]*

And here's one the AI flags for human review.
Scope definition incomplete. No comparable reference at this scale.
The AI is saying: I don't have enough signal to call this.
A human should look at it.

Graduated autonomy. Acts where it should. Steps back where it shouldn't.

---

## [AI EVALS — click "AI Evals →", top right]
*[~1:15]*

*[Navigate to /evals]*

Finally, here's the last concept I want to land in this demo.

How do we know the model is actually working?
That's where BVT and Model Evals come to play:
Measuring the quality and predictive validity of the AI-driven approval model
 — alignment with human decisions, score calibration, and correlation between
 deal scores and actual delivery outcomes.

*[Point to the alignment rate]*

This is Eval 1 — Human-AI Alignment
In this example 14 of 16 decisions, the model agreed with the human approver.
And every time a human overrides — whether they were more lenient or more strict —
that decision is logged and feeds the next model improvement cycle.
Disagreement isn't noise. It's signal.

*[Scroll to Score vs Delivery]*

Eval 2 is the one that matters most to me.
Does the deal score actually predict what happens in delivery?
High-scored deals — 80% delivering green.
The approval model is calling it right.

*[Scroll to Score Distribution]*

Eval 3 — Score Distribution and Tier Calibration.
Are tier assignments consistent with how deals are actually scoring?
If those averages don't add up, you'd have a calibration problem.


*[Scroll to Dimension Analysis]*

Eval 4 — Finally, the Dimension Contribution Analysis.
This is how I'd drive the feature roadmap as a PM.
Each scoring dimension from the playbook health score carries a weight and a variance.
High variance means that dimension is doing the most differentiating work across deals.
The highlighted rows here are the candidates.
The model is telling you what to build next.

*[Step back slightly in tone — this is the conviction moment]*

This to me is the basis for Business Value Testing.
Every improvement to the model gets measured against a baseline.
The agents are evaluated not just on what they do, but on how well they align
with approver and executive decision-making.
The dimension with the highest variance and the largest weight is the next item on the backlog.


---

## [CLOSE]
*[~0:15]*

I hope this gives you a sense of where my heads at and what I'd bring to the role of TPM.

Thanks for watching and I look forward to our interview session.

---

*Total: ~920 words · ~6:00–6:30 at a natural, conversational pace*

---
### Recording tips
- Intro: 30 seconds hard cap — resist the urge to add more
- A-CLM is the main event — slow down on Strategic Foundation and Agent Ecosystem
- Deal Approval Process: scroll through it at a walking pace, don't stop on individual stages
- On the Business Value Cockpit: let the 70K baseline strip sit for a beat — it's a big number and it lands visually before you name it
- On the deal tiles: hover before you speak — let the visual register first
- Score vs. Delivery on Evals: pause after the three percentages, let them land
- Close: warm, direct, look at the camera — not the screen
