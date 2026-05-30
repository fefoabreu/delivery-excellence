# AI-Driven Quality Assurance — Module Framework

## Executive Summary

This framework defines a new **AI-Driven Quality Assurance** module within the Delivery Excellence platform. It introduces a standalone QA Agent that continuously monitors the delivery portfolio, provides early warnings, drives project recovery, and builds an institutional knowledge network — all while partnering with human QA Directors rather than replacing them.

The module includes an industry-first **Client-Facing QA Agent** — a contract companion that gives clients transparent, proactive quality assurance visibility into their engagements.

> **Vision:** Transform quality assurance from a reactive, periodic review function into a proactive, always-on intelligence layer that predicts and prevents delivery failures before they impact clients and revenue.

---

## 1. Industry Context & Positioning

The IT professional services industry is undergoing a fundamental shift in how quality assurance operates. Here is where the market stands in 2026:

### What the Major Firms Are Doing

| Firm | Initiative | Key Insight |
|------|-----------|-------------|
| **EY** | Three-stage evolution toward agentic assurance | Agents continuously monitor data, flag issues early, enable agent-to-agent interactions between client and assurance systems |
| **KPMG** | Workbench — multi-agent orchestration (20+ agents) | Knowledge engineering identified as the bottleneck to agent value, not model capability. Built-in audit logs for every decision |
| **PwC** | Agent OS — 25,000 agents in production | Governance-first approach. First-to-market independent assurance service over AI systems |
| **BCG** | Agents-at-Scale suite | 17% of AI value from agents in 2025, reaching 29% by 2028. Harvard study: AI users 25% faster, 40%+ higher quality |

### What Is Emerging but Not Yet Standard

- **Client-facing QA agents as contract companions** — EY describes agent-to-agent exchanges, but no firm has productized a client-facing QA companion for project delivery transparency. **This is our differentiator.**
- **Lessons-learned knowledge graphs feeding live projects** — KPMG identifies knowledge architecture as the bottleneck. The industry talks about it; few have implemented it.

### What Is Industry Standard (Our Baseline)

- RAID-based health monitoring (Risks, Assumptions, Issues, Dependencies)
- RAG status frameworks (Red, Amber, Green) across health dimensions
- Periodic project and portfolio health reviews
- QA Director governance and intervention models

---

## 2. Agent Architecture — The QA Agent within the Ecosystem

The QA Agent operates as an autonomous, always-on agent that monitors the delivery portfolio and feeds intelligence into the existing Delivery Agent. It follows the industry-standard multi-agent orchestration pattern.

### Ecosystem Map

```
+---------------------------------------------------------------------+
|                      AGENT ECOSYSTEM                                 |
|                                                                      |
|  +------------+     +----------------+     +---------------------+   |
|  | Pipeline   |---->|  Delivery      |<----|  QA Agent           |   |
|  | Agent      |     |  Agent         |     |  (THIS MODULE)      |   |
|  +------------+     +----------------+     +---------+-----------+   |
|       |                    |                         |               |
|       |                    |               +---------+---------+     |
|       |                    |               |                   |     |
|       v                    v               v                   v     |
|  Deal Approvals     Delivery Mgmt    Internal QA        Client-Facing|
|  (existing)         (existing)       Agent              QA Agent     |
|                                      (core)             (companion)  |
|                                         |                    |       |
|                                         v                    v       |
|                                 +----------------+  +----------------+
|                                 | Knowledge      |  | Client         |
|                                 | Graph          |  | Transparency   |
|                                 | (Lessons       |  | Portal         |
|                                 |  Learned)      |  |                |
|                                 +----------------+  +----------------+
+---------------------------------------------------------------------+
```

### Two Personas, One Intelligence Core

| Persona | Role | Audience |
|---------|------|----------|
| **Internal QA Agent** | Portfolio guardian — monitors, warns, advises, rescues | QA Directors, Delivery Leads, Executives |
| **Client-Facing QA Agent** | Contract companion — transparent status, proactive communication | Client stakeholders |

### Data Flow

```
Delivery Projects ──> Health Dimensions ──> QA Agent (monitoring loop)
       |                                        |
  RAID Logs ────────────────────────────────>    |
  Milestones ───────────────────────────────>    |
  Status Updates ───────────────────────────>    |
  Budget/Actuals ───────────────────────────>    |
                                                |
                         +----------------------+----------------------+
                         |                      |                      |
                         v                      v                      v
                  Early Warnings         Health Reviews         Knowledge Network
                         |                      |                      |
                         v                      v                      v
                  Get-to-Green           Regional Reviews       Pipeline Agent
                  Plans                  (nominations)          (deal risk profiles)
                         |
                         v
                  Client-Facing Portal
                  (curated transparency)
```

---

## 3. Core Capabilities — The 7 Pillars

### Pillar 1: Engagement Setup Assurance (30-60-90 Day Assessments)

**Purpose:** Ensure the largest engagements are set up correctly to enhance their success rate.

**Industry alignment:** EY's "early identification" principle + KPMG's knowledge-driven setup validation.

**Applicability:** Mandatory for top-quartile engagements by contract value. Optional (but recommended) for all others.

| Checkpoint | Timing | Focus Area | What the Agent Validates |
|-----------|--------|------------|------------------------|
| **Day 30 — Foundation** | 30 days after project start | Governance, team, tooling, baselines | RAID log initialized, PM assigned, budget baseline set, client kickoff completed, SOW milestones mapped to delivery plan |
| **Day 60 — Momentum** | 60 days after project start | First deliverables, velocity, client rapport | Milestone #1 on track, burn rate within tolerance (< 1.15x planned), satisfaction signal positive, no unmitigated high-severity risks |
| **Day 90 — Steady-State** | 90 days after project start | Delivery cadence, risk stabilization | Health dimensions trending green, escalation paths tested, first lessons captured, client communication cadence established |

**Output:** A **Setup Maturity Score** (0-100) per checkpoint, with specific criteria met/gap analysis. Gaps are surfaced to the QA Director with recommended remediation actions.

**Key Metric:** Correlation between Setup Maturity Score at Day 90 and final project outcome — proving that good setup drives good delivery.

---

### Pillar 2: Preemptive Monitoring (Always-On Surveillance)

**Purpose:** Continuously analyze project signals to detect problems before they become crises.

**Industry alignment:** EY's "agents continuously monitoring and analyzing data" + BCG's anomaly detection model.

The agent monitors five signal categories from existing delivery data:

#### Signal Categories

| Signal | What It Detects | Data Source |
|--------|----------------|-------------|
| **RAID Log Analysis** | Sentiment drift in risk descriptions, accumulating unresolved issues, dependency clusters forming | RAID items (existing) |
| **Health Dimension Trends** | Rate of change across dimensions — a project moving Green to Amber across 2 dimensions in one week is higher priority than a stable Amber project | Health status history |
| **Budget Burn Analysis** | Burn rate vs. completion percentage divergence — flagging projects >60% burned but <40% complete | Budget, actuals, completion_pct |
| **Milestone Velocity** | Acceleration or deceleration of milestone completion against planned cadence | Milestones (existing) |
| **Satisfaction Drift** | Changes in client satisfaction signals, escalation frequency patterns | Status updates, escalations |

