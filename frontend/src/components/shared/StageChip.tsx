import clsx from 'clsx';

const stageConfig: Record<string, { label: string; className: string }> = {
  prospect: { label: 'Prospect', className: 'bg-gray-100 text-gray-600' },
  qualify: { label: 'Qualify', className: 'bg-blue-50 text-blue-700' },
  develop: { label: 'Develop', className: 'bg-indigo-50 text-indigo-700' },
  propose: { label: 'Propose', className: 'bg-purple-50 text-purple-700' },
  negotiate: { label: 'Negotiate', className: 'bg-amber-50 text-amber-700' },
  closed_won: { label: 'Closed Won', className: 'bg-green-100 text-green-700' },
  closed_lost: { label: 'Closed Lost', className: 'bg-red-100 text-red-700' },
};

export default function StageChip({ stage }: { stage: string }) {
  const cfg = stageConfig[stage] || { label: stage, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', cfg.className)}>
      {cfg.label}
    </span>
  );
}
