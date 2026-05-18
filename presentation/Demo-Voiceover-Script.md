# A-CLM Demo — Loom Voiceover Script (v3)
**Format: Screen recording · Tool: Loom**
**Target: 5–5:30 minutes · ~700 words**
**Navigation: Executive Dashboard (30s) → Deal Approvals teaser → A-CLM Framework (main) → Deal Approvals detailed → AI Evals**

---
> **Before you hit record:**
> - Open `localhost:5173` — land on the Executive Dashboard (`/`)
> - Background tabs ready: `/deal-approvals`, `/aclm`, `/evals`
> - Full-screen the browser, dashboard scrolled to top
---

## [INTRO — Executive Dashboard]
*[~0:30]*

Hi, I'm Fernando Abreu — 10 years at Microsoft as a Principal Project Manager,
specialising in lead-to-order strategy, complex deal shaping,
and the delivery excellence side of the business.

*[Gesture at the dashboard]*

What you're looking at is a concept environment I built to give my idea a home —
a full-stack app, React, FastAPI, Python, SQLite, built on Claude Code.
The dashboard is just context: a realistic professional services portfolio.
The problem I want to tackle lives right here.

Let me show you what I mean.

---

## [AI DEAL APPROVALS — teaser]
*[~0:25]*

*[Click AI Deal Approvals → /deal-approvals]*

This is the AI-driven deal approvals page — the operational surface of the concept.
Tiered workflow, deal health scores, AI recommendations.
We'll come back here. For now, just take in the shape of it.

*[Pause — let it breathe]*

Now let me walk you through the thinking behind it.

---

## [A-CLM FRAMEWORK — click "A-CLM Framework →", top right]
*[~2:00]*

*[Navigate to /aclm]*

This is A-CLM — Agentic Contract Lifecycle Management.
I want to be clear: this is a concept model. It's how I think about the problem.

It's grounded in my direct experience in the deal approval process —
every stage, every friction point, every escalation I've lived through —
combined with research on where the industry is heading:
BCG, McKinsey, Accenture, the Microsoft platform roadmap,
Salesforce, Google, the frontier.

This is my interpretation of where it all converges.
Real enterprise deployment would go much deeper.
What I'm sharing is the thought process — how I'd approach this as a Technical PM.

*[Scroll to Strategic Foundation]*

**Strategic Foundation.** Six pillars grounding the model in 2026 market reality.

The ones I want to call out: Agentic AI in CLM — not rule-based workflow automation,
but agents that reason about contracts and route them autonomously.
Playbook enforcement — AI that checks every deal against approved clause standards
before it ever reaches a human. Predictive deal scoring — every deal arrives
with a risk-scored brief, not a forty-page document.

And the frontier — outcome-tied contracts, AI governance clauses, autonomous commerce.
This isn't hypothetical. It's happening now.
This model is my take on what it means for the consulting approval process.

*[Scroll to Governance Framework]*

**Governance Framework.** This is where I live professionally, and I care about it deeply.

Six tenets: empowerment tables that define who approves what at each value and risk tier.
Enterprise authorization policies. Regional business rules across Americas, EMEA, and APAC —
because what's standard in the US is not standard in Germany or Singapore.
The approval playbook. Legal compliance. And responsible AI as a design principle,
not an afterthought.

The concept: AI operates within policy, not around it.
That's non-negotiable in a regulated consulting environment.

*[Scroll to Deal Approval Process — scroll through it quickly]*

**Deal Approval Process.** Five sequential stages — I won't belabour this,
it's directional. Opportunity Approval through Deal Shaping,
Technical and Business review, Pricing and Investment, final Deal Approval.
AI-validated at every gate. In practice, each stage would need serious process work.
This is the model I'd start from.

*[Scroll to Agent Ecosystem — slow down here]*

**Agent Ecosystem.** This is the part that excites me most.

Three agents in a closed loop.
A Pipeline Agent continuously reading the opportunity funnel —
sending forward signals on deal types, complexity tiers, where bottlenecks are likely to form.
A Delivery Agent on the other side, feeding live performance metrics
back from projects that were approved and are now in delivery.
And the A-CLM Cockpit at the centre, connecting both.

The concept: approved deals shouldn't disappear from the system.
They should feed back and make the next approval smarter.
That's the closed loop I'm proposing — and that's what separates this
from a workflow tool. It's a learning system.

Now that we're grounded in the concept — let me show you what it looks like in action.

---

## [AI DEAL APPROVALS — detailed demo]
*[~1:20]*

*[Navigate back to /deal-approvals]*

*[Scroll to Tiered Workflow]*

The tier model is central to everything.
Tier 1: low-risk, standard-scope deals where the AI acts on behalf of the executive.
Tier 3: complex, high-stakes engagements where the AI's job is to prepare the human,
not replace them.

*[Scroll to a high-scoring Tier 1 or Tier 2 deal — point to the score]*

Here's a deal scoring in the high 80s.
Strong strategic alignment, clean compliance, strong delivery track record.
In my framework, this qualifies for AI-driven approval on the executive's behalf.
The policy is set. The AI executes. No one's day gets interrupted for this one.

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

Now here's the concept I want to land — and it matters to me as a PM.

How do you know the model is actually working?
How do you make sure that every feature you introduce is tied to a real gain —
not just adding complexity?

*[Point to the alignment rate]*

This is Eval 1 — Human-AI Alignment. 87.5%.
In 14 of 16 decisions, the model agreed with the human approver.
Tier 1 and 2 at 100%. Tier 3 at 78% — expected.
Complex deals are where human judgment should diverge.

*[Scroll to Score vs Delivery]*

Eval 2 is the one that matters most to me.
Does the deal score actually predict what happens in delivery?
High-scored deals — 80% delivering green. Medium — 100% amber. Low — 100% red.
The model is calling it right.

*[Step back slightly in tone — this is the conviction moment]*

This is Business Value Testing. As a PM, this is how I'd drive feature prioritisation —
every improvement to the model gets measured against a baseline.
The agents are evaluated not just on what they do, but on how well they align
with real human decision-making. That's how you build trust in an AI system.
Not by asserting it works. By proving it.

---

## [CLOSE]
*[~0:15]*

A companion presentation and this demo environment are both available
at my GitHub, at fefoabreu.me.

This is how I think. I hope it gives you a sense of what I'd bring to the role.

Thanks for watching.

---

*Total: ~700 words · ~5:15–5:30 at a natural, conversational pace*

---
### Recording tips
- Intro: 30 seconds hard cap — resist the urge to add more
- A-CLM is the main event — slow down on Strategic Foundation and Agent Ecosystem
- Deal Approval Process: scroll through it at a walking pace, don't stop on individual stages
- On the deal tiles: hover before you speak — let the visual register first
- Score vs. Delivery on Evals: pause after the three percentages, let them land
- Close: warm, direct, look at the camera — not the screen