#### Early Warning Composite Score

All signals combine into a single 0-100 risk score that predicts probability of the project deteriorating:

```
Early Warning Score = w1(RAID_severity)
                    + w2(health_trend_velocity)
                    + w3(burn_completion_gap)
                    + w4(milestone_slip_rate)
                    + w5(satisfaction_trend)
                    + w6(escalation_frequency)
```

The weights (w1-w6) are initially set by domain expertise and refined over time using the Eval model (see Section 5) based on which signals best predicted actual outcomes.

#### Prediction Horizon

For each project, the agent maintains rolling predictions:
- **30-day forecast:** Predicted RAG status in 30 days
- **60-day forecast:** Predicted RAG status in 60 days
- **90-day forecast:** Predicted RAG status in 90 days

---

### Pillar 3: Periodic Project Health Reviews

**Purpose:** Structured individual project assessments at a regular cadence.

**Industry alignment:** Standard RAG status framework + RAID log best practices.

**Cadence:** Configurable per project (weekly for Red/Amber, biweekly for Green).

#### What the Agent Produces

For each review cycle, the agent auto-generates a **Health Review Brief**:

1. **Current State Snapshot** — Latest health dimensions, RAID summary, milestone status, budget position
2. **Trajectory Analysis** — Current health vs. the project's own historical trend and vs. portfolio benchmarks
3. **Anomaly Detection** — "This project's budget burn is 2 standard deviations above portfolio average for its phase"
4. **QA Assessment** — A recommendation from one of four outcomes:

| Assessment | Meaning | Trigger Criteria |
|-----------|---------|-----------------|
| **Continue** | Healthy, no intervention needed | All dimensions Green, EW score < 40 |
| **Watch** | Monitor more closely, increase review frequency | Any dimension Amber or EW score 40-60 |
| **Intervene** | QA Director should engage the project team | Any dimension Red or EW score 60-80 |
| **Escalate** | Executive visibility required | 2+ dimensions Red or EW score > 80 |

5. **Action Tracking** — Whether previous review recommendations were actioned by the project team

---

### Pillar 4: Monthly Regional Health Reviews

**Purpose:** Provide leadership with a curated, AI-prepared view of regional delivery quality.

**Industry alignment:** Standard practice across Accenture, Deloitte, and all major IT services firms. The innovation is in automating the nomination, preparation, and follow-up.

#### 4.1 Nomination Engine

The agent auto-selects candidate projects for leadership review based on:

| Nomination Criteria | Rationale |
|--------------------|-----------|
| Highest early warning scores | Most likely to need leadership attention |
| Largest value-at-risk (contract value x risk probability) | Biggest financial exposure |
| Projects crossing RAG thresholds this period | Status changes signal inflection points |
| Projects at 30/60/90 day checkpoints | Setup quality gates |
| Recent escalations or satisfaction dips | Active client-impact situations |
| Random Green project sample (10%) | Validation that "healthy" is genuinely healthy |

The nominated list is presented as a **live, interactive view** — leadership can confirm, defer, or add projects before the review.

#### 4.2 Preparation Assistant

For each confirmed project in the review, the agent helps the Project Team prepare:

- **Pre-populated review deck** with current health data, trends, and AI commentary
- **Anticipated questions** — talking points for what leadership will likely probe on
- **Proactive mitigations** — suggested actions the PM should present alongside Red/Amber items
- **Peer comparison** — "Similar projects in your region at this phase typically have a burn rate of X% vs. your Y%"

#### 4.3 Post-Review Tracker

After the review session:
- Records leadership decisions and action items
- Assigns owners and due dates
- Tracks action items to closure
- Reports completion rate in the next review cycle

---

### Pillar 5: Executive Early Warning & Get-to-Green

**Purpose:** Alert executives before projects go Red, and provide structured recovery plans for projects already in trouble.

**Industry alignment:** ElevatIQ's recovery methodology + EY's escalation-and-oversight model.

#### 5.1 Tiered Alert System

Mirrors the Deal Approvals tier pattern:

| Alert Level | Trigger | Who Is Notified | Response Expected |
|------------|---------|----------------|-------------------|
| **Watch** | Early warning score > 60 | PM + Delivery Lead | Acknowledge, update RAID log, address flags |
| **Caution** | Score > 75 OR any dimension turns Red | QA Director | Review within 48 hours, decide on intervention |
| **Critical** | Score > 85 OR 2+ dimensions Red | Executive team | AI-generated risk brief delivered, executive review within 1 week |

Each alert includes:
- The triggering signals (what changed)
- AI-generated narrative explaining the risk
- Recommended immediate actions
- Historical context (similar projects and their outcomes)

#### 5.2 Get-to-Green Plans

For projects in Red or Amber status, the agent generates and manages a structured recovery plan:

**Step 1 — Diagnose:** Analyze RAID log patterns, health dimension history, milestone failures, and budget trajectory to identify root causes.

**Step 2 — Plan:** Generate a structured Get-to-Green plan:

| Plan Component | Content |
|---------------|---------|
| Root Cause Analysis | What specifically went wrong, supported by data |
| Immediate Actions | "Stop the bleeding" — actions needed in the first 5 business days |
| 30-Day Recovery Milestones | Measurable recovery targets with owners |
| Resource/Budget Recommendations | Whether additional staffing, budget, or expertise is needed |
| Success Criteria | Specific conditions that define "back to Green" |

**Step 3 — Track:** Weekly progress assessments against the plan:
- Are immediate actions completed?
- Are recovery milestones being hit?
- Is the early warning score trending down?

**Step 4 — Evaluate & Escalate:** If recovery stalls (2+ consecutive weeks off-track), the agent escalates with a recommendation to either adjust the plan or trigger Rescue Mode.

---

### Pillar 6: Lessons Learned Knowledge Network

**Purpose:** Build institutional memory from project outcomes and make it available to live and upcoming projects.

**Industry alignment:** Agentic AI + Knowledge Graphs — identified by KPMG as the key to AI agent value. Nearly half of organizations cite data reusability (47%) as their top challenge.

#### Knowledge Lifecycle

```
  CAPTURE                CLASSIFY                CONNECT               FEED
+-----------+      +-----------------+      +--------------+      +-------------+
| Project   |      | Tag by:         |      | Match new    |      | Pipeline    |
| completes |----->| - Service line  |----->| projects     |----->| Agent       |
| (or fails)|      | - Industry      |      | against      |      | (deal risk) |
|           |      | - Project size  |      | knowledge    |      |             |
| Extract:  |      | - Failure mode  |      | network      |      | Delivery    |
| - Risks   |      | - Success       |      |              |      | Agent       |
| - What    |      |   pattern       |      | "3 similar   |      | (guidance)  |
|   worked  |      | - Region        |      |  projects    |      |             |
| - What    |      | - Phase         |      |  had scope   |      | QA Agent    |
|   didn't  |      |                 |      |  creep..."   |      | (model      |
+-----------+      +-----------------+      +--------------+      |  tuning)    |
                                                                   +-------------+
```

