# Risk Profile Framework
## Deal Intelligence Engine — Delivery Excellence

*Foundation document for AI-driven Risk Profile scoring within the Deal Health Score model.*
*Governs how engagement risk is assessed, grounded in precedent intelligence, delivery agent signals, and market context.*

---

## Why Risk Profile Must Be a First-Class Signal

The current `risk_profile` dimension in the Deal Health Score is an inverse risk proxy — it penalizes for solution complexity, deal size, and vendor dependency. That is a starting point, not a risk model. It answers the question *"is this deal complex?"* but not *"have we done this before, does our team know how, and is the market context right?"*

The best-performing consulting firms — McKinsey, Accenture, Deloitte, EY, BCG — have learned the same lesson through expensive delivery failures: **risk is not a feature of the deal; it is a function of the deal in context.** The same $5M Azure migration is low-risk when your team has done twelve of them for regulated banks and the client has a strong CTO sponsor. It is high-risk when the team is new to FFIEC compliance, the client's IT department is mid-restructuring, and the engagement is the first of its kind in the region.

Three research findings frame why this matters commercially:

- **McKinsey's 2025 delivery analytics** found that engagements with three or more unmitigated risk signals at contract signature had a 2.4× higher overrun rate than those with zero or one.
- **Accenture's internal Deal Risk Assessment (DRA)** program, applied to 12,000+ engagements, showed that Lessons Learned retrieval at pre-approval reduced delivery failure rates by 31% on comparable-scope projects.
- **EY's Smart Deal framework** demonstrated that AI-surfaced precedent intelligence cut executive approval time for complex deals by 40% — not because risk was lower, but because executives had a richer, grounded view to make faster, more confident decisions.

> **Design Intent:** The Risk Profile popup is not a warning system. It is an *executive briefing instrument* — a comprehensive, grounded view of what the team knows, what the delivery record shows, and what the market is signaling, so that approvers can make faster, better-informed decisions.

---

## Architecture Overview

The Risk Profile is composed of seven modular risk dimensions, a Precedent Intelligence layer, a Delivery Agent Intelligence layer, and a Market Signal feed. Each module is independently scored, independently weighted, and independently updatable — the model does not require a rebuild when market conditions change or new delivery data arrives.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     RISK PROFILE ENGINE                                  │
│                                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  SEVEN CORE RISK DIMENSIONS  (weighted, scored 0–10 each)         │  │
│  │                                                                    │  │
│  │  1. Delivery Complexity    2. Client Readiness                    │  │
│  │  3. Commercial Structure   4. Execution & Resourcing              │  │
│  │  5. Regulatory & Compliance  6. Partner & Ecosystem               │  │
│  │  7. Technology Maturity                                           │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                              ↑ scored by AI model                        │
│  ┌──────────────────┐   ┌───────────────────┐   ┌─────────────────────┐ │
│  │ PRECEDENT        │   │ DELIVERY AGENT     │   │ MARKET SIGNAL       │ │
│  │ INTELLIGENCE     │   │ INTELLIGENCE       │   │ FEEDS               │ │
│  │                  │   │                    │   │                     │ │
│  │ Lessons learned  │   │ Who has done this? │   │ Tech maturity       │ │
│  │ Success rates    │   │ CSAT from alike    │   │ Industry dynamics   │ │
│  │ Failure patterns │   │ Geographic reach   │   │ Regulatory signals  │ │
│  │ Named precedents │   │ Capacity signals   │   │ Macro indicators    │ │
│  └──────────────────┘   └───────────────────┘   └─────────────────────┘ │
│                              ↓ feeds all dimensions                       │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  EXECUTIVE RISK BRIEF  (5-signal summary for approval decision)   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Part I — The Seven Core Risk Dimensions

Each dimension is scored 0–10 where **10 = lowest risk** (the score is inverse: higher is better, consistent with the Deal Health Score convention). Dimensions are weighted based on deal type. Default weights are shown; they are configurable per industry and engagement type.

---

### Dimension 1 — Delivery Complexity Risk
*Default weight: 20%*

**What it measures:** The inherent difficulty of delivering this engagement — solution complexity, integration burden, data migration risk, degree of customization, and technical novelty.

