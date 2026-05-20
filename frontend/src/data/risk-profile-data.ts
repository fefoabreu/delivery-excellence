import { ContentBlock } from './sow-data';

export type RiskSectionType = 'brief' | 'standard' | 'precedent' | 'agents' | 'signals';

export interface RiskSection {
  id: string;
  number: string;
  title: string;
  sectionType: RiskSectionType;
  dimensionKey?: string;
  content: ContentBlock[];
}

export interface RiskDimension {
  key: string;
  label: string;
  weight: string;
  score: number;
  strength: string;
  gaps: string[];
  recommendation: string;
}

export interface ReferenceProject {
  name: string;
  industry: string;
  year: number;
  outcome: 'success' | 'partial' | 'failed';
  relevance: 'High' | 'Medium';
  lesson: string;
}

export interface AgentMatch {
  name: string;
  role: string;
  credits: Array<{ project: string; csat: number }>;
  industries: string[];
  availability: string;
  regions: string[];
}

export interface MarketSignal {
  feed: string;
  alert: string;
  severity: 'info' | 'warning' | 'critical';
  date: string;
  dimension: string;
}

export interface ExecutiveBrief {
  riskTier: 'Low Risk' | 'Managed Risk' | 'Elevated Risk' | 'High Risk' | 'Critical Risk';
  headlineRisk: string;
  precedentSignal: string;
  deliveryConfidence: string;
  marketContext: string;
  decisionGuidance: string;
}

export interface RiskAlignmentFlag {
  label: string;
  status: 'ok' | 'warning';
  detail?: string;
}

export interface RiskProfileData {
  compositeScore: number;
  executiveBrief: ExecutiveBrief;
  sections: RiskSection[];
  dimensions: RiskDimension[];
  referenceProjects: ReferenceProject[];
  agentMatches: AgentMatch[];
  marketSignals: MarketSignal[];
  alignmentFlags: RiskAlignmentFlag[];
}

export function riskTierFromScore(s: number): ExecutiveBrief['riskTier'] {
  if (s >= 8.5) return 'Low Risk';
  if (s >= 7.0) return 'Managed Risk';
  if (s >= 5.5) return 'Elevated Risk';
  if (s >= 4.0) return 'High Risk';
  return 'Critical Risk';
}

