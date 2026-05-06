"""Seed the ADO-style backlog for Tools & Methods."""
import json
from datetime import datetime
from database import SessionLocal, engine
from models.models import Base, WorkItem

Base.metadata.create_all(bind=engine)

import uuid
def new_id(): return str(uuid.uuid4())

_counter = [0]
def next_wi():
    _counter[0] += 1
    return f"WI-{str(_counter[0]).zfill(4)}"

# ── Persona shorthands ──────────────────────────────────────────────────────
E = "Edwina"   # VP Professional Services
K = "Karina"   # Americas Leader
M = "Maikel"   # VP Delivery Excellence

# ── Status / sprint helpers ─────────────────────────────────────────────────
# Sprints 1-2 = done; Sprint 3 = current; Sprints 4-6 = upcoming
def sprint_status(sprint: str):
    if sprint in ("Sprint 1", "Sprint 2"): return "closed"
    if sprint == "Sprint 3": return "in_progress"
    if sprint == "Sprint 4": return "active"
    return "new"


# ── Master backlog definition ──────────────────────────────────────────────
# Structure: list of epics, each with features, each with user stories
# (assigned, status, priority, sp, sprint, tags, bv, description, criteria)
BACKLOG = [
    {
        "area": "governance",
        "title": "Establish Robust Delivery Governance and Operating Rhythm",
        "description": "Define and operationalize the governance structures, meeting cadences, and reporting rhythms that give leadership consistent, real-time visibility into portfolio health and delivery performance.",
        "priority": "critical", "bv": 10,
        "features": [
            {
                "title": "Delivery Review Cadence and Council Charter",
                "assigned": M, "priority": "critical", "sprint": "Sprint 1",
                "description": "Formalize the Delivery Council structure, decision rights, and weekly/monthly review cadences.",
                "stories": [
                    (E, "critical", 5, "Sprint 1", ["governance","executive"],
                     "As Edwina, I want a Delivery Council charter with defined quorum, decision rights, and escalation authority so that governance authority is formalized and respected.",
                     ["Charter approved by VP PS and circulated to all delivery leaders", "Council meets on the first Monday of each month", "Decision log template created and adopted"]),
                    (M, "high", 3, "Sprint 1", ["governance","process"],
                     "As Maikel, I want a standardized weekly delivery review template that all PMs complete by end-of-Friday so health status is consistent and the Monday review is data-driven.",
                     ["Template includes RAG, RAID summary, milestone status, and financial burn", "100% completion rate tracked weekly", "Review deck auto-generates from template submissions"]),
                    (K, "high", 3, "Sprint 2", ["governance","americas"],
                     "As Karina, I want a bi-weekly Americas Regional Delivery Review that surfaces portfolio issues before they reach VP-level escalation so I stay ahead of client risk.",
                     ["Regional review calendar published for full year", "Standard agenda and pre-read template defined", "Attendance and action tracking in place"]),
                ]
            },
            {
                "title": "Operating Rhythm Playbook",
                "assigned": M, "priority": "high", "sprint": "Sprint 2",
                "description": "Document the full operating rhythm — cadences, owners, inputs, outputs — so governance runs without tribal knowledge.",
                "stories": [
                    (M, "high", 5, "Sprint 2", ["governance","documentation"],
                     "As Maikel, I want a documented Operating Rhythm Playbook (cadences, owners, inputs/outputs, escalation triggers) so the team runs consistent governance even as personnel changes.",
                     ["Playbook covers weekly, monthly, and quarterly cadences", "Approved by all three VPs", "Published on SharePoint and linked in onboarding"]),
                    (E, "medium", 3, "Sprint 3", ["governance","executive"],
                     "As Edwina, I want a Quarterly Business Review (QBR) template and facilitation guide so that QBRs are consistently run across all regions and feed into board-level reporting.",
                     ["QBR template includes pipeline health, delivery health, financial performance, and talent metrics", "First QBR run using template with positive feedback", "QBR outputs feed executive dashboard automatically"]),
                ]
            },
            {
                "title": "Governance Compliance and Accountability Metrics",
                "assigned": E, "priority": "high", "sprint": "Sprint 3",
                "description": "Track adherence to governance standards to hold leaders and PMs accountable.",
                "stories": [
                    (E, "high", 5, "Sprint 3", ["governance","metrics"],
                     "As Edwina, I want a governance KPI dashboard (status update completion rate, RAID health, milestone on-time rate) so I can hold delivery leaders accountable with data.",
                     ["Dashboard live and refreshed weekly", "KPIs surfaced in monthly Delivery Council pack", "Leaders with <90% compliance receive coaching flag"]),
                    (M, "medium", 3, "Sprint 4", ["governance","automation"],
                     "As Maikel, I want automated reminders sent to PMs when status updates are overdue (>48 hours past due) so I eliminate manual chasing.",
                     ["Automated reminder triggers at 48 and 72 hours past due", "Escalation to delivery leader at 96 hours", "Compliance rate tracked month-over-month"]),
                    (K, "medium", 2, "Sprint 4", ["governance","americas"],
                     "As Karina, I want a monthly Americas governance scorecard (showing each PM's compliance with standards) so I have a data-driven basis for coaching conversations.",
                     ["Scorecard covers 6 key governance behaviors", "Distributed to Americas leads by 5th of each month", "Trend visible over rolling 3-month window"]),
                ]
            },
        ]
    },
    {
        "area": "standards",
        "title": "Set and Uphold Delivery Standards",
        "description": "Define what 'excellent delivery' looks like at every phase, and embed those standards into every project through quality gates, checklists, and certification programs.",
        "priority": "critical", "bv": 9,
        "features": [
            {
                "title": "Delivery Quality Framework (DQF)",
                "assigned": M, "priority": "critical", "sprint": "Sprint 1",
                "description": "Define and publish the Delivery Quality Framework that sets the bar for every engagement.",
                "stories": [
                    (M, "critical", 8, "Sprint 1", ["standards","framework"],
                     "As Maikel, I want a Delivery Quality Framework document that defines what 'good' looks like at each project phase (Initiate, Plan, Execute, Monitor, Close) so PMs have a clear quality bar to work toward.",
                     ["DQF covers all 5 phases with specific quality criteria", "Reviewed and approved by Edwina", "Published as the foundational standards document"]),
                    (E, "high", 5, "Sprint 2", ["standards","governance"],
                     "As Edwina, I want mandatory quality gate reviews at project kickoff, 30% completion, and 85% completion so delivery quality issues are caught and remediated before they reach the client.",
                     ["Gate review checklist defined for each stage", "Gate reviews tracked and outcomes logged in portfolio tool", "Projects failing gates trigger a remediation plan within 5 days"]),
                    (K, "high", 3, "Sprint 3", ["standards","americas"],
                     "As Karina, I want the DQF adapted with Americas-specific client expectations and regulatory nuances (SOX, HIPAA, FINRA) so our standards reflect the environments our clients operate in.",
                     ["Americas addendum to DQF published", "Covers top 5 regulated industries in the Americas portfolio", "Reviewed by Americas delivery leads"]),
                ]
            },
            {
                "title": "SOW Quality Standards and Gate Reviews",
                "assigned": M, "priority": "critical", "sprint": "Sprint 1",
                "description": "Ensure every SOW leaving the organization meets a quality bar that protects against scope gaps, margin risk, and delivery failure.",
                "stories": [
                    (M, "critical", 5, "Sprint 1", ["standards","presales"],
                     "As Maikel, I want a SOW quality checklist (scope completeness, assumptions, exclusions, RAID pre-check, pricing validation) that pre-sales must complete before submitting for approval so scope gaps are caught before contract signature.",
                     ["Checklist covers 20+ quality dimensions", "Integrated into contract submission workflow", "Completion rate tracked per pre-sales team"]),
                    (E, "high", 3, "Sprint 2", ["standards","executive"],
                     "As Edwina, I want all SOWs above $500K to require a delivery leader review and sign-off before client presentation so commercial risk is assessed by delivery before commitment.",
                     ["Review SLA defined (48 hours for <$1M, 72 hours for >$1M)", "Review outcomes logged", "Escalation path defined for disagreements between pre-sales and delivery"]),
                    (K, "high", 3, "Sprint 3", ["standards","americas"],
                     "As Karina, I want a SOW health score visible in the contracting tool (based on checklist results) so approvers can make risk-informed approval decisions at a glance.",
                     ["Health score algorithm covers scope completeness, financial risk, delivery risk", "Score displayed prominently on contract approval page", "Trend of SOW quality by pre-sales team available to Karina monthly"]),
                ]
            },
            {
                "title": "Project Initiation and PM Standards Certification",
                "assigned": M, "priority": "high", "sprint": "Sprint 2",
                "description": "Ensure every project starts right through a mandatory initiation standard, and recognize PMs who uphold delivery standards.",
                "stories": [
                    (M, "high", 5, "Sprint 2", ["standards","process"],
                     "As Maikel, I want a mandatory Project Initiation Checklist (PIC) that every PM completes in Week 1 so projects are set up for success from day one with the right structure, stakeholder alignment, and risk identification.",
                     ["PIC covers 25 items across governance, scope, risk, and stakeholders", "PIC completion tracked and reported monthly", "PM cannot mark project 'Active' until PIC is complete"]),
                    (E, "medium", 5, "Sprint 4", ["standards","talent"],
                     "As Edwina, I want a PM Standards Certification program (Bronze/Silver/Gold levels) tied to delivery quality scores so we recognize high performers and create a meaningful professional development path.",
                     ["Certification criteria defined for 3 levels", "Linked to PM competency framework", "Pilot run with 10 PMs in Americas in Q3 2026"]),
                    (K, "medium", 3, "Sprint 4", ["standards","americas"],
                     "As Karina, I want a quarterly delivery standards compliance review for Americas PMs (with coaching recommendations) so I identify who needs support before it becomes a delivery problem.",
                     ["Review covers adherence to DQF, PIC, status reporting, RAID hygiene", "Coaching plan template provided for PMs below threshold", "Results shared with Edwina in monthly governance pack"]),
                ]
            },
        ]
    },
    {
        "area": "portfolio_insights",
        "title": "Deliver Actionable Portfolio Insights",
        "description": "Build the analytics and reporting capability that gives leadership real-time, predictive, and actionable insights into both pre-sales pipeline and delivery performance.",
        "priority": "critical", "bv": 10,
        "features": [
            {
                "title": "Real-Time Portfolio Health Dashboard",
                "assigned": E, "priority": "critical", "sprint": "Sprint 1",
                "description": "A live, always-current view of portfolio health across pipeline and delivery.",
                "stories": [
                    (E, "critical", 8, "Sprint 1", ["insights","dashboard"],
                     "As Edwina, I want a real-time executive portfolio health dashboard with all active projects RAG status, key financials, and pipeline funnel so I can brief the board without manual preparation.",
                     ["Dashboard refreshes in real-time from project data", "Accessible on mobile and desktop", "Includes 5 key pipeline and 5 key delivery KPIs on a single screen"]),
                    (K, "high", 5, "Sprint 2", ["insights","americas"],
                     "As Karina, I want a regional Americas filter on the portfolio dashboard showing pipeline value, delivery health heatmap, and margin performance so I manage my region without being distracted by other geos.",
                     ["Regional filter applies to all dashboard visualizations", "Americas KPIs benchmarked against other regions", "Drill-down to individual projects from heatmap"]),
                    (M, "high", 5, "Sprint 3", ["insights","delivery"],
                     "As Maikel, I want a project health trend view (rolling 12-week RAG history per project) so I can distinguish one-time blips from structural delivery problems.",
                     ["Trend sparklines visible on project list view", "Trend data persisted and queryable", "Trend alerts flag projects with 3+ consecutive amber weeks"]),
                ]
            },
            {
                "title": "Predictive Delivery Analytics and Early Warning",
                "assigned": M, "priority": "critical", "sprint": "Sprint 3",
                "description": "Use data patterns to predict which projects are trending toward risk before they turn red.",
                "stories": [
                    (E, "critical", 13, "Sprint 3", ["insights","predictive","ai"],
                     "As Edwina, I want a predictive model that flags projects likely to turn red 4–6 weeks before they do (based on RAID velocity, budget burn curve, milestone slip rate) so we can intervene while recovery is still inexpensive.",
                     ["Model trained on historical project data from last 24 months", "Generates weekly early warning list with rationale", "Validated to have >70% precision on test dataset"]),
                    (M, "high", 8, "Sprint 4", ["insights","analytics"],
                     "As Maikel, I want trend analysis on delivery health dimensions (schedule, budget, risk, scope, satisfaction) across the portfolio over time so I can identify systemic issues rather than one-off project problems.",
                     ["Trend charts available for each of 5 health dimensions", "Filterable by practice area, region, and project type", "Monthly insight report auto-generated with top 3 observations"]),
                    (K, "high", 5, "Sprint 4", ["insights","americas"],
                     "As Karina, I want a 'portfolio heat map by account' for Americas showing all active engagements per client and their delivery trajectory so I know which accounts need my executive attention.",
                     ["Heat map groups projects by client", "Trajectory indicator (improving/stable/deteriorating) per project", "Click-through to account detail with history"]),
                ]
            },
            {
                "title": "Pipeline-to-Delivery Correlation and Executive Reporting",
                "assigned": E, "priority": "high", "sprint": "Sprint 4",
                "description": "Connect pre-sales data to delivery outcomes, and automate executive reporting to eliminate manual effort.",
                "stories": [
                    (E, "high", 8, "Sprint 4", ["insights","executive","analytics"],
                     "As Edwina, I want correlation analysis between pre-sales quality indicators (SOW quality score, handoff completeness, time-in-negotiate) and delivery outcomes (margin, CSAT, RAG status) so we improve how we sell and what we commit to.",
                     ["Correlation model covers 10 pre-sales variables", "Findings presented at Delivery Council quarterly", "Top 3 causal factors surfaced for each outcome metric"]),
                    (E, "high", 5, "Sprint 5", ["insights","executive","automation"],
                     "As Edwina, I want an automated monthly executive report (generated from live data) covering pipeline health, delivery performance, margin trends, and CSAT so that report preparation takes 10 minutes not 3 days.",
                     ["Report auto-generates on 1st of each month", "Distributed via email to Edwina, Karina, Maikel by 7am on the 2nd", "Format matches board presentation template"]),
                    (M, "medium", 5, "Sprint 5", ["insights","reporting"],
                     "As Maikel, I want a post-project analysis report (auto-generated 60 days after project closure) covering financial performance vs. plan, CSAT score, and top lessons learned so insights are systematically captured without PM effort.",
                     ["Report generated automatically 60 days after project status changes to 'Completed'", "Covers 8 performance dimensions", "Findings flow into lessons learned library"]),
                ]
            },
        ]
    },
    {
        "area": "risk_management",
        "title": "Enhance Risk, Issues, and Change Management",
        "description": "Strengthen how the practice identifies, scores, escalates, and resolves risks and issues — transforming reactive fire-fighting into proactive risk leadership.",
        "priority": "critical", "bv": 10,
        "features": [
            {
                "title": "Standardized RAID Management Process",
                "assigned": M, "priority": "critical", "sprint": "Sprint 1",
                "description": "Establish a consistent, disciplined RAID management process across all projects.",
                "stories": [
                    (M, "critical", 5, "Sprint 1", ["risk","process"],
                     "As Maikel, I want a standardized RAID taxonomy and scoring model (impact × probability matrix for risks, severity for issues) so all PMs classify items consistently and portfolio RAID can be aggregated meaningfully.",
                     ["Taxonomy covers 4 RAID types with definitions and examples", "Scoring matrix published and trained", "All active projects re-classified against new taxonomy within 30 days"]),
                    (K, "high", 3, "Sprint 2", ["risk","escalation"],
                     "As Karina, I want escalation triggers defined (e.g., HIGH-impact risk open > 14 days without mitigation) so I am automatically notified when unresolved risks cross a threshold in Americas projects.",
                     ["4 escalation triggers defined for risk and issue types", "Notification delivered via Teams and email", "Escalation log visible on portfolio dashboard"]),
                    (E, "high", 3, "Sprint 2", ["risk","executive"],
                     "As Edwina, I want a portfolio RAID heat map (top 10 open risks across all active projects, by impact) refreshed weekly so I see what could derail delivery before it does.",
                     ["Heat map accessible from executive dashboard", "Click-through to project RAID log", "Comparison week-over-week to show resolution velocity"]),
                ]
            },
            {
                "title": "Early Warning System for At-Risk Projects",
                "assigned": M, "priority": "critical", "sprint": "Sprint 3",
                "description": "Build automated signals that surface emerging project risk weeks before it becomes visible in RAG status.",
                "stories": [
                    (E, "critical", 8, "Sprint 3", ["risk","automation","ai"],
                     "As Edwina, I want an automated alert (Teams + email) triggered whenever any project health dimension drops from green to amber so delivery leaders can engage before a project reaches red.",
                     ["Alert fires within 4 hours of status change", "Alert includes project name, dimension changed, PM name, and last RAG commentary", "Escalation to VP if amber persists > 10 days without a recovery action"]),
                    (M, "high", 8, "Sprint 3", ["risk","analytics"],
                     "As Maikel, I want a composite 'Project Early Warning Score' (combining schedule slip %, budget burn curve, open RAID count, and milestone overdue rate) updated weekly so I have a single quantitative signal for project health trajectory.",
                     ["Score calculated weekly for every active project", "Score history tracked and trended", "Projects in bottom quartile flagged for delivery leader review"]),
                    (K, "high", 5, "Sprint 4", ["risk","americas","ai"],
                     "As Karina, I want weekly AI-generated insights on Americas projects trending toward red — with specific contributing factors — so my Monday review focuses on what matters most.",
                     ["AI summary generated every Monday by 7am Americas time", "Lists top 3 at-risk projects with rationale", "Links directly to project health page and RAID log"]),
                ]
            },
            {
                "title": "Change Request Process and Red Project Recovery",
                "assigned": M, "priority": "critical", "sprint": "Sprint 2",
                "description": "Control scope changes through a formal CR process and respond to red projects with a structured recovery playbook.",
                "stories": [
                    (M, "critical", 5, "Sprint 2", ["risk","change_management"],
                     "As Maikel, I want a formal Change Request (CR) process with PM-initiated, delivery-leader-approved, and client-signed-off stages so that out-of-scope work is never absorbed silently and commercial protection is consistent.",
                     ["CR form template defined and published", "Approval workflow implemented in project tooling", "CR log visible per project with financial impact tracked"]),
                    (E, "high", 5, "Sprint 3", ["risk","executive"],
                     "As Edwina, I want a Red Project Recovery Playbook (triggered automatically when a project is marked RED) that defines intervention steps, escalation owners, and recovery timelines so that our response to red projects is immediate and structured.",
                     ["Playbook covers 5 intervention steps within the first 5 business days", "Roles and responsibilities defined for PM, Delivery Lead, VP", "Recovery plans tracked in portfolio tool with weekly status"]),
                    (K, "high", 3, "Sprint 4", ["risk","americas"],
                     "As Karina, I want a dedicated 'project rescue' resource pool (2 senior PMs and 2 senior architects on standby in Americas) deployable to red projects within 10 business days so recovery starts before the client escalates.",
                     ["Resource pool identified and committed by region", "Deployment criteria and process defined", "Resource pool utilization tracked quarterly to right-size capacity"]),
                ]
            },
        ]
    },
    {
        "area": "financial_excellence",
        "title": "Strengthen Financial and Operational Excellence",
        "description": "Drive margin improvement, eliminate cost overruns, optimize resource utilization, and ensure billing accuracy to build a financially disciplined and profitable practice.",
        "priority": "high", "bv": 9,
        "features": [
            {
                "title": "Margin Improvement Program",
                "assigned": E, "priority": "high", "sprint": "Sprint 2",
                "description": "Implement a structured program to improve project margins by 2+ percentage points on average.",
                "stories": [
                    (E, "critical", 8, "Sprint 2", ["financial","margin"],
                     "As Edwina, I want a margin improvement program targeting +2 percentage points per project on average (through delivery efficiency, reuse of assets, and right-sizing teams) so our practice profitability improves without reducing client value.",
                     ["Baseline margin established per project and practice area", "Top 5 margin leakage causes identified in first 30 days", "Margin improvement target embedded in each delivery leader's objectives"]),
                    (M, "high", 5, "Sprint 3", ["financial","analytics"],
                     "As Maikel, I want monthly margin analysis by project with actuals vs. plan and variance commentary so margin leakage is identified and addressed in real time — not discovered at project close.",
                     ["Margin report available by 5th of each month", "Automated variance flag when margin drops >3 points from plan", "Commentary required from PM when variance >5 points"]),
                    (K, "high", 3, "Sprint 3", ["financial","americas"],
                     "As Karina, I want a 'Top 5 Margin at Risk' Americas report (projects with highest negative margin variance) so I can personally engage with those PMs on recovery actions.",
                     ["Report generated weekly and sent to Karina every Monday", "Each entry includes root cause, PM owner, and proposed action", "Actions tracked to closure"]),
                ]
            },
            {
                "title": "Cost Overrun Prevention Framework",
                "assigned": M, "priority": "critical", "sprint": "Sprint 2",
                "description": "Implement automated guardrails and structured processes to detect and prevent budget overruns.",
                "stories": [
                    (M, "critical", 5, "Sprint 2", ["financial","automation"],
                     "As Maikel, I want automated budget burn alerts at 70%, 85%, and 100% of budget consumed — sent to PM, delivery leader, and VP — so overruns are flagged with enough lead time to intervene.",
                     ["Alerts configured and tested for all active projects", "Alert includes: project name, budget, actuals, % consumed, completion %", "Alert sent via Teams and email within 24 hours of threshold breach"]),
                    (E, "high", 5, "Sprint 3", ["financial","governance"],
                     "As Edwina, I want all projects at 85%+ budget burn with <80% delivery completion to require a financial recovery plan submitted to the VP within 5 business days so overruns are never a surprise.",
                     ["Recovery plan template defined with required fields", "Submission tracked and overdue plans escalated", "Recovery plan outcomes reviewed at monthly Delivery Council"]),
                    (K, "high", 3, "Sprint 4", ["financial","americas"],
                     "As Karina, I want root cause analysis completed for every Americas project that exceeds budget by >10% so we identify systemic causes and implement preventive changes for future engagements.",
                     ["RCA template completed within 30 days of project close", "Findings summarized in quarterly Americas learnings digest", "Top 3 causes tracked and addressed in delivery standards updates"]),
                ]
            },
            {
                "title": "Resource Utilization and Revenue Recognition",
                "assigned": E, "priority": "high", "sprint": "Sprint 4",
                "description": "Optimize how we deploy people and ensure we capture every dollar of revenue we've earned.",
                "stories": [
                    (E, "high", 8, "Sprint 4", ["financial","resources"],
                     "As Edwina, I want a utilization dashboard showing billable vs. non-billable time by practice and individual so I can manage bench cost proactively and make data-driven staffing decisions.",
                     ["Dashboard shows rolling 4-week utilization by person and practice", "Bench cost calculated and visible in financial view", "Target utilization thresholds configurable per practice"]),
                    (K, "high", 5, "Sprint 5", ["financial","americas"],
                     "As Karina, I want a 90-day forward resource demand forecast for Americas based on active projects, pipeline probability, and known departures so I can make hiring and contractor decisions with 3 months of lead time.",
                     ["Forecast generated monthly using pipeline probability and project plans", "Demand vs. supply gap visible by skill area", "Staffing decision recommendations auto-generated for gaps >20%"]),
                    (M, "high", 5, "Sprint 5", ["financial","billing"],
                     "As Maikel, I want a billing accuracy dashboard showing unbilled work, delayed invoicing, and milestone billing status per project so we eliminate revenue leakage from billing process failures.",
                     ["Dashboard refreshed weekly from time-tracking data", "Unbilled work older than 30 days flagged for PM action", "Monthly billing report sent to practice finance partner"]),
                ]
            },
        ]
    },
    {
        "area": "readiness_excellence",
        "title": "Enable Readiness and Execution Excellence",
        "description": "Build a world-class PM capability, ensure delivery teams are ready to execute before contracts start, and systematically capture and re-apply lessons from every engagement.",
        "priority": "high", "bv": 8,
        "features": [
            {
                "title": "PM Capability Development Program",
                "assigned": E, "priority": "high", "sprint": "Sprint 2",
                "description": "Build a structured program to develop PM skills, from onboarding through advanced certification.",
                "stories": [
                    (E, "high", 8, "Sprint 2", ["readiness","talent"],
                     "As Edwina, I want a PM Competency Framework defining skills, behaviors, and knowledge required at each PM level (Associate, PM, Senior PM, Principal) so we have a clear development path and hiring bar.",
                     ["Framework covers 6 competency domains", "Approved by Edwina and HR", "Used in all PM performance reviews from Q3 2026"]),
                    (M, "high", 5, "Sprint 3", ["readiness","onboarding"],
                     "As Maikel, I want a structured 4-week PM onboarding program covering delivery standards, tooling, methodology, and shadow PM experience so all new PMs start with consistent knowledge of how we operate.",
                     ["Onboarding agenda published and owned by a designated PM buddy", "Knowledge assessment at end of Week 4", "Completion tracked and linked to PM assignment eligibility"]),
                    (K, "medium", 3, "Sprint 4", ["readiness","americas"],
                     "As Karina, I want monthly Americas PM Coaching Sessions focused on the top 2–3 recurring execution challenges in the region so we build skills on the issues that matter most right now.",
                     ["Session calendar set for full year", "Topics drawn from delivery data (red project root causes, CSAT themes)", "Action items from sessions tracked in next month's session"]),
                ]
            },
            {
                "title": "Delivery Readiness Assessment and Pre-Sales Integration",
                "assigned": M, "priority": "critical", "sprint": "Sprint 2",
                "description": "Ensure delivery teams are involved in pre-sales and fully ready to execute before a project kicks off.",
                "stories": [
                    (M, "critical", 8, "Sprint 2", ["readiness","presales"],
                     "As Maikel, I want a Delivery Readiness Assessment (DRA) tool that pre-sales completes for every opportunity >$300K before contract signature — scoring staffing readiness, technical complexity, and delivery risk — so we only commit to what we can deliver excellently.",
                     ["DRA covers 15 readiness dimensions", "Score and rationale visible on contract approval page", "Projects with DRA score <60% require delivery VP sign-off"]),
                    (K, "high", 5, "Sprint 3", ["readiness","americas"],
                     "As Karina, I want the Americas delivery lead to be involved in all opportunities >$500K during the Propose stage so that delivery perspective shapes the SOW before it's too late to change the scope.",
                     ["Mandatory delivery review gate at Propose stage for qualifying deals", "Delivery lead assigned to all >$500K Americas deals at Propose", "Delivery input logged in opportunity notes"]),
                    (E, "high", 3, "Sprint 4", ["readiness","executive"],
                     "As Edwina, I want a 'Deliverability Score' visible on every contract above $1M at the approval stage so executives can assess execution risk alongside commercial risk before committing.",
                     ["Score composed of: DRA score, team readiness, SOW quality, historical similarity index", "Displayed prominently on executive approval view", "Score threshold <65% triggers mandatory delivery leader discussion before approval"]),
                ]
            },
            {
                "title": "Client Satisfaction and Lessons Learned",
                "assigned": E, "priority": "high", "sprint": "Sprint 4",
                "description": "Systematically measure client satisfaction and capture learnings to improve future delivery.",
                "stories": [
                    (E, "high", 5, "Sprint 4", ["readiness","csat"],
                     "As Edwina, I want a CSAT measurement program (structured surveys at 30 days and 90 days post go-live) with a target score of ≥4.2/5 across all completed projects so client satisfaction is measured consistently and acts as a leading indicator of renewal.",
                     ["CSAT survey automatically triggered at 30 and 90 days post go-live", "Results visible per project and aggregated by PM, practice, and region", "CSAT below 3.5 triggers a leadership follow-up call within 5 business days"]),
                    (M, "high", 5, "Sprint 5", ["readiness","knowledge"],
                     "As Maikel, I want a mandatory post-project retrospective (covering what worked, what didn't, and what we'd do differently) completed within 30 days of project closure for all engagements >$500K so learnings are captured systematically.",
                     ["Retrospective template covers 6 structured sections", "Completion tracked; PMs flagged for non-completion", "Insights flow automatically into searchable lessons learned library"]),
                    (K, "medium", 3, "Sprint 5", ["readiness","americas"],
                     "As Karina, I want a searchable Americas lessons-learned library so PMs can find relevant insights from similar historical engagements before starting a new project in the same industry or service area.",
                     ["Library indexed by industry, service area, project type, and health outcome", "Search returns top 5 most relevant entries with similarity score", "Library grows automatically from post-project retrospectives"]),
                ]
            },
        ]
    },
    {
        "area": "business_assets",
        "title": "Build and Scale Business Excellence Assets",
        "description": "Create a library of reusable IP — SOW templates, delivery playbooks, architecture patterns, communication templates — that empowers PMs in the field and drives consistency at scale.",
        "priority": "high", "bv": 8,
        "features": [
            {
                "title": "SOW Template Library and Accelerators",
                "assigned": M, "priority": "critical", "sprint": "Sprint 1",
                "description": "Build a comprehensive SOW template library across all 5 practice areas that cuts proposal time and improves quality.",
                "stories": [
                    (M, "critical", 8, "Sprint 1", ["assets","presales","sow"],
                     "As Maikel, I want SOW templates for each of the 5 practice areas (Cloud, AI/Agentic, Dynamics, Security, Data & Analytics) pre-populated with standard scope, exclusions, assumptions, and RAID starters so pre-sales can produce a high-quality first draft in under 2 hours.",
                     ["Templates cover all 5 practices with service-line-specific scope language", "Each template includes standard inclusions/exclusions, assumptions, and RAID starters", "Templates reduce average SOW drafting time by 60% — measured in pilot"]),
                    (K, "high", 5, "Sprint 2", ["assets","americas"],
                     "As Karina, I want SOW templates localized for Americas commercial terms, client communication style, and common Americas contract nuances (T&M vs. fixed price, SOX language) so our templates reflect how we actually do business in the region.",
                     ["Americas addendum covers 8 common commercial variations", "Reviewed by Americas legal and finance", "Used by Americas pre-sales team from Q3 2026"]),
                    (E, "medium", 3, "Sprint 5", ["assets","governance"],
                     "As Edwina, I want a bi-annual SOW template review cycle where templates are updated to reflect current service offerings, pricing, and lessons learned so our assets stay current and don't drift from what we actually deliver.",
                     ["Review calendar set with owners per practice", "Version control and change log maintained", "IP reuse rate (% of SOWs using templates) tracked quarterly"]),
                ]
            },
            {
                "title": "Delivery Playbooks by Practice Area",
                "assigned": M, "priority": "critical", "sprint": "Sprint 2",
                "description": "Build delivery playbooks for the top 10 most common engagement types so every PM has a structured starting point.",
                "stories": [
                    (M, "critical", 13, "Sprint 2", ["assets","playbooks"],
                     "As Maikel, I want delivery playbooks for our 10 most common engagement types (Azure LZ, Cloud Migration, D365 F&O, D365 CRM, Sentinel SOC, Zero Trust, Microsoft Fabric, Copilot Deployment, AI Custom Agent, and Data Strategy) each containing phase plans, milestone templates, RAID starters, and key decision points.",
                     ["10 playbooks published by end of Sprint 4", "Each playbook includes estimated effort by phase", "Playbooks integrated into project initiation workflow", "Adoption rate (% of matching projects using a playbook) tracked"]),
                    (K, "high", 5, "Sprint 4", ["assets","americas"],
                     "As Karina, I want a 'Quick Start' delivery playbook for engagements under $300K in Americas so that smaller fixed-price projects are still delivered with structure even when there's no budget for a senior PM.",
                     ["Quick Start playbook covers the 5 most common small engagement types", "Designed for a PM with < 2 years experience", "Checklist-driven format requiring < 30 minutes to complete at kickoff"]),
                    (E, "medium", 3, "Sprint 6", ["assets","metrics"],
                     "As Edwina, I want IP reuse metrics (% of projects using a playbook or template, CSAT correlation with reuse) tracked and reported quarterly so we measure the ROI of our asset investment.",
                     ["Reuse tracked at project initiation", "Quarterly report shows reuse rate by practice area", "CSAT delta between reuse vs. non-reuse projects measured"]),
                ]
            },
            {
                "title": "Communication Templates and Reference Architecture Library",
                "assigned": M, "priority": "medium", "sprint": "Sprint 4",
                "description": "Standardize client communications and provide validated architecture patterns PMs and architects can reuse.",
                "stories": [
                    (M, "high", 5, "Sprint 4", ["assets","communication"],
                     "As Maikel, I want a library of client communication templates (weekly status report, escalation notice, change request, milestone completion, project closure) so all PMs send professional, consistent communications that reflect our brand.",
                     ["8 communication templates published", "Templates reviewed by Edwina for tone and content", "Usage tracked to measure adoption"]),
                    (K, "medium", 3, "Sprint 5", ["assets","americas"],
                     "As Karina, I want an executive escalation email template for Americas PMs (when escalating to Karina or Edwina) with a structured format (situation, impact, decision needed, recommendation) so escalations are clear and action-oriented.",
                     ["Template tested with 5 Americas PMs", "Format adopted across Americas within 60 days of publish", "Feedback collected after first 10 uses"]),
                    (M, "medium", 8, "Sprint 5", ["assets","architecture"],
                     "As Maikel, I want a library of validated solution architecture patterns (one per major service offering) that architects and PMs can reference and adapt so we reduce architecture design time and avoid reinventing solutions we've already built.",
                     ["Library contains at least 15 patterns at launch", "Each pattern includes: overview, key decisions, risks, reuse conditions", "Architecture patterns linked to corresponding delivery playbooks"]),
                ]
            },
        ]
    },
    {
        "area": "agentic_ai",
        "title": "Drive Agentic Solutions and AI Infusion",
        "description": "Identify, prioritize, and build AI agent solutions that enhance delivery quality, automate repetitive operational tasks, and give leadership unprecedented insight into the portfolio.",
        "priority": "critical", "bv": 10,
        "features": [
            {
                "title": "Delivery Health Co-Pilot and Portfolio Intelligence Agent",
                "assigned": M, "priority": "critical", "sprint": "Sprint 3",
                "description": "Build an AI agent that proactively monitors portfolio health and surfaces the most important risks and actions for leaders.",
                "stories": [
                    (E, "critical", 13, "Sprint 3", ["ai","delivery","executive"],
                     "As Edwina, I want an AI Delivery Co-Pilot that automatically analyzes all active project data weekly and generates a prioritized list of delivery risks — with specific recommended actions — so I can focus executive attention on the right projects at the right time.",
                     ["Co-pilot runs every Monday morning and generates ranked risk list", "Each risk item includes project context, contributing factors, and a recommended action", "Co-pilot accessible via chat interface with follow-up Q&A capability"]),
                    (M, "critical", 8, "Sprint 3", ["ai","delivery"],
                     "As Maikel, I want an AI health analysis agent that a PM can ask 'What are the top risks on my project and what should I do about them?' and receive a structured, data-grounded response so PMs get expert-level coaching on demand.",
                     ["Agent integrates with live project data (RAID, milestones, budget, health history)", "Response structured as: health summary, top 3 risks, recommended actions, escalation triggers", "Available 24/7 via the delivery portal"]),
                    (K, "high", 5, "Sprint 4", ["ai","americas"],
                     "As Karina, I want an AI-generated Americas weekly delivery digest (sent every Monday) summarizing portfolio health, highlighting emerging risks, and suggesting talking points for my regional review so I arrive at every meeting informed.",
                     ["Digest generated automatically from live portfolio data", "Personalized to Americas region with comparison to global benchmark", "One-click approval to forward to Americas delivery leaders"]),
                ]
            },
            {
                "title": "Automated RAID Intelligence and SOW Generation Agent",
                "assigned": M, "priority": "critical", "sprint": "Sprint 4",
                "description": "Use AI to accelerate risk assessment and SOW creation — two of the highest-effort, highest-impact activities in the practice.",
                "stories": [
                    (M, "critical", 8, "Sprint 4", ["ai","risk"],
                     "As Maikel, I want an AI agent that reads new RAID items entered by PMs and automatically suggests impact/probability scores, similar historical risks, and mitigation strategies so RAID quality is higher and PMs spend less time on taxonomy.",
                     ["Agent analyzes text of new RAID items using NLP", "Suggests scores with 80%+ acceptance rate in pilot", "Similar historical risks surfaced from lessons-learned database"]),
                    (K, "high", 5, "Sprint 4", ["ai","presales"],
                     "As Karina, I want an AI SOW generation agent that drafts a first-pass SOW narrative from a 10-bullet opportunity brief so Americas pre-sales can produce a complete draft SOW in under 30 minutes.",
                     ["Agent uses practice-specific SOW templates as base", "Draft includes scope, exclusions, assumptions, and recommended service lines", "First draft reviewed and refined in <30 minutes vs. 4-8 hours today"]),
                    (E, "high", 8, "Sprint 5", ["ai","insights"],
                     "As Edwina, I want an AI portfolio analytics agent that detects anomalies in financial data (unexpected budget burns, margin drops, billing gaps) and routes alerts to the right person automatically so nothing slips through the cracks.",
                     ["Anomaly detection runs nightly on all project financial data", "Alert routed to PM for <5% variance, Delivery Lead for 5-10%, VP for >10%", "False positive rate <10% after tuning"]),
                ]
            },
            {
                "title": "PM Productivity Agent and Intelligent Meeting Intelligence",
                "assigned": M, "priority": "high", "sprint": "Sprint 5",
                "description": "Give PMs an AI assistant that handles the administrative burden of project management so they can focus on client value.",
                "stories": [
                    (M, "high", 8, "Sprint 5", ["ai","productivity"],
                     "As Maikel, I want an AI agent that transcribes project meeting recordings and automatically extracts action items, decisions, risks, and RAID items — structured and ready to import into the project tool — so PMs save at least 2 hours per week on note-taking and follow-up.",
                     ["Agent integrates with Teams meeting recordings", "Action items extracted with 90%+ accuracy in pilot", "One-click import to project RAID log and action tracker"]),
                    (K, "high", 5, "Sprint 5", ["ai","reporting"],
                     "As Karina, I want an AI-assisted weekly status update generator that drafts the client status update from live project data (milestones, RAID, budget, schedule) so Americas PMs spend 15 minutes on reporting instead of 2 hours.",
                     ["Draft generated from live project data with one click", "Includes executive summary, accomplishments, next steps, and escalations", "PM edits and approves before sending — never sent without human review"]),
                    (E, "high", 5, "Sprint 6", ["ai","planning"],
                     "As Edwina, I want an AI milestone planning agent that generates a proposed project milestone plan for new projects based on the selected delivery playbook and historical comparable projects so every project starts with a stronger baseline plan.",
                     ["Agent uses playbook + historical project data to generate milestone plan", "Plan includes estimated durations and owners by phase", "PM accepts, modifies, or rejects with rationale captured"]),
                ]
            },
        ]
    },
    {
        "area": "delivery_methodology",
        "title": "Consulting Delivery Methodologies",
        "description": "Embed industry-leading delivery methodologies — Microsoft Delivery Framework, Agile for Professional Services, CAF, and AI-Ready Delivery — into how every project is planned and executed.",
        "priority": "high", "bv": 8,
        "features": [
            {
                "title": "Microsoft Delivery Framework (MDF) Adoption",
                "assigned": M, "priority": "high", "sprint": "Sprint 2",
                "description": "Drive consistent adoption of Microsoft's Delivery Framework across all engagements.",
                "stories": [
                    (M, "high", 8, "Sprint 2", ["methodology","mdf"],
                     "As Maikel, I want all active PMs trained and certified on the Microsoft Delivery Framework (MDF) — including phase gates, deliverables, and quality checkpoints — so our delivery approach is consistent and defensible in any client conversation.",
                     ["Training delivered to 100% of PMs within 60 days", "Certification test passed with ≥80% score", "MDF certification linked to PM level progression"]),
                    (E, "high", 5, "Sprint 3", ["methodology","metrics"],
                     "As Edwina, I want an MDF compliance score per project (tracking adherence to MDF phase gates and required deliverables) visible in the portfolio dashboard so delivery methodology rigor is measurable and reportable.",
                     ["MDF compliance score calculated from 12 binary checkpoints", "Score visible on project card in portfolio view", "Average MDF compliance score reported monthly to Delivery Council"]),
                    (K, "medium", 3, "Sprint 3", ["methodology","americas"],
                     "As Karina, I want a 1-page MDF 'phase cheat sheet' for each of the 5 delivery phases so Americas PMs have a quick, portable reference they can use in the field without opening a 50-page document.",
                     ["5 cheat sheets published and formatted for mobile", "Distributed to all Americas PMs at next monthly session", "Feedback survey after 30 days of use"]),
                ]
            },
            {
                "title": "Agile Delivery for Professional Services",
                "assigned": M, "priority": "high", "sprint": "Sprint 3",
                "description": "Adapt agile delivery principles for the consulting context where clients pay by milestone.",
                "stories": [
                    (M, "high", 8, "Sprint 3", ["methodology","agile"],
                     "As Maikel, I want an 'Agile for Professional Services' playbook that adapts Scrum/Kanban for consulting engagements — addressing milestone billing, client sprint reviews, and fixed-scope-agile-execution tensions — so PMs can offer agile delivery without commercial risk.",
                     ["Playbook covers 4 agile delivery patterns for PS contexts", "Commercial model variations (T&M-agile, fixed-price-with-sprints) included", "Reviewed by legal and finance before publishing"]),
                    (K, "high", 5, "Sprint 4", ["methodology","americas"],
                     "As Karina, I want Agile delivery training for Americas PMs (covering the PS-adapted model) so we can offer agile-native delivery to the growing number of Americas clients who expect it.",
                     ["Training delivered to Americas PMs in Q3 2026", "Covers PS-agile model, client conversation guide, and commercial structure", "Post-training assessment with ≥75% pass mark"]),
                    (E, "medium", 3, "Sprint 5", ["methodology","executive"],
                     "As Edwina, I want a hybrid agile-waterfall delivery model documented and approved so PMs have a formal option for regulated-industry engagements that need milestone tracking alongside iterative development.",
                     ["Hybrid model covers finance, healthcare, and utilities contexts", "Approved by Edwina and legal", "First project using hybrid model tracked as pilot by Q4 2026"]),
                ]
            },
            {
                "title": "AI-Ready Delivery Methodology and Cloud Adoption Framework Integration",
                "assigned": M, "priority": "critical", "sprint": "Sprint 3",
                "description": "Build delivery methodologies for AI engagements and embed Microsoft's Cloud Adoption Framework into cloud delivery.",
                "stories": [
                    (M, "critical", 13, "Sprint 3", ["methodology","ai"],
                     "As Maikel, I want an AI Project Delivery Methodology covering AI readiness assessment, data governance, model validation, responsible AI review, and change management so our growing AI portfolio is delivered with the same discipline as our cloud and Dynamics practices.",
                     ["Methodology covers 6 phases unique to AI engagements", "Responsible AI review gate built into Phase 3", "Piloted on 2 AI engagements in Q3 2026 before general release"]),
                    (K, "high", 5, "Sprint 4", ["methodology","americas"],
                     "As Karina, I want AI delivery methodology training for all Americas PMs so we can confidently staff and deliver the growing AI book of business without senior delivery leader involvement in every project.",
                     ["Training covers AI methodology, responsible AI, and client conversation guide", "Americas PMs certified on AI delivery by end of Q3 2026", "Certification linked to PM AI project assignment eligibility"]),
                    (M, "high", 5, "Sprint 4", ["methodology","caf"],
                     "As Maikel, I want Cloud Adoption Framework (CAF) stages mapped to our delivery playbooks and SOW templates for all cloud engagements so every cloud project aligns to the Microsoft reference model and we can demonstrate methodology rigor to clients.",
                     ["CAF mapping published for all 6 cloud service offerings", "CAF stage visible in project tracking tool", "CAF alignment used as a selling point in cloud SOWs"]),
                ]
            },
        ]
    },
]


