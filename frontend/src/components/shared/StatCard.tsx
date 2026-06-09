import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  trend?: 'up' | 'down' | 'neutral';
}

// Editorial KPI tile — Fraunces numeral, hairline accent rule, soft hover lift.
const colors = {
  blue:   { ink: '#2540d9', wash: 'rgba(37,64,217,0.10)',  bar: 'linear-gradient(180deg,#2540d9,#10b7c4)' },
  green:  { ink: '#1c7c54', wash: 'rgba(28,124,84,0.12)',  bar: 'linear-gradient(180deg,#1c7c54,#3fae7e)' },
  amber:  { ink: '#be7415', wash: 'rgba(190,116,21,0.14)', bar: 'linear-gradient(180deg,#be7415,#e0a44e)' },
  red:    { ink: '#b23a3a', wash: 'rgba(178,58,58,0.12)',  bar: 'linear-gradient(180deg,#b23a3a,#d86b6b)' },
  purple: { ink: '#5b45c9', wash: 'rgba(91,69,201,0.12)',  bar: 'linear-gradient(180deg,#5b45c9,#8b78e6)' },
};

export default function StatCard({ label, value, sub, icon: Icon, color = 'blue' }: StatCardProps) {
  const c = colors[color];
  return (
    <div className="card is-interactive relative overflow-hidden p-5">
      {/* accent rule */}
      <span className="absolute left-0 top-0 h-full w-[3px]" style={{ background: c.bar }} />
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            {label}
          </p>
          <p className="kpi-number mt-2 text-[2rem] leading-none text-ink">{value}</p>
          {sub && <p className="mt-2 text-xs text-ink-faint">{sub}</p>}
        </div>
        {Icon && (
          <div
            className="ml-3 grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg"
            style={{ background: c.wash, color: c.ink }}
          >
            <Icon className="h-5 w-5" strokeWidth={1.9} />
          </div>
        )}
      </div>
    </div>
  );
}