#### Connection to the Agent Ecosystem

| Consumer Agent | What It Receives | Business Impact |
|---------------|-----------------|-----------------|
| **Pipeline Agent** | Historical success/failure rates for similar deals | Better risk profiles in deal approvals: "Projects like this have a 72% success rate historically" |
| **Delivery Agent** | Phase-specific guidance from past projects | Proactive delivery guidance: "At this phase, teams typically encounter X — here's what worked" |
| **QA Agent (self)** | Outcome data to tune early warning weights | Improving prediction accuracy over time |

#### Knowledge Categories

| Category | Examples |
|----------|---------|
| **Success Patterns** | "Fixed-scope projects with weekly client demos had 89% green completion" |
| **Failure Modes** | "T&M projects without burn-rate alerts exceeded budget by 35% on average" |
| **Risk Mitigations** | "Adding a technical architect at Day 30 reduced scope-creep risk by 60%" |
| **Process Improvements** | "Bi-weekly RAID reviews (vs. monthly) correlated with 40% fewer escalations" |

---

### Pillar 7: Human-AI Collaboration (QA Director Partnership)

**Purpose:** Amplify human QA Directors, not replace them. The agent handles volume; the human handles judgment.

**Industry alignment:** EY's "human professionals retain professional judgment and approval authority" + PwC's governance-first approach.

#### Responsibility Matrix

| The Agent Does | The QA Director Does |
|---------------|---------------------|
| Monitors 100% of portfolio continuously | Focuses on the 10-15% that needs human judgment |
| Generates health assessments and recommendations | Validates AI assessments, overrides when context requires |
| Prepares review materials and talking points | Leads reviews, facilitates discussions, makes intervention decisions |
| Tracks Get-to-Green plan execution | Owns the relationship with struggling project teams |
| Alerts on threshold breaches | Decides escalation timing and messaging to executives |
| Captures and classifies lessons learned | Validates lesson quality and applicability |

#### Override & Feedback Loop

The QA Director can override any AI assessment. Every override is captured and used to improve the model:
- "AI said Intervene, Director said Continue" — why? Was there context the agent lacked?
- "AI said Continue, Director escalated" — what signals did the agent miss?

This creates the same alignment tracking used in Deal Approvals Evals.

#### Rescue Mode

When a project enters rescue status (critical Get-to-Green or executive-escalated), the agent becomes a dedicated companion to the assigned QA specialist:

| Rescue Mode Feature | Detail |
|--------------------|--------|
| **Monitoring Cadence** | Daily health checks with tighter thresholds (vs. weekly) |
| **Progress Tracking** | Automated tracking against the recovery plan with daily status |
| **Communication Support** | Draft stakeholder communications for the QA specialist to review/send |
| **Pattern Matching** | Surface past successful rescues from the knowledge network with similar profiles |
| **Exit Criteria** | Clear, measurable criteria for exiting rescue mode back to normal monitoring |

> **Deep-dive:** The QA Director's executive-oversight engagement and Rescue Mode are expanded into a full operating model in **Section 11 — Executive Oversight & Rescue Engagement Model**. That section defines the Engagement Intensity Ladder, the rescue lifecycle, the Executive Recovery Board, and how this is showcased in the environment.

---

## 4. The Client-Facing QA Agent — The Differentiator

### The Concept

A curated, permission-controlled quality assurance experience for clients. No major firm has productized this — it is the single most differentiating element of this framework.

> **Value proposition to clients:** "You hired us because you trust our delivery capability. This agent gives you real-time confidence in that delivery — proactively, transparently, and on your terms."

> **Value proposition to sales:** "We offer something no other firm does — an AI-powered contract companion that keeps your clients informed and confident throughout delivery. This is a competitive differentiator in proposals."

### Transparency Model

| Feature | What the Client Sees | What Stays Internal |
|---------|---------------------|-------------------|
| **Project Health** | Curated RAG status with plain-language narrative | Raw health dimensions, internal scoring formulas |
| **Milestones** | Progress against contracted deliverables and SOW milestones | Internal velocity metrics, PM performance data |
| **Risk Communication** | Proactive risk disclosure with planned mitigations | Full RAID log details, internal escalation chains |
| **Quality Metrics** | Delivery quality KPIs agreed in the contract | Portfolio benchmarks, peer comparisons |
| **Status Check-ins** | AI-generated summaries at the agreed cadence | Get-to-Green plans, rescue mode details |

### Operating Model

1. **Transparency Layer** — The agent generates client-appropriate summaries from internal data, applying a **disclosure policy** configured per contract:
   - **Minimal** — Monthly summary, Green/Amber/Red only, milestone status
   - **Standard** — Biweekly narrative, disclosed risks with mitigations, KPIs
   - **Transparent** — Weekly detail, full risk visibility, shared action tracking

2. **Proactive Communication** — Instead of clients chasing for updates, the agent proactively shares progress and flags upcoming risks before the client has to ask.

3. **Contract Alignment** — Maps delivery progress against SOW milestones and acceptance criteria, so the client sees their contract being fulfilled in real time.

4. **Feedback Loop** — Captures client sentiment from interactions (response patterns, questions asked, concerns raised), feeding back into the internal QA agent's health model. A client asking more questions than usual is itself a health signal.

5. **Trust Building** — Over time, this positions the firm as uniquely transparent, becoming a competitive differentiator in new proposals.

### Client Portal Capabilities (Future)

| Capability | Description |
|-----------|-------------|
| **Dashboard View** | Client-branded view showing their active engagements and health status |
| **Milestone Tracker** | Visual progress against contracted deliverables |
| **Risk Register (curated)** | Disclosed risks with mitigation status — what we know and what we're doing about it |
| **Communication History** | All AI-generated updates and agent interactions in one timeline |
| **Satisfaction Input** | Structured channel for client to provide feedback, concerns, or praise |

---

## 5. Evaluation Model — Proving Value to the Business

### Objective-Key Results (OKR) Framework

Following the same OKR pattern established in the Deal Approvals module:

**Objective:** *Maximize delivery quality and client satisfaction through AI-driven proactive quality assurance*

| Key Result | Metric | Target | How It's Measured |
|-----------|--------|--------|-------------------|
| **KR1: Early Detection** | % of Red projects predicted >30 days before status change | >= 70% | Agent warning log vs. actual status transitions |
| **KR2: Recovery Rate** | % of Get-to-Green plans returning to Green within 60 days | >= 60% | G2G plan tracking data |
| **KR3: Portfolio Health** | % of active projects maintaining Green status | >= 75% | Health dimension aggregation across portfolio |
| **KR4: Review Efficiency** | Reduction in time spent preparing regional health reviews | 40% reduction | Before/after time tracking per review cycle |
| **KR5: Knowledge Reuse** | % of new projects receiving relevant lessons-learned at kickoff | >= 80% | Knowledge network match rate at Day 30 |
| **KR6: Client Satisfaction** | NPS delta for projects using client-facing QA agent | >= +15 points | Client survey comparison (with vs. without) |

