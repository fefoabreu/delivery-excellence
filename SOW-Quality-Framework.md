# SOW Quality Framework
## Statement of Work Review Engine — Delivery Excellence

*Foundation document for AI-driven SOW quality scoring within the Deal Health Score model.*
*Governs how SOW completeness, clarity, and strategic alignment are evaluated at every stage of the approval lifecycle.*

---

## Why SOW Quality Is a Revenue Risk

A poorly constructed SOW is the single most common root cause of:
- Scope creep and budget overruns
- Disputed acceptance and delayed revenue recognition
- Client dissatisfaction that jeopardizes renewals and references
- Delivery team misalignment from day one

Research from IACCM (International Association for Contract & Commercial Management) and KPMG's Professional Services Benchmarking indicates that **ambiguous or incomplete SOWs contribute to project overruns in 65–70% of IT professional services engagements**. Modern consulting firms — Accenture, EY, Capgemini, TCS — now treat SOW quality as a commercial control, not just a legal requirement.

The goal of this framework is to transform SOW review from a passive checklist into an **AI-driven quality signal** embedded in every deal approval decision.

---

## Part I — SOW Structure Standard

Every SOW governed by this framework must contain the following sections. Absence of a required section, or the presence of a section with insufficient content, is scored as a quality deficiency by the review engine.

---

### Section 1 — Executive Summary

**Purpose:** Orient executive stakeholders to the nature, scope, and strategic intent of the engagement in under half a page.

**Required content:**
- One-paragraph description of the engagement
- Statement of the business problem or opportunity being addressed
- The client's primary stakeholder(s) and their decision authority
- High-level commercial summary (total value, engagement duration)

**Quality signal:** This section tells the reviewer whether the SOW was written with a client-first lens or as an internal cost estimate dressed as a proposal.

---

### Section 2 — Customer Desired Outcomes

**Purpose:** Anchor the entire engagement to what the client is trying to achieve — not what the vendor is delivering.

This is the most strategically important section of any modern SOW. Outcome-based contracting is now the industry standard (73% of clients prefer outcome-tied fees over T&M, per Gartner 2025). An SOW that cannot articulate the client's desired outcomes cannot be evaluated for delivery fitness.

**Required content:**
- **Business outcomes:** What does the client's business look like when this engagement succeeds? (e.g., "Reduction in invoice processing cycle time by 40%", "Migration of 80% of workloads to Azure with zero data loss")
- **Technical outcomes:** What does the technical landscape look like at completion?
- **Organizational outcomes:** What capabilities, skills, or processes does the client's team have that they didn't before?
- **Success metrics:** At least two measurable KPIs tied to outcomes, with baseline and target values

**Quality signals:**
- Outcomes written as vendor activities ("We will deliver...") rather than client results ("The client will achieve...") are flagged as a quality deficiency
- Vague language ("improve performance", "modernize systems") without measurable targets is flagged
- Absence of any metric is a high-severity deficiency

---

### Section 3 — Scope of Work

**Purpose:** Define precisely what the vendor is responsible for delivering.

**Required content:**
- **Workstreams or phases:** Organized breakdown of the work (e.g., Discovery, Design, Build, Test, Deploy)
- **Activities per workstream:** What specific activities, tasks, or sprints are included
- **Deliverables per workstream:** The tangible outputs that mark completion of each workstream (documents, configured environments, trained models, completed migrations, etc.)
- **Service type classification:** Whether each component is advisory, implementation, managed service, or training
- **Location and modality:** On-site, remote, or hybrid — and where the work is performed (relevant for regulated industries and multi-jurisdiction deals)
- **Personnel and role structure:** Key roles (Project Manager, Solution Architect, etc.) — not necessarily named individuals, but role commitments

**Quality signals:**
- Scope written only at a macro level without workstream decomposition is flagged as medium severity
- Missing deliverables for any workstream is a high-severity deficiency
- Scope that cannot be mapped back to the customer's desired outcomes (Section 2) is flagged as a strategic alignment risk

