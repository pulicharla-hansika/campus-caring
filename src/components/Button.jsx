import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  isLoading = false,
  disabled = false,
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50 focus:ring-offset-1';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#7050C8] via-[#8B6CE8] to-[#60A5FA] text-white shadow-md shadow-[#7050C8]/20 hover:shadow-lg hover:shadow-[#7050C8]/30 hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-[#F0EBFF] text-[#7050C8] border border-[#A78BFA]/40 hover:bg-[#A78BFA]/20 hover:border-[#7050C8]/40',
    outline:
      'bg-white text-[#263451] border border-slate-200 hover:border-[#A78BFA] hover:bg-[#F0EBFF]/40 hover:text-[#7050C8]',
    ghost:
      'bg-transparent text-[#263451] hover:bg-[#F0EBFF]/70 hover:text-[#7050C8]',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow',
    danger:
      'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0" />
      )}
      {children}
    </button>
  );
}