### Leading KPIs

| KPI | What It Measures | Target Direction |
|-----|-----------------|-----------------|
| Average early warning score across portfolio | Overall portfolio risk level | Lower is better |
| Mean time from warning to intervention | Response speed to alerts | Lower is better |
| RAID log coverage rate | % of projects with up-to-date RAID logs | Higher is better |
| 30-60-90 checkpoint completion rate | Setup assurance compliance | Higher is better |
| Knowledge contribution rate | Lessons captured per closed project | Higher is better |
| QA Director override rate | AI-human alignment | Declining over time |

### Eval Correlation (Tying to Deal Approvals)

Similar to the existing Evals page, this module tracks whether the QA Agent's assessments correlate with actual outcomes:

| Eval Question | How We Answer It |
|--------------|-----------------|
| Did projects the agent flagged as risky actually go Red? | Precision of early warning predictions |
| Did projects rated as healthy stay Green? | Specificity of the model — avoiding false positives |
| Do higher Setup Maturity Scores correlate with better outcomes? | Proving the 30-60-90 checkpoint value |
| Do projects with Get-to-Green plans recover faster than those without? | Proving intervention value |
| Does knowledge network usage improve new project outcomes? | Proving lessons-learned value |

This creates a continuous feedback loop that improves the model over time.

---

## 6. Data Model

### New Types (extending existing `types/index.ts`)

```typescript
// ── Quality Assurance Types ───────────────────────────────────────────

type QAAlertLevel = 'watch' | 'caution' | 'critical';
type QAAssessment = 'continue' | 'watch' | 'intervene' | 'escalate';
type CheckpointPhase = 'day_30' | 'day_60' | 'day_90';
type G2GStatus = 'active' | 'on_track' | 'stalled' | 'resolved' | 'escalated';

// Pillar 2: Early Warning
interface EarlyWarningScore {
  project_id: string;
  score: number;                    // 0-100 composite risk score
  components: {
    raid_severity: number;          // weighted RAID log signal
    health_trend_velocity: number;  // rate of health dimension change
    burn_completion_gap: number;    // budget burn vs completion divergence
    milestone_slip_rate: number;    // milestone delivery deceleration
    satisfaction_trend: number;     // client satisfaction trajectory
    escalation_frequency: number;   // escalation pattern signal
  };
  prediction_30d: HealthStatus;     // predicted RAG status in 30 days
  prediction_60d: HealthStatus;
  prediction_90d: HealthStatus;
  alert_level: QAAlertLevel | null;
  calculated_at: string;
}

// Pillar 1: Engagement Checkpoints
interface EngagementCheckpoint {
  id: string;
  project_id: string;
  phase: CheckpointPhase;
  due_date: string;
  completed_date?: string;
  maturity_score: number;           // 0-100 Setup Maturity Score
  criteria_met: string[];
  criteria_gaps: string[];
  ai_assessment: string;            // narrative assessment
  qa_director_override?: string;    // director's override if any
  status: 'pending' | 'passed' | 'flagged' | 'waived';
}

// Pillar 5: Get-to-Green Plans
interface GetToGreenPlan {
  id: string;
  project_id: string;
  status: G2GStatus;
  root_causes: string[];
  immediate_actions: {
    action: string;
    owner: string;
    due: string;
    done: boolean;
  }[];
  recovery_milestones: {
    milestone: string;
    target_date: string;
    status: string;
  }[];
  success_criteria: string[];
  created_at: string;
  target_green_date: string;
  weekly_assessments: {
    date: string;
    on_track: boolean;
    notes: string;
  }[];
}

// Pillar 4: Regional Review Nominations
interface QAReviewNomination {
  id: string;
  project_id: string;
  review_period: string;            // e.g., "2026-05"
  region: string;
  nomination_reason: string;
  early_warning_score: number;
  value_at_risk: number;
  ai_talking_points: string[];
  preparation_notes: string;
  status: 'nominated' | 'confirmed' | 'presented' | 'deferred';
  post_review_actions: {
    action: string;
    owner: string;
    due: string;
    done: boolean;
  }[];
}

// Pillar 6: Lessons Learned
interface LessonLearned {
  id: string;
  source_project_id: string;
  category: 'success_pattern' | 'failure_mode'
          | 'risk_mitigation' | 'process_improvement';
  title: string;
  description: string;
  tags: {
    service_line: string;
    industry: string;
    project_size: string;
    region: string;
    phase: string;
  };
  applicability_score: number;      // how broadly applicable (0-100)
  times_consumed: number;           // how many projects used this lesson
  linked_projects: string[];        // projects that consumed this lesson
  created_at: string;
}

// Section 4: Client-Facing QA
type DisclosurePolicy = 'minimal' | 'standard' | 'transparent';

interface ClientQAView {
  project_id: string;
  client_health_status: HealthStatus;
  client_narrative: string;         // AI-generated client-appropriate summary
  milestone_progress: {
    name: string;
    status: string;
    due: string;
    completion_pct: number;
  }[];
  disclosed_risks: {
    risk: string;
    mitigation: string;
    status: string;
  }[];
  next_update_date: string;
  disclosure_policy: DisclosurePolicy;
  client_sentiment_signals: string[];
}

// Section 5: QA Evals
interface QAEvalMetrics {
  prediction_accuracy: {
    true_positives: number;         // predicted Red, went Red
    false_positives: number;        // predicted Red, stayed Green
    true_negatives: number;         // predicted Green, stayed Green
    false_negatives: number;        // predicted Green, went Red
    precision: number;
    recall: number;
  };
  recovery_stats: {
    total_g2g_plans: number;
    resolved_within_60d: number;
    recovery_rate: number;
    avg_recovery_days: number;
  };
  alignment: {
    total_assessments: number;
    director_overrides: number;
    override_rate: number;
    override_breakdown: {
      ai_too_aggressive: number;    // AI said escalate, director said continue
      ai_too_lenient: number;       // AI said continue, director escalated
    };
  };
  checkpoint_correlation: {
    high_maturity_green_rate: number;  // % of high-maturity projects staying Green
    low_maturity_red_rate: number;     // % of low-maturity projects going Red
  };
}
```

---

## 7. UI Module Structure

### Sidebar Placement

The new entry sits under the existing **DELIVERY** section in the sidebar:

```
DELIVERY
  Handoff Center          (existing)   /handoffs
  Delivery Projects       (existing)   /delivery
  AI Quality Assurance    (NEW)        /quality-assurance
```

### Tab-Based Layout

The QA page uses a tabbed interface (consistent with Deal Approvals pattern):