---

### Section 4 — Out-of-Scope

**Purpose:** Protect both parties by explicitly naming what is NOT included. This section is as commercially important as the scope itself.

**Required content:**
- Explicit exclusions by category (e.g., "Hardware procurement is out of scope", "Custom integrations beyond the five systems named in Section 3 are excluded", "End-user training for more than 200 users is not included")
- Known adjacencies that the client might assume are included but are not
- Post-go-live support terms and duration (or explicit statement that hypercare is excluded)
- Third-party dependencies the vendor will not own (licenses, vendor SLAs, data quality)

**Quality signals:**
- Absence of this section is a high-severity deficiency — it is the primary source of scope creep disputes
- Generic language ("anything not mentioned above") without specific examples is flagged as insufficient
- Out-of-scope items that contradict or conflict with the stated scope are flagged as an internal consistency error

---

### Section 5 — Assumptions & Dependencies

**Purpose:** State the conditions that must be true for the engagement to succeed as priced and scoped. When assumptions prove false, they become the basis for scope change orders.

**Required content:**
- **Client-side assumptions:** What the client commits to providing (access, data, resources, decisions, infrastructure)
- **Technical assumptions:** Platform versions, integration standards, data quality levels assumed
- **Timeline assumptions:** That timelines are contingent on assumptions being met by specified dates
- **Third-party assumptions:** That named systems, vendors, or APIs are available and meet the described specifications
- **Staffing assumptions:** Client team availability (e.g., "a dedicated client BA will be available 50% of the time throughout Phase 1")

**Quality signals:**
- No assumptions section is a high-severity deficiency
- Assumptions written as vendor obligations rather than client/environment conditions are flagged
- Assumptions that are clearly unverifiable (e.g., "we assume the client's data is clean") without a data assessment stage are flagged as delivery risk

---

### Section 6 — Deliverables Register

**Purpose:** Provide a structured table of every deliverable, who is responsible, and how it is accepted.

**Required content — one row per deliverable:**

| Deliverable | Description | Responsible Party | Due Date / Milestone | Acceptance Criteria | Acceptance Period |
|---|---|---|---|---|---|
| Solution Design Document | Architecture blueprint for the Azure migration | Vendor | End of Phase 1 | Client Architecture Review Board sign-off | 5 business days |

**Quality signals:**
- Missing acceptance criteria for any deliverable is a high-severity deficiency
- Acceptance criteria written as vendor activities ("delivery of the document") rather than client verification ("client sign-off") are flagged
- Deliverables with no due date or milestone anchor are flagged as timeline risk

---

### Section 7 — Project Timeline & Milestones

**Purpose:** Establish the temporal structure of the engagement with clear anchors for decision points, payments, and risk reviews.

**Required content:**
- **Overall engagement duration:** Start date, end date, and total calendar weeks
- **Phase breakdown:** Named phases with start/end dates
- **Key milestones:** Go/no-go checkpoints, major deliverable completion, client review windows
- **Payment milestones:** If milestone-based billing, which milestones trigger invoices
- **Dependencies timeline:** External dependencies that affect milestone achievement (e.g., client decisions required by a given date)
- **Critical path items:** Any single path items where delay cascades across the engagement

**Quality signals:**
- Timeline with phases but no milestones is flagged as medium severity
- Milestone dates that are not tied to deliverables are flagged as unenforceable
- Engagements over 12 weeks with no interim go/no-go checkpoint are flagged as governance risk
- No statement of how timeline revisions are handled is flagged

---

### Section 8 — Commercial Terms

**Purpose:** Define the financial structure of the engagement.

**Required content:**
- **Pricing model:** Fixed fee, T&M, milestone-based, or hybrid — with rationale
- **Fee schedule:** Total value, phase-by-phase breakdown, or monthly burn rate
- **Expense policy:** Which expenses are included vs. billed separately, with caps if applicable
- **Change order process:** How additional scope is priced and authorized
- **Payment terms:** Net 30/60, invoice triggers, late payment terms
- **Investment/ECIF:** If any internal investment or ECIF commitment is tied to this engagement, the conditions under which it is applied

