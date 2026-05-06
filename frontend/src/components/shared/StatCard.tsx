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

const colors = {
  blue: { icon: 'bg-blue-100 text-ms-blue', border: 'border-l-4 border-l-ms-blue' },
  green: { icon: 'bg-green-100 text-ms-green', border: 'border-l-4 border-l-ms-green' },
  amber: { icon: 'bg-amber-100 text-ms-amber', border: 'border-l-4 border-l-ms-amber' },
  red: { icon: 'bg-red-100 text-ms-red', border: 'border-l-4 border-l-ms-red' },
  purple: { icon: 'bg-purple-100 text-ms-purple', border: 'border-l-4 border-l-ms-purple' },
};

export default function StatCard({ label, value, sub, icon: Icon, color = 'blue' }: StatCardProps) {
  const c = colors[color];
  return (
    <div className={clsx('card p-5', c.border)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div className={clsx('p-2 rounded-lg flex-shrink-0 ml-3', c.icon)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
