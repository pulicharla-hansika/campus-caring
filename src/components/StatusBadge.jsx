import React from 'react';
import { Clock, SearchCheck, Wrench, CheckCircle2, AlertTriangle, Minus, ArrowDown } from 'lucide-react';

const STATUS_MAP = {
  Pending: {
    label: 'Pending',
    bg: 'bg-[#F0EBFF]',
    text: 'text-[#7050C8]',
    border: 'border-[#A78BFA]/40',
    dot: 'bg-[#A78BFA]',
    Icon: Clock,
  },
  'Under Review': {
    label: 'Under Review',
    bg: 'bg-[#BFDBFE]/45',
    text: 'text-[#263451]',
    border: 'border-[#60A5FA]/50',
    dot: 'bg-[#60A5FA]',
    Icon: SearchCheck,
  },
  'In Progress': {
    label: 'In Progress',
    bg: 'bg-indigo-50',
    text: 'text-[#7050C8]',
    border: 'border-[#7050C8]/30',
    dot: 'bg-[#7050C8]',
    Icon: Wrench,
  },
  Resolved: {
    label: 'Resolved',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    Icon: CheckCircle2,
  },
};

export function StatusBadge({ status, showIcon = true, size = 'sm' }) {
  const cfg = STATUS_MAP[status] || STATUS_MAP.Pending;
  const Icon = cfg.Icon;
  const sizeClass = size === 'md' ? 'px-3 py-1.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeClass} whitespace-nowrap`}
    >
      {showIcon ? (
        <Icon className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      )}
      {cfg.label}
    </span>
  );
}

const PRIORITY_MAP = {
  High: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    Icon: AlertTriangle,
  },
  Medium: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    Icon: Minus,
  },
  Low: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    Icon: ArrowDown,
  },
};

export function PriorityBadge({ priority }) {
  const cfg = PRIORITY_MAP[priority] || PRIORITY_MAP.Medium;
  const Icon = cfg.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} whitespace-nowrap`}
    >
      <Icon className="w-3 h-3" />
      {priority}
    </span>
  );
}