| Tab | Route Suffix | Primary Content |
|-----|-------------|-----------------|
| **Portfolio Monitor** | (default) | Live heatmap of all projects with early warning scores. Filterable by region, status, risk level. Color-coded cards with trend indicators |
| **Checkpoints** | /checkpoints | 30-60-90 day assessment tracker for top-tier engagements. Timeline view showing upcoming, passed, and flagged checkpoints |
| **Health Reviews** | /reviews | Monthly regional review preparation. Nominated projects list, prep materials, post-review action tracking |
| **Get-to-Green** | /get-to-green | Active recovery plans with progress tracking. Kanban-style board: Active > On Track > Stalled > Resolved |
| **Knowledge Network** | /knowledge | Lessons learned library with search, tagging, and relevance matching. Shows which lessons are being consumed by live projects |
| **Client Portal** | /client-portal | Configuration and preview of client-facing QA views per project. Disclosure policy settings |
| **QA Evals** | /evals | Agent performance metrics — prediction accuracy, recovery rates, alignment tracking, OKR panel |

### OKR Panel (Top of Page)

Following the Deal Approvals pattern, the top of the QA page features an OKR panel showing:
- The Objective statement
- KR progress bars (KR1-KR6)
- Leading KPI tiles
- Agent health indicator (how well the QA Agent itself is performing)

---

## 8. Innovation Matrix — What's Novel vs. Industry Standard

| Element | Industry Status | Our Approach |
|---------|----------------|-------------|
| RAID-based health monitoring | Industry standard | Baseline — enhanced with AI trend analysis |
| RAG status + health dimensions | Industry standard | Baseline — existing in Delivery module |
| 30-60-90 checkpoints for large engagements | Best practice, rarely automated | **Automated with Setup Maturity Score** |
| AI-driven early warning scores | Emerging (EY, BCG doing variants) | **Composite score with prediction horizon** |
| Monthly review nomination engine | Standard process, manual execution | **Automated nomination + preparation assistant** |
| Get-to-Green plan generation + tracking | All firms do this manually | **AI-generated plans with weekly tracking** |
| Lessons learned knowledge network | Aspirational industry-wide, KPMG leading | **Connected to Agent Ecosystem (Pipeline + Delivery)** |
| QA Director partnership model | Aligned with EY/PwC governance | **Override tracking feeding into Evals** |
| Executive oversight / project rescue | Mature human discipline; agentic versions only oversee *AI agents* | **AI as chief-of-staff for a human-led rescue — Intensity Ladder + war-room cockpit (Section 11)** |
| Eval model (QA predictions vs. outcomes) | Novel for QA domain | **Pioneered in Deal Approvals, extended here** |
| **Client-facing QA companion agent** | **No firm has productized this** | **Industry-first differentiator** |

---

## 9. Implementation Phases

### Phase 1: Foundation (Build First)
- Portfolio Monitor with early warning scores
- Preemptive monitoring engine
- OKR panel and QA Evals baseline
- Sidebar integration and routing

### Phase 2: Intervention
- 30-60-90 engagement checkpoints
- Get-to-Green plan generation and tracking
- Executive alert system

### Phase 3: Intelligence
- Monthly regional health review (nomination + preparation)
- Lessons learned knowledge network
- Agent Ecosystem connections (Pipeline Agent, Delivery Agent feeds)

### Phase 4: Differentiation
- Client-Facing QA Agent
- Client transparency portal
- Disclosure policy configuration
- Client sentiment feedback loop

---

## References & Industry Sources