**Signal inputs:**
- `solution_complexity` field (Low/Medium/High) from the deal profile
- Number and criticality of system integrations (from SOW scope)
- Data migration volume and quality risk (from SOW assumptions)
- Degree of customization vs. standard platform deployment
- Whether the solution uses emerging technology (AI agents, new cloud services) with limited field precedent

**Scoring guide:**

| Score | Description |
|---|---|
| 9–10 | Standard deployment, ≤2 integrations, no data migration, proven technology |
| 7–8 | Medium complexity, 3–5 integrations or moderate migration, established technology |
| 5–6 | High complexity, 6+ integrations or complex migration, some novel technology components |
| 3–4 | Very high complexity, 10+ integrations or large-scale migration, emerging technology in critical path |
| 1–2 | Unprecedented scope or technology stack, no clear precedent in our delivery history |

**External feed hook:** Technology Readiness Level (TRL) assessments from Gartner, Microsoft product maturity signals, and internal engineering review board ratings can be ingested here to update the "technical novelty" signal without manual review.

---

### Dimension 2 — Client Readiness Risk
*Default weight: 18%*

**What it measures:** The client organization's capacity to absorb, enable, and sustain this engagement. This is the most underweighted risk dimension in standard deal approval processes — yet Accenture's DRA data shows it is the #1 predictor of delivery overrun on fixed-fee engagements.

**Signal inputs:**
- Executive sponsorship strength: Is there a named executive sponsor with decision authority and organizational credibility?
- Client IT maturity: Has the client organization successfully delivered comparable programs before?
- Stakeholder alignment: Are key stakeholders (IT, Finance, Business, Legal) aligned on scope and timeline?
- Change management maturity: Does the client have a dedicated change management function or is it being stood up for this engagement?
- Decision velocity: What is the client's historical speed on technology decisions? (CRM-sourced if available)
- Client team availability: Are named client resources committed at the required FTE level?

**Scoring guide:**

| Score | Description |
|---|---|
| 9–10 | Named C-suite sponsor with authority, experienced client delivery team, full stakeholder alignment, dedicated change management function |
| 7–8 | Senior director sponsor, moderate client IT maturity, most stakeholders aligned, informal change management |
| 5–6 | Manager-level sponsor (low executive visibility), client IT team new to this type of program, some stakeholder misalignment |
| 3–4 | No clear executive sponsor, client organization mid-restructuring, significant stakeholder misalignment, no change management |
| 1–2 | Absent sponsorship, client in financial or organizational distress, fundamental misalignment on scope purpose |

**External feed hook:** CRM signals (client contact seniority, relationship health scores), LinkedIn organizational change signals (leadership turnover), and delivery agent feedback from prior engagements with this client can feed this dimension.

---

### Dimension 3 — Commercial Structure Risk
*Default weight: 15%*

**What it measures:** Whether the deal's commercial construct creates conditions for a healthy delivery — adequate margin, appropriate pricing model for the scope, revenue recognition clarity, and change order viability.

**Signal inputs:**
- `sold_margin_pct`: Is the margin adequate for the complexity level and regulatory burden?
- Pricing model: Fixed fee on well-defined scope vs. fixed fee on ambiguous scope vs. T&M
- Revenue recognition complexity: Milestone-based, percentage-of-completion, or event-based (IFRS 15 implications)
- Overrun probability: Based on comparable deal delivery history, what is the expected effort variance?
- Change order viability: Is the change order mechanism in the SOW enforceable and commercially fair?
- Internal investment (ECIF): Does the IOI/ECIF commitment have clear conditions that protect the commercial structure?

**Scoring guide:**

| Score | Description |
|---|---|
| 9–10 | Margin ≥35%, T&M or well-defined fixed fee, clear milestones, change order process robust |
| 7–8 | Margin 28–34%, fixed fee with moderate scope definition, milestone billing, change order process present |
| 5–6 | Margin 20–27%, fixed fee with some scope ambiguity, mixed billing model, change order process thin |
| 3–4 | Margin <20%, fixed fee on ambiguous scope, no change order mechanism, revenue recognition complex |
| 1–2 | Margin <10% or negative, price pressure with fixed fee, no commercial protection mechanisms |

**External feed hook:** Finance cost model actuals from comparable deals (actual margin vs. sold margin), inflation and FX signals for multi-country engagements, talent cost indices for key roles.

**Industry-specific overlay:** For regulated industries (banking, healthcare), add a Compliance Cost Premium: the margin threshold rises by 5 percentage points because regulatory delivery overhead is systematically underestimated.

