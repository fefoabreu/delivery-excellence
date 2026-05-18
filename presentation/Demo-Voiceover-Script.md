# A-CLM Demo — Loom Voiceover Script (v2)
**Format: Screen recording · Tool: Loom**
**Target: 5:30–6 minutes · ~780 words**
**Navigation: Executive Dashboard → AI Deal Approvals (teaser) → A-CLM Framework → AI Deal Approvals (detailed) → AI Evals**

---
> **Before you hit record:**
> - Open `localhost:5173` — you should land on the Executive Dashboard (`/`)
> - Have `/deal-approvals`, `/aclm`, and `/evals` ready as background tabs
> - Full-screen the browser
> - Scroll the Executive Dashboard to the top so the KPI cards are visible from the first frame
---

## [INTRO — Executive Dashboard, scrolled to top]
*[~1 min 10 sec]*

Hi, I'm Fernando Abreu — I've spent the last 10 years at Microsoft as a Principal Project Manager.
I started as a software engineer, moved into consulting to help customers adopt Agile practices
and PMO methodologies, and was eventually invited to build a Modern Applications
professional services practice.

My time at Microsoft has been centered on business growth and delivery excellence —
specialising in lead-to-order strategy and complex deal shaping,
helping executives shepherd the approval of Microsoft's largest consulting engagements,
all while running global programs to strengthen and streamline the process.

And that's just my side hustle. My full-time job is being a proud girl dad, loving husband,
and distinguished pet parent. Originally from Brazil, spent a chapter as a French Canadian,
and I'm now a naturalized American living in beautiful Richmond, Virginia.

*[Gesture across the dashboard]*

What you're looking at is a concept environment I built — I'm calling it Delivery Excellence.
It's a full-stack application — React, FastAPI, SQLite — that I put together as the home
for an idea I've been developing about how to reimagine the deal approval process using AI agents.

The dashboard gives you the context: a realistic professional services portfolio.
Pipeline in flight. Active delivery projects. Portfolio health at a glance.
The problem I want to tackle lives inside exactly this kind of environment.

---

## [AI DEAL APPROVALS — quick teaser]
*[~0:25]*

*[Click AI Deal Approvals in the sidebar → /deal-approvals]*

Before I walk you through the framework, let me give you a quick look at where it all lands.
This is the AI-driven deal approvals page — the operational surface of the concept.
Tier-based routing, deal health scores, AI recommendations. We'll come back here in detail.
For now, just take in the shape of it.