- [QA Trends for 2026: AI, Agents, and Agentic Testing — Tricentis](https://www.tricentis.com/blog/qa-trends-ai-agentic-testing)
- [Agentic Quality Assurance Guide — Tricentis](https://www.tricentis.com/learn/agentic-quality-assurance)
- [The $200B Agentic AI Opportunity for Tech Services — BCG](https://www.bcg.com/publications/2026/the-200-billion-dollar-ai-opportunity-in-tech-services)
- [2026 AI in Professional Services Report — Thomson Reuters](https://www.thomsonreuters.com/en-us/posts/technology/ai-in-professional-services-report-2026/)
- [Re-architecting Assurance with Agentic AI — EY](https://www.ey.com/en_us/insights/assurance/re-architecting-assurance-with-agentic-ai)
- [Why Knowledge Engineering is Key to AI Agent Value — KPMG](https://kpmg.com/us/en/articles/2026/why-knowledge-engineering-is-the-key-to-ai-agent-value.html)
- [EY, KPMG, PwC: Three Governance Philosophies — Medium](https://medium.com/agentic-ai-systems-and-the-future-ahead/eys-100-000-agent-ambition-kpmg-s-trust-first-pwc-s-scale-first-three-governance-philosophies-63c1593a8ea0)
- [PwC Assurance for AI Systems](https://www.pwc.com/us/en/about-us/newsroom/assurance-ai-press-release.html)
- [AI Project Recoveries — ElevatIQ](https://www.elevatiq.com/expertise/ai-project-recoveries/)
- [Agentic AI + Knowledge Graphs — USDSI](https://www.usdsi.org/data-science-insights/agentic-ai-meets-knowledge-graphs-future-of-autonomous-systems)
- [Agentic AI Strategy — Deloitte Insights](https://www.deloitte.com/us/en/insights/topics/technology-management/tech-trends/2026/agentic-ai-strategy.html)
- [RAG Status Meanings & Best Practice — Eleco](https://eleco.com/pm3/knowledge-centre/how-many-rags/)
- [RAID Log Guide — Asana](https://asana.com/resources/raid-log)
- [Five Critical First Steps in Recovering Troubled Projects — PMI](https://www.pmi.org/learning/library/critical-steps-recovering-troubled-projects-7352)
- [Rescuing Troubled Projects: Tools, Tactics, and the Courage to Course-Correct — UW InterPro](https://interpro.wisc.edu/rescuing-troubled-projects-tools-tactics-and-the-courage-to-course-correct/)
- [Troubled Projects: Key Strategies for Quick Turnarounds — PM Solutions](https://www.pmsolutions.com/white_papers/Troubled_Projects.pdf)
- [Defining a CIO Playbook on Agentic AI — EY](https://www.ey.com/en_us/ey-center-for-executive-leadership/defining-a-cio-playbook-on-agentic-ai)
- [Kyndryl Launches Agentic Service Management (maturity model + structured assessments) — PR Newswire](https://www.prnewswire.com/news-releases/kyndryl-launches-agentic-service-management-to-power-ai-native-infrastructure-services-and-intelligent-workflows-302731945.html)
- [2026 Hype Cycle for Agentic AI (governance, FinOps, oversight) — Gartner](https://www.gartner.com/en/articles/hype-cycle-for-agentic-ai)

---

## 10. Design & Experience Principles

The module is built for two distinct audiences. Each audience has a deliberately different visual experience that signals the boundary between internal governance and client engagement.

### 10.1 Internal Audience — Microsoft Executives (Power BI Look & Feel)

The four operational tabs of the QA module (Portfolio Monitor, Checkpoints, Health Reviews, Get-to-Green) are styled as **Power BI executive reports**. This is intentional and load-bearing:

| Principle | Why It Matters |
|-----------|---------------|
| **Power BI title bar** | Slate-900 header with the Microsoft yellow Power BI badge, report name, "Live" indicator, and "Last refresh" timestamp. Executives recognize this immediately as a Microsoft-native business intelligence surface. |
| **Slicer ribbon** | Power BI-style filter pills sit directly below the title bar. Filters feel like report slicers, not form inputs. |
| **KPI tiles** | Large bold numbers (text-3xl), small uppercase labels, colored accent bars at the top of each tile. The numbers are the hero, not the chrome. |
| **Visual grid** | Each tab shows a 3-column row of visuals — typically two donut charts and one horizontal bar chart — before the detail list below. Charts use SVG with simple, Power BI-style palettes. |
| **Detail visual** | The bottom of each tab is a "Detail" visual containing the full list of items (projects, checkpoints, plans). Treated as a Power BI matrix visual with consistent card styling. |
| **Microsoft yellow accent** | The Power BI logo color (#F2C811) is the signature accent — used sparingly to anchor the visual identity. |

**Rule:** Anything in the four operational tabs should look like it could live in a Microsoft executive's Power BI workspace. Anything outside the tabs (OKR panel, header, framework page, evals page) uses the standard Delivery Excellence styling.

### 10.2 External Audience — Client (Distinct Client Portal Environment)

The Client-Facing QA Agent is a **secure, client-centric environment that lives outside the Contoso environment**. Two design moves make this credible:

1. **Browser chrome simulation** — The portal renders inside a fake browser chrome showing a distinct URL (`{client}.partner-portal.contoso.com`) with a green TLS lock and "Secure · TLS 1.3 · Client SSO" indicator. This signals the client is on their own secure subdomain, not inside Contoso's internal tooling.

2. **Different visual identity** — The portal uses a **sky/teal gradient palette** (sky-500 → teal-500) instead of the Contoso navy/blue. The client logo placeholder, "Partner Project Portal" branding, and welcome message ("Welcome, Client Executive") all reinforce that this is the client's portal, served by Contoso.

### 10.3 The Client Portal Has Two Modes

A toggle at the top of `/qa-client-portal` switches between:

| Mode | Audience | Purpose |
|------|---------|---------|
| **Client Portal Preview** (default) | Contoso staff reviewing the client experience | Renders the full external portal exactly as the client would see it — browser chrome, client branding, dashboard cockpit, AI assistant |
| **Internal Audit View** | Contoso QA Directors, account leads | Auditable log of what has been disclosed to the client — narratives, milestones shared, risks disclosed — plus the internal-only sentiment signals captured from client interactions |

### 10.4 The Client AI Assistant — Suggested-First, Not Blank-Slate

The AI Assistant on the client portal is the most innovative element. It must **lead with suggestions, not wait for prompts**. Design rules:

- **Welcome message** introduces the assistant and the project by name, then immediately offers categories to explore — not an empty text box
- **Four suggestion categories** are always visible: *Project Goals & Vision*, *Progress & Milestones*, *Risks & Mitigations*, *Strategic Decisions*. The client never has to figure out what to ask
- **Project-aware suggested questions** — each category surfaces 3 concrete questions that reference the actual project (e.g., "What are the key business outcomes {Client} is aiming for with this engagement?")
- **Discussion seed panel** — a "Discuss with Your Team" card suggests topics for the client's next steering committee. The AI is proactively helping the client lead their own internal conversations about the project
- **Chat input is secondary** — the input bar sits at the bottom; suggestions are the primary interface. Clicking any suggested question pre-fills the input so the client can edit before sending
- **Confidentiality footprint** — "Confidential to {Client}" tagline reinforces that the AI is scoped to their project only

### 10.5 Why This Matters Strategically

For Microsoft executives reviewing the platform, the Power BI aesthetic immediately positions QA Excellence as a Microsoft-native operating system for delivery — not yet another consulting tool. For Contoso clients, the distinct external portal positions Contoso as the only firm that gives them their own AI-powered project companion. Both audiences see a polished, intentional experience designed for their decision-making.

---

## 11. Executive Oversight & Rescue Engagement Model (Pillar 7 Deep-Dive)

This section turns Pillar 7 (Human-AI Collaboration / QA Director Partnership) from a principle into an **operating model**. It answers a specific question: *when an engagement needs more than monitoring — when a QA Director must personally step in either to maximize performance or to recover a failing project — how does that engagement work, and what does the agent do alongside the human?*

### 11.1 Where the Industry Is (2026) — and the Open Lane

**Turnaround / recovery practice is mature and consistent.** Across the project-recovery literature (PMI, PM Solutions, university PM programs), troubled-project recovery follows a stable spine, regardless of vendor:

1. **Establish true status** — a rapid, independent audit, because *reported* status is almost never *actual* status in a troubled project.
2. **Recovery charter agreed with the sponsor and steering committee** — recovery is re-chartered, not "continued."
3. **Stabilize, then re-plan** — stop the bleeding (freeze scope, secure resources), then revise scope / schedule / team.
4. **Tighter governance during recovery** — elevated cadence, an empowered recovery board, sometimes a leadership change.
5. **Measurable exit** — explicit criteria for returning to normal delivery.

Two findings are load-bearing for our design:
- **Active executive sponsor support is the single strongest predictor of recovery success.** Its absence is the most common cause of failed recoveries. → Our model makes the *sponsor and an Executive Recovery Board first-class objects*, not an afterthought.
- **The earliest red flags are detectable from data we already have** — scope creep with no budget/timeline change, sponsor disengagement, and earned-value divergence (CPI/SPI). → These map directly to our existing Early Warning signals (burn-completion gap, satisfaction drift, milestone slip), so the *trigger* for oversight/rescue is already instrumented.

**Agentic executive oversight is being defined right now — and the rescue use case is open.** The 2026 enterprise signal (EY's CIO agentic playbook, Kyndryl's Agentic Service Management, Deloitte, Thomson Reuters' *AI in Professional Services 2026*) is consistent: as agents execute the work, **human roles shift to supervision, exception-handling, and keeping agents inside strategic and regulatory guardrails**; vendors package this as *maturity model + structured assessment + phased roadmap*. But every productized example is about overseeing *AI agents*. **No firm has productized an agent that acts as the chief-of-staff for a human-led project rescue.** That is our lane — and it is the natural extension of the framework's existing "human keeps judgment, agent handles volume" stance.

> **Positioning:** The QA Director runs the rescue. The agent is the war-room operator — it establishes ground truth, drafts the recovery charter, assembles the board pack, runs the daily checks, drafts stakeholder comms, and surfaces analogous past rescues from the Knowledge Network. This is the rescue-mode embodiment of EY's "human retains professional judgment and approval authority."

### 11.2 The Engagement Intensity Ladder

Not every at-risk engagement needs a rescue. The model defines four intensities of QA Director involvement, each with a different leader, cadence, and agent role. An engagement moves *up* the ladder as risk concentrates and *down* as it stabilizes. This ladder sits directly on top of the existing tiered alerts (Pillar 5) and health assessments (Pillar 3).

| Intensity | Trigger (auto-suggested by agent) | Who Leads | Cadence | Agent Role | Goal |
|-----------|-----------------------------------|-----------|---------|------------|------|
| **Standard Monitoring** | EW score < 60, all dimensions Green/Amber | PM + Delivery Lead | Weekly/biweekly (auto) | **Surveillance** — early warnings, health briefs | Maintain Green |
| **Oversight** *(performance maximization)* | Strategic/flagship account, top-quartile contract value, or EW 60–80 with no Red — **and not yet failing** | QA Director as **Assurance Partner** (overlay) | Weekly exec touchpoint | **Performance Copilot** — uplift plays, peer benchmarks, opportunity surfacing | Lift to **top-quartile** performance; protect strategic value |
| **Rescue** *(turnaround command)* | EW > 85, 2+ dimensions Red, executive-escalated, or a Get-to-Green plan **stalled 2+ consecutive weeks** | QA Director / **Rescue Lead** in command | **Daily war room** | **Rescue Copilot** — ground-truth audit, charter, board pack, comms, pattern-match | **Stabilize** and return to Green |
| **De-escalation / Handback** | Exit criteria met, EW trending down and held | QA Director → back to PM | Step-down to weekly, then standard | **Transition Copilot** — verifies exit criteria, captures lessons | Sustain recovery; bank the lessons |

The agent **proposes** ladder transitions ("Recommend declaring Rescue on Adatum — G2G stalled 2 weeks, EW 88, sponsor disengaging"); the **QA Director declares** them. Every declaration and de-escalation is logged for the Evals alignment loop (Pillar 7 / Section 5).

Two distinct engagement types deserve emphasis because they are *opposite in posture*:

- **Oversight = offense.** The engagement is healthy or merely soft; a senior QA Director is deliberately overlaid to *maximize* performance — protect a flagship logo, de-risk a strategic renewal, push a good project to a great one. This is the "executive oversight to maximize performance" the platform should showcase as the proactive, premium tier.
- **Rescue = defense.** The engagement is failing; the QA Director takes *command* to stabilize and recover. This is the war-room turnaround.

### 11.3 Oversight Mode — Performance Maximization

**When declared:** flagship/strategic accounts, the largest contracts, politically sensitive engagements, or any project the firm cannot afford to let slip even by a little. It is a *deliberate investment*, not a reaction to trouble.

**The Assurance Partner overlay.** A QA Director is named to the engagement as a standing executive partner — present in governance, but not running delivery. They own an *uplift agenda*, not a recovery plan.

**The agent as Performance Copilot:**
| Copilot Capability | What It Surfaces |
|--------------------|------------------|
| **Top-quartile gap** | "This project is Green, but its burn efficiency and milestone velocity sit in the 3rd quartile for its service line — here's the gap to top-quartile." |
| **Uplift plays** | Concrete, benchmarked moves drawn from the Knowledge Network's *success patterns* ("teams that added weekly client demos at this phase lifted satisfaction +12 NPS"). |
| **Opportunity radar** | Health strength + client sentiment that signals expansion/renewal upside — fed to the Pipeline Agent. |
| **Pre-empt the slide** | Watches the same EW signals but at a *tighter* threshold, so an Oversight engagement never silently drifts toward Rescue. |

**Output:** a lightweight **Performance Plan** (not a charter) — a short list of uplift plays with owners and a target performance percentile, reviewed at the weekly exec touchpoint.

### 11.4 Rescue Mode — The Turnaround Lifecycle

Rescue Mode is a **5-phase lifecycle** grounded in the recovery literature, with the agent operating each phase as chief of staff. A Get-to-Green plan (Pillar 5) is the *artifact produced inside Phase 3* — Rescue Mode is the governance and command wrapper around it.

```
  DECLARE &        STABILIZE        RE-CHARTER       EXECUTE          STABILIZED
  TRIAGE       →   (stop the    →   (recovery    →   (war room)   →   EXIT
  (72h audit)      bleeding)        charter)                           (handback)
     │                │                │               │                  │
  ground truth     freeze /        agreed WITH       daily stand-up    exit criteria
  vs reported      secure          sponsor +         + burn-down       met & held
  red-flag scan    sponsor +       recovery board    weekly board      lessons →
  stakeholder      war room        go / reset / stop  EW trending ↓     Knowledge Net
  temperature      stood up                                            de-escalate
```

| Phase | Purpose | Agent (Rescue Copilot) Does | Human (QA Director / Rescue Lead) Does | Gate to Next Phase |
|-------|---------|------------------------------|----------------------------------------|--------------------|
| **1. Declare & Triage** | Establish *true* status within ~72h — reported status is not trusted | Auto-assembles a triage pack: ground-truth vs reported delta, red-flag scan (scope-creep-without-budget, sponsor disengagement, CPI/SPI divergence), full RAID re-read, stakeholder sentiment temperature, value-at-risk | Validates ground truth, interviews key people, confirms or overrides the agent's diagnosis | Triage accepted; root causes named |
| **2. Stabilize** | Stop the bleeding in the first 5 business days | Drafts immediate "stop-the-bleeding" actions, scope-freeze notice, war-room setup, and the sponsor re-engagement brief | Secures the executive sponsor, freezes scope, stands up the war room, sets comms cadence | Sponsor committed; bleeding stopped |
| **3. Re-Charter** | Re-charter the engagement — recovery is a new plan, agreed *with* the sponsor & board | Generates the **Recovery Charter** (revised scope/schedule/team, resource asks, success criteria) and the **go / reset / stop** options with data behind each | Owns the **go / reset / stop** decision with the Executive Recovery Board; commits resources | Charter approved by board |
| **4. Execute (War Room)** | Drive recovery under tighter governance | Runs daily health checks at rescue thresholds, burns down recovery milestones, drafts daily stand-up + weekly board pack, drafts client/stakeholder comms, pattern-matches past successful rescues | Leads the daily war room, makes interventions, owns the struggling team relationship and sponsor/exec messaging | EW trending down for 2+ weeks; milestones recovering |
| **5. Stabilized Exit** | Hand back to normal delivery and bank the lessons | Verifies every exit criterion, drafts the closure brief, extracts lessons → Knowledge Network, proposes de-escalation | Confirms exit criteria are *held* (not a one-week blip), signs off handback, validates lesson quality | Exit criteria held; project returns to Standard Monitoring |

**The go / reset / stop decision (Phase 3)** is the model's most important governance moment and a deliberate honesty mechanism — the literature is blunt that *cancellation is sometimes the courageous, correct choice*. The agent presents all three options with evidence; the human and board decide:
- **Go** — recover on a revised charter.
- **Reset** — major re-baseline (scope, commercial terms, or leadership change).
- **Stop** — orderly wind-down; protect the relationship and harvest lessons.

### 11.5 The Executive Recovery Board

Because sponsor support is the decisive recovery factor, the model formalizes an **Executive Recovery Board** as a first-class object for any Rescue engagement.

| Element | Definition |
|---------|------------|
| **Composition** | Executive sponsor (chair), account executive, QA Director / Rescue Lead, Delivery PM, and — where the disclosure policy allows — the client executive sponsor |
| **Cadence** | Weekly during Rescue (daily war room rolls up into it); convened within 1 week of a Critical alert |
| **Decision rights** | Approves the Recovery Charter and the go/reset/stop call; authorizes resources/budget; owns escalation beyond the engagement |
| **Agent support** | Auto-prepares the board pack (status, EW trend, charter, options, asks), records decisions and owners, tracks actions to closure — the same nomination/prep/post-review machinery as Pillar 4, re-pointed at a single engagement |

### 11.6 Responsibility Split — Extending the Pillar 7 Matrix

Rescue intensifies, but does not change, the Pillar 7 principle: the agent handles volume and preparation; the human holds judgment and authority. The split sharpens in Rescue Mode:

| The Rescue Copilot Does | The QA Director / Rescue Lead Does |
|-------------------------|-------------------------------------|
| Establishes ground truth vs reported status; scans for red flags | Owns the diagnosis and names the true root causes |
| Drafts the Recovery Charter and the go/reset/stop options | **Decides** go / reset / stop with the board |
| Runs daily checks, burns down milestones, prepares the board pack | Leads the war room and the human relationships |
| Drafts stakeholder and client communications | Approves, personalizes, and sends them |
| Surfaces analogous past rescues and what worked | Adapts the playbook to *this* context and politics |
| Verifies exit criteria objectively | Confirms the recovery is real and signs the handback |

Every override (agent recommends Rescue, director holds at Oversight; agent says "exit," director says "not yet") flows into the **same Evals alignment loop** used in Deal Approvals — and rescue outcomes become high-value training data for the early-warning weights.

### 11.7 How It Shows Up in the Environment — Recommended Showcase

The framework should make this the platform's most cinematic moment. Recommendation, in priority order:

**1. A dedicated "Rescue Command" cockpit (the hero showcase).** Just as the Client Portal earned its own *distinct environment* (Section 10.2), Rescue Mode should look and feel unmistakably different from the calm Power BI operational tabs — a **dark "mission-control / war-room" identity** (slate-950 canvas, amber/red status, live-clock urgency, "DEFCON-style" intensity badges). It is launched from any **Critical** project in the Portfolio Monitor or any **stalled** Get-to-Green plan, and presents the 5-phase lifecycle as a command timeline: triage pack → stabilization actions → Recovery Charter → war-room daily log → exit criteria, with the Executive Recovery Board pack one click away. The visual whiplash between the serene Power BI tabs and the war-room cockpit *is the story*: "this is what it looks like when the QA function shifts from monitoring to command."

**2. An "Oversight" overlay (the premium, proactive tier).** Lighter-weight — a banner/badge on Oversight-engaged projects plus a Performance Plan panel, framed as the opposite of rescue: deliberately investing senior attention to push a good engagement to top-quartile. This showcases the "executive oversight to maximize performance" half of the request.

**3. Placement.** Add a **Rescue Command** entry that is *contextual* (it lights up only when an engagement is in Oversight/Rescue) rather than a permanent cold tab — reinforcing that command mode is an exceptional, declared state. The existing **Get-to-Green** tab remains the operational recovery-plan tracker; Rescue Command is the *governance and command wrapper* that sits above it.

> **Demo narrative (for the executive walkthrough):** *Portfolio Monitor is calm and green → one project trips a Critical alert → the agent recommends declaring Rescue → the QA Director declares it → the screen shifts into the dark war-room cockpit → the agent has already built the triage pack and drafted the Recovery Charter and the board pack → the director makes the go/reset/stop call → daily war room burns the project back to Green → de-escalation banks the lessons into the Knowledge Network, which makes the next deal's risk profile smarter.* This closes the loop across all seven pillars in a single story.

### 11.8 Conceptual Data Model (for the build phase — not yet implemented)

```typescript
type EngagementIntensity = 'standard' | 'oversight' | 'rescue' | 'de_escalation';
type RescuePhase = 'triage' | 'stabilize' | 'recharter' | 'war_room' | 'exit';
type ChargterDecision = 'go' | 'reset' | 'stop';

interface OversightEngagement {            // Intensity = oversight
  project_id: string;
  assurance_partner: string;               // QA Director name
  declared_at: string;
  rationale: string;                       // why this is under oversight
  target_percentile: number;               // top-quartile goal
  uplift_plays: { play: string; owner: string; source_lesson_id?: string; done: boolean }[];
  opportunity_signals: string[];           // fed to Pipeline Agent
}

interface RescueEngagement {               // Intensity = rescue
  id: string;
  project_id: string;
  rescue_lead: string;
  declared_at: string;
  phase: RescuePhase;
  triage: {
    reported_status: HealthStatus;
    true_status: HealthStatus;             // agent's ground-truth assessment
    red_flags: string[];                   // scope-creep, sponsor disengagement, CPI/SPI divergence
    value_at_risk: number;
    root_causes: string[];
  };
  recovery_charter?: {
    decision: ChargterDecision;            // go / reset / stop
    revised_scope: string;
    resource_asks: string[];
    success_criteria: string[];
    board_approved_at?: string;
  };
  get_to_green_plan_id?: string;           // links to the Pillar 5 G2G artifact
  war_room_log: { date: string; ew_score: number; note: string; on_track: boolean }[];
  exit_criteria: { criterion: string; met: boolean }[];
}

interface RecoveryBoard {
  rescue_id: string;
  sponsor: string;
  members: string[];
  client_sponsor_included: boolean;
  sessions: {
    date: string;
    decisions: string[];
    actions: { action: string; owner: string; due: string; done: boolean }[];
  }[];
}
```

### 11.9 Metrics — Extending the Eval Model

New Key Results that plug into the Section 5 OKR panel:

| Key Result | Metric | Target Direction |
|-----------|--------|------------------|
| **Rescue success rate** | % of declared Rescues returned to Green within their charter window | Higher |
| **Time-to-stabilize** | Days from Rescue declared to bleeding-stopped (Phase 2 gate) | Lower |
| **Sponsor engagement** | % of Rescues with an active Executive Recovery Board within 1 week | Higher (→100%) |
| **Oversight uplift** | Avg performance-percentile gain for Oversight engagements | Higher |
| **Honest-stop rate** | % of Rescues correctly ending in *reset/stop* vs futile "go" (proving the decision is real, not vanity) | Healthy non-zero |
| **Knowledge return** | % of closed Rescues whose lessons were consumed by a later project | Higher |

---

*Document version: 1.2 — May 2026*
*Module: Delivery Excellence Platform — AI-Driven Quality Assurance*
*Key updates in 1.2: Added Section 11 — Executive Oversight & Rescue Engagement Model (Pillar 7 deep-dive): the Engagement Intensity Ladder (Standard → Oversight → Rescue → De-escalation), the 5-phase rescue lifecycle, the Executive Recovery Board, the go/reset/stop decision, the QA-Director-as-commander / agent-as-Rescue-Copilot split, conceptual data model, extended OKRs, and the recommended "Rescue Command" war-room cockpit showcase.*
*Key updates in 1.1: Power BI styling for executive-facing operational tabs; Client Portal redesigned as a distinct external environment with toggle between Internal Audit and Client Portal Preview modes; AI Assistant designed with suggested-first interaction model*