**Quality signals:**
- Absence of change order language is a high-severity deficiency (the most common commercial dispute trigger)
- Fee schedule that does not map to the deliverables or milestones in prior sections is flagged as internal inconsistency
- ECIF or internal investment mentioned in the deal profile but not referenced in the SOW is flagged

---

### Section 9 — Governance & Change Management

**Purpose:** Define how the engagement is managed, how decisions are made, and how scope changes are controlled.

**Required content:**
- **Project governance structure:** Steering Committee, Project Management Office, working team — roles and meeting cadences
- **Escalation path:** Named roles (not individuals) for first, second, and executive escalation
- **Change control process:** How change requests are initiated, reviewed, priced, and authorized
- **Status reporting cadence:** Frequency and format of status reports
- **RAID log:** Confirmation that a Risks, Assumptions, Issues, and Dependencies log will be maintained throughout

**Quality signals:**
- No escalation path defined is a medium-severity deficiency
- No change control process is a high-severity deficiency
- No reference to status reporting is flagged

---

### Section 10 — Risk Register (Preliminary)

**Purpose:** Surface the material risks at the time of signing, establishing a shared risk picture.

**Required content:**
- At least three named risks with: risk description, probability (High/Medium/Low), impact (High/Medium/Low), and mitigation approach
- **Technical risks** (integration complexity, data quality, platform stability)
- **Delivery risks** (key-person dependency, client availability, third-party delays)
- **Commercial risks** (scope interpretation, currency exposure for multi-jurisdiction deals)
- A statement confirming that the risk register will be maintained and reviewed in governance meetings

**Quality signals:**
- Fewer than three named risks is flagged (all engagements have risk — a blank register means no one looked)
- Risks without mitigation strategies are flagged
- This section is cross-referenced against the Assumptions section — unmitigated assumptions that represent material risks are flagged automatically

---

### Section 11 — Compliance, IP, and Legal

**Purpose:** Address the regulatory, intellectual property, and legal conditions of the engagement.

**Required content:**
- **Data classification:** What categories of data will be accessed, processed, or stored during the engagement
- **Regulatory requirements:** Named applicable regulations (GDPR, HIPAA, SOC 2, ISO 27001, etc.) and the party responsible for compliance
- **Intellectual property ownership:** Who owns what is built — client, vendor, or joint; prior IP vs. work product IP
- **Confidentiality obligations:** Reference to the governing NDA and any specific project-level confidentiality requirements
- **AI governance clause** (required for any engagement where AI tools are used in delivery): Which AI systems are used, human oversight requirements, audit rights
- **Subcontractor / vendor disclosure:** If any subcontractors or third-party vendors are engaged, named and with client notification obligations

**Quality signals:**
- No data classification is a high-severity deficiency for any engagement involving client data
- No AI governance clause in an engagement where AI is used is flagged as a compliance risk
- IP ownership ambiguity (no clear statement of who owns what) is a high-severity deficiency

---

## Part II — AI Evaluation Dimensions

The review engine evaluates each SOW across the following dimensions, producing the `sow_quality` score (0–10) that feeds into the Deal Health Score.

Each dimension is scored 0–10. The composite score is a weighted average. Weights can be tuned per deal type and client segment.

---

| Dimension | Weight | What the AI Evaluates |
|---|---|---|
| **Outcome Clarity** | 20% | Are desired outcomes present, measurable, and aligned to the deal's stated strategy pillars? |
| **Scope Completeness** | 18% | Are workstreams, activities, and deliverables decomposed to an actionable level? |
| **Out-of-Scope Specificity** | 12% | Are exclusions explicit, specific, and commercially protective? |
| **Assumption Quality** | 12% | Are assumptions client-facing, verifiable, and tied to delivery conditions? |
| **Timeline Enforceability** | 12% | Are milestones tied to deliverables? Is there a critical path? Are go/no-go points defined? |
| **Commercial Integrity** | 10% | Does pricing map to scope? Is change control defined? |
| **Governance Readiness** | 8% | Is escalation, status reporting, and RAID maintenance defined? |
| **Risk Visibility** | 8% | Are material risks named with mitigations? Is the risk picture honest? |