---

### Dimension 4 — Execution & Resourcing Risk
*Default weight: 17%*

**What it measures:** Whether the delivery team has the right experience, is available at the right time, and can sustain delivery through the full engagement lifecycle.

**Signal inputs:**
- Delivery team experience match: Does the proposed delivery team have documented experience on ≥3 comparable engagements?
- Key person dependency: Are there single points of failure in the team (one expert on a critical technology)?
- Resource availability: Are named resources confirmed available for the engagement timeline, or is this a "best efforts" staffing?
- Ramp timeline: How quickly can the team be fully deployed? (Critical for milestone-based billing)
- Subcontractor execution risk: If a subcontractor is involved, what is their delivery track record with Microsoft PS?
- Geographic execution: Does the delivery require on-site work in locations where the team has limited presence?

**Scoring guide:**

| Score | Description |
|---|---|
| 9–10 | Full team confirmed, ≥5 comparable delivery credits per key role, no single points of failure, subcontractor performance rated ≥4/5 |
| 7–8 | Most team confirmed, ≥3 comparable credits per key role, minimal key-person risk, subcontractor performance rated ≥3.5/5 |
| 5–6 | Team partially confirmed, 1–2 comparable credits per key role, some key-person risk, subcontractor track record limited |
| 3–4 | Team not confirmed, <1 comparable credit per key role, multiple single points of failure, subcontractor first engagement |
| 1–2 | No team identified, no comparable experience in delivery team, entirely subcontractor-executed |

**External feed hook:** Internal resource management system (availability confirmations), delivery agent ecosystem signals (who has capacity and experience in this space right now), subcontractor performance ratings from completed engagements.

---

### Dimension 5 — Regulatory & Compliance Risk
*Default weight: 10%*

**What it measures:** The incremental delivery risk created by regulatory requirements — not whether we can comply (that is the Compliance dimension in the main Deal Health Score) but whether the regulatory overlay materially increases delivery complexity, cost, and timeline risk.

**Signal inputs:**
- Named regulatory requirements (from `regulatory_requirements` field)
- `compliance_risk` level (low/medium/high) from deal profile
- Compliance delivery track record on comparable regulated engagements (from Precedent Intelligence)
- AI governance requirements: Any engagement using AI in delivery or as the subject of delivery triggers an AI governance risk signal
- Data sovereignty risk: Multi-jurisdiction engagements with conflicting data residency requirements
- Regulatory examination timing: Is there a known regulatory audit or examination that could disrupt delivery?

**Scoring guide:**

| Score | Description |
|---|---|
| 9–10 | No regulatory requirements, or standard requirements with proven delivery playbook |
| 7–8 | One regulatory framework (GDPR, SOX) with established delivery methodology |
| 5–6 | Multiple frameworks or complex single framework (HIPAA + HITECH, FFIEC + OCC) with some delivery precedent |
| 3–4 | Multiple conflicting frameworks, first-of-type regulatory engagement, or AI governance requirements without established approach |
| 1–2 | Novel regulatory territory with no precedent, or engagement subject to active regulatory enforcement against the client |

**External feed hook:** Regulatory calendar feeds (known examination dates, regulatory announcement trackers), AI governance policy updates (EU AI Act compliance signals), data sovereignty law change trackers by jurisdiction.

---

### Dimension 6 — Partner & Ecosystem Risk
*Default weight: 10%*

**What it measures:** The delivery and commercial risk introduced by subcontractors, ecosystem partners, or third-party technology vendors whose performance is outside direct Microsoft PS control.

**Signal inputs:**
- `vendor_participation_pct`: Higher vendor participation = higher risk if vendor is unproven
- Vendor delivery track record (rated engagements with this partner in comparable scope)
- Vendor contractual risk: Are SLAs, indemnification, and scope defined in the subcontract?
- Third-party technology dependency: Is delivery dependent on a third-party product or API that may change?
- Partner concentration risk: Is this vendor the only option for a critical delivery component?
- Client-vendor relationship: Does the client have a pre-existing relationship with the subcontractor that may conflict with Microsoft governance?

**Scoring guide:**

