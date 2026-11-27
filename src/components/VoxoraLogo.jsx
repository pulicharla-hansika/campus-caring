import React from 'react';

/**
 * Original VOXORA brand mark combining a speech bubble silhouette with animated/clean voice-wave bars.
 */
export default function VoxoraLogo({
  size = 'md',
  showText = true,
  lightText = false,
  className = '',
}) {
  const dimensions = {
    sm: { box: 'w-9 h-9', svg: 'w-5 h-5', text: 'text-lg', sub: 'text-[10px]' },
    md: { box: 'w-10 h-10', svg: 'w-6 h-6', text: 'text-xl', sub: 'text-[11px]' },
    lg: { box: 'w-14 h-14', svg: 'w-8 h-8', text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-20 h-20', svg: 'w-11 h-11', text: 'text-4xl', sub: 'text-xs' },
  };

  const cfg = dimensions[size] || dimensions.md;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div
        className={`${cfg.box} relative rounded-2xl bg-gradient-to-br from-[#7050C8] via-[#A78BFA] to-[#60A5FA] p-[1px] shadow-lg shadow-[#7050C8]/25 flex items-center justify-center shrink-0`}
      >
        <div className="w-full h-full rounded-[15px] bg-gradient-to-br from-[#7050C8] via-[#8B6CE8] to-[#60A5FA] flex items-center justify-center relative overflow-hidden">
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/15 blur-sm" />
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${cfg.svg} relative z-10`}
            aria-hidden="true"
          >
            {/* Speech bubble outline */}
            <path
              d="M7 9.5C7 7.567 8.567 6 10.5 6H25.5C27.433 6 29 7.567 29 9.5V21.5C29 23.433 27.433 25 25.5 25H16.2L10.4 29.6C9.75 30.115 8.8 29.652 8.8 28.822V25H10.5C8.567 25 7 23.433 7 21.5V9.5Z"
              fill="white"
              fillOpacity="0.18"
              stroke="white"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Voice-wave bars inside speech bubble */}
            <rect x="11.5" y="13.5" width="2.2" height="4.5" rx="1.1" fill="white" />
            <rect x="15.2" y="10.8" width="2.2" height="9.8" rx="1.1" fill="white" />
            <rect x="18.9" y="9.2" width="2.2" height="13" rx="1.1" fill="#F0EBFF" />
            <rect x="22.6" y="12.2" width="2.2" height="7" rx="1.1" fill="white" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`${cfg.text} font-extrabold tracking-tight ${
              lightText ? 'text-white' : 'text-[#263451]'
            }`}
          >
            VOX<span className={lightText ? 'text-[#BFDBFE]' : 'text-[#7050C8]'}>ORA</span>
          </span>
          <span
            className={`${cfg.sub} font-medium tracking-wide uppercase mt-0.5 ${
              lightText ? 'text-white/80' : 'text-slate-500'
            }`}
          >
            Marwadi University
          </span>
        </div>
      )}
    </div>
  );
}
