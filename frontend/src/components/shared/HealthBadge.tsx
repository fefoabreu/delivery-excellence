import clsx from 'clsx';
import type { HealthStatus } from '../../types';

interface Props {
  status: HealthStatus;
  label?: string;
  size?: 'sm' | 'md';
}

const config = {
  green: { dot: '#1c7c54', text: 'text-[#15633f]', bg: 'bg-[rgba(28,124,84,0.12)]', label: 'On Track' },
  amber: { dot: '#be7415', text: 'text-[#8a5310]', bg: 'bg-[rgba(190,116,21,0.14)]', label: 'At Risk' },
  red:   { dot: '#b23a3a', text: 'text-[#8e2c2c]', bg: 'bg-[rgba(178,58,58,0.12)]', label: 'Critical' },
};

export default function HealthBadge({ status, label, size = 'md' }: Props) {
  const c = config[status] || config.green;
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        c.bg, c.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      <span
        className={clsx('rounded-full flex-shrink-0', size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2')}
        style={{ background: c.dot, boxShadow: `0 0 0 3px ${c.dot}22` }}
      />
      {label || c.label}
    </span>
  );
}