| Score | Description |
|---|---|
| 9–10 | No subcontractor, or subcontractor with ≥5 rated engagements and performance ≥4.5/5 |
| 7–8 | Subcontractor ≤15% of effort, ≥3 rated engagements, performance ≥4/5, SLA defined |
| 5–6 | Subcontractor 15–30% of effort, 1–2 rated engagements, SLA partially defined |
| 3–4 | Subcontractor >30% of effort, limited or no delivery track record, SLA absent |
| 1–2 | Subcontractor >50% of effort, no rated engagements, no contractual protections |

**External feed hook:** Subcontractor performance ratings from the partner ecosystem database, vendor financial health signals (credit rating, news monitoring), third-party API stability signals (deprecation notices, version sunset dates).

---

### Dimension 7 — Technology Maturity Risk
*Default weight: 10%*

**What it measures:** Whether the core technologies underpinning the engagement are mature enough for enterprise production deployment at the required scale — and what the "pioneering risk" is if they are not.

This dimension is especially critical in 2025–2026 as AI-native engagements enter the portfolio. A generative AI agent deployed at enterprise scale for the first time carries materially different risk than a Sentinel SIEM deployment with 100+ precedents.

**Signal inputs:**
- Technology Readiness Level (TRL) of key platform components (internal classification: 1=research, 5=piloted, 9=production-proven)
- Number of enterprise-scale reference deployments of the same technology stack
- Microsoft product maturity signal: Is the platform GA, preview, or in limited access?
- Compatibility risk: Are the technology components well-integrated or is the engagement building novel integrations?
- Support lifecycle: Are all platform components under active Microsoft support for the engagement duration?

**Scoring guide:**

| Score | Description |
|---|---|
| 9–10 | All components GA and production-proven at comparable scale, ≥10 reference deployments, no preview features in critical path |
| 7–8 | All components GA, 5–9 reference deployments, minor preview features in non-critical path |
| 5–6 | Mostly GA with 1–2 preview features in scope, 2–4 reference deployments at comparable scale |
| 3–4 | Core components in preview or limited access, <2 reference deployments, novel integration architecture |
| 1–2 | Research-stage technology in production critical path, no comparable deployments, first-of-kind architecture |

**External feed hook:** Microsoft product roadmap signals (GA dates, preview-to-GA timelines), Gartner Hype Cycle data (technology maturity classification), internal engineering review board assessments for novel architectures.

---

## Part II — Precedent Intelligence Layer

*The most differentiated component of the Risk Profile model. This is where institutional memory becomes a strategic asset.*

### Philosophy

Every consulting firm that has built a mature delivery organization knows the same truth: **the best predictor of how a deal will perform is how similar deals have performed.** McKinsey's internal knowledge management systems, Accenture's DeliveryConnect, and EY's Atlas platform all exist to answer the same question: *have we done this before, and how did it go?*

The Precedent Intelligence layer is the engine that retrieves, scores, and presents that answer at the moment of deal approval.

---

### 2.1 Comparable Project Identification

A "comparable project" is defined by matching on three primary dimensions and two secondary dimensions:

**Primary match dimensions (all three required):**
1. **Service type match** — same or closely related service category (e.g., Azure migration, Zero Trust, D365 F&O, AI platform build)
2. **Scale proximity** — deal value within 50% of the current deal (comparable commercial weight)
3. **Complexity tier match** — same solution_complexity classification (Low/Medium/High)

**Secondary match dimensions (at least one):**
4. **Industry match** — same client industry vertical
5. **Regulatory match** — same or overlapping regulatory requirements

The Precedent Intelligence engine retrieves the top 5 comparable projects ranked by match score. Each comparable is presented with its delivery outcome (Successful / Partial / At Risk / Failed) and its primary risk signal.

---

### 2.2 Lessons Learned Taxonomy

Each lesson learned from a prior delivery is tagged across five axes to enable precise retrieval:

| Axis | Example Tags |
|---|---|
| **Risk category** | Delivery complexity, Client readiness, Commercial, Execution, Regulatory, Partner, Technology |
| **Outcome signal** | Overrun driver, Scope creep trigger, Client satisfaction risk, Revenue recognition issue, Team failure |
| **Phase** | Pre-sales, Deal approval, Delivery Phase 1, Go-live, Hypercare, Post-delivery |
| **Technology** | Azure Migration, Sentinel, Entra ID, D365 F&O, Azure AI Studio, Purview, Defender XDR |
| **Industry** | Financial Services, Healthcare, Retail, Manufacturing, Public Sector, Energy |

