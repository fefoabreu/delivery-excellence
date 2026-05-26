import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BarChart2, Bot, Target,
} from 'lucide-react';
import clsx from 'clsx';
import { qualityAssuranceApi } from '../api/client';

type HealthStatus = 'green' | 'amber' | 'red';
interface QAEvals {
  prediction_accuracy: { true_positives: number; false_positives: number; true_negatives: number; false_negatives: number; precision: number; recall: number; f1_score: number };
  recovery_stats: { total_g2g_plans: number; resolved_within_60d: number; recovery_rate: number; avg_recovery_days: number; active_plans: number };
  alignment: { total_assessments: number; director_overrides: number; override_rate: number; override_breakdown: { ai_too_aggressive: number; ai_too_lenient: number } };
  checkpoint_correlation: { high_maturity_green_rate: number; low_maturity_red_rate: number; avg_maturity_by_outcome: Record<string, number> };
  monthly_trend: { month: string; avg_ew_score: number; portfolio_green_pct: number; predictions_correct: number; predictions_total: number }[];
}

const HEALTH_CFG: Record<HealthStatus, { text: string; dot: string }> = {
  green: { text: 'text-green-700', dot: 'bg-green-500' },
  amber: { text: 'text-amber-700', dot: 'bg-amber-500' },
  red:   { text: 'text-red-700',   dot: 'bg-red-500' },
};
const ewScoreColor = (s: number) => s >= 80 ? 'text-red-700' : s >= 60 ? 'text-orange-700' : s >= 40 ? 'text-amber-700' : 'text-green-700';

export default function QAEvalsPage() {
  const navigate = useNavigate();
  const [evals, setEvals] = useState<QAEvals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    qualityAssuranceApi.getData()
      .then(r => setEvals(r.data.qa_evals))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !evals) return <div className="p-12 text-center text-gray-400">Loading QA evals...</div>;

  const pa = evals.prediction_accuracy;
  const rs = evals.recovery_stats;
  const al = evals.alignment;
  const cc = evals.checkpoint_correlation;

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => navigate('/quality-assurance')}
          className="btn-ghost flex items-center gap-1.5 text-gray-400 text-sm mb-4 -ml-1">
          <ArrowLeft className="w-4 h-4" /> Back to AI Quality Assurance
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <Target className="w-7 h-7 text-purple-600" />
              AI-QA Evals
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              Prediction accuracy, recovery effectiveness, director alignment, and checkpoint correlation — proving the QA Agent's value to the business.
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-400">
            <Bot className="w-3 h-3" /> Powered by Claude
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="card p-4 border-l-4 border-l-emerald-500">
          <div className="text-sm text-gray-500">Prediction Precision</div>
          <div className="text-2xl font-bold text-emerald-700">{pa.precision}%</div>
          <div className="text-xs text-gray-400">TP:{pa.true_positives} FP:{pa.false_positives}</div>
        </div>
        <div className="card p-4 border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-500">Prediction Recall</div>
          <div className="text-2xl font-bold text-blue-700">{pa.recall}%</div>
          <div className="text-xs text-gray-400">TP:{pa.true_positives} FN:{pa.false_negatives}</div>
        </div>
        <div className="card p-4 border-l-4 border-l-purple-500">
          <div className="text-sm text-gray-500">G2G Recovery Rate</div>
          <div className="text-2xl font-bold text-purple-700">{rs.recovery_rate}%</div>
          <div className="text-xs text-gray-400">{rs.resolved_within_60d}/{rs.total_g2g_plans} within 60 days</div>
        </div>
        <div className="card p-4 border-l-4 border-l-amber-500">
          <div className="text-sm text-gray-500">Director Override Rate</div>
          <div className="text-2xl font-bold text-amber-700">{al.override_rate.toFixed(1)}%</div>
          <div className="text-xs text-gray-400">{al.director_overrides}/{al.total_assessments} assessments</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-5">
          <h3 className="section-title mb-4">Prediction Accuracy — Confusion Matrix</h3>
          <div className="grid grid-cols-2 gap-2 max-w-xs">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-700">{pa.true_positives}</div>
              <div className="text-[10px] text-green-600 font-medium">True Positives</div>
              <div className="text-[10px] text-gray-400">Predicted Red → Went Red</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-700">{pa.false_positives}</div>
              <div className="text-[10px] text-red-600 font-medium">False Positives</div>
              <div className="text-[10px] text-gray-400">Predicted Red → Stayed Green</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-amber-700">{pa.false_negatives}</div>
              <div className="text-[10px] text-amber-600 font-medium">False Negatives</div>
              <div className="text-[10px] text-gray-400">Predicted Green → Went Red</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-emerald-700">{pa.true_negatives}</div>
              <div className="text-[10px] text-emerald-600 font-medium">True Negatives</div>
              <div className="text-[10px] text-gray-400">Predicted Green → Stayed Green</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">F1 Score: <span className="font-bold text-gray-900">{pa.f1_score}%</span></div>
        </div>

        <div className="card p-5">
          <h3 className="section-title mb-4">Director Override Analysis</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">AI Too Aggressive (Director softened)</span>
                <span className="font-bold text-amber-700">{al.override_breakdown.ai_too_aggressive}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${al.total_assessments ? (al.override_breakdown.ai_too_aggressive / al.total_assessments) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">AI Too Lenient (Director escalated)</span>
                <span className="font-bold text-red-700">{al.override_breakdown.ai_too_lenient}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${al.total_assessments ? (al.override_breakdown.ai_too_lenient / al.total_assessments) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
              AI leans conservative — more overrides are from softening than escalating. This is the safer failure mode.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="section-title mb-4">Checkpoint Maturity → Outcome Correlation</h3>
          <div className="space-y-3">
            {Object.entries(cc.avg_maturity_by_outcome).map(([outcome, score]) => (
              <div key={outcome}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="capitalize font-medium text-gray-700">Projects ending {outcome}</span>
                  <span className={clsx('font-bold', HEALTH_CFG[outcome as HealthStatus]?.text || 'text-gray-700')}>Avg Maturity: {score}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={clsx('h-full rounded-full', HEALTH_CFG[outcome as HealthStatus]?.dot || 'bg-gray-400')} style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
              Projects with high Day 30 maturity scores ({cc.high_maturity_green_rate}%) stay Green. Low maturity scores predict Red outcomes ({cc.low_maturity_red_rate}%).
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="section-title mb-4">Monthly Trend</h3>
          <div className="space-y-2">
            {evals.monthly_trend.map(m => (
              <div key={m.month} className="flex items-center gap-3 text-xs">
                <span className="w-16 text-gray-500 font-medium">{m.month}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-20 text-right">
                    <span className={clsx('font-bold', ewScoreColor(m.avg_ew_score))}>EW: {m.avg_ew_score}</span>
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${m.portfolio_green_pct}%` }} />
                  </div>
                  <span className="text-gray-500 w-12">{m.portfolio_green_pct}% G</span>
                  <span className="text-gray-400 w-16">{m.predictions_correct}/{m.predictions_total} pred</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
