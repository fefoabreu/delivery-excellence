# A-CLM Demo — Loom Voiceover Script (v3)
**Format: Screen recording · Tool: Loom**
**Target: 5:30–6 minutes · ~840 words**
**Navigation: Executive Dashboard (30s) → Deal Approvals teaser → A-CLM Framework (main) → Business Value Cockpit → Deal Approvals detailed → AI Evals**

---
> **Before you hit record:**
> - Open `localhost:5173` — land on the Executive Dashboard (`/`)
> - Background tabs ready: `/deal-approvals`, `/aclm`, `/aclm-cockpit`, `/evals`
> - Full-screen the browser, dashboard scrolled to top
---

## [INTRO — Executive Dashboard]
*[~0:30]*

Hello and welcome to my quick demo of AI-Driven Deal Approvals
using an Agentic Contract Lifecycle Management framework.
My name is Fernando Abreu and I've spent the last 10yrs at Microsoft
working as a Principal Project Manager specialising in lead-to-order, complex deal shaping,
and the delivery excellence side of the MCEM model shepering executives
through the deal approval process. Before Microsoft I worked as a SW engineer and Agile/PMO Consultant back in Brasil,
then I moved to Québec to run an App Dev Practice.
I'm a girl dad, loving husband, and pet parent who enjoys Formula 1, world travel and running.
I live with my family in beautiful historic Richmond, VA.

*[Gesture at the dashboard]*

What you're looking at is a concept environment I built to give my thought process
 a home — a full-stack app based on React, FastAPI, Python, SQLite, I built
vibe coding with WisprFlow and Claude Code on Warp Terminal.
This executive dashboard is just for context simulating MSX,
MDM and ESXP for pipeline, contracting ande delivery purposes.
The model I created to address the problem statement lives here.

---

## [AI DEAL APPROVALS — teaser]
*[~0:25]*

*[Click AI Deal Approvals → /deal-approvals]*

This is the AI-driven deal approvals page — the operational surface of this framework
where the deal approval cycle takes place: dashboard with business
OKRs/KPIs, Tiered approval workflow, deal health scores based on playbooks,
with AI recommendations founded on pipeline and delivery metrics to approvers.
We'll come back here. For now, just take in the shape of it.

*[Pause — let it breathe]*

Now let me walk you through the thought process behind this engine.

---

## [A-CLM FRAMEWORK — click "A-CLM Framework →", top right]
*[~2:00]*

*[Navigate to /aclm]*

This is A-CLM — Agentic Contract Lifecycle Management platform.
I want to be clear: this is a concept model. It's how I've been thinking about
embracing AI to reimagine the deal approval process.

It's grounded in my direct experience in the field —
every stage, every friction point, every escalation I've lived through educating
 stakeholder on how to navigate the process —
combined with research on where the industry is heading in this space:
Gartner studies, McKinsey, Accenture benchmark, how competitors such
Google, AWS and SalesForce are tackling this opportunity, and the 2yr roadmap ahead.

What I'm sharing is the thought process — how I'd approach this as a Technical PM.
Real enterprise deployment would go much deeper.


*[Scroll to Strategic Foundation]*

**Strategic Foundation.** Six pillars grounding the model in today's market.

The ones I want to call out: Agentic AI in CLM — Autonomous approval routing
replacing manual workflow coordination. Playbook enforcement — AI that checks
every deal against approved clause standards, service offerings, compliance before it ever reaches a human.
Predictive deal scoring — every deal arrives with a risk-scored brief.

And the frontier — outcome-tied contracts, AI governance clauses,
autonomous commerce.


*[Scroll to Governance Framework]*

**Governance Framework.** 

Six tenets: empowerment tables that define who approves what at each value and risk tier.
Enterprise authorization policies. Regional business rules across regions —
because what's standard to approve a deal in the US is not necessarily the
case in France or Singapore.
The approval playbook. Legal compliance. And responsible AI as a design principle.


*[Scroll to Deal Approval Process — scroll through it quickly]*

**Deal Approval Process.** Five sequential stages — I won't belabour this as it's
intended to demostrate what MDM does today oversimplifed for the purposes of this
 demo, it's directional.

*[Scroll to Agent Ecosystem — slow down here]*

**Agent Ecosystem.** This is the part that excites me most.

Three agents in a closed loop.
A Pipeline Agent continuously reading the opportunity funnel —
sending forward signals on deal types, complexity tiers, where bottlenecks are likely to form.
A Delivery Agent on the other side, feeding live performance metrics
back from projects that were approved and are now in delivery.
And the A-CLM Cockpit at the centre, connecting both as a basis for the
 Business Value Testing and AI-Model evals.

The concept: approved deals shouldn't disappear from the system.
They should feed back and make the next approval smarter.

*[Scroll down to the blue A-CLM Cockpit card — click it → /aclm-cockpit]*

