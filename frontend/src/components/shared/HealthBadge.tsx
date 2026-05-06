import clsx from 'clsx';
import type { HealthStatus } from '../../types';

interface Props {
  status: HealthStatus;
  label?: string;
  size?: 'sm' | 'md';
}

const config = {
  green: { dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50', label: 'On Track' },
  amber: { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', label: 'At Risk' },
  red: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', label: 'Critical' },
};

export default function HealthBadge({ status, label, size = 'md' }: Props) {
  const c = config[status] || config.green;
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full font-medium', c.bg, c.text, size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs')}>
      <span className={clsx('rounded-full flex-shrink-0', c.dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {label || c.label}
    </span>
  );
}