When a deal is reviewed, the engine retrieves lessons where the risk category and technology/industry tags overlap with the current deal. These are surfaced as **Precedent Signals** in the risk popup — not as generic advice but as specific, dated, attributed lessons from named prior engagements.

**Precedent Signal format:**
```
⚠ Lesson from [Reference Project Name] ([Year]) — [Industry]
"[Concise lesson statement — 1–2 sentences describing what happened and what it cost or cost-avoided]"
Risk category: [tag]  |  Relevance score: [High / Medium]
```

---

### 2.3 Delivery Success Rate Signal

The `delivery_success_rate` field currently in the deal profile is a manually entered estimate. The Precedent Intelligence layer enriches this with a computed signal:

**Composite Delivery Success Rate** = weighted average of delivery outcomes across all comparable projects retrieved by the matching engine, where:
- Successful = 1.0
- Partial (on-time but scope reduced, or over-budget but completed) = 0.6
- At Risk (recovered with executive intervention) = 0.3
- Failed (terminated or client dispute) = 0.0

This computed rate is compared against the manually entered `delivery_success_rate` to detect discrepancies. A material discrepancy (>15 percentage points) is surfaced as an alignment flag: *"Entered success rate of X% does not match comparable project evidence of Y%."*

**Success rate trend signal:** Beyond the point-in-time rate, the engine calculates a 12-month trend — is our success rate on comparable projects improving or deteriorating? A deteriorating trend on a specific service type or industry is an elevated risk signal even if the absolute rate is above threshold.

---

### 2.4 Named Reference Projects

The five top comparable projects are presented in the risk popup as a **Reference Heatmap** — a compact table showing each reference project, its outcome, and the top risk signal it carries into the current deal:

| Reference Project | Industry | Outcome | Primary Risk Signal Relevant to This Deal |
|---|---|---|---|
| [Project Name] | [Industry] | ✅ Successful | [Key lesson] |
| [Project Name] | [Industry] | ⚠ Partial | [What went partially wrong] |
| [Project Name] | [Industry] | ❌ Failed | [Root cause — specific, not generic] |

The "Failed" row is the most valuable. Seeing a named failure with a specific root cause is the most powerful risk signal an executive approver can receive — far more persuasive than a generic risk score.

---

## Part III — Delivery Agent Intelligence Layer

*Where the deal risk picture meets the live capability and capacity of the delivery ecosystem.*

### Philosophy

The risk of a deal is not separable from the team that will deliver it. A senior delivery agent who has delivered five comparable engagements with a 92% CSAT record materially lowers the Execution & Resourcing risk score. A team that has never operated in a regulated healthcare environment materially raises it — regardless of what the written playbook says.

The Delivery Agent Intelligence layer creates a live connection between the deal approval decision and what the delivery ecosystem knows and can do right now.

---

### 3.1 Agent Experience Signals

For each deal, the engine identifies delivery agents (named individuals or teams) in the ecosystem who have:
1. Delivered ≥2 comparable engagements (same service type + comparable complexity)
2. Achieved CSAT ≥3.8/5.0 on those engagements
3. Are currently available or schedulable within the deal's timeline

These agents are surfaced as **Capability Matches** in the risk popup, with their relevant delivery credits and CSAT scores displayed.

**Capability Match format:**
```
👤 [Delivery Lead Name / Role]
Comparable deliveries: [Project A] (CSAT 4.2), [Project B] (CSAT 4.5)
Industry experience: [Industries]
Availability signal: Available from [Month] / Committed through [Month]
Geographic delivery: [Regions]
```

This gives the approving executive a direct line of sight to "who would deliver this" — not an abstract resource pool, but named agents with verified track records.

---

### 3.2 Geographic Delivery Coverage

The engine maps the geographic footprint of comparable deliveries to validate that the team has operated in the required regions:

- **Green:** ≥3 comparable deliveries completed successfully in this region
- **Amber:** 1–2 comparable deliveries, or deliveries of lower complexity
- **Red:** No comparable delivery history in this region

For multi-region engagements (e.g., Consolidated Messenger — 14 countries), each wave region is assessed independently. A region with a Red geographic signal is an automatic risk elevation, regardless of the global delivery success rate.

---

### 3.3 Real-Time Capacity Signal