---

## [BUSINESS VALUE COCKPIT — /aclm-cockpit]
*[~0:50]*

And right here is where I anchored the entire model to a business case.

*[Point to the dark baseline strip]*

70,000 approval transactions per year. That's the hard anchor — the as-is baseline.
280,000 man-hours consumed annually. 18-day average deal cycle.
This is the problem at scale, in numbers.

*[Point to the cost-per-transaction input]*

The cost per transaction is configurable — you can size this to your own context.

*[Gesture to the two lever cards]*

I built two levers into the model. The first is Simplification —
not automating transactions faster, but eliminating the ones that should never exist.
Moving from 70,000 to 55,000 transactions isn't an efficiency gain,
it's a process quality gain. That's the harder, more valuable lever.

The second is Acceleration — for the transactions that remain,
AI routing and playbook enforcement compress the cycle from 18 days to 5.

*[Scroll briefly to the Value Scorecard]*

The Value Scorecard tracks what that means across five dimensions:
cycle time, hours per transaction, rework rate, compliance exceptions,
and approval accuracy. These are the metrics the BVT framework is anchored to.

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
Tier 2: medium to high complexity, AI-pre-scored and pre-approved in principle;
executive confirms conditions and signs off.
Tier 3: complex, high-stakes engagements where the AI's job is to best prepare
executives for the approval at hand. That's the job I do today.

*[Scroll to a high-scoring Tier 1 or Tier 2 deal — point to the score]*

Here are a few deals scoring in the high 80s.
Strong strategic alignment, clean compliance, strong delivery track record.
In this framework, it qualifies for AI-driven approval on the executive's behalf.
The policy is set. The AI executes. No one's day gets interrupted for these ones.

*[Scroll to a complex deal with APPROVE_WITH_CONDITIONS]*

Contrast that with this. Large engagement — multiple service lines,
vendor involvement, regulatory requirements.
The AI recommendation is Approve with Conditions.
It's surfacing the three highest-risk factors, with conditions attached.
Not saying no — handing the executive a structured brief
so they can make a faster, better-informed decision.

*[Take the conditionally approved action — type a name and a brief note]*

Approve with conditions — name, notes, logged. Full audit trail.

*[Scroll to a RECOMMEND_REVIEW deal]*

And here's one the AI flags for human review.
Scope definition incomplete. No comparable reference at this scale.
The AI is saying: I don't have enough signal to call this.
A human should look at it. That's responsible AI — knowing when to step back.

Graduated autonomy. Acts where it should. Steps back where it shouldn't.

---

## [AI EVALS — click "AI Evals →", top right]
*[~0:45]*

*[Navigate to /evals]*

Finally, here's the last concept I want to land in this demo.

How do you know the model is actually working?
How do you make sure that every feature you introduce is tied to a real gain —
not just adding complexity? Thta's where BVT and Model Evals come to play:
Measuring the quality and predictive validity of the AI-driven approval model
 — alignment with human decisions, score calibration, and correlation between
 deal scores and actual delivery outcomes.

*[Point to the alignment rate]*

This is Eval #1 — Human-AI Alignment. 88%.
In 14 of 16 decisions, the model agreed with the human approver.
Tier 1 and 2 at 100%. Tier 3 at 78% — expected.
Complex deals are where human judgment should diverge and a decision log showing
how much approvers agree with the AI recommendation to retrofeed the model.

*[Scroll to Score vs Delivery]*

Eval 2 is the one that matters most to me.
Does the deal score actually predict what happens in delivery?
High-scored deals — 80% delivering green. Medium — 100% amber. Low — 100% red.
The model is calling it right.

*[Step back slightly in tone — this is the conviction moment]*

This is Business Value Testing. As a PM, this is how I'd drive feature prioritisation —
every improvement to the model gets measured against a baseline.
The agents are evaluated not just on what they do, but on how well they align
with approvers/executives decision-making.

---

## [CLOSE]
*[~0:15]*

A companion presentation and this demo environment are both available
at my GitHub, at fefoabreu.me.

This is my take on AI-driven deal approvals.
I hope it gives you a sense of where my heads at and I'd bring to the role of TPM.

Thanks for watching.

---

*Total: ~840 words · ~5:45–6:00 at a natural, conversational pace*

---
### Recording tips
- Intro: 30 seconds hard cap — resist the urge to add more
- A-CLM is the main event — slow down on Strategic Foundation and Agent Ecosystem
- Deal Approval Process: scroll through it at a walking pace, don't stop on individual stages
- On the Business Value Cockpit: let the 70K baseline strip sit for a beat — it's a big number and it lands visually before you name it
- On the deal tiles: hover before you speak — let the visual register first
- Score vs. Delivery on Evals: pause after the three percentages, let them land
- Close: warm, direct, look at the camera — not the screen