export function riskColor(s: number) {
  if (s >= 8.5) return { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'Low Risk' };
  if (s >= 7.0) return { dot: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', badge: 'Managed Risk' };
  if (s >= 5.5) return { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'Elevated Risk' };
  if (s >= 4.0) return { dot: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', badge: 'High Risk' };
  return { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', badge: 'Critical Risk' };
}

export const RISK_PROFILE_DATA: Record<string, RiskProfileData> = {

  // ─── 1. FOURTH COFFEE CORPORATION ────────────────────────────────────────
  'Fourth Coffee Corporation': {
    compositeScore: 5.5,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'High delivery complexity across 210 workloads in three migration tracks, compounded by EMEA geographic scope and a new client relationship with no CRM delivery history.',
      precedentSignal: '88% delivery success rate on 4 comparable migrations. Key lesson from Northwind Retailers DC Exit: EMEA waves ran 4 months late due to unresolved data residency questions — same risk is present here.',
      deliveryConfidence: 'James Holwerda (Migration Lead, CSAT 4.3 on Adatum Foundation) is the strongest available match. EMEA delivery presence needs confirmation — no local confirmed resource on file.',
      marketContext: 'Azure migration demand is at peak across Americas and EMEA. Team capacity for large DC exit programs is constrained — competing pipeline pressure on the migration practice.',
      decisionGuidance: 'Approve with two hard conditions: (1) EMEA local delivery resource confirmed before contract signature; (2) workload inventory locked and EMEA data residency pre-cleared before Phase 2 begins.',
    },
    sections: [
      {
        id: 'executive-brief', number: '1.', title: 'Executive Risk Brief',
        sectionType: 'brief',
        content: [
          { t: 'p', text: 'This is an Elevated Risk engagement. The deal is commercially sound and strategically strong, but the delivery complexity of 210 workloads across Americas and EMEA — combined with a new client relationship and Avanade subcontractor coordination — creates a meaningful execution risk picture that requires active management at approval.' },
          { t: 'p', text: 'The deal should proceed to approval with named conditions. The two risk items that must be resolved before contract execution are (1) EMEA local delivery resource confirmation and (2) EMEA data residency pre-clearance. Both are manageable; neither is a deal-stopper if addressed promptly.' },
        ],
      },
      {
        id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment',
        sectionType: 'standard', dimensionKey: 'delivery_complexity',
        content: [
          { t: 'p', text: 'The migration factory covers 210 workloads across three technical tracks: 120 Lift-Shift (straightforward but volume-intensive), 60 Refactor (moderate technical complexity per workload), and 30 Greenfield (net-new cloud-native builds, highest per-unit complexity). Running all three tracks in parallel across Americas and EMEA is the primary complexity driver.' },
          { t: 'bullets', items: [
            'Wave structure: 6 waves of 35 workloads each — manageable in isolation, but EMEA waves 5–6 carry residency and coordination overhead',
            'Refactor track requires containerization expertise and PaaS conversion skills — distinct from Lift-Shift capabilities',
            'Greenfield track (30 workloads) is the highest per-unit complexity and has the least comparable precedent in this engagement type',
            '18-month timeline leaves 2–3 weeks of float per wave — tight but not unreasonable for this scale',
          ]},
        ],
      },
      {
        id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment',
        sectionType: 'standard', dimensionKey: 'client_readiness',
        content: [
          { t: 'p', text: 'Fourth Coffee is a new logo with no prior Microsoft PS delivery history. The VP of IT Infrastructure is the named sponsor — a functional lead rather than a C-suite sponsor, which limits escalation authority and organizational change capacity for a program of this scope.' },
          { t: 'bullets', items: [
            'Client IT team commitment of 2 FTE is appropriate for the migration phase but may be insufficient during EMEA waves when Americas waves are still in hypercare',
            'No change management function has been mentioned — for a 210-workload migration with FinOps culture change, this is a gap',
            'Decision velocity is unknown (new logo) — client review cycles and approval speed are unproven at this scale',
            'Positive signal: client initiated this engagement with a clear mandate to exit the data center — executive alignment on the direction is strong even if sponsorship level is mid-tier',
          ]},
        ],
      },
      {
        id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment',
        sectionType: 'standard', dimensionKey: 'commercial_structure',
        content: [
          { t: 'p', text: '28% sold margin is adequate for a high-volume migration at this scale, particularly with Avanade absorbing 20% of effort under Microsoft\'s commercial risk umbrella. The 15% ECIF commitment on Phase 1 creates a structured landing zone investment that lowers early-phase commercial exposure.' },
          { t: 'bullets', items: [
            'Volume discount applied correctly — commercial desk has confirmed the tier (per AI condition)',
            'Change order mechanism is defined in SOW — commercial protection is in place for scope additions',
            'Risk: if EMEA waves encounter data residency complications requiring additional legal work, the fixed-fee structure has limited buffer at 28% margin',
            'Positive: Avanade commercial risk is fully absorbed — Microsoft is not sharing upside with the subcontractor but is carrying the delivery risk, which is appropriate at this margin level',
          ]},
        ],
      },
      {
        id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment',
        sectionType: 'standard', dimensionKey: 'execution_resourcing',
        content: [
          { t: 'bullets', items: [
            '4 comparable large-scale Azure migrations completed — delivery success rate 88%, above the 80% threshold for standard approval',
            'Microsoft Engagement Director and Solution Architect roles are confirmed; Migration Lead (Phase 2) and FinOps Architect (Phase 3) are not yet named',
            'Avanade team: resource commitment letter required before Phase 2 — currently outstanding (per SOW assumption)',
            'EMEA delivery: no local Microsoft PS resource confirmed for EMEA waves — this is the single highest execution risk item',
            'Key-person risk: if the Engagement Director is reallocated mid-program, the Avanade governance model loses its anchor',
          ]},
        ],
      },
      {
        id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment',
        sectionType: 'standard', dimensionKey: 'regulatory_compliance',
        content: [
          { t: 'p', text: 'No named regulatory requirements apply to this engagement. EMEA data residency is treated as an assumption (client asserts compliance) rather than a verified regulatory condition — which represents an unmitigated risk but not a regulatory delivery burden.' },
          { t: 'bullets', items: [
            'No GDPR, FFIEC, HIPAA, or SOX requirements in scope',
            'EMEA data residency: client asserts no new barriers — but this is unverified and EMEA workloads are scheduled last, giving time to surface issues',
            'No AI governance requirements (no AI in delivery scope)',
          ]},
        ],
      },
      {
        id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment',
        sectionType: 'standard', dimensionKey: 'partner_ecosystem',
        content: [
          { t: 'bullets', items: [
            'Avanade participation: 20% of effort — within the Managed Risk threshold for a known partner',
            'Avanade has 3+ comparable DC exit migrations with Microsoft PS; performance rated 4.0/5.0 on most recent comparable',
            'Avanade subcontract SLA is defined in the deal conditions — regulatory-aware configuration standard requirement is appropriate',
            'Risk: Avanade governance protocol in the SOW is thin — their reporting line and Microsoft PM authority over their scope is not fully documented',
            'No third-party technology dependencies that create platform risk',
          ]},
        ],
      },
      {
        id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment',
        sectionType: 'standard', dimensionKey: 'technology_maturity',
        content: [
          { t: 'bullets', items: [
            'Azure Migrate, Azure Site Recovery (ASR), and Azure Arc: all GA and production-proven at comparable scale',
            'Azure Landing Zone (hub-spoke): fully mature, templated delivery — no risk',
            'FinOps tooling (Azure Cost Management, FinOps hub): GA and well-established in comparable engagements',
            'No preview features in critical path — low technology maturity risk overall',
            'Refactor track (containerization to AKS): AKS is mature but containerization of legacy workloads carries per-workload discovery risk',
          ]},
        ],
      },
      {
        id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence',
        sectionType: 'precedent',
        content: [
          { t: 'p', text: 'Three comparable large-scale Azure migration programs were retrieved. The partial outcome on Northwind Retailers DC Exit is the most relevant precedent — the root cause (unresolved EMEA data residency) is directly applicable to this engagement.' },
        ],
      },
      {
        id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence',
        sectionType: 'agents',
        content: [
          { t: 'p', text: 'Two delivery agents with comparable Azure DC exit experience are available within the engagement timeline. EMEA regional coverage is the gap — no agent with EMEA-specific large-scale migration experience is currently identified as available.' },
        ],
      },
      {
        id: 'market-signals', number: '11.', title: 'Market Signal Alerts',
        sectionType: 'signals',
        content: [
          { t: 'p', text: 'One active market signal is affecting this engagement. Review the capacity signal before finalizing the team composition.' },
        ],
      },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 4.0,
        strength: 'Three-track migration structure (Lift-Shift, Refactor, Greenfield) is well-organized and leverages proven Azure Migrate tooling for the majority of workloads.',
        gaps: ['EMEA geographic scope adds coordination, timezone, and potential data residency overhead not fully captured in the complexity rating', 'Greenfield track (30 workloads) has the least precedent in comparable DC exit engagements — per-workload variance is high'],
        recommendation: 'Lock Greenfield workload specifications in Phase 1 before migration waves begin. Consider a separate risk register entry for Greenfield track per-workload variance.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 5.5,
        strength: 'Strong executive alignment on the strategic direction (data center exit) despite mid-tier sponsorship level — the mandate is clear even if the sponsor is not C-suite.',
        gaps: ['No change management function identified for FinOps culture adoption', 'Decision velocity is unknown (new logo) — first delayed decision in Phase 2 could cascade across waves'],
        recommendation: 'Request client to designate a FinOps adoption lead before Phase 3 begins. Establish a decision SLA in the governance plan (client decisions required within 5 business days).' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 7.5,
        strength: '28% margin with Avanade absorbed and ECIF protection on Phase 1 is a well-structured commercial position for this scale.',
        gaps: ['EMEA legal complications could erode margin if the residency issue requires unplanned advisory work'],
        recommendation: 'Include a 2% contingency reserve in the financial model for EMEA residency resolution costs.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 6.0,
        strength: '88% delivery success rate on 4 comparable migrations is above threshold. James Holwerda is a strong Migration Lead match with recent comparable experience.',
        gaps: ['EMEA local resource not confirmed — the highest single execution risk item', 'Avanade resource commitment letter is outstanding'],
        recommendation: 'EMEA local resource confirmation is a hard gate for contract execution. Block Phase 2 kickoff until the Avanade commitment letter is received.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 9.5,
        strength: 'No regulatory requirements apply. Lowest risk dimension in this deal.',
        gaps: ['EMEA data residency is an assumption, not a verified compliance position'],
        recommendation: 'Require client legal confirmation of EMEA data residency compliance as a Month 1 Phase 1 gate deliverable.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 6.0,
        strength: 'Avanade is a known partner with comparable delivery history; commercial risk is fully absorbed by Microsoft.',
        gaps: ['Avanade governance protocol is insufficiently defined in the SOW', 'No Avanade EMEA resource confirmed to handle the local waves'],
        recommendation: 'Add a 1-page Avanade governance protocol before contract execution: meeting cadence, reporting format, Microsoft PM authority over Avanade scope decisions.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 8.5,
        strength: 'All platform components are GA and production-proven. No preview features in critical path. AKS containerization is the only area requiring per-workload assessment.',
        gaps: ['Containerization of legacy workloads (Refactor track) requires per-workload discovery that can surface compatibility issues late in the wave'],
        recommendation: 'Build a containerization compatibility assessment into the Phase 1 workload inventory gate for all Refactor-track workloads.' },
    ],
    referenceProjects: [
      { name: 'Adatum Cloud Foundation', industry: 'Professional Services', year: 2024, outcome: 'success', relevance: 'High', lesson: 'Landing Zone templating and Avanade coordination worked well when MS PM held weekly joint syncs. Success attributed to early workload inventory lock (Week 1).' },
      { name: 'Northwind Retailers DC Exit', industry: 'Retail', year: 2023, outcome: 'partial', relevance: 'High', lesson: 'EMEA waves ran 4 months late due to EU data residency review initiated in Month 10 rather than Month 1. Same risk present in this engagement — EMEA residency assumed but unverified.' },
      { name: 'Bellows College Azure Campus', industry: 'Education', year: 2025, outcome: 'success', relevance: 'Medium', lesson: 'Multi-track migration (Lift-Shift + Refactor) succeeded when Refactor criteria were locked in a Phase 1 workload classification gate. Without this gate, track assignment disputes delayed Wave 2.' },
    ],
    agentMatches: [
      { name: 'James Holwerda', role: 'Azure Migration Lead', credits: [{ project: 'Adatum Cloud Foundation', csat: 4.3 }, { project: 'Bellows College Azure Campus', csat: 4.5 }], industries: ['Retail', 'Education', 'Professional Services'], availability: 'Available from Month 1', regions: ['Americas'] },
      { name: 'Sofia Delgado', role: 'FinOps Architect', credits: [{ project: 'Adatum Cloud Foundation', csat: 4.1 }], industries: ['Retail', 'Manufacturing'], availability: 'Available from Month 12 (Phase 3)', regions: ['Americas', 'EMEA'] },
    ],
    marketSignals: [
      { feed: 'Migration Practice Capacity Index', alert: 'Azure DC exit pipeline demand is at 18-month high across Americas. Team capacity for large programs (>150 workloads) is under pressure — 3 competing programs in the queue.', severity: 'warning', date: 'May 2026', dimension: 'Execution & Resourcing' },
    ],
    alignmentFlags: [
      { label: 'Delivery Success Rate vs. Precedent Evidence', status: 'ok' },
      { label: 'EMEA Risk → Risk Register', status: 'warning', detail: 'EMEA data residency risk is in the SOW assumptions but has no entry in the deal risk register.' },
      { label: 'Avanade Protocol → Governance', status: 'warning', detail: 'Avanade governance protocol is defined as a condition but not yet documented.' },
      { label: 'ECIF → Commercial Terms', status: 'ok' },
    ],
  },

  // ─── 2. A. DATUM CORPORATION ─────────────────────────────────────────────
  'A. Datum Corporation': {
    compositeScore: 7.5,
    executiveBrief: {
      riskTier: 'Managed Risk',
      headlineRisk: 'Well-contained security transformation with strong playbook leverage and no vendor dilution. Primary risk is legacy system Conditional Access compatibility, which requires a Phase 1 discovery gate.',
      precedentSignal: '92% delivery success rate on 5 comparable Zero Trust engagements. No failures in this service line. Proseware SOC Modernization is the closest match — identical technology stack, 94% CSAT.',
      deliveryConfidence: 'Priya Nakamura (Zero Trust Architect, CSAT 4.4 on Proseware) and Marcus Chen (Sentinel/SOAR Architect, CSAT 4.6) are both confirmed available. Strongest delivery team match in the current portfolio.',
      marketContext: 'Zero Trust market: Stable. Microsoft Entra ID and Sentinel are both fully mature GA products. No technology maturity risk. Board-mandate engagements in this service line have the highest first-pass approval rate in our portfolio.',
      decisionGuidance: 'Recommend approval without conditions. Confirm licensing pre-verification in Phase 1 Assessment. Legacy system compatibility audit is a standard Phase 1 gate — no blocker.',
    },
    sections: [
      {
        id: 'executive-brief', number: '1.', title: 'Executive Risk Brief',
        sectionType: 'brief',
        content: [
          { t: 'p', text: 'This is a Managed Risk engagement — the strongest risk profile in the current pending portfolio. The Zero Trust service line is Microsoft PS\'s highest-confidence delivery track: mature playbooks, experienced delivery team, proven technology, and a board-mandate sponsorship that creates the organizational readiness conditions for success.' },
          { t: 'p', text: 'The primary risk items are procedural: licensing pre-verification and legacy system Conditional Access compatibility. Both are standard Phase 1 gate activities, not deal-level risks.' },
        ],
      },
      {
        id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment',
        sectionType: 'standard', dimensionKey: 'delivery_complexity',
        content: [
          { t: 'p', text: '6,500 seats across four phases is a large-scale but well-structured deployment. All four platform components (Entra ID, Sentinel, Defender XDR, SOAR) have established delivery playbooks with >5 comparable deployments each.' },
          { t: 'bullets', items: [
            'Entra ID PIM + Conditional Access: fully templated delivery, 45-connector Sentinel deployment is volume-intensive but not complex',
            'SOAR automation: the only component requiring custom development (playbook authoring) — manageable within Phase 3 scope',
            'Responsible AI guardrails: new addition to the standard ZT playbook — adds a small governance design component with no comparable precedent in ZT engagements',
            'No data migration, no SAP integration, no multi-country scope — complexity ceiling is medium despite 6,500-seat scale',
          ]},
        ],
      },
      {
        id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment',
        sectionType: 'standard', dimensionKey: 'client_readiness',
        content: [
          { t: 'bullets', items: [
            'Board mandate: highest sponsorship signal — the CISO has full organizational authority and budget to execute',
            'Client dedicated security architect (0.5 FTE): appropriate commitment for a 10-month ZT program',
            'A. Datum\'s parent group (12 subsidiaries): positive signal — success here creates expansion potential and the client is motivated to deliver a reference-quality outcome',
            'Decision velocity: board-mandate engagements have historically fast decision cycles — no historical red flags in CRM',
          ]},
        ],
      },
      {
        id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment',
        sectionType: 'standard', dimensionKey: 'commercial_structure',
        content: [
          { t: 'bullets', items: [
            '35% margin is the highest in the current pending portfolio — excellent commercial position',
            'Fixed fee with no vendor: simplest commercial structure, no dilution risk, no subcontractor commercial exposure',
            'No ECIF complexity — clean billing structure',
            'SOAR playbook legal review requirement adds a 3-5 day approval dependency per playbook — not a commercial risk but a scheduling consideration',
          ]},
        ],
      },
      {
        id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment',
        sectionType: 'standard', dimensionKey: 'execution_resourcing',
        content: [
          { t: 'bullets', items: [
            '5 comparable ZT + Security engagements with 92% delivery success rate — highest confidence service line',
            'Priya Nakamura and Marcus Chen confirmed available — both have directly comparable delivery credits',
            'No key-person risk: the ZT and Sentinel playbooks are team-held knowledge, not individual-dependent',
            'Pure Microsoft PS delivery — no subcontractor coordination overhead',
          ]},
        ],
      },
      {
        id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment',
        sectionType: 'standard', dimensionKey: 'regulatory_compliance',
        content: [
          { t: 'bullets', items: [
            'No regulatory requirements apply',
            'SOAR automated remediation actions require client legal review — this is a governance control, not a regulatory compliance burden',
            'Responsible AI guardrails are a delivery practice requirement, not a regulatory mandate — manageable within Phase 4',
          ]},
        ],
      },
      {
        id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment',
        sectionType: 'standard', dimensionKey: 'partner_ecosystem',
        content: [
          { t: 'bullets', items: [
            'No subcontractor — purest possible delivery structure',
            'No third-party technology dependencies beyond the Microsoft platform stack',
            'All 45 Sentinel data connectors are Microsoft-native or Microsoft-certified — no unsupported connector risk',
          ]},
        ],
      },
      {
        id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment',
        sectionType: 'standard', dimensionKey: 'technology_maturity',
        content: [
          { t: 'bullets', items: [
            'Microsoft Entra ID P2, Sentinel, Defender XDR, Intune: all fully GA with production-proven deployment at comparable scale',
            'SOAR platform (Sentinel Logic Apps): GA and well-understood by the delivery team',
            'Responsible AI governance tooling: Microsoft\'s RAI toolkit is available but the integration into a ZT SOC context has <2 comparable deployments',
            'No preview features in critical path',
          ]},
        ],
      },
      {
        id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence',
        sectionType: 'precedent',
        content: [
          { t: 'p', text: 'Five comparable Zero Trust and security transformation engagements retrieved. No failures in this service line. The Wingtip Financial SIEM Migration partial outcome is the only cautionary precedent — caused by client-side leadership change, not a delivery execution failure.' },
        ],
      },
      {
        id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence',
        sectionType: 'agents',
        content: [
          { t: 'p', text: 'Two agents are confirmed available with directly comparable delivery credits. This is the strongest team match in the current pending portfolio.' },
        ],
      },
      {
        id: 'market-signals', number: '11.', title: 'Market Signal Alerts',
        sectionType: 'signals',
        content: [
          { t: 'p', text: 'No adverse market signals. Zero Trust demand is strong and stable. Microsoft platform is fully GA.' },
        ],
      },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 7.0, strength: 'Four-phase structure is clean and well-sequenced. All components have mature delivery playbooks.', gaps: ['Responsible AI guardrails for SOC context has <2 comparable precedents — scope is small but novel'], recommendation: 'Define RAI framework acceptance criteria explicitly in Phase 4 deliverable spec before engagement starts.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 8.5, strength: 'Board mandate with CISO authority and parent-group expansion potential creates ideal sponsorship conditions.', gaps: ['12-subsidiary expansion potential also means stakeholder landscape is larger than a standalone engagement'], recommendation: 'Identify two additional A. Datum stakeholders (IT Director level) in Phase 1 to build multi-stakeholder alignment before Phase 2.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 9.0, strength: '35% margin, no vendor, fixed fee — the cleanest commercial structure in the current portfolio.', gaps: ['SOAR playbook legal review dependency could slow Phase 3 if client legal team is slow to respond'], recommendation: 'Start SOAR playbook legal review process in Phase 2 (parallel to identity work) to avoid Phase 3 delay.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 8.0, strength: 'Priya Nakamura and Marcus Chen are confirmed available with directly comparable delivery credits. No subcontractor risk.', gaps: ['SOAR automation playbook authoring requires both ZT and Sentinel expertise simultaneously — role overlap risk in Phase 3'], recommendation: 'Confirm Phase 3 team has dedicated SOAR authoring resource alongside Sentinel deployment lead — do not rely on one person for both.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 9.0, strength: 'No regulatory requirements. Responsible AI is an internal practice standard, not an external mandate.', gaps: [], recommendation: 'No action required on regulatory dimension.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 9.5, strength: 'No partners. No third-party platform dependencies. Lowest possible partner risk.', gaps: [], recommendation: 'No action required.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 8.5, strength: 'All core platform components are fully GA. Sentinel 45-connector deployment is well-understood.', gaps: ['RAI toolkit integration into SOC context: <2 comparable deployments — minor technology novelty risk'], recommendation: 'Schedule a 2-day RAI integration design sprint in Phase 1 to validate the approach before Phase 4 commitment.' },
    ],
    referenceProjects: [
      { name: 'Proseware SOC Modernization', industry: 'Financial Services', year: 2025, outcome: 'success', relevance: 'High', lesson: 'Identical technology stack (Entra ID + Sentinel + Defender XDR). 94% CSAT. SOAR playbooks required 3 weeks of tuning post-go-live — build this buffer into Phase 3 timeline.' },
      { name: 'City Power & Light SOC Modernization', industry: 'Energy & Utilities', year: 2024, outcome: 'success', relevance: 'High', lesson: '40-connector Sentinel deployment completed on schedule when connectors were pre-qualified in Phase 1. Connectors not pre-qualified (7 of 40) caused a 2-week delay in Phase 3.' },
      { name: 'Wingtip Financial SIEM Migration', industry: 'Banking', year: 2024, outcome: 'partial', relevance: 'Medium', lesson: 'CISO departure at Month 5 required 6-week re-sponsorship process. Delivery paused during transition. Mitigation for A. Datum: CISO has board mandate — lower turnover risk, but an escalation plan for sponsor change should be documented.' },
      { name: 'Lamna Healthcare Azure & Security Foundation', industry: 'Healthcare', year: 2024, outcome: 'success', relevance: 'Medium', lesson: 'Responsible AI governance design added 3 weeks of scope in a comparable engagement when acceptance criteria were undefined at contract signature. Define RAI acceptance criteria before Phase 1 ends.' },
    ],
    agentMatches: [
      { name: 'Priya Nakamura', role: 'Zero Trust Architect', credits: [{ project: 'Proseware SOC Modernization', csat: 4.4 }, { project: 'City Power & Light SOC', csat: 4.3 }], industries: ['Financial Services', 'Energy'], availability: 'Confirmed available Month 1', regions: ['Americas', 'EMEA'] },
      { name: 'Marcus Chen', role: 'Sentinel & AI Lead', credits: [{ project: 'VanArsdel Copilot & AI Platform', csat: 4.6 }, { project: 'Proseware SOC Modernization', csat: 4.5 }], industries: ['Retail', 'Financial Services'], availability: 'Confirmed available Month 3', regions: ['Americas'] },
    ],
    marketSignals: [],
    alignmentFlags: [
      { label: 'Success Rate vs. Precedent Evidence', status: 'ok' },
      { label: 'Team Availability Confirmed', status: 'ok' },
      { label: 'RAI Scope → Technology Maturity', status: 'warning', detail: 'Responsible AI guardrails for SOC context has <2 comparable deployments — novelty risk is small but should be acknowledged at approval.' },
      { label: 'Commercial Structure → Margin', status: 'ok' },
    ],
  },

  // ─── 3. CONTOSO HOTELS & RESORTS ─────────────────────────────────────────
  'Contoso Hotels & Resorts': {
    compositeScore: 5.5,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'AI platform build at unprecedented scale (240 properties, 18 countries) using Azure AI Studio agent architecture that has only 2 comparable precedents. AI model performance against the +15% booking conversion target is the single highest-risk outcome in the current portfolio.',
      precedentSignal: '85% delivery success rate on 2 comparable AI platform engagements. Datum Corp AI Innovation Platform is the most relevant precedent — model underperformed its conversion target by 8% at go-live, requiring a 6-week optimization sprint. Same risk is present here.',
      deliveryConfidence: 'Marcus Chen (AI Lead, CSAT 4.6 on VanArsdel) is confirmed. The 240-property rollout requires 3 additional regional deployment specialists — not yet identified. GDPR privacy officer engagement is critical and not yet confirmed.',
      marketContext: 'Azure AI Studio agent architecture moved to GA in Q1 2026. Technology maturity improved, but multi-agent orchestration at 240-property scale is still first-of-class for hospitality. GDPR enforcement in EU hospitality has increased — 3 enforcement actions in the sector in 2025.',
      decisionGuidance: 'Approve with conditions: (1) AI model performance acceptance criteria defined before Phase 2 (not just at Phase 4); (2) GDPR Privacy Counsel written approval before Phase 1 exit; (3) 240-property rollout phased with explicit performance gates every 60 properties.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'This is an Elevated Risk engagement with flagship strategic importance. The 20% IOI commitment and $78K/month ACR potential make this a priority deal. The risk is not whether to approve, but what conditions must be in place to protect both the client outcome and the Microsoft delivery record on a first-of-class AI deployment at hospitality scale.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['Three AI agents with distinct architectures (recommendation, NLP concierge, ML prediction) require different engineering disciplines in parallel', '240 properties across 18 countries: rollout complexity is the highest in the current portfolio by geographic scope', 'Two PMS system integrations: API stability risk if PMS vendors release updates during the 12-month engagement', 'Multi-language support (5 languages): NLP quality variance across languages requires separate validation per language', 'GDPR data residency architecture must be resolved before any EU property data is used for model training'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['Chief Digital Officer as sponsor: appropriate for an AI-first digital transformation — strong executive visibility', 'Client has no prior AI agent deployment history — change management for 240 properties adopting AI-driven concierge is a significant organizational undertaking not fully scoped', 'No dedicated client change management function identified', 'Positive: 20% IOI commitment signals strong internal conviction and board-level alignment'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['34% margin is solid; IOI at 20% offset on Phase 1 reduces early-phase cash exposure', 'Azure OpenAI consumption ($78K/month) is client-owned — no infrastructure cost risk to Microsoft margin', 'Fixed fee on a 12-month AI build is moderately risky given AI model performance uncertainty — Phase 2 A/B gate mitigates but does not eliminate this', 'IOI approval memo not yet attached to SOW — commercial risk if conditions are disputed at invoicing'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Marcus Chen (AI architect, CSAT 4.6) is confirmed for Phase 1–3 — strong anchor', '240-property rollout (Phase 4) requires 3 regional deployment specialists not yet identified', 'Key-person risk: AI model training and validation is highly Marcus Chen-dependent in Phase 2–3', 'GDPR privacy officer engagement (client-side) is a critical Phase 1 dependency — if not confirmed by Month 1 Week 2, Phase 2 gate is at risk'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['GDPR applies to all EU properties (13 of 18 countries estimated)', 'Data residency architecture is designed from Day 1 — technically sound but legal approval is a hard gate', 'GDPR enforcement in hospitality has increased (3 sector enforcement actions in 2025) — regulatory environment is active', 'Non-EU property data regulations (Middle East, APAC properties) are not addressed in SOW — advisory gap'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No subcontractor — pure Microsoft PS delivery', 'Two PMS vendor API dependencies: if either vendor changes API during engagement, integration requires a Change Order', 'Azure OpenAI service: capacity and quota allocation must be confirmed before Phase 2 model training begins'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['Azure AI Studio: moved to GA in Q1 2026 — maturity improved but multi-agent orchestration at 240-property production scale has only 2 known deployments globally', 'Azure OpenAI (GPT-4o for concierge agent): GA and well-established for NLP use cases', 'Azure ML (loyalty prediction model): fully mature for tabular prediction at this scale', 'Multi-agent orchestration layer: the integration of 3 agents into a unified guest experience platform is architecturally novel — no direct comparable'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Two comparable AI platform engagements retrieved. The Datum Corp partial outcome is highly relevant — the model performance gap against a conversion target is the identical risk profile. The Fabrikam GenAI failure (regulatory block) reinforces why the GDPR gate is non-negotiable.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Marcus Chen is the only confirmed agent with comparable AI platform delivery experience. Phase 4 rollout specialists are not yet identified — this is the primary resourcing gap.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'Two active market signals affect this engagement. GDPR enforcement signal is the more material of the two.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '15%', score: 4.5, strength: 'Three-agent architecture is well-designed and decomposed. Azure ML loyalty model is the simplest component and is low-risk.', gaps: ['Multi-agent orchestration at 240-property scale has no direct comparable', '18-country rollout coordination complexity is the highest in the current portfolio'], recommendation: 'Add a 240-property rollout governance plan as a Phase 1 deliverable — wave structure, readiness checklist, regional contacts.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '20%', score: 6.0, strength: 'CDO sponsor with board alignment and 20% IOI commitment signals strong organizational conviction.', gaps: ['No change management function for 240 properties adopting AI-driven hospitality tools', 'No prior AI deployment history — organizational readiness for AI is untested'], recommendation: 'Require client to appoint a Change Management Lead for the 240-property rollout before Phase 4 begins.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '12%', score: 7.5, strength: 'IOI offset and client-owned Azure consumption costs create a well-separated commercial structure.', gaps: ['IOI approval memo not attached — conditions could be disputed', 'Fixed fee on AI model performance has inherent uncertainty risk'], recommendation: 'Attach IOI memo as Appendix A before contract execution. Add a model optimization sprint budget as a conditional Phase 5 line item.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '20%', score: 5.5, strength: 'Marcus Chen confirmed — the strongest AI architect in the practice for this type of engagement.', gaps: ['Phase 4 rollout specialists not identified (3 regional roles open)', 'Key-person risk on AI model design is high — no backup for Marcus Chen in Phase 2–3'], recommendation: 'Identify and confirm Phase 4 regional specialists before Phase 3 begins. Designate a secondary AI architect as backup for Phase 2.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '8%', score: 6.5, strength: 'GDPR data residency architecture is designed from Day 1 — technically proactive.', gaps: ['Non-EU property data regulations not addressed', 'GDPR enforcement environment in hospitality is active'], recommendation: 'Add a non-EU property regulatory advisory track to Phase 1 — client counsel to advise on Middle East and APAC requirements.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '12%', score: 9.5, strength: 'No subcontractor. Clean delivery structure.', gaps: ['PMS vendor API stability is an external dependency outside Microsoft control'], recommendation: 'Include API version pinning in both PMS vendor contracts before Phase 2 integration work begins.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '13%', score: 5.0, strength: 'Azure OpenAI and Azure ML are fully mature for the use cases applied.', gaps: ['Multi-agent orchestration at production hospitality scale: <2 comparable deployments', 'Azure AI Studio moved to GA recently — enterprise-scale patterns still emerging'], recommendation: 'Commission a 2-day architecture validation session with Microsoft AI engineering team before Phase 1 architecture blueprint is finalized.' },
    ],
    referenceProjects: [
      { name: 'VanArsdel Copilot & AI Platform', industry: 'Retail', year: 2025, outcome: 'success', relevance: 'High', lesson: 'CSAT 4.7. Recommendation agent deployed across 180 retail locations. Key success factor: A/B testing framework validated performance before full rollout. Model exceeded conversion target by 12%.' },
      { name: 'Datum Corp AI Innovation Platform', industry: 'Technology', year: 2024, outcome: 'partial', relevance: 'High', lesson: 'AI model underperformed conversion target by 8% at go-live. Required 6-week optimization sprint. Root cause: insufficient historical training data quality. Mitigation here: validate 24-month data quality in Phase 1 before training begins.' },
      { name: 'Fabrikam GenAI Customer Service', industry: 'Insurance', year: 2024, outcome: 'failed', relevance: 'Medium', lesson: 'Regulatory approval for AI-generated customer responses was blocked by the financial regulator at go-live. Engagement terminated. Reinforces why GDPR Privacy Counsel approval is a hard gate — not a checkbox.' },
    ],
    agentMatches: [
      { name: 'Marcus Chen', role: 'Azure AI Studio Lead', credits: [{ project: 'VanArsdel Copilot & AI Platform', csat: 4.6 }, { project: 'Datum Corp AI Innovation Platform', csat: 3.9 }], industries: ['Retail', 'Technology'], availability: 'Confirmed available Month 1', regions: ['Americas', 'APAC'] },
    ],
    marketSignals: [
      { feed: 'GDPR Enforcement Monitor', alert: 'Three GDPR enforcement actions against EU hospitality companies in 2025 related to AI-personalization and guest data processing. Supervisory authorities are specifically scrutinizing hotel AI use cases.', severity: 'warning', date: 'Apr 2026', dimension: 'Regulatory Compliance' },
      { feed: 'Azure AI Studio Maturity Signal', alert: 'Azure AI Studio multi-agent orchestration moved to GA in Q1 2026. Enterprise-scale deployment patterns are still being established — Microsoft AI engineering team can provide architecture validation for large-scale deployments.', severity: 'info', date: 'Mar 2026', dimension: 'Technology Maturity' },
    ],
    alignmentFlags: [
      { label: 'AI Performance Risk → Commercial Structure', status: 'warning', detail: 'Fixed fee on AI model performance has no optimization sprint contingency budget defined in commercial terms.' },
      { label: 'IOI → Commercial Terms', status: 'warning', detail: 'IOI approval memo is not attached as an exhibit to the SOW or deal file.' },
      { label: 'GDPR Gate → Timeline', status: 'ok' },
      { label: 'Phase 4 Resourcing → Execution Risk', status: 'warning', detail: '3 regional rollout specialists not yet identified for the 240-property Phase 4 deployment.' },
    ],
  },

  // ─── 4. ALPINE INSURANCE GROUP ───────────────────────────────────────────
  'Alpine Insurance Group': {
    compositeScore: 7.5,
    executiveBrief: {
      riskTier: 'Managed Risk',
      headlineRisk: 'The Solvency II analytics pack is the only material risk item — custom ruleset development was required in one comparable engagement and added 3 weeks to the timeline. Pre-engagement ruleset confirmation with client Risk & Compliance is essential.',
      precedentSignal: '91% delivery success rate on 6 comparable security engagements. Fabrikam Insurance Zero Trust is directly comparable — same Solvency II context. Partial outcome driven by scope expansion, not execution failure.',
      deliveryConfidence: 'Priya Nakamura confirmed (CSAT 4.4, Proseware and City Power). Best available match for this engagement type and regulatory context. Full team structure is clean — no subcontractor, no resourcing gaps.',
      marketContext: 'Solvency II compliance enforcement has increased across EMEA. EIOPA issued updated cloud resilience guidance in Q1 2026 that may affect the Sentinel analytics pack requirements. Review before Phase 3 scope is finalized.',
      decisionGuidance: 'Approve with one condition: Solvency II analytics ruleset confirmed with client Risk & Compliance team before Phase 2 begins. This is a standard gate activity, not a deal risk.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Alpine Insurance is a clean, well-structured deal with the highest margin in the current security portfolio (38%). The risk profile is Managed Risk — no blocking issues, one conditional item (Solvency II ruleset confirmation). The delivery team is confirmed and the technology stack is fully mature.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['3,200-seat Zero Trust deployment across three phases is well within the established playbook for this service line', 'Solvency II analytics pack is the only component requiring custom configuration — all other components are template-based', 'Identity governance (PIM) for an insurance firm with regulatory reporting requirements adds a validation step not present in non-regulated ZT engagements', 'No data migration, no multi-country scope, no AI components — complexity ceiling is medium'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['CISO as primary sponsor with CRO co-sponsoring: dual-sponsor structure is appropriate for a compliance-driven security engagement', 'Client IT team: 1 FTE identity administrator committed — adequate for Phase 1 Entra ID transition', 'Solvency II compliance mandate creates strong organizational alignment — no internal resistance to the program expected', 'Decision velocity: insurance sector typically has slower approval cycles — the 3-business-day change order window may need adjustment'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['38% margin is excellent — the highest in the security line for this engagement type', 'No ECIF, no vendor, no travel billing — simplest commercial structure possible', 'Solvency II analytics customization risk: if custom development exceeds the standard pack, a Change Order is the correct mechanism — defined in SOW'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['6 comparable security engagements with 91% delivery success rate — strongest track record by volume in the current portfolio', 'Priya Nakamura confirmed — has Solvency II context from the Fabrikam Insurance engagement', 'Full team is Microsoft PS only — no coordination overhead', 'Solvency II specialist confirmed on the MS team for Phase 3 regulatory analytics work'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['Solvency II applies to all insurance firms operating in the EU — Alpine is a primary regulated entity', 'GDPR data access controls are within scope (identity governance for personal data access)', 'EIOPA issued updated cloud resilience guidance in Q1 2026 — may affect Sentinel analytics pack requirements in Phase 3', 'Regulatory risk is medium (not high) because we have a Solvency II delivery precedent (Fabrikam Insurance)'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No subcontractor — lowest possible partner risk', 'All platform components are Microsoft-native'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['Entra ID P2, Intune, Defender for Endpoint, Sentinel: all fully GA and production-proven', 'Solvency II analytics pack: available as a standard pack but custom rule development may be required depending on client\'s specific reporting obligations', 'No preview features in scope'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Six comparable security engagements retrieved. Fabrikam Insurance Zero Trust is the most directly applicable — same Solvency II context with a partial outcome driven by scope expansion, not execution failure.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Priya Nakamura is confirmed with directly applicable Solvency II insurance delivery experience. Strongest single-agent match in the current portfolio for this deal type.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One active regulatory signal. EIOPA updated cloud resilience guidance may affect Phase 3 Sentinel analytics scope.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 7.0, strength: 'Template-based delivery for all components except Solvency II analytics. Three-phase structure is clean and well-sequenced.', gaps: ['Solvency II ruleset customization scope is unconfirmed — could add 3+ weeks to Phase 3'], recommendation: 'Confirm Solvency II ruleset with client Risk & Compliance before Phase 2 exit. Lock custom vs. standard ruleset decision as a Phase 2 gate.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 8.0, strength: 'Dual-sponsor structure (CISO + CRO) is ideal for a compliance-driven security program.', gaps: ['Insurance sector decision velocity tends to be slower than tech sector — 3-business-day change order window may be insufficient'], recommendation: 'Adjust change order response window to 5 business days to account for insurance-sector governance cycles.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 9.5, strength: '38% margin with no vendor and no ECIF is the cleanest commercial position in the portfolio.', gaps: [], recommendation: 'No action required.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 8.5, strength: 'Priya Nakamura confirmed with Solvency II insurance context. 91% delivery success rate on 6 comparable engagements.', gaps: ['Solvency II specialist must be confirmed for Phase 3 — currently named in deal but not yet formally committed'], recommendation: 'Obtain written Solvency II specialist commitment before contract execution.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '15%', score: 6.0, strength: 'Solvency II delivery precedent from Fabrikam Insurance engagement provides a ruleset and methodology reference.', gaps: ['EIOPA Q1 2026 cloud guidance update may add requirements to Sentinel analytics scope', 'GDPR identity data handling during Entra ID migration is not explicitly risk-assessed'], recommendation: 'Review EIOPA Q1 2026 guidance against Phase 3 Sentinel analytics scope before Phase 2 ends.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 9.5, strength: 'No partners. No external technology dependencies.', gaps: [], recommendation: 'No action required.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 8.5, strength: 'Fully GA stack. Solvency II analytics pack is available as a standard product.', gaps: ['Custom Solvency II rules (if required) have limited field precedent beyond the Fabrikam engagement'], recommendation: 'Use Fabrikam Solvency II ruleset as the starting baseline and document deviations — do not start from scratch.' },
    ],
    referenceProjects: [
      { name: 'Fabrikam Insurance Zero Trust', industry: 'Insurance', year: 2023, outcome: 'partial', relevance: 'High', lesson: 'Solvency II analytics scope expanded mid-Phase 3 when the client Risk & Compliance team introduced additional reporting obligations not known at contract signature. Added 3 weeks and a Change Order. Prevention: confirm full Solvency II obligation list before Phase 2.' },
      { name: 'Proseware SOC Modernization', industry: 'Financial Services', year: 2025, outcome: 'success', relevance: 'High', lesson: 'CSAT 4.6. Priya Nakamura led delivery. Sentinel analytics pack deployed on schedule when data connectors were pre-qualified in Phase 1. Template for this engagement.' },
      { name: 'City Power & Light SOC Modernization', industry: 'Energy', year: 2024, outcome: 'success', relevance: 'Medium', lesson: 'Regulated-industry delivery with strong compliance reporting requirements. Success attributed to monthly compliance review cadence with client legal team — recommend same cadence here for Solvency II track.' },
    ],
    agentMatches: [
      { name: 'Priya Nakamura', role: 'Zero Trust & Compliance Architect', credits: [{ project: 'Proseware SOC Modernization', csat: 4.4 }, { project: 'Fabrikam Insurance Zero Trust', csat: 4.0 }], industries: ['Financial Services', 'Insurance', 'Energy'], availability: 'Confirmed available Month 1', regions: ['Americas', 'EMEA'] },
    ],
    marketSignals: [
      { feed: 'EIOPA Regulatory Monitor', alert: 'EIOPA issued updated cloud resilience guidance in Q1 2026 affecting Solvency II reporting for cloud-hosted systems. Sentinel analytics pack Solvency II ruleset may require review against new requirements before Phase 3.', severity: 'warning', date: 'Mar 2026', dimension: 'Regulatory Compliance' },
    ],
    alignmentFlags: [
      { label: 'Solvency II Ruleset → Confirmed Pre-Phase 3', status: 'warning', detail: 'Solvency II ruleset must be confirmed with client Risk & Compliance before Phase 2 exit — not yet scheduled.' },
      { label: 'Delivery Success Rate vs. Precedent', status: 'ok' },
      { label: 'EIOPA Signal → Phase 3 Scope', status: 'warning', detail: 'EIOPA Q1 2026 cloud guidance update may affect Sentinel analytics scope — review required before Phase 2 ends.' },
      { label: 'Commercial Structure → Margin', status: 'ok' },
    ],
  },

  // ─── 5. CONTOSO FINANCIAL GROUP ──────────────────────────────────────────
  'Contoso Financial Group': {
    compositeScore: 5.0,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'FFIEC compliance review dependency is the single highest-risk item — if the client Risk team\'s audit is not complete before Month 3, Phase 2 cannot start and a full timeline revision is triggered. 26% margin provides limited buffer for regulatory complexity overruns.',
      precedentSignal: '83% delivery success rate on 4 comparable bank migrations. Wingtip Toys Cloud Native Modernization is the closest precedent — successful, but FFIEC compliance review caused a 5-week Phase 2 delay. Same risk is present and active here.',
      deliveryConfidence: 'James Holwerda is available and has comparable migration experience. FFIEC-specific banking compliance delivery lead is not yet confirmed — this is the critical resourcing gap given the regulatory complexity.',
      marketContext: 'OCC issued new guidance on cloud migration in regulated banking in Q4 2025. The guidance specifically addresses FFIEC Landing Zone configuration standards — review required before Phase 1 design is finalized. May add scope to the FFIEC compliance map deliverable.',
      decisionGuidance: 'Approve with conditions: (1) client Risk team FFIEC audit timeline confirmed and booked by Month 1; (2) FFIEC-specific banking compliance delivery lead named before contract execution; (3) margin floor review with Finance if FFIEC complications require additional effort.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Elevated Risk. The FFIEC regulatory overlay is the defining risk factor. The engagement is commercially viable and strategically important ($96K/month ACR). However, the 26% margin for a high-complexity regulated banking migration with Eviden participation leaves minimal buffer. FFIEC compliance review timing is the controlling dependency for the entire Phase 2 schedule.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['40 core banking workloads: volume is moderate, but banking workload sensitivity (transaction processing, core ledger systems) means each migration requires higher validation rigor than standard enterprise workloads', 'FFIEC-compliant Landing Zone: configuration standards are more prescriptive than standard Azure LZ — additional security controls, audit logging, and network segmentation requirements', 'Eviden migration factory (15%): adds coordination overhead and a quality gate at each wave handoff', 'Zero Trust overlay (Phase 3): adds a concurrent workstream in the final 4 months when migration is completing'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['Bank IT VP as sponsor: appropriate level for a Phase 1 migration; may need elevation to CTO level if FFIEC complications require executive decisions', 'Client Risk team dependency: their FFIEC audit timeline is the controlling variable for Phase 2 start — this is a client readiness risk that MS cannot mitigate directly', 'Core banking cutover windows: agreement with Bank Operations team is deferred to Phase 2 — this should be initiated in Month 1', 'New logo: no prior CRM delivery history — decision velocity and client collaboration patterns are unknown'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['26% margin: tight for a high-complexity regulated engagement with vendor participation — Finance flagged correctly', 'Eviden is included in total contract value — Microsoft absorbs Eviden delivery risk at this margin level', 'ECIF (5%) offsets Phase 1 foundation work — reduces early-phase cash exposure but does not address margin floor risk', 'Phase 2 SOW pricing is not guaranteed at Phase 1 rates — but the Phase 2 contract will be negotiated with knowledge of Phase 1 actuals, which should be used to improve margin'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['James Holwerda available: strong migration lead with Azure LZ experience, but no FFIEC-specific banking regulatory experience on record', 'FFIEC-specific banking compliance delivery lead: not yet identified — critical gap given the regulatory overlay', 'Eviden: 15% of migration execution — resource commitment not yet confirmed for this engagement', 'Core banking cutover expertise: specialized skillset required for bank migration cutover windows — confirm availability before Phase 2 begins'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['FFIEC and OCC: dual regulatory framework for US commercial banks — prescriptive configuration standards and audit trail requirements', 'OCC Q4 2025 cloud migration guidance: new guidance affects FFIEC Landing Zone configuration standards — scope impact not yet assessed', 'Client Risk team audit: the entire Phase 2 schedule is dependent on client Risk team completing their FFIEC compliance review — MS cannot accelerate this', 'Compliance_risk is rated "high" in the deal profile — correctly reflects the regulatory burden'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['Eviden at 15% of effort: within managed risk threshold for a migration partner', 'Eviden\'s FFIEC-aware configuration requirement: must be explicit in the subcontract — not yet confirmed', 'No other third-party dependencies'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['Azure Migrate and ASR: fully mature for banking workload Lift-Shift', 'FFIEC-compliant Landing Zone: established configuration standards exist, but OCC Q4 2025 guidance may require updates to standard templates', 'ExpressRoute + hybrid DNS: fully GA and production-proven in banking contexts', 'Zero Trust overlay components (Entra ID, Defender): fully GA'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Four comparable bank cloud migrations retrieved. The Wingtip Toys partial outcome is the most relevant — FFIEC compliance delay caused a 5-week Phase 2 postponement, directly mirroring the risk present in this deal.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'James Holwerda is the available migration lead. A FFIEC-specific banking compliance specialist is the critical gap — no confirmed agent with FFIEC delivery experience is currently identified as available for this engagement start date.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One active regulatory signal from OCC. Review against Phase 1 Landing Zone design before finalizing the FFIEC Compliance Map deliverable.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 4.5, strength: '40-workload scope is moderate in volume. Azure migration tooling is fully mature for this workload type.', gaps: ['Banking workload sensitivity requires higher validation rigor per workload than standard enterprise migration', 'Concurrent Phase 3 Zero Trust overlay creates a parallel workstream in the delivery\'s most complex period'], recommendation: 'Phase 3 Zero Trust overlay should have its own work plan and PM allocation — do not treat it as a Phase 2 continuation.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 5.5, strength: 'Bank IT VP sponsor has organizational authority to drive compliance review through the client Risk team.', gaps: ['Client Risk team FFIEC audit timeline is unbooked — the controlling Phase 2 dependency is unscheduled', 'Core banking cutover window agreements deferred to Phase 2 — should begin in Month 1'], recommendation: 'Request client to book FFIEC audit with their Risk team within Week 2 of kickoff. Establish a governance touchpoint with Bank Operations in Month 1.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 5.5, strength: 'ECIF offset on Phase 1 and Eviden absorbed in total provides structural protection on the most certain phase.', gaps: ['26% margin at high complexity with regulatory overlay and vendor participation is the tightest in the portfolio', 'No margin contingency defined for FFIEC compliance complications'], recommendation: 'Finance to confirm margin floor. If FFIEC review reveals additional compliance controls, a Change Order must be issued before work begins.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 6.5, strength: 'James Holwerda available as migration lead. 83% delivery success rate on 4 comparable bank migrations is above threshold.', gaps: ['FFIEC banking compliance delivery lead not identified — critical gap', 'Eviden resource commitment outstanding'], recommendation: 'FFIEC banking compliance lead identification is a contract execution gate. If no internal resource is available, consider engaging a FFIEC-experienced associate.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '15%', score: 4.5, strength: 'FFIEC and OCC requirements are well-understood at a framework level — no novel regulatory territory.', gaps: ['OCC Q4 2025 cloud guidance update may affect Landing Zone scope', 'Client Risk team FFIEC audit is unscheduled — this is the highest-risk dependency in the deal'], recommendation: 'Review OCC Q4 2025 guidance against Phase 1 Landing Zone design before kickoff. Add FFIEC audit scheduling as a Month 1 action item.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 7.0, strength: 'Eviden at 15% is within managed risk threshold. Microsoft absorbs commercial risk.', gaps: ['Eviden FFIEC-aware configuration obligation not yet confirmed in subcontract'], recommendation: 'Confirm Eviden subcontract explicitly includes FFIEC-compliant configuration standards before Phase 2 kickoff.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 7.5, strength: 'All migration platform components are fully GA. FFIEC LZ configuration standards are established.', gaps: ['OCC Q4 2025 guidance may require updates to standard FFIEC LZ templates'], recommendation: 'Validate FFIEC LZ template against OCC Q4 2025 guidance before Phase 1 design is completed.' },
    ],
    referenceProjects: [
      { name: 'Adatum Cloud Foundation', industry: 'Professional Services', year: 2024, outcome: 'success', relevance: 'Medium', lesson: 'Azure LZ and migration factory succeeded on schedule. No regulatory overlay in this engagement — less comparable than Wingtip but provides migration velocity benchmark.' },
      { name: 'Wingtip Toys Cloud Native', industry: 'Banking', year: 2023, outcome: 'partial', relevance: 'High', lesson: 'FFIEC compliance review completed 5 weeks after Phase 2 was scheduled to begin. Client Risk team had not allocated capacity for the audit. Phase 2 delayed accordingly. Prevention: book client Risk team FFIEC audit date in Month 1.' },
      { name: 'Lamna Healthcare Azure & Security', industry: 'Healthcare', year: 2024, outcome: 'success', relevance: 'Medium', lesson: 'Regulated industry migration with HIPAA compliance overlay. Success attributed to parallel compliance and delivery workstreams — HIPAA review ran concurrently with Phase 1, not as a blocker. Same approach applicable here.' },
    ],
    agentMatches: [
      { name: 'James Holwerda', role: 'Azure Migration Lead', credits: [{ project: 'Adatum Cloud Foundation', csat: 4.3 }, { project: 'Bellows College Azure Campus', csat: 4.5 }], industries: ['Retail', 'Education'], availability: 'Confirmed available Month 1', regions: ['Americas'] },
    ],
    marketSignals: [
      { feed: 'OCC Regulatory Monitor', alert: 'OCC issued new cloud migration guidance for US commercial banks in Q4 2025. Guidance specifies updated FFIEC Landing Zone configuration standards for network segmentation and audit logging. Review against Phase 1 LZ design template before kickoff.', severity: 'warning', date: 'Jan 2026', dimension: 'Regulatory Compliance' },
    ],
    alignmentFlags: [
      { label: 'FFIEC Audit → Timeline Gate', status: 'warning', detail: 'Client Risk team FFIEC audit is unscheduled. Phase 2 cannot start without it — the controlling dependency has no booked date.' },
      { label: 'FFIEC Lead → Resourcing', status: 'warning', detail: 'FFIEC-specific banking compliance delivery lead not yet identified. Critical gap for a regulated banking engagement.' },
      { label: 'OCC Q4 2025 Guidance → LZ Scope', status: 'warning', detail: 'OCC updated cloud guidance may affect Phase 1 Landing Zone scope — not yet reviewed against current design.' },
      { label: 'Eviden Subcontract → FFIEC Obligations', status: 'warning', detail: 'Eviden FFIEC-compliant configuration obligation not yet confirmed in the subcontract.' },
    ],
  },

  // ─── 6. NORTHWIND TRADERS ────────────────────────────────────────────────
  'Northwind Traders': {
    compositeScore: 5.5,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'SAP data quality is the defining risk — the Southridge D365 F&O Transformation partial outcome was driven by 8-week migration delays from undisclosed SAP data quality issues. The same risk is present and unverified here.',
      precedentSignal: '86% delivery success rate on 5 comparable D365 F&O engagements. Southridge D365 partial (data migration +8 weeks) is the most relevant precedent. No failures in the D365 service line.',
      deliveryConfidence: 'Elena Vasquez (D365 F&O specialist, CSAT 4.2 on Southridge) is available and has direct SAP-to-D365 migration experience. Southridge D365 delivery lead is engaged as SME advisor per AI conditions — strong delivery confidence signal.',
      marketContext: 'D365 F&O platform is stable and fully mature. No active platform signals. SAP ECC sunset deadline (2027) is creating sustained D365 migration demand — team capacity may be under pressure from competing pipeline.',
      decisionGuidance: 'Approve with two conditions: (1) client SAP team provides data migration scope confirmation and data quality assessment before Phase 1 ends; (2) all 4 integration endpoint APIs validated in Month 2 before Phase 2 commitment.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Elevated Risk. The D365 F&O service line is high-confidence, but SAP-to-D365 migrations carry specific data quality risk that has caused overruns in comparable engagements. The engagement should proceed — the strategic rationale and delivery confidence are both strong — with hard gates on SAP data quality and integration validation before Phase 2.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['SAP ECC replacement: full ERP migration across 3 modules (Finance, SCM, WMS) is inherently complex — module interdependencies create cascading risk if one module is delayed', 'Four external system integrations: each integration is a potential delay if APIs are not as documented', 'Data migration from SAP: volume and quality are the highest-risk unknowns — SAP data is notoriously complex due to years of customization and schema divergence', '250-user training: significant change management burden, especially for users who have been on SAP for many years', '18-month timeline: appropriate for this scope, but Phase 3 (data migration + UAT + go-live) is compressed into 6 months'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['CFO + COO as co-sponsors: appropriate for an ERP transformation with Finance and Operations scope — strong financial and operational authority', 'Client D365 implementation lead (1 FTE) and Finance SME (0.5 FTE): committed, but may be insufficient during peak Phase 3 UAT with 250 users', 'SAP team: their cooperation on data migration scope and quality assessment is the single most important client readiness factor — cooperation is assumed but not confirmed', 'Change management: 250-user retraining from SAP to D365 requires a dedicated client change management function — not yet mentioned'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['32% margin is healthy for a high-complexity ERP engagement with no vendor dilution', 'Fixed fee per phase: appropriate for well-defined phases — Phase 3 (data migration) carries overrun risk if SAP data quality requires remediation beyond estimate', 'No ECIF: straightforward billing structure'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Elena Vasquez confirmed (CSAT 4.2, Southridge D365 F&O): the most directly comparable delivery credit in the practice', 'Southridge D365 delivery lead as SME advisor: excellent risk mitigation — using the person who has done this exact program type most recently', 'SAP data migration specialist: not yet named — critical for Phase 3 execution', '5 comparable D365 F&O engagements with 86% success rate: strong delivery track record'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['No regulatory requirements — lowest-risk dimension in this deal', 'SAP decommission is advisory only — no compliance obligations on decommission execution'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No subcontractor', 'No third-party platform dependencies beyond D365 and the 4 named integration endpoints', 'Integration endpoints: each is a third-party dependency — API stability and documentation accuracy are outside Microsoft control'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['D365 Finance & Operations: fully GA, mature, and well-supported — one of the most stable platforms in the Microsoft portfolio', 'Power BI dashboards: fully GA and well-understood', 'SAP ECC data extraction tooling: mature but highly variable in outcome depending on SAP customization depth', 'All components are under active Microsoft support for the 18-month engagement duration'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Five comparable D365 F&O engagements retrieved. No failures in this service line. The Southridge partial outcome (SAP data migration +8 weeks) is directly applicable and should be treated as the base case for risk planning.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Elena Vasquez confirmed with direct Southridge D365 F&O comparable experience. SAP data migration specialist role is the open gap.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One capacity signal. SAP ECC sunset pressure is driving D365 migration demand — team resource competition from pipeline.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 5.0, strength: 'D365 F&O platform is fully mature. Finance, SCM, and WMS modules are well-established delivery playbooks.', gaps: ['SAP data quality and migration scope are the highest unknowns — estimated at time of contract but not validated', '4 integration endpoint APIs assumed as documented — validation deferred to Month 2'], recommendation: 'Add a data quality assessment deliverable to Phase 1 with a pass/fail gate before Phase 2 commitment.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 6.0, strength: 'CFO + COO co-sponsorship creates strong financial and operational alignment for an ERP transformation.', gaps: ['SAP team cooperation on data migration scope is assumed but not contracted — this is the most important client readiness dependency', '250-user training requires dedicated client change management — not mentioned'], recommendation: 'Require client to designate an SAP migration liaison and a Change Management Lead before Phase 1 ends.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 8.0, strength: '32% margin with no vendor and clean fixed-fee structure. Phase-based billing aligns payment to milestone acceptance.', gaps: ['Phase 3 data migration fixed fee carries SAP data quality overrun risk with no contingency defined'], recommendation: 'Add a data quality remediation Change Order trigger: if remediation exceeds 40 person-hours, a Change Order is issued before additional effort is incurred.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 7.5, strength: 'Elena Vasquez confirmed with Southridge precedent. Southridge SME advisor engaged — strongest knowledge transfer mechanism available.', gaps: ['SAP data migration specialist not yet named for Phase 3', 'Integration endpoint specialist availability for 4 concurrent integrations in Phase 2 not confirmed'], recommendation: 'Name SAP data migration specialist before contract execution. Confirm integration engineer availability for all 4 Phase 2 integrations.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 9.5, strength: 'No regulatory requirements. Lowest-risk dimension.', gaps: [], recommendation: 'No action required.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 9.5, strength: 'No subcontractor. Only third-party dependencies are the 4 integration endpoints.', gaps: ['Integration API documentation accuracy is assumed — not yet validated'], recommendation: 'Integration pre-qualification in Month 2 is the appropriate risk mitigation — already in SOW assumptions.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 7.5, strength: 'D365 F&O is one of the most stable and mature Microsoft platforms. No technology maturity risk.', gaps: ['SAP data extraction tooling outcome varies heavily by SAP customization depth — not assessable without seeing the SAP instance'], recommendation: 'Include an SAP customization assessment in the Phase 1 data quality gate before extraction tooling is selected.' },
    ],
    referenceProjects: [
      { name: 'Southridge D365 F&O Transformation', industry: 'Distribution', year: 2023, outcome: 'partial', relevance: 'High', lesson: 'SAP data migration ran 8 weeks over plan due to undisclosed data quality issues discovered after extraction began. Client SAP team had not disclosed 4 years of customization not in the migration scope. Prevention: require SAP customization inventory from client before Phase 1 ends.' },
      { name: 'Trey Research D365 Sales & CS', industry: 'Professional Services', year: 2024, outcome: 'success', relevance: 'High', lesson: 'CSAT 4.5. No SAP migration involved. Integration pre-qualification in Month 1 prevented all 3 integration delays experienced in comparable programs. Endorses the Month 2 integration gate approach.' },
      { name: 'Woodgrove Bank D365 Finance', industry: 'Banking', year: 2025, outcome: 'success', relevance: 'Medium', lesson: 'Finance module only (no SCM, no WMS). Data migration from Oracle was clean because a data quality assessment was conducted in pre-engagement scoping. Confirms the value of the Phase 1 data quality gate.' },
    ],
    agentMatches: [
      { name: 'Elena Vasquez', role: 'D365 F&O Delivery Lead', credits: [{ project: 'Southridge D365 F&O Transformation', csat: 4.2 }, { project: 'Trey Research D365 Sales & CS', csat: 4.0 }], industries: ['Distribution', 'Professional Services'], availability: 'Confirmed available Month 1', regions: ['Americas', 'EMEA'] },
    ],
    marketSignals: [
      { feed: 'D365 Practice Capacity Index', alert: 'SAP ECC sunset deadline (2027) is driving a surge in D365 F&O migration demand. D365 delivery team capacity is under pressure from 4 competing programs in the pipeline. Elena Vasquez is confirmed for this engagement but additional D365 specialists may face availability constraints.', severity: 'warning', date: 'May 2026', dimension: 'Execution & Resourcing' },
    ],
    alignmentFlags: [
      { label: 'SAP Data Quality → Phase 1 Gate', status: 'warning', detail: 'SAP data quality assessment is an assumption in the SOW but is not a named deliverable with a pass/fail gate criterion.' },
      { label: 'Integration Validation → Month 2 Milestone', status: 'warning', detail: 'Integration endpoint pre-qualification is in SOW assumptions but not on the milestone timeline.' },
      { label: 'D365 Delivery Success Rate vs. Precedent', status: 'ok' },
      { label: 'SAP Migration Specialist → Resourcing', status: 'warning', detail: 'SAP data migration specialist not yet named for Phase 3 — critical role for the highest-risk delivery component.' },
    ],
  },

  // ─── 7. NORTHWIND HEALTHCARE SYSTEM ──────────────────────────────────────
  'Northwind Healthcare System': {
    compositeScore: 5.0,
    executiveBrief: {
      riskTier: 'Elevated Risk',
      headlineRisk: 'APAC multi-country healthcare regulatory variance is the primary risk — each of the 8 hospitals may face in-country regulatory requirements beyond HIPAA/HITECH that are not yet assessed and could delay PHI classification scope or Entra ID rollout.',
      precedentSignal: '89% delivery success rate on 3 comparable healthcare security engagements. Lamna Healthcare Azure & Security Foundation (CSAT 4.2) is the strongest precedent — Sarah Mitchell led delivery and is recommended as lead for this engagement.',
      deliveryConfidence: 'Sarah Mitchell confirmed available and is the recommended delivery lead (named in AI conditions). Strong healthcare compliance delivery record. APAC in-country regulatory expertise is not confirmed — this is the gap.',
      marketContext: 'APAC healthcare data sovereignty regulation is in active evolution — Australia, Singapore, and Japan all issued new health data guidelines in 2025–2026. Review against hospital locations before Phase 1 assessment begins.',
      decisionGuidance: 'Approve with conditions: (1) BAA countersigned before any PHI access (mandatory, non-negotiable); (2) APAC in-country legal counsel engaged per hospital before Phase 2; (3) Sarah Mitchell named as delivery lead.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'Elevated Risk. The HIPAA/HITECH service line is well-established with strong delivery confidence. The risk is geographic — 8 hospitals across APAC introduces in-country regulatory variance that HIPAA alone does not address. The BAA is the absolute pre-condition; APAC legal counsel engagement is the parallel condition that must not be deferred.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['8 hospitals across APAC: not a single-entity deployment — each hospital has its own IT infrastructure, clinical systems, and potentially separate Entra ID tenant configurations', 'PHI classification (Purview): scope is dependent on the Phase 1 data store inventory — if inventory reveals more PHI stores than estimated, Phase 2 scope expands', 'Clinical workforce identity governance: clinical systems (EMR/EHR) have strict uptime requirements — Entra ID migration must be staged to avoid clinical disruption', 'Cross-hospital tenant compatibility: assumed to be connectable but not yet verified (as noted in SOW assumptions)'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['CISO + Privacy Officer as co-sponsors: ideal governance structure for a HIPAA compliance engagement', 'Client Privacy Officer to co-own PHI classification: critical partnership for Phase 2 — strong readiness signal', 'APAC in-country legal counsel: each hospital\'s local counsel is the client\'s responsibility, but engagement timing and coordination is a client readiness variable that MS depends on', 'Clinical staff cooperation: Entra ID changes during active clinical operations require careful communication — hospital by hospital'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['31% margin is solid for a healthcare compliance engagement', '8% co-investment on Phase 1 and Phase 3 foundation work signals Microsoft\'s commitment to the healthcare vertical', 'PHI inventory scope risk: if Phase 1 discovers significantly more PHI data stores than estimated, Phase 2 scope and cost expands via Change Order — mechanism is defined'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Sarah Mitchell recommended as delivery lead (Lamna Healthcare PM — named in AI conditions): strongest available match, directly comparable HIPAA delivery experience', 'APAC delivery presence: Sarah Mitchell is based in Americas — APAC hospital visits may require local resource support for Phases 2 and 3', 'Clinical workflow expertise: Entra ID integration with clinical EMR/EHR systems requires clinical IT expertise not yet confirmed on the team', '89% delivery success rate on 3 comparable healthcare engagements: solid but smaller comparable base than security line'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['HIPAA/HITECH: well-understood regulatory framework with established delivery methodology', 'APAC in-country regulations: Australia (My Health Records Act), Singapore (PDPA healthcare provisions), Japan (Act on Protection of Personal Information) — all may apply depending on hospital locations', 'BAA is in place: the legal framework for PHI access is established — BAA countersign before access is a standard HIPAA control', 'HITECH breach notification: advisory scope only — but Purview audit trail must support the client\'s HITECH obligations'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['No subcontractor — pure Microsoft PS delivery', 'Clinical system integration: PHI classification requires read access to EMR/EHR systems — third-party clinical system APIs are a dependency outside Microsoft control'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['Microsoft Purview for healthcare PHI classification: GA and production-proven in comparable HIPAA engagements', 'Sentinel with HIPAA analytics ruleset: GA and established — HIPAA ruleset is a standard pack with 3+ comparable deployments', 'Entra ID clinical workforce governance: GA, but integration with clinical-specific systems (Epic, Cerner) adds per-hospital variability'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Three comparable healthcare compliance and security engagements retrieved. Lamna Healthcare is the strongest comparable — same technology stack, US-based HIPAA context. The APAC regulatory dimension is novel — no comparable multi-country APAC healthcare deployment in the delivery history.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Sarah Mitchell is the recommended and available delivery lead. APAC regional delivery support is not yet identified.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'One APAC regulatory signal. Australia, Singapore, and Japan have all issued updated health data guidelines in 2025–2026.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 4.5, strength: 'HIPAA/HITECH service line is well-established. Purview and Sentinel components are fully playbook-based.', gaps: ['8-hospital APAC scope introduces per-hospital variability in tenant configuration, clinical systems, and regulatory obligations', 'PHI inventory scope is unknown until Phase 1 assessment — Phase 2 scope may expand'], recommendation: 'Phase 1 assessment must include a cross-hospital tenant compatibility pre-check before Entra ID scope is committed.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 6.5, strength: 'CISO + Privacy Officer co-sponsorship with Privacy Officer owning PHI classification is ideal for HIPAA compliance work.', gaps: ['APAC in-country legal counsel engagement timing and coordination is client-owned but critical to MS delivery timeline', 'Clinical staff communication plan for Entra ID migration changes is not yet developed'], recommendation: 'Require client to provide APAC in-country legal counsel contact per hospital in Month 1 Week 1.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 7.5, strength: '31% margin with 8% co-investment is solid for healthcare compliance. PHI inventory risk is covered by Change Order mechanism.', gaps: ['Co-investment approval memo not attached — conditions could be disputed at invoicing'], recommendation: 'Attach co-investment approval memo before contract execution.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 7.0, strength: 'Sarah Mitchell is the strongest available healthcare delivery lead with direct Lamna comparable experience.', gaps: ['APAC local delivery support not confirmed for Phases 2–3 hospital visits', 'Clinical EMR/EHR integration expertise not confirmed on team'], recommendation: 'Identify APAC local delivery support resource before Phase 2. Confirm clinical systems integration expertise before Phase 3.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '15%', score: 4.0, strength: 'HIPAA/HITECH methodology is well-established. BAA is in place.', gaps: ['APAC in-country regulations (Australia, Singapore, Japan) are not assessed — scope unknown', 'APAC regulatory evolution is active — 3 countries issued new health data guidelines in 2025–2026'], recommendation: 'Commission an APAC regulatory mapping in Phase 1 Week 1 (client counsel-led, MS advisory support). Block Phase 2 until mapping is complete.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 9.5, strength: 'No subcontractor. Lowest possible partner risk.', gaps: ['EMR/EHR system API access is a clinical system third-party dependency per hospital'], recommendation: 'Confirm EMR/EHR system API access plan per hospital in Phase 1 assessment.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 8.0, strength: 'Purview, Sentinel (HIPAA pack), and Entra ID are all fully GA and HIPAA-deployment proven.', gaps: ['Entra ID integration with clinical-specific systems (Epic, Cerner) varies by hospital — not fully predictable'], recommendation: 'Include clinical system Entra ID compatibility check in Phase 1 assessment per hospital.' },
    ],
    referenceProjects: [
      { name: 'Lamna Healthcare Azure & Security Foundation', industry: 'Healthcare', year: 2024, outcome: 'success', relevance: 'High', lesson: 'CSAT 4.2. Sarah Mitchell led delivery. HIPAA compliance posture improved to 94% within 9 months. BAA countersigning was completed Day 1 — no access delays. PHI inventory took 3 weeks longer than estimated but was handled via Change Order without client escalation.' },
      { name: 'Proseware SOC Modernization', industry: 'Financial Services', year: 2025, outcome: 'success', relevance: 'Medium', lesson: 'Sentinel analytics pack deployed on a compressed timeline when connectors were pre-qualified in Phase 1. HIPAA analytics ruleset has similar pre-qualification requirements — apply same approach.' },
      { name: 'City Power & Light SOC Modernization', industry: 'Energy', year: 2024, outcome: 'success', relevance: 'Medium', lesson: 'Regulated industry delivery with NERC CIP overlay (analogous to HIPAA regulatory complexity). Monthly compliance review cadence with client legal team was the key governance success factor.' },
    ],
    agentMatches: [
      { name: 'Sarah Mitchell', role: 'Healthcare Security Delivery Lead', credits: [{ project: 'Lamna Healthcare Azure & Security Foundation', csat: 4.2 }], industries: ['Healthcare'], availability: 'Confirmed available Month 1', regions: ['Americas'] },
    ],
    marketSignals: [
      { feed: 'APAC Health Data Regulation Monitor', alert: 'Australia (My Health Records Act amendment), Singapore (PDPA healthcare provisions update), and Japan (APPI health data guidance) all issued updated health data guidelines in 2025–2026. Review against hospital country locations before Phase 1 scope is finalized.', severity: 'warning', date: 'Apr 2026', dimension: 'Regulatory Compliance' },
    ],
    alignmentFlags: [
      { label: 'APAC Regulatory Mapping → Phase 1', status: 'warning', detail: 'No APAC in-country regulatory mapping is scheduled. Three countries have issued new health data guidelines that may affect scope.' },
      { label: 'Sarah Mitchell → Delivery Lead Confirmation', status: 'warning', detail: 'Sarah Mitchell is recommended in AI conditions but not yet formally confirmed as delivery lead.' },
      { label: 'BAA → Pre-Access Gate', status: 'ok' },
      { label: 'Co-investment → Commercial Terms', status: 'warning', detail: 'Co-investment approval memo not attached as exhibit to the deal file.' },
    ],
  },

  // ─── 8. CONSOLIDATED MESSENGER ───────────────────────────────────────────
  'Consolidated Messenger': {
    compositeScore: 3.5,
    executiveBrief: {
      riskTier: 'High Risk',
      headlineRisk: '14-country D365 F&O rollout with 30% SI partner, 14 local payroll integrations (APIs unspecified), and 70% delivery success rate on comparable multi-country programs. Wide World Importers D365 Global is the most relevant precedent — terminated at Wave 2 due to scope explosion. The same conditions are present.',
      precedentSignal: '70% delivery success rate on 2 comparable multi-country ERP programs — below the 80% threshold for standard approval. The only failure in the D365 service line (Wide World Importers) is a direct structural parallel to this engagement.',
      deliveryConfidence: 'Elena Vasquez available as D365 lead. David Okonkwo has multi-country ERP experience but was the delivery lead on Wide World Importers (terminated). Architecture Review Board assessment is required — not yet completed. Team for a 28-month 14-country program is not fully staffed.',
      marketContext: 'SAP ECC sunset pressure is increasing deal urgency. However, 14-country multi-jurisdictional D365 rollouts have a materially higher complexity and risk profile than single-country programs. GDPR enforcement across 14 EU jurisdictions and local payroll regulation variance are active risk signals.',
      decisionGuidance: 'Do not approve in current form. Required before resubmission: (1) ARB assessment completed; (2) revised SOW with country-level phase plans and out-of-scope per jurisdiction; (3) 14 payroll API specifications documented; (4) Finance margin floor analysis with overrun contingency plan; (5) SI partner SLA and indemnification terms confirmed.',
    },
    sections: [
      { id: 'executive-brief', number: '1.', title: 'Executive Risk Brief', sectionType: 'brief', content: [{ t: 'p', text: 'High Risk. This is the highest-risk deal in the current pending portfolio. The multi-country complexity, SI partner dependency, low comparable success rate, and incomplete SOW create a risk profile that does not support approval in current form. The AI model recommends resubmission after ARB assessment and SOW remediation. The commercial opportunity is real — the path to approval requires resolving the structural SOW gaps first.' }] },
      { id: 'delivery-complexity', number: '2.', title: 'Delivery Complexity Assessment', sectionType: 'standard', dimensionKey: 'delivery_complexity', content: [{ t: 'bullets', items: ['14 countries, 4 waves, 28 months: the longest and most geographically complex program in the pending portfolio by a significant margin', '14 local payroll integrations: each payroll vendor API is a distinct integration with different specifications — 14 unknown APIs is the single most complex technical unknown', 'Finance (GL, AP/AR, Fixed Assets) + Logistics (WM, TMS) + HR: three module tracks running concurrently across 4 geographic waves', '30% SI partner: coordination overhead and quality variance across 14 countries adds significant management complexity', 'Country legal entity differences: chart of accounts, tax rules, and financial reporting requirements vary per country — D365 configuration is not standard across all 14'] }] },
      { id: 'client-readiness', number: '3.', title: 'Client Readiness Assessment', sectionType: 'standard', dimensionKey: 'client_readiness', content: [{ t: 'bullets', items: ['No named executive sponsor in the deal profile: the most significant client readiness gap for a 28-month program', 'Client Global Program Manager is named in governance plan but their authority and organizational reach across 14 countries is unknown', 'Country lead availability (1 FTE equivalent per country): 14 country leads required — no confirmation that client has the organizational depth to commit this resource level', 'Change management for 14-country ERP replacement is a massive organizational undertaking — no change management approach is documented'] }] },
      { id: 'commercial-structure', number: '4.', title: 'Commercial Structure Assessment', sectionType: 'standard', dimensionKey: 'commercial_structure', content: [{ t: 'bullets', items: ['22% margin with 30% SI partner: at this complexity level and partner dilution, the commercial buffer for overruns is critically thin', 'No margin contingency defined: if any wave encounters scope variance (14-country payroll integration variance alone could shift effort materially), there is no financial mechanism to protect Microsoft', 'Fixed fee by wave on unknown country-level scope: the highest commercial risk structure for the most complex deal in the portfolio', 'Finance flagged for margin floor review: this flag must be resolved before approval, not after'] }] },
      { id: 'execution-resourcing', number: '5.', title: 'Execution & Resourcing Assessment', sectionType: 'standard', dimensionKey: 'execution_resourcing', content: [{ t: 'bullets', items: ['Elena Vasquez available as D365 lead: appropriate for the ERP delivery track', 'David Okonkwo has multi-country ERP experience but was delivery lead on Wide World Importers (terminated at Wave 2): flagged for review, not recommended as lead for this engagement', 'Architecture Review Board assessment not completed: required before executive approval per AI conditions — outstanding', 'A 28-month, 14-country program requires a dedicated program office of 4–6 Microsoft PS professionals — not yet staffed or costed'] }] },
      { id: 'regulatory-compliance', number: '6.', title: 'Regulatory & Compliance Assessment', sectionType: 'standard', dimensionKey: 'regulatory_compliance', content: [{ t: 'bullets', items: ['GDPR applies across EU member state countries in scope: data processing agreements (DPAs) per country are required — not yet listed', '14 local payroll regulation regimes: each country has distinct payroll reporting, data retention, and employee privacy rules — none are documented in the current SOW', 'SI partner regulatory compliance: the SI partner is responsible for local regulatory configuration but their methodology is not documented', 'Regulatory risk is rated as the highest for any deal in the current pending portfolio'] }] },
      { id: 'partner-ecosystem', number: '7.', title: 'Partner & Ecosystem Assessment', sectionType: 'standard', dimensionKey: 'partner_ecosystem', content: [{ t: 'bullets', items: ['Regional SI partner at 30%: above the 25% threshold where partner management overhead materially affects delivery confidence', 'SI partner track record: 2 comparable multi-country engagements rated — performance data is limited for the 14-country scope', 'No SI partner SLA or indemnification terms in the subcontract: a high-severity commercial gap for a partner carrying 30% of delivery', 'SI partner selection process: the specific regional SI partner is not named — "Regional SI Partner" is a placeholder'] }] },
      { id: 'technology-maturity', number: '8.', title: 'Technology Maturity Assessment', sectionType: 'standard', dimensionKey: 'technology_maturity', content: [{ t: 'bullets', items: ['D365 F&O platform: fully mature and GA', 'Multi-country D365 F&O: the global template approach is established but country-level localization complexity varies significantly — 14 countries at once is at the edge of Microsoft PS delivery capacity', '14 payroll integration APIs: all unknown — technology maturity of the integration layer cannot be assessed until APIs are documented', 'Local payroll localization packs: some countries have established D365 localization packs, others require custom configuration'] }] },
      { id: 'precedent-intelligence', number: '9.', title: 'Precedent Intelligence', sectionType: 'precedent', content: [{ t: 'p', text: 'Two comparable multi-country D365 programs retrieved. The Wide World Importers failure is the most critical precedent — it is the only D365 failure in our delivery history and the structural parallels to this deal are direct. Review this case with the ARB before approval.' }] },
      { id: 'delivery-agent-intelligence', number: '10.', title: 'Delivery Agent Intelligence', sectionType: 'agents', content: [{ t: 'p', text: 'Elena Vasquez is available as D365 delivery lead. David Okonkwo has multi-country experience but carries the Wide World Importers context — flagged. A full 28-month program office team is not yet identified.' }] },
      { id: 'market-signals', number: '11.', title: 'Market Signal Alerts', sectionType: 'signals', content: [{ t: 'p', text: 'Two active market signals. Both are adverse — GDPR enforcement and SAP sunset pressure creating deal urgency at the expense of risk diligence.' }] },
    ],
    dimensions: [
      { key: 'delivery_complexity', label: 'Delivery Complexity', weight: '20%', score: 2.5, strength: 'D365 F&O platform is mature. Global template approach is established for multi-country deployments.', gaps: ['14 payroll integration APIs are undocumented — scope is entirely unknown', '14-country concurrent scope is at the edge of Microsoft PS delivery capacity for a single program', '30% SI partner coordination across 14 countries creates management complexity not fully addressed in the governance plan'], recommendation: 'Mandatory: document all 14 payroll API specifications before contract execution. Wave 1 must not begin until APIs for Wave 1 countries are validated.' },
      { key: 'client_readiness', label: 'Client Readiness', weight: '18%', score: 4.0, strength: 'Wave-based structure implies some client organizational planning has occurred.', gaps: ['No named executive sponsor — critical gap for a 28-month program', '14 country lead commitments not confirmed — significant organizational depth required from client', 'No change management approach for global ERP replacement'], recommendation: 'Require named executive sponsor (C-suite) and country lead commitment letters for all 14 countries before ARB assessment.' },
      { key: 'commercial_structure', label: 'Commercial Structure', weight: '15%', score: 3.5, strength: 'Wave-based billing structure aligns payment to delivery gates.', gaps: ['22% margin with 30% partner: no buffer for overruns at this complexity level', 'No overrun contingency mechanism defined', 'Fixed fee on undocumented country-level scope is the highest commercial risk structure available'], recommendation: 'Finance margin floor review must be completed before resubmission. Define a per-wave overrun contingency mechanism before contract execution.' },
      { key: 'execution_resourcing', label: 'Execution & Resourcing', weight: '17%', score: 4.5, strength: 'Elena Vasquez available as D365 delivery lead with comparable experience.', gaps: ['David Okonkwo flagged: Wide World Importers context requires ARB review before any leadership role', 'Full program office team (4–6 professionals) not yet identified', 'ARB assessment outstanding — a required gate per AI conditions'], recommendation: 'ARB assessment is a hard gate for approval. Do not execute contract until ARB has reviewed and signed off on the program office structure and resourcing plan.' },
      { key: 'regulatory_compliance', label: 'Regulatory Compliance', weight: '10%', score: 3.0, strength: 'GDPR is a known framework with established compliance methodology.', gaps: ['Data processing agreements (DPAs) not documented for any of the 14 countries', '14 local payroll regulation regimes entirely unassessed', 'SI partner regulatory compliance methodology not documented'], recommendation: 'GDPR DPA mapping for all 14 countries must be completed before contract execution. Payroll regulatory mapping is a Wave 1 kickoff gate per country.' },
      { key: 'partner_ecosystem', label: 'Partner & Ecosystem', weight: '10%', score: 4.0, strength: 'SI partner is committed to local regulatory configuration per country — appropriate use of local expertise.', gaps: ['SI partner not named — "Regional SI Partner" is a placeholder', 'No SLA or indemnification terms in the subcontract — high-severity commercial gap', 'Performance data on SI partner at 14-country scale is limited'], recommendation: 'Named SI partner with confirmed SLA and indemnification terms is a contract execution gate. Do not sign without these.' },
      { key: 'technology_maturity', label: 'Technology Maturity', weight: '10%', score: 5.5, strength: 'D365 F&O is a fully mature, GA platform.', gaps: ['14 payroll integration APIs unknown — technology maturity of integration layer cannot be assessed', 'Country-specific D365 localization packs: some countries require custom configuration not covered by standard packs'], recommendation: 'Payroll API documentation is a mandatory pre-contract deliverable for Wave 1 countries. Custom localization scope to be assessed in Wave 1 design.' },
    ],
    referenceProjects: [
      { name: 'Northwind Traders D365 F&O', industry: 'Distribution', year: 2026, outcome: 'success', relevance: 'High', lesson: 'In progress — single-country SAP-to-D365 migration. Early indicators positive. Data quality assessment gate in Phase 1 prevented the issues seen in Southridge. However: 14-country scope is a fundamentally different risk profile than single-country.' },
      { name: 'Wide World Importers D365 Global', industry: 'Retail / Import', year: 2022, outcome: 'failed', relevance: 'High', lesson: 'The only D365 failure in Microsoft PS delivery history. Terminated at Wave 2 (8 countries) due to: scope explosion in local payroll integrations (APIs not as documented), SI partner quality failure in Wave 2 countries, and margin erosion to near-zero. Root causes are structurally identical to this deal. ARB review of this case is mandatory before Consolidated Messenger approval.' },
      { name: 'Southridge D365 F&O Transformation', industry: 'Distribution', year: 2023, outcome: 'partial', relevance: 'Medium', lesson: 'SAP data migration +8 weeks. Single-country. At 14 countries, a similar data migration delay would cascade across all 4 waves. Country-level data migration risk must be assessed per country, not globally.' },
    ],
    agentMatches: [
      { name: 'Elena Vasquez', role: 'D365 F&O Delivery Lead', credits: [{ project: 'Southridge D365 F&O Transformation', csat: 4.2 }, { project: 'Trey Research D365 Sales & CS', csat: 4.0 }], industries: ['Distribution', 'Professional Services'], availability: 'Available from Month 1 (subject to ARB approval)', regions: ['Americas', 'EMEA'] },
      { name: 'David Okonkwo', role: 'Multi-Country ERP Program Director', credits: [{ project: 'Wide World Importers D365 Global', csat: 3.2 }], industries: ['Retail'], availability: 'Available but flagged — ARB review required before leadership assignment', regions: ['EMEA', 'Americas'] },
    ],
    marketSignals: [
      { feed: 'SAP ECC Sunset Pressure Monitor', alert: 'SAP ECC mainstream maintenance ends 2027. Clients are accelerating D365 migration timelines, creating deal urgency that may pressure risk diligence. Consolidated Messenger\'s urgency to proceed should not override ARB assessment and SOW remediation requirements.', severity: 'warning', date: 'May 2026', dimension: 'Delivery Complexity' },
      { feed: 'GDPR Multi-Jurisdiction Monitor', alert: 'GDPR enforcement actions in multi-country business process outsourcing increased 40% in 2025. 14-country data processing without documented DPAs per country is a high-enforcement-risk posture. Legal review required before contract execution.', severity: 'critical', date: 'Apr 2026', dimension: 'Regulatory Compliance' },
    ],
    alignmentFlags: [
      { label: 'Wide World Importers Precedent → ARB Review', status: 'warning', detail: 'The only D365 failure in delivery history is a structural parallel to this deal. ARB must review the Wide World Importers case before approval.' },
      { label: 'Payroll API Specs → Scope Completeness', status: 'warning', detail: '14 payroll integration APIs are undocumented. Contract scope is fundamentally incomplete without them.' },
      { label: 'GDPR DPAs → Regulatory Compliance', status: 'warning', detail: 'No data processing agreements documented for any of the 14 countries. GDPR enforcement risk is critical.' },
      { label: 'SI Partner Identity → Partner & Ecosystem', status: 'warning', detail: '"Regional SI Partner" is a placeholder — SI partner is not named and no SLA or indemnification terms exist.' },
    ],
  },
};