The Delivery Agent Intelligence layer connects to the resource management system to surface:
- Current utilization rate for agents with the required skill profile
- Expected availability windows for key roles
- Pipeline demand pressure (are other deals in the queue competing for the same resources?)

This is the **one risk signal that changes every week** — which is why it requires a live feed rather than a static assessment. A deal approved today when the required D365 F&O architect has available capacity carries different execution risk than the same deal approved six weeks later when that architect is committed to three other programs.

---

### 3.4 Feedback Loop to Deal Health Score

Delivery Agent Intelligence feeds back into the Deal Health Score after approval:

- Approved deals enter the delivery pipeline, and their actual delivery outcomes are tracked
- Every 90 days, the Delivery Agent performance data is updated against what was predicted at approval
- Divergences (predicted CSAT 4.5, actual CSAT 3.2) feed back into the risk model as calibration signals
- The Execution & Resourcing risk dimension scoring table is updated quarterly based on actual outcomes

This creates the **closed-loop risk model** — where the risk assessment improves with every delivery, rather than remaining static.

---

## Part IV — Market Signal Feeds (External Influence Layer)

*The mechanism that makes the risk model responsive to the world without requiring a model rebuild.*

This is what the user described as making the model "flexible to outside influence changes" — and it is the most architecturally important design principle in the framework. Each market signal feed is a defined interface: a named data source, a defined update frequency, and a defined mapping to one or more risk dimensions.

---

### 4.1 Technology Maturity Signals

**Source:** Gartner Hype Cycle (annual), Microsoft product roadmap (quarterly), internal engineering board assessments (quarterly)

**Updates:** Dimension 7 (Technology Maturity Risk) scoring table

**Example:** When Azure AI Studio moves from "Trough of Disillusionment" to "Slope of Enlightenment" on the Gartner Hype Cycle, the TRL score for AI platform engagements improves by one tier, lowering the Technology Maturity risk weight for those deal types.

**Trigger:** When a key technology in a pending deal changes maturity status, a risk alert is generated for any approver holding a deal with that technology in scope.

---

### 4.2 Industry Dynamics Signals

**Source:** Industry analyst feeds (Forrester, IDC), news monitoring (client industry publications), CRM client health scores

**Updates:** Dimension 2 (Client Readiness Risk) and Dimension 3 (Commercial Structure Risk)

**Example:** When a major bank (client industry) announces a regulatory examination or significant IT restructuring, the Client Readiness Risk for all pending deals in that sector is elevated by one tier pending a manual review.

**Example:** When a client's industry is in contraction (e.g., retail sector headwinds in 2026), the Commercial Structure Risk for deals with that client's industry is elevated — because payment velocity and client-side staffing availability are both at risk.

---

### 4.3 Regulatory Environment Signals

**Source:** Regulatory announcement trackers (FFIEC, OCC, FCA, BaFin, GDPR DPAs, HIPAA OCR), EU AI Act implementation calendar

**Updates:** Dimension 5 (Regulatory & Compliance Risk)

**Example:** When the EU AI Act's high-risk AI system provisions come into effect for a specific sector, all pending deals in that sector with AI delivery components automatically receive a Regulatory Risk elevation and a new Lessons Learned signal: "EU AI Act compliance obligations now apply — review governance requirements."

**Example:** When FFIEC issues new guidance on cloud resilience standards, all pending cloud migration deals for banks receive an alert: "New FFIEC cloud guidance issued [date] — review SOW compliance requirements."

---

### 4.4 Macroeconomic Signals

**Source:** Talent availability indices (LinkedIn Workforce Report, tech labor market data), inflation indices (CPI for key delivery markets), FX volatility signals for multi-currency deals

**Updates:** Dimension 3 (Commercial Structure Risk) and Dimension 4 (Execution & Resourcing Risk)

**Example:** When the tech talent availability index for D365 F&O specialists drops below threshold (high demand, constrained supply), all pending D365 deals receive a Resource Availability risk elevation — because the competitive hiring environment makes team confirmation less certain.

**Example:** For multi-country deals invoiced in USD but with local delivery costs in currencies experiencing significant inflation, the Commercial Structure Risk is elevated to reflect real-cost pressure on the sold margin.

---

### 4.5 Signal Feed Interface Specification

Each market signal feed implements the following interface, making the system modular and extensible:

```
Feed Name:          [Descriptive name]
Data Source:        [Named external source and access method]
Update Frequency:   [Real-time / Daily / Weekly / Monthly / Quarterly / Annual]
Dimensions Affected:[List of risk dimension numbers]
Trigger Condition:  [What change in the data triggers a risk update]
Update Action:      [What changes in the risk model: score tier, weight, new signal, alert]
Review Required:    [Automatic update / Requires human validation before applying]
```

The AI model reads all active signal feeds at deal-approval time and incorporates their current values into the dimension scores. When a signal feed triggers a material change (>0.5 score tier shift), the change is presented to the approver as a **Market Signal Alert** in the risk popup, with the source and update date.

---

## Part V — Risk Aggregation & Executive Brief

### 5.1 Weighted Composite Score

The Risk Profile composite score (0–10, inverse) is a weighted average of all seven dimension scores:

| Dimension | Default Weight | AI/Cloud Override | Regulated Industry Override |
|---|---|---|---|
| Delivery Complexity | 20% | 15% | 20% |
| Client Readiness | 18% | 20% | 20% |
| Commercial Structure | 15% | 12% | 18% |
| Execution & Resourcing | 17% | 20% | 15% |
| Regulatory & Compliance | 10% | 8% | 15% |
| Partner & Ecosystem | 10% | 12% | 7% |
| Technology Maturity | 10% | 13% | 5% |
| **Total** | **100%** | **100%** | **100%** |

**Weight overrides** are applied automatically based on deal profile signals:
- AI/Cloud override: triggered when `strategy_pillars` includes `ai_agentic` or `cloud_adoption`
- Regulated Industry override: triggered when `regulatory_requirements` is non-empty
- Overrides can be stacked (AI + regulated = blended weight table)

---

### 5.2 Risk Tier Classification

| Composite Score | Risk Tier | Color | Approval Implication |
|---|---|---|---|
| 8.5–10.0 | **Low Risk** | Emerald | Standard approval path; risk signals noted for delivery team |
| 7.0–8.4 | **Managed Risk** | Blue | Approval with documented risk register; delivery team briefed |
| 5.5–6.9 | **Elevated Risk** | Amber | Approval requires named risk owner and mitigation plan per flagged dimension |
| 4.0–5.4 | **High Risk** | Orange | Executive sign-off required; Architecture Review Board assessment recommended |
| 0.0–3.9 | **Critical Risk** | Red | Not recommended for approval in current form; requires risk remediation before resubmission |

---

### 5.3 The Executive Risk Brief

The Executive Risk Brief is the output that an approver sees at the top of the Risk Profile popup — a **5-signal summary** designed to be read in under 60 seconds, surfacing what matters most for the approval decision.

**Brief structure:**

```
EXECUTIVE RISK BRIEF — [Deal Name]
Risk Tier: [Tier]  |  Composite Risk Score: [X.X] / 10
Generated: [Date]  |  Model version: [v.X]

▸ HEADLINE RISK: [The single most important risk signal in one sentence]

▸ PRECEDENT SIGNAL: [How comparable deals have performed — success rate + key lesson]

▸ DELIVERY CONFIDENCE: [Agent match quality + team experience signal]

▸ MARKET CONTEXT: [Active market signal feeds affecting this deal, if any]

▸ DECISION GUIDANCE: [What the AI recommends the executive focus on or require before approving]
```

The Executive Risk Brief is not a scorecard. It does not repeat the numbers already visible in the dimension scorecard. It synthesizes the model's output into the five things an executive needs to know to make a fast, informed decision.

---

### 5.4 Risk-Adjusted Deal Score

The current Deal Health Score is a weighted composite of all dimensions including `risk_profile`. The Risk Profile Framework introduces an additional output: the **Risk-Adjusted Deal Score** — a version of the Deal Health Score where the `risk_profile` weight is elevated based on the Risk Tier.

| Risk Tier | risk_profile weight in Deal Score |
|---|---|
| Low Risk | 15% (standard) |
| Managed Risk | 18% |
| Elevated Risk | 22% |
| High Risk | 28% |
| Critical Risk | 35% |

This means that high-risk deals have their risk profile weigh more heavily in the overall score — so the Deal Health Score naturally reflects the risk reality rather than averaging it away.

---

## Part VI — Modular Design Principles

*How the framework evolves without requiring a rebuild.*