---

### Scoring Tiers

| Score | Tier | Interpretation |
|---|---|---|
| 9.0–10.0 | **Excellent** | SOW meets all requirements; ready for execution without revision |
| 7.5–8.9 | **Good** | Minor gaps; one or two dimensions need clarification before execution |
| 6.0–7.4 | **Acceptable with Conditions** | Meaningful gaps in 2–3 dimensions; revision required before deal approval |
| 4.0–5.9 | **Needs Work** | Multiple high-severity deficiencies; SOW is not ready for approval |
| 0.0–3.9 | **Not Approved** | Fundamental structural issues; must be redrafted |

---

### Severity Classification

The engine classifies each finding as:

| Severity | Definition | Effect on Approval |
|---|---|---|
| **High** | Section missing or critically incomplete; creates material commercial or delivery risk | Blocks Tier 1 approval; flagged as condition for Tier 2/3 |
| **Medium** | Section present but insufficiently detailed; creates ambiguity | Added as AI condition in recommendation |
| **Low** | Minor gap; does not materially affect delivery risk | Noted in review; does not block approval |

---

## Part III — SOW Template (Standard Engagement)

The following is the canonical SOW template for IT professional services engagements. All sections marked **[Required]** must be completed. Sections marked **[If applicable]** are required when the condition is met.

---

