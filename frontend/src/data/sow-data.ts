export type ContentBlock =
  | { t: 'p'; text: string }
  | { t: 'bullets'; items: string[] }
  | { t: 'table'; headers: string[]; rows: string[][] };

export interface SOWSection {
  id: string;
  number: string;
  title: string;
  dimensionKey?: string;
  content: ContentBlock[];
}

export interface SOWDimension {
  key: string;
  label: string;
  score: number;
  strength: string;
  gaps: string[];
  recommendation: string;
}

export interface AlignmentFlag {
  label: string;
  status: 'ok' | 'warning';
  detail?: string;
}

export interface SOWData {
  compositeScore: number;
  sections: SOWSection[];
  dimensions: SOWDimension[];
  alignmentFlags: AlignmentFlag[];
}

export function verdictFromScore(s: number): 'Excellent' | 'Good' | 'Acceptable' | 'Needs Revision' {
  if (s >= 8.5) return 'Excellent';
  if (s >= 7.5) return 'Good';
  if (s >= 6.0) return 'Acceptable';
  return 'Needs Revision';
}

export const SOW_DATA: Record<string, SOWData> = {

  // ─── 1. FOURTH COFFEE CORPORATION ────────────────────────────────────────
  'Fourth Coffee Corporation': {
    compositeScore: 8.5,
    sections: [
      {
        id: 'executive-summary', number: '1.', title: 'Executive Summary',
        content: [
          { t: 'p', text: 'Microsoft Professional Services will deliver a full Azure data center exit program for Fourth Coffee Corporation, migrating 210 workloads across the Americas and EMEA regions. The 18-month engagement covers Azure Landing Zone design, a tiered migration factory (Lift-Shift, Refactor, and Greenfield tracks), cloud governance, FinOps practice enablement, and 12 months of post-migration hypercare. Avanade subcontracts migration factory execution at 20% of program effort under Microsoft governance.' },
          { t: 'p', text: 'This engagement positions Fourth Coffee to eliminate all on-premises data center costs, achieve a target monthly Azure consumption of $185,000, and establish a cloud-first operating model governed by a FinOps Center of Excellence.' },
          { t: 'table', headers: ['Field', 'Detail'], rows: [
            ['Client', 'Fourth Coffee Corporation'],
            ['Vendor', 'Microsoft Professional Services (Avanade subcontract — 20%)'],
            ['Engagement Type', 'Cloud Migration & Transformation'],
            ['Engagement Period', '18 months from kickoff'],
            ['Primary Client Contact', 'VP of IT Infrastructure'],
          ]},
        ],
      },
      {
        id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes',
        dimensionKey: 'outcome_clarity',
        content: [
          { t: 'p', text: 'The following measurable outcomes define success for this engagement. All outcomes are to be achieved by Month 18 unless otherwise specified.' },
          { t: 'bullets', items: [
            'Data center infrastructure costs reduced by ≥60% from pre-engagement baseline within 6 months of full workload migration',
            '100% of 210 in-scope workloads migrated to Azure or formally retired by Month 14',
            'Azure FinOps practice operational with monthly cost variance maintained at ≤5% from target ACR',
            'Application performance maintained or improved for ≥95% of migrated workloads against pre-migration SLA benchmarks',
            'Client team independently managing Azure cost governance without vendor support by Month 18',
          ]},
          { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [
            ['DC infrastructure cost (monthly)', 'Client to provide at kickoff', '≥60% reduction', 'Finance invoice comparison'],
            ['Workloads migrated', '0 of 210', '210 (100%)', 'Azure migration tracker'],
            ['Monthly Azure ACR', '$0', '$185,000', 'Azure Cost Management'],
            ['Post-go-live defects per wave', 'N/A', '< 5 P1/P2 incidents', 'Incident log'],
          ]},
        ],
      },
      {
        id: 'scope', number: '3.', title: 'Scope of Work',
        dimensionKey: 'scope_completeness',
        content: [
          { t: 'p', text: 'The engagement is structured in three phases. Phase 2 migration factory is executed in 6 waves of 35 workloads each.' },
          { t: 'table', headers: ['Phase', 'Duration', 'Key Activities', 'Primary Deliverables'], rows: [
            ['Phase 1 — Foundation', 'Months 1–3', 'Azure Landing Zone (hub-spoke), ExpressRoute, Entra ID integration, Azure Arc', 'Landing Zone Design Doc, Network Architecture Sign-Off'],
            ['Phase 2 — Migration Factory', 'Months 3–14', 'Lift-Shift (120 workloads), Refactor (60 workloads), Greenfield (30 workloads), 6 migration waves', 'Wave completion reports (×6), Per-workload runbooks'],
            ['Phase 3 — FinOps & Hypercare', 'Months 6–18', 'Azure Cost Management tooling, FinOps CoE enablement, 12-month hypercare, DC decommission advisory', 'FinOps Dashboard, CoE Playbook, Hypercare Completion Report'],
          ]},
          { t: 'bullets', items: [
            'Resource commitment: Microsoft Engagement Director (0.5 FTE all phases), Solution Architect (1.0 FTE Phases 1–2), Migration Lead (1.0 FTE Phase 2), FinOps Architect (0.5 FTE Phase 3)',
            'Avanade migration factory team: 20% of Phase 2 execution effort, under Microsoft governance and quality gates',
          ]},
        ],
      },
      {
        id: 'out-of-scope', number: '4.', title: 'Out of Scope',
        dimensionKey: 'out_of_scope',
        content: [
          { t: 'p', text: 'The following items are explicitly excluded from this engagement. Any work outside this list requires a formally executed Change Order.' },
          { t: 'bullets', items: [
            'Physical hardware procurement, disposal, or data center decommissioning execution (advisory guidance only)',
            'Network hardware refresh or physical cabling',
            'Application code development or rewrite beyond the Refactor track specifications defined in Section 3',
            'End-user training beyond the 2 FinOps practice workshops included in Phase 3',
            'Workloads beyond the 210-item inventory finalized in Phase 1 (Wave 1 gate)',
            'Third-party software licensing acquisition',
            'EMEA data residency legal review — client to engage own counsel; this engagement assumes compliance',
          ]},
        ],
      },
      {
        id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies',
        dimensionKey: 'assumption_quality',
        content: [
          { t: 'bullets', items: [
            'Client will provide a finalized 210-workload inventory by end of Week 2; additions after this gate require a Change Order',
            'Client infrastructure team (minimum 2 FTE) will be dedicated to the program throughout Phase 2 migration waves',
            'ExpressRoute circuit provisioning by client network team will be completed before Phase 2 begins',
            'Avanade team access to client environments will be granted within 5 business days of engagement start',
            'All 210 workloads are currently virtualized — no bare-metal migration is included',
            'EMEA workloads comply with existing EU data residency requirements; no new regulatory barriers apply',
            'Timeline assumes client review and decision cycles of no more than 5 business days',
          ]},
        ],
      },
      {
        id: 'timeline', number: '6.', title: 'Project Timeline & Milestones',
        dimensionKey: 'timeline_enforceability',
        content: [
          { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [
            ['Program Kickoff & Workload Inventory Lock', 'Month 0', 'No', '15% on start'],
            ['Azure Landing Zone Live (D01 accepted)', 'Month 3', 'Yes', '20% on acceptance'],
            ['Wave 3 Complete — 105/210 workloads migrated', 'Month 9', 'Yes', '25% on wave reports'],
            ['Wave 6 Complete — 210/210 workloads migrated', 'Month 14', 'Yes', '25% on acceptance'],
            ['FinOps CoE Handoff & Hypercare Start', 'Month 14', 'No', '—'],
            ['Hypercare Complete & Program Close', 'Month 18', 'Yes', '15% on completion report'],
          ]},
          { t: 'p', text: 'Critical path: ExpressRoute provisioning (client-owned) must complete before Month 3 or Phase 2 wave schedule shifts proportionally. EMEA wave sequenced as Wave 5-6 to allow for any residency review resolution.' },
        ],
      },
      {
        id: 'governance', number: '7.', title: 'Governance & Change Management',
        dimensionKey: 'governance_readiness',
        content: [
          { t: 'bullets', items: [
            'Steering Committee: VP of IT (client) + Engagement Director (Microsoft) + Avanade Delivery Lead — bi-weekly during Phase 1 and 3, weekly during Phase 2 waves',
            'Working team: Daily standup during active migration waves; weekly cadence outside wave execution windows',
            'Escalation: L1 → Project Manager | L2 → Delivery Lead | L3 → Engagement Executive / Client CIO',
            'Change control: Written request → 5-business-day impact assessment → dual sign-off (client VP of IT + Microsoft Engagement Director)',
            'RAID log maintained by Microsoft PM; reviewed at every Steering Committee session',
            'Status report: Weekly written summary distributed every Monday; format includes wave tracker, risk log, and upcoming decisions required',
          ]},
        ],
      },
      {
        id: 'commercial', number: '8.', title: 'Commercial Terms',
        dimensionKey: 'commercial_integrity',
        content: [
          { t: 'table', headers: ['Item', 'Detail'], rows: [
            ['Pricing model', 'Fixed fee by phase, milestone-triggered billing'],
            ['Internal investment (ECIF)', '15% offset applied to Phase 1 foundation work'],
            ['Avanade subcontract', 'Included in total contract value; Microsoft assumes commercial risk for subcontractor delivery'],
            ['Expense policy', 'EMEA travel billed at cost, capped at 3% of total contract value'],
            ['Payment terms', 'Net 30 from invoice date'],
            ['Change order', 'Written scope changes → impact assessment within 5 business days → dual sign-off required'],
          ]},
        ],
      },
      {
        id: 'risk', number: '9.', title: 'Preliminary Risk Register',
        dimensionKey: 'risk_visibility',
        content: [
          { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
            ['Workload inventory exceeds 210 — scope expands post-lock', 'Medium', 'High', 'Hard inventory gate at Week 2; Change Order required for any additions'],
            ['EMEA migration delayed by data residency review', 'Medium', 'Medium', 'EMEA waves sequenced last (5–6); early legal engagement by client in Month 1'],
            ['Avanade resource unavailability during migration waves', 'Low', 'High', 'Resource commitment letter from Avanade required before Phase 2 kickoff'],
            ['ExpressRoute provisioning delay by client network team', 'Medium', 'High', 'ExpressRoute completion is a Phase 2 gate condition; delay triggers timeline revision'],
          ]},
        ],
      },
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 8.5,
        strength: 'Outcomes are tied to quantified cost reduction and ACR targets with clear measurement methodology per milestone.',
        gaps: ['Post-migration client CSAT metric is absent — hypercare quality is unmeasured', 'FinOps savings baseline is client-provided at kickoff; any delay in provision shifts financial measurability'],
        recommendation: 'Add a pre-engagement infrastructure cost audit as a Week 1 gate deliverable to lock the financial baseline before any migration begins.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 9.0,
        strength: 'Three distinct workload tracks (Lift-Shift, Refactor, Greenfield) are clearly decomposed with resource commitments per phase.',
        gaps: ['Refactor track criteria (which workloads qualify for refactor vs. lift-shift) are not defined in the SOW'],
        recommendation: 'Add a workload classification matrix as a Phase 1 deliverable to prevent track assignment disputes during waves.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 8.0,
        strength: 'Hardware exclusions and licensing are explicitly named; wave gate protects against scope growth.',
        gaps: ['EMEA legal review exclusion is noted but the handoff process between client counsel and delivery team is not defined'],
        recommendation: 'Add a one-paragraph EMEA legal interface protocol: who from the client owns the legal review and when MS delivery needs sign-off.' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 8.5,
        strength: 'Client-side assumptions are specific, time-bound (Week 2 inventory gate), and staffing commitments are quantified (2 FTE).',
        gaps: ['EMEA data residency assumption ("no new regulatory barriers") is unverified and unmitigated in the risk register'],
        recommendation: 'Convert the EMEA residency assumption into a Phase 1 verification task with a named client owner and completion date.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 9.0,
        strength: 'Milestones are tied to specific deliverable acceptances and payment triggers; critical path dependency on ExpressRoute is explicitly called out.',
        gaps: ['No milestone for Avanade resource confirmation — their readiness is assumed but not scheduled'],
        recommendation: 'Add a Month 1 Avanade resource confirmation milestone with a fallback escalation trigger if not met.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 8.0,
        strength: 'ECIF commitment is phase-scoped, Avanade commercial risk is clearly assumed by Microsoft, and change order process is defined.',
        gaps: ['EMEA travel cap (3%) is stated but not tied to a specific estimate — client cannot validate whether cap is adequate'],
        recommendation: 'Include an itemized EMEA travel estimate in Appendix A to make the 3% cap verifiable by client finance.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 8.5,
        strength: 'Steering Committee composition and cadence adapt by phase; escalation path is clearly tiered to CIO level.',
        gaps: ['Avanade coordination protocol within the governance structure is insufficiently detailed — their reporting line is unclear'],
        recommendation: 'Add a one-paragraph Avanade governance interface: which meetings they attend, what they report, and who owns their escalation.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 8.0,
        strength: 'Four material risks are named with mitigations; ExpressRoute dependency is correctly identified as a cascading risk.',
        gaps: ['EMEA data residency risk is in the out-of-scope section but not in the risk register — it should appear in both'],
        recommendation: 'Move the EMEA residency risk into the risk register with a Medium/High rating and assign a mitigation owner.' },
    ],
    alignmentFlags: [
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'Scope → Timeline', status: 'ok' },
      { label: 'EMEA Assumption → Risk Register', status: 'warning', detail: 'EMEA data residency assumption (Section 5) has no corresponding risk entry in Section 9.' },
      { label: 'ECIF → Commercial Terms', status: 'ok' },
    ],
  },

  // ─── 2. A. DATUM CORPORATION ─────────────────────────────────────────────
  'A. Datum Corporation': {
    compositeScore: 9.0,
    sections: [
      {
        id: 'executive-summary', number: '1.', title: 'Executive Summary',
        content: [
          { t: 'p', text: 'Microsoft Professional Services will deliver a board-mandated enterprise security transformation for A. Datum Corporation, establishing a comprehensive Zero Trust architecture across 6,500 seats. The 10-month engagement covers Entra ID modernization with Conditional Access and ZTNA, deployment of Microsoft Sentinel SIEM with 45+ data connectors and SOAR automation, Defender XDR across all endpoints, and Responsible AI guardrails for AI-assisted SOC playbooks. No subcontractors are involved — this is a pure Microsoft PS delivery.' },
          { t: 'table', headers: ['Field', 'Detail'], rows: [
            ['Client', 'A. Datum Corporation'],
            ['Vendor', 'Microsoft Professional Services (no subcontractors)'],
            ['Engagement Type', 'Enterprise Security Transformation'],
            ['Engagement Period', '10 months from kickoff'],
            ['Seat Coverage', '6,500 seats across all business units'],
          ]},
        ],
      },
      {
        id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes',
        dimensionKey: 'outcome_clarity',
        content: [
          { t: 'bullets', items: [
            'Zero Trust architecture fully deployed across all 6,500 seats by Month 10, with no legacy authentication protocols active',
            'Mean Time to Detect (MTTD) for security incidents reduced to <15 minutes via Sentinel SIEM + SOAR automation',
            'SOC operating 24×7 with Sentinel as authoritative threat platform and SOAR-driven tier-1 response automation',
            '100% of endpoints enrolled in Defender XDR with Intune-managed compliance policies enforced',
            '100% MFA enforcement with zero standing privileged access (PIM-governed) on all admin accounts',
          ]},
          { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [
            ['MFA enforcement rate', 'Estimated <40%', '100%', 'Entra ID MFA report'],
            ['Mean Time to Detect', 'Unknown (no SIEM)', '<15 minutes', 'Sentinel analytics dashboard'],
            ['Endpoint compliance rate', 'Unknown', '≥98%', 'Defender compliance report'],
            ['Standing privileged accounts', '>200 (estimated)', '0', 'Entra PIM audit log'],
          ]},
        ],
      },
      {
        id: 'scope', number: '3.', title: 'Scope of Work',
        dimensionKey: 'scope_completeness',
        content: [
          { t: 'table', headers: ['Phase', 'Duration', 'Key Activities', 'Deliverables'], rows: [
            ['Phase 1 — Assessment & Design', 'Months 1–2', 'Zero Trust posture assessment, identity estate discovery, SIEM requirements, threat modelling', 'ZT Architecture Blueprint, Sentinel Data Source Map'],
            ['Phase 2 — Identity & Access Foundation', 'Months 2–4', 'Entra ID hybrid join, Conditional Access policies, PIM rollout, ZTNA for 6,500 seats', 'Identity Baseline Report, CA Policy Library, PIM Governance Runbook'],
            ['Phase 3 — Sentinel SIEM & SOAR', 'Months 4–7', '45 data connector configuration, custom analytics rules, SOAR playbooks, 24×7 SOC transition', 'Sentinel Deployment Report, SOAR Playbook Library, SOC Runbook'],
            ['Phase 4 — Defender XDR & Hardening', 'Months 7–10', 'Defender XDR deployment, Responsible AI SOC guardrails, attack surface reduction, final hardening review', 'XDR Deployment Report, Responsible AI Framework, Hardening Assessment'],
          ]},
        ],
      },
      {
        id: 'out-of-scope', number: '4.', title: 'Out of Scope',
        dimensionKey: 'out_of_scope',
        content: [
          { t: 'bullets', items: [
            'Physical security controls (badge access, CCTV, physical server room hardening)',
            'Legacy on-premises systems not included in the 6,500-seat Zero Trust inventory',
            'Third-party SIEM data migration or historical log ingestion beyond 90 days',
            'Custom security software development beyond Sentinel analytics rule authoring',
            'Penetration testing or red team exercises (advisory guidance on commissioning available)',
            'User security awareness training beyond one train-the-trainer session for the SOC team',
          ]},
        ],
      },
      {
        id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies',
        dimensionKey: 'assumption_quality',
        content: [
          { t: 'bullets', items: [
            'Client will provide Azure AD tenant admin access within 5 business days of kickoff',
            'All 45 Sentinel data connectors are approved by client IT Security before Phase 3 begins',
            'The 6,500-seat inventory is accurate — additions require a Change Order',
            'Client CISO will designate a dedicated security architect (0.5 FTE) to collaborate throughout the engagement',
            'Existing M365 E5 licensing covers Entra ID P2, Defender XDR, and Sentinel consumption',
            'SOAR automation playbooks require client legal review for any automated remediation actions before go-live',
          ]},
        ],
      },
      {
        id: 'timeline', number: '6.', title: 'Project Timeline & Milestones',
        dimensionKey: 'timeline_enforceability',
        content: [
          { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [
            ['Kickoff & ZT Assessment Complete', 'Month 2', 'Yes', '20% on ZT Blueprint acceptance'],
            ['Entra ID & ZTNA Live — 6,500 seats', 'Month 4', 'Yes', '25% on Identity Baseline Report'],
            ['Sentinel SIEM Operational — 45 connectors', 'Month 7', 'Yes', '25% on Sentinel Deployment Report'],
            ['Defender XDR + Full Hardening Complete', 'Month 10', 'Yes', '30% on Hardening Assessment'],
          ]},
        ],
      },
      {
        id: 'governance', number: '7.', title: 'Governance & Change Management',
        dimensionKey: 'governance_readiness',
        content: [
          { t: 'bullets', items: [
            'Steering Committee: CISO (client) + Engagement Director (Microsoft) — bi-weekly',
            'Working team: Weekly security review with client architecture team and MS solution architect',
            'Escalation: L1 → Security PM | L2 → Delivery Lead | L3 → Engagement Executive / Client CISO',
            'SOAR playbook governance: All automated remediation actions require CISO sign-off before activation',
            'Change control: Written request → 3-business-day assessment → CISO + Engagement Director sign-off',
            'Status report: Bi-weekly written summary; format includes threat posture tracker, milestone status, and open risks',
          ]},
        ],
      },
      {
        id: 'commercial', number: '8.', title: 'Commercial Terms',
        dimensionKey: 'commercial_integrity',
        content: [
          { t: 'table', headers: ['Item', 'Detail'], rows: [
            ['Pricing model', 'Fixed fee — phased billing aligned to milestone acceptance'],
            ['Internal investment (ECIF)', '10% offset applied to Phase 1 Assessment & Design'],
            ['Vendor', 'None — pure Microsoft PS delivery'],
            ['Expense policy', 'Included in fixed fee; no separate expense billing'],
            ['Payment terms', 'Net 30 from invoice date'],
            ['Change order', 'Written scope changes → 3-business-day assessment → dual sign-off'],
          ]},
        ],
      },
      {
        id: 'risk', number: '9.', title: 'Preliminary Risk Register',
        dimensionKey: 'risk_visibility',
        content: [
          { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
            ['Legacy systems incompatible with Conditional Access policies — require exclusion or extended timeline', 'Medium', 'Medium', 'Discovery in Phase 1 with explicit legacy exclusion list; exclusions documented in ZT Blueprint'],
            ['SOAR false-positive rate requires extended tuning beyond Phase 3 schedule', 'Medium', 'Low', 'Two-week SOAR tuning buffer built into Phase 3; client SOC team co-develops rules during Phase 3'],
            ['Responsible AI governance approval for SOC playbooks delayed by client legal team', 'Low', 'Medium', 'AI governance review initiated in Phase 2 in parallel with identity work; not on critical path'],
            ['45 Sentinel data connectors cannot all be activated without API readiness from source systems', 'Medium', 'Medium', 'Connector pre-qualification checklist issued to client IT in Month 1'],
          ]},
        ],
      },
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 9.5,
        strength: 'All five outcomes are measurable with quantified baselines and target values; metrics align directly to the board mandate.',
        gaps: ['MFA baseline ("estimated <40%") should be replaced with an actual audit figure before Phase 1 ends'],
        recommendation: 'Commission an identity audit in Week 1 to replace estimated baselines with verified current-state figures.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 9.0,
        strength: 'Four phases are fully decomposed with activity-level detail and named deliverables; resource commitments are clear.',
        gaps: ['Responsible AI guardrail scope is described at a high level — acceptance criteria for the AI governance framework are absent'],
        recommendation: 'Add acceptance criteria for the Responsible AI Framework deliverable, including named review parties and approval threshold.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 9.0,
        strength: 'Physical security, legacy systems, and penetration testing exclusions are named specifically — no ambiguity on boundaries.',
        gaps: ['No statement on what happens if a legacy system is discovered mid-engagement that cannot comply with ZT policies'],
        recommendation: 'Add a legacy system exception protocol: legacy systems discovered during Phase 1 are logged; client decides include/exclude within 5 business days.' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 9.0,
        strength: 'All assumptions are client-facing, verifiable, and include specific conditions (5-day access window, CISO 0.5 FTE commitment).',
        gaps: ['Licensing assumption (M365 E5 coverage) should be formally verified — if incorrect, it shifts scope and cost materially'],
        recommendation: 'Add a licensing verification step in Phase 1 assessment with a client confirmation sign-off before Phase 2 begins.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 8.5,
        strength: 'Every milestone is tied to an accepted deliverable with a payment trigger; go/no-go gates at all four phase completions.',
        gaps: ['No buffer period between Phase 3 and Phase 4 — Sentinel tuning may compress Defender XDR timeline'],
        recommendation: 'Insert a 2-week transition buffer between Phase 3 go-live and Phase 4 start in the program schedule.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 9.0,
        strength: 'Fixed fee with phase-based billing and no vendor dilution delivers the cleanest commercial structure in the portfolio.',
        gaps: ['ECIF offset on Phase 1 is stated but the conditions under which it applies are not documented'],
        recommendation: 'Add one sentence confirming ECIF is applied upon Phase 1 milestone acceptance, not on engagement start.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 9.0,
        strength: 'SOAR playbook governance (CISO sign-off requirement) is an excellent specific control not typically found in security SOWs.',
        gaps: ['No defined SLA for client response to change requests beyond the 3-day vendor assessment window'],
        recommendation: 'Define a 3-business-day client response SLA to change requests; silence after deadline = request approved as submitted.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 8.5,
        strength: 'Connector pre-qualification risk and Responsible AI legal delay risk are specific and actionable — above average for security SOWs.',
        gaps: ['No risk entry for SOAR automation causing unintended service disruption (auto-remediation false positive)'],
        recommendation: 'Add a SOAR auto-remediation risk with a "no automated blocking actions without 30-day supervised period" mitigation.' },
    ],
    alignmentFlags: [
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'Scope → Timeline', status: 'ok' },
      { label: 'Assumptions → Risk Register', status: 'ok' },
      { label: 'ECIF → Commercial Terms', status: 'warning', detail: 'ECIF conditions of application are stated but not formally documented with a verification gate.' },
    ],
  },

  // ─── 3. CONTOSO HOTELS & RESORTS ─────────────────────────────────────────
  'Contoso Hotels & Resorts': {
    compositeScore: 8.5,
    sections: [
      {
        id: 'executive-summary', number: '1.', title: 'Executive Summary',
        content: [
          { t: 'p', text: 'Microsoft Professional Services will design and build a multi-property AI guest experience platform for Contoso Hotels & Resorts on Azure AI Studio, deployed across 240 properties in 18 countries. The 12-month engagement delivers three AI agents — a personalized booking recommendation agent, an in-stay concierge agent, and a loyalty prediction model — along with a Responsible AI governance framework and Azure OpenAI private endpoint architecture. Contoso has committed a 20% internal investment (IOI) aligned to the engagement\'s strategic priority.' },
          { t: 'table', headers: ['Field', 'Detail'], rows: [
            ['Client', 'Contoso Hotels & Resorts'],
            ['Vendor', 'Microsoft Professional Services'],
            ['Engagement Type', 'AI Platform Build & Deployment'],
            ['Engagement Period', '12 months from kickoff'],
            ['Property Footprint', '240 properties, 18 countries'],
            ['Internal Investment', '20% IOI committed'],
          ]},
        ],
      },
      {
        id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes',
        dimensionKey: 'outcome_clarity',
        content: [
          { t: 'bullets', items: [
            'Booking conversion rate improved by ≥15% within 90 days of recommendation agent go-live',
            'Guest NPS improved by ≥10 points across properties using the concierge agent by Month 12',
            'Concierge request resolution time reduced by ≥30% from baseline via AI-assisted response',
            'Loyalty prediction model accuracy ≥80% (AUC) validated against holdout dataset before go-live',
            'Responsible AI governance framework operational before any agent is deployed to guests',
          ]},
          { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [
            ['Booking conversion rate', 'Current rate (client to provide)', '+15%', 'PMS booking analytics'],
            ['Guest NPS', 'Current NPS (client to provide)', '+10 points', 'Post-stay survey platform'],
            ['Concierge response time', 'Current average (client to provide)', '-30%', 'Concierge system logs'],
            ['Loyalty model AUC', 'N/A (new model)', '≥0.80', 'Azure ML evaluation report'],
          ]},
        ],
      },
      {
        id: 'scope', number: '3.', title: 'Scope of Work',
        dimensionKey: 'scope_completeness',
        content: [
          { t: 'table', headers: ['Phase', 'Duration', 'Key Activities', 'Deliverables'], rows: [
            ['Phase 1 — AI Architecture', 'Months 1–2', 'Azure OpenAI private endpoint, GDPR data residency architecture, AI platform foundation, Responsible AI framework design', 'AI Architecture Blueprint, Data Residency Map, Responsible AI Framework (v1)'],
            ['Phase 2 — Booking Agent', 'Months 2–5', 'Recommendation model training, agent orchestration layer, PMS integration (2 named systems), A/B testing framework', 'Booking Agent (production), A/B Test Report, PMS Integration Sign-Off'],
            ['Phase 3 — Concierge + Loyalty', 'Months 5–8', 'Concierge agent with natural language routing, loyalty prediction model (Azure ML), multi-language support (5 languages)', 'Concierge Agent, Loyalty Model, Multi-language Validation Report'],
            ['Phase 4 — Rollout & Governance', 'Months 8–12', '240-property rollout (wave-based), Responsible AI monitoring dashboards, client team AI operations enablement', 'Rollout Completion Report, AI Ops Runbook, Responsible AI Dashboard'],
          ]},
        ],
      },
      {
        id: 'out-of-scope', number: '4.', title: 'Out of Scope',
        dimensionKey: 'out_of_scope',
        content: [
          { t: 'bullets', items: [
            'Property-level AI customization beyond the standard template — all 240 properties receive the same agent configuration',
            'End-user hospitality staff training beyond 3 train-the-trainer sessions (client to cascade training)',
            'PMS integration beyond the 2 named Property Management Systems specified in Phase 2',
            'Languages beyond the 5 named in Phase 3 (English, French, Spanish, German, Mandarin)',
            'AI hardware infrastructure (GPUs, edge devices) — all inference runs on Azure OpenAI',
            'GDPR legal review — client Privacy Counsel owns regulatory compliance; this engagement assumes approved architecture',
          ]},
        ],
      },
      {
        id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies',
        dimensionKey: 'assumption_quality',
        content: [
          { t: 'bullets', items: [
            'Client Privacy Counsel will complete GDPR data residency review and provide written approval before end of Phase 1',
            'Azure OpenAI private endpoint capacity (TPM allocation) is confirmed with Microsoft account team before Phase 2 begins',
            'Both named PMS systems expose REST APIs with documented specifications; any API changes by the PMS vendor during the engagement are a change event',
            'Client will provide historical booking and loyalty data (minimum 24 months) before Phase 2 model training begins',
            'Client-facing AI rollout will be approved by client marketing and legal teams before Phase 4 begins',
            'IOI (20% internal investment) is confirmed and approved by Microsoft account team before contract execution',
          ]},
        ],
      },
      {
        id: 'timeline', number: '6.', title: 'Project Timeline & Milestones',
        dimensionKey: 'timeline_enforceability',
        content: [
          { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [
            ['AI Architecture + GDPR Approval', 'Month 2', 'Yes', '20% on Blueprint acceptance'],
            ['Booking Agent Go-Live (pilot properties)', 'Month 5', 'Yes', '25% on A/B Test Report'],
            ['Concierge + Loyalty Model Validated', 'Month 8', 'Yes', '25% on Validation Report'],
            ['240-Property Rollout Complete', 'Month 12', 'Yes', '30% on Rollout Report'],
          ]},
          { t: 'p', text: 'GDPR Privacy Counsel approval is a hard gate for Phase 2. Any delay beyond Month 1 Week 3 triggers a timeline revision and commercial impact review.' },
        ],
      },
      {
        id: 'governance', number: '7.', title: 'Governance & Change Management',
        dimensionKey: 'governance_readiness',
        content: [
          { t: 'bullets', items: [
            'AI Product Steering Committee: Chief Digital Officer (client) + MS Engagement Director — bi-weekly',
            'Responsible AI Review Board: Client Privacy Officer + MS Responsible AI Lead — monthly, with mandatory review before each agent deployment',
            'Working team: Weekly sprint reviews with client product team',
            'Change control: Model performance deviations >10% from target trigger automatic escalation to Steering Committee',
            'Rollout wave approval: Each property wave (60 properties) requires Steering Committee sign-off before activation',
          ]},
        ],
      },
      {
        id: 'commercial', number: '8.', title: 'Commercial Terms',
        dimensionKey: 'commercial_integrity',
        content: [
          { t: 'table', headers: ['Item', 'Detail'], rows: [
            ['Pricing model', 'Fixed fee by phase, milestone-triggered billing'],
            ['Internal investment (IOI)', '20% offset applied to Phase 1 AI architecture work; conditions per IOI approval memo'],
            ['Azure consumption', 'Azure OpenAI inference costs are client-owned (separate from engagement fee); estimated $78,000/month'],
            ['Payment terms', 'Net 30 from milestone acceptance'],
            ['Change order', 'Written request → 5-business-day impact assessment → CDO + MS Engagement Director sign-off'],
          ]},
        ],
      },
      {
        id: 'risk', number: '9.', title: 'Preliminary Risk Register',
        dimensionKey: 'risk_visibility',
        content: [
          { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
            ['AI booking model underperforms +15% conversion target at go-live', 'Medium', 'High', 'A/B test framework in Phase 2 gates production deployment on ≥8% conversion lift in pilot; Phase 5 optimization sprint available'],
            ['GDPR cross-border data transfer blocked for EU property data', 'Medium', 'High', 'Architecture designed for EU data residency from Day 1; GDPR gate is Phase 1 exit criterion'],
            ['PMS vendor API changes mid-engagement breaking integration', 'Medium', 'Medium', 'API version pinning contract with PMS vendor; change to API version triggers Change Order'],
            ['240-property rollout delayed by per-property IT readiness variance', 'Medium', 'Medium', 'Wave-based rollout with property readiness checklist; properties not ready pushed to next wave without commercial impact'],
          ]},
        ],
      },
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 9.0,
        strength: 'Outcome metrics are measurable and tied to business impact (NPS, conversion rate, resolution time) — well above average for AI engagements.',
        gaps: ['All three baselines (conversion rate, NPS, resolution time) are client-provided and unverified at SOW signing', 'Responsible AI deployment condition is a governance outcome, not a business outcome — should be separated'],
        recommendation: 'Conduct a baseline measurement sprint in Month 1 to lock current-state metrics before any agent is trained on them.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 8.5,
        strength: '240-property rollout is structured as wave-based with explicit agent specs for all three AI agents and named integration points.',
        gaps: ['Multi-language support (5 languages) does not specify which properties receive which language configuration', 'Phase 4 rollout waves are not defined — 240 properties in how many waves over how many weeks?'],
        recommendation: 'Add a property-language mapping and a 4-wave rollout plan (60 properties per wave) to Phase 4 scope definition.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 8.0,
        strength: 'PMS system count (2 named), language count (5 named), and training session count (3) are all explicitly bounded.',
        gaps: ['No statement on what constitutes a "property" — resort complexes with multiple buildings may dispute the property count'],
        recommendation: 'Add a property definition: each independently managed property management system instance counts as one property.' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 7.5,
        strength: 'IOI confirmation and GDPR approval are correctly identified as pre-conditions with Phase 1 exit gate enforcement.',
        gaps: ['GDPR approval timeline is a hard gate but no contingency exists if client Privacy Counsel takes longer than Phase 1', '24-month historical data requirement is stated but data quality standards are not defined'],
        recommendation: 'Add a data quality assessment deliverable in Phase 1 to validate that historical data meets model training requirements before Phase 2.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 8.5,
        strength: 'GDPR hard gate is explicitly called out with a commercial impact trigger — strong enforceable language.',
        gaps: ['No milestone for Responsible AI Review Board approval before each agent deployment — this is a governance requirement but not on the timeline'],
        recommendation: 'Add RAI Board approval as a formal milestone (3-day review window) before each agent go-live event.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 8.5,
        strength: 'Azure OpenAI consumption costs are cleanly separated from engagement fee — no ambiguity on what client pays for infrastructure vs. services.',
        gaps: ['IOI conditions reference an approval memo not attached to the SOW — the memo should be Appendix A'],
        recommendation: 'Attach IOI approval memo as Appendix A; SOW Section 8 references it by exhibit number.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 8.0,
        strength: 'Responsible AI Review Board as a standing governance body before each agent deployment is industry-leading practice.',
        gaps: ['Wave activation sign-off process (60 properties per wave) does not specify who performs readiness checks'],
        recommendation: 'Assign client regional IT leads as property readiness certification owners for each wave before Phase 4.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 8.0,
        strength: 'AI model underperformance risk has a specific mitigation (A/B gate, optimization sprint) — more rigorous than typical AI SOWs.',
        gaps: ['No risk entry for guest data breach during AI model training on production PMS data', 'Multi-country regulatory variance beyond GDPR (e.g., data localization in China, Middle East) is unaddressed'],
        recommendation: 'Add a data security risk for training data handling and a note on non-EU property regulatory applicability.' },
    ],
    alignmentFlags: [
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'Scope → Timeline', status: 'ok' },
      { label: 'GDPR Assumption → Risk Register', status: 'ok' },
      { label: 'IOI → Commercial Terms', status: 'warning', detail: 'IOI approval memo is referenced in Section 8 but is not attached as an exhibit to the SOW.' },
    ],
  },

  // ─── 4. ALPINE INSURANCE GROUP ───────────────────────────────────────────
  'Alpine Insurance Group': {
    compositeScore: 8.8,
    sections: [
      {
        id: 'executive-summary', number: '1.', title: 'Executive Summary',
        content: [
          { t: 'p', text: 'Microsoft Professional Services will implement a Zero Trust security architecture for Alpine Insurance Group, a 3,200-seat insurance firm subject to Solvency II and GDPR. The 9-month engagement covers Entra ID modernization with PIM and identity governance, Intune device management for all 3,200 seats, Microsoft Defender for Endpoint, and Microsoft Sentinel with a Solvency II compliance analytics pack. No subcontractors are involved.' },
          { t: 'table', headers: ['Field', 'Detail'], rows: [
            ['Client', 'Alpine Insurance Group'],
            ['Vendor', 'Microsoft Professional Services (no subcontractors)'],
            ['Engagement Type', 'Zero Trust & Security Compliance'],
            ['Engagement Period', '9 months from kickoff'],
            ['Seat Coverage', '3,200 seats'],
            ['Regulatory Scope', 'Solvency II, GDPR'],
          ]},
        ],
      },
      {
        id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes',
        dimensionKey: 'outcome_clarity',
        content: [
          { t: 'bullets', items: [
            '100% MFA enforcement across all 3,200 seats with no legacy authentication protocols active',
            'Solvency II compliance posture score ≥90% as measured by Sentinel analytics dashboard',
            'Endpoint compliance rate ≥98% (Intune-managed, Defender enrolled) across all devices',
            'Mean Time to Respond (MTTR) to security incidents reduced to <30 minutes via Sentinel SOAR',
            'Zero standing privileged access — all admin actions governed by Entra ID PIM with time-bound elevation',
          ]},
          { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [
            ['MFA enforcement rate', 'Partial (estimated 55%)', '100%', 'Entra ID MFA report'],
            ['Solvency II posture score', 'Not measured', '≥90%', 'Sentinel Solvency II analytics pack'],
            ['Endpoint compliance rate', 'Unknown', '≥98%', 'Defender compliance report'],
            ['MTTR (P1 incidents)', '>2 hours (estimated)', '<30 minutes', 'Sentinel incident tracker'],
          ]},
        ],
      },
      {
        id: 'scope', number: '3.', title: 'Scope of Work',
        dimensionKey: 'scope_completeness',
        content: [
          { t: 'table', headers: ['Phase', 'Duration', 'Key Activities', 'Deliverables'], rows: [
            ['Phase 1 — Identity Foundation', 'Months 1–3', 'Entra ID PIM rollout, identity governance policies, Conditional Access for 3,200 seats, legacy auth elimination', 'Identity Baseline Report, CA Policy Library, PIM Governance Runbook'],
            ['Phase 2 — Device Management', 'Months 3–6', 'Intune MDM/MAM for all 3,200 seats, Defender for Endpoint enrollment, device compliance baselines', 'Device Compliance Report, Defender Enrollment Report'],
            ['Phase 3 — Sentinel & Solvency II', 'Months 6–9', 'Sentinel SIEM deployment, Solvency II analytics pack configuration, SOAR playbooks, final hardening review', 'Sentinel Deployment Report, Solvency II Dashboard, Hardening Report'],
          ]},
        ],
      },
      {
        id: 'out-of-scope', number: '4.', title: 'Out of Scope',
        dimensionKey: 'out_of_scope',
        content: [
          { t: 'bullets', items: [
            'Physical access controls and building security systems',
            'Solvency II actuarial report obligations and regulatory filing (advisory guidance only)',
            'GDPR compliance outside the identity and data access scope defined in Section 3',
            'Legacy claims processing system migration or modernization',
            'Security awareness training beyond one train-the-trainer SOC workshop',
            'Any workloads or seats beyond the 3,200-seat inventory confirmed at kickoff',
          ]},
        ],
      },
      {
        id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies',
        dimensionKey: 'assumption_quality',
        content: [
          { t: 'bullets', items: [
            'Entra ID tenant is hybrid (Azure AD Connect) and can be transitioned to cloud-managed identities without disruption',
            'Existing Microsoft E5 licensing covers Entra ID P2, Intune, Defender for Endpoint, and Sentinel — confirmed pre-contract',
            'Solvency II analytics ruleset is confirmed with client Risk & Compliance team before Phase 3 begins',
            'Client IT will dedicate 1 FTE (identity administrator) to support Phase 1 Entra ID transition',
            'Device inventory of 3,200 seats is accurate; additions require a Change Order',
            'Client CISO will sign off on all Conditional Access policy configurations before production activation',
          ]},
        ],
      },
      {
        id: 'timeline', number: '6.', title: 'Project Timeline & Milestones',
        dimensionKey: 'timeline_enforceability',
        content: [
          { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [
            ['Kickoff & Identity Assessment', 'Month 1', 'No', '20% on start'],
            ['Entra ID PIM + Identity Governance Live', 'Month 3', 'Yes', '25% on Identity Baseline Report'],
            ['3,200 Seats on Intune + Defender', 'Month 6', 'Yes', '25% on Device Compliance Report'],
            ['Sentinel Live + Solvency II Dashboard', 'Month 9', 'Yes', '30% on Sentinel Deployment Report'],
          ]},
        ],
      },
      {
        id: 'governance', number: '7.', title: 'Governance & Change Management',
        dimensionKey: 'governance_readiness',
        content: [
          { t: 'bullets', items: [
            'Steering Committee: CISO + Chief Risk Officer (client) + Engagement Director (Microsoft) — bi-weekly',
            'Regulatory compliance track: Monthly review with client Risk & Compliance team and MS Solvency II specialist',
            'Escalation: L1 → Security PM | L2 → Delivery Lead | L3 → Engagement Executive / CISO',
            'CA policy sign-off: All Conditional Access policies reviewed and signed by CISO before production activation',
            'Change control: Written request → 3-business-day assessment → CISO + MS Director sign-off',
          ]},
        ],
      },
      {
        id: 'commercial', number: '8.', title: 'Commercial Terms',
        dimensionKey: 'commercial_integrity',
        content: [
          { t: 'table', headers: ['Item', 'Detail'], rows: [
            ['Pricing model', 'Fixed fee — phased billing aligned to milestone acceptance'],
            ['Internal investment (ECIF)', 'None committed for this engagement'],
            ['Vendor', 'None — pure Microsoft PS delivery'],
            ['Expense policy', 'Included in fixed fee; no separate expense billing'],
            ['Payment terms', 'Net 30 from invoice date'],
          ]},
        ],
      },
      {
        id: 'risk', number: '9.', title: 'Preliminary Risk Register',
        dimensionKey: 'risk_visibility',
        content: [
          { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
            ['Entra ID hybrid sync errors during AD transition cause authentication disruption', 'Medium', 'High', 'Staged rollout (pilot group → department waves); rollback procedure documented before each wave'],
            ['Solvency II analytics ruleset requires custom development beyond standard pack', 'Medium', 'Medium', 'Ruleset confirmation with Risk & Compliance team is Phase 2 exit gate; custom rules handled via Change Order'],
            ['Device enrollment rate below 98% due to unmanaged contractor devices', 'Medium', 'Medium', 'Contractor device policy defined in Phase 1; contractors may require guest-device onboarding track'],
            ['Legacy claims system incompatible with Conditional Access — requires authentication exception', 'Low', 'High', 'Legacy system audit in Month 1; CA exceptions documented and CISO-approved before Phase 1 close'],
          ]},
        ],
      },
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 9.0,
        strength: 'All five outcomes are specific, measurable, and tied to named measurement instruments (Sentinel Solvency II dashboard, Entra MFA report).',
        gaps: ['MFA baseline "estimated 55%" should be replaced with verified figure from an identity audit before Phase 1 ends'],
        recommendation: 'Commission an identity audit in Week 1 to lock current MFA and privileged access baselines.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 9.0,
        strength: 'Three phases are cleanly decomposed with device and identity counts explicit; Solvency II analytics pack is named specifically.',
        gaps: ['SOAR playbook count and scope are not specified — what incidents does SOAR automate?'],
        recommendation: 'Define a list of 5–10 named SOAR playbooks (e.g., MFA bypass alert, impossible travel) to be developed in Phase 3.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 8.8,
        strength: 'Solvency II actuarial filing exclusion is precisely defined — prevents scope confusion with the compliance analytics scope.',
        gaps: ['Legacy claims system exclusion does not address how it integrates with Conditional Access — authentication flow is unclear'],
        recommendation: 'Add a legacy system authentication exception process: CISO-approved documented exceptions listed in Appendix B.' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 9.0,
        strength: 'Licensing pre-verification, Solvency II ruleset confirmation gate, and CISO CA sign-off are all specific and enforceable assumptions.',
        gaps: ['Hybrid AD Connect health is assumed but not verified — a degraded sync state would materially affect Phase 1 timeline'],
        recommendation: 'Add an AD Connect health assessment as a Day 1 activity with a go/no-go gate before Entra ID transition begins.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 8.5,
        strength: 'Four milestones with payment triggers cover all three phases; go/no-go gates at every major phase exit.',
        gaps: ['No buffer between Phase 2 and Phase 3 — device enrollment delay could compress Sentinel timeline'],
        recommendation: 'Build a 2-week enrollment completion buffer at Month 5.5 before Phase 3 begins.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 9.0,
        strength: 'Cleanest commercial structure in the portfolio — fixed fee, no vendor, no ECIF complexity, no separate expense billing.',
        gaps: ['No statement on what happens commercially if the 3,200-seat count increases — Change Order process is implied but not stated'],
        recommendation: 'Add an explicit sentence: seat additions beyond 3,200 require a Change Order priced at the per-seat rate in Schedule A.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 8.5,
        strength: 'Monthly regulatory compliance review cadence with a named MS Solvency II specialist is a strong governance differentiator.',
        gaps: ['Chief Risk Officer is named as a Steering Committee member but their approval authority vs. CISO is not defined'],
        recommendation: 'Clarify decision authority: CISO owns security policy decisions; CRO owns regulatory compliance decisions.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 9.0,
        strength: 'Hybrid AD sync rollback procedure and Solvency II ruleset customization risk are both specific and have actionable mitigations.',
        gaps: ['GDPR data breach risk during identity migration (user data in Entra) is not addressed in the risk register'],
        recommendation: 'Add a GDPR identity data risk entry: data minimization policy applied during Entra migration, DPO notified.' },
    ],
    alignmentFlags: [
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'Scope → Timeline', status: 'ok' },
      { label: 'Assumptions → Risk Register', status: 'ok' },
      { label: 'Solvency II Assumption → Risk Register', status: 'ok' },
    ],
  },

  // ─── 5. CONTOSO FINANCIAL GROUP ──────────────────────────────────────────
  'Contoso Financial Group': {
    compositeScore: 7.5,
    sections: [
      {
        id: 'executive-summary', number: '1.', title: 'Executive Summary',
        content: [
          { t: 'p', text: 'Microsoft Professional Services will deliver Phase 1 of an Azure cloud migration program for Contoso Financial Group, a mid-tier commercial bank. Phase 1 covers migration of 40 core banking workloads (Lift-Shift), an FFIEC-compliant Azure Landing Zone, and network architecture (ExpressRoute + hybrid DNS). Eviden subcontracts migration factory execution at 15% of program effort. Phase 2 (80 workloads) is a separate SOW pending Phase 1 completion.' },
          { t: 'table', headers: ['Field', 'Detail'], rows: [
            ['Client', 'Contoso Financial Group'],
            ['Vendor', 'Microsoft Professional Services (Eviden subcontract — 15%)'],
            ['Engagement Type', 'Cloud Migration — Regulated Financial Services'],
            ['Engagement Period', '12 months from kickoff'],
            ['Regulatory Scope', 'FFIEC, OCC'],
            ['Workloads in Scope', '40 core banking workloads (Phase 1)'],
          ]},
        ],
      },
      {
        id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes',
        dimensionKey: 'outcome_clarity',
        content: [
          { t: 'bullets', items: [
            '40 core banking workloads migrated to Azure by Month 12 with zero data loss',
            'FFIEC-compliant Azure Landing Zone operational and validated by client Risk team before any workload migration begins',
            'ExpressRoute connectivity live with latency <10ms to core banking systems',
            'Monthly Azure ACR of $96,000 established by Month 12',
          ]},
          { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [
            ['Core banking workloads migrated', '0 of 40', '40 (100%)', 'Azure migration tracker'],
            ['Landing Zone FFIEC compliance', 'Not assessed', 'Validated by client Risk team', 'FFIEC compliance review sign-off'],
            ['ExpressRoute latency', 'N/A', '<10ms to core banking systems', 'Azure Network Watcher'],
            ['Monthly Azure ACR', '$0', '$96,000', 'Azure Cost Management'],
          ]},
        ],
      },
      {
        id: 'scope', number: '3.', title: 'Scope of Work',
        dimensionKey: 'scope_completeness',
        content: [
          { t: 'table', headers: ['Phase', 'Duration', 'Key Activities', 'Deliverables'], rows: [
            ['Phase 1 — FFIEC Landing Zone', 'Months 1–3', 'FFIEC-compliant hub-spoke LZ, security baseline, ExpressRoute, hybrid DNS, network segmentation', 'LZ Design Doc, FFIEC Compliance Map, Network Architecture Sign-Off'],
            ['Phase 2 — Core Banking Migration', 'Months 4–12', '40 workload Lift-Shift migrations (Eviden executes 15%), wave-based with banking system cutover windows', 'Wave completion reports (×4), Migration runbooks, Cutover checklist'],
            ['Phase 3 — Zero Trust Overlay', 'Months 8–12', 'Entra ID integration, Defender for Cloud policies, FFIEC-aligned access controls', 'ZT Implementation Report'],
          ]},
          { t: 'p', text: 'Note: Phase 2 scope detail (80 workloads) will be addressed in a separate SOW. This document governs Phase 1 only.' },
        ],
      },
      {
        id: 'out-of-scope', number: '4.', title: 'Out of Scope',
        dimensionKey: 'out_of_scope',
        content: [
          { t: 'bullets', items: [
            'Phase 2 workloads (80 workloads) — governed by a separate SOW',
            'Application modernization or code changes beyond Lift-Shift execution',
            'Network hardware refresh or physical circuit provisioning (ExpressRoute circuit provisioned by client network team)',
            'FFIEC compliance reporting or regulatory filing — advisory guidance only',
            'Eviden scope beyond migration factory execution as defined in the Eviden subcontract SOW',
          ]},
          { t: 'p', text: 'Phase 2 hand-off criteria: A Phase 1 lessons learned report and workload migration inventory will be produced to inform Phase 2 scoping. Phase 2 pricing is not guaranteed at Phase 1 contract rates.' },
        ],
      },
      {
        id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies',
        dimensionKey: 'assumption_quality',
        content: [
          { t: 'bullets', items: [
            'FFIEC compliance review will be completed by client Risk team before Phase 2 workload migrations begin',
            'Eviden will receive environment access credentials within 10 business days of kickoff',
            'ExpressRoute circuit provisioned by client network team and live before Month 4',
            'Core banking system cutover windows will be agreed with client operations team before Phase 2 begins',
            '40 workload inventory is accurate — additions require a Change Order',
          ]},
          { t: 'p', text: 'Note: The FFIEC compliance assumption is the single highest-risk assumption in this SOW. If the client Risk team has not completed review before Phase 2 begins, Phase 2 cannot start and a timeline and commercial impact review will be triggered.' },
        ],
      },
      {
        id: 'timeline', number: '6.', title: 'Project Timeline & Milestones',
        dimensionKey: 'timeline_enforceability',
        content: [
          { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [
            ['FFIEC Landing Zone Approved by Client Risk', 'Month 3', 'Yes', '25% on LZ acceptance'],
            ['ExpressRoute Live', 'Month 4', 'No (client-owned)', '—'],
            ['Wave 2 — 20 workloads migrated', 'Month 8', 'Yes', '30% on wave reports'],
            ['Wave 4 — 40 workloads migrated', 'Month 12', 'Yes', '35% on completion'],
            ['ZT Overlay Complete', 'Month 12', 'No', '10% on ZT Report'],
          ]},
          { t: 'p', text: 'FFIEC compliance audit dependency: if the client Risk team audit is not complete by Month 2 Week 3, the Phase 2 start date shifts proportionally and a timeline revision notice will be issued.' },
        ],
      },
      {
        id: 'governance', number: '7.', title: 'Governance & Change Management',
        dimensionKey: 'governance_readiness',
        content: [
          { t: 'bullets', items: [
            'Steering Committee: Bank IT VP (client) + Engagement Director (Microsoft) + Eviden Delivery Manager — bi-weekly',
            'FFIEC compliance track: Monthly review with client Risk & Compliance team; separate from delivery governance',
            'Eviden weekly sync: Microsoft PM facilitates; Eviden reports against migration wave metrics',
            'Escalation: L1 → Microsoft PM | L2 → Delivery Lead | L3 → Engagement Executive / Bank IT VP',
            'Cutover change control: All core banking cutover windows require 48-hour pre-approval from Bank Operations',
          ]},
        ],
      },
      {
        id: 'commercial', number: '8.', title: 'Commercial Terms',
        dimensionKey: 'commercial_integrity',
        content: [
          { t: 'table', headers: ['Item', 'Detail'], rows: [
            ['Pricing model', 'Fixed fee by phase, milestone-triggered billing'],
            ['Internal investment (ECIF)', '5% offset applied to Phase 1 FFIEC Landing Zone work'],
            ['Eviden subcontract', 'Included in total; Microsoft assumes commercial risk for Eviden delivery'],
            ['Margin note', '26% sold margin — Finance flagged as tight for FFIEC-regulated complexity; Phase 2 target +2 pts'],
            ['Payment terms', 'Net 30 from milestone acceptance'],
          ]},
        ],
      },
      {
        id: 'risk', number: '9.', title: 'Preliminary Risk Register',
        dimensionKey: 'risk_visibility',
        content: [
          { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
            ['FFIEC compliance review delays Phase 2 start beyond Month 3', 'High', 'High', 'FFIEC review is a hard gate; delay triggers commercial impact review and revised milestone schedule'],
            ['Eviden scope creep in migration execution drives effort overrun', 'Medium', 'High', 'Eviden subcontract defines fixed-price migration factory scope; additions require Microsoft PM approval'],
            ['Core banking system incompatibility discovered post-discovery', 'Medium', 'High', 'Workload compatibility assessment in Months 1–2 surfaces blockers before wave execution begins'],
            ['OCC regulatory examination during engagement disrupts delivery schedule', 'Low', 'Medium', 'OCC examination dates tracked; workload migration paused during examination windows if required'],
          ]},
        ],
      },
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 7.5,
        strength: 'ACR target and workload count are measurable; ExpressRoute latency target is specific and verifiable.',
        gaps: ['Total cost of ownership (TCO) reduction target is absent — no financial business case outcome is defined', 'Phase 2 outcomes are not referenced — the business context for Phase 1 as part of a larger program is unclear'],
        recommendation: 'Add a TCO reduction business outcome with a Phase 1 contribution (e.g., 40-workload migration expected to reduce on-prem costs by $X/month).' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 8.0,
        strength: 'FFIEC landing zone and wave-based migration structure are clear; Eviden scope boundary is explicitly defined.',
        gaps: ['Phase 1 to Phase 2 hand-off criteria are described in Out-of-Scope but not in Scope — no formal transition deliverable', 'Zero Trust overlay (Phase 3) is described as months 8–12 but activities are thin'],
        recommendation: 'Add a Phase 1 Close Report as a formal deliverable that captures lessons learned, migration metrics, and Phase 2 scope recommendations.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 7.0,
        strength: 'Phase 2 workloads and Eviden subcontract boundaries are explicitly excluded.',
        gaps: ['Phase 2 hand-off criteria note is buried in Out-of-Scope rather than in a dedicated transition section', 'No statement on what happens to workloads discovered mid-Phase 1 that were not in the original 40'],
        recommendation: 'Add a workload discovery protocol: new workloads found during Phase 1 are logged; client decides include-in-Phase 1 (Change Order) or defer-to-Phase-2 within 5 business days.' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 7.0,
        strength: 'FFIEC compliance review dependency is correctly identified as a Phase 2 gate with explicit commercial consequences.',
        gaps: ['FFIEC compliance readiness of the client Risk team is assumed but not assessed — no pre-engagement readiness check', 'Cutover window agreements are deferred to Phase 2 — for core banking, this should be locked earlier'],
        recommendation: 'Add a Month 1 FFIEC readiness assessment with the client Risk team to determine their review capacity and availability before Phase 2.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 7.5,
        strength: 'FFIEC gate and ExpressRoute dependency are explicitly called out with commercial impact language.',
        gaps: ['No FFIEC audit schedule from client Risk team — the audit date is unbooked', 'Wave 1 (10 workloads) milestone is absent — only waves 2 and 4 appear on the timeline'],
        recommendation: 'Add Wave 1 (Month 6) as an explicit milestone to create a mid-program health check before the larger wave 2 commitment.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 7.5,
        strength: 'Margin risk is explicitly acknowledged in the SOW — rare and valuable transparency.',
        gaps: ['26% margin "tight" flag is noted but no contingency plan is defined for margin erosion from FFIEC compliance complexity', 'Phase 2 pricing disclaimer ("not guaranteed at Phase 1 rates") should be in commercial terms, not out-of-scope'],
        recommendation: 'Move Phase 2 pricing disclaimer to Section 8 and add a margin contingency note: if FFIEC complexity requires additional effort, a Change Order will be issued before scope is added.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 7.0,
        strength: 'FFIEC compliance track is separated from delivery governance — appropriate for a regulated engagement.',
        gaps: ['Eviden governance protocol ("Eviden weekly sync") is thin — what Eviden reports, who escalates for Eviden issues, and what authority Microsoft PM has over Eviden are undefined'],
        recommendation: 'Add a 1-page Eviden governance protocol as Appendix A: meeting cadence, reporting format, Microsoft PM authority over Eviden scope decisions.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 7.0,
        strength: 'FFIEC delay risk is correctly rated High/High — the highest-impact risk in the portfolio is accurately categorized.',
        gaps: ['No risk for data loss or corruption during core banking Lift-Shift — the highest technical risk for a bank migration is absent', 'OCC examination risk is included but no pre-examination notification protocol is defined'],
        recommendation: 'Add a data integrity risk with migration testing protocol: each workload goes through a 72-hour parallel-run validation before cutover.' },
    ],
    alignmentFlags: [
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'FFIEC Assumption → Risk Register', status: 'ok' },
      { label: 'Phase 2 Boundary → Scope & Out-of-Scope', status: 'warning', detail: 'Phase 1-to-Phase 2 transition criteria appear in Out-of-Scope but are not formalized as a deliverable in the Scope section.' },
      { label: 'Margin Risk → Commercial Terms', status: 'warning', detail: 'Margin risk acknowledgement is in Commercial Terms but no contingency mechanism is defined.' },
    ],
  },

  // ─── 6. NORTHWIND TRADERS ────────────────────────────────────────────────
  'Northwind Traders': {
    compositeScore: 8.0,
    sections: [
      {
        id: 'executive-summary', number: '1.', title: 'Executive Summary',
        content: [
          { t: 'p', text: 'Microsoft Professional Services will deliver a full Dynamics 365 Finance & Operations implementation for Northwind Traders, replacing SAP ECC across Finance, Supply Chain Management, and Warehouse Management. The 18-month program is structured in three phases and includes full data migration from SAP, integration with 4 external systems, and a 250-user training program. No subcontractors are involved.' },
          { t: 'table', headers: ['Field', 'Detail'], rows: [
            ['Client', 'Northwind Traders'],
            ['Vendor', 'Microsoft Professional Services (no subcontractors)'],
            ['Engagement Type', 'ERP Transformation — SAP ECC to D365 F&O'],
            ['Engagement Period', '18 months from kickoff'],
            ['User Training', '250 users'],
            ['External Integrations', '4 systems'],
          ]},
        ],
      },
      {
        id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes',
        dimensionKey: 'outcome_clarity',
        content: [
          { t: 'bullets', items: [
            'SAP ECC fully decommissioned by Month 18 — no production SAP usage after go-live',
            'D365 F&O live across Finance, Supply Chain, and Warehouse Management modules by Month 15',
            'Period close cycle time reduced from current baseline to ≤3 business days',
            '250 users trained and proficient in D365 F&O (proficiency measured by role-based assessment)',
            'All 4 external system integrations live and validated at go-live',
          ]},
          { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [
            ['Period close cycle time', 'Current (client to provide at kickoff)', '≤3 business days', 'Finance close log'],
            ['SAP ECC active users', 'All users at program start', '0 at Month 18', 'SAP audit log'],
            ['D365 user proficiency', 'N/A (new system)', '≥80% pass rate on role assessment', 'Training completion report'],
            ['Integration uptime at go-live', 'N/A', '≥99.5%', 'Integration monitoring dashboard'],
          ]},
        ],
      },
      {
        id: 'scope', number: '3.', title: 'Scope of Work',
        dimensionKey: 'scope_completeness',
        content: [
          { t: 'table', headers: ['Phase', 'Duration', 'Key Activities', 'Deliverables'], rows: [
            ['Phase 1 — Foundation', 'Months 1–5', 'D365 tenant setup, Chart of Accounts design, Supply Chain baseline configuration, integration architecture, data model sign-off', 'Solution Design Document, CoA Sign-Off, Integration Architecture Blueprint'],
            ['Phase 2 — Core Build', 'Months 5–12', 'Finance module build, SCM + WMS build, 4 external system integrations, Power BI dashboard development (3 dashboards)', 'Finance Build Report, SCM/WMS Build Report, Integration Test Reports (×4)'],
            ['Phase 3 — Migration, Training & Go-Live', 'Months 12–18', 'SAP data extraction + transformation + load, UAT (250 users), 250-user training delivery, go-live cutover, 3-month hypercare', 'Data Migration Report, UAT Sign-Off, Training Completion Report, Go-Live Readiness Report'],
          ]},
        ],
      },
      {
        id: 'out-of-scope', number: '4.', title: 'Out of Scope',
        dimensionKey: 'out_of_scope',
        content: [
          { t: 'bullets', items: [
            'SAP ECC decommissioning execution — advisory guidance and decommission plan only; client IT executes',
            'Custom BI/reporting beyond the 3 Power BI dashboards specified in Phase 2',
            'New hardware infrastructure or server provisioning',
            'Training for more than 250 users — additional users require a Change Order',
            'Integrations beyond the 4 named external systems — any additional integrations require a Change Order',
            'D365 HR and Payroll modules — separate engagement if required',
          ]},
        ],
      },
      {
        id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies',
        dimensionKey: 'assumption_quality',
        content: [
          { t: 'bullets', items: [
            'Client SAP team will provide data migration scope confirmation (field mapping, data volumes, cleansing rules) before Phase 1 ends',
            '4 integration endpoints are confirmed and APIs are documented and accessible before Phase 2 begins',
            'Client will designate a D365 implementation lead (1 FTE) and a finance SME (0.5 FTE) throughout the engagement',
            '250-user training schedule agreed with client HR and department heads before Phase 3 begins',
            'SAP data quality meets the minimum standards defined in the Data Quality Assessment (Phase 1 deliverable)',
            'Timeline assumes client review and decision cycles of no more than 5 business days',
          ]},
        ],
      },
      {
        id: 'timeline', number: '6.', title: 'Project Timeline & Milestones',
        dimensionKey: 'timeline_enforceability',
        content: [
          { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [
            ['Solution Design Document Accepted', 'Month 5', 'Yes', '20% on acceptance'],
            ['Finance + SCM/WMS Build Complete', 'Month 12', 'Yes', '30% on build reports'],
            ['SAP Data Migration Complete', 'Month 14', 'Yes', '20% on migration report'],
            ['UAT Sign-Off & Go-Live Readiness', 'Month 15', 'Yes', '20% on UAT acceptance'],
            ['Hypercare Complete & SAP Decommissioned', 'Month 18', 'Yes', '10% on completion report'],
          ]},
        ],
      },
      {
        id: 'governance', number: '7.', title: 'Governance & Change Management',
        dimensionKey: 'governance_readiness',
        content: [
          { t: 'bullets', items: [
            'ERP Steering Committee: CFO + COO (client) + Engagement Director (Microsoft) — bi-weekly',
            'Integration change control board: Separate from main program; any integration scope change requires board approval',
            'Go-live readiness review: Formal gate at Month 15 with CFO sign-off required before production cutover',
            'Escalation: L1 → D365 PM | L2 → Delivery Lead | L3 → Engagement Executive / CFO',
            'Southridge D365 delivery lead engaged as SME advisor throughout Phase 2 and 3',
            'Change control: Written request → 5-business-day assessment → CFO + MS Engagement Director sign-off',
          ]},
        ],
      },
      {
        id: 'commercial', number: '8.', title: 'Commercial Terms',
        dimensionKey: 'commercial_integrity',
        content: [
          { t: 'table', headers: ['Item', 'Detail'], rows: [
            ['Pricing model', 'Fixed fee by phase, milestone-triggered billing'],
            ['Internal investment (ECIF)', 'None'],
            ['Vendor', 'None — pure Microsoft PS delivery'],
            ['Payment terms', 'Net 30 from milestone acceptance'],
            ['Change order', 'Written scope changes → 5-business-day assessment → CFO + MS Director sign-off'],
          ]},
        ],
      },
      {
        id: 'risk', number: '9.', title: 'Preliminary Risk Register',
        dimensionKey: 'risk_visibility',
        content: [
          { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
            ['SAP data quality issues delay migration (missing fields, corrupt records, cleansing effort)', 'High', 'High', 'Data quality assessment in Phase 1 with client sign-off on quality standards before migration begins'],
            ['Integration endpoint incompatibility — API not as documented', 'Medium', 'High', 'Integration pre-qualification in Month 2; each endpoint validated by a test connection before Phase 2'],
            ['250-user training engagement below target — low adoption at go-live', 'Medium', 'Medium', 'Train-the-trainer model in Phase 3; role-based assessments gate go-live readiness per department'],
            ['SAP decommission delayed by client IT — SAP remains live past Month 18', 'Medium', 'Low', 'Decommission plan delivered at Month 14; client IT owns execution — delayed decommission is commercial risk to client, not MS'],
          ]},
        ],
      },
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 8.5,
        strength: 'Period close time reduction and SAP decommission date are specific, measurable, and enforceable.',
        gaps: ['Period close baseline is "client to provide at kickoff" — if not provided promptly, the improvement metric is unverifiable', 'No cost efficiency or ROI outcome — the business case for replacing SAP is absent from outcomes'],
        recommendation: 'Add a Month 1 gate: client Finance team provides current period close log as baseline before Solution Design begins.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 8.0,
        strength: 'Three phases are clearly decomposed with module-level activities; integration count and training user count are explicit.',
        gaps: ['Integration architecture detail is thin — 4 integrations are named by count but not by system name or integration type', 'WMS scope (Warehouse Management) is listed but warehouse count and configuration complexity are unstated'],
        recommendation: 'Add a named integration register in Appendix A listing all 4 external systems, integration type (API/EDI/flat file), and direction.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 8.0,
        strength: 'SAP decommission advisory-only boundary and 250-user training cap are precisely stated.',
        gaps: ['HR and Payroll module exclusion is noted but not connected to what happens if the client asks for it mid-engagement'],
        recommendation: 'Add: "If D365 HR/Payroll is required, a separate SOW will be issued; HR/Payroll requirements discovered during Phase 2 will not delay core F&O delivery."' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 7.5,
        strength: 'Data migration scope confirmation and client resource commitments (1 FTE + 0.5 FTE) are specific and time-bound.',
        gaps: ['SAP data quality standards are deferred to a Phase 1 deliverable — the standards themselves are not pre-agreed, creating risk if client and vendor disagree on what "acceptable" means'],
        recommendation: 'Define minimum data quality thresholds (e.g., <5% null values in mandatory fields) in this SOW rather than deferring entirely to Phase 1.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 8.0,
        strength: 'Five milestones cover all phases with go/no-go gates and payment triggers; CFO sign-off on go-live is a strong governance control.',
        gaps: ['No milestone for data quality assessment sign-off (Phase 1 critical path item)', 'Integration pre-qualification (Month 2) is in assumptions but not on the milestone timeline'],
        recommendation: 'Add Month 2 integration pre-qualification as a formal milestone — if any integration fails, timeline impact is surfaced early.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 8.5,
        strength: 'Fixed fee per phase with clear change order triggers — simple, clean commercial structure.',
        gaps: ['SAP data quality remediation effort is a material risk but no commercial contingency is built in'],
        recommendation: 'Add a change order trigger: if data quality remediation exceeds 40 person-hours, a Change Order is issued before additional effort is incurred.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 8.0,
        strength: 'Integration change control board (separate from main governance) is appropriate for integration-heavy ERP programs.',
        gaps: ['Southridge SME advisor engagement is mentioned but their role, time commitment, and decision authority are not defined'],
        recommendation: 'Define Southridge advisor role: attends Phase 2 design reviews (2 hrs/week), provides non-binding recommendations, no decision authority.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 7.5,
        strength: 'SAP data quality risk is rated High/High — correctly elevated above all other risks.',
        gaps: ['No risk for go-live cutover failure — what happens if the production cutover to D365 fails and a rollback to SAP is required?', 'Training adoption risk mitigation (train-the-trainer) does not address what happens if go-live readiness assessment shows <60% proficiency'],
        recommendation: 'Add a go-live rollback risk: define rollback decision criteria (e.g., >10 P1 defects within 24 hours of cutover triggers rollback to SAP) and rollback procedure.' },
    ],
    alignmentFlags: [
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'Scope → Timeline', status: 'ok' },
      { label: 'SAP Data Assumption → Risk Register', status: 'ok' },
      { label: 'Integration Register → Scope', status: 'warning', detail: 'Section 3 references 4 integrations but no named integration register exists as a deliverable or appendix.' },
    ],
  },

  // ─── 7. NORTHWIND HEALTHCARE SYSTEM ──────────────────────────────────────
  'Northwind Healthcare System': {
    compositeScore: 8.0,
    sections: [
      {
        id: 'executive-summary', number: '1.', title: 'Executive Summary',
        content: [
          { t: 'p', text: 'Microsoft Professional Services will deliver a comprehensive HIPAA/HITECH compliance and security platform for Northwind Healthcare System, an 8-hospital system across APAC. The 11-month engagement covers Microsoft Purview for PHI classification and data governance, Microsoft Sentinel SIEM with HIPAA analytics ruleset, and Entra ID modernization with clinical workforce identity governance. A Business Associate Agreement (BAA) is in place. Microsoft has committed an 8% co-investment aligned to healthcare vertical priority.' },
          { t: 'table', headers: ['Field', 'Detail'], rows: [
            ['Client', 'Northwind Healthcare System'],
            ['Vendor', 'Microsoft Professional Services (no subcontractors)'],
            ['Engagement Type', 'Healthcare Security & HIPAA Compliance'],
            ['Engagement Period', '11 months from kickoff'],
            ['Hospital Scope', '8 hospitals, APAC'],
            ['Regulatory Scope', 'HIPAA, HITECH'],
            ['Co-Investment', '8% committed'],
          ]},
        ],
      },
      {
        id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes',
        dimensionKey: 'outcome_clarity',
        content: [
          { t: 'bullets', items: [
            'HIPAA compliance posture score ≥92% across all 8 hospitals as measured by Sentinel analytics dashboard',
            'PHI classified and governed in Microsoft Purview for 100% of identified PHI data stores',
            'Clinical workforce on Entra ID with PIM by Month 11 — zero standing clinical admin access',
            'Mean Time to Detect (MTTD) PHI access anomalies reduced to <5 minutes via Sentinel',
            'HITECH breach notification process supported by Purview audit trail and Sentinel alerting',
          ]},
          { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [
            ['HIPAA compliance posture', 'Not measured', '≥92%', 'Sentinel HIPAA analytics dashboard'],
            ['PHI data stores classified', '0 (unmapped)', '100% of identified stores', 'Purview data map report'],
            ['Clinical staff on Entra PIM', '0%', '100% of clinical admins', 'Entra PIM audit log'],
            ['MTTD for PHI access anomaly', 'No detection (no SIEM)', '<5 minutes', 'Sentinel incident log'],
          ]},
        ],
      },
      {
        id: 'scope', number: '3.', title: 'Scope of Work',
        dimensionKey: 'scope_completeness',
        content: [
          { t: 'table', headers: ['Phase', 'Duration', 'Key Activities', 'Deliverables'], rows: [
            ['Phase 1 — HIPAA Assessment + BAA', 'Month 1', 'HIPAA baseline assessment across 8 hospitals, PHI data store inventory, BAA countersign verification, gap analysis', 'HIPAA Gap Assessment, PHI Data Store Inventory, BAA Status Report'],
            ['Phase 2 — Purview PHI Governance', 'Months 2–8', 'Purview data classification, PHI labeling policies, data loss prevention rules, DLP across email and SharePoint for clinical staff (4 hospitals in Phase 2a, 4 in Phase 2b)', 'Purview Classification Report (×2), DLP Policy Library'],
            ['Phase 3 — Entra ID + Sentinel', 'Months 8–11', 'Entra ID clinical workforce identity governance, PIM for clinical admins, Sentinel SIEM with HIPAA analytics ruleset, HITECH breach alerting', 'Identity Governance Report, Sentinel HIPAA Report, Breach Alert Runbook'],
          ]},
        ],
      },
      {
        id: 'out-of-scope', number: '4.', title: 'Out of Scope',
        dimensionKey: 'out_of_scope',
        content: [
          { t: 'bullets', items: [
            'Hospital-specific clinical application customization beyond HIPAA access controls (e.g., EMR/EHR system modifications)',
            'HITECH breach notification process design and execution — advisory guidance and tooling only; legal and compliance execution is client-owned',
            'Physical PHI storage, printed records, and physical access controls',
            'APAC-specific local regulatory requirements beyond HIPAA/HITECH — each hospital\'s in-country counsel to advise on local law',
            'Staff security awareness training beyond 2 train-the-trainer sessions for clinical team leads',
          ]},
        ],
      },
      {
        id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies',
        dimensionKey: 'assumption_quality',
        content: [
          { t: 'bullets', items: [
            'BAA will be countersigned before any PHI is accessed in any workstream (mandatory pre-condition)',
            'PHI data store inventory will be provided by client Privacy team before Phase 2 begins',
            'Entra ID tenant exists and is connectable to clinical systems for all 8 hospitals',
            'Client will designate a Privacy Officer to co-own the PHI classification process in Phase 2',
            'APAC in-country regulatory compliance is the client\'s responsibility; this engagement addresses HIPAA/HITECH only',
            'All 8 hospitals operate on a common Azure AD tenant (or federated tenants compatible with Entra ID governance)',
          ]},
        ],
      },
      {
        id: 'timeline', number: '6.', title: 'Project Timeline & Milestones',
        dimensionKey: 'timeline_enforceability',
        content: [
          { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [
            ['HIPAA Assessment + BAA Countersigned', 'Month 1', 'Yes', '15% on assessment acceptance'],
            ['Purview Phase 2a — 4 hospitals classified', 'Month 5', 'Yes', '25% on Phase 2a report'],
            ['Purview Phase 2b — all 8 hospitals classified', 'Month 8', 'Yes', '25% on Phase 2b report'],
            ['Entra ID + Sentinel Operational', 'Month 11', 'Yes', '35% on final delivery report'],
          ]},
          { t: 'p', text: 'BAA countersign is a hard gate before Phase 2 begins. Any PHI access before BAA countersign violates HIPAA obligations — work will pause until BAA is executed.' },
        ],
      },
      {
        id: 'governance', number: '7.', title: 'Governance & Change Management',
        dimensionKey: 'governance_readiness',
        content: [
          { t: 'bullets', items: [
            'Program Steering: CISO + Privacy Officer (client) + Engagement Director (Microsoft) — bi-weekly',
            'APAC Legal Track: Separate monthly call with in-country counsel per hospital as needed; Microsoft provides advisory support only',
            'Clinical governance: MS Healthcare Architect participates in Phase 2 hospital-by-hospital rollout reviews',
            'Escalation: L1 → HIPAA PM | L2 → Delivery Lead | L3 → Engagement Executive / CISO + Privacy Officer',
            'PHI access governance: Any unplanned PHI access is immediately escalated to Privacy Officer and Engagement Director',
          ]},
        ],
      },
      {
        id: 'commercial', number: '8.', title: 'Commercial Terms',
        dimensionKey: 'commercial_integrity',
        content: [
          { t: 'table', headers: ['Item', 'Detail'], rows: [
            ['Pricing model', 'Fixed fee by phase, milestone-triggered billing'],
            ['Co-investment', '8% offset applied to Phase 1 HIPAA Assessment and Phase 3 Sentinel foundation work'],
            ['Vendor', 'None — pure Microsoft PS delivery'],
            ['Payment terms', 'Net 30 from milestone acceptance'],
            ['Change order', 'Written request → 5-business-day assessment → Privacy Officer + MS Director sign-off'],
          ]},
        ],
      },
      {
        id: 'risk', number: '9.', title: 'Preliminary Risk Register',
        dimensionKey: 'risk_visibility',
        content: [
          { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
            ['APAC in-country regulatory variance beyond HIPAA — local law imposes additional requirements', 'Medium', 'High', 'APAC legal track established; client in-country counsel engaged in Month 1 per hospital; MS provides HIPAA scope only'],
            ['PHI data inventory incomplete — additional stores discovered post-Phase 1', 'Medium', 'High', 'Phase 1 includes a structured discovery sprint; additional stores found in Phase 2 are handled via Change Order'],
            ['BAA countersigning delayed beyond Day 1 of Phase 2', 'Low', 'High', 'BAA is a hard gate; Phase 2 work pauses until countersigned; delay triggers timeline revision'],
            ['Clinical Entra ID tenant connectivity issues — hospital systems on isolated network segments', 'Medium', 'Medium', 'Tenant connectivity pre-assessment in Month 1; network requirements documented before Phase 3'],
          ]},
        ],
      },
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 8.5,
        strength: 'HIPAA compliance posture score target (≥92%) tied to a specific measurement instrument (Sentinel HIPAA dashboard) is unusually precise for compliance engagements.',
        gaps: ['PHI "100% of identified data stores" depends on the accuracy of the Phase 1 inventory — the outcome may be technically met while leaving unidentified stores unaddressed', 'No patient safety outcome — an 8-hospital healthcare engagement should reference the clinical impact of improved security posture'],
        recommendation: 'Add a patient safety outcome: "PHI breach risk reduced, supporting continuity of clinical operations" — even qualitative, it anchors the business case in clinical impact.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 8.0,
        strength: 'Two-wave Purview deployment (Phase 2a/2b — 4 hospitals each) is well-structured; BAA verification as a Phase 1 deliverable is correctly placed.',
        gaps: ['Sentinel HIPAA analytics ruleset content is not specified — how many rules, covering which HIPAA controls?', 'Cross-hospital dependency (shared Entra tenant assumption) could affect Phase 3 scope if hospitals have isolated tenants'],
        recommendation: 'Add a Sentinel HIPAA rule count (minimum 20 rules covering the 18 HIPAA security rule technical safeguards) to Phase 3 scope.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 7.5,
        strength: 'HITECH breach notification execution (client-owned) and physical PHI controls are explicitly excluded.',
        gaps: ['APAC local regulatory exclusion is broad — clients may interpret "each hospital\'s in-country counsel advises" as Microsoft will coordinate this, which is not the case'],
        recommendation: 'Restate: "APAC local regulatory compliance is entirely the client\'s responsibility. Microsoft will not review, advise on, or implement controls for non-HIPAA local requirements."' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 7.5,
        strength: 'BAA mandatory pre-condition with work-pause language is the strongest assumption statement in this SOW.',
        gaps: ['Common Entra ID tenant assumption is a material technical dependency that is not verified pre-engagement', 'PHI data store inventory quality is assumed adequate but no quality standards are defined'],
        recommendation: 'Add a Month 1 Entra ID connectivity pre-assessment to verify tenant federation compatibility across all 8 hospitals before Phase 3 is scoped.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 8.0,
        strength: 'BAA hard gate with explicit work-pause language is enforceable and commercially clear.',
        gaps: ['No milestone for Entra ID connectivity pre-assessment — this is a critical path dependency for Phase 3 that occurs in Month 1 but is not on the timeline'],
        recommendation: 'Add Month 1 Entra connectivity assessment as a milestone with a go/no-go gate before Phase 3 is committed.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 8.5,
        strength: 'Co-investment application is phase-specific (Phase 1 and Phase 3 foundation) — clear and auditable.',
        gaps: ['Co-investment conditions reference an 8% figure but the approval memo or conditions are not attached'],
        recommendation: 'Attach the co-investment approval memo as Appendix A and reference it in Section 8.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 8.0,
        strength: 'PHI access escalation protocol (immediate escalation to Privacy Officer) is a strong clinical governance control.',
        gaps: ['APAC Legal Track cadence ("monthly as needed") is too informal for a multi-country healthcare engagement — legal issues can surface between monthly calls'],
        recommendation: 'Change APAC Legal Track to a standing bi-weekly touchpoint with a written agenda; reduce frequency only after Phase 1 assessment confirms low in-country regulatory risk.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 7.0,
        strength: 'APAC regulatory variance is correctly identified as Medium/High — the most sophisticated risk entry in this SOW.',
        gaps: ['No risk for clinical system downtime during Entra ID identity migration — a critical risk for an active hospital system', 'HITECH breach notification risk (a breach during the engagement) is absent — high consequence, even if low probability'],
        recommendation: 'Add a clinical system continuity risk: Entra ID changes are tested in a non-production environment for 2 weeks before hospital-by-hospital rollout.' },
    ],
    alignmentFlags: [
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'BAA Assumption → Timeline Gate', status: 'ok' },
      { label: 'APAC Assumption → Out-of-Scope', status: 'warning', detail: 'APAC local regulatory compliance is excluded from scope but the assumption that client counsel is engaged is unstated and unverified.' },
      { label: 'Co-investment → Commercial Terms', status: 'warning', detail: 'Co-investment approval memo is referenced but not attached as an exhibit.' },
    ],
  },

  // ─── 8. CONSOLIDATED MESSENGER ───────────────────────────────────────────
  'Consolidated Messenger': {
    compositeScore: 6.5,
    sections: [
      {
        id: 'executive-summary', number: '1.', title: 'Executive Summary',
        content: [
          { t: 'p', text: 'Microsoft Professional Services will lead a D365 Finance & Operations rollout across 14 countries for Consolidated Messenger, replacing a fragmented SAP landscape. The 28-month program covers Finance (GL, AP/AR, Fixed Assets), Logistics (Warehouse, Transportation), and HR (14 local payroll integrations). A regional SI partner manages 30% of effort for local regulatory configuration per country. The program is structured in 4 geographic waves.' },
          { t: 'p', text: 'Note: This engagement is currently flagged for Architecture Review Board assessment. The AI model has identified material SOW gaps that must be addressed before approval.' },
          { t: 'table', headers: ['Field', 'Detail'], rows: [
            ['Client', 'Consolidated Messenger'],
            ['Vendor', 'Microsoft Professional Services (Regional SI — 30%)'],
            ['Engagement Type', 'Multi-Country ERP Transformation'],
            ['Engagement Period', '28 months from kickoff'],
            ['Country Scope', '14 countries, 4 geographic waves'],
            ['Regulatory Scope', 'GDPR, Local Payroll (14 jurisdictions)'],
          ]},
        ],
      },
      {
        id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes',
        dimensionKey: 'outcome_clarity',
        content: [
          { t: 'p', text: 'The following outcomes are defined at the global program level. Country-level outcome targets are not yet specified and should be added before contract approval.' },
          { t: 'bullets', items: [
            'D365 F&O live in all 14 countries by Wave 4 completion (Month 28)',
            'Fragmented SAP landscape fully decommissioned across all countries by Month 28',
            'Period close cycle standardized globally — target cycle time TBD (client to provide current baseline)',
            'All 14 local payroll integrations live and validated at each country go-live',
          ]},
          { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [
            ['Countries on D365 F&O', '0 of 14', '14 (100%)', 'D365 system access report'],
            ['SAP active users', 'All per country', '0 at Wave 4', 'SAP audit logs (per country)'],
            ['Period close cycle time', 'Not yet measured', 'TBD before Phase 1', 'Finance close log (per country)'],
            ['Payroll integrations live', '0 of 14', '14 of 14', 'Integration test reports'],
          ]},
        ],
      },
      {
        id: 'scope', number: '3.', title: 'Scope of Work',
        dimensionKey: 'scope_completeness',
        content: [
          { t: 'p', text: 'The program is structured in 4 geographic waves. Country-level scope phasing plans are not yet included and must be developed before Wave 1 kickoff.' },
          { t: 'table', headers: ['Wave', 'Countries', 'Target Go-Live', 'SI Partner Role'], rows: [
            ['Wave 1 (Pilot)', 'Countries 1–4 (TBD)', 'Month 8', 'Local regulatory config + payroll integration (30% effort)'],
            ['Wave 2', 'Countries 5–8 (TBD)', 'Month 14', 'Same as Wave 1'],
            ['Wave 3', 'Countries 9–11 (TBD)', 'Month 20', 'Same as Wave 1'],
            ['Wave 4', 'Countries 12–14 (TBD)', 'Month 28', 'Same as Wave 1'],
          ]},
          { t: 'bullets', items: [
            'Modules in scope for all waves: Finance (GL, AP/AR, Fixed Assets), Logistics (WM, Transportation), HR',
            'Local payroll integrations: 14 integrations (1 per country); payroll vendor APIs not yet documented',
            'SI Partner scope: Local regulatory configuration and payroll integration per country; MS owns global template and program governance',
          ]},
        ],
      },
      {
        id: 'out-of-scope', number: '4.', title: 'Out of Scope',
        dimensionKey: 'out_of_scope',
        content: [
          { t: 'bullets', items: [
            'Country-by-country local payroll vendor management and contract negotiations',
            'Physical infrastructure per country',
            'GDPR data mapping beyond the D365 personal data register',
            'SAP decommissioning execution — advisory and transition planning only',
          ]},
          { t: 'p', text: 'NOTE: Country-level out-of-scope definitions are not yet included. The AI model has flagged this as a high-severity deficiency. Each country should have an explicit out-of-scope statement addressing local regulatory requirements, payroll vendor obligations, and customization limits.' },
        ],
      },
      {
        id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies',
        dimensionKey: 'assumption_quality',
        content: [
          { t: 'bullets', items: [
            'Regional SI partner will confirm resource availability per wave at least 60 days before each wave start',
            '14 local payroll vendor APIs are accessible and documented before Wave 1 begins',
            'Client will designate a country lead (1 FTE equivalent) per country for wave coordination',
          ]},
          { t: 'p', text: 'NOTE: The current assumptions section is insufficient for a 14-country, 28-month engagement. Missing assumptions include: data migration scope per country, integration readiness per country, GDPR data processing agreements per jurisdiction, and local regulatory compliance timelines. These must be completed before the Architecture Review Board assessment.' },
        ],
      },
      {
        id: 'timeline', number: '6.', title: 'Project Timeline & Milestones',
        dimensionKey: 'timeline_enforceability',
        content: [
          { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [
            ['Global Template Design Complete', 'Month 3', 'Yes', '15% on template sign-off'],
            ['Wave 1 Go-Live (4 countries)', 'Month 8', 'Yes', '20% on Wave 1 acceptance'],
            ['Wave 2 Go-Live (4 countries)', 'Month 14', 'Yes', '20% on Wave 2 acceptance'],
            ['Wave 3 Go-Live (3 countries)', 'Month 20', 'Yes', '20% on Wave 3 acceptance'],
            ['Wave 4 Go-Live (3 countries)', 'Month 28', 'Yes', '25% on Wave 4 acceptance'],
          ]},
          { t: 'p', text: 'NOTE: Country-level phase plans are absent from this timeline. Each wave should have country-specific milestones including: local regulatory sign-off dates, payroll integration test dates, and UAT completion per country. Without these, the wave go-live milestones are unenforceable.' },
        ],
      },
      {
        id: 'governance', number: '7.', title: 'Governance & Change Management',
        dimensionKey: 'governance_readiness',
        content: [
          { t: 'bullets', items: [
            'Global Program Office: MS Engagement Director + Client Global Program Manager — weekly',
            'Regional Steering: Regional MS Delivery Lead + Client Regional Director per wave — bi-weekly',
            'SI Partner governance: MS PM facilitates monthly SI Partner review; SI Partner reports against wave metrics',
            'Escalation path: L1 → Country PM | L2 → Regional MS Lead | L3 → Global Program Director | L4 → Engagement Executive / Client CPO',
          ]},
          { t: 'p', text: 'NOTE: Multi-country escalation paths lack specificity. Country-level escalation contacts are not named. GDPR data processing escalation path is not defined. SI Partner decision authority vs. Microsoft authority is not documented.' },
        ],
      },
      {
        id: 'commercial', number: '8.', title: 'Commercial Terms',
        dimensionKey: 'commercial_integrity',
        content: [
          { t: 'table', headers: ['Item', 'Detail'], rows: [
            ['Pricing model', 'Fixed fee by wave, milestone-triggered billing'],
            ['SI Partner', '30% of engagement effort; included in total contract value'],
            ['Margin', '22% — flagged as low for multi-country complexity with 30% vendor participation'],
            ['Payment terms', 'Net 30 from wave milestone acceptance'],
          ]},
          { t: 'p', text: 'NOTE: No overrun contingency is defined. At 22% margin with 30% vendor participation, there is minimal buffer for scope variance across 14 countries. Finance has flagged this for a margin floor review before approval.' },
        ],
      },
      {
        id: 'risk', number: '9.', title: 'Preliminary Risk Register',
        dimensionKey: 'risk_visibility',
        content: [
          { t: 'p', text: 'NOTE: The risk register below is incomplete for the scale and complexity of this engagement. A full ARB risk assessment is required before approval.' },
          { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
            ['Local payroll integration scope variance — 14 APIs not as documented', 'High', 'High', 'Payroll API pre-qualification in Month 1; each API validated before Wave 1; variances priced via Change Order'],
            ['SI Partner delivery quality varies by country wave', 'Medium', 'High', 'MS quality gates at each wave go-live; SI Partner performance review after Wave 1 with right to replace'],
            ['Local regulatory compliance variance (GDPR + 14 jurisdiction payroll)', 'High', 'High', 'In-country legal counsel engaged per country before each wave; MS provides global GDPR guidance only'],
          ]},
          { t: 'p', text: 'Additional risks not yet documented: data migration risk per country, currency and treasury risk for multi-country financial cutover, go-live rollback per country, and SI Partner indemnification gaps.' },
        ],
      },
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 7.0,
        strength: 'Global-level outcomes (D365 live in 14 countries, SAP decommissioned) are present and directionally correct.',
        gaps: ['Period close cycle target is "TBD" — the primary ERP financial business outcome is unmeasured and unverifiable', 'No country-level outcome targets — a 14-country program needs per-country or per-wave success criteria', 'No ROI or cost efficiency outcome — the business case for replacing a multi-country SAP landscape is absent'],
        recommendation: 'Before ARB approval, add: (1) a period close baseline from the client finance team, (2) per-wave country outcome targets, and (3) a global ERP consolidation cost efficiency metric.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 6.5,
        strength: 'Wave structure and module coverage (Finance, Logistics, HR) are clearly defined at the global level.',
        gaps: ['Country names are listed as "TBD" — wave membership is unknown at SOW signing', 'Country-level scope phasing plans are absent — no activity breakdown per country', '14 payroll integration specifications are unspecified — vendor, API type, and integration complexity are all unknown'],
        recommendation: 'Wave country assignments and payroll vendor API documentation must be complete before Wave 1 kickoff. Add a Month 1 deliverable: Country Scope Plan (all 14 countries, wave assignments, payroll API status).' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 6.0,
        strength: 'SAP decommissioning advisory-only boundary is stated.',
        gaps: ['No country-level out-of-scope definitions — each country has unique regulatory and payroll exclusions', 'SI Partner scope boundary is defined for effort percentage but not by country-level activity — what does 30% cover in each country?', 'GDPR exclusion ("beyond D365 personal data register") is vague — what is not in scope is not specific enough for a 14-jurisdiction engagement'],
        recommendation: 'Add a per-country out-of-scope appendix (Appendix B) covering: local regulatory exclusions, payroll vendor obligations, and customization limits per country.' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 6.0,
        strength: 'SI Partner wave resource confirmation (60-day lead) is a specific and enforceable assumption.',
        gaps: ['Only 3 assumptions are listed for a 14-country, 28-month engagement — the assumption section is critically incomplete', 'No GDPR data processing agreement assumption per country', 'No data migration assumption per country — SAP data quality and migration scope across 14 countries is a material unknown'],
        recommendation: 'Expand assumptions to include: GDPR DPA status per country, SAP data quality per country, country lead availability confirmation, and local regulatory timeline assumptions. Minimum 15 substantive assumptions required.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 6.5,
        strength: 'Wave-level go-live milestones with go/no-go gates are present.',
        gaps: ['Country-level milestones are absent — wave go-live without country milestones is unenforceable', 'No milestone for payroll API pre-qualification — the highest technical risk is not on the timeline', 'No intra-wave milestone for local regulatory sign-off per country'],
        recommendation: 'For each wave, add: (1) country-level regulatory sign-off milestone, (2) payroll integration test milestone per country, and (3) UAT completion milestone per country.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 6.5,
        strength: 'Margin risk is explicitly acknowledged — a rare and useful transparency in a multi-country ERP SOW.',
        gaps: ['No overrun contingency or commercial trigger for scope variance across 14 countries', 'SI Partner commercial risk absorption (MS assumes 30% partner risk) is stated but no indemnification or SLA terms are referenced', '22% margin with 30% vendor has no financial floor — a 5% effort overrun erodes profitability below acceptable thresholds'],
        recommendation: 'Finance review must define a margin floor mechanism: if a Change Order would push total effort >10% above SOW estimate, executive sign-off is required before scope is added.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 7.0,
        strength: '4-level escalation path (Country → Regional → Global → Executive) is appropriate for a 14-country program.',
        gaps: ['SI Partner decision authority vs. Microsoft authority is not defined — who resolves a dispute between MS and SI Partner on country-level scope?', 'GDPR data processing escalation path is absent from governance', 'Country-level escalation contacts are not named — the escalation path is structural but not operational'],
        recommendation: 'Add a Responsibility Assignment Matrix (RACI) for MS vs. SI Partner decision authority per country, and name client escalation contacts per region before Wave 1.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 6.0,
        strength: 'Three risks are named; payroll API pre-qualification and SI Partner quality mitigation are appropriate.',
        gaps: ['Risk register is explicitly acknowledged as incomplete in the SOW — this is a transparency statement, not a mitigation', 'No data migration risk per country', 'No financial cutover risk (multi-currency, multi-entity simultaneous cutover is a critical risk for a 14-country ERP)', 'SI Partner indemnification gap is listed as a missing risk but not yet assessed'],
        recommendation: 'ARB risk assessment must include: per-country data migration risk, financial cutover risk, go-live rollback protocol per country, and SI Partner indemnification terms before approval.' },
    ],
    alignmentFlags: [
      { label: 'Outcomes → Country Phase Plans', status: 'warning', detail: 'Global outcomes are defined but no country-level outcome targets exist. Wave go-live milestones cannot be verified without country-level criteria.' },
      { label: 'Scope → Payroll API Register', status: 'warning', detail: '14 payroll integrations are in scope but no API register, vendor names, or integration specifications are documented.' },
      { label: 'Assumptions → Risk Register', status: 'warning', detail: 'Assumption section has 3 entries for a 14-country engagement. Material assumptions (GDPR DPA, data quality per country) are absent from both assumptions and risk register.' },
      { label: 'SI Partner → Governance & Commercial', status: 'warning', detail: 'SI Partner decision authority, indemnification terms, and country-level scope boundaries are undefined in both governance and commercial sections.' },
    ],
  },

  // ─── 9. CITY POWER & LIGHT ───────────────────────────────────────────────
  'City Power & Light': {
    compositeScore: 8.2,
    sections: [
      { id: 'executive-summary', number: '1.', title: 'Executive Summary', content: [
        { t: 'p', text: 'Microsoft Professional Services will deploy Microsoft Sentinel across both IT and OT environments for City Power & Light, a regulated electric utility with 5,200 IT endpoints and multiple SCADA, DCS, and substation automation networks. The 12-month engagement establishes a unified SOC. Defender for IoT provides OT-native asset discovery via passive monitoring only — no agents are deployed on production OT systems.' },
        { t: 'table', headers: ['Field', 'Detail'], rows: [['Client', 'City Power & Light'], ['Engagement Type', 'IT/OT SOC Modernization'], ['Engagement Period', '12 months'], ['IT Scope', '5,200 endpoints, 30 Sentinel connectors'], ['OT Scope', 'SCADA, DCS, substation automation — read-only passive monitoring']] },
      ]},
      { id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes', dimensionKey: 'outcome_clarity', content: [
        { t: 'bullets', items: ['100% OT asset discovery across all named OT networks within 90 days', 'IT MTTD <15 minutes via Sentinel SIEM + SOAR automation', 'OT anomaly detection operational across all in-scope environments by Month 8 with zero production disruption', 'NERC CIP compliance posture ≥85% as measured by Sentinel compliance dashboard'] },
        { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [['OT assets mapped', '0', '100% of named OT networks', 'Defender for IoT inventory'], ['IT MTTD', '>2 hours', '<15 min', 'Sentinel incident tracker'], ['NERC CIP posture', 'Not measured', '≥85%', 'Sentinel NERC CIP dashboard']] },
      ]},
      { id: 'scope', number: '3.', title: 'Scope of Work', dimensionKey: 'scope_completeness', content: [
        { t: 'table', headers: ['Phase', 'Duration', 'Activities', 'Deliverables'], rows: [
          ['Phase 1 — OT Discovery & Sentinel Foundation', 'Months 1–4', 'Defender for IoT passive OT discovery, 30 IT data connectors, NERC CIP gap assessment', 'OT Asset Inventory, NERC CIP Gap Report, Sentinel Foundation Report'],
          ['Phase 2 — SOC Build & OT Integration', 'Months 4–9', 'OT-specific analytics rules (Purdue model), SOAR playbooks (IT+OT), Defender XDR for IT', 'Analytics Rules Library, SOAR Playbook Library, SOC Runbook'],
          ['Phase 3 — Compliance & Hardening', 'Months 9–12', 'NERC CIP analytics pack, SOC team training, threat intel integration, hardening review', 'NERC CIP Dashboard, Training Report, Hardening Assessment'],
        ]},
        { t: 'bullets', items: ['OT monitoring is passive only — no agents on production OT systems; Defender for IoT sensors operate out-of-band via SPAN port mirroring'] },
      ]},
      { id: 'out-of-scope', number: '4.', title: 'Out of Scope', dimensionKey: 'out_of_scope', content: [
        { t: 'bullets', items: ['Active OT security controls — any remediation or configuration change to OT systems requires a separate Change Order and client OT Engineering approval', 'Physical security systems and control room hardening', 'Penetration testing of IT or OT environments', 'OT networks or sites beyond the named scope in Appendix A', 'NERC CIP regulatory filing or audit preparation — compliance tooling and advisory guidance only'] },
      ]},
      { id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies', dimensionKey: 'assumption_quality', content: [
        { t: 'bullets', items: ['Client OT Engineering team approves all Defender for IoT sensor placement locations before Phase 1 begins', 'OT network topology documentation (Purdue model diagram) provided by client in Week 2', 'All in-scope OT networks support SPAN port mirroring for passive traffic capture', 'Client provides joint IT/OT stakeholder for Phase 2 playbook development sessions', 'Defender for IoT sensor hardware procured by client before Phase 1 deployment'] },
      ]},
      { id: 'timeline', number: '6.', title: 'Project Timeline & Milestones', dimensionKey: 'timeline_enforceability', content: [
        { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [['OT Asset Inventory + NERC CIP Gap Report', 'Month 4', 'Yes', '25% on acceptance'], ['Sentinel SOC Operational + OT Integration Live', 'Month 9', 'Yes', '35% on SOC runbook acceptance'], ['NERC CIP Dashboard + Program Close', 'Month 12', 'Yes', '40% on hardening assessment']] },
        { t: 'p', text: 'Critical path: OT sensor hardware procurement (client-owned) must be complete before Month 1 Week 3 or Phase 1 OT discovery is delayed proportionally.' },
      ]},
      { id: 'governance', number: '7.', title: 'Governance & Change Management', dimensionKey: 'governance_readiness', content: [
        { t: 'bullets', items: ['Joint IT/OT Steering: CISO + VP Grid Operations (client) + Engagement Director (Microsoft) — bi-weekly', 'OT Change Advisory Board: any Defender for IoT configuration requires CAB approval with 48-hour minimum review', 'Escalation: L1 → SOC PM | L2 → Delivery Lead | L3 → Engagement Executive / CISO', 'NERC CIP Compliance Track: monthly review with client Regulatory Affairs team'] },
      ]},
      { id: 'commercial', number: '8.', title: 'Commercial Terms', dimensionKey: 'commercial_integrity', content: [
        { t: 'table', headers: ['Item', 'Detail'], rows: [['Pricing model', 'Fixed fee by phase, milestone-triggered billing'], ['ECIF', 'None committed'], ['Vendor', 'None — pure Microsoft PS delivery'], ['Expense policy', 'On-site OT site visits at cost; capped at 4% of contract value'], ['Payment terms', 'Net 30 from milestone acceptance']] },
      ]},
      { id: 'risk', number: '9.', title: 'Preliminary Risk Register', dimensionKey: 'risk_visibility', content: [
        { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
          ['OT SPAN port not available on target switches', 'Medium', 'Medium', 'SPAN port feasibility assessed in Week 1 before sensor hardware procurement'],
          ['OT Engineering resists passive monitoring on production SCADA', 'Medium', 'High', 'VP Grid Operations as Steering Committee member; discovery scope agreed at kickoff'],
          ['NERC CIP analytics pack requires custom rules beyond standard pack', 'Low', 'Medium', 'NERC CIP scope confirmed with Regulatory Affairs before Phase 3; custom rules via Change Order'],
          ['IT/OT SOAR playbook coordination delays playbook go-live', 'Medium', 'Medium', 'Phase 2 playbook workshops designed as joint IT/OT sessions from the start'],
        ]},
      ]},
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 8.5, strength: 'OT asset discovery (100%) and IT MTTD (<15 min) targets are measurable with named instruments.', gaps: ['NERC CIP baseline is "not measured" — improvement magnitude is unknown until Phase 1 assessment is complete'], recommendation: 'Commission NERC CIP baseline assessment in Week 1 to establish verified current posture before Phase 2.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 8.0, strength: 'Passive-only OT monitoring constraint is explicitly stated and the three-phase structure cleanly separates discovery, build, and compliance.', gaps: ['Named OT sites (Appendix A) are referenced but the appendix is not attached', 'SOAR playbook count and OT-specific triggers are not specified'], recommendation: 'Attach Appendix A (named OT sites) before contract execution and define 5 named OT-specific SOAR playbook triggers.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 8.5, strength: 'Active OT intervention exclusion is precisely stated with a Change Order mechanism. Penetration testing exclusion prevents scope ambiguity.', gaps: ['OT vendor exclusion does not name specific SCADA/DCS vendors in scope'], recommendation: 'Name specific SCADA and DCS vendors to prevent interpretation disputes during delivery.' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 8.0, strength: 'OT Engineering sensor placement approval and Purdue model diagram provision are specific, time-bound, and appropriately client-owned.', gaps: ['SPAN port mirroring availability is assumed across all named OT networks but not pre-verified'], recommendation: 'Add a Week 1 SPAN port feasibility check as a Phase 1 kickoff activity before hardware is procured.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 7.5, strength: 'Three milestones with go/no-go gates and payment triggers distributed across the 12 months.', gaps: ['OT sensor hardware procurement (client-owned) is a critical path item with no milestone or date'], recommendation: 'Add a Month 1 Week 3 hardware procurement confirmation gate with a formal timeline revision trigger if not met.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 8.0, strength: 'Fixed fee with on-site travel cap (4%) provides cost predictability for an engagement requiring physical OT site access.', gaps: ['OT site visit frequency and locations not specified — travel cap adequacy is unverifiable'], recommendation: 'Include an OT site visit plan with estimated frequency in Appendix A to make the 4% cap verifiable.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 8.5, strength: 'OT Change Advisory Board with 48-hour minimum review is an excellent OT-specific governance control. Joint IT/OT Steering is appropriate for convergence.', gaps: ['OT Engineering final approval authority within CAB is not named'], recommendation: 'Name the OT Engineering CAB approver (VP Grid Operations or designated OT architect) before engagement start.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 7.5, strength: 'OT Engineering resistance risk and SPAN port availability risk are specific and actionable — above average for IT/OT SOW.', gaps: ['No risk for production OT disruption from Defender for IoT sensor failure — the highest-consequence risk for a utility'], recommendation: 'Add an OT disruption risk with immediate sensor shutdown procedure and 15-minute client OT Engineering notification protocol.' },
    ],
    alignmentFlags: [
      { label: 'OT Scope → Appendix A', status: 'warning', detail: 'Named OT sites (Appendix A) are referenced but the appendix is not yet attached to the SOW.' },
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'NERC CIP Baseline → Outcomes', status: 'warning', detail: 'NERC CIP posture improvement target (≥85%) has no verified baseline — current state is "not measured."' },
      { label: 'OT CAB → Governance', status: 'ok' },
    ],
  },

  // ─── 10. DATUM CORPORATION ───────────────────────────────────────────────
  'Datum Corporation': {
    compositeScore: 7.0,
    sections: [
      { id: 'executive-summary', number: '1.', title: 'Executive Summary', content: [
        { t: 'p', text: 'Microsoft Professional Services will design and build a multi-agent AI platform for Datum Corporation on Azure AI Studio with Semantic Kernel orchestration. The 10-month engagement delivers three production AI agents — a customer intent classification agent, a dynamic pricing recommendation agent, and an intelligent case routing agent — along with a Responsible AI governance framework and Azure OpenAI private endpoint architecture. Microsoft has committed a 12% internal investment (IOI) aligned to the engagement\'s strategic priority.' },
        { t: 'table', headers: ['Field', 'Detail'], rows: [['Client', 'Datum Corporation'], ['Engagement Type', 'Multi-Agent AI Platform Build'], ['Engagement Period', '10 months'], ['Agents in Scope', '3 production AI agents on Azure AI Studio'], ['IOI', '12% committed']] },
      ]},
      { id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes', dimensionKey: 'outcome_clarity', content: [
        { t: 'bullets', items: ['Customer conversion rate improved by ≥12% within 60 days of intent classification agent go-live', 'Pricing recommendation accepted rate ≥75% by Month 10', 'Case routing accuracy ≥90% against human baseline within 45 days of routing agent go-live', 'Responsible AI governance framework operational before any agent is deployed to production'] },
        { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [['Customer conversion rate', 'Current rate (client to provide)', '+12%', 'CRM conversion analytics'], ['Pricing accept rate', 'N/A (new agent)', '≥75%', 'Pricing system log'], ['Case routing accuracy', 'Human baseline (client to provide)', '≥90%', 'Case management audit log']] },
      ]},
      { id: 'scope', number: '3.', title: 'Scope of Work', dimensionKey: 'scope_completeness', content: [
        { t: 'table', headers: ['Phase', 'Duration', 'Activities', 'Deliverables'], rows: [
          ['Phase 1 — Architecture & RAI', 'Months 1–2', 'Azure OpenAI private endpoint, agent architecture design, data pipeline review, RAI framework v1', 'AI Architecture Blueprint, RAI Framework v1'],
          ['Phase 2 — Agent Build', 'Months 2–7', 'Intent classification agent, pricing recommendation agent, case routing agent, A/B testing framework', 'Three production agents, A/B Test Reports (×3)'],
          ['Phase 3 — Rollout & Governance', 'Months 7–10', 'Production deployment, RAI monitoring dashboards, client AI operations enablement, hypercare', 'Rollout Report, AI Ops Runbook, RAI Dashboard'],
        ]},
      ]},
      { id: 'out-of-scope', number: '4.', title: 'Out of Scope', dimensionKey: 'out_of_scope', content: [
        { t: 'bullets', items: ['Agents beyond the 3 named in Phase 2 — additional agents require a Change Order', 'Custom CRM or pricing system development beyond API integration', 'On-premises model hosting — all inference runs on Azure OpenAI', 'Training data curation beyond the data pipeline review in Phase 1', 'GDPR legal review — client Privacy Counsel owns regulatory compliance'] },
      ]},
      { id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies', dimensionKey: 'assumption_quality', content: [
        { t: 'bullets', items: ['Client will provide historical conversion and case routing data (minimum 18 months) before Phase 2 model training begins', 'Azure OpenAI private endpoint capacity confirmed with Microsoft account team before Phase 2', 'CRM and pricing system APIs are documented and accessible before Phase 2 integration begins', 'IOI (12%) is confirmed and approved by Microsoft account team before contract execution', 'Client will designate an AI product owner (0.5 FTE) to co-develop agent acceptance criteria throughout the engagement'] },
      ]},
      { id: 'timeline', number: '6.', title: 'Project Timeline & Milestones', dimensionKey: 'timeline_enforceability', content: [
        { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [['AI Architecture + RAI Framework Accepted', 'Month 2', 'Yes', '20% on acceptance'], ['All 3 Agents in A/B Testing', 'Month 7', 'Yes', '35% on A/B test reports'], ['Production Rollout Complete', 'Month 10', 'Yes', '45% on rollout report']] },
      ]},
      { id: 'governance', number: '7.', title: 'Governance & Change Management', dimensionKey: 'governance_readiness', content: [
        { t: 'bullets', items: ['AI Product Steering: Chief Product Officer (client) + Engagement Director (Microsoft) — bi-weekly', 'RAI Review Board: Client Privacy Officer + MS Responsible AI Lead — monthly, with mandatory review before each agent production deployment', 'Change control: Model performance deviations >10% from A/B test targets trigger escalation to Steering Committee'] },
      ]},
      { id: 'commercial', number: '8.', title: 'Commercial Terms', dimensionKey: 'commercial_integrity', content: [
        { t: 'table', headers: ['Item', 'Detail'], rows: [['Pricing model', 'Fixed fee by phase, milestone-triggered billing'], ['IOI', '12% offset applied to Phase 1 architecture work; conditions per IOI approval memo'], ['Azure consumption', 'Azure OpenAI inference costs are client-owned (separate from engagement fee)'], ['Payment terms', 'Net 30 from milestone acceptance']] },
      ]},
      { id: 'risk', number: '9.', title: 'Preliminary Risk Register', dimensionKey: 'risk_visibility', content: [
        { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
          ['AI model underperforms conversion target at go-live', 'Medium', 'High', 'A/B testing gates production deployment on validated lift; 4-week optimization sprint available in Phase 3'],
          ['Insufficient historical training data quality', 'Medium', 'High', 'Data quality assessment deliverable in Phase 1 before model training begins'],
          ['IOI approval memo not finalized before contract execution', 'Low', 'Medium', 'IOI to be attached as Appendix A; condition precedent to contract execution'],
          ['CRM or pricing API changes mid-engagement', 'Medium', 'Medium', 'API version pinning in integration design; API changes trigger Change Order'],
        ]},
      ]},
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 7.0, strength: 'Conversion rate (+12%) and routing accuracy (≥90%) targets are specific and tied to measurement instruments.', gaps: ['Both conversion and case routing baselines are "client to provide" — unverified at SOW signing', 'Pricing accept rate baseline is N/A — improvement cannot be measured against history'], recommendation: 'Commission a baseline data sprint in Week 1 to lock current-state metrics before any model training begins.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 7.0, strength: 'Three agents are named and their functions are distinct. A/B testing framework is included as a deployment gate.', gaps: ['Acceptance criteria for each agent are not defined — what constitutes a passed A/B test?', 'Data pipeline scope is thin — only "review" is specified, not build or transformation work'], recommendation: 'Define per-agent acceptance criteria (minimum performance thresholds) in Phase 1 before any agent development begins.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 7.5, strength: 'Agent count cap and on-premises model hosting exclusion are explicitly stated.', gaps: ['Training data curation exclusion is vague — what specific data preparation activities are excluded?'], recommendation: 'Define data preparation boundary: MS provides data pipeline review and specification; client data team executes curation.' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 6.5, strength: 'IOI confirmation and data volume minimum (18 months) are specific pre-conditions.', gaps: ['Data quality standards are not defined — 18 months of data may be insufficient if quality is poor', 'Agent acceptance criteria are deferred to the engagement but not defined as a Phase 1 deliverable with a pass/fail gate'], recommendation: 'Add a data quality assessment as a Phase 1 deliverable with minimum quality thresholds (e.g., <3% null values in required fields).' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 7.5, strength: 'Three milestones with payment triggers; A/B test gate before production is a strong quality control.', gaps: ['No individual agent milestone — Phase 2 covers all 3 agents without interim checkpoints if one agent falls behind'], recommendation: 'Add per-agent A/B test milestones in Month 4, 5.5, and 7 so individual agent delays are surfaced early.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 7.0, strength: 'Azure OpenAI inference costs are cleanly separated from engagement fee — no ambiguity on infrastructure vs. services billing.', gaps: ['IOI approval memo not attached — conditions could be disputed at invoicing', 'Fixed fee on AI model performance has inherent uncertainty risk if optimization sprint is needed'], recommendation: 'Attach IOI memo as Appendix A before contract execution. Add a conditional Phase 3 optimization sprint budget.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 7.5, strength: 'RAI Review Board as a mandatory gate before each agent production deployment is best practice.', gaps: ['Change control for model performance deviation defines escalation but not the response protocol — who decides to proceed vs. pause?'], recommendation: 'Add a performance deviation response matrix: deviation >10% triggers Steering Committee review; >20% triggers mandatory pause and root cause analysis.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 6.5, strength: 'Training data quality risk and API version pinning are specific and actionable.', gaps: ['No risk for RAI framework approval delays blocking agent deployments', 'No risk for Azure OpenAI capacity constraints during production inference load'], recommendation: 'Add RAI approval timeline risk: RAI Board review initiated 3 weeks before each planned agent go-live to avoid last-minute delays.' },
    ],
    alignmentFlags: [
      { label: 'IOI → Commercial Terms', status: 'warning', detail: 'IOI approval memo is referenced in Section 8 but not attached as an exhibit to the SOW.' },
      { label: 'Agent Acceptance Criteria → Scope', status: 'warning', detail: 'A/B test milestone in Section 6 requires a "passed A/B test" but acceptance criteria are not defined anywhere in the SOW.' },
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'RAI Gate → Timeline', status: 'ok' },
    ],
  },

  // ─── 11. PROSEWARE INC ───────────────────────────────────────────────────
  'Proseware Inc': {
    compositeScore: 8.8,
    sections: [
      { id: 'executive-summary', number: '1.', title: 'Executive Summary', content: [
        { t: 'p', text: 'Microsoft Professional Services will deliver a comprehensive SOC modernization for Proseware Inc, deploying Microsoft Sentinel as the primary SIEM with 40+ data connectors, custom analytics rules, and SOAR automation. The 10-month engagement includes Microsoft Defender XDR across all 4,800 endpoints, Entra ID Conditional Access, and a 24×7 SOC transition. No subcontractors are involved.' },
        { t: 'table', headers: ['Field', 'Detail'], rows: [['Client', 'Proseware Inc'], ['Engagement Type', 'SOC Modernization — Sentinel & Defender XDR'], ['Engagement Period', '10 months'], ['Endpoint Coverage', '4,800 endpoints'], ['Data Connectors', '40+ Sentinel connectors']] },
      ]},
      { id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes', dimensionKey: 'outcome_clarity', content: [
        { t: 'bullets', items: ['Sentinel SIEM operational as primary threat detection platform with 40+ connectors by Month 7', 'Mean Time to Detect (MTTD) for security incidents reduced to <10 minutes', '100% of 4,800 endpoints enrolled in Defender XDR with Intune-managed compliance policies', 'SOC operating 24×7 with SOAR-driven tier-1 response automation by program close', '100% MFA enforcement with zero standing privileged access across all admin accounts'] },
        { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [['IT MTTD', 'No SIEM (manual detection)', '<10 minutes', 'Sentinel incident tracker'], ['Endpoint compliance rate', 'Unknown', '100% enrolled', 'Defender compliance report'], ['MFA enforcement rate', '<60% (estimated)', '100%', 'Entra ID MFA report']] },
      ]},
      { id: 'scope', number: '3.', title: 'Scope of Work', dimensionKey: 'scope_completeness', content: [
        { t: 'table', headers: ['Phase', 'Duration', 'Activities', 'Deliverables'], rows: [
          ['Phase 1 — Foundation', 'Months 1–3', 'Sentinel workspace, 40 data connector configuration, Entra ID Conditional Access, identity estate discovery', 'Sentinel Foundation Report, CA Policy Library, Identity Baseline Report'],
          ['Phase 2 — SOAR & Defender', 'Months 3–7', 'Custom analytics rules, SOAR playbook library, Defender XDR for 4,800 endpoints, Intune compliance baselines', 'SOAR Playbook Library, Defender Enrollment Report, SOC Runbook'],
          ['Phase 3 — 24×7 SOC Transition', 'Months 7–10', '24×7 SOC operating model, SOAR tuning, attack surface reduction, final hardening review', 'SOC Operating Model, Hardening Assessment'],
        ]},
      ]},
      { id: 'out-of-scope', number: '4.', title: 'Out of Scope', dimensionKey: 'out_of_scope', content: [
        { t: 'bullets', items: ['Physical security controls', 'Penetration testing or red team exercises', 'Custom security software development beyond Sentinel analytics rule authoring', 'Third-party SIEM data migration or historical log ingestion beyond 90 days', 'Security awareness training beyond two train-the-trainer sessions for the SOC team'] },
      ]},
      { id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies', dimensionKey: 'assumption_quality', content: [
        { t: 'bullets', items: ['Client will provide Azure AD tenant admin access within 5 business days of kickoff', 'All 40 Sentinel data connectors are approved by client IT Security before Phase 1 ends', 'Existing Microsoft E5 licensing covers Entra ID P2, Defender XDR, and Sentinel consumption', 'Client CISO designates a dedicated security architect (0.5 FTE) throughout the engagement', 'Connector pre-qualification checklist issued to client IT in Week 1'] },
      ]},
      { id: 'timeline', number: '6.', title: 'Project Timeline & Milestones', dimensionKey: 'timeline_enforceability', content: [
        { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [['Sentinel Foundation + Identity Baseline', 'Month 3', 'Yes', '25% on Identity Baseline Report'], ['Sentinel SIEM Operational — 40 connectors + SOAR', 'Month 7', 'Yes', '35% on Sentinel Deployment Report'], ['24×7 SOC Live + Hardening Assessment', 'Month 10', 'Yes', '40% on SOC Operating Model']] },
      ]},
      { id: 'governance', number: '7.', title: 'Governance & Change Management', dimensionKey: 'governance_readiness', content: [
        { t: 'bullets', items: ['Steering Committee: CISO (client) + Engagement Director (Microsoft) — bi-weekly', 'Working team: Weekly security review with client architecture team and MS solution architect', 'Escalation: L1 → Security PM | L2 → Delivery Lead | L3 → Engagement Executive / CISO', 'Change control: Written request → 3-business-day assessment → CISO + Engagement Director sign-off'] },
      ]},
      { id: 'commercial', number: '8.', title: 'Commercial Terms', dimensionKey: 'commercial_integrity', content: [
        { t: 'table', headers: ['Item', 'Detail'], rows: [['Pricing model', 'Fixed fee — phased billing aligned to milestone acceptance'], ['ECIF', '8% offset applied to Phase 1 Foundation work'], ['Vendor', 'None — pure Microsoft PS delivery'], ['Expense policy', 'Included in fixed fee; no separate expense billing'], ['Payment terms', 'Net 30 from invoice date']] },
      ]},
      { id: 'risk', number: '9.', title: 'Preliminary Risk Register', dimensionKey: 'risk_visibility', content: [
        { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
          ['40 Sentinel connectors cannot all be activated without API readiness from source systems', 'Medium', 'Medium', 'Connector pre-qualification checklist issued in Week 1; unready connectors deferred with Change Order'],
          ['SOAR false-positive rate requires extended tuning beyond Phase 2 schedule', 'Medium', 'Low', 'Two-week SOAR tuning buffer in Phase 3; client SOC team co-develops rules during Phase 2'],
          ['Legacy systems incompatible with Conditional Access — require exclusion or extended timeline', 'Low', 'Medium', 'Legacy system discovery in Phase 1 with documented CA exception list'],
        ]},
      ]},
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 9.0, strength: 'MTTD target (<10 min), 100% endpoint enrollment, and MFA enforcement are all measurable with named instruments.', gaps: ['MFA baseline "estimated <60%" should be replaced with a verified audit figure before Phase 1 ends'], recommendation: 'Commission an identity audit in Week 1 to replace estimated baselines with verified current-state figures.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 9.0, strength: 'Three-phase structure is cleanly decomposed with named deliverables. Connector count (40) and endpoint count (4,800) are explicit.', gaps: ['SOAR playbook count is not specified — what incidents does SOAR automate?'], recommendation: 'Define a list of 8–10 named SOAR playbooks to be developed in Phase 2.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 8.5, strength: 'Penetration testing, custom software, and historical log ingestion limits are precisely excluded.', gaps: ['No statement on legacy system authentication exceptions if Conditional Access cannot cover all systems'], recommendation: 'Add a legacy system CA exception protocol: documented exceptions listed with CISO sign-off in Phase 1 close.' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 9.0, strength: 'Connector pre-qualification checklist in Week 1, licensing verification, and client 0.5 FTE commitment are specific and enforceable.', gaps: ['Licensing assumption (E5 coverage) should be formally verified before Phase 1 begins — if incorrect, scope and cost shift materially'], recommendation: 'Add a licensing verification step as a Day 1 activity with client confirmation sign-off before Phase 2 begins.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 9.0, strength: 'Every milestone is tied to an accepted deliverable with a payment trigger. Three go/no-go gates across the 10 months.', gaps: ['No buffer between Phase 2 SOAR delivery and Phase 3 SOC transition — SOAR tuning may compress 24×7 readiness timeline'], recommendation: 'Insert a 2-week SOAR validation period between Phase 2 close and Phase 3 SOC transition kickoff.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 9.0, strength: 'ECIF offset on Phase 1 is phase-scoped. No vendor dilution. No separate expense billing — simplest commercial structure.', gaps: ['ECIF conditions of application are stated but the verification gate is not documented'], recommendation: 'Confirm ECIF is applied upon Phase 1 milestone acceptance, not on engagement start — add one sentence to Section 8.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 8.5, strength: 'Bi-weekly Steering Committee and weekly security review cadence is appropriate. Change control is defined with named approvers.', gaps: ['No defined SLA for client response to change requests beyond the 3-day vendor assessment window'], recommendation: 'Define a 3-business-day client response SLA to change requests; silence after deadline = request approved as submitted.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 8.5, strength: 'Connector pre-qualification risk and SOAR tuning risk are both specific, actionable, and include a mitigation mechanism.', gaps: ['No risk for SOAR automation causing unintended service disruption (auto-remediation false positive)'], recommendation: 'Add a SOAR auto-remediation risk with a "no automated blocking actions without 30-day supervised period" mitigation.' },
    ],
    alignmentFlags: [
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'Connector Pre-qualification → Assumptions', status: 'ok' },
      { label: 'ECIF → Commercial Terms', status: 'warning', detail: 'ECIF application conditions are stated but the verification gate and timing are not documented.' },
      { label: 'SOAR Tuning → Timeline Buffer', status: 'ok' },
    ],
  },

  // ─── 12. BLUE YONDER INC ────────────────────────────────────────────────
  'Blue Yonder Inc': {
    compositeScore: 7.8,
    sections: [
      { id: 'executive-summary', number: '1.', title: 'Executive Summary', content: [
        { t: 'p', text: 'Microsoft Professional Services will implement Microsoft Fabric as the unified analytics platform for Blue Yonder Inc, replacing a fragmented landscape of 6 legacy data tools (including on-premises SQL Server data warehouse, Azure Data Factory legacy pipelines, Power BI Premium, Tableau, Informatica, and an Apache Hive cluster). The 12-month engagement covers Fabric workspace architecture, data migration from all 6 legacy tools, enterprise semantic model development, and a 150-user enablement program.' },
        { t: 'table', headers: ['Field', 'Detail'], rows: [['Client', 'Blue Yonder Inc'], ['Engagement Type', 'Enterprise Data Platform — Microsoft Fabric'], ['Engagement Period', '12 months'], ['Legacy Tools Replaced', '6 tools (SQL DW, ADF, Power BI Premium, Tableau, Informatica, Hive)'], ['Users', '150 data consumers and analysts']] },
      ]},
      { id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes', dimensionKey: 'outcome_clarity', content: [
        { t: 'bullets', items: ['All 6 legacy data tools decommissioned and data migrated to Fabric by Month 12', 'Report refresh time reduced from current average baseline to <30 minutes across all business-critical dashboards', 'Self-service analytics adoption: 150 users trained and proficient on Fabric by Month 12', 'Azure ACR of $85,000/month established by Month 12 from Fabric capacity consumption'] },
        { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [['Legacy tools decommissioned', '0 of 6', '6 of 6', 'Tool decommission log'], ['Report refresh time', 'Current average (client to provide)', '<30 minutes', 'Fabric monitoring dashboard'], ['User proficiency', 'N/A (new platform)', '≥80% pass on role assessment', 'Training completion report'], ['Azure ACR', '$0 Fabric', '$85,000/month', 'Azure Cost Management']] },
      ]},
      { id: 'scope', number: '3.', title: 'Scope of Work', dimensionKey: 'scope_completeness', content: [
        { t: 'table', headers: ['Phase', 'Duration', 'Activities', 'Deliverables'], rows: [
          ['Phase 1 — Architecture & Assessment', 'Months 1–3', 'Fabric workspace design, data estate assessment, migration sequencing plan, governance framework, tool retirement roadmap', 'Fabric Architecture Blueprint, Migration Sequencing Plan, Data Governance Framework'],
          ['Phase 2 — Migration & Build', 'Months 3–9', 'Data migration from 6 legacy tools (sequenced by business priority), semantic model development, OneLake configuration, Lakehouse builds', 'Migration Completion Reports (×6 tools), Semantic Model Library, OneLake Design'],
          ['Phase 3 — Enablement & Handover', 'Months 9–12', '150-user training program, self-service analytics enablement, Fabric admin runbook, Power BI report migration and optimization', 'Training Completion Report, Admin Runbook, Optimized Report Library'],
        ]},
      ]},
      { id: 'out-of-scope', number: '4.', title: 'Out of Scope', dimensionKey: 'out_of_scope', content: [
        { t: 'bullets', items: ['Custom application development beyond Fabric-native capabilities', 'Historical data migration beyond 3 years from each legacy tool (by default; additional history requires Change Order)', 'Training for more than 150 users — additional users require a Change Order', 'Tableau to Power BI report migration for reports not in the prioritized Top 50 report list', 'Third-party BI tool integrations beyond the 6 named legacy systems'] },
      ]},
      { id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies', dimensionKey: 'assumption_quality', content: [
        { t: 'bullets', items: ['Client will provide data dictionary and schema documentation for all 6 legacy tools before Phase 1 ends', 'Microsoft Fabric capacity (F64 or equivalent) is provisioned by client before Phase 2 begins', 'Client data engineering team (minimum 2 FTE) is dedicated to the program throughout Phase 2', 'Top 50 report prioritization list is agreed with business stakeholders before Phase 2 begins', '3-year data retention default is confirmed with business and legal teams before migration begins'] },
      ]},
      { id: 'timeline', number: '6.', title: 'Project Timeline & Milestones', dimensionKey: 'timeline_enforceability', content: [
        { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [['Fabric Architecture + Migration Plan Accepted', 'Month 3', 'Yes', '20% on blueprint acceptance'], ['4 of 6 Legacy Tools Migrated', 'Month 9', 'Yes', '40% on migration reports'], ['All 6 Tools Migrated + 150 Users Trained', 'Month 12', 'Yes', '40% on training and completion reports']] },
      ]},
      { id: 'governance', number: '7.', title: 'Governance & Change Management', dimensionKey: 'governance_readiness', content: [
        { t: 'bullets', items: ['Steering Committee: Chief Data Officer (client) + Engagement Director (Microsoft) — bi-weekly', 'Data migration working group: weekly status with client data engineering team and MS delivery lead', 'Migration sequencing gate: each tool migration requires a go/no-go based on data quality validation before cutover', 'Change control: Written request → 5-business-day assessment → CDO + MS Director sign-off'] },
      ]},
      { id: 'commercial', number: '8.', title: 'Commercial Terms', dimensionKey: 'commercial_integrity', content: [
        { t: 'table', headers: ['Item', 'Detail'], rows: [['Pricing model', 'Fixed fee by phase, milestone-triggered billing'], ['ECIF', 'None committed for this engagement'], ['Vendor', 'None — pure Microsoft PS delivery'], ['Fabric capacity cost', 'Client-owned (separate from engagement fee); estimated $85,000/month at F64'], ['Payment terms', 'Net 30 from milestone acceptance']] },
      ]},
      { id: 'risk', number: '9.', title: 'Preliminary Risk Register', dimensionKey: 'risk_visibility', content: [
        { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
          ['Legacy tool data quality issues delay migration — schema complexity or data corruption discovered post-assessment', 'Medium', 'High', 'Phase 1 data estate assessment surfaces issues before Phase 2 migration; quality gate per tool before cutover'],
          ['Top 50 report prioritization takes longer than expected — business stakeholders disagree on priorities', 'Medium', 'Medium', 'Prioritization workshop facilitated in Phase 1 with CDO as tie-breaker; Top 50 locked as Phase 1 exit deliverable'],
          ['Fabric capacity quota insufficient for production data volumes during Phase 2', 'Low', 'Medium', 'Capacity validation in Phase 1 design; upsize request submitted before Phase 2 begins'],
        ]},
      ]},
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 8.0, strength: 'Tool decommission count (6) and ACR target ($85K/month) are measurable. User proficiency target uses role-based assessment.', gaps: ['Report refresh time baseline is "client to provide" — improvement magnitude is unknown at SOW signing'], recommendation: 'Commission a report performance baseline in Week 1 to lock the current average refresh time before Phase 2 targets are set.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 8.0, strength: 'All 6 legacy tools are named. Migration sequenced by business priority. Top 50 report list is explicitly bounded.', gaps: ['Semantic model count is not specified — how many enterprise models are in scope?', 'Data retention default (3 years) is a significant scoping assumption that should be a signed decision, not an assumption'], recommendation: 'Add a semantic model count and scope definition as a Phase 1 deliverable. Obtain client and legal sign-off on the 3-year retention default before migration begins.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 7.5, strength: 'Historical data migration limit (3 years) and user count cap (150) are explicitly stated.', gaps: ['Custom application development exclusion is vague — does not define what constitutes "beyond Fabric-native capabilities"'], recommendation: 'Add a one-paragraph definition of Fabric-native capabilities vs. custom development to prevent mid-engagement disputes.' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 7.5, strength: 'Client data engineering 2 FTE commitment and Fabric capacity provisioning are specific and time-bound.', gaps: ['Data dictionary and schema documentation quality is assumed adequate — for 6 legacy tools, this is a material discovery risk'], recommendation: 'Add a data documentation quality threshold: if documentation is insufficient, a Phase 1 documentation sprint is added via Change Order before migration begins.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 8.0, strength: 'Per-tool migration go/no-go gate is an excellent data quality control that prevents cascading migration failures.', gaps: ['No milestone for data estate assessment acceptance — Phase 1 produces this but it is not a formal payment milestone'], recommendation: 'Add a Month 1 data estate assessment acceptance as an informal go/no-go gate before the full Phase 1 architecture blueprint.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 7.5, strength: 'Fabric capacity costs are cleanly separated from engagement fee — no ambiguity on what client pays for infrastructure vs. services.', gaps: ['F64 capacity estimate ($85K/month) may not reflect actual data volumes until Phase 1 assessment is complete'], recommendation: 'Add a capacity sizing review as a Phase 1 deliverable with a client decision gate on the correct Fabric SKU before provisioning.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 8.0, strength: 'Per-tool data quality validation gate before each migration cutover is a strong technical governance control.', gaps: ['Business stakeholder representation in the data migration working group is not specified — CDO may not have operational authority across all 6 tool teams'], recommendation: 'Require each legacy tool team to designate a business data owner as the migration decision-maker for their system.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 7.5, strength: 'Data quality discovery risk and report prioritization conflict risk are both specific with CDO escalation path.', gaps: ['No risk for Power BI Premium license migration (client may face license change costs when Fabric replaces Power BI Premium)', 'No risk for Informatica/Hive migration complexity — these are likely the most technically complex migrations'], recommendation: 'Add a licensing transition risk (Power BI Premium to Fabric) and a Hive/Informatica migration complexity risk with a Phase 1 technical assessment trigger.' },
    ],
    alignmentFlags: [
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'Report Refresh Baseline → Outcomes', status: 'warning', detail: 'Report refresh time improvement target has no verified baseline — current average is "client to provide."' },
      { label: 'Scope → Top 50 Report List', status: 'warning', detail: 'Top 50 report prioritization list is referenced as a Phase 1 exit deliverable but is not yet started or agreed.' },
      { label: 'Fabric Capacity → Commercial Terms', status: 'ok' },
    ],
  },

  // ─── 13. SOUTHRIDGE VIDEO ───────────────────────────────────────────────
  'Southridge Video': {
    compositeScore: 7.0,
    sections: [
      { id: 'executive-summary', number: '1.', title: 'Executive Summary', content: [
        { t: 'p', text: 'Microsoft Professional Services will deliver a full Dynamics 365 Finance & Operations implementation for Southridge Video, replacing PeopleSoft ERP across Finance, Supply Chain Management, and Warehouse Management. The 18-month program includes full data migration from PeopleSoft, integration with 3 external systems, and a 180-user training program. No subcontractors are involved.' },
        { t: 'table', headers: ['Field', 'Detail'], rows: [['Client', 'Southridge Video'], ['Engagement Type', 'ERP Transformation — PeopleSoft to D365 F&O'], ['Engagement Period', '18 months'], ['User Training', '180 users'], ['External Integrations', '3 systems']] },
      ]},
      { id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes', dimensionKey: 'outcome_clarity', content: [
        { t: 'bullets', items: ['PeopleSoft ERP fully decommissioned by Month 18', 'D365 F&O live across Finance, Supply Chain, and Warehouse by Month 15', 'Period close cycle time reduced from current baseline to ≤5 business days', '180 users trained and proficient in D365 F&O by Month 15', 'All 3 external integrations live and validated at go-live'] },
        { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [['Period close cycle time', 'Current (client to provide at kickoff)', '≤5 business days', 'Finance close log'], ['PeopleSoft active users', 'All at program start', '0 at Month 18', 'PeopleSoft audit log'], ['D365 user proficiency', 'N/A', '≥80% pass on role assessment', 'Training completion report']] },
      ]},
      { id: 'scope', number: '3.', title: 'Scope of Work', dimensionKey: 'scope_completeness', content: [
        { t: 'table', headers: ['Phase', 'Duration', 'Activities', 'Deliverables'], rows: [
          ['Phase 1 — Design', 'Months 1–5', 'D365 tenant setup, Chart of Accounts design, SCM baseline config, integration architecture, data model sign-off', 'Solution Design Document, CoA Sign-Off, Integration Architecture Blueprint'],
          ['Phase 2 — Build', 'Months 5–12', 'Finance module build, SCM + WMS build, 3 external system integrations, Power BI dashboard development (2 dashboards)', 'Finance Build Report, SCM/WMS Build Report, Integration Test Reports (×3)'],
          ['Phase 3 — Migration & Go-Live', 'Months 12–18', 'PeopleSoft data extraction + transformation + load, UAT (180 users), training delivery, go-live cutover, 3-month hypercare', 'Data Migration Report, UAT Sign-Off, Training Completion Report, Go-Live Report'],
        ]},
      ]},
      { id: 'out-of-scope', number: '4.', title: 'Out of Scope', dimensionKey: 'out_of_scope', content: [
        { t: 'bullets', items: ['PeopleSoft decommissioning execution — advisory guidance and decommission plan only; client IT executes', 'Custom BI/reporting beyond the 2 Power BI dashboards specified in Phase 2', 'Training for more than 180 users — additional users require a Change Order', 'Integrations beyond the 3 named external systems', 'D365 HR and Payroll modules — separate engagement if required'] },
      ]},
      { id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies', dimensionKey: 'assumption_quality', content: [
        { t: 'bullets', items: ['Client PeopleSoft team will provide data migration scope confirmation (field mapping, data volumes, cleansing rules) before Phase 1 ends', '3 integration endpoint APIs are documented and accessible before Phase 2 begins', 'Client designates a D365 implementation lead (1 FTE) and a Finance SME (0.5 FTE) throughout the engagement', '180-user training schedule agreed with business leads before Phase 3 begins', 'PeopleSoft data quality meets the minimum standards defined in the Data Quality Assessment (Phase 1 deliverable)'] },
      ]},
      { id: 'timeline', number: '6.', title: 'Project Timeline & Milestones', dimensionKey: 'timeline_enforceability', content: [
        { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [['Solution Design Document Accepted', 'Month 5', 'Yes', '20% on acceptance'], ['Finance + SCM/WMS Build Complete', 'Month 12', 'Yes', '30% on build reports'], ['PeopleSoft Data Migration Complete', 'Month 14', 'Yes', '20% on migration report'], ['UAT Sign-Off & Go-Live Readiness', 'Month 15', 'Yes', '20% on UAT acceptance'], ['Hypercare Complete & PeopleSoft Decommissioned', 'Month 18', 'Yes', '10% on completion report']] },
      ]},
      { id: 'governance', number: '7.', title: 'Governance & Change Management', dimensionKey: 'governance_readiness', content: [
        { t: 'bullets', items: ['ERP Steering Committee: CFO + COO (client) + Engagement Director (Microsoft) — bi-weekly', 'Integration change control board: any integration scope change requires board approval', 'Go-live readiness review: formal gate at Month 15 with CFO sign-off required before production cutover', 'Escalation: L1 → D365 PM | L2 → Delivery Lead | L3 → Engagement Executive / CFO'] },
      ]},
      { id: 'commercial', number: '8.', title: 'Commercial Terms', dimensionKey: 'commercial_integrity', content: [
        { t: 'table', headers: ['Item', 'Detail'], rows: [['Pricing model', 'Fixed fee by phase, milestone-triggered billing'], ['ECIF', 'None'], ['Vendor', 'None — pure Microsoft PS delivery'], ['Payment terms', 'Net 30 from milestone acceptance'], ['Change order', 'Written scope changes → 5-business-day assessment → CFO + MS Director sign-off']] },
      ]},
      { id: 'risk', number: '9.', title: 'Preliminary Risk Register', dimensionKey: 'risk_visibility', content: [
        { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
          ['PeopleSoft data quality issues delay migration — complex legacy customization not disclosed', 'High', 'High', 'Data quality assessment and PeopleSoft customization inventory in Phase 1 before migration planning begins'],
          ['Integration endpoint incompatibility — API not as documented', 'Medium', 'High', 'Integration pre-qualification in Month 2; each endpoint validated by test connection before Phase 2'],
          ['180-user training engagement below target — low adoption at go-live', 'Medium', 'Medium', 'Train-the-trainer model in Phase 3; role-based assessments gate go-live readiness per department'],
        ]},
      ]},
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 7.5, strength: 'PeopleSoft decommission date and period close time reduction are specific and enforceable.', gaps: ['Period close baseline is "client to provide at kickoff" — improvement metric is unverifiable until provided', 'No cost efficiency or ROI outcome — the business case for replacing PeopleSoft is absent from outcomes'], recommendation: 'Add a Month 1 gate: client Finance team provides current period close log as baseline before Solution Design begins.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 7.0, strength: 'Three phases are decomposed with module-level activities. Integration count and training user count are explicit.', gaps: ['Integration architecture detail is thin — 3 integrations are referenced by count but not named', 'WMS scope does not specify warehouse count or configuration complexity'], recommendation: 'Add a named integration register in Appendix A listing all 3 external systems, integration type, and direction.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 7.5, strength: 'PeopleSoft decommission advisory-only boundary and 180-user training cap are precisely stated.', gaps: ['HR and Payroll module exclusion is noted but no handling protocol if client requests it mid-engagement'], recommendation: 'Add: "If D365 HR/Payroll is required, a separate SOW will be issued; HR/Payroll requirements discovered during Phase 2 will not delay core F&O delivery."' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 6.5, strength: 'Data migration scope confirmation and client resource commitments (1 FTE + 0.5 FTE) are specific.', gaps: ['PeopleSoft data quality standards are deferred to a Phase 1 deliverable — no pre-agreed thresholds', 'PeopleSoft customization inventory is not listed as an assumption — a common source of migration overruns'], recommendation: 'Add a PeopleSoft customization inventory as a client-owned deliverable before Phase 1 design begins.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 7.0, strength: 'Five milestones with go/no-go gates and payment triggers cover all phases.', gaps: ['No milestone for data quality assessment sign-off — a Phase 1 critical path item with no formal gate', 'Integration pre-qualification (Month 2) is in assumptions but not on the milestone timeline'], recommendation: 'Add Month 2 integration pre-qualification as a formal milestone — if any integration fails, timeline impact is surfaced early.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 7.5, strength: 'Fixed fee per phase with clear change order triggers — clean commercial structure.', gaps: ['PeopleSoft data quality remediation effort is a material risk with no commercial contingency defined'], recommendation: 'Add a change order trigger: if data quality remediation exceeds 40 person-hours, a Change Order is issued before additional effort is incurred.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 7.0, strength: 'Integration change control board for integration-heavy ERP programs is appropriate. CFO go-live sign-off is a strong control.', gaps: ['No named client PeopleSoft liaison in the governance structure — PeopleSoft team cooperation is critical but ungoverned'], recommendation: 'Add a PeopleSoft migration liaison role to the governance plan: named client owner, weekly touchpoint, scope authority.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 6.5, strength: 'PeopleSoft data quality risk is rated High/High — correctly elevated as the primary delivery risk.', gaps: ['No risk for go-live cutover failure — what happens if the production cutover fails and a rollback to PeopleSoft is required?'], recommendation: 'Add a go-live rollback risk: define rollback criteria (e.g., >10 P1 defects within 24 hours of cutover triggers rollback) and rollback procedure.' },
    ],
    alignmentFlags: [
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'Integration Register → Scope', status: 'warning', detail: 'Section 3 references 3 integrations but no named integration register exists as a deliverable or appendix.' },
      { label: 'PeopleSoft Data Quality → Risk Register', status: 'ok' },
      { label: 'Period Close Baseline → Outcomes', status: 'warning', detail: 'Period close improvement metric has no verified baseline — "client to provide at kickoff" is unverified at SOW signing.' },
    ],
  },

  // ─── 14. ADATUM CORPORATION ─────────────────────────────────────────────
  'Adatum Corporation': {
    compositeScore: 7.5,
    sections: [
      { id: 'executive-summary', number: '1.', title: 'Executive Summary', content: [
        { t: 'p', text: 'Microsoft Professional Services will design and implement a production-grade Azure Landing Zone for Adatum Corporation using a hub-spoke architecture with enterprise governance. The 6-month engagement covers Policy-as-Code (Azure Policy + Blueprints), RBAC design, network architecture (hub VNet, Azure Firewall, ExpressRoute readiness), and Microsoft Defender for Cloud baseline. This is a foundation engagement — subsequent workload migrations are out of scope.' },
        { t: 'table', headers: ['Field', 'Detail'], rows: [['Client', 'Adatum Corporation'], ['Engagement Type', 'Azure Landing Zone — Enterprise Foundation'], ['Engagement Period', '6 months'], ['Architecture', 'Hub-spoke, Policy-as-Code, RBAC, Azure Firewall'], ['Vendor', 'None — pure Microsoft PS delivery']] },
      ]},
      { id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes', dimensionKey: 'outcome_clarity', content: [
        { t: 'bullets', items: ['Production-grade Azure Landing Zone live and approved by client security team by Month 6', 'Policy-as-Code governance framework covering 100% of RBAC and compliance policies', 'Azure Defender for Cloud Secure Score ≥70 at program close', 'Client platform engineering team independently operating the Landing Zone without Microsoft support by Month 6'] },
        { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [['Secure Score', '<40 (estimated)', '≥70', 'Defender for Cloud dashboard'], ['Policy coverage', '0%', '100% of RBAC and compliance policies', 'Azure Policy compliance report'], ['LZ self-sufficiency', '0%', 'Independent operation', 'Client sign-off at Month 6']] },
      ]},
      { id: 'scope', number: '3.', title: 'Scope of Work', dimensionKey: 'scope_completeness', content: [
        { t: 'table', headers: ['Phase', 'Duration', 'Activities', 'Deliverables'], rows: [
          ['Phase 1 — Design', 'Months 1–2', 'Architecture design, network segmentation, RBAC model, Policy-as-Code design, naming conventions, tagging strategy', 'LZ Architecture Blueprint, RBAC Design Document, Policy Library Design'],
          ['Phase 2 — Build', 'Months 2–5', 'Hub-spoke VNet deployment, Azure Firewall, ExpressRoute gateway, Policy-as-Code implementation, Defender for Cloud baseline, management groups', 'Deployed Landing Zone, Policy Library (live), Defender for Cloud Report'],
          ['Phase 3 — Handover', 'Month 5–6', 'Platform team enablement, runbook development, Defender for Cloud tuning, client sign-off', 'Operations Runbook, Platform Team Handover Certificate'],
        ]},
      ]},
      { id: 'out-of-scope', number: '4.', title: 'Out of Scope', dimensionKey: 'out_of_scope', content: [
        { t: 'bullets', items: ['Workload migration or application landing — this engagement delivers the platform only', 'ExpressRoute circuit provisioning (client network team responsibility)', 'Custom application code development or CI/CD pipeline setup', 'Ongoing Azure cost optimization beyond the Defender for Cloud baseline recommendations', 'Security Operations Center (SOC) or SIEM deployment'] },
      ]},
      { id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies', dimensionKey: 'assumption_quality', content: [
        { t: 'bullets', items: ['Client will provide subscription IDs and tenant admin access within 3 business days of kickoff', 'Client platform engineering team (minimum 1 FTE) is available throughout the engagement for knowledge transfer', 'Network IP address ranges are pre-allocated and conflict-free before Phase 2 begins', 'Client security team will review and sign off on the RBAC model and Policy library within 5 business days of delivery', 'No existing Azure governance configuration conflicts with the new Landing Zone design'] },
      ]},
      { id: 'timeline', number: '6.', title: 'Project Timeline & Milestones', dimensionKey: 'timeline_enforceability', content: [
        { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [['LZ Architecture Blueprint Accepted', 'Month 2', 'Yes', '30% on acceptance'], ['Landing Zone Live + Policy Library Active', 'Month 5', 'Yes', '50% on Defender for Cloud report'], ['Handover Complete + Client Sign-Off', 'Month 6', 'Yes', '20% on handover certificate']] },
      ]},
      { id: 'governance', number: '7.', title: 'Governance & Change Management', dimensionKey: 'governance_readiness', content: [
        { t: 'bullets', items: ['Technical Steering: VP of Engineering (client) + Engagement Director (Microsoft) — bi-weekly', 'Working team: Weekly technical review with client platform engineering team', 'RBAC and Policy review: All RBAC and Policy-as-Code configurations reviewed and signed by client security team before production activation', 'Change control: Written request → 3-business-day assessment → VP Engineering + MS Director sign-off'] },
      ]},
      { id: 'commercial', number: '8.', title: 'Commercial Terms', dimensionKey: 'commercial_integrity', content: [
        { t: 'table', headers: ['Item', 'Detail'], rows: [['Pricing model', 'Fixed fee, milestone-triggered billing'], ['ECIF', 'None committed'], ['Vendor', 'None — pure Microsoft PS delivery'], ['Expense policy', 'Included in fixed fee'], ['Payment terms', 'Net 30 from milestone acceptance']] },
      ]},
      { id: 'risk', number: '9.', title: 'Preliminary Risk Register', dimensionKey: 'risk_visibility', content: [
        { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
          ['Existing Azure tenant configuration conflicts with Landing Zone design', 'Medium', 'High', 'Azure tenant assessment in Week 1 before architecture design is finalized'],
          ['IP address range conflicts discovered during Phase 2 network deployment', 'Medium', 'Medium', 'IP pre-allocation confirmed by client network team before Phase 2 kickoff'],
          ['Client platform team unavailable for knowledge transfer — self-sufficiency outcome at risk', 'Medium', 'Medium', 'Knowledge transfer scheduled as dedicated sessions in Phase 3, not ad hoc'],
        ]},
      ]},
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 7.5, strength: 'Secure Score target (≥70) and Policy coverage (100%) are measurable with named instruments.', gaps: ['Secure Score baseline "estimated <40" should be verified in Week 1', '"Client self-sufficiency" outcome lacks a measurable definition'], recommendation: 'Define self-sufficiency as a skills assessment: platform team passes a documented operating checklist before Month 6 sign-off.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 7.5, strength: 'Hub-spoke architecture and Policy-as-Code components are named specifically. Three-phase structure separates design, build, and handover.', gaps: ['Policy library scope (number of policies, which compliance frameworks) is not specified'], recommendation: 'Define the Policy library scope: minimum 30 policies covering the CIS Azure Benchmark baseline.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 7.5, strength: 'Workload migration exclusion and ExpressRoute circuit exclusion (client-owned) are precisely stated.', gaps: ['No statement on what happens if the client needs post-engagement Landing Zone changes — is there a hypercare or support window?'], recommendation: 'Add a 30-day post-handover advisory window for questions only; structural changes require a new engagement.' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 7.5, strength: 'Tenant admin access SLA (3 business days) and IP pre-allocation requirements are specific and enforceable.', gaps: ['Existing Azure governance assessment is not listed as a formal Phase 1 activity — conflicts may not be discovered until Phase 2'], recommendation: 'Add a Week 1 Azure tenant assessment as a formal Phase 1 kickoff activity with a conflict report before architecture design.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 7.5, strength: 'Three milestones with clear payment triggers across 6 months. Client security sign-off required for go-live.', gaps: ['No milestone for RBAC model sign-off — a critical design gate that is a prerequisite for Phase 2 build'], recommendation: 'Add a Month 2 RBAC model sign-off milestone before Phase 2 build begins.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 7.5, strength: 'Clean fixed-fee structure with no vendor complexity. All expenses included.', gaps: ['No contingency defined if IP conflict resolution or tenant remediation requires additional effort in Phase 2'], recommendation: 'Add a pre-build tenant assessment Change Order trigger: if conflicts require >16 hours of remediation, a Change Order is issued before work begins.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 7.0, strength: 'RBAC and Policy sign-off requirement before production activation is a strong security governance control.', gaps: ['5-business-day client review SLA is stated but no consequence for delay is defined — a slow review could compress Phase 2'], recommendation: 'Add: "Failure to review within 5 business days triggers a timeline revision notice and commercial impact assessment."' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 7.5, strength: 'Tenant configuration conflict risk is specific and has a detection timing (Week 1 assessment) that prevents late discovery.', gaps: ['No risk for high-privilege Azure Policy affecting production workloads if client has existing subscriptions', 'Policy-as-Code errors in production Policy assignment could lock out users — a high-consequence risk for a governance engagement'], recommendation: 'Add a Policy deployment risk: all Policies deployed in audit mode first for 2 weeks before switching to enforce mode.' },
    ],
    alignmentFlags: [
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'Tenant Assessment → Phase 1', status: 'warning', detail: 'Existing Azure tenant conflict risk is present but no formal tenant assessment is listed as a Phase 1 activity.' },
      { label: 'RBAC Sign-Off → Milestone', status: 'warning', detail: 'RBAC model sign-off is required for Phase 2 but is not a formal milestone on the timeline.' },
      { label: 'Commercial Structure → Margin', status: 'ok' },
    ],
  },

  // ─── 15. MARGIE'S TRAVEL ────────────────────────────────────────────────
  "Margie's Travel": {
    compositeScore: 7.8,
    sections: [
      { id: 'executive-summary', number: '1.', title: 'Executive Summary', content: [
        { t: 'p', text: "Microsoft Professional Services will lead the Microsoft 365 Copilot deployment for Margie's Travel, enabling 3,500 travel consultants with AI-assisted productivity tools. The 6-month engagement covers Copilot governance framework design, prompt engineering workshops, custom travel planning plugin development on Microsoft 365 Copilot extensibility, a train-the-trainer program, and adoption measurement. Microsoft has committed a 10% internal investment aligned to the Copilot customer success priority." },
        { t: 'table', headers: ['Field', 'Detail'], rows: [["Client", "Margie's Travel"], ['Engagement Type', 'Microsoft 365 Copilot Deployment & Enablement'], ['Engagement Period', '6 months'], ['User Scope', '3,500 travel consultants'], ['IOI', '10% committed']] },
      ]},
      { id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes', dimensionKey: 'outcome_clarity', content: [
        { t: 'bullets', items: ['3,500 consultants active on M365 Copilot with ≥60% weekly active usage by Month 6', 'Average consultant handle time reduced by ≥15% for standard booking requests within 60 days of rollout', 'Copilot governance framework and acceptable use policy live before first user activation', 'Custom travel planning plugin deployed and in use by Month 5'] },
        { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [['Weekly active usage', 'N/A (new)', '≥60% of 3,500', 'M365 Copilot usage dashboard'], ['Handle time', 'Current average (client to provide)', '-15% for standard bookings', 'CRM call log analytics'], ['Plugin adoption', 'N/A', 'In use by Month 5', 'Plugin usage telemetry']] },
      ]},
      { id: 'scope', number: '3.', title: 'Scope of Work', dimensionKey: 'scope_completeness', content: [
        { t: 'table', headers: ['Phase', 'Duration', 'Activities', 'Deliverables'], rows: [
          ['Phase 1 — Readiness & Governance', 'Months 1–2', 'M365 Copilot readiness assessment, governance framework design, acceptable use policy, data classification review, prompt engineering standards', 'Governance Framework, Acceptable Use Policy, Readiness Report'],
          ['Phase 2 — Plugin & Rollout', 'Months 2–5', 'Custom travel planning plugin build (Microsoft 365 extensibility), phased rollout to 3,500 users, train-the-trainer (50 trainers), adoption monitoring setup', 'Travel Planning Plugin, Rollout Completion Report, Train-the-Trainer Guide'],
          ['Phase 3 — Adoption & Measurement', 'Months 5–6', 'Adoption metrics review, prompt library optimization, consultant feedback synthesis, recommendations report', 'Adoption Metrics Report, Prompt Library v2, Recommendations Report'],
        ]},
      ]},
      { id: 'out-of-scope', number: '4.', title: 'Out of Scope', dimensionKey: 'out_of_scope', content: [
        { t: 'bullets', items: ['Custom plugins beyond the 1 named travel planning plugin — additional plugins require a Change Order', 'End-user training beyond the 50 train-the-trainer sessions (client cascades to 3,500 users)', 'M365 Copilot license procurement (client to procure independently)', 'Data governance or information architecture changes beyond classification review for Copilot readiness', 'Integration with booking systems beyond Microsoft 365 Graph API connectivity'] },
      ]},
      { id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies', dimensionKey: 'assumption_quality', content: [
        { t: 'bullets', items: ['Client holds M365 E3/E5 licensing with Copilot add-on before Phase 2 rollout begins', 'Client designates a Copilot adoption lead (0.5 FTE) to coordinate the train-the-trainer cascade', 'Data classification review will not uncover significant data sensitivity issues requiring architecture redesign', 'Microsoft Graph API access is enabled for the travel planning plugin integration before Phase 2 begins', 'Handle time baseline is provided by client CRM team before Month 2'] },
      ]},
      { id: 'timeline', number: '6.', title: 'Project Timeline & Milestones', dimensionKey: 'timeline_enforceability', content: [
        { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [['Governance Framework + Readiness Report Accepted', 'Month 2', 'Yes', '30% on acceptance'], ['Plugin Live + 3,500 Users Activated', 'Month 5', 'Yes', '45% on rollout report'], ['Adoption Metrics Report + Program Close', 'Month 6', 'Yes', '25% on adoption report']] },
      ]},
      { id: 'governance', number: '7.', title: 'Governance & Change Management', dimensionKey: 'governance_readiness', content: [
        { t: 'bullets', items: ['Steering: Chief Digital Officer (client) + Engagement Director (Microsoft) — bi-weekly', 'Adoption working group: weekly with client Copilot adoption lead and MS delivery consultant', 'Copilot governance: Acceptable Use Policy must be signed by all 3,500 users before activation; automated via M365 compliance portal', 'Change control: Written request → 3-business-day assessment → CDO + MS Director sign-off'] },
      ]},
      { id: 'commercial', number: '8.', title: 'Commercial Terms', dimensionKey: 'commercial_integrity', content: [
        { t: 'table', headers: ['Item', 'Detail'], rows: [['Pricing model', 'Fixed fee, milestone-triggered billing'], ['IOI', '10% offset applied to Phase 1 governance and readiness work'], ['Vendor', 'None — pure Microsoft PS delivery'], ['License cost', 'M365 Copilot licenses are client-owned; separate from engagement fee'], ['Payment terms', 'Net 30 from milestone acceptance']] },
      ]},
      { id: 'risk', number: '9.', title: 'Preliminary Risk Register', dimensionKey: 'risk_visibility', content: [
        { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
          ['Data sensitivity issues discovered in classification review delay Copilot activation', 'Medium', 'High', 'Classification review completed before Phase 2 rollout; sensitive data access controls configured before user activation'],
          ['Train-the-trainer cascade reaches fewer than 60% of users by Month 5 rollout date', 'Medium', 'Medium', 'Client adoption lead monitors trainer completion rate weekly; escalation to CDO if cascade falls below 70% by Month 4'],
          ['Plugin Microsoft Graph API permissions require IT security approval causing delay', 'Low', 'Medium', 'Graph API permission scope submitted to client IT Security in Month 1 for approval before Phase 2 begins'],
        ]},
      ]},
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 7.5, strength: 'Weekly active usage (≥60%) and handle time (-15%) are measurable adoption outcomes with named measurement instruments.', gaps: ['Handle time baseline is "client to provide" — improvement cannot be calculated until provided', 'Plugin adoption target is "in use by Month 5" — no volume or proficiency threshold is defined'], recommendation: 'Add a plugin usage threshold: ≥30% of active consultants using the plugin weekly within 30 days of launch.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 8.0, strength: 'Plugin count (1 named), trainer count (50), and user count (3,500) are all explicitly bounded. Three-phase structure is clean.', gaps: ['Prompt library scope is not defined — how many prompts, which use cases?'], recommendation: 'Define Prompt Library v1 scope in Phase 1: minimum 30 use-case prompts across booking, research, and customer communication workflows.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 8.0, strength: 'Plugin count cap, trainer session cap, and booking system integration boundary are precisely stated.', gaps: ['M365 Copilot license procurement exclusion is stated but the procurement timeline impact on Phase 2 is not addressed'], recommendation: 'Add: "Phase 2 rollout is contingent on all 3,500 licenses being provisioned by Month 1 Week 4; delays trigger a proportional Phase 2 timeline revision."' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 8.0, strength: 'Licensing pre-condition, adoption lead commitment, and Graph API permission request timing are specific and well-ordered.', gaps: ['Data classification "no significant issues" assumption is unverified — this is a common assumption that is frequently wrong'], recommendation: 'Add a data classification risk threshold: if classification review reveals more than 20 sensitivity policy gaps, a remediation plan is created before Phase 2.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 7.5, strength: 'Three milestones with payment triggers across 6 months. Governance gate before first user activation is correctly sequenced.', gaps: ['No intra-Phase 2 milestone for train-the-trainer completion — if cascade is behind, it is not detected until Month 5 rollout'], recommendation: 'Add a Month 4 trainer completion checkpoint: ≥80% of 50 trainers certified before Phase 2 rollout proceeds.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 8.0, strength: 'IOI offset on Phase 1 and license cost separation are clean. No vendor complexity.', gaps: ['IOI approval memo conditions are not attached — standard risk for IOI-based engagements'], recommendation: 'Attach IOI approval memo as Appendix A before contract execution.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 7.5, strength: 'Acceptable Use Policy sign-off via M365 compliance portal before activation is a strong automated governance control.', gaps: ['3,500-user AUP sign-off enforcement process is not specified — what happens if a user does not sign before their activation date?'], recommendation: 'Define AUP non-compliance protocol: users without AUP sign-off are excluded from Copilot activation until signed.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 8.0, strength: 'Data sensitivity discovery risk and train-the-trainer cascade risk are both specific with escalation mechanisms.', gaps: ['No risk for Copilot model hallucination or inaccurate travel information in a customer-facing context'], recommendation: 'Add a Copilot accuracy risk: travel information from Copilot must be validated against live booking systems; consultant training emphasizes human review.' },
    ],
    alignmentFlags: [
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'IOI → Commercial Terms', status: 'warning', detail: 'IOI approval memo is referenced but not attached as an exhibit to the SOW.' },
      { label: 'License Procurement → Timeline', status: 'warning', detail: 'Phase 2 rollout depends on 3,500 licenses being provisioned, but no timeline or contingency is defined if licensing is delayed.' },
      { label: 'Trainer Cascade → Milestone', status: 'ok' },
    ],
  },

  // ─── 16. LUCERNE PUBLISHING ─────────────────────────────────────────────
  'Lucerne Publishing': {
    compositeScore: 7.5,
    sections: [
      { id: 'executive-summary', number: '1.', title: 'Executive Summary', content: [
        { t: 'p', text: 'Microsoft Professional Services will implement a Zero Trust architecture for Lucerne Publishing across identity (Entra ID + PIM), devices (Intune + Defender for Endpoint), and network (Conditional Access + ZTNA). The 9-month engagement covers 2,800 seats and includes Microsoft Sentinel deployment with 25 data connectors. No subcontractors are involved.' },
        { t: 'table', headers: ['Field', 'Detail'], rows: [['Client', 'Lucerne Publishing'], ['Engagement Type', 'Zero Trust Architecture Implementation'], ['Engagement Period', '9 months'], ['Seat Coverage', '2,800 seats'], ['Sentinel Connectors', '25 data connectors']] },
      ]},
      { id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes', dimensionKey: 'outcome_clarity', content: [
        { t: 'bullets', items: ['100% MFA enforcement across all 2,800 seats with no legacy authentication protocols active', 'Endpoint compliance rate ≥95% (Intune-managed, Defender enrolled)', 'Zero standing privileged access — all admin actions governed by Entra ID PIM', 'Sentinel SIEM operational with MTTD <20 minutes by Month 9'] },
        { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [['MFA enforcement', '<50% (estimated)', '100%', 'Entra ID MFA report'], ['Endpoint compliance', 'Unknown', '≥95%', 'Defender compliance report'], ['MTTD', 'No SIEM', '<20 minutes', 'Sentinel incident tracker']] },
      ]},
      { id: 'scope', number: '3.', title: 'Scope of Work', dimensionKey: 'scope_completeness', content: [
        { t: 'table', headers: ['Phase', 'Duration', 'Activities', 'Deliverables'], rows: [
          ['Phase 1 — Identity Foundation', 'Months 1–3', 'Entra ID PIM, Conditional Access, legacy auth elimination, identity governance', 'Identity Baseline Report, CA Policy Library, PIM Runbook'],
          ['Phase 2 — Device Management', 'Months 3–6', 'Intune MDM for 2,800 seats, Defender for Endpoint enrollment, device compliance baselines, ZTNA', 'Device Compliance Report, Defender Enrollment Report'],
          ['Phase 3 — Sentinel & Hardening', 'Months 6–9', 'Sentinel SIEM deployment (25 connectors), SOAR playbooks, final hardening review', 'Sentinel Deployment Report, SOAR Playbook Library, Hardening Assessment'],
        ]},
      ]},
      { id: 'out-of-scope', number: '4.', title: 'Out of Scope', dimensionKey: 'out_of_scope', content: [
        { t: 'bullets', items: ['Physical security controls', 'Penetration testing or red team exercises', 'Security awareness training beyond one train-the-trainer SOC workshop', 'Sentinel connectors beyond the 25 named — additional connectors require a Change Order', 'Any workloads or seats beyond the 2,800-seat inventory confirmed at kickoff'] },
      ]},
      { id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies', dimensionKey: 'assumption_quality', content: [
        { t: 'bullets', items: ['Existing Microsoft E3 licensing covers Entra ID P1; Defender and Sentinel require client to upgrade to E5 or add-on licenses before Phase 1 ends', 'Client IT will dedicate 1 FTE (identity administrator) to support Phase 1 Entra ID transition', 'Client CISO signs off on all Conditional Access policies before production activation', 'Connector pre-qualification checklist issued to client IT in Week 1 for all 25 Sentinel connectors', '2,800-seat inventory is accurate; additions require a Change Order'] },
      ]},
      { id: 'timeline', number: '6.', title: 'Project Timeline & Milestones', dimensionKey: 'timeline_enforceability', content: [
        { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [['Identity Foundation Live', 'Month 3', 'Yes', '25% on Identity Baseline Report'], ['2,800 Seats on Intune + Defender', 'Month 6', 'Yes', '35% on Device Compliance Report'], ['Sentinel Live + Hardening Assessment', 'Month 9', 'Yes', '40% on Sentinel Deployment Report']] },
      ]},
      { id: 'governance', number: '7.', title: 'Governance & Change Management', dimensionKey: 'governance_readiness', content: [
        { t: 'bullets', items: ['Steering Committee: CISO (client) + Engagement Director (Microsoft) — bi-weekly', 'CA policy sign-off: All Conditional Access policies reviewed and signed by CISO before production activation', 'Escalation: L1 → Security PM | L2 → Delivery Lead | L3 → Engagement Executive / CISO', 'Change control: Written request → 3-business-day assessment → CISO + MS Director sign-off'] },
      ]},
      { id: 'commercial', number: '8.', title: 'Commercial Terms', dimensionKey: 'commercial_integrity', content: [
        { t: 'table', headers: ['Item', 'Detail'], rows: [['Pricing model', 'Fixed fee by phase, milestone-triggered billing'], ['ECIF', 'None committed'], ['Vendor', 'None — pure Microsoft PS delivery'], ['Expense policy', 'Included in fixed fee'], ['Payment terms', 'Net 30 from invoice date']] },
      ]},
      { id: 'risk', number: '9.', title: 'Preliminary Risk Register', dimensionKey: 'risk_visibility', content: [
        { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
          ['E5 licensing upgrade not complete before Phase 1 ends — Defender and Sentinel deployment delayed', 'Medium', 'High', 'Licensing upgrade timeline confirmed with client IT before engagement starts; delay triggers Phase 2/3 start date revision'],
          ['Legacy authentication systems incompatible with Conditional Access — require exception or timeline extension', 'Medium', 'Medium', 'Legacy system discovery in Phase 1; CA exceptions documented and CISO-approved before Phase 1 close'],
          ['Device enrollment rate below 95% due to unmanaged contractor devices', 'Medium', 'Medium', 'Contractor device policy defined in Phase 1; contractors may require separate guest-device onboarding track'],
        ]},
      ]},
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 7.5, strength: 'MFA enforcement (100%), endpoint compliance (≥95%), and MTTD (<20 min) are measurable with named instruments.', gaps: ['MFA baseline "estimated <50%" should be verified in Week 1', 'No business outcome — ZT implementation cost reduction or risk reduction is not quantified'], recommendation: 'Commission an identity audit in Week 1 to replace estimated baselines with verified figures.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 7.5, strength: 'Three-phase structure cleanly separates identity, devices, and Sentinel. Connector count (25) is explicit.', gaps: ['SOAR playbook count is not specified', 'ZTNA implementation details (what applications, what user groups) are not defined'], recommendation: 'Define ZTNA scope: name the 5–10 applications and user groups that move to ZTNA in Phase 2.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 7.5, strength: 'Connector count cap and seat count boundary are precisely stated. Physical security and pen testing are explicitly excluded.', gaps: ['No statement on what constitutes a "seat" — contractors, part-time employees, and shared accounts may be disputed'], recommendation: 'Add a seat definition: each licensed M365 account counts as one seat; shared accounts and service accounts require separate assessment.' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 7.5, strength: 'E5 licensing upgrade dependency is correctly identified as a pre-Phase 2 requirement. CA CISO sign-off is specific.', gaps: ['E5 licensing upgrade timeline is client-owned but no deadline or commercial consequence is defined for delay'], recommendation: 'Add a licensing upgrade deadline: if E5 is not confirmed by Month 1 Week 4, Phase 2 and 3 start dates shift proportionally.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 7.5, strength: 'Three milestones with go/no-go gates and payment triggers across 9 months.', gaps: ['No buffer between Phase 2 device enrollment and Phase 3 Sentinel — enrollment delay directly compresses Sentinel timeline'], recommendation: 'Build a 2-week enrollment completion buffer at Month 5.5 before Phase 3 begins.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 8.0, strength: 'Clean fixed fee with no vendor and no ECIF complexity. All expenses included.', gaps: ['No contingency for E5 licensing delay impact on timeline — commercial consequences of delay are undefined'], recommendation: 'Add an E5 delay clause: if licensing is delayed beyond Month 1, a timeline revision notice is issued with no additional cost impact to client.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 7.5, strength: 'CISO CA policy sign-off before activation is a strong security control. Bi-weekly Steering Committee is appropriate.', gaps: ['No defined response time SLA for CISO review of CA policies — slow review can block Phase 1 production activation'], recommendation: 'Define a 5-business-day CISO review SLA for CA policy batches; batches not reviewed within SLA are escalated to Engagement Executive.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 7.0, strength: 'E5 licensing risk and contractor device enrollment risk are specific and actionable.', gaps: ['No risk for Entra ID Conditional Access misconfiguration locking out users — a high-consequence risk for a 2,800-seat deployment'], recommendation: 'Add a CA rollout risk: all CA policies piloted with a 200-seat test group for 2 weeks before organization-wide activation.' },
    ],
    alignmentFlags: [
      { label: 'Outcomes → Deliverables', status: 'ok' },
      { label: 'E5 Licensing → Assumptions', status: 'warning', detail: 'E5 licensing upgrade is a critical assumption with no deadline or commercial consequence for delay.' },
      { label: 'CA Policy Review → Governance', status: 'ok' },
      { label: 'ZTNA Scope → Section 3', status: 'warning', detail: 'ZTNA is listed as a Phase 2 activity but no application scope or user group definition is provided.' },
    ],
  },

  // ─── 17. CONTOSO SPORTS NETWORK ─────────────────────────────────────────
  'Contoso Sports Network': {
    compositeScore: 6.5,
    sections: [
      { id: 'executive-summary', number: '1.', title: 'Executive Summary', content: [
        { t: 'p', text: 'Microsoft Professional Services will implement Dynamics 365 Sales and Marketing for Contoso Sports Network, a sports rights and media company. The 10-month engagement covers Dynamics 365 Sales (deal management, rights tracking), Marketing (campaign automation, fan engagement journeys), and integration with 4 media and rights management systems. The solution must support complex multi-party sports rights deal structures with multi-year contract values and broadcast territory tracking.' },
        { t: 'table', headers: ['Field', 'Detail'], rows: [['Client', 'Contoso Sports Network'], ['Engagement Type', 'D365 Sales & Marketing — Sports & Media'], ['Engagement Period', '10 months'], ['Integrations', '4 media and rights management systems'], ['Complexity', 'High — sports rights deal structures, territory tracking']] },
      ]},
      { id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes', dimensionKey: 'outcome_clarity', content: [
        { t: 'bullets', items: ['D365 Sales live with full rights deal tracking across all active deals by Month 9', 'D365 Marketing live with fan engagement journey automation by Month 9', 'All 4 integrations to media and rights management systems live and validated at go-live', 'Sales team opportunity-to-deal cycle time reduced by ≥20% within 90 days of go-live'] },
        { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [['Opportunity-to-deal cycle time', 'Current (client to provide)', '-20%', 'D365 Sales analytics'], ['Rights deals in D365', '0', '100% of active portfolio', 'D365 data audit'], ['Fan journey automation', '0 automated journeys', '5+ active journeys', 'D365 Marketing dashboard']] },
      ]},
      { id: 'scope', number: '3.', title: 'Scope of Work', dimensionKey: 'scope_completeness', content: [
        { t: 'table', headers: ['Phase', 'Duration', 'Activities', 'Deliverables'], rows: [
          ['Phase 1 — Design', 'Months 1–3', 'Requirements workshops, D365 data model design (sports rights deal structure), integration architecture for 4 systems, custom entity design', 'Solution Design Document, Data Model Sign-Off, Integration Architecture Blueprint'],
          ['Phase 2 — Build', 'Months 3–8', 'D365 Sales configuration (rights tracking, territory management), D365 Marketing configuration (fan journey automation), 4 system integrations, Power BI dashboards (2)', 'Sales Build Report, Marketing Build Report, Integration Test Reports (×4), Dashboard Library'],
          ['Phase 3 — UAT & Go-Live', 'Months 8–10', 'UAT with sales and marketing teams, data migration (active deals from current CRM), go-live cutover, 4-week hypercare', 'UAT Sign-Off, Data Migration Report, Go-Live Readiness Report'],
        ]},
      ]},
      { id: 'out-of-scope', number: '4.', title: 'Out of Scope', dimensionKey: 'out_of_scope', content: [
        { t: 'bullets', items: ['D365 Customer Service module — separate engagement if required', 'Integrations beyond the 4 named media and rights management systems', 'Historical CRM data migration beyond active deal portfolio (active defined as closing within 24 months)', 'Custom sports rights contract generation or legal document management', 'Custom AI or ML model development — standard D365 Copilot features only'] },
      ]},
      { id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies', dimensionKey: 'assumption_quality', content: [
        { t: 'bullets', items: ['Client provides a complete active deal inventory before Phase 1 requirements workshops begin', '4 integration system APIs are documented and accessible before Phase 2 begins', 'Client designates a Sales lead (1 FTE) and a Marketing lead (0.5 FTE) as D365 implementation owners', 'Existing CRM system exports in a standard format compatible with D365 data migration tooling', 'Sports rights deal entity design requires no more than 4 weeks of custom entity configuration'] },
      ]},
      { id: 'timeline', number: '6.', title: 'Project Timeline & Milestones', dimensionKey: 'timeline_enforceability', content: [
        { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [['Solution Design Document Accepted', 'Month 3', 'Yes', '20% on acceptance'], ['D365 Sales + Marketing Build Complete', 'Month 8', 'Yes', '40% on build reports'], ['UAT Sign-Off + Go-Live', 'Month 10', 'Yes', '40% on completion report']] },
      ]},
      { id: 'governance', number: '7.', title: 'Governance & Change Management', dimensionKey: 'governance_readiness', content: [
        { t: 'bullets', items: ['Steering Committee: VP of Sales (client) + VP of Marketing (client) + Engagement Director (Microsoft) — bi-weekly', 'Integration change control: Any integration scope change requires written approval from both VP Sales and VP Marketing', 'Custom entity review: All sports rights deal custom entities reviewed by client Legal before build begins', 'Escalation: L1 → D365 PM | L2 → Delivery Lead | L3 → Engagement Executive / VP Sales'] },
      ]},
      { id: 'commercial', number: '8.', title: 'Commercial Terms', dimensionKey: 'commercial_integrity', content: [
        { t: 'table', headers: ['Item', 'Detail'], rows: [['Pricing model', 'Fixed fee by phase, milestone-triggered billing'], ['ECIF', 'None committed'], ['Vendor', 'None — pure Microsoft PS delivery'], ['Payment terms', 'Net 30 from milestone acceptance'], ['Margin note', '26% sold margin — Finance flagged as tight for high-complexity D365 with custom sports entity work']] },
      ]},
      { id: 'risk', number: '9.', title: 'Preliminary Risk Register', dimensionKey: 'risk_visibility', content: [
        { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
          ['Sports rights deal data model complexity exceeds 4-week custom entity estimate — unique deal structures require more configuration', 'High', 'High', 'Data model complexity assessment in Phase 1 Week 2; if >4 weeks required, Change Order before Phase 2 begins'],
          ['Integration API documentation inaccurate for media rights management systems', 'Medium', 'High', 'Integration pre-qualification test in Month 1 before Phase 2 commitment'],
          ['Dual VP sponsorship (Sales + Marketing) leads to conflicting requirements and decision delays', 'Medium', 'Medium', 'Tie-breaker protocol: CEO is the escalation owner for Sales vs. Marketing priority conflicts; documented in RACI at kickoff'],
          ['Data migration from current CRM reveals non-standard deal structures not captured in data model', 'Medium', 'High', 'Migration dry-run in Phase 2 before final UAT; any non-standard structures trigger data model adjustment via Change Order'],
        ]},
      ]},
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 6.5, strength: 'Opportunity-to-deal cycle time (-20%) and fan journey count (5+) provide measurable business outcomes.', gaps: ['Cycle time baseline is "client to provide" — unverified at SOW signing', 'No outcome for the integration systems — data accuracy and sync latency targets are absent'], recommendation: 'Add integration data accuracy targets: each of the 4 integrations must maintain <2-minute data sync latency and <0.1% error rate at go-live.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 6.5, strength: 'Two D365 modules and 4 named integrations provide clear scope boundaries. Power BI dashboard count (2) is explicit.', gaps: ['Sports rights deal custom entity scope is estimated at 4 weeks but not validated against actual deal structure complexity', '4 integration systems are referenced by count and type but not named'], recommendation: 'Name the 4 integration systems in Appendix A and validate custom entity complexity in Phase 1 before Phase 2 commitment.' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 6.5, strength: 'D365 Customer Service module exclusion and 24-month active deal boundary are precisely stated.', gaps: ['No statement on what happens if deal structures discovered during Phase 1 fall outside the assumed 4-week custom entity scope', '"Custom AI beyond D365 Copilot" is vague — D365 Copilot features are not enumerated'], recommendation: 'Add a change order trigger: custom entity work exceeding 4 weeks triggers a formal scope revision before Phase 2 begins.' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 6.0, strength: 'Complete active deal inventory before Phase 1 and API documentation before Phase 2 are specific pre-conditions.', gaps: ['Sports rights deal entity complexity is assumed at 4 weeks but sports rights structures (co-rights, territory splits, broadcast windows) are notoriously complex and variable', 'Current CRM export format compatibility is assumed but not verified'], recommendation: 'Commission a pre-engagement data model complexity assessment using a sample of 10 active deals before SOW execution.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 6.5, strength: 'Three milestones with payment triggers cover the 10-month program.', gaps: ['No milestone for integration pre-qualification — a high-risk item with no early detection gate', 'No milestone for custom entity sign-off by client Legal — this is a prerequisite for Phase 2 build'], recommendation: 'Add Month 1 integration pre-qualification and Month 2 custom entity Legal sign-off as formal milestones.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 6.5, strength: 'Fixed fee per phase with clear change order triggers.', gaps: ['26% margin for high-complexity D365 with sports-domain custom entity work is flagged as tight — Finance concern is noted but unresolved', 'No contingency for custom entity complexity overrun'], recommendation: 'Finance to confirm margin floor. Add a custom entity complexity Change Order trigger before Phase 2 begins.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 6.5, strength: 'Dual VP Steering Committee with CEO escalation protocol is appropriate for a two-module engagement with competing priorities.', gaps: ['Custom entity Legal review cadence is not defined — how many review cycles, what is the SLA?'], recommendation: 'Define Legal review SLA: 5-business-day review of custom entity specifications; Legal feedback incorporated within 3 business days before Phase 2 build begins.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 6.5, strength: 'Custom entity complexity risk and dual VP conflict risk are domain-specific risks not commonly found in standard D365 SOWs.', gaps: ['No risk for D365 Marketing fan journey compliance — GDPR consent requirements for fan data in EU markets are absent', 'No risk for sports rights data confidentiality — rights deal values and territory terms are highly confidential'], recommendation: 'Add a GDPR fan data risk: all fan journey contact lists verified for GDPR consent status before campaign activation.' },
    ],
    alignmentFlags: [
      { label: 'Integration Register → Scope', status: 'warning', detail: 'Section 3 references 4 media and rights management system integrations but no named integration register exists.' },
      { label: 'Custom Entity Complexity → Risk Register', status: 'ok' },
      { label: 'Cycle Time Baseline → Outcomes', status: 'warning', detail: 'Opportunity-to-deal cycle time target (-20%) has no verified baseline.' },
      { label: 'Margin Risk → Commercial Terms', status: 'warning', detail: '26% margin is flagged as tight for high-complexity D365 with sports custom entity work — no contingency plan defined.' },
    ],
  },

  // ─── 18. WINGTIP TOYS ───────────────────────────────────────────────────
  'Wingtip Toys': {
    compositeScore: 6.2,
    sections: [
      { id: 'executive-summary', number: '1.', title: 'Executive Summary', content: [
        { t: 'p', text: 'Microsoft Professional Services will modernize 35 legacy .NET and Java applications to cloud-native architecture on Azure Kubernetes Service (AKS) for Wingtip Toys. The 14-month engagement covers containerization strategy, CI/CD pipeline build (Azure DevOps), application refactoring to microservices where applicable, Azure API Management, and an 18-month AKS support model. Applications span order management, inventory, product catalog, loyalty, and customer portal systems.' },
        { t: 'table', headers: ['Field', 'Detail'], rows: [['Client', 'Wingtip Toys'], ['Engagement Type', 'Cloud Native Modernization — AKS'], ['Engagement Period', '14 months'], ['Applications', '35 legacy .NET and Java apps'], ['Architecture Target', 'AKS, Azure DevOps CI/CD, API Management']] },
      ]},
      { id: 'outcomes', number: '2.', title: 'Customer Desired Outcomes', dimensionKey: 'outcome_clarity', content: [
        { t: 'bullets', items: ['35 applications containerized and running on AKS by Month 14', 'CI/CD pipeline operational with automated deployment for all 35 apps by Month 12', 'Application deployment frequency increased from current baseline (estimated quarterly) to ≥bi-weekly for core apps', 'P99 latency for order management and product catalog services maintained or improved vs. legacy baseline'] },
        { t: 'table', headers: ['Metric', 'Baseline', 'Target', 'Measurement'], rows: [['Apps on AKS', '0 of 35', '35 of 35', 'AKS workload audit'], ['CI/CD deployment frequency', 'Estimated quarterly', '≥bi-weekly for core apps', 'Azure DevOps deployment log'], ['P99 latency (order management)', 'Legacy baseline (client to provide)', '≤ current baseline', 'Azure Monitor APM']] },
      ]},
      { id: 'scope', number: '3.', title: 'Scope of Work', dimensionKey: 'scope_completeness', content: [
        { t: 'table', headers: ['Phase', 'Duration', 'Activities', 'Deliverables'], rows: [
          ['Phase 1 — Assessment & Architecture', 'Months 1–3', 'Application compatibility assessment (35 apps), containerization strategy per app, AKS cluster design, CI/CD architecture, API Management design', 'App Assessment Report, Containerization Runbook per App, AKS Architecture Blueprint'],
          ['Phase 2 — Foundation & Core Apps', 'Months 3–8', 'AKS cluster build, CI/CD pipeline build, containerize and deploy 12 core apps (order management, inventory, product catalog, loyalty, customer portal)', 'AKS Cluster Live, CI/CD Pipeline Live, Core App Deployment Reports (×12)'],
          ['Phase 3 — Remaining Apps & Handover', 'Months 8–14', 'Containerize and deploy remaining 23 apps, API Management configuration, AKS support model documentation, platform team enablement', 'Full App Deployment Reports, API Management Config, AKS Operations Runbook'],
        ]},
      ]},
      { id: 'out-of-scope', number: '4.', title: 'Out of Scope', dimensionKey: 'out_of_scope', content: [
        { t: 'bullets', items: ['Full application rewrite — containerization and refactoring to microservices where applicable; major rewrites require a Change Order', 'Legacy application decommission execution — advisory guidance and decommission plan only; client IT executes', 'Data migration — all application data remains in existing databases; schema changes are out of scope', 'Applications beyond the 35 named in the assessment — additions require a Change Order', 'Managed AKS support beyond the 18-month support model design (separate managed service engagement required)'] },
      ]},
      { id: 'assumptions', number: '5.', title: 'Assumptions & Dependencies', dimensionKey: 'assumption_quality', content: [
        { t: 'bullets', items: ['Application compatibility assessment assumes all 35 apps can be containerized without major architectural blockers — apps requiring full rewrites are flagged in Phase 1 and handled via Change Order', 'Client application teams (minimum 3 FTE across .NET and Java) are available for knowledge transfer throughout the engagement', 'Azure subscription with adequate AKS quota is provisioned before Phase 2 begins', 'Source code for all 35 apps is accessible in a version-controlled repository before Phase 1 begins', 'CI/CD pipeline assumes Azure DevOps — any apps requiring other CI/CD tools require a Change Order'] },
      ]},
      { id: 'timeline', number: '6.', title: 'Project Timeline & Milestones', dimensionKey: 'timeline_enforceability', content: [
        { t: 'table', headers: ['Milestone', 'Target Month', 'Go/No-Go', 'Payment Trigger'], rows: [['App Assessment Report + Containerization Strategy Accepted', 'Month 3', 'Yes', '20% on acceptance'], ['12 Core Apps Live on AKS + CI/CD Pipeline Operational', 'Month 8', 'Yes', '40% on deployment reports'], ['All 35 Apps on AKS + AKS Runbook Delivered', 'Month 14', 'Yes', '40% on completion']] },
      ]},
      { id: 'governance', number: '7.', title: 'Governance & Change Management', dimensionKey: 'governance_readiness', content: [
        { t: 'bullets', items: ['Technical Steering: VP Engineering (client) + Engagement Director (Microsoft) — bi-weekly', 'Application team weekly sync: MS delivery lead + client .NET and Java leads — each app team has a named owner', 'Containerization gate: each app requires a sign-off from its application team owner before containerization begins', 'Change control: Written request → 5-business-day impact assessment → VP Engineering + MS Director sign-off'] },
      ]},
      { id: 'commercial', number: '8.', title: 'Commercial Terms', dimensionKey: 'commercial_integrity', content: [
        { t: 'table', headers: ['Item', 'Detail'], rows: [['Pricing model', 'Fixed fee by phase, milestone-triggered billing'], ['ECIF', 'None committed'], ['Vendor', 'None — pure Microsoft PS delivery'], ['Margin note', '24% margin — tight for 35-app cloud native modernization; Finance flagged for review'], ['Payment terms', 'Net 30 from milestone acceptance']] },
      ]},
      { id: 'risk', number: '9.', title: 'Preliminary Risk Register', dimensionKey: 'risk_visibility', content: [
        { t: 'table', headers: ['Risk', 'Prob', 'Impact', 'Mitigation'], rows: [
          ['Application compatibility blockers discovered during Phase 1 — apps require rewrite not containerization', 'High', 'High', 'Phase 1 assessment is the risk detection gate; blockers trigger Change Order before Phase 2 begins'],
          ['Legacy Java apps using deprecated frameworks incompatible with modern container base images', 'Medium', 'Medium', 'Framework compatibility scan included in Phase 1 assessment; incompatible frameworks flagged with remediation options'],
          ['Client app team availability below 3 FTE — knowledge transfer and co-development impacted', 'Medium', 'High', 'App team availability confirmed before Phase 2 begins; below 3 FTE triggers PM escalation to VP Engineering'],
          ['AKS resource contention between core apps and remaining 23 apps during Phase 3 concurrent migration', 'Low', 'Medium', 'AKS cluster sizing validated against full 35-app workload in Phase 1; capacity headroom built into cluster design'],
        ]},
      ]},
    ],
    dimensions: [
      { key: 'outcome_clarity', label: 'Outcome Clarity', score: 6.5, strength: 'App count on AKS (35) and CI/CD deployment frequency (≥bi-weekly) are measurable with named instruments.', gaps: ['P99 latency baseline is "client to provide" — performance parity target is unverifiable until provided', 'No business outcome — cost reduction or developer productivity improvement from cloud native modernization is absent'], recommendation: 'Add a developer velocity outcome: average time from commit to production deployment reduced from current baseline to ≤30 minutes.' },
      { key: 'scope_completeness', label: 'Scope Completeness', score: 6.0, strength: 'Phase structure separates core apps (12) from remaining apps (23). AKS, CI/CD, and API Management are all named.', gaps: ['35 apps are referenced by count and category but not individually named — which apps are in scope is unclear', '"Refactoring to microservices where applicable" is vague — no criteria for what triggers a microservices refactor vs. simple containerization'], recommendation: 'Add a named app inventory in Appendix A and define the microservices trigger criteria (e.g., apps >100K requests/day that are monolithic are refactor candidates).' },
      { key: 'out_of_scope', label: 'Out-of-Scope Specificity', score: 6.5, strength: 'Full rewrite exclusion and data migration exclusion are clearly stated. App count boundary (35) is explicit.', gaps: ['No statement on what constitutes "major rewrite" vs. "refactoring" — the boundary is ambiguous and likely to be disputed', '"Applicable" refactoring criterion is undefined — dispute-prone in an engagement with 35 apps'], recommendation: 'Define the refactor boundary: any app requiring more than 40 person-hours of code changes is a "rewrite" requiring a Change Order.' },
      { key: 'assumption_quality', label: 'Assumption Quality', score: 6.0, strength: 'Source code accessibility requirement and Azure DevOps CI/CD assumption are specific pre-conditions.', gaps: ['Application compatibility assumption ("can be containerized without major blockers") is unverified — this is the highest-risk assumption for a 35-app engagement', '3 FTE client app team availability is stated as a minimum but no consequences for falling below this are defined'], recommendation: 'Add a pre-engagement app compatibility scan using Azure Migrate for .NET and Java apps to surface blockers before SOW execution.' },
      { key: 'timeline_enforceability', label: 'Timeline Enforceability', score: 6.5, strength: 'Three milestones with payment triggers. Phase 1 assessment gate before Phase 2 commitment is well-structured.', gaps: ['No per-app deployment milestone — 35 apps across Phases 2 and 3 with only 2 aggregate milestones provides limited visibility into delivery pace', 'No Phase 3 interim checkpoint for the 23 remaining apps — a mid-Phase 3 check at Month 11 would surface problems earlier'], recommendation: 'Add a Month 11 mid-Phase 3 checkpoint: ≥15 of 23 remaining apps live on AKS; below this triggers PM escalation.' },
      { key: 'commercial_integrity', label: 'Commercial Integrity', score: 6.5, strength: 'Fixed fee per phase with change order triggers for scope additions.', gaps: ['24% margin for 35-app cloud native modernization is flagged as tight — Finance concern is noted but no contingency is defined', 'App rewrite Change Orders could materially affect the engagement economics — no guidance on expected frequency'], recommendation: 'Finance to confirm margin floor. Add a rewrite Change Order cost guideline so client has visibility into the typical cost of a rewrite-scope addition.' },
      { key: 'governance_readiness', label: 'Governance Readiness', score: 6.0, strength: 'Per-app containerization sign-off by the named application owner is a strong operational governance control.', gaps: ['No defined escalation if an application team refuses to sign off on containerization approach — blocks Phase 2 progress with no resolution path', 'API Management governance (who approves API policy changes in production) is not defined'], recommendation: 'Add escalation path for app team sign-off impasse: VP Engineering makes binding decision within 5 business days of deadlock.' },
      { key: 'risk_visibility', label: 'Risk Visibility', score: 6.0, strength: 'Application compatibility blocker risk is the highest-risk item and is correctly identified as a Phase 1 detection gate.', gaps: ['No risk for production outage during Phase 3 cutover of legacy apps to AKS', 'No risk for AKS cluster operational complexity — client team may struggle to self-operate after handover without dedicated Kubernetes expertise'], recommendation: 'Add an AKS operations risk: client platform team must complete AKS Operations certification before the Month 14 handover; uncertified team triggers extended hypercare.' },
    ],
    alignmentFlags: [
      { label: 'App Inventory → Appendix A', status: 'warning', detail: 'Section 3 references 35 apps but no named app inventory exists as a deliverable or appendix.' },
      { label: 'Rewrite vs. Refactor Boundary → Scope', status: 'warning', detail: '"Refactoring where applicable" is undefined — a dispute-prone boundary for a 35-app engagement.' },
      { label: 'Margin Risk → Commercial Terms', status: 'warning', detail: '24% margin for 35-app cloud native modernization is flagged as tight — no contingency mechanism defined.' },
      { label: 'Phase 1 Assessment → Phase 2 Gate', status: 'ok' },
    ],
  },
};
