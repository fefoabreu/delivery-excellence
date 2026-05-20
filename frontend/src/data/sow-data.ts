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
};