```
STATEMENT OF WORK
[Project Name] — [Client Name]
Version [X.X] | [Date] | Confidential

────────────────────────────────────────────────
1. EXECUTIVE SUMMARY
────────────────────────────────────────────────

[One-paragraph overview of the engagement]

Client: [Client legal name]
Vendor: [Vendor legal name]
Engagement type: [Advisory / Implementation / Managed Services / Training]
Contract value: [Total value]
Engagement period: [Start date] — [End date]
Primary client contact: [Name, Title]
Primary vendor contact: [Name, Title]

────────────────────────────────────────────────
2. CUSTOMER DESIRED OUTCOMES  [Required]
────────────────────────────────────────────────

2.1 Business Outcomes
  [Outcome 1]: [Measurable statement with baseline and target]
  [Outcome 2]: [Measurable statement with baseline and target]

2.2 Technical Outcomes
  [What the technical landscape looks like at completion]

2.3 Organizational Outcomes
  [Capability or process changes the client will have post-engagement]

2.4 Success Metrics
  Metric          | Baseline | Target    | Measurement Method
  [Metric 1]      | [value]  | [value]   | [how measured]
  [Metric 2]      | [value]  | [value]   | [how measured]

────────────────────────────────────────────────
3. SCOPE OF WORK  [Required]
────────────────────────────────────────────────

3.1 Phase 1 — [Phase Name]
  Duration: [X weeks] | [Start] — [End]
  Activities:
    - [Activity 1]
    - [Activity 2]
  Deliverables:
    - [Deliverable 1] (see Section 6 for acceptance criteria)
    - [Deliverable 2]

3.2 Phase 2 — [Phase Name]
  [Repeat structure]

3.3 Resource Commitments
  Role                | FTE / Allocation | Phase(s)
  [Project Manager]   | 0.5 FTE          | All phases
  [Solution Architect]| 1.0 FTE          | Phase 1–2
  [Developer (x2)]    | 2.0 FTE          | Phase 2–3

────────────────────────────────────────────────
4. OUT-OF-SCOPE  [Required]
────────────────────────────────────────────────

The following items are explicitly excluded from this engagement:

  - [Exclusion 1 — specific and named]
  - [Exclusion 2]
  - [Exclusion 3]

Post-go-live support: [Hypercare period defined here, or explicit statement that it is excluded]

Any work outside the scope defined in Section 3 requires a formally executed Change Order per Section 9.3.

────────────────────────────────────────────────
5. ASSUMPTIONS & DEPENDENCIES  [Required]
────────────────────────────────────────────────

5.1 Client Commitments
  - [Client will provide X by Y date]
  - [Client BA will be available Z% for the duration of Phase 1]
  - [Client will complete data remediation before Phase 2 begins]

5.2 Technical Assumptions
  - [Named system is on version X.X or higher]
  - [Data quality meets the standard defined in Appendix A]
  - [Named API is available with the response SLA of X ms]

5.3 Third-Party Assumptions
  - [Named vendor will deliver Y by Z date]

5.4 Timeline Assumptions
  - Timelines assume client review and decision cycles of no more than [X] business days
  - [Any change to assumptions in this section triggers a timeline and commercial review]

────────────────────────────────────────────────
6. DELIVERABLES REGISTER  [Required]
────────────────────────────────────────────────

  ID  | Deliverable              | Phase  | Due         | Acceptance Criteria          | Acceptance Period
  D01 | [Deliverable name]       | 1      | [date]      | [Specific acceptance test]   | 5 business days
  D02 | [Deliverable name]       | 2      | [date]      | [Sign-off by named role]     | 5 business days

Deemed acceptance: If the client does not respond within the acceptance period, the deliverable is deemed accepted.

────────────────────────────────────────────────
7. PROJECT TIMELINE & MILESTONES  [Required]
────────────────────────────────────────────────

Overall engagement: [Start date] — [End date] ([X] weeks)

Milestone          | Target Date     | Go/No-Go? | Payment Trigger?
Phase 1 Kickoff    | [date]          | No        | Yes — 20% on kickoff
Phase 1 Complete   | [date]          | Yes       | Yes — 30% on acceptance
Phase 2 Complete   | [date]          | Yes       | Yes — 30% on acceptance
Final Acceptance   | [date]          | Yes       | Yes — 20% on acceptance

Critical path items: [List any items where delay cascades across the engagement]

────────────────────────────────────────────────
8. COMMERCIAL TERMS  [Required]
────────────────────────────────────────────────

8.1 Pricing Model: [Fixed fee / T&M / Milestone-based / Hybrid]
8.2 Total Contract Value: [Amount]
8.3 Fee Schedule:
    Phase 1: [Amount] — [Trigger]
    Phase 2: [Amount] — [Trigger]

8.4 Expense policy: [Included in fee / Billed at cost / Capped at X]
8.5 Payment terms: Net [30/60] from invoice date
8.6 Internal investment / ECIF: [Amount and conditions, or N/A]

────────────────────────────────────────────────
9. GOVERNANCE & CHANGE MANAGEMENT  [Required]
────────────────────────────────────────────────

9.1 Steering Committee: [Composition, cadence]
9.2 Working team cadence: [Weekly / Bi-weekly standup]
9.3 Change order process:
    - All scope changes must be submitted in writing
    - Vendor provides impact assessment within [X] business days
    - Change order requires sign-off by [Client Role] and [Vendor Role]
9.4 Escalation path:
    L1: [Project Manager] → [Client PM]
    L2: [Delivery Lead] → [Client Director]
    L3: [Engagement Executive] → [Client VP/CXO]
9.5 Status reporting: [Weekly written status report; format defined in Appendix B]
9.6 RAID log: Maintained by Vendor PM; reviewed in weekly steering cadence

────────────────────────────────────────────────
10. PRELIMINARY RISK REGISTER  [Required]
────────────────────────────────────────────────

  Risk                    | Prob | Impact | Mitigation
  [Risk 1 description]    | H/M/L | H/M/L | [Mitigation action]
  [Risk 2 description]    | H/M/L | H/M/L | [Mitigation action]
  [Risk 3 description]    | H/M/L | H/M/L | [Mitigation action]

Risk register to be maintained and reviewed throughout the engagement per Section 9.6.

────────────────────────────────────────────────
11. COMPLIANCE, IP & LEGAL  [Required]
────────────────────────────────────────────────

11.1 Data classification: [Public / Internal / Confidential / Restricted]
11.2 Applicable regulations: [GDPR / HIPAA / SOC 2 / ISO 27001 / None]
     Compliance responsibility: [Vendor / Client / Shared — specify]
11.3 Intellectual property:
     Pre-existing IP: Each party retains ownership of its pre-existing IP
     Work product: [Client / Vendor / Joint ownership — specify]
     License grant: [If vendor retains IP, license terms for client's use]
11.4 Confidentiality: Governed by [NDA reference dated X]
11.5 AI governance [If applicable — required when AI tools are used in delivery]:
     AI systems used: [Named tools]
     Human oversight: [Checkpoint requirements]
     Audit rights: [Client's right to audit AI-generated outputs]
11.6 Subcontractors [If applicable]: [Named, with client notification obligations]

────────────────────────────────────────────────
SIGNATURES
────────────────────────────────────────────────

For and on behalf of [Client]:         For and on behalf of [Vendor]:
Name:                                  Name:
Title:                                 Title:
Date:                                  Date:
```

