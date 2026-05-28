// Delivery Success Intelligence — synthesizes Knowledge Network, Portfolio Monitor,
// and Delivery Agent insights into a forward-looking confidence brief for deal approval.

export type DeliveryOutcome = 'green' | 'amber' | 'red' | 'cancelled';
export type LessonCategory = 'success_pattern' | 'failure_mode' | 'risk_mitigation' | 'process_improvement';
export type CapacityBand = 'available' | 'committed' | 'overloaded';
export type ForecastHealth = 'green' | 'amber' | 'red';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface ExecutiveBrief {
  successTier: 'High Confidence' | 'Confident' | 'Cautious' | 'Constrained' | 'Critical';
  closestAnalog: string;
  successProbability: string;
  topRiskPattern: string;
  capacityMatch: string;
  decisionGuidance: string;
}

export interface CapabilityDimension {
  key: string;
  label: string;
  weight: string;
  score: number;
  evidence: string;
  gaps: string[];
  recommendation: string;
}

export interface ComparableEngagement {
  name: string;
  client: string;
  industry: string;
  serviceLine: string;
  budget: string;
  duration: string;
  outcome: DeliveryOutcome;
  finalHealth: 'green' | 'amber' | 'red';
  csat?: number;
  marginVariance: number;       // % deviation from sold margin
  scheduleVariance: number;     // % deviation from planned schedule
  relevance: 'High' | 'Medium' | 'Low';
  keyTakeaway: string;
}

export interface AppliedLesson {
  title: string;
  category: LessonCategory;
  sourceProject: string;
  applicability: number;        // 0-100
  description: string;
  actionable: string;           // what to do for THIS deal
}

export interface RecommendedTeam {
  pmName: string;
  role: 'Project Manager' | 'Technical Lead' | 'Engagement Director' | 'QA Specialist';
  relevantExperience: string;
  csatHistory: number;
  capacityBand: CapacityBand;
  availability: string;
  trackRecord: string;
}

export interface TrajectoryForecast {
  d30: ForecastHealth;
  d60: ForecastHealth;
  d90: ForecastHealth;
  end: ForecastHealth;
  predictedEwAtStart: number;
  predictedEwAt90: number;
  confidence: 'High' | 'Medium' | 'Low';
  rationale: string;
}

export interface KeyMilestone {
  milestone: string;
  timing: string;
  risk: RiskLevel;
  signal: string;
  preventive: string;
}

export interface FailureMode {
  mode: string;
  historicalFrequency: string;    // e.g., "3 of 5 similar engagements"
  earlyWarnings: string[];
  preventiveActions: string[];
  costIfMaterializes: string;
}

export interface PortfolioContext {
  similarActive: number;          // currently active similar projects
  similarCompleted: number;
  overallSuccessRate: number;     // %
  avgFinalCsat: number;
  avgMarginVariance: number;
  recentTrendDirection: 'improving' | 'stable' | 'declining';
}

export interface DeliverySuccessData {
  compositeScore: number;          // 0-10
  successProbability: number;      // 0-100
  confidence: 'High' | 'Medium' | 'Low';
  executiveBrief: ExecutiveBrief;
  capabilities: CapabilityDimension[];
  comparables: ComparableEngagement[];
  appliedLessons: AppliedLesson[];
  recommendedTeam: RecommendedTeam[];
  trajectory: TrajectoryForecast;
  keyMilestones: KeyMilestone[];
  failureModes: FailureMode[];
  portfolioContext: PortfolioContext;
}

// ── Color helpers ───────────────────────────────────────────────────────────
export function successColor(s: number) {
  if (s >= 8.5) return { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'High Confidence' };
  if (s >= 7.0) return { dot: 'bg-teal-500',    text: 'text-teal-700',    bg: 'bg-teal-50',    border: 'border-teal-200',    badge: 'Confident' };
  if (s >= 5.5) return { dot: 'bg-blue-500',    text: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    badge: 'Cautious' };
  if (s >= 4.0) return { dot: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   badge: 'Constrained' };
  return                { dot: 'bg-red-500',    text: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     badge: 'Critical' };
}

export function outcomeStyle(o: DeliveryOutcome) {
  if (o === 'green')     return { color: 'text-emerald-600', label: 'Success' };
  if (o === 'amber')     return { color: 'text-amber-600',   label: 'Recovered' };
  if (o === 'red')       return { color: 'text-red-600',     label: 'Struggled' };
  return                       { color: 'text-gray-500',   label: 'Cancelled' };
}

