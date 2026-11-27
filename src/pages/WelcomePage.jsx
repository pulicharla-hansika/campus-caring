import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LogIn } from 'lucide-react';
import VoxoraLogo from '../components/VoxoraLogo';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-12 bg-gradient-to-br from-[#F0EBFF] via-white to-[#BFDBFE]/60">
      {/* Subtle Decorative Lavender & Blue Shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 w-[460px] h-[460px] rounded-full bg-[#A78BFA]/25 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 -right-28 w-[500px] h-[500px] rounded-full bg-[#60A5FA]/25 blur-3xl animate-float-slow"
        style={{ animationDelay: '2s' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[#BFDBFE]/30 blur-2xl"
      />

      {/* Minimal Campus Silhouette / Geometric Arc Illustration (subtle background accent) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute bottom-0 left-0 w-full opacity-25 text-[#A78BFA]"
      >
        <path
          d="M0 240 C240 160, 420 260, 680 190 C920 125, 1050 210, 1200 165 L1200 280 L0 280 Z"
          fill="url(#welcomeWaveGrad)"
        />
        <defs>
          <linearGradient id="welcomeWaveGrad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A78BFA" stopOpacity="0.45" />
            <stop offset="0.5" stopColor="#BFDBFE" stopOpacity="0.55" />
            <stop offset="1" stopColor="#60A5FA" stopOpacity="0.35" />
          </linearGradient>
        </defs>
      </svg>

      {/* Centered Minimal Content */}
      <main className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
        {/* VOXORA Logo */}
        <div className="animate-fade-up flex flex-col items-center">
          <VoxoraLogo size="xl" showText={false} />
          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#263451]">
            VOX<span className="text-[#7050C8]">ORA</span>
          </h2>
        </div>

        {/* Main Heading */}
        <h1 className="animate-fade-up-delay-1 mt-6 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#263451] leading-[1.15]">
          Your Voice. Our Campus.{' '}
          <span className="bg-gradient-to-r from-[#7050C8] via-[#A78BFA] to-[#60A5FA] bg-clip-text text-transparent">
            Better Together.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up-delay-2 mt-5 text-base sm:text-xl text-slate-600 font-medium max-w-lg leading-relaxed">
          A smarter way to make your campus better.
        </p>

        {/* Action Buttons */}
        <div className="animate-fade-up-delay-3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto min-w-[185px] inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-[#7050C8] via-[#8B6CE8] to-[#60A5FA] shadow-lg shadow-[#7050C8]/25 hover:shadow-xl hover:shadow-[#7050C8]/35 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto min-w-[185px] inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-bold text-[#263451] bg-white/90 backdrop-blur-md border border-[#A78BFA]/45 shadow-sm hover:border-[#7050C8] hover:text-[#7050C8] hover:bg-white hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
        </div>
      </main>
    </div>
  );
}
