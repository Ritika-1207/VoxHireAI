import React from 'react';

export type StatusType =
  | 'Shortlisted'
  | 'Review'
  | 'Not Suitable'
  | 'Contacted'
  | 'Hired'
  | 'active'
  | 'inactive'
  | 'completed'
  | 'in_progress'
  | 'no_answer'
  | 'busy'
  | 'callback_requested'
  | 'Qualified'
  | 'Follow-up'
  | 'Disqualified';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
}) => {
  let dotColor = 'bg-slate-400';
  let textColor = 'text-slate-300';
  let borderBg = 'bg-slate-800/60 border-slate-700/60';

  const s = status.toLowerCase();

  if (s.includes('shortlisted') || s.includes('qualified') || s === 'active' || s === 'completed' || s === 'hired') {
    dotColor = 'bg-emerald-400';
    textColor = 'text-emerald-300';
    borderBg = 'bg-emerald-950/40 border-emerald-800/40';
  } else if (s.includes('review') || s.includes('follow-up') || s.includes('callback') || s === 'in_progress') {
    dotColor = 'bg-amber-400';
    textColor = 'text-amber-300';
    borderBg = 'bg-amber-950/40 border-amber-800/40';
  } else if (s.includes('not suitable') || s.includes('disqualified') || s === 'inactive') {
    dotColor = 'bg-rose-400';
    textColor = 'text-rose-300';
    borderBg = 'bg-rose-950/40 border-rose-800/40';
  } else if (s.includes('contacted') || s.includes('training')) {
    dotColor = 'bg-sky-400';
    textColor = 'text-sky-300';
    borderBg = 'bg-sky-950/40 border-sky-800/40';
  }

  const textSizes = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${borderBg} ${textColor} ${textSizes} tracking-wide select-none`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0 animate-pulse`}
          aria-hidden="true"
        />
      )}
      <span>{status}</span>
    </span>
  );
};