*[Let it breathe for a beat — don't narrate every element]*

Now — let me walk you through the thinking behind it.

---

## [A-CLM FRAMEWORK — click "A-CLM Framework →" button, top right]
*[~1 min 25 sec]*

*[Navigate to /aclm]*

This is A-CLM — Agentic Contract Lifecycle Management. And I want to be upfront:
this is a concept model. It's how I think about the problem, not a production blueprint.

It's grounded in my decade of direct experience in the deal approval process at Microsoft —
every stage, every friction point, every escalation I've lived through.
Combined with research I did on where the industry is moving —
BCG, McKinsey, Accenture, the Microsoft platform roadmap,
where Salesforce and Google are placing their bets.

This is my interpretation of where all of that converges — and my take on what it
could mean for the consulting deal approval process. Enterprise implementation
would require much deeper process engineering and technical input.
What I'm sharing here is the direction.

*[Scroll to Strategic Foundation]*

The **Strategic Foundation** gives the concept its intellectual grounding —
six pillars covering agentic AI routing, playbook enforcement, predictive deal scoring,
the enterprise tech layer, industry benchmarks, and the frontier.
The frontier matters to me — outcome-tied contracts, AI governance clauses, autonomous commerce.
It's not hypothetical. It's happening. This model is my take on what it means for deal approvals.

*[Scroll to Governance Framework]*

The **Governance Framework** is where I've spent a lot of my thinking,
because I've seen what happens when AI skips this part.
Empowerment tables, authorization policies, regional rules across Americas, EMEA, and APAC,
the approval playbook, legal compliance, and responsible AI built in as a design principle —
not a checkbox. The concept: AI operates within policy, not around it.

*[Scroll to Deal Approval Process]*

The **Approval Process** is directional —
five stages based on how deals actually move through the consulting lifecycle.
Opportunity Approval, Deal Shaping, Technical and Business review,
Pricing and Investment, final Deal Approval. AI-validated at each gate.
Each of these stages, in a real context, would need serious process work.
This is the model I'd start from.

*[Scroll to Agent Ecosystem]*

And the **Agent Ecosystem** — this is the part that excites me most.
Three agents in a closed loop. A Pipeline Agent reading the funnel,
sending forward signals on what's coming. A Delivery Agent feeding live performance
back from projects that were approved and are now in delivery.
The A-CLM Cockpit connecting both.

The concept here is that approved deals shouldn't disappear from the system —
they should feed back and make the next approval smarter.
That's the closed loop I'm proposing.

*[Pause]*

That's the framework. Let me show you how it comes to life.

---

## [AI DEAL APPROVALS — detailed demo]
*[~1 min 30 sec]*

*[Navigate back to /deal-approvals]*

*[Scroll to Tiered Approval Workflow]*

Back to the deal approvals page — now with more detail.

The tier model is core to this concept. Tier 1 is where AI should do the heavy lifting.
Low-risk, standard-scope deals — the executive has set the policy, the AI executes it,
the audit trail is complete. Tier 3 is the opposite — the executive needs to be in the room,
and the AI's job is to prepare them, not replace them.

*[Scroll down to a high-scoring deal tile — point to the score circle]*

Here's a deal scoring in the high 80s. Strong strategic alignment,
clean compliance profile, strong delivery track record on comparable engagements.
In my framework, this is exactly the type of deal that qualifies for AI-driven approval
on behalf of the executive. The policy is set. The AI acts on it.
No one needs to interrupt their day for this one.

*[Scroll to a complex deal — point to the lower score and APPROVE WITH CONDITIONS recommendation]*

Now contrast that with this. A large, complex engagement —
multiple service lines, vendor participation, regulatory requirements.
The score is lower, and the AI recommendation is Approve with Conditions.
Notice how it surfaces the three highest-risk factors with specific conditions attached.
This isn't the AI saying no — it's handing the executive a structured brief.
They can make a faster, better-informed decision.

*[Take the conditionally approved action — type a name and brief note]*

I'll approve this one conditionally — right here, name, notes, conditions logged.
Full audit trail, automated.

*[Scroll to a RECOMMEND_REVIEW deal]*

And then there's this one. Scope definition issues. No comparable reference at this scale.
The AI recommendation: Recommend Review. It's essentially saying —
I don't have enough signal to call this one. A human should look at it.
That, to me, is responsible AI in action.

The concept I'm demonstrating is graduated autonomy —
the AI acts where it should, and steps back where it shouldn't.

---

## [AI EVALS — click "AI Evals →" button, top right]
*[~0:40]*

*[Navigate to /evals]*

Now here's the concept I want to land clearly — and it's one I care about a lot.

The Evals page. Because in any AI system, the most important question is:
how do you actually know it's working?

*[Point to alignment rate]*

87.5% human-AI alignment. In 14 of 16 decisions, the model agreed with the human approver.
Tier 1 and 2 at 100%. Tier 3 at 78% — which is expected.
The most complex deals are exactly where human judgment should diverge from the AI.

*[Scroll to Score vs Delivery]*

Eval 2 is the one that lands for me. Does the deal score predict delivery outcomes?
High-scored deals — 80% green in delivery. Medium-scored — 100% amber. Low-scored — 100% red.
The model is calling it. Not perfectly, but directionally right.

This is what I mean by Business Value Testing —
the idea that every change to the model gets measured against a baseline. Not assumed. Proven.
That's the rigor I'd bring to a real deployment.

---

## [CLOSE — stay on Evals]
*[~0:20]*

I've put together a companion presentation — white paper style — that goes deeper
into the business proposition behind all of this.
Both the deck and this demo environment are available at my GitHub, at fefoabreu.me.

This is how I think. This is how I approach a complex process problem —
with a framework, a concept model, and an honest focus on business value.
I hope it gives you a good sense of what I'd bring to the role.

Thanks for watching.

---

*Total: ~780 words · ~5:45–6:00 at a natural, conversational demo pace*

---
### Recording tips
- On the Executive Dashboard: let the camera rest on the KPI cards for a second before you start speaking — the visual context lands before the words do
- When you say "this is a concept" — own it, don't apologize for it. It's a strength
- On the A-CLM page: scroll slowly between sections and pause after each element name before describing it
- On the deal tiles: hover over the score circle and the AI recommendation before you describe them
- For the conditions approval: type naturally — the typing itself is part of showing the workflow
- On Evals: let the Score vs. Delivery chart sit for a breath before narrating it — the 80/100/100 pattern speaks for itself
- Close warmly and directly — eye contact into the camera on the last line
