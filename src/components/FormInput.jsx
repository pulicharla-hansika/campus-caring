import React from 'react';

export function FormField({ label, error, required, hint, children, htmlFor }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-semibold text-[#263451]"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && (
        <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputBaseClass = (hasError) =>
  `w-full px-4 py-2.5 rounded-xl bg-white border text-sm text-[#263451] placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
      : 'border-slate-200 focus:border-[#7050C8] focus:ring-[#A78BFA]/30 hover:border-[#A78BFA]/70'
  }`;