---

## Part IV — AI Review Engine: Prompt Architecture

The SOW quality popup (front-end experience) will present an AI-generated evaluation panel alongside the SOW content. The following defines how the AI analysis is structured.

### Evaluation Prompt Logic

For each section of the SOW, the AI engine produces:

1. **Section Score (0–10)** — numerical quality rating for this specific section
2. **Verdict** — one of: `Excellent` | `Good` | `Acceptable` | `Needs Revision` | `Missing`
3. **Strength** — one sentence on what this section does well (if score ≥ 6)
4. **Gap** — one to three specific, actionable gaps identified
5. **Recommendation** — one sentence telling the author exactly what to add or fix

### Strategic Alignment Check

Beyond individual section scoring, the engine performs a cross-section strategic alignment check:

- **Outcome-to-scope mapping:** Does every desired outcome (Section 2) have at least one deliverable (Section 6) that is traceable to it?
- **Scope-to-timeline mapping:** Does every workstream in Section 3 appear in the timeline (Section 7)?
- **Assumption-to-risk mapping:** Does every high-severity assumption have a corresponding risk in Section 10?
- **Commercial-to-scope consistency:** Does the pricing model in Section 8 make sense given the scope complexity in Section 3?

Misalignments are surfaced as cross-section flags in the AI analysis panel — separate from section-level scores.

### Deal Context Injection

The AI evaluation is not generic — it is grounded in the deal's context from the approval system:
- **Strategy pillars:** Outcome section is evaluated against the deal's stated strategy pillars (from the deal profile)
- **Client segment:** Compliance section is evaluated against the regulatory requirements field in the deal profile
- **Deal complexity:** Risk register expectations scale with the deal's `solution_complexity` rating
- **ECIF / investment:** Commercial section is checked against the `internal_investment_pct` and `azure_acr_percentage` fields

This ensures that the SOW review is not a static checklist but a **context-aware quality evaluation** tied to the specific deal being approved.

---

## Part V — Frontend Experience Concept

*Design brief for the SOW Quality interactive experience in the Deal Health Score panel.*

### Interaction Model

**Trigger:** The `SOW Quality` row in the Deal Health Score section displays a pulsing glow animation when the feature is enabled, signaling to the approver that this dimension has a drill-down available. A tooltip on hover reads: "Click to review SOW quality analysis."

**Pattern:** This interaction model — glowing clickable dimension → full-detail popup — will be the standard pattern for all Deal Health Score dimensions as they become enriched with drill-down content. SOW Quality is the first dimension to implement this pattern.

### Popup Layout

