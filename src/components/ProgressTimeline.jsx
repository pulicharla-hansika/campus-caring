import React from 'react';
import { Check, FileCheck2, SearchCheck, Wrench, Sparkles } from 'lucide-react';
import { TRACKING_STAGES } from '../constants/campusData';

const STAGE_ICONS = {
  Pending: FileCheck2,
  'Under Review': SearchCheck,
  'In Progress': Wrench,
  Resolved: Sparkles,
};

export default function ProgressTimeline({ currentStatus, updates = [] }) {
  const activeIndex = Math.max(
    0,
    TRACKING_STAGES.findIndex((stage) => stage.key === currentStatus)
  );

  const getStageTimestamp = (stageKey) => {
    const match = [...updates].reverse().find((u) => u.status === stageKey);
    if (!match) return null;
    return new Date(match.timestamp).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full py-2">
      {/* Desktop horizontal stepper */}
      <div className="hidden md:grid grid-cols-4 gap-3 relative">
        {/* Background track line */}
        <div className="absolute top-6 left-[12%] right-[12%] h-1 bg-slate-100 rounded-full z-0" />
        {/* Filled progress line */}
        <div
          className="absolute top-6 left-[12%] h-1 bg-gradient-to-r from-[#7050C8] via-[#A78BFA] to-[#60A5FA] rounded-full z-0 transition-all duration-500"
          style={{ width: `${(activeIndex / (TRACKING_STAGES.length - 1)) * 76}%` }}
        />

        {TRACKING_STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIndex || (idx === 3 && currentStatus === 'Resolved');
          const isCurrent = idx === activeIndex && currentStatus !== 'Resolved';
          const Icon = STAGE_ICONS[stage.key] || FileCheck2;
          const dateLabel = getStageTimestamp(stage.key);

          return (
            <div key={stage.key} className="relative z-10 flex flex-col items-center text-center px-2">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-[#7050C8] to-[#60A5FA] border-transparent text-white shadow-md shadow-[#7050C8]/25'
                    : isCurrent
                    ? 'bg-white border-[#7050C8] text-[#7050C8] shadow-md shadow-[#A78BFA]/30 ring-4 ring-[#F0EBFF]'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-5 h-5" />}
              </div>

              <p
                className={`mt-3 text-sm font-bold ${
                  idx <= activeIndex ? 'text-[#263451]' : 'text-slate-400'
                }`}
              >
                {idx + 1}. {stage.label}
              </p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-[170px]">
                {stage.description}
              </p>
              {dateLabel && (
                <span className="mt-2 inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F0EBFF] text-[#7050C8]">
                  {dateLabel}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile vertical stepper */}
      <div className="md:hidden space-y-4">
        {TRACKING_STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIndex || (idx === 3 && currentStatus === 'Resolved');
          const isCurrent = idx === activeIndex && currentStatus !== 'Resolved';
          const Icon = STAGE_ICONS[stage.key] || FileCheck2;
          const dateLabel = getStageTimestamp(stage.key);

          return (
            <div key={stage.key} className="flex items-start gap-3.5 relative">
              {idx < TRACKING_STAGES.length - 1 && (
                <div
                  className={`absolute left-5 top-11 bottom-[-16px] w-0.5 ${
                    idx < activeIndex ? 'bg-[#7050C8]' : 'bg-slate-200'
                  }`}
                />
              )}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 shrink-0 relative z-10 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-[#7050C8] to-[#60A5FA] border-transparent text-white'
                    : isCurrent
                    ? 'bg-white border-[#7050C8] text-[#7050C8] ring-4 ring-[#F0EBFF]'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="pt-0.5 pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className={`text-sm font-bold ${
                      idx <= activeIndex ? 'text-[#263451]' : 'text-slate-400'
                    }`}
                  >
                    {idx + 1}. {stage.label}
                  </p>
                  {dateLabel && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F0EBFF] text-[#7050C8]">
                      {dateLabel}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
