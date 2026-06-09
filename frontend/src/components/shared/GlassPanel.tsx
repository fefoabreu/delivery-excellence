import clsx from 'clsx';

// ── Liquid Glass panel ──────────────────────────────────────────────────────
// The finalized recipe used for AI / agentic surfaces across the app:
// a light pastel substrate frosted by a transparent glass pane with a
// rim-of-light and layered depth shadow. Reserve for intelligence/agentic
// moments — keep ordinary list cards on the clean editorial `.card` style.

export type GlassTint = 'green' | 'blue' | 'amber' | 'red' | 'orange' | 'cyan' | 'neutral';

// Original "happy camper" -50 pastels (frosted to ~0.72 alpha)
export const GLASS_TINTS: Record<GlassTint, string> = {
  green:   'rgba(236,253,245,0.72)', // emerald-50
  blue:    'rgba(239,246,255,0.72)', // blue-50
  amber:   'rgba(255,251,235,0.72)', // amber-50
  red:     'rgba(254,242,242,0.72)', // red-50
  orange:  'rgba(255,247,237,0.72)', // orange-50
  cyan:    'rgba(236,254,255,0.72)', // cyan-50
  neutral: 'rgba(255,255,255,0.55)',
};

interface GlassPanelProps {
  /** Pastel tint key, or pass a raw CSS color string for a custom substrate. */
  tint?: GlassTint | string;
  /** Extra layered depth shadow (for hero panels). */
  deep?: boolean;
  /** Hover lift. */
  interactive?: boolean;
  /** Classes applied to the inner glass pane (e.g. padding). */
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function GlassPanel({
  tint = 'neutral', deep = false, interactive = false, className, style, onClick, children,
}: GlassPanelProps) {
  const substrate = (GLASS_TINTS as Record<string, string>)[tint] ?? tint;
  return (
    <div className="relative overflow-hidden rounded-[1.5rem]">
      <div className="glass-substrate rounded-[1.5rem]" style={{ background: substrate }} />
      <div
        className={clsx('glass', deep && 'glass-deep', interactive && 'glass-interactive', className)}
        style={style}
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  );
}