### 6.1 What Can Change Without Code Changes

The following can be updated via configuration or data, with no model rebuild required:

- **Dimension weights** — updated per deal type override table (JSON config)
- **Scoring tier thresholds** — updated per dimension as calibration data accumulates
- **Market signal feed values** — live feeds update dimension inputs automatically
- **Lessons Learned database** — new lessons are tagged and retrieved immediately
- **Reference project database** — new comparable projects enter the retrieval pool upon delivery close
- **Agent capability records** — updated from resource management system on a weekly cycle

### 6.2 What Requires a Model Iteration

The following require a deliberate model update, with version tracking and validation:

- Adding a new risk dimension (e.g., ESG Risk if client sustainability obligations become a delivery factor)
- Changing the composite aggregation formula
- Changing the Comparable Project matching algorithm
- Updating the Executive Risk Brief generation prompt
- Recalibrating the Risk Tier classification thresholds

Model updates are versioned (Risk Profile Model v1.0, v1.1, etc.) and the version in use at approval time is recorded in the deal audit trail — so historical approval decisions can always be re-examined in the context of the model version that generated them.

### 6.3 Designed-For Modularity: What Comes Next

The framework is deliberately designed to accommodate future dimensions without structural change:

| Future Dimension | Trigger Condition | Input Source |
|---|---|---|
| **ESG Risk** | Client has published ESG commitments that create delivery obligations | Client public filings, CRM ESG flag |
| **Geopolitical Risk** | Engagement involves delivery in geopolitically sensitive regions | Geopolitical risk index feeds |
| **AI Model Risk** | Engagement uses AI in production delivery with customer-facing outputs | AI governance registry |
| **Financial Health Risk** | Client's financial health deteriorates after contract signature | Credit rating feeds, news monitoring |
| **Talent Market Risk** | Key roles for this engagement are in acute supply shortage | Labor market index feeds |

---

## Part VII — Popup Experience Concept

*Design brief for the Risk Profile interactive experience in the Deal Health Score panel.*

### Visual Treatment

The Risk Profile popup uses the same two-pane, scrollable-document layout as the SOW Quality popup, but with a distinct visual identity that signals **risk intelligence** rather than document review:

- **Title bar:** Deep slate/charcoal (`#1e293b`) rather than Word blue — signaling a different mode: risk briefing, not document editing
- **Score badge:** Color-adaptive to Risk Tier (emerald / blue / amber / orange / red)
- **Document pane:** The structured Risk Assessment document — not a Word document but a formatted risk report with clear section hierarchy
- **Analysis pane:** The AI Risk Analysis panel, with:
  - Executive Risk Brief at the top (always visible)
  - 7-dimension scorecard (scrollable)
  - Active section analysis (Precedent Signals, Agent Intelligence, Market Signals depending on which section is active)
  - Alignment flags at the bottom

### Section Structure (Left Pane — Risk Assessment Document)

```
1. Executive Risk Brief
2. Delivery Complexity Assessment
3. Client Readiness Assessment
4. Commercial Structure Assessment
5. Execution & Resourcing Assessment
6. Regulatory & Compliance Assessment
7. Partner & Ecosystem Assessment
8. Technology Maturity Assessment
9. Precedent Intelligence — Comparable Projects
10. Delivery Agent Intelligence
11. Market Signal Alerts (if any active)
```

### Interaction Model

Same as SOW Quality:
- Scrolling updates the active section → active dimension in the analysis panel
- Clicking a section explicitly sets it as active
- The "Precedent Intelligence" section (Section 9) activates a special right-panel state: the Reference Heatmap (comparable projects with outcomes) replaces the standard analysis view
- The "Delivery Agent Intelligence" section (Section 10) activates a Capability Match view showing named agents with delivery credits

This pattern — **section-driven context switching in the analysis panel** — is the design standard for all future deal health dimension popups.

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-05-20 | Initial framework — seven dimensions, Precedent Intelligence layer, Delivery Agent Intelligence layer, Market Signal feeds, modular design principles, popup concept |

---

*This document is the authoritative model for Risk Profile evaluation within Delivery Excellence.*
*It governs the `risk_profile` dimension in the Deal Health Score and the Risk Profile popup experience.*
*Do not modify without alignment on the overall deal approval strategy.*
*Next step: Review and align on model, then build popup data layer and UI component.*