def seed_backlog():
    db = SessionLocal()
    try:
        if db.query(WorkItem).count() > 0:
            print("Backlog already seeded.")
            return

        created = 0
        for epic_def in BACKLOG:
            epic = WorkItem(
                id=new_id(), work_item_id=next_wi(),
                item_type="epic", parent_id=None,
                epic_area=epic_def["area"],
                title=epic_def["title"],
                description=epic_def["description"],
                assigned_to=None,
                status="active",
                priority=epic_def["priority"],
                story_points=None,
                iteration=None,
                business_value=epic_def["bv"],
                tags=json.dumps([epic_def["area"]]),
            )
            db.add(epic)
            db.flush()
            created += 1

            for feat_def in epic_def["features"]:
                feat_sp = sum(s[2] for s in feat_def["stories"])
                feat_status = sprint_status(feat_def["sprint"])
                feat = WorkItem(
                    id=new_id(), work_item_id=next_wi(),
                    item_type="feature", parent_id=epic.id,
                    epic_area=epic_def["area"],
                    title=feat_def["title"],
                    description=feat_def["description"],
                    assigned_to=feat_def["assigned"],
                    status=feat_status,
                    priority=feat_def["priority"],
                    story_points=feat_sp,
                    iteration=feat_def["sprint"],
                    business_value=epic_def["bv"],
                    tags=json.dumps([epic_def["area"]]),
                )
                db.add(feat)
                db.flush()
                created += 1

                for (persona, priority, sp, sprint, tags, title, criteria) in feat_def["stories"]:
                    story_status = sprint_status(sprint)
                    story = WorkItem(
                        id=new_id(), work_item_id=next_wi(),
                        item_type="user_story", parent_id=feat.id,
                        epic_area=epic_def["area"],
                        title=title,
                        description=title,
                        acceptance_criteria=json.dumps(criteria),
                        assigned_to=persona,
                        status=story_status,
                        priority=priority,
                        story_points=sp,
                        iteration=sprint,
                        business_value=epic_def["bv"],
                        tags=json.dumps(tags),
                    )
                    db.add(story)
                    created += 1

        db.commit()
        total_stories = sum(len(f["stories"]) for e in BACKLOG for f in e["features"])
        total_features = sum(len(e["features"]) for e in BACKLOG)
        print(f"✓ Backlog seeded: {len(BACKLOG)} epics, {total_features} features, {total_stories} user stories ({created} total items)")

    except Exception as ex:
        db.rollback()
        raise ex
    finally:
        db.close()


if __name__ == "__main__":
    seed_backlog()