The popup is full-screen modal with a Microsoft Word-inspired chrome:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  ■ ■ ■   [Deal Name] — Statement of Work                      SOW Quality: 8.5 / 10  × │
│  ┌ ─ ─ File  Edit  View  Review  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  │                                              │                                      │ │
│  │         SOW CONTENT (LEFT PANE)              │      AI ANALYSIS (RIGHT PANE)        │ │
│  │         ~60% width, scrollable               │      ~40% width, sticky to section   │ │
│  │                                              │                                      │ │
│  │  ┌───────────────────────────────────────┐  │  ┌──────────────────────────────┐   │ │
│  │  │  1. Executive Summary                 │  │  │ ● Outcome Clarity     9.2    │   │ │
│  │  │                                       │  │  │ ● Scope Completeness  8.1    │   │ │
│  │  │  [SOW content rendered as a clean     │  │  │ ● Out-of-Scope        7.5    │   │ │
│  │  │   document, section-by-section,       │  │  │ ● Assumptions         8.8    │   │ │
│  │  │   with section headers matching       │  │  │ ● Timeline            9.0    │   │ │
│  │  │   the framework structure]            │  │  │ ● Commercial          8.2    │   │ │
│  │  │                                       │  │  │ ● Governance          7.9    │   │ │
│  │  │  2. Customer Desired Outcomes         │  │  │ ● Risk Visibility     8.5    │   │ │
│  │  │  [highlighted section — active]       │  │  └──────────────────────────────┘   │ │
│  │  │                                       │  │                                      │ │
│  │  │  3. Scope of Work                     │  │  Active Section Analysis:            │ │
│  │  │                                       │  │  ──────────────────────────          │ │
│  │  │  [...]                                │  │  Section: Customer Desired Outcomes   │ │
│  │  │                                       │  │  Score: 9.2 / 10 ● Excellent         │ │
│  │  └───────────────────────────────────────┘  │                                      │ │
│  │                                              │  Strength: Outcomes are measurable   │ │
│  │                                              │  and tied to the deal's Azure-first  │ │
│  │                                              │  strategy pillar.                    │ │
│  │                                              │                                      │ │
│  │                                              │  Gap: Success metric #2 (user        │ │
│  │                                              │  adoption) has no baseline value.    │ │
│  │                                              │                                      │ │
│  │                                              │  Rec: Add baseline adoption % before │ │
│  │                                              │  project start to make this metric   │ │
│  │                                              │  enforceable at acceptance.          │ │
│  │                                              │                                      │ │
│  │                                              │  ── Strategic Alignment Flags ──     │ │
│  │                                              │  ✓ Outcomes → Deliverables: Mapped   │ │
│  │                                              │  ✓ Scope → Timeline: Mapped          │ │
│  │                                              │  ⚠ Assumption 3 → Risk Register:    │ │
│  │                                              │    Not mitigated                     │ │
│  │                                              │                                      │ │
│  └─────────────────────────────────────────────┴──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Behavior Details

- **Section sync:** Scrolling the SOW content pane updates the active section in the right-side analysis panel (intersection observer pattern)
- **Section highlighting:** The active section in the SOW content is subtly highlighted (light blue left border, matching the MS Word "review" aesthetic)
- **Dimension score pills:** The scorecard at the top of the analysis panel uses color coding — emerald (≥8.5), blue (≥7.0), amber (≥5.5), red (<5.5) — consistent with the deal health score palette
- **Strategic alignment flags:** Rendered below the section analysis; ✓ for mapped, ⚠ for gaps
- **Chrome aesthetic:** The popup uses a Word-like toolbar (non-functional, decorative) with a document page shadow and serif or neutral document font — distinct from the app's UI chrome to signal "you are reading a document"

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-05-20 | Initial framework — SOW structure standard, AI evaluation dimensions, scoring tiers, template, and frontend concept |

---

*This document is the authoritative model for SOW quality evaluation within Delivery Excellence.*
*It governs the `sow_quality` dimension in the Deal Health Score and the SOW review popup experience.*
*Do not modify without alignment on the overall deal approval strategy.*
