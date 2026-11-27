import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'lavender',
  onClick,
}) {
  const accents = {
    lavender: {
      iconBg: 'bg-gradient-to-br from-[#7050C8] to-[#A78BFA]',
      cardHover: 'hover:border-[#A78BFA]/60',
      badge: 'bg-[#F0EBFF] text-[#7050C8]',
    },
    blue: {
      iconBg: 'bg-gradient-to-br from-[#263451] to-[#60A5FA]',
      cardHover: 'hover:border-[#60A5FA]/60',
      badge: 'bg-[#BFDBFE]/50 text-[#263451]',
    },
    amber: {
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-400',
      cardHover: 'hover:border-amber-300',
      badge: 'bg-amber-50 text-amber-700',
    },
    emerald: {
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-400',
      cardHover: 'hover:border-emerald-300',
      badge: 'bg-emerald-50 text-emerald-700',
    },
    indigo: {
      iconBg: 'bg-gradient-to-br from-[#7050C8] to-[#60A5FA]',
      cardHover: 'hover:border-[#A78BFA]/60',
      badge: 'bg-indigo-50 text-[#7050C8]',
    },
  };

  const style = accents[accent] || accents.lavender;
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`text-left w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
        style.cardHover
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-extrabold text-[#263451] tracking-tight">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={`w-11 h-11 rounded-xl ${style.iconBg} text-white flex items-center justify-center shadow-sm shrink-0`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {subtitle && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">{subtitle}</span>
        </div>
      )}
    </Wrapper>
  );
}