export function capacityBadge(c: CapacityBand) {
  if (c === 'available')  return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Available' };
  if (c === 'committed')  return { bg: 'bg-amber-100',   text: 'text-amber-700',   label: 'Committed' };
  return                       { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Overloaded' };
}

export function riskStyle(r: RiskLevel) {
  if (r === 'low')    return { dot: 'bg-emerald-500', text: 'text-emerald-700' };
  if (r === 'medium') return { dot: 'bg-amber-500',   text: 'text-amber-700' };
  return                   { dot: 'bg-red-500',     text: 'text-red-700' };
}

// ── Data map keyed by client name ───────────────────────────────────────────
export const DELIVERY_SUCCESS_DATA: Record<string, DeliverySuccessData> = {

  // ─── 1. A. Datum Corporation (Zero Trust + SOC) ──────────────────────────
  'A. Datum Corporation': {
    compositeScore: 9.2,
    successProbability: 91,
    confidence: 'High',
    executiveBrief: {
      successTier: 'High Confidence',
      closestAnalog: 'Most similar to Proseware SOC Modernization and City Power & Light SOC Modernization — both currently active and Green, with strong CISO engagement and Sentinel baseline as the foundational asset.',
      successProbability: '91% predicted success based on 5 comparable Zero Trust / SOC engagements. Average CSAT on analogs: 9.1/10. Margin variance ≤ 3% on prior engagements.',
      topRiskPattern: 'Historical lesson: when client OT/legacy environment access lags by more than 4 weeks, Sentinel data connector setup is the first milestone to slip. Pre-engagement OT inventory recommended.',
      capacityMatch: 'Marco Rossi (Proseware PM) is available June 1 with direct Sentinel experience. Ray Kowalski (Lamna Healthcare PM, 9.2 CSAT) is also a strong match.',
      decisionGuidance: 'High delivery confidence. Approve at Tier 2. Recommend Marco Rossi or Ray Kowalski as PM. Apply Bi-weekly RAID Reviews lesson from Lamna Healthcare to anchor cadence.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 9.5, evidence: '5 highly comparable Zero Trust + SOC engagements in last 18 months — all delivered Green', gaps: [], recommendation: 'Apply Proseware playbook directly. Sentinel baseline + Defender XDR is proven path.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 9.5, evidence: 'Zero Trust playbook v3.2 directly applies. Sentinel baseline assets reusable. 88% delivery accelerator coverage', gaps: [], recommendation: 'Activate Zero Trust playbook at kickoff. Reuse Sentinel data connector templates.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 8.8, evidence: 'Multiple PMs with proven Zero Trust track record. Engagement Director Elena Marchetti available', gaps: [], recommendation: 'Marco Rossi (preferred) or Ray Kowalski. Both have 9.0+ CSAT history.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 8.0, evidence: 'Security practice currently at 78% utilization. June onward improves to 65%', gaps: ['Senior IAM architect demand elevated through July'], recommendation: 'Schedule IAM-heavy workstreams for August onward if possible.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 8.5, evidence: 'Strong board mandate. CISO and CTO both engaged in pre-sales. Strategic account potential', gaps: ['Subsidiary inventory not yet documented'], recommendation: 'Day 30 checkpoint should validate subsidiary scope alignment.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 9.0, evidence: 'Five comparable estimates within 8% of actuals. Standard sizing applies', gaps: [], recommendation: 'Apply standard Zero Trust sizing model. No special discounting.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 9.5, evidence: 'No special regulatory requirements identified. Standard governance applies', gaps: [], recommendation: 'Standard governance framework.' },
    ],
    comparables: [
      { name: 'Proseware SOC Modernization',    client: 'Proseware Inc',      industry: 'Technology',  serviceLine: 'Security/SOC', budget: '$760K',  duration: '9 months',  outcome: 'green', finalHealth: 'green', csat: 9.0, marginVariance: 1.5,  scheduleVariance: 0,    relevance: 'High',   keyTakeaway: 'Sentinel baseline exceeded Day 45 target. Strong CISO partnership.' },
      { name: 'City Power & Light SOC Modernization', client: 'City Power & Light', industry: 'Utilities', serviceLine: 'Security/SOC', budget: '$1.3M', duration: '9 months', outcome: 'green', finalHealth: 'green', csat: 8.8, marginVariance: 2.0, scheduleVariance: 0, relevance: 'High',   keyTakeaway: 'OT connectivity architecture approved on schedule. NERC CIP compliance pattern reusable.' },
      { name: 'Lamna Healthcare Azure & Security Foundation', client: 'Lamna Healthcare', industry: 'Healthcare', serviceLine: 'Security', budget: '$1.8M', duration: '9 months', outcome: 'green', finalHealth: 'green', csat: 9.2, marginVariance: -1.0, scheduleVariance: 0, relevance: 'High',   keyTakeaway: 'HIPAA pre-assessment prevented 6 weeks of rework. Bi-weekly RAID cadence reduced escalations 40%.' },
      { name: 'Alpine Insurance (in delivery)', client: 'Alpine Insurance',   industry: 'Insurance',   serviceLine: 'Security/IAM', budget: '$716K', duration: '9 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Active engagement. Solvency II compliance pack reusable for regulated subsidiaries.' },
      { name: 'Contoso Energy NERC CIP',        client: 'Contoso Energy',     industry: 'Utilities',   serviceLine: 'Security/Compliance', budget: '$870K', duration: '9 months', outcome: 'green', finalHealth: 'green', csat: 8.7, marginVariance: 1.0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Strong sponsor engagement model directly applicable.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 90, description: 'Switching from monthly to bi-weekly RAID log reviews reduced escalations from 8 to 5 over project lifecycle.', actionable: 'Set bi-weekly RAID cadence from Day 1. Make it part of governance plan.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: 'success_pattern', sourceProject: "Munson's Pickles", applicability: 88, description: 'Visible C-level sponsorship prevented scope disputes and drove 10/10 CSAT.', actionable: 'Confirm CISO and CTO commitment to monthly steering cadence pre-contract.' },
      { title: 'HIPAA-style pre-assessment reduces regulatory delivery risk', category: 'risk_mitigation', sourceProject: 'Lamna Healthcare', applicability: 65, description: 'Pre-engagement assessments identified critical gaps that would have caused 4-6 week delays.', actionable: 'Light-touch OT environment pre-assessment (1 week) recommended for subsidiary scope confirmation.' },
    ],
    recommendedTeam: [
      { pmName: 'Marco Rossi',     role: 'Project Manager',    relevantExperience: '3 SOC modernizations · Proseware (current Green)', csatHistory: 9.0, capacityBand: 'available',  availability: 'Available June 1', trackRecord: '100% Green completion rate' },
      { pmName: 'Ray Kowalski',    role: 'Technical Lead',     relevantExperience: 'Lamna Healthcare TL · HIPAA Sentinel deployment', csatHistory: 9.2, capacityBand: 'committed',  availability: 'Available July 15', trackRecord: 'On-time, on-budget completion' },
      { pmName: 'Angela Moore',    role: 'Technical Lead',     relevantExperience: 'Proseware TL · Sentinel data connector specialist', csatHistory: 8.9, capacityBand: 'available',  availability: 'Available June 8', trackRecord: 'Sentinel baseline accelerator developer' },
      { pmName: 'Elena Marchetti', role: 'Engagement Director', relevantExperience: 'QA Specialist for portfolio · Security domain expertise', csatHistory: 9.1, capacityBand: 'available',  availability: 'Steering support', trackRecord: 'Recovered 3 of 4 at-risk security engagements' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 32, predictedEwAt90: 28, confidence: 'High',
      rationale: 'High pattern match with Proseware and City Power trajectories. Predicted to maintain Green throughout. Day 30 maturity score expected at 88+.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30',        risk: 'low',    signal: 'Standard for top-quartile security engagement', preventive: 'Validate subsidiary scope alignment' },
      { milestone: 'Sentinel baseline operational',    timing: 'Day 45-60',    risk: 'low',    signal: 'Proven milestone — exceeded on every analog', preventive: 'Apply Proseware connector library' },
      { milestone: 'Defender XDR rollout begins',      timing: 'Month 3-4',    risk: 'medium', signal: '6,500 seats — coordination intensity', preventive: 'Phased rollout by business unit, applying VanArsdel persona-pilot lesson' },
      { milestone: 'Subsidiary expansion (potential)', timing: 'Month 6+',     risk: 'medium', signal: 'A. Datum has 12 subsidiaries — scope creep risk', preventive: 'Lock subsidiary scope in steering committee at Month 3' },
    ],
    failureModes: [
      { mode: 'Client OT/legacy access delays cause Sentinel data connector slippage', historicalFrequency: '2 of 5 comparable engagements (e.g., Proseware AS/400 gap)', earlyWarnings: ['Day 30 maturity score below 75', 'OT inventory not delivered by client IT'], preventiveActions: ['Add OT access as Day-1 RAID dependency', 'Schedule client IT enablement workshop pre-kickoff'], costIfMaterializes: '~3 week schedule slip, manageable' },
      { mode: 'Subsidiary scope expansion mid-flight', historicalFrequency: '1 of 5 (rare but observed)', earlyWarnings: ['Steering committee discussions of new subsidiaries', 'Late-arriving stakeholders from non-baseline business units'], preventiveActions: ['Lock subsidiary scope in steering at Month 3', 'Separate SOW for any new subsidiary onboarding'], costIfMaterializes: '~$200K margin impact if unmanaged' },
    ],
    portfolioContext: {
      similarActive: 2, similarCompleted: 3, overallSuccessRate: 100, avgFinalCsat: 9.0, avgMarginVariance: 0.7, recentTrendDirection: 'stable',
    },
  },

  // ─── 2. Alpine Insurance Group ───────────────────────────────────────────
  'Alpine Insurance Group': {
    compositeScore: 8.8,
    successProbability: 87,
    confidence: 'High',
    executiveBrief: {
      successTier: 'High Confidence',
      closestAnalog: 'Most similar to Northwind Healthcare (regulated industry Zero Trust) and Lamna Healthcare (HIPAA-equivalent compliance complexity). Both delivered Green with high CSAT.',
      successProbability: '87% predicted success based on 6 comparable Zero Trust / regulated industry engagements. Avg CSAT 8.9. Solvency II compliance pack proven.',
      topRiskPattern: 'Historical lesson: regulated industry engagements that do not validate compliance scope with client Risk & Compliance team pre-kickoff have 3x higher rework rate. Validation is the AI-flagged condition.',
      capacityMatch: 'Sarah Mitchell (Lamna Healthcare PM, 9.2 CSAT) is the best-fit candidate — directly comparable regulated-industry experience.',
      decisionGuidance: 'Approve. Recommend Sarah Mitchell as PM. Apply Solvency II analytics pack from Alpine pre-sales. Bi-weekly RAID cadence and Regulatory Volatility risk should be standing items.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 9.0, evidence: '6 comparable regulated-industry Zero Trust engagements. 91% success rate', gaps: [], recommendation: 'Apply Lamna Healthcare playbook with Solvency II overlay.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 9.0, evidence: 'Zero Trust playbook + Solvency II compliance pack both reusable', gaps: [], recommendation: 'Activate both assets at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 9.0, evidence: 'Sarah Mitchell + Ray Kowalski (Lamna team) available. Both 9.0+ CSAT', gaps: [], recommendation: 'Pair Sarah Mitchell with Angela Moore for Sentinel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 8.5, evidence: 'Security practice capacity manageable through Q3. Sarah Mitchell available June 15', gaps: [], recommendation: 'Schedule kickoff for June 22.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 8.2, evidence: 'Strong CRO engagement. Risk & Compliance team identified', gaps: ['Solvency II analytics compliance scope not yet validated'], recommendation: 'AI-flagged condition: validate scope with client R&C team pre-kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 8.5, evidence: 'Regulated industry sizing standard within 10%', gaps: ['Regulatory analytics customization not fully scoped'], recommendation: 'Buffer 2 weeks for Solvency II analytics pack customization.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 8.5, evidence: 'Solvency II + GDPR — manageable with proven IP', gaps: [], recommendation: 'Apply Regulatory Volatility standing risk pattern from Northwind Pharma G2G playbook.' },
    ],
    comparables: [
      { name: 'Lamna Healthcare Azure & Security Foundation', client: 'Lamna Healthcare', industry: 'Healthcare', serviceLine: 'Security', budget: '$1.8M', duration: '9 months', outcome: 'green', finalHealth: 'green', csat: 9.2, marginVariance: -1.0, scheduleVariance: 0, relevance: 'High',   keyTakeaway: 'Direct regulated-industry analog. HIPAA pre-assessment pattern translates to Solvency II.' },
      { name: 'Proseware SOC Modernization',    client: 'Proseware Inc',      industry: 'Technology',  serviceLine: 'Security/SOC', budget: '$760K',  duration: '9 months',  outcome: 'green', finalHealth: 'green', csat: 9.0, marginVariance: 1.5, scheduleVariance: 0, relevance: 'High',   keyTakeaway: 'Sentinel baseline accelerator proven.' },
      { name: 'City Power & Light SOC',         client: 'City Power & Light', industry: 'Utilities',   serviceLine: 'Security/SOC', budget: '$1.3M', duration: '9 months', outcome: 'green', finalHealth: 'green', csat: 8.8, marginVariance: 2.0, scheduleVariance: 0, relevance: 'High',   keyTakeaway: 'NERC CIP regulatory pattern transferable to Solvency II.' },
      { name: 'Northwind Pharma Compliance (in G2G)', client: 'Northwind Pharma', industry: 'Pharma', serviceLine: 'Compliance', budget: '$2.4M', duration: '15 months', outcome: 'amber', finalHealth: 'amber', csat: 7.5, marginVariance: -8, scheduleVariance: 6, relevance: 'High', keyTakeaway: 'Regulatory volatility risk materialized mid-flight. Apply Regulatory Volatility standing risk pattern.' },
    ],
    appliedLessons: [
      { title: 'Capture regulatory volatility as a standing RAID risk for compliance projects', category: 'risk_mitigation', sourceProject: 'Northwind Pharma', applicability: 92, description: 'Regulatory guidance updates materialized in 3 of last 5 compliance projects. Standing risk + early SME engagement reduces time-to-recovery by 50%.', actionable: 'Add Solvency II volatility as Day-1 RAID. Pre-identify backup regulatory SME.' },
      { title: 'HIPAA-style pre-assessment reduces regulatory delivery risk', category: 'risk_mitigation', sourceProject: 'Lamna Healthcare', applicability: 90, description: 'Pre-engagement assessment identified gaps that would have caused 4-6 weeks of delay.', actionable: 'Run Solvency II pre-assessment as 2-week pre-kickoff sprint.' },
      { title: 'Bi-weekly RAID reviews reduce escalations by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risk earlier.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
    ],
    recommendedTeam: [
      { pmName: 'Sarah Mitchell',  role: 'Project Manager',    relevantExperience: 'Lamna Healthcare HIPAA · regulated industry expertise', csatHistory: 9.2, capacityBand: 'available',  availability: 'Available June 15', trackRecord: 'Reference customer secured on prior engagement' },
      { pmName: 'Angela Moore',    role: 'Technical Lead',     relevantExperience: 'Proseware TL · Sentinel + IAM specialist', csatHistory: 8.9, capacityBand: 'available',  availability: 'Available June 8', trackRecord: 'Sentinel baseline accelerator developer' },
      { pmName: 'Hiroshi Tanaka',  role: 'QA Specialist',     relevantExperience: 'Northwind Pharma G2G specialist · regulatory volatility expert', csatHistory: 8.7, capacityBand: 'available',  availability: 'Steering support', trackRecord: 'Recovered Northwind Pharma from caution' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 30, predictedEwAt90: 32, confidence: 'High',
      rationale: 'Pattern matches Lamna Healthcare trajectory. Slight elevation expected mid-flight due to regulatory complexity, but recoverable within Green.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low',    signal: 'Standard checkpoint', preventive: 'Validate Solvency II scope with R&C team' },
      { milestone: 'Sentinel + Solvency II analytics live', timing: 'Day 75', risk: 'medium', signal: 'Solvency II pack customization is the variable', preventive: 'Buffer 2 weeks for analytics customization' },
      { milestone: 'Solvency II audit dress-rehearsal',  timing: 'Month 6', risk: 'medium', signal: 'Regulatory guidance volatility risk', preventive: 'Backup SME pre-identified at Day 1' },
    ],
    failureModes: [
      { mode: 'Solvency II analytics compliance scope misalignment with client R&C team', historicalFrequency: '1 of 4 regulated industry engagements (e.g., Northwind Pharma FDA update)', earlyWarnings: ['Day 30 maturity score below 78', 'Client R&C team not engaged by week 2'], preventiveActions: ['AI-flagged condition: validate scope pre-kickoff', 'Backup regulatory SME pre-identified'], costIfMaterializes: '~$150K in re-scope effort' },
      { mode: 'Regulatory guidance update mid-flight', historicalFrequency: '3 of 5 compliance projects', earlyWarnings: ['New EIOPA guidance announcements', 'Industry press coverage of regulation changes'], preventiveActions: ['Regulatory volatility as standing RAID risk', 'Monthly regulatory monitoring established'], costIfMaterializes: 'Manageable with standing risk pattern' },
    ],
    portfolioContext: {
      similarActive: 1, similarCompleted: 5, overallSuccessRate: 91, avgFinalCsat: 8.9, avgMarginVariance: -1.5, recentTrendDirection: 'stable',
    },
  },

  // ─── 3. Fourth Coffee Corporation (Azure DC Exit) ────────────────────────
  'Fourth Coffee Corporation': {
    compositeScore: 7.2,
    successProbability: 76,
    confidence: 'Medium',
    executiveBrief: {
      successTier: 'Confident',
      closestAnalog: 'Most similar to Margie\'s Travel Azure Migration (current Green, 48% complete) and Adatum Cloud Foundation (current Amber, recovering). Wingtip Toys (Red) is the cautionary tale.',
      successProbability: '76% predicted success. 4 comparable engagements: 3 Green, 1 Red (Wingtip). The Red outcome traces to inadequate application discovery — the #1 lesson to apply here.',
      topRiskPattern: 'Critical: incomplete application discovery is the #1 historical failure mode for migration programs. Wingtip Toys lost 6 weeks to undocumented mainframe dependency. Pre-execute discovery sprint is essential.',
      capacityMatch: 'Diego Hernandez (Margie\'s Travel PM, currently active and Green) is the strongest match. Available October. Sarah Mitchell also a good fit but committed.',
      decisionGuidance: 'Approve with conditions. Mandatory pre-execute discovery sprint (2 weeks) before lift-shift planning. Apply Wingtip Toys failure-mode lesson — independent validation of app inventory, not just client-provided.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 7.5, evidence: '4 comparable migrations: 3 Green, 1 Red. Mix is acceptable with right preventive measures', gaps: ['Wingtip Toys failure mode must be actively prevented'], recommendation: 'Apply Margie\'s Travel pattern. Avoid Wingtip Toys pre-execute discovery shortcut.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 8.5, evidence: 'Cloud Adoption playbook + Avanade migration factory both available', gaps: [], recommendation: 'Standard playbook activation.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 7.0, evidence: 'Strong PMs available but top picks have current commitments', gaps: ['Best-fit PM (Diego Hernandez) not available until October'], recommendation: 'Diego Hernandez (preferred) or Sarah Mitchell. Start Oct-Nov.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 7.0, evidence: 'Cloud Adoption practice at 82% utilization through Q3', gaps: ['Senior cloud architects in demand'], recommendation: 'Schedule discovery sprint September, execution October.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 6.5, evidence: 'New logo with no prior delivery history. Strong board mandate', gaps: ['Application inventory not yet validated', 'Vendor coordination (Avanade) adds complexity'], recommendation: 'Mandatory 2-week discovery sprint. Independent validation of inventory.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 7.5, evidence: '210 workloads is high but in-range. 28% margin gives some buffer', gaps: ['Refactor tier estimate has higher variance than lift-shift'], recommendation: 'Re-baseline refactor estimate after discovery sprint.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 9.0, evidence: 'No special regulatory requirements', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: "Margie's Travel Azure Migration", client: "Margie's Travel", industry: "Travel", serviceLine: "Cloud Adoption", budget: '$890K', duration: '10 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 1.0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Currently 48% complete and Green. Strong discovery sprint pattern.' },
      { name: 'Adatum Cloud Foundation',         client: 'Adatum Corporation', industry: 'Technology', serviceLine: 'Cloud Adoption', budget: '$540K', duration: '6 months', outcome: 'amber', finalHealth: 'amber', csat: 7.8, marginVariance: -3, scheduleVariance: 4, relevance: 'High', keyTakeaway: 'ExpressRoute delay caused schedule slip — recovered with proactive client communication.' },
      { name: 'Wingtip Toys Cloud Native Modernization', client: 'Wingtip Toys', industry: 'Retail', serviceLine: 'Cloud Adoption', budget: '$1.9M', duration: '12 months', outcome: 'red', finalHealth: 'red', csat: 6.0, marginVariance: -15, scheduleVariance: 12, relevance: 'High', keyTakeaway: 'CAUTIONARY: undocumented mainframe dependency triggered 6-week architecture redesign. Application discovery failure.' },
      { name: 'Wide World Importers Azure Migration', client: 'Wide World Importers', industry: 'Logistics', serviceLine: 'Cloud Adoption', budget: '$890K', duration: '12 months', outcome: 'green', finalHealth: 'green', csat: 8.2, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Plan phase, applying Margie\'s Travel reference architecture.' },
    ],
    appliedLessons: [
      { title: 'Incomplete application discovery leads to architecture redesign mid-project', category: 'failure_mode', sourceProject: 'Wingtip Toys', applicability: 95, description: '8 of 35 apps had undocumented dependencies. Mainframe dependency caused 6-week redesign. Pre-sales handoff relied on client-provided inventory without independent validation.', actionable: 'MANDATORY 2-week pre-execute discovery sprint with independent app inventory validation.' },
      { title: 'Vendor SOW must include regulatory and quality obligations', category: 'risk_mitigation', sourceProject: 'Contoso Financial Group', applicability: 75, description: 'Avanade subcontract should explicitly cover regulatory-aware configuration standards.', actionable: 'Avanade SOW addendum required before countersigning.' },
      { title: 'Bi-weekly RAID reviews reduce escalations by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 85, description: 'Bi-weekly cadence catches risks earlier.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
    ],
    recommendedTeam: [
      { pmName: 'Diego Hernandez', role: "Project Manager", relevantExperience: "Margie's Travel PM (current Green) · Cloud migration specialist", csatHistory: 8.5, capacityBand: "committed", availability: 'Available October 1', trackRecord: '2 of 2 cloud migrations Green' },
      { pmName: 'Sarah Mitchell',  role: 'Project Manager', relevantExperience: 'Adatum Cloud Foundation PM · regulated industry experience', csatHistory: 9.2, capacityBand: 'committed', availability: 'Available November', trackRecord: 'Strong recovery track record' },
      { pmName: 'Felix Wagner',    role: 'Technical Lead',  relevantExperience: 'Wingtip Toys TL (post-recovery) · learned from failure', csatHistory: 7.8, capacityBand: 'available', availability: 'Available October', trackRecord: 'Architectural redesign veteran' },
      { pmName: 'Elena Marchetti', role: 'QA Specialist',  relevantExperience: 'Wingtip Toys Rescue Mode QA specialist · migration failure-mode expert', csatHistory: 9.1, capacityBand: 'available', availability: 'Discovery sprint support', trackRecord: 'Prevented escalation on 3 migrations' },
    ],
    trajectory: {
      d30: 'amber', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 45, predictedEwAt90: 38, confidence: 'Medium',
      rationale: 'Day 30 expected amber due to discovery sprint findings. Recovers to Green by Day 60 if discovery is rigorous. Wingtip Toys trajectory is the alternative if discovery is cut short.',
    },
    keyMilestones: [
      { milestone: 'Pre-execute Discovery Sprint',  timing: 'Pre-kickoff (2 wk)', risk: 'high',   signal: 'Highest risk milestone — outcome determines rest of project', preventive: 'Mandatory independent app inventory validation. Elena Marchetti as QA specialist.' },
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30',         risk: 'medium', signal: 'Discovery findings reflected in RAID log', preventive: 'Standard checkpoint with discovery findings review' },
      { milestone: 'Lift-Shift Wave 1 complete',   timing: 'Month 3',           risk: 'medium', signal: '40 workloads moved — execution risk', preventive: 'Phased approach with hypercare buffer' },
      { milestone: 'Refactor tier execution',      timing: 'Month 6-9',         risk: 'medium', signal: '60 workloads being refactored is the variable cost', preventive: 'Re-baseline refactor estimate post-Wave 1' },
      { milestone: 'Avanade vendor governance reviews', timing: 'Monthly',       risk: 'medium', signal: 'Vendor coordination is a known risk', preventive: 'Monthly vendor steering committee' },
    ],
    failureModes: [
      { mode: 'Incomplete application discovery (Wingtip Toys pattern)', historicalFrequency: '1 of 4 comparable (25%) — but 100% catastrophic when it materializes', earlyWarnings: ['Client unable to produce app dependency map by week 2', 'Single point-of-contact for app inventory', 'Day 30 maturity score below 70'], preventiveActions: ['MANDATORY 2-week pre-execute discovery sprint', 'Independent dependency mapping by Felix Wagner', 'No reliance on client-provided inventory alone'], costIfMaterializes: '~$300K and 6 weeks (Wingtip pattern)' },
      { mode: 'Avanade vendor coordination friction', historicalFrequency: '2 of 4 with vendor participation', earlyWarnings: ['SLA misses by vendor', 'Quality variance in vendor-led workstreams'], preventiveActions: ['Avanade SOW with explicit quality and regulatory obligations', 'Monthly vendor steering'], costIfMaterializes: '~$100K margin impact' },
      { mode: 'EMEA data residency surprise (Northwind Retailers pattern)', historicalFrequency: '1 of 4 EMEA migrations', earlyWarnings: ['Late-emerging EMEA stakeholders', 'GDPR review requested mid-flight'], preventiveActions: ['Pre-execute EMEA data residency confirmation'], costIfMaterializes: '~4 month delay if discovered late' },
    ],
    portfolioContext: {
      similarActive: 2, similarCompleted: 2, overallSuccessRate: 75, avgFinalCsat: 7.6, avgMarginVariance: -4.0, recentTrendDirection: 'improving',
    },
  },

  // ─── 4. Contoso Hotels & Resorts (AI Guest Experience) ───────────────────
  'Contoso Hotels & Resorts': {
    compositeScore: 7.8,
    successProbability: 79,
    confidence: 'Medium',
    executiveBrief: {
      successTier: 'Confident',
      closestAnalog: 'Most similar to VanArsdel Copilot & AI Platform (successfully completed, 68% adoption) and Datum Corp AI Innovation Platform (currently active and Green). Both are direct Azure AI Studio analogs.',
      successProbability: '79% predicted success based on 2 comparable Azure AI engagements. AI estimate accuracy inherently lower than traditional services — buffer is built in.',
      topRiskPattern: 'Critical learning from VanArsdel: AI projects need weekly user-facing model acceptance demos to build client confidence. Pre-launch persona pilots are also essential (VanArsdel Manufacturing pattern: +23 adoption points).',
      capacityMatch: 'Mei Chen (Contoso Hotels Loyalty PM, current Green, 90 maturity score) is the natural fit — same client, same industry, same delivery cadence. Strong continuity advantage.',
      decisionGuidance: 'Approve at Tier 3. Mei Chen as PM (continuity from Contoso Hotels Loyalty Platform). Apply VanArsdel weekly demos lesson and persona-pilot lesson. 90-day AI performance health check cadence (AI-flagged condition) is essential.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 8.0, evidence: '2 comparable Azure AI engagements + emerging Copilot adoption data', gaps: ['Only 2 direct analogs — small sample size'], recommendation: 'Apply VanArsdel playbook directly. Datum Corp AI as live reference.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 8.5, evidence: 'AI delivery playbook + Responsible AI framework directly applicable', gaps: [], recommendation: 'Activate AI playbook + Responsible AI governance at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 9.5, evidence: 'Mei Chen + James Osei + Felix Wagner — top AI delivery talent available', gaps: [], recommendation: 'Mei Chen leads. James Osei (VanArsdel PM, currently on Datum AI) as advisor.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 7.5, evidence: 'AI practice at 75% utilization. June onward eases', gaps: ['Senior AI architects in demand'], recommendation: 'Stage AI architects for design/build phases.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 8.5, evidence: 'New logo with strategic AI mandate. 20% company investment signals seriousness', gaps: ['Multi-country GDPR data residency complexity'], recommendation: 'GDPR Privacy Counsel review pre-kickoff (AI-flagged condition).' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 6.5, evidence: 'AI estimate accuracy inherently lower than traditional services', gaps: ['Agent build effort has higher variance'], recommendation: 'Phased milestones with AI model acceptance criteria (AI-flagged condition).' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 7.5, evidence: 'GDPR across 18-country footprint', gaps: ['Country-specific data residency not yet validated'], recommendation: 'EU property footprint GDPR review at Day 30.' },
    ],
    comparables: [
      { name: 'VanArsdel Copilot & AI Platform', client: 'VanArsdel Ltd', industry: 'Professional Services', serviceLine: 'AI & Copilot', budget: '$1.4M', duration: '10 months', outcome: 'green', finalHealth: 'green', csat: 9.0, marginVariance: 1.5, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Weekly demos drove 68% adoption (vs 45% industry avg). Legal agent in production with external counsel sign-off.' },
      { name: 'Datum Corp AI Innovation Platform', client: 'Datum Corporation', industry: 'Technology', serviceLine: 'AI & Agentic', budget: '$1.6M', duration: '10 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Currently in Initiate phase with high client energy. Direct Azure AI Studio analog.' },
      { name: 'VanArsdel Manufacturing Copilot', client: 'VanArsdel Manufacturing', industry: 'Manufacturing', serviceLine: 'AI & Copilot', budget: '$720K', duration: '10 months', outcome: 'green', finalHealth: 'green', csat: 8.8, marginVariance: 1.0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: '71% adoption via persona-based pre-launch pilots (23 points above benchmark).' },
      { name: 'Contoso Hotels Loyalty Platform', client: 'Contoso Hotels', industry: 'Hospitality', serviceLine: 'CX Platform', budget: '$2.1M', duration: '14 months', outcome: 'green', finalHealth: 'green', csat: 8.7, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'SAME CLIENT — currently in execute, 35% complete, Green. Strong CMO sponsorship pattern.' },
    ],
    appliedLessons: [
      { title: 'Weekly AI model acceptance demos accelerate client confidence', category: 'success_pattern', sourceProject: 'VanArsdel', applicability: 95, description: 'Weekly demos drove 68% adoption at 90 days vs 45% industry average.', actionable: 'Build weekly demo cadence into governance plan. First demo at Day 21.' },
      { title: 'Pre-launch persona-based Copilot adoption pilots increase initial adoption by 23 points', category: 'success_pattern', sourceProject: 'VanArsdel Manufacturing', applicability: 88, description: 'Two-week persona pilots delivered 71% adoption vs 48% benchmark.', actionable: 'Run 2-week persona pilots (guest, concierge, loyalty manager) before broad rollout.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: "success_pattern", sourceProject: "Munson's Pickles", applicability: 90, description: "Visible C-level sponsorship drove 10/10 CSAT.", actionable: 'Confirm CMO at monthly steering. Continuity from Loyalty Platform is an asset.' },
    ],
    recommendedTeam: [
      { pmName: 'Mei Chen', role: 'Project Manager', relevantExperience: 'Contoso Hotels Loyalty PM (current Green) · same client continuity', csatHistory: 8.7, capacityBand: 'committed', availability: 'Available August (Loyalty Phase 1 GA)', trackRecord: 'Day 30 maturity 90 on Loyalty Platform' },
      { pmName: 'James Osei', role: 'Project Manager', relevantExperience: 'VanArsdel Copilot PM · current Datum AI PM', csatHistory: 9.0, capacityBand: 'committed', availability: 'Advisory only', trackRecord: '2 of 2 AI projects Green' },
      { pmName: 'Felix Wagner', role: 'Technical Lead', relevantExperience: 'VanArsdel TL · Datum AI TL · Azure AI Studio specialist', csatHistory: 8.8, capacityBand: 'available', availability: 'Available July', trackRecord: 'Best AI architect in practice' },
      { pmName: 'Elena Marchetti', role: 'QA Specialist', relevantExperience: 'AI delivery QA · Responsible AI framework lead', csatHistory: 9.1, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Responsible AI sign-off on 4 engagements' },
    ],
    trajectory: {
      d30: 'green', d60: 'amber', d90: 'green', end: 'green',
      predictedEwAtStart: 35, predictedEwAt90: 38, confidence: 'Medium',
      rationale: 'Day 60 amber predicted due to typical AI estimate variance + agent acceptance criteria definition. Recovers to Green by Day 90 if weekly demos cadence is in place.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint',  timing: 'Day 30',  risk: 'low',    signal: 'Standard for top-quartile AI engagement', preventive: 'Apply VanArsdel checklist' },
      { milestone: 'First weekly demo',                 timing: 'Day 21',  risk: 'low',    signal: 'Critical adoption-driver milestone',        preventive: 'Schedule pre-kickoff with stakeholders' },
      { milestone: 'AI model acceptance criteria defined', timing: 'Day 45', risk: 'medium', signal: 'AI-flagged condition — measurable thresholds needed', preventive: 'Define thresholds per agent (booking, concierge, loyalty) by Day 45' },
      { milestone: 'GDPR data residency review',        timing: 'Day 30',  risk: 'medium', signal: '18-country footprint complexity', preventive: 'AI-flagged condition: Privacy Counsel review pre-kickoff' },
      { milestone: '90-day AI performance health check', timing: 'Day 90',  risk: 'low',    signal: 'AI-flagged condition — establish cadence',  preventive: 'Embed in governance plan at kickoff' },
      { milestone: 'Pilot property persona launch',     timing: 'Month 5', risk: 'medium', signal: 'Adoption inflection point',                  preventive: 'Apply VanArsdel Manufacturing persona-pilot pattern' },
    ],
    failureModes: [
      { mode: 'AI model acceptance criteria not measurable', historicalFrequency: '1 of 2 AI engagements without criteria upfront', earlyWarnings: ['Day 45 acceptance criteria not signed by client', 'Demo feedback feels subjective'], preventiveActions: ['Define measurable thresholds per agent', 'Acceptance criteria as Day-1 deliverable'], costIfMaterializes: '~$200K rework if criteria slip late' },
      { mode: 'GDPR data residency surprise per country', historicalFrequency: '1 of 1 multi-country AI engagement', earlyWarnings: ['Country-specific Privacy Counsel review surfaces issue', 'Late-arriving EMEA stakeholders'], preventiveActions: ['Privacy Counsel review pre-kickoff', 'Country-by-country data residency map at Day 30'], costIfMaterializes: '~$300K architecture rework' },
      { mode: 'Persona adoption falls below 50% at pilot', historicalFrequency: '0 of 2 when persona pilots applied; 1 of 1 when skipped', earlyWarnings: ['Skipping pre-launch persona pilots', 'Insufficient guest-facing training material'], preventiveActions: ['Mandatory 2-week persona pilots', 'Curated prompt libraries per role'], costIfMaterializes: '~$150K in re-launch effort' },
    ],
    portfolioContext: {
      similarActive: 2, similarCompleted: 2, overallSuccessRate: 100, avgFinalCsat: 8.9, avgMarginVariance: 1.0, recentTrendDirection: 'improving',
    },
  },

  // ─── 5. Northwind Traders (D365 F&O — SAP replacement) ───────────────────
  'Northwind Traders': {
    compositeScore: 6.8,
    successProbability: 71,
    confidence: 'Medium',
    executiveBrief: {
      successTier: 'Cautious',
      closestAnalog: 'Closest analog is Southridge D365 F&O Transformation (current Green, Day 30 maturity 92). Trey Research D365 (completed Green, 92% adoption) provides the user-rollout reference.',
      successProbability: '71% predicted success based on 5 comparable D365 engagements. Two relevant cautionary tales: Consolidated Messenger and Wingtip Toys (different domain but same pre-sales under-scoping pattern).',
      topRiskPattern: 'SAP ECC replacement is among the highest-complexity engagement types. Data migration fidelity and cutover planning are the primary failure modes — both AI-flagged in the deal conditions. Strong steering committee at the client is essential.',
      capacityMatch: 'David Chen (Southridge D365 PM, Day 30 maturity 92) is the strongest available match. Direct application of Southridge setup discipline recommended.',
      decisionGuidance: 'Approve with conditions. David Chen as PM (Southridge continuity). Mandatory formal Risk Mitigation Plan before contract execution. Steering committee with client C-level required. Apply phased D365 rollout lesson from Trey Research.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 7.0, evidence: '5 D365 F&O engagements but ERP replacement subset has higher complexity', gaps: ['SAP-to-D365 specifically has 70% historical success on Tier 3 deals'], recommendation: 'Apply Southridge setup discipline. Trey Research user-rollout pattern.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 8.5, evidence: 'D365 F&O playbook + data migration accelerators directly applicable', gaps: [], recommendation: 'Activate D365 F&O playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 8.5, evidence: 'David Chen + experienced D365 leads available', gaps: [], recommendation: 'David Chen as PM. Kevin Park as TL for cutover.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 7.0, evidence: 'D365 practice at 80% utilization. Southridge concurrency manageable', gaps: ['Senior D365 finance consultants in demand'], recommendation: 'Stage finance consultants for design/build phases.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 5.5, evidence: 'Expansion account but executive sponsorship not yet validated', gaps: ['Steering committee structure not confirmed', 'No vendor co-investment confirmed'], recommendation: 'AI-flagged conditions: validate executive sponsorship and steering structure pre-execution.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 7.0, evidence: 'D365 sizing standard but SAP migration variance higher', gaps: ['Data migration effort historically under-estimated by 20%'], recommendation: 'Buffer 20% on data migration effort. Re-baseline post-design phase.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 9.0, evidence: 'No special regulatory requirements', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: 'Southridge D365 F&O Transformation', client: 'Southridge Video', industry: 'Media', serviceLine: 'Dynamics 365', budget: '$2.8M', duration: '24 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Setup Maturity 92 — directly applicable setup discipline. David Chen leveraged Trey Research lessons.' },
      { name: 'Trey Research D365 Sales & CS', client: 'Trey Research Inc', industry: 'Research', serviceLine: 'Dynamics 365', budget: '$1.2M', duration: '10 months', outcome: 'green', finalHealth: 'green', csat: 9.0, marginVariance: 1.0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Phased rollout with power-user champions drove 92% adoption.' },
      { name: 'World Wide Importers D365 CE', client: 'World Wide Importers', industry: 'Logistics', serviceLine: 'Dynamics 365', budget: '$980K', duration: '11 months', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Power-user champions pattern applied.' },
      { name: 'Consolidated Messenger D365 F&O (in approval)', client: 'Consolidated Messenger', industry: 'Logistics', serviceLine: 'Dynamics 365', budget: '$2.28M', duration: '28 months', outcome: 'red', finalHealth: 'red', csat: 0, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'CAUTIONARY: Similar Tier 3 D365 F&O multi-country deal flagged for review — 70% historical success at this complexity.' },
    ],
    appliedLessons: [
      { title: 'Phased D365 rollout with power-user champions drives 92% adoption', category: 'success_pattern', sourceProject: 'Trey Research', applicability: 92, description: 'Rolling out to 15-person power-user group first, then expanding, drove 92% adoption at 60 days.', actionable: 'Adopt power-user champion model: 15 finance leads pilot first, then expand.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: "success_pattern", sourceProject: "Munson's Pickles", applicability: 95, description: "Visible C-level sponsorship prevented scope disputes.", actionable: 'AI-flagged condition: validate executive sponsorship and steering committee structure pre-execution.' },
      { title: 'M&A risk not captured in RAID log leads to project cancellation', category: 'failure_mode', sourceProject: 'Contoso Sports D365 CE', applicability: 70, description: 'Acquired client cancelled mid-project ($340K loss).', actionable: 'M&A risk as standing RAID for any 24+ month ERP program.' },
    ],
    recommendedTeam: [
      { pmName: 'David Chen', role: 'Project Manager', relevantExperience: 'Southridge D365 F&O PM (Day 30 maturity 92) · 3 D365 implementations', csatHistory: 8.5, capacityBand: 'committed', availability: 'Limited (Southridge concurrent)', trackRecord: 'Highest D365 maturity score in portfolio' },
      { pmName: 'Kevin Park', role: 'Technical Lead', relevantExperience: 'D365 F&O cutover specialist · Southridge TL', csatHistory: 8.2, capacityBand: 'committed', availability: 'Available November', trackRecord: 'Cutover veteran on 4 D365 programs' },
      { pmName: 'Pieter van Dijk', role: 'Project Manager', relevantExperience: 'World Wide Importers D365 CE PM · adjacent expertise', csatHistory: 8.3, capacityBand: 'available', availability: 'Available October', trackRecord: 'D365 delivery on time' },
      { pmName: 'Hiroshi Tanaka', role: 'QA Specialist', relevantExperience: 'D365 program QA · ERP migration risk specialist', csatHistory: 8.7, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Recovered Northwind Pharma G2G' },
    ],
    trajectory: {
      d30: 'green', d60: 'amber', d90: 'amber', end: 'green',
      predictedEwAtStart: 42, predictedEwAt90: 52, confidence: 'Medium',
      rationale: 'Mid-flight amber predicted during data migration phase. Recovers if cutover planning is rigorous. Without strong steering committee, trajectory deteriorates.',
    },
    keyMilestones: [
      { milestone: 'Risk Mitigation Plan signed (AI-flagged condition)', timing: 'Pre-contract', risk: 'high', signal: 'Non-negotiable per AI conditions', preventive: 'Delivery Principal sign-off required pre-signature' },
      { milestone: 'Steering Committee Charter (AI-flagged condition)', timing: 'Pre-kickoff', risk: 'high', signal: 'Client C-level sponsorship validation', preventive: 'Formal steering structure with CFO and CIO commitment' },
      { milestone: 'Data migration strategy approval', timing: 'Month 3', risk: 'high', signal: '#1 historical failure mode on SAP-to-D365', preventive: 'Apply Southridge data migration pattern' },
      { milestone: 'Cutover planning kickoff', timing: 'Month 9', risk: 'high', signal: '#2 historical failure mode', preventive: 'Kevin Park leads cutover. 4-week parallel run.' },
      { milestone: 'Power-user champion pilot', timing: 'Month 12', risk: 'medium', signal: 'Adoption inflection', preventive: 'Apply Trey Research power-user model' },
      { milestone: 'Go-live', timing: 'Month 18', risk: 'medium', signal: 'Cutover execution', preventive: 'Hypercare buffer 6 weeks' },
    ],
    failureModes: [
      { mode: 'Data migration fidelity issues at cutover (SAP-to-D365 pattern)', historicalFrequency: '2 of 5 D365 engagements at this scale', earlyWarnings: ['Data quality issues uncovered in profiling sprint', 'Source-target mapping incomplete by Month 6'], preventiveActions: ['Apply Southridge data migration pattern', 'Automated validation framework from Day 1'], costIfMaterializes: '~$500K and 8 weeks' },
      { mode: 'Cutover planning gaps lead to extended hypercare', historicalFrequency: '2 of 5 ERP cutovers', earlyWarnings: ['Cutover plan not signed off by client at Month 12', 'No parallel run scheduled'], preventiveActions: ['Kevin Park leads cutover from Day 1', '4-week parallel run baked into plan'], costIfMaterializes: '~$300K extended hypercare' },
      { mode: 'M&A risk during 18-month program (Contoso Sports pattern)', historicalFrequency: '1 of 6 long-duration D365 programs', earlyWarnings: ['Industry press of M&A activity', 'Slowed decision-making at client'], preventiveActions: ['Phase-gate sign-offs every 6 months', 'M&A as standing RAID'], costIfMaterializes: 'Up to project cancellation' },
    ],
    portfolioContext: {
      similarActive: 2, similarCompleted: 3, overallSuccessRate: 80, avgFinalCsat: 8.6, avgMarginVariance: 0.5, recentTrendDirection: 'stable',
    },
  },

  // ─── 6. Northwind Healthcare System (HIPAA) ──────────────────────────────
  'Northwind Healthcare System': {
    compositeScore: 8.5,
    successProbability: 84,
    confidence: 'High',
    executiveBrief: {
      successTier: 'High Confidence',
      closestAnalog: 'Direct analog: Lamna Healthcare Azure & Security Foundation (completed Green, 9.2 CSAT, HIPAA audit passed). Same regulatory profile, same delivery scope.',
      successProbability: '84% predicted success based on 3 comparable HIPAA security engagements. Lamna Healthcare reference is the strongest direct analog in the portfolio.',
      topRiskPattern: 'BAA (Business Associate Agreement) and PHI classification scope are non-negotiable pre-execution conditions. Both AI-flagged. Historical failure mode is HIPAA audit failure mid-flight when scope assumptions diverge from client Privacy Counsel.',
      capacityMatch: 'Sarah Mitchell (Lamna Healthcare PM, 9.2 CSAT) is the AI-recommended delivery lead. Direct precedent applies.',
      decisionGuidance: 'Approve with conditions. Sarah Mitchell as delivery lead (AI recommendation). BAA signed and PHI scope validated by client Privacy Counsel before Day 1 data access (both AI-flagged conditions). Apply Lamna Healthcare playbook directly.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 9.0, evidence: '3 comparable HIPAA security engagements. Lamna Healthcare is direct analog', gaps: [], recommendation: 'Apply Lamna Healthcare playbook line-for-line.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 8.5, evidence: 'HIPAA Sentinel pack + Purview PHI classification + Identity governance — all reusable', gaps: [], recommendation: 'Activate all 3 IP assets at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 9.5, evidence: 'Sarah Mitchell + Ray Kowalski (Lamna team) both available', gaps: [], recommendation: 'Pair Sarah Mitchell (PM) with Ray Kowalski (TL).' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 8.0, evidence: 'Healthcare vertical capacity adequate. APAC delivery network operational', gaps: [], recommendation: 'Standard staffing approach.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 7.5, evidence: '8-hospital network — strong CIO mandate. BAA process in motion', gaps: ['Privacy Counsel review pending', 'Cross-hospital governance not yet defined'], recommendation: 'AI-flagged conditions: BAA + PHI scope before Day 1 data access.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 8.0, evidence: 'Healthcare security sizing standard within 10%', gaps: [], recommendation: 'Standard sizing applies.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 7.5, evidence: 'HIPAA + HITECH — proven IP available', gaps: ['8-hospital governance complexity'], recommendation: 'Cross-hospital steering with single Privacy Counsel point-of-contact.' },
    ],
    comparables: [
      { name: 'Lamna Healthcare Azure & Security Foundation', client: 'Lamna Healthcare', industry: 'Healthcare', serviceLine: 'Security', budget: '$1.8M', duration: '9 months', outcome: 'green', finalHealth: 'green', csat: 9.2, marginVariance: -1.0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'DIRECT ANALOG. HIPAA audit passed. 9.2 CSAT. Same delivery team available.' },
      { name: 'Best For You Organics Health Cloud', client: 'Best For You Organics', industry: 'Healthcare', serviceLine: 'Cloud + Compliance', budget: '$1.2M', duration: '12 months', outcome: 'green', finalHealth: 'green', csat: 8.6, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'HIPAA compliance validated. Pilot clinic positive feedback. On plan.' },
      { name: 'Proseware SOC Modernization',    client: 'Proseware Inc',      industry: 'Technology',  serviceLine: 'Security/SOC', budget: '$760K',  duration: '9 months',  outcome: 'green', finalHealth: 'green', csat: 9.0, marginVariance: 1.5, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Sentinel baseline + Defender XDR pattern transferable.' },
    ],
    appliedLessons: [
      { title: 'HIPAA compliance pre-assessment reduces regulatory delivery risk by 60%', category: 'risk_mitigation', sourceProject: 'Lamna Healthcare', applicability: 98, description: '2-week HIPAA pre-assessment identified 3 critical gaps that saved $120K and 6 weeks.', actionable: 'MANDATORY 2-week HIPAA pre-assessment as pre-kickoff sprint.' },
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 95, description: 'Bi-weekly cadence catches risks earlier.', actionable: 'Bi-weekly RAID cadence from Day 1.' },
      { title: 'Capture regulatory volatility as a standing RAID risk', category: 'risk_mitigation', sourceProject: 'Northwind Pharma', applicability: 85, description: 'HIPAA/HITECH updates can materialize mid-flight.', actionable: 'Regulatory volatility as Day-1 RAID. Backup Privacy Counsel pre-identified.' },
    ],
    recommendedTeam: [
      { pmName: 'Sarah Mitchell', role: 'Project Manager', relevantExperience: 'Lamna Healthcare PM (9.2 CSAT) · AI-recommended', csatHistory: 9.2, capacityBand: 'available', availability: 'Available July', trackRecord: 'HIPAA audit passed. Reference customer secured.' },
      { pmName: 'Ray Kowalski', role: 'Technical Lead', relevantExperience: 'Lamna Healthcare TL · HIPAA Sentinel deployment', csatHistory: 9.2, capacityBand: 'committed', availability: 'Available August', trackRecord: 'Same team continuity.' },
      { pmName: 'Mei Chen', role: 'Project Manager', relevantExperience: 'Healthcare cloud expertise · Best For You Organics PM', csatHistory: 8.6, capacityBand: 'committed', availability: 'Concurrent backup', trackRecord: 'Healthcare vertical experience' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 30, predictedEwAt90: 32, confidence: 'High',
      rationale: 'Direct Lamna Healthcare analog. Predicted to maintain Green throughout. Day 30 maturity expected 85+.',
    },
    keyMilestones: [
      { milestone: 'BAA countersigned (AI-flagged condition)', timing: 'Pre-Day 1 data access', risk: 'high', signal: 'Non-negotiable HIPAA requirement', preventive: 'Legal pre-engagement workstream' },
      { milestone: 'PHI classification scope reviewed (AI-flagged condition)', timing: 'Pre-kickoff', risk: 'high', signal: 'Client Privacy Counsel sign-off required', preventive: 'Schedule Privacy Counsel review at contract execution' },
      { milestone: 'HIPAA pre-assessment complete', timing: 'Day 0-14', risk: 'medium', signal: 'Apply Lamna lesson — surfaces gaps early', preventive: 'Sarah Mitchell leads pre-assessment' },
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low', signal: 'Standard checkpoint', preventive: 'Direct Lamna pattern application' },
      { milestone: 'Purview PHI classification operational', timing: 'Month 4', risk: 'medium', signal: 'Critical delivery milestone', preventive: 'Reuse Lamna PHI classification rules' },
      { milestone: 'HIPAA audit readiness', timing: 'Month 9', risk: 'low', signal: 'Audit dress rehearsal', preventive: 'Lamna audit playbook' },
    ],
    failureModes: [
      { mode: 'BAA delays prevent Day 1 data access', historicalFrequency: '1 of 3 healthcare engagements when BAA started post-kickoff', earlyWarnings: ['BAA not signed at contract execution', 'Client legal team not engaged'], preventiveActions: ['AI-flagged condition: BAA signed before Day 1 data access', 'Legal workstream pre-kickoff'], costIfMaterializes: '~$80K idle team cost per week' },
      { mode: 'PHI scope misalignment with client Privacy Counsel', historicalFrequency: '1 of 3 healthcare engagements', earlyWarnings: ['Privacy Counsel review not scheduled', 'PHI classification rules disputed mid-flight'], preventiveActions: ['AI-flagged condition: Privacy Counsel review pre-kickoff', 'Lamna PHI classification rules as baseline'], costIfMaterializes: '~$200K in re-classification effort' },
      { mode: 'Cross-hospital governance gaps slow execution', historicalFrequency: '1 of 1 multi-hospital engagement', earlyWarnings: ['No single Privacy Counsel point-of-contact', 'Inconsistent IT readiness across hospitals'], preventiveActions: ['Cross-hospital steering committee', 'Single Privacy Counsel POC'], costIfMaterializes: '~3 month schedule extension' },
    ],
    portfolioContext: {
      similarActive: 1, similarCompleted: 2, overallSuccessRate: 100, avgFinalCsat: 8.9, avgMarginVariance: -0.5, recentTrendDirection: 'stable',
    },
  },

  // ─── 7. Contoso Financial Group ─────────────────────────────────────────
  'Contoso Financial Group': {
    compositeScore: 6.5,
    successProbability: 67,
    confidence: 'Medium',
    executiveBrief: {
      successTier: 'Cautious',
      closestAnalog: 'Most similar to Adatum Cloud Foundation (current Amber, recovering) and Wingtip Toys Cloud Native (Red, cautionary). Fabrikam Bank Core Banking (current Red) is the closest banking-sector analog and the strongest cautionary signal.',
      successProbability: '67% predicted success based on 4 comparable cloud migrations. Banking-sector regulatory overlay materially increases risk vs general cloud migration. Fabrikam Bank G2G is the live cautionary tale.',
      topRiskPattern: 'CRITICAL: Fabrikam Bank Core Banking is in active Get-to-Green with FFIEC scope expansion driving 40% scope growth post-discovery. Same pattern applies here. FFIEC + OCC compliance review must be complete pre-execution.',
      capacityMatch: 'Ravi Krishnan is committed to Fabrikam Bank rescue. Sarah Mitchell is a strong backup with regulated industry experience. Pre-execute discovery is essential regardless of PM.',
      decisionGuidance: 'Approve with conditions. Mandatory FFIEC compliance review pre-contract. Eviden subcontract with regulatory obligations. Phase 2 SOW should target +2pt margin improvement after Phase 1 lessons. Apply Fabrikam Bank G2G learnings.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 6.5, evidence: '4 comparable migrations, but banking regulatory overlay is unique. Fabrikam Bank in active G2G', gaps: ['Banking-specific regulatory complexity'], recommendation: 'Apply Fabrikam Bank G2G learnings directly.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 8.0, evidence: 'Cloud Adoption playbook + Zero Trust overlay both available', gaps: ['Banking-specific playbook still maturing'], recommendation: 'Combine general cloud playbook with Fabrikam Bank learnings.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 7.0, evidence: 'Sarah Mitchell available. Banking SMEs in demand', gaps: ['Best-fit PM (Ravi Krishnan) committed to Fabrikam G2G'], recommendation: 'Sarah Mitchell with banking SME augmentation.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 6.5, evidence: 'Banking SME demand elevated. Eviden coordination adds load', gaps: ['Banking domain SMEs scarce'], recommendation: 'Schedule banking SMEs early. Eviden SOW with quality terms.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 6.0, evidence: 'Expansion account but executive sponsorship not yet validated', gaps: ['FFIEC + OCC compliance review not complete'], recommendation: 'AI-flagged condition: FFIEC review sign-off before countersigning.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 6.5, evidence: 'Banking regulatory overhead adds variance', gaps: ['26% margin is tight for regulatory complexity'], recommendation: 'Phase 2 SOW target +2pt margin improvement.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 5.5, evidence: 'FFIEC + OCC requirements need explicit treatment', gaps: ['Eviden subcontract must cover regulatory obligations'], recommendation: 'Eviden SOW addendum with explicit regulatory obligations.' },
    ],
    comparables: [
      { name: 'Fabrikam Bank Core Banking Modernization', client: 'Fabrikam Bank', industry: 'Financial Services', serviceLine: 'Cloud Adoption', budget: '$4.2M', duration: '18 months', outcome: 'red', finalHealth: 'red', csat: 6.5, marginVariance: -15, scheduleVariance: 14, relevance: 'High', keyTakeaway: 'CAUTIONARY (LIVE): FFIEC scope expanded 40% post-discovery. Active G2G. Apply lessons directly.' },
      { name: 'Adatum Cloud Foundation',         client: 'Adatum Corporation', industry: 'Technology', serviceLine: 'Cloud Adoption', budget: '$540K', duration: '6 months', outcome: 'amber', finalHealth: 'amber', csat: 7.8, marginVariance: -3, scheduleVariance: 4, relevance: 'Medium', keyTakeaway: 'ExpressRoute delay pattern — proactive client communication recovered relationship.' },
      { name: 'Wingtip Toys Cloud Native Modernization', client: 'Wingtip Toys', industry: 'Retail', serviceLine: 'Cloud Adoption', budget: '$1.9M', duration: '12 months', outcome: 'red', finalHealth: 'red', csat: 6.0, marginVariance: -15, scheduleVariance: 12, relevance: 'Medium', keyTakeaway: "Under-scoped discovery — same risk applies if FFIEC scope not validated pre-execution." },
      { name: "Margie's Travel Azure Migration", client: "Margie's Travel", industry: "Travel", serviceLine: "Cloud Adoption", budget: "$890K", duration: "10 months", outcome: "green", finalHealth: "green", csat: 8.5, marginVariance: 1.0, scheduleVariance: 0, relevance: "Medium", keyTakeaway: "Standard migration pattern — what good looks like when regulatory overhead is light." },
    ],
    appliedLessons: [
      { title: 'Pre-sales under-scoping of regulatory complexity in financial services', category: 'failure_mode', sourceProject: 'Fabrikam Bank', applicability: 95, description: 'FFIEC regulatory scope was 40% larger than pre-sales estimate. $1.2M re-baseline cost, 4-month schedule extension.', actionable: 'AI-flagged condition: FFIEC compliance review sign-off before countersigning.' },
      { title: 'Vendor SOW must include regulatory and quality obligations', category: 'risk_mitigation', sourceProject: 'Contoso Financial Group (precedent)', applicability: 90, description: 'Vendor (Eviden) SOW should explicitly cover regulatory-aware configuration.', actionable: 'Eviden subcontract addendum with explicit regulatory obligations.' },
      { title: 'Incomplete application discovery leads to architecture redesign', category: 'failure_mode', sourceProject: 'Wingtip Toys', applicability: 80, description: 'Inadequate discovery caused 6-week redesign.', actionable: '2-week pre-execute discovery sprint with independent validation.' },
    ],
    recommendedTeam: [
      { pmName: 'Sarah Mitchell', role: 'Project Manager', relevantExperience: 'Regulated industry experience (Lamna Healthcare) · Adatum Cloud Foundation', csatHistory: 9.2, capacityBand: 'committed', availability: 'Available August', trackRecord: 'Strong recovery and regulated industry track record' },
      { pmName: 'Karina Vasquez', role: 'QA Specialist', relevantExperience: 'Fabrikam Bank G2G QA specialist · banking regulatory expert', csatHistory: 8.5, capacityBand: 'committed', availability: 'Steering support', trackRecord: 'Active banking rescue experience' },
      { pmName: 'Felix Wagner', role: 'Technical Lead', relevantExperience: 'Wingtip Toys post-recovery TL · cloud architecture veteran', csatHistory: 7.8, capacityBand: 'available', availability: 'Available July', trackRecord: 'Learned from failure mode' },
    ],
    trajectory: {
      d30: 'amber', d60: 'amber', d90: 'green', end: 'amber',
      predictedEwAtStart: 50, predictedEwAt90: 48, confidence: 'Medium',
      rationale: 'Day 30 and Day 60 amber predicted due to FFIEC regulatory discovery. Recovers to Green by Day 90 IF compliance review is complete pre-execution. Without it, Fabrikam Bank trajectory applies.',
    },
    keyMilestones: [
      { milestone: 'FFIEC compliance review sign-off (AI-flagged)', timing: 'Pre-contract', risk: 'high', signal: 'Non-negotiable per AI conditions', preventive: 'Compliance review at Day -14' },
      { milestone: 'Eviden SOW addendum signed (AI-flagged)', timing: 'Pre-contract', risk: 'high', signal: 'Vendor regulatory obligations', preventive: 'Eviden legal review pre-signature' },
      { milestone: 'Pre-execute discovery sprint', timing: 'Pre-kickoff (2 wk)', risk: 'high', signal: 'Apply Wingtip Toys lesson', preventive: 'Independent app inventory + regulatory scope validation' },
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'medium', signal: 'Discovery findings reflected', preventive: 'Standard checkpoint with regulatory review' },
      { milestone: 'Phase 1 cutover (40 workloads)', timing: 'Month 9', risk: 'medium', signal: 'Lift-shift execution', preventive: 'Apply Margie\'s Travel cutover pattern' },
      { milestone: 'Phase 2 SOW negotiation', timing: 'Month 11', risk: 'low', signal: 'Margin improvement target', preventive: 'Apply Phase 1 lessons for +2pt margin' },
    ],
    failureModes: [
      { mode: 'FFIEC regulatory scope expansion (Fabrikam Bank pattern)', historicalFrequency: '1 of 2 financial services engagements', earlyWarnings: ['Day 30 maturity score below 75', 'Compliance review not complete pre-execution'], preventiveActions: ['AI-flagged condition: FFIEC review pre-contract', 'Backup banking SME pre-identified'], costIfMaterializes: '~$800K and 3 months' },
      { mode: 'Eviden vendor regulatory compliance gaps', historicalFrequency: '1 of 2 with regulated vendor participation', earlyWarnings: ['Eviden SLA misses on regulatory deliverables', 'Quality variance in vendor-led compliance work'], preventiveActions: ['Eviden SOW addendum with explicit regulatory obligations', 'Monthly Eviden steering with regulatory checkpoint'], costIfMaterializes: '~$200K margin impact' },
      { mode: 'Phase 2 margin compression below break-even', historicalFrequency: '1 of 3 expansion deals at tight margin', earlyWarnings: ['Phase 1 actuals exceeding Phase 1 budget', 'Phase 2 scope creep'], preventiveActions: ['Phase 1 actuals tracked weekly', 'Phase 2 SOW negotiation guided by Phase 1 lessons'], costIfMaterializes: '~$150K margin compression' },
    ],
    portfolioContext: {
      similarActive: 3, similarCompleted: 1, overallSuccessRate: 60, avgFinalCsat: 7.2, avgMarginVariance: -8, recentTrendDirection: 'declining',
    },
  },

  // ─── 8. Consolidated Messenger ───────────────────────────────────────────
  'Consolidated Messenger': {
    compositeScore: 4.5,
    successProbability: 52,
    confidence: 'Low',
    executiveBrief: {
      successTier: 'Constrained',
      closestAnalog: 'Closest precedent is Northwind Traders D365 F&O (also in approval with conditions). At this complexity tier (28 months, 14 countries, 30% vendor), historical success rate is 70% — below the 80% threshold for standard approval.',
      successProbability: '52% predicted success. Multi-country D365 F&O at this scale (14 entities, 4 waves, 28 months) is among the highest-risk patterns in delivery history. Estimate accuracy notably lower than baseline D365.',
      topRiskPattern: 'COMPOUND RISK: 14-country local payroll integration variance + 30% vendor participation + 22% margin + 28-month duration. Any single factor would elevate risk; combination is critical. SOW lacks country-level phasing and out-of-scope per jurisdiction.',
      capacityMatch: 'No PM in current portfolio has multi-country D365 F&O experience at this scale. Recommendation is to defer until Architecture Review Board sign-off and revised SOW.',
      decisionGuidance: 'NOT recommended for approval in current state. Required before resubmission: (1) revised SOW with country-level phasing, (2) Architecture Review Board assessment, (3) vendor SLA + indemnity terms, (4) margin floor review with Finance. AI recommendation: Flag for Review.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 5.0, evidence: '2 comparable engagements but only 1 at this scale (70% success rate)', gaps: ['14-country variance is novel scale', 'No vendor partnership at this percentage'], recommendation: 'Architecture Review Board assessment required.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 5.5, evidence: 'D365 F&O playbook applies but multi-country variant not mature', gaps: ['SOW template not used (deal risk factor)'], recommendation: 'Standard SOW template required for resubmission.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 4.0, evidence: 'No current PM has 14-country D365 F&O experience', gaps: ['Best-fit PMs (David Chen, Pieter van Dijk) lack multi-country experience at this scale'], recommendation: 'External multi-country D365 advisor or defer.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 4.5, evidence: 'D365 practice cannot absorb 28-month commitment at this scale', gaps: ['Senior D365 multi-country expertise gap'], recommendation: 'Resource model requires external augmentation.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 4.5, evidence: 'New logo with no delivery history', gaps: ['28-month decision-making complexity', 'No vendor co-investment confirmed'], recommendation: 'Validate executive sponsorship and 28-month commitment.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 3.5, evidence: '14-country local payroll variance unknown', gaps: ['Country-level scope phasing not defined', 'No out-of-scope per jurisdiction'], recommendation: 'Country-level phase plans required.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 4.5, evidence: 'GDPR + 14 local payroll jurisdictions', gaps: ['Per-jurisdiction compliance scope not defined'], recommendation: 'Jurisdiction-by-jurisdiction compliance map required.' },
    ],
    comparables: [
      { name: 'Northwind Traders D365 F&O (in approval)', client: 'Northwind Traders', industry: 'Logistics', serviceLine: 'Dynamics 365', budget: '$1.6M', duration: '18 months', outcome: 'amber', finalHealth: 'amber', csat: 0, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Pending approval with conditions. Smaller scale (1 country) but same pattern.' },
      { name: 'Southridge D365 F&O Transformation', client: 'Southridge Video', industry: 'Media', serviceLine: 'Dynamics 365', budget: '$2.8M', duration: '24 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Single-country reference. Multi-country variance is the key delta.' },
      { name: 'Contoso Sports D365 CE (cancelled)', client: 'Contoso Sports', industry: 'Media', serviceLine: 'Dynamics 365', budget: '$890K', duration: '8 months', outcome: 'red', finalHealth: 'red', csat: 0, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'CAUTIONARY: M&A risk during 28-month program is real. Phase-gate sign-offs essential.' },
    ],
    appliedLessons: [
      { title: 'M&A risk not captured in RAID log leads to project cancellation', category: 'failure_mode', sourceProject: 'Contoso Sports D365 CE', applicability: 85, description: '28-month duration is long enough for M&A to materialize. $340K loss on previous cancellation.', actionable: 'Phase-gate sign-offs every 6 months. M&A as standing RAID risk.' },
      { title: 'Pre-sales under-scoping of regulatory complexity', category: 'failure_mode', sourceProject: 'Fabrikam Bank', applicability: 90, description: 'Regulatory complexity in 14 jurisdictions is highly likely to expose pre-sales gaps.', actionable: 'Jurisdiction-level compliance scope mandatory before approval.' },
      { title: 'Phased D365 rollout with power-user champions drives 92% adoption', category: 'success_pattern', sourceProject: 'Trey Research', applicability: 75, description: 'Phased rollout pattern works.', actionable: 'Country-by-country waves with regional power users.' },
    ],
    recommendedTeam: [
      { pmName: 'External D365 multi-country advisor', role: 'Engagement Director', relevantExperience: 'No current PM has 14-country D365 F&O experience at this scale', csatHistory: 0, capacityBand: 'overloaded', availability: 'Requires external augmentation', trackRecord: 'Resource gap identified' },
      { pmName: 'David Chen', role: 'Project Manager', relevantExperience: 'Southridge D365 F&O PM · single-country experience', csatHistory: 8.5, capacityBand: 'committed', availability: 'Committed to Southridge through 2028', trackRecord: 'Not available' },
      { pmName: 'Pieter van Dijk', role: 'Project Manager', relevantExperience: 'World Wide Importers D365 CE PM · adjacent expertise', csatHistory: 8.3, capacityBand: 'available', availability: 'Available October', trackRecord: 'D365 delivery on time at smaller scale' },
    ],
    trajectory: {
      d30: 'amber', d60: 'red', d90: 'red', end: 'amber',
      predictedEwAtStart: 65, predictedEwAt90: 80, confidence: 'Low',
      rationale: 'Without revised SOW and ARB sign-off, trajectory predicted to mirror Fabrikam Bank or Wingtip Toys patterns. Recovery requires conditional approval framework similar to Northwind Traders.',
    },
    keyMilestones: [
      { milestone: 'Architecture Review Board assessment', timing: 'Pre-contract', risk: 'high', signal: 'Non-negotiable for resubmission', preventive: 'ARB scheduled before any further deal progression' },
      { milestone: 'Country-level phase plans (SOW required)', timing: 'Pre-contract', risk: 'high', signal: 'AI-flagged condition', preventive: 'Revised SOW with per-jurisdiction phasing' },
      { milestone: 'Vendor SLA and indemnity terms', timing: 'Pre-contract', risk: 'high', signal: 'AI-flagged condition', preventive: 'Vendor subcontract with explicit terms' },
      { milestone: 'Margin floor review (Finance)', timing: 'Pre-contract', risk: 'high', signal: 'AI-flagged condition', preventive: 'Finance review and overrun contingency' },
      { milestone: 'Delivery leader resource confirmation', timing: 'Pre-contract', risk: 'high', signal: 'AI-flagged condition', preventive: 'Resource availability for 28-month commitment' },
    ],
    failureModes: [
      { mode: 'Country-level scope variance exceeds estimate', historicalFrequency: '1 of 1 multi-country D365 at this scale', earlyWarnings: ['Country-level scope not defined upfront', 'Local payroll integration variance >25%'], preventiveActions: ['MANDATORY country-level phase plans', 'Per-jurisdiction scope and out-of-scope defined'], costIfMaterializes: '~$1.5M and 6 months' },
      { mode: 'Vendor SLA non-performance', historicalFrequency: '2 of 4 with 30%+ vendor participation', earlyWarnings: ['Vendor SLA terms vague', 'Indemnity terms absent'], preventiveActions: ['MANDATORY vendor SLA and indemnity terms', 'Monthly vendor steering with performance review'], costIfMaterializes: '~$500K vendor performance gap' },
      { mode: 'M&A during 28-month program', historicalFrequency: '1 of 6 long-duration ERP programs', earlyWarnings: ['Industry press of M&A activity', 'Slowed decision-making at client'], preventiveActions: ['Phase-gate sign-offs every 6 months', 'M&A as standing RAID'], costIfMaterializes: 'Up to project cancellation' },
      { mode: 'Margin compression below break-even at 22%', historicalFrequency: '2 of 3 deals at tight margin with vendor', earlyWarnings: ['Phase 1 actuals exceeding budget', 'Scope creep without change requests'], preventiveActions: ['Margin floor review with Finance', 'Strict change request discipline'], costIfMaterializes: '~$600K margin compression' },
    ],
    portfolioContext: {
      similarActive: 1, similarCompleted: 1, overallSuccessRate: 50, avgFinalCsat: 7.0, avgMarginVariance: -10, recentTrendDirection: 'declining',
    },
  },

  'Contoso Energy Phase 2': {
    compositeScore: 9.4,
    successProbability: 92,
    confidence: 'High',
    executiveBrief: {
      successTier: 'High Confidence',
      closestAnalog: 'Closest analog: Proseware SOC Modernization. See Comparable Engagements panel for full precedent breakdown.',
      successProbability: '92% predicted success based on 8 comparable engagements with 94% historical success rate.',
      topRiskPattern: 'Standard low-complexity risks apply. Knowledge Network lessons embedded as preventive actions.',
      capacityMatch: 'Recommended team identified via Delivery Agent — see Recommended Team panel for capacity bands.',
      decisionGuidance: 'Approve at recommended tier. Apply Knowledge Network lessons at kickoff.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 9.6, evidence: '8 comparable engagements with 94% delivery success rate.', gaps: [], recommendation: 'Apply established playbook from closest analog.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 9.5, evidence: 'Service-line playbook available and applicable.', gaps: [], recommendation: 'Activate playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 9.4, evidence: 'Qualified PMs with relevant experience available.', gaps: [], recommendation: 'See Recommended Team panel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 9.1, evidence: 'Practice capacity adequate for engagement size.', gaps: [], recommendation: 'Standard staffing plan.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 8.9, evidence: 'Client sponsorship documented in deal qualification.', gaps: [], recommendation: 'Confirm steering structure at kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 9.0, evidence: 'Standard sizing model applies for low-complexity work.', gaps: [], recommendation: 'Standard milestone model.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 9.9, evidence: 'Regulatory profile manageable with proven IP.', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: 'Proseware SOC Modernization', client: 'Proseware', industry: 'Comparable', serviceLine: 'Security', budget: '$385K range', duration: '0 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Direct service-line analog. Apply established playbook.' },
      { name: 'City Power & Light SOC Modernization', client: 'City', industry: 'Comparable', serviceLine: 'Security', budget: 'Similar', duration: 'Similar', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Secondary pattern reference.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risks earlier than monthly.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: 'success_pattern', sourceProject: "Munson's Pickles", applicability: 85, description: 'Visible C-level sponsorship drives delivery quality.', actionable: 'Confirm executive sponsor at monthly steering.' },
    ],
    recommendedTeam: [
      { pmName: 'Delivery Agent recommendation', role: 'Project Manager', relevantExperience: 'Service-line specialist matched via Delivery Agent', csatHistory: 8.7, capacityBand: 'available', availability: 'Available at deal kickoff', trackRecord: 'Strong track record in similar engagements' },
      { pmName: 'QA Specialist on standby', role: 'QA Specialist', relevantExperience: 'Cross-engagement QA expertise', csatHistory: 8.8, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Available via QA Director allocation' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 35, predictedEwAt90: 30, confidence: 'High',
      rationale: 'Predicted to track Green throughout.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low', signal: 'Standard checkpoint', preventive: 'Apply playbook setup discipline' },
      { milestone: 'Phase 1 acceptance', timing: 'Month 3-4', risk: 'low', signal: 'First major delivery milestone', preventive: 'Comparable engagement pattern applies' },
      { milestone: 'Mid-engagement health review', timing: 'Month 6', risk: 'medium', signal: 'Trajectory inflection point', preventive: 'QA Director check-in' },
    ],
    failureModes: [
      { mode: 'Standard low-complexity risks', historicalFrequency: '0 of 8 comparable engagements', earlyWarnings: ['Day 30 maturity below 75', 'Late client stakeholder engagement'], preventiveActions: ['Apply Knowledge Network preventive playbook', 'Bi-weekly RAID cadence'], costIfMaterializes: 'Manageable with active intervention' },
    ],
    portfolioContext: {
      similarActive: 6, similarCompleted: 7, overallSuccessRate: 94, avgFinalCsat: 8.6, avgMarginVariance: 0.6, recentTrendDirection: 'stable',
    },
  },
  'The Volcano Coffee Company Phase 2': {
    compositeScore: 9.2,
    successProbability: 88,
    confidence: 'High',
    executiveBrief: {
      successTier: 'High Confidence',
      closestAnalog: 'Closest analog: The Volcano Coffee Phase 1. See Comparable Engagements panel for full precedent breakdown.',
      successProbability: '88% predicted success based on 4 comparable engagements with 92% historical success rate.',
      topRiskPattern: 'Standard low-complexity risks apply. Knowledge Network lessons embedded as preventive actions.',
      capacityMatch: 'Recommended team identified via Delivery Agent — see Recommended Team panel for capacity bands.',
      decisionGuidance: 'Approve at recommended tier. Apply Knowledge Network lessons at kickoff.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 9.4, evidence: '4 comparable engagements with 92% delivery success rate.', gaps: [], recommendation: 'Apply established playbook from closest analog.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 9.3, evidence: 'Service-line playbook available and applicable.', gaps: [], recommendation: 'Activate playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 9.2, evidence: 'Qualified PMs with relevant experience available.', gaps: [], recommendation: 'See Recommended Team panel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 8.9, evidence: 'Practice capacity adequate for engagement size.', gaps: [], recommendation: 'Standard staffing plan.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 8.7, evidence: 'Client sponsorship documented in deal qualification.', gaps: [], recommendation: 'Confirm steering structure at kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 8.8, evidence: 'Standard sizing model applies for low-complexity work.', gaps: [], recommendation: 'Standard milestone model.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 9.7, evidence: 'Regulatory profile manageable with proven IP.', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: 'The Volcano Coffee Phase 1', client: 'The', industry: 'Comparable', serviceLine: 'Data Analytics', budget: '$290K range', duration: '12 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Direct service-line analog. Apply established playbook.' },
      { name: 'Secondary reference', client: 'Reference', industry: 'Comparable', serviceLine: 'Data Analytics', budget: 'Similar', duration: 'Similar', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Secondary pattern reference.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risks earlier than monthly.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: 'success_pattern', sourceProject: "Munson's Pickles", applicability: 85, description: 'Visible C-level sponsorship drives delivery quality.', actionable: 'Confirm executive sponsor at monthly steering.' },
    ],
    recommendedTeam: [
      { pmName: 'Delivery Agent recommendation', role: 'Project Manager', relevantExperience: 'Service-line specialist matched via Delivery Agent', csatHistory: 8.7, capacityBand: 'available', availability: 'Available at deal kickoff', trackRecord: 'Strong track record in similar engagements' },
      { pmName: 'QA Specialist on standby', role: 'QA Specialist', relevantExperience: 'Cross-engagement QA expertise', csatHistory: 8.8, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Available via QA Director allocation' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 35, predictedEwAt90: 30, confidence: 'High',
      rationale: 'Predicted to track Green throughout.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low', signal: 'Standard checkpoint', preventive: 'Apply playbook setup discipline' },
      { milestone: 'Phase 1 acceptance', timing: 'Month 3-4', risk: 'low', signal: 'First major delivery milestone', preventive: 'Comparable engagement pattern applies' },
      { milestone: 'Mid-engagement health review', timing: 'Month 6', risk: 'medium', signal: 'Trajectory inflection point', preventive: 'QA Director check-in' },
    ],
    failureModes: [
      { mode: 'Standard low-complexity risks', historicalFrequency: '0 of 4 comparable engagements', earlyWarnings: ['Day 30 maturity below 75', 'Late client stakeholder engagement'], preventiveActions: ['Apply Knowledge Network preventive playbook', 'Bi-weekly RAID cadence'], costIfMaterializes: 'Manageable with active intervention' },
    ],
    portfolioContext: {
      similarActive: 2, similarCompleted: 3, overallSuccessRate: 92, avgFinalCsat: 8.6, avgMarginVariance: 0.8, recentTrendDirection: 'stable',
    },
  },
  'Wide World Importers Power BI': {
    compositeScore: 9.5,
    successProbability: 94,
    confidence: 'High',
    executiveBrief: {
      successTier: 'High Confidence',
      closestAnalog: 'Closest analog: Trey Research D365 Sales & CS. See Comparable Engagements panel for full precedent breakdown.',
      successProbability: '94% predicted success based on 6 comparable engagements with 95% historical success rate.',
      topRiskPattern: 'Standard low-complexity risks apply. Knowledge Network lessons embedded as preventive actions.',
      capacityMatch: 'Recommended team identified via Delivery Agent — see Recommended Team panel for capacity bands.',
      decisionGuidance: 'Approve at recommended tier. Apply Knowledge Network lessons at kickoff.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 9.7, evidence: '6 comparable engagements with 95% delivery success rate.', gaps: [], recommendation: 'Apply established playbook from closest analog.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 9.6, evidence: 'Service-line playbook available and applicable.', gaps: [], recommendation: 'Activate playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 9.5, evidence: 'Qualified PMs with relevant experience available.', gaps: [], recommendation: 'See Recommended Team panel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 9.2, evidence: 'Practice capacity adequate for engagement size.', gaps: [], recommendation: 'Standard staffing plan.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 9.0, evidence: 'Client sponsorship documented in deal qualification.', gaps: [], recommendation: 'Confirm steering structure at kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 9.1, evidence: 'Standard sizing model applies for low-complexity work.', gaps: [], recommendation: 'Standard milestone model.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 10.0, evidence: 'Regulatory profile manageable with proven IP.', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: 'Trey Research D365 Sales & CS', client: 'Trey', industry: 'Comparable', serviceLine: 'Data Analytics', budget: '$185K range', duration: '0 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Direct service-line analog. Apply established playbook.' },
      { name: "Munson's Pickles Fabric & Power BI", client: "Munson's", industry: 'Comparable', serviceLine: 'Data Analytics', budget: 'Similar', duration: 'Similar', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Secondary pattern reference.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risks earlier than monthly.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: "success_pattern", sourceProject: "Munson's Pickles", applicability: 85, description: "Visible C-level sponsorship drives delivery quality.", actionable: 'Confirm executive sponsor at monthly steering.' },
    ],
    recommendedTeam: [
      { pmName: 'Delivery Agent recommendation', role: 'Project Manager', relevantExperience: 'Service-line specialist matched via Delivery Agent', csatHistory: 8.7, capacityBand: 'available', availability: 'Available at deal kickoff', trackRecord: 'Strong track record in similar engagements' },
      { pmName: 'QA Specialist on standby', role: 'QA Specialist', relevantExperience: 'Cross-engagement QA expertise', csatHistory: 8.8, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Available via QA Director allocation' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 35, predictedEwAt90: 30, confidence: 'High',
      rationale: 'Predicted to track Green throughout.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low', signal: 'Standard checkpoint', preventive: 'Apply playbook setup discipline' },
      { milestone: 'Phase 1 acceptance', timing: 'Month 3-4', risk: 'low', signal: 'First major delivery milestone', preventive: 'Comparable engagement pattern applies' },
      { milestone: 'Mid-engagement health review', timing: 'Month 6', risk: 'medium', signal: 'Trajectory inflection point', preventive: 'QA Director check-in' },
    ],
    failureModes: [
      { mode: 'Standard low-complexity risks', historicalFrequency: '0 of 6 comparable engagements', earlyWarnings: ['Day 30 maturity below 75', 'Late client stakeholder engagement'], preventiveActions: ['Apply Knowledge Network preventive playbook', 'Bi-weekly RAID cadence'], costIfMaterializes: 'Manageable with active intervention' },
    ],
    portfolioContext: {
      similarActive: 4, similarCompleted: 5, overallSuccessRate: 95, avgFinalCsat: 8.6, avgMarginVariance: 1.0, recentTrendDirection: 'stable',
    },
  },
  'Tailspin Toys D365': {
    compositeScore: 9.0,
    successProbability: 85,
    confidence: 'High',
    executiveBrief: {
      successTier: 'High Confidence',
      closestAnalog: 'Closest analog: Trey Research D365 Sales & CS. See Comparable Engagements panel for full precedent breakdown.',
      successProbability: '85% predicted success based on 5 comparable engagements with 91% historical success rate.',
      topRiskPattern: 'Standard low-complexity risks apply. Knowledge Network lessons embedded as preventive actions.',
      capacityMatch: 'Recommended team identified via Delivery Agent — see Recommended Team panel for capacity bands.',
      decisionGuidance: 'Approve at recommended tier. Apply Knowledge Network lessons at kickoff.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 9.2, evidence: '5 comparable engagements with 91% delivery success rate.', gaps: [], recommendation: 'Apply established playbook from closest analog.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 9.1, evidence: 'Service-line playbook available and applicable.', gaps: [], recommendation: 'Activate playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 9.0, evidence: 'Qualified PMs with relevant experience available.', gaps: [], recommendation: 'See Recommended Team panel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 8.7, evidence: 'Practice capacity adequate for engagement size.', gaps: [], recommendation: 'Standard staffing plan.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 8.5, evidence: 'Client sponsorship documented in deal qualification.', gaps: [], recommendation: 'Confirm steering structure at kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 8.6, evidence: 'Standard sizing model applies for low-complexity work.', gaps: [], recommendation: 'Standard milestone model.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 9.5, evidence: 'Regulatory profile manageable with proven IP.', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: 'Trey Research D365 Sales & CS', client: 'Trey', industry: 'Comparable', serviceLine: 'Dynamics', budget: '$225K range', duration: '0 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Direct service-line analog. Apply established playbook.' },
      { name: 'World Wide Importers D365 CE', client: 'World', industry: 'Comparable', serviceLine: 'Dynamics', budget: 'Similar', duration: 'Similar', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Secondary pattern reference.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risks earlier than monthly.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: "success_pattern", sourceProject: "Munson's Pickles", applicability: 85, description: "Visible C-level sponsorship drives delivery quality.", actionable: 'Confirm executive sponsor at monthly steering.' },
    ],
    recommendedTeam: [
      { pmName: 'Delivery Agent recommendation', role: 'Project Manager', relevantExperience: 'Service-line specialist matched via Delivery Agent', csatHistory: 8.7, capacityBand: 'available', availability: 'Available at deal kickoff', trackRecord: 'Strong track record in similar engagements' },
      { pmName: 'QA Specialist on standby', role: 'QA Specialist', relevantExperience: 'Cross-engagement QA expertise', csatHistory: 8.8, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Available via QA Director allocation' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 35, predictedEwAt90: 30, confidence: 'High',
      rationale: 'Predicted to track Green throughout.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low', signal: 'Standard checkpoint', preventive: 'Apply playbook setup discipline' },
      { milestone: 'Phase 1 acceptance', timing: 'Month 3-4', risk: 'low', signal: 'First major delivery milestone', preventive: 'Comparable engagement pattern applies' },
      { milestone: 'Mid-engagement health review', timing: 'Month 6', risk: 'medium', signal: 'Trajectory inflection point', preventive: 'QA Director check-in' },
    ],
    failureModes: [
      { mode: 'Standard low-complexity risks', historicalFrequency: '0 of 5 comparable engagements', earlyWarnings: ['Day 30 maturity below 75', 'Late client stakeholder engagement'], preventiveActions: ['Apply Knowledge Network preventive playbook', 'Bi-weekly RAID cadence'], costIfMaterializes: 'Manageable with active intervention' },
    ],
    portfolioContext: {
      similarActive: 3, similarCompleted: 4, overallSuccessRate: 91, avgFinalCsat: 8.6, avgMarginVariance: 0.4, recentTrendDirection: 'stable',
    },
  },
  "Liberty's Bakery Phase 2": {
    compositeScore: 8.9,
    successProbability: 83,
    confidence: 'High',
    executiveBrief: {
      successTier: 'High Confidence',
      closestAnalog: "Closest analog: Liberty's Bakery Phase 1. See Comparable Engagements panel for full precedent breakdown.",
      successProbability: "83% predicted success based on 6 comparable engagements with 89% historical success rate.",
      topRiskPattern: 'Standard low-complexity risks apply. Knowledge Network lessons embedded as preventive actions.',
      capacityMatch: 'Recommended team identified via Delivery Agent — see Recommended Team panel for capacity bands.',
      decisionGuidance: 'Approve at recommended tier. Apply Knowledge Network lessons at kickoff.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 9.1, evidence: '6 comparable engagements with 89% delivery success rate.', gaps: [], recommendation: 'Apply established playbook from closest analog.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 9.0, evidence: 'Service-line playbook available and applicable.', gaps: [], recommendation: 'Activate playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 8.9, evidence: 'Qualified PMs with relevant experience available.', gaps: [], recommendation: 'See Recommended Team panel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 8.6, evidence: 'Practice capacity adequate for engagement size.', gaps: [], recommendation: 'Standard staffing plan.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 8.4, evidence: 'Client sponsorship documented in deal qualification.', gaps: [], recommendation: 'Confirm steering structure at kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 8.5, evidence: 'Standard sizing model applies for low-complexity work.', gaps: [], recommendation: 'Standard milestone model.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 9.4, evidence: 'Regulatory profile manageable with proven IP.', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: "Liberty's Bakery Phase 1", client: "Liberty's", industry: 'Comparable', serviceLine: 'Cloud Adoption', budget: '$310K range', duration: '0 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Direct service-line analog. Apply established playbook.' },
      { name: 'Adatum Cloud Foundation', client: 'Adatum', industry: 'Comparable', serviceLine: 'Cloud Adoption', budget: 'Similar', duration: 'Similar', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Secondary pattern reference.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risks earlier than monthly.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: 'success_pattern', sourceProject: "Munson's Pickles", applicability: 85, description: 'Visible C-level sponsorship drives delivery quality.', actionable: 'Confirm executive sponsor at monthly steering.' },
    ],
    recommendedTeam: [
      { pmName: 'Delivery Agent recommendation', role: 'Project Manager', relevantExperience: 'Service-line specialist matched via Delivery Agent', csatHistory: 8.7, capacityBand: 'available', availability: 'Available at deal kickoff', trackRecord: 'Strong track record in similar engagements' },
      { pmName: 'QA Specialist on standby', role: 'QA Specialist', relevantExperience: 'Cross-engagement QA expertise', csatHistory: 8.8, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Available via QA Director allocation' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 35, predictedEwAt90: 30, confidence: 'High',
      rationale: 'Predicted to track Green throughout.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low', signal: 'Standard checkpoint', preventive: 'Apply playbook setup discipline' },
      { milestone: 'Phase 1 acceptance', timing: 'Month 3-4', risk: 'low', signal: 'First major delivery milestone', preventive: 'Comparable engagement pattern applies' },
      { milestone: 'Mid-engagement health review', timing: 'Month 6', risk: 'medium', signal: 'Trajectory inflection point', preventive: 'QA Director check-in' },
    ],
    failureModes: [
      { mode: 'Standard low-complexity risks', historicalFrequency: '0 of 6 comparable engagements', earlyWarnings: ['Day 30 maturity below 75', 'Late client stakeholder engagement'], preventiveActions: ['Apply Knowledge Network preventive playbook', 'Bi-weekly RAID cadence'], costIfMaterializes: 'Manageable with active intervention' },
    ],
    portfolioContext: {
      similarActive: 4, similarCompleted: 5, overallSuccessRate: 89, avgFinalCsat: 8.6, avgMarginVariance: 0.5, recentTrendDirection: 'stable',
    },
  },
  'School of Fine Art Expansion': {
    compositeScore: 9.0,
    successProbability: 85,
    confidence: 'High',
    executiveBrief: {
      successTier: 'High Confidence',
      closestAnalog: 'Closest analog: School of Fine Art Phase 1. See Comparable Engagements panel for full precedent breakdown.',
      successProbability: '85% predicted success based on 3 comparable engagements with 90% historical success rate.',
      topRiskPattern: 'Standard low-complexity risks apply. Knowledge Network lessons embedded as preventive actions.',
      capacityMatch: 'Recommended team identified via Delivery Agent — see Recommended Team panel for capacity bands.',
      decisionGuidance: 'Approve at recommended tier. Apply Knowledge Network lessons at kickoff.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 9.2, evidence: '3 comparable engagements with 90% delivery success rate.', gaps: [], recommendation: 'Apply established playbook from closest analog.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 9.1, evidence: 'Service-line playbook available and applicable.', gaps: [], recommendation: 'Activate playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 9.0, evidence: 'Qualified PMs with relevant experience available.', gaps: [], recommendation: 'See Recommended Team panel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 8.7, evidence: 'Practice capacity adequate for engagement size.', gaps: [], recommendation: 'Standard staffing plan.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 8.5, evidence: 'Client sponsorship documented in deal qualification.', gaps: [], recommendation: 'Confirm steering structure at kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 8.6, evidence: 'Standard sizing model applies for low-complexity work.', gaps: [], recommendation: 'Standard milestone model.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 9.5, evidence: 'Regulatory profile manageable with proven IP.', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: 'School of Fine Art Phase 1', client: 'School', industry: 'Comparable', serviceLine: 'Cloud Adoption', budget: '$420K range', duration: '12 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Direct service-line analog. Apply established playbook.' },
      { name: 'Secondary reference', client: 'Reference', industry: 'Comparable', serviceLine: 'Cloud Adoption', budget: 'Similar', duration: 'Similar', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Secondary pattern reference.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risks earlier than monthly.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: 'success_pattern', sourceProject: "Munson's Pickles", applicability: 85, description: 'Visible C-level sponsorship drives delivery quality.', actionable: 'Confirm executive sponsor at monthly steering.' },
    ],
    recommendedTeam: [
      { pmName: 'Delivery Agent recommendation', role: 'Project Manager', relevantExperience: 'Service-line specialist matched via Delivery Agent', csatHistory: 8.7, capacityBand: 'available', availability: 'Available at deal kickoff', trackRecord: 'Strong track record in similar engagements' },
      { pmName: 'QA Specialist on standby', role: 'QA Specialist', relevantExperience: 'Cross-engagement QA expertise', csatHistory: 8.8, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Available via QA Director allocation' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 35, predictedEwAt90: 30, confidence: 'High',
      rationale: 'Predicted to track Green throughout.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low', signal: 'Standard checkpoint', preventive: 'Apply playbook setup discipline' },
      { milestone: 'Phase 1 acceptance', timing: 'Month 3-4', risk: 'low', signal: 'First major delivery milestone', preventive: 'Comparable engagement pattern applies' },
      { milestone: 'Mid-engagement health review', timing: 'Month 6', risk: 'medium', signal: 'Trajectory inflection point', preventive: 'QA Director check-in' },
    ],
    failureModes: [
      { mode: 'Standard low-complexity risks', historicalFrequency: '0 of 3 comparable engagements', earlyWarnings: ['Day 30 maturity below 75', 'Late client stakeholder engagement'], preventiveActions: ['Apply Knowledge Network preventive playbook', 'Bi-weekly RAID cadence'], costIfMaterializes: 'Manageable with active intervention' },
    ],
    portfolioContext: {
      similarActive: 1, similarCompleted: 2, overallSuccessRate: 90, avgFinalCsat: 8.6, avgMarginVariance: 0.3, recentTrendDirection: 'stable',
    },
  },
  "Margie's Travel Phase 2": {
    compositeScore: 8.9,
    successProbability: 83,
    confidence: 'High',
    executiveBrief: {
      successTier: 'High Confidence',
      closestAnalog: "Closest analog: Margie's Travel Phase 1. See Comparable Engagements panel for full precedent breakdown.",
      successProbability: "83% predicted success based on 5 comparable engagements with 89% historical success rate.",
      topRiskPattern: 'Standard medium-complexity risks apply. Knowledge Network lessons embedded as preventive actions.',
      capacityMatch: 'Recommended team identified via Delivery Agent — see Recommended Team panel for capacity bands.',
      decisionGuidance: 'Approve at recommended tier. Apply Knowledge Network lessons at kickoff.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 9.1, evidence: '5 comparable engagements with 89% delivery success rate.', gaps: [], recommendation: 'Apply established playbook from closest analog.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 9.0, evidence: 'Service-line playbook available and applicable.', gaps: [], recommendation: 'Activate playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 8.9, evidence: 'Qualified PMs with relevant experience available.', gaps: [], recommendation: 'See Recommended Team panel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 8.6, evidence: 'Practice capacity adequate for engagement size.', gaps: [], recommendation: 'Standard staffing plan.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 8.4, evidence: 'Client sponsorship documented in deal qualification.', gaps: [], recommendation: 'Confirm steering structure at kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 8.5, evidence: 'Standard sizing model applies for medium-complexity work.', gaps: [], recommendation: 'Standard milestone model.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 9.4, evidence: 'Regulatory profile manageable with proven IP.', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: "Margie's Travel Phase 1", client: "Margie's", industry: 'Comparable', serviceLine: 'Cloud Adoption', budget: '$750K range', duration: '12 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Direct service-line analog. Apply established playbook.' },
      { name: 'Wide World Importers Azure Migration', client: 'Wide', industry: 'Comparable', serviceLine: 'Cloud Adoption', budget: 'Similar', duration: 'Similar', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Secondary pattern reference.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risks earlier than monthly.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: 'success_pattern', sourceProject: "Munson's Pickles", applicability: 85, description: 'Visible C-level sponsorship drives delivery quality.', actionable: 'Confirm executive sponsor at monthly steering.' },
    ],
    recommendedTeam: [
      { pmName: 'Delivery Agent recommendation', role: 'Project Manager', relevantExperience: 'Service-line specialist matched via Delivery Agent', csatHistory: 8.7, capacityBand: 'available', availability: 'Available at deal kickoff', trackRecord: 'Strong track record in similar engagements' },
      { pmName: 'QA Specialist on standby', role: 'QA Specialist', relevantExperience: 'Cross-engagement QA expertise', csatHistory: 8.8, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Available via QA Director allocation' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 35, predictedEwAt90: 30, confidence: 'High',
      rationale: 'Predicted to track Green throughout.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low', signal: 'Standard checkpoint', preventive: 'Apply playbook setup discipline' },
      { milestone: 'Phase 1 acceptance', timing: 'Month 3-4', risk: 'low', signal: 'First major delivery milestone', preventive: 'Comparable engagement pattern applies' },
      { milestone: 'Mid-engagement health review', timing: 'Month 6', risk: 'medium', signal: 'Trajectory inflection point', preventive: 'QA Director check-in' },
    ],
    failureModes: [
      { mode: 'Standard medium-complexity risks', historicalFrequency: '0 of 5 comparable engagements', earlyWarnings: ['Day 30 maturity below 75', 'Late client stakeholder engagement'], preventiveActions: ['Apply Knowledge Network preventive playbook', 'Bi-weekly RAID cadence'], costIfMaterializes: 'Manageable with active intervention' },
    ],
    portfolioContext: {
      similarActive: 3, similarCompleted: 4, overallSuccessRate: 89, avgFinalCsat: 8.6, avgMarginVariance: 0.4, recentTrendDirection: 'stable',
    },
  },
  'VanArsdel Manufacturing Wave 2': {
    compositeScore: 9.2,
    successProbability: 88,
    confidence: 'High',
    executiveBrief: {
      successTier: 'High Confidence',
      closestAnalog: 'Closest analog: VanArsdel Wave 1. See Comparable Engagements panel for full precedent breakdown.',
      successProbability: '88% predicted success based on 4 comparable engagements with 92% historical success rate.',
      topRiskPattern: 'Standard medium-complexity risks apply. Knowledge Network lessons embedded as preventive actions.',
      capacityMatch: 'Recommended team identified via Delivery Agent — see Recommended Team panel for capacity bands.',
      decisionGuidance: 'Approve at recommended tier. Apply Knowledge Network lessons at kickoff.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 9.4, evidence: '4 comparable engagements with 92% delivery success rate.', gaps: [], recommendation: 'Apply established playbook from closest analog.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 9.3, evidence: 'Service-line playbook available and applicable.', gaps: [], recommendation: 'Activate playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 9.2, evidence: 'Qualified PMs with relevant experience available.', gaps: [], recommendation: 'See Recommended Team panel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 8.9, evidence: 'Practice capacity adequate for engagement size.', gaps: [], recommendation: 'Standard staffing plan.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 8.7, evidence: 'Client sponsorship documented in deal qualification.', gaps: [], recommendation: 'Confirm steering structure at kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 8.8, evidence: 'Standard sizing model applies for medium-complexity work.', gaps: [], recommendation: 'Standard milestone model.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 9.7, evidence: 'Regulatory profile manageable with proven IP.', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: 'VanArsdel Wave 1', client: 'VanArsdel', industry: 'Comparable', serviceLine: 'Ai Agentic', budget: '$1400K range', duration: '12 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Direct service-line analog. Apply established playbook.' },
      { name: 'VanArsdel Copilot & AI Platform', client: 'VanArsdel', industry: 'Comparable', serviceLine: 'Ai Agentic', budget: 'Similar', duration: 'Similar', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Secondary pattern reference.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risks earlier than monthly.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: 'success_pattern', sourceProject: "Munson's Pickles", applicability: 85, description: 'Visible C-level sponsorship drives delivery quality.', actionable: 'Confirm executive sponsor at monthly steering.' },
    ],
    recommendedTeam: [
      { pmName: 'Delivery Agent recommendation', role: 'Project Manager', relevantExperience: 'Service-line specialist matched via Delivery Agent', csatHistory: 8.7, capacityBand: 'available', availability: 'Available at deal kickoff', trackRecord: 'Strong track record in similar engagements' },
      { pmName: 'QA Specialist on standby', role: 'QA Specialist', relevantExperience: 'Cross-engagement QA expertise', csatHistory: 8.8, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Available via QA Director allocation' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 35, predictedEwAt90: 30, confidence: 'High',
      rationale: 'Predicted to track Green throughout.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low', signal: 'Standard checkpoint', preventive: 'Apply playbook setup discipline' },
      { milestone: 'Phase 1 acceptance', timing: 'Month 3-4', risk: 'low', signal: 'First major delivery milestone', preventive: 'Comparable engagement pattern applies' },
      { milestone: 'Mid-engagement health review', timing: 'Month 6', risk: 'medium', signal: 'Trajectory inflection point', preventive: 'QA Director check-in' },
    ],
    failureModes: [
      { mode: 'Standard medium-complexity risks', historicalFrequency: '0 of 4 comparable engagements', earlyWarnings: ['Day 30 maturity below 75', 'Late client stakeholder engagement'], preventiveActions: ['Apply Knowledge Network preventive playbook', 'Bi-weekly RAID cadence'], costIfMaterializes: 'Manageable with active intervention' },
    ],
    portfolioContext: {
      similarActive: 2, similarCompleted: 3, overallSuccessRate: 92, avgFinalCsat: 8.6, avgMarginVariance: 0.6, recentTrendDirection: 'stable',
    },
  },
  'Trey Research Pharma Expansion': {
    compositeScore: 8.8,
    successProbability: 81,
    confidence: 'High',
    executiveBrief: {
      successTier: 'High Confidence',
      closestAnalog: 'Closest analog: Trey Research Pharma Phase 1. See Comparable Engagements panel for full precedent breakdown.',
      successProbability: '81% predicted success based on 3 comparable engagements with 88% historical success rate.',
      topRiskPattern: 'Standard medium-complexity risks apply. Knowledge Network lessons embedded as preventive actions.',
      capacityMatch: 'Recommended team identified via Delivery Agent — see Recommended Team panel for capacity bands.',
      decisionGuidance: 'Approve at recommended tier. Apply Knowledge Network lessons at kickoff.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 9.0, evidence: '3 comparable engagements with 88% delivery success rate.', gaps: [], recommendation: 'Apply established playbook from closest analog.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 8.9, evidence: 'Service-line playbook available and applicable.', gaps: [], recommendation: 'Activate playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 8.8, evidence: 'Qualified PMs with relevant experience available.', gaps: [], recommendation: 'See Recommended Team panel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 8.5, evidence: 'Practice capacity adequate for engagement size.', gaps: [], recommendation: 'Standard staffing plan.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 8.3, evidence: 'Client sponsorship documented in deal qualification.', gaps: [], recommendation: 'Confirm steering structure at kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 8.4, evidence: 'Standard sizing model applies for medium-complexity work.', gaps: [], recommendation: 'Standard milestone model.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 9.3, evidence: 'Regulatory profile manageable with proven IP.', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: 'Trey Research Pharma Phase 1', client: 'Trey', industry: 'Comparable', serviceLine: 'Data Analytics', budget: '$2100K range', duration: '12 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Direct service-line analog. Apply established playbook.' },
      { name: 'Northwind Pharma Compliance Platform', client: 'Northwind', industry: 'Comparable', serviceLine: 'Data Analytics', budget: 'Similar', duration: 'Similar', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Secondary pattern reference.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risks earlier than monthly.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: "success_pattern", sourceProject: "Munson's Pickles", applicability: 85, description: "Visible C-level sponsorship drives delivery quality.", actionable: 'Confirm executive sponsor at monthly steering.' },
    ],
    recommendedTeam: [
      { pmName: 'Delivery Agent recommendation', role: 'Project Manager', relevantExperience: 'Service-line specialist matched via Delivery Agent', csatHistory: 8.7, capacityBand: 'available', availability: 'Available at deal kickoff', trackRecord: 'Strong track record in similar engagements' },
      { pmName: 'QA Specialist on standby', role: 'QA Specialist', relevantExperience: 'Cross-engagement QA expertise', csatHistory: 8.8, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Available via QA Director allocation' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 35, predictedEwAt90: 30, confidence: 'High',
      rationale: 'Predicted to track Green throughout.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low', signal: 'Standard checkpoint', preventive: 'Apply playbook setup discipline' },
      { milestone: 'Phase 1 acceptance', timing: 'Month 3-4', risk: 'low', signal: 'First major delivery milestone', preventive: 'Comparable engagement pattern applies' },
      { milestone: 'Mid-engagement health review', timing: 'Month 6', risk: 'medium', signal: 'Trajectory inflection point', preventive: 'QA Director check-in' },
    ],
    failureModes: [
      { mode: 'Standard medium-complexity risks', historicalFrequency: '0 of 3 comparable engagements', earlyWarnings: ['Day 30 maturity below 75', 'Late client stakeholder engagement'], preventiveActions: ['Apply Knowledge Network preventive playbook', 'Bi-weekly RAID cadence'], costIfMaterializes: 'Manageable with active intervention' },
    ],
    portfolioContext: {
      similarActive: 1, similarCompleted: 2, overallSuccessRate: 88, avgFinalCsat: 8.6, avgMarginVariance: 0.3, recentTrendDirection: 'stable',
    },
  },
  'Lucerne Publishing AI': {
    compositeScore: 8.7,
    successProbability: 79,
    confidence: 'High',
    executiveBrief: {
      successTier: 'High Confidence',
      closestAnalog: 'Closest analog: VanArsdel Copilot. See Comparable Engagements panel for full precedent breakdown.',
      successProbability: '79% predicted success based on 3 comparable engagements with 87% historical success rate.',
      topRiskPattern: 'Standard medium-complexity risks apply. Knowledge Network lessons embedded as preventive actions.',
      capacityMatch: 'Recommended team identified via Delivery Agent — see Recommended Team panel for capacity bands.',
      decisionGuidance: 'Approve at recommended tier. Apply Knowledge Network lessons at kickoff.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 8.9, evidence: '3 comparable engagements with 87% delivery success rate.', gaps: [], recommendation: 'Apply established playbook from closest analog.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 8.8, evidence: 'Service-line playbook available and applicable.', gaps: [], recommendation: 'Activate playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 8.7, evidence: 'Qualified PMs with relevant experience available.', gaps: [], recommendation: 'See Recommended Team panel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 8.4, evidence: 'Practice capacity adequate for engagement size.', gaps: [], recommendation: 'Standard staffing plan.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 8.2, evidence: 'Client sponsorship documented in deal qualification.', gaps: [], recommendation: 'Confirm steering structure at kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 8.3, evidence: 'Standard sizing model applies for medium-complexity work.', gaps: [], recommendation: 'Standard milestone model.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 9.2, evidence: 'Regulatory profile manageable with proven IP.', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: 'VanArsdel Copilot', client: 'VanArsdel', industry: 'Comparable', serviceLine: 'Ai Agentic', budget: '$1500K range', duration: '12 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Direct service-line analog. Apply established playbook.' },
      { name: 'Datum Corp AI Innovation Platform', client: 'Datum', industry: 'Comparable', serviceLine: 'Ai Agentic', budget: 'Similar', duration: 'Similar', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Secondary pattern reference.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risks earlier than monthly.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: 'success_pattern', sourceProject: "Munson's Pickles", applicability: 85, description: 'Visible C-level sponsorship drives delivery quality.', actionable: 'Confirm executive sponsor at monthly steering.' },
    ],
    recommendedTeam: [
      { pmName: 'Delivery Agent recommendation', role: 'Project Manager', relevantExperience: 'Service-line specialist matched via Delivery Agent', csatHistory: 8.7, capacityBand: 'available', availability: 'Available at deal kickoff', trackRecord: 'Strong track record in similar engagements' },
      { pmName: 'QA Specialist on standby', role: 'QA Specialist', relevantExperience: 'Cross-engagement QA expertise', csatHistory: 8.8, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Available via QA Director allocation' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 35, predictedEwAt90: 30, confidence: 'High',
      rationale: 'Predicted to track Green throughout.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low', signal: 'Standard checkpoint', preventive: 'Apply playbook setup discipline' },
      { milestone: 'Phase 1 acceptance', timing: 'Month 3-4', risk: 'low', signal: 'First major delivery milestone', preventive: 'Comparable engagement pattern applies' },
      { milestone: 'Mid-engagement health review', timing: 'Month 6', risk: 'medium', signal: 'Trajectory inflection point', preventive: 'QA Director check-in' },
    ],
    failureModes: [
      { mode: 'Standard medium-complexity risks', historicalFrequency: '0 of 3 comparable engagements', earlyWarnings: ['Day 30 maturity below 75', 'Late client stakeholder engagement'], preventiveActions: ['Apply Knowledge Network preventive playbook', 'Bi-weekly RAID cadence'], costIfMaterializes: 'Manageable with active intervention' },
    ],
    portfolioContext: {
      similarActive: 1, similarCompleted: 2, overallSuccessRate: 87, avgFinalCsat: 8.6, avgMarginVariance: 0.1, recentTrendDirection: 'stable',
    },
  },
  'The Phone Company Contact Center AI': {
    compositeScore: 8.5,
    successProbability: 75,
    confidence: 'High',
    executiveBrief: {
      successTier: 'High Confidence',
      closestAnalog: 'Closest analog: The Phone Company CX Platform. See Comparable Engagements panel for full precedent breakdown.',
      successProbability: '75% predicted success based on 3 comparable engagements with 85% historical success rate.',
      topRiskPattern: 'Standard medium-complexity risks apply. Knowledge Network lessons embedded as preventive actions.',
      capacityMatch: 'Recommended team identified via Delivery Agent — see Recommended Team panel for capacity bands.',
      decisionGuidance: 'Approve at recommended tier. Apply Knowledge Network lessons at kickoff.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 8.7, evidence: '3 comparable engagements with 85% delivery success rate.', gaps: [], recommendation: 'Apply established playbook from closest analog.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 8.6, evidence: 'Service-line playbook available and applicable.', gaps: [], recommendation: 'Activate playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 8.5, evidence: 'Qualified PMs with relevant experience available.', gaps: [], recommendation: 'See Recommended Team panel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 8.2, evidence: 'Practice capacity adequate for engagement size.', gaps: [], recommendation: 'Standard staffing plan.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 8.0, evidence: 'Client sponsorship documented in deal qualification.', gaps: [], recommendation: 'Confirm steering structure at kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 8.1, evidence: 'Standard sizing model applies for medium-complexity work.', gaps: [], recommendation: 'Standard milestone model.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 9.0, evidence: 'Regulatory profile manageable with proven IP.', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: 'The Phone Company CX Platform', client: 'The', industry: 'Comparable', serviceLine: 'Ai Agentic', budget: '$1800K range', duration: '12 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Direct service-line analog. Apply established playbook.' },
      { name: 'VanArsdel Copilot', client: 'VanArsdel', industry: 'Comparable', serviceLine: 'Ai Agentic', budget: 'Similar', duration: 'Similar', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Secondary pattern reference.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risks earlier than monthly.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: 'success_pattern', sourceProject: "Munson's Pickles", applicability: 85, description: 'Visible C-level sponsorship drives delivery quality.', actionable: 'Confirm executive sponsor at monthly steering.' },
    ],
    recommendedTeam: [
      { pmName: 'Delivery Agent recommendation', role: 'Project Manager', relevantExperience: 'Service-line specialist matched via Delivery Agent', csatHistory: 8.7, capacityBand: 'available', availability: 'Available at deal kickoff', trackRecord: 'Strong track record in similar engagements' },
      { pmName: 'QA Specialist on standby', role: 'QA Specialist', relevantExperience: 'Cross-engagement QA expertise', csatHistory: 8.8, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Available via QA Director allocation' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 35, predictedEwAt90: 30, confidence: 'High',
      rationale: 'Predicted to track Green throughout.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low', signal: 'Standard checkpoint', preventive: 'Apply playbook setup discipline' },
      { milestone: 'Phase 1 acceptance', timing: 'Month 3-4', risk: 'low', signal: 'First major delivery milestone', preventive: 'Comparable engagement pattern applies' },
      { milestone: 'Mid-engagement health review', timing: 'Month 6', risk: 'medium', signal: 'Trajectory inflection point', preventive: 'QA Director check-in' },
    ],
    failureModes: [
      { mode: 'Standard medium-complexity risks', historicalFrequency: '0 of 3 comparable engagements', earlyWarnings: ['Day 30 maturity below 75', 'Late client stakeholder engagement'], preventiveActions: ['Apply Knowledge Network preventive playbook', 'Bi-weekly RAID cadence'], costIfMaterializes: 'Manageable with active intervention' },
    ],
    portfolioContext: {
      similarActive: 1, similarCompleted: 2, overallSuccessRate: 85, avgFinalCsat: 8.6, avgMarginVariance: 0.0, recentTrendDirection: 'stable',
    },
  },
  'Litware Manufacturing SCM': {
    compositeScore: 8.2,
    successProbability: 70,
    confidence: 'High',
    executiveBrief: {
      successTier: 'Confident',
      closestAnalog: 'Closest analog: Litware Power BI. See Comparable Engagements panel for full precedent breakdown.',
      successProbability: '70% predicted success based on 3 comparable engagements with 82% historical success rate.',
      topRiskPattern: 'Standard medium-complexity risks apply. Knowledge Network lessons embedded as preventive actions.',
      capacityMatch: 'Recommended team identified via Delivery Agent — see Recommended Team panel for capacity bands.',
      decisionGuidance: 'Approve at recommended tier. Apply Knowledge Network lessons at kickoff.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 8.4, evidence: '3 comparable engagements with 82% delivery success rate.', gaps: [], recommendation: 'Apply established playbook from closest analog.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 8.3, evidence: 'Service-line playbook available and applicable.', gaps: [], recommendation: 'Activate playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 8.2, evidence: 'Qualified PMs with relevant experience available.', gaps: [], recommendation: 'See Recommended Team panel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 7.9, evidence: 'Practice capacity adequate for engagement size.', gaps: [], recommendation: 'Standard staffing plan.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 7.7, evidence: 'Client sponsorship documented in deal qualification.', gaps: [], recommendation: 'Confirm steering structure at kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 7.8, evidence: 'Standard sizing model applies for medium-complexity work.', gaps: [], recommendation: 'Standard milestone model.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 8.7, evidence: 'Regulatory profile manageable with proven IP.', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: 'Litware Power BI', client: 'Litware', industry: 'Comparable', serviceLine: 'Dynamics', budget: '$980K range', duration: '12 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Direct service-line analog. Apply established playbook.' },
      { name: 'Southridge D365 F&O', client: 'Southridge', industry: 'Comparable', serviceLine: 'Dynamics', budget: 'Similar', duration: 'Similar', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Secondary pattern reference.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risks earlier than monthly.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: 'success_pattern', sourceProject: "Munson's Pickles", applicability: 85, description: 'Visible C-level sponsorship drives delivery quality.', actionable: 'Confirm executive sponsor at monthly steering.' },
    ],
    recommendedTeam: [
      { pmName: 'Delivery Agent recommendation', role: 'Project Manager', relevantExperience: 'Service-line specialist matched via Delivery Agent', csatHistory: 8.7, capacityBand: 'available', availability: 'Available at deal kickoff', trackRecord: 'Strong track record in similar engagements' },
      { pmName: 'QA Specialist on standby', role: 'QA Specialist', relevantExperience: 'Cross-engagement QA expertise', csatHistory: 8.8, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Available via QA Director allocation' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 35, predictedEwAt90: 30, confidence: 'High',
      rationale: 'Predicted to track Green throughout.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low', signal: 'Standard checkpoint', preventive: 'Apply playbook setup discipline' },
      { milestone: 'Phase 1 acceptance', timing: 'Month 3-4', risk: 'low', signal: 'First major delivery milestone', preventive: 'Comparable engagement pattern applies' },
      { milestone: 'Mid-engagement health review', timing: 'Month 6', risk: 'medium', signal: 'Trajectory inflection point', preventive: 'QA Director check-in' },
    ],
    failureModes: [
      { mode: 'Standard medium-complexity risks', historicalFrequency: '0 of 3 comparable engagements', earlyWarnings: ['Day 30 maturity below 75', 'Late client stakeholder engagement'], preventiveActions: ['Apply Knowledge Network preventive playbook', 'Bi-weekly RAID cadence'], costIfMaterializes: 'Manageable with active intervention' },
    ],
    portfolioContext: {
      similarActive: 1, similarCompleted: 2, overallSuccessRate: 82, avgFinalCsat: 8.6, avgMarginVariance: -0.2, recentTrendDirection: 'stable',
    },
  },
  'Tailwind Traders D365': {
    compositeScore: 7.5,
    successProbability: 59,
    confidence: 'High',
    executiveBrief: {
      successTier: 'Confident',
      closestAnalog: 'Closest analog: Northwind Traders D365 F&O. See Comparable Engagements panel for full precedent breakdown.',
      successProbability: '59% predicted success based on 2 comparable engagements with 75% historical success rate.',
      topRiskPattern: 'Standard high-complexity risks apply. Knowledge Network lessons embedded as preventive actions.',
      capacityMatch: 'Recommended team identified via Delivery Agent — see Recommended Team panel for capacity bands.',
      decisionGuidance: 'Approve at recommended tier. Apply Knowledge Network lessons at kickoff.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 7.7, evidence: '2 comparable engagements with 75% delivery success rate.', gaps: [], recommendation: 'Apply established playbook from closest analog.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 7.6, evidence: 'Service-line playbook available and applicable.', gaps: [], recommendation: 'Activate playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 7.5, evidence: 'Qualified PMs with relevant experience available.', gaps: [], recommendation: 'See Recommended Team panel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 7.2, evidence: 'Practice capacity adequate for engagement size.', gaps: [], recommendation: 'Standard staffing plan.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 7.0, evidence: 'Client sponsorship documented in deal qualification.', gaps: [], recommendation: 'Confirm steering structure at kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 7.1, evidence: 'Standard sizing model applies for high-complexity work.', gaps: [], recommendation: 'Phased milestones with re-baseline points.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 8.0, evidence: 'Regulatory profile manageable with proven IP.', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: 'Northwind Traders D365 F&O', client: 'Northwind', industry: 'Comparable', serviceLine: 'Dynamics', budget: '$3200K range', duration: '12 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Direct service-line analog. Apply established playbook.' },
      { name: 'Consolidated Messenger D365 F&O (in approval)', client: 'Consolidated', industry: 'Comparable', serviceLine: 'Dynamics', budget: 'Similar', duration: 'Similar', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Secondary pattern reference.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risks earlier than monthly.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: 'success_pattern', sourceProject: "Munson's Pickles", applicability: 85, description: 'Visible C-level sponsorship drives delivery quality.', actionable: 'Confirm executive sponsor at monthly steering.' },
    ],
    recommendedTeam: [
      { pmName: 'Delivery Agent recommendation', role: 'Project Manager', relevantExperience: 'Service-line specialist matched via Delivery Agent', csatHistory: 8.7, capacityBand: 'available', availability: 'Available at deal kickoff', trackRecord: 'Strong track record in similar engagements' },
      { pmName: 'QA Specialist on standby', role: 'QA Specialist', relevantExperience: 'Cross-engagement QA expertise', csatHistory: 8.8, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Available via QA Director allocation' },
    ],
    trajectory: {
      d30: 'green', d60: 'green', d90: 'green', end: 'green',
      predictedEwAtStart: 35, predictedEwAt90: 30, confidence: 'High',
      rationale: 'Predicted to track Green throughout.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'low', signal: 'Standard checkpoint', preventive: 'Apply playbook setup discipline' },
      { milestone: 'Phase 1 acceptance', timing: 'Month 3-4', risk: 'low', signal: 'First major delivery milestone', preventive: 'Comparable engagement pattern applies' },
      { milestone: 'Mid-engagement health review', timing: 'Month 6', risk: 'medium', signal: 'Trajectory inflection point', preventive: 'QA Director check-in' },
    ],
    failureModes: [
      { mode: 'Standard high-complexity risks', historicalFrequency: '0 of 2 comparable engagements', earlyWarnings: ['Day 30 maturity below 75', 'Late client stakeholder engagement'], preventiveActions: ['Apply Knowledge Network preventive playbook', 'Bi-weekly RAID cadence'], costIfMaterializes: 'Manageable with active intervention' },
    ],
    portfolioContext: {
      similarActive: 1, similarCompleted: 1, overallSuccessRate: 75, avgFinalCsat: 8.6, avgMarginVariance: -0.6, recentTrendDirection: 'stable',
    },
  },
  'Coho Vineyard ERP': {
    compositeScore: 6.5,
    successProbability: 44,
    confidence: 'Medium',
    executiveBrief: {
      successTier: 'Cautious',
      closestAnalog: 'Closest analog: Coho Vineyard ERP Modernization (current Amber, scope re-baseline). See Comparable Engagements panel for full precedent breakdown.',
      successProbability: '44% predicted success based on 2 comparable engagements with 65% historical success rate.',
      topRiskPattern: 'Standard high-complexity risks apply. Knowledge Network lessons embedded as preventive actions.',
      capacityMatch: 'Recommended team identified via Delivery Agent — see Recommended Team panel for capacity bands.',
      decisionGuidance: 'Approve with conditions. Mandatory preventive measures from Knowledge Network.',
    },
    capabilities: [
      { key: 'pattern_match', label: 'Pattern Match',           weight: '25%', score: 6.7, evidence: '2 comparable engagements with 65% delivery success rate.', gaps: [], recommendation: 'Apply established playbook from closest analog.' },
      { key: 'ip_leverage',   label: 'IP & Playbook Leverage',  weight: '15%', score: 6.6, evidence: 'Service-line playbook available and applicable.', gaps: [], recommendation: 'Activate playbook at kickoff.' },
      { key: 'team_match',    label: 'Team Match',              weight: '15%', score: 6.5, evidence: 'Qualified PMs with relevant experience available.', gaps: [], recommendation: 'See Recommended Team panel.' },
      { key: 'capacity',      label: 'Delivery Capacity',       weight: '15%', score: 6.2, evidence: 'Practice capacity adequate for engagement size.', gaps: [], recommendation: 'Standard staffing plan.' },
      { key: 'client_readiness', label: 'Client Readiness',     weight: '10%', score: 6.0, evidence: 'Client sponsorship documented in deal qualification.', gaps: [], recommendation: 'Confirm steering structure at kickoff.' },
      { key: 'estimation',    label: 'Estimation Accuracy',     weight: '10%', score: 6.1, evidence: 'Standard sizing model applies for high-complexity work.', gaps: [], recommendation: 'Phased milestones with re-baseline points.' },
      { key: 'regulatory',    label: 'Regulatory Posture',      weight: '10%', score: 7.0, evidence: 'Regulatory profile manageable with proven IP.', gaps: [], recommendation: 'Standard governance.' },
    ],
    comparables: [
      { name: 'Coho Vineyard ERP Modernization (current Amber, scope re-baseline)', client: 'Coho', industry: 'Comparable', serviceLine: 'Dynamics', budget: '$4500K range', duration: '24 months', outcome: 'green', finalHealth: 'green', csat: 8.5, marginVariance: 0, scheduleVariance: 0, relevance: 'High', keyTakeaway: 'Direct service-line analog. Apply established playbook.' },
      { name: 'Northwind Traders D365 F&O', client: 'Northwind', industry: 'Comparable', serviceLine: 'Dynamics', budget: 'Similar', duration: 'Similar', outcome: 'green', finalHealth: 'green', csat: 8.3, marginVariance: 0, scheduleVariance: 0, relevance: 'Medium', keyTakeaway: 'Secondary pattern reference.' },
    ],
    appliedLessons: [
      { title: 'Bi-weekly RAID reviews reduce escalation frequency by 40%', category: 'process_improvement', sourceProject: 'Lamna Healthcare', applicability: 88, description: 'Bi-weekly cadence catches risks earlier than monthly.', actionable: 'Set bi-weekly RAID cadence from Day 1.' },
      { title: 'Early executive sponsor engagement prevents late-stage scope disputes', category: 'success_pattern', sourceProject: "Munson's Pickles", applicability: 85, description: 'Visible C-level sponsorship drives delivery quality.', actionable: 'Confirm executive sponsor at monthly steering.' },
    ],
    recommendedTeam: [
      { pmName: 'Delivery Agent recommendation', role: 'Project Manager', relevantExperience: 'Service-line specialist matched via Delivery Agent', csatHistory: 8.7, capacityBand: 'available', availability: 'Available at deal kickoff', trackRecord: 'Strong track record in similar engagements' },
      { pmName: 'QA Specialist on standby', role: 'QA Specialist', relevantExperience: 'Cross-engagement QA expertise', csatHistory: 8.8, capacityBand: 'available', availability: 'Steering support', trackRecord: 'Available via QA Director allocation' },
    ],
    trajectory: {
      d30: 'green', d60: 'amber', d90: 'amber', end: 'amber',
      predictedEwAtStart: 50, predictedEwAt90: 50, confidence: 'Medium',
      rationale: 'Predicted to track Amber mid-flight with recovery if preventive lessons applied.',
    },
    keyMilestones: [
      { milestone: 'Day 30 Setup Maturity Checkpoint', timing: 'Day 30', risk: 'medium', signal: 'Standard checkpoint', preventive: 'Apply playbook setup discipline' },
      { milestone: 'Phase 1 acceptance', timing: 'Month 3-4', risk: 'medium', signal: 'First major delivery milestone', preventive: 'Comparable engagement pattern applies' },
      { milestone: 'Mid-engagement health review', timing: 'Month 6', risk: 'medium', signal: 'Trajectory inflection point', preventive: 'QA Director check-in' },
    ],
    failureModes: [
      { mode: 'Standard high-complexity risks', historicalFrequency: '0 of 2 comparable engagements', earlyWarnings: ['Day 30 maturity below 75', 'Late client stakeholder engagement'], preventiveActions: ['Apply Knowledge Network preventive playbook', 'Bi-weekly RAID cadence'], costIfMaterializes: 'Manageable with active intervention' },
    ],
    portfolioContext: {
      similarActive: 1, similarCompleted: 1, overallSuccessRate: 65, avgFinalCsat: 8.6, avgMarginVariance: -0.9, recentTrendDirection: 'stable',
    },
  },

};
