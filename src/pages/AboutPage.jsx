import React from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus2,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UNIVERSITY_NAME } from '../constants/campusData';
import VoxoraLogo from '../components/VoxoraLogo';

export default function AboutPage() {
  const { isAuthenticated, isAdmin } = useAuth();

  const content = (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Section */}
      <section className="rounded-3xl bg-gradient-to-br from-[#F0EBFF] via-white to-[#BFDBFE]/50 border border-[#A78BFA]/30 p-7 sm:p-10 shadow-sm">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#7050C8] text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          About VOXORA • {UNIVERSITY_NAME}
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#263451] leading-tight">
          Your Voice. Our Campus.{' '}
          <span className="text-[#7050C8]">Better Together.</span>
        </h1>
        <p className="mt-3 text-base text-slate-600 max-w-3xl leading-relaxed">
          VOXORA is a modern digital campus complaint management portal built specifically for{' '}
          <strong className="text-[#263451]">Marwadi University, Rajkot</strong>. It bridges the communication gap between students and university administration by transforming paper registers and scattered emails into a fast, transparent, and trackable online workflow.
        </p>
      </section>

      {/* Why VOXORA & How it helps */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm">
          <div className="w-11 h-11 rounded-2xl bg-[#F0EBFF] text-[#7050C8] flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-[#263451]">Why VOXORA Was Created</h2>
          <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
            In a vibrant university campus with academic blocks, engineering labs, libraries, and multi-wing hostels, everyday infrastructure issues need quick attention. VOXORA gives every student an accessible voice so hostel maintenance, electricity, water supply, cleanliness, and Wi-Fi problems are documented and resolved efficiently.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm">
          <div className="w-11 h-11 rounded-2xl bg-[#BFDBFE]/50 text-[#263451] flex items-center justify-center mb-4">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-[#263451]">How It Helps Students</h2>
          <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7050C8] mt-2 shrink-0" />
              Report issues 24/7 from anywhere on campus without visiting multiple offices.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] mt-2 shrink-0" />
              Attach photo evidence and set priority levels for urgent repairs.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7050C8] mt-2 shrink-0" />
              Monitor transparent administrator remarks and stage-by-stage progress.
            </li>
          </ul>
        </div>
      </section>

      {/* 3-Step Workflow */}
      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold text-[#263451]">How VOXORA Works</h2>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7050C8] to-[#A78BFA] text-white flex items-center justify-center mb-4">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#263451]">1. Submit a Complaint</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Choose the category, specify the campus building or hostel block, set priority, optionally upload a photo, and receive a unique Complaint ID instantly.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#60A5FA] to-[#7050C8] text-white flex items-center justify-center mb-4">
              <SearchCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#263451]">2. Track Progress Live</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Use your Complaint ID on the Track Complaint page to follow four clear stages: Submitted, Under Review, In Progress, and Resolved.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#263451] to-[#60A5FA] text-white flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#263451]">3. Admin Resolution</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Campus administrators filter issues by priority and location, dispatch maintenance teams, post remarks, and analyze campus trends to prevent repeat problems.
            </p>
          </div>
        </div>
      </section>

      {isAuthenticated && (
        <div className="flex justify-end">
          <Link
            to={isAdmin ? '/admin/dashboard' : '/student/submit'}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#7050C8] to-[#60A5FA] shadow-md hover:shadow-lg transition-all"
          >
            {isAdmin ? 'Return to Admin Dashboard' : 'Submit a New Complaint'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );

  // If rendered standalone (unauthenticated visitor accessing /about directly), wrap with clean header
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0EBFF]/55 via-white to-[#BFDBFE]/25">
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link to="/">
              <VoxoraLogo size="sm" />
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold text-[#7050C8] hover:underline">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7050C8] to-[#60A5FA]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>
        <main className="px-4 sm:px-6 py-10">{content}</main>
      </div>
    );
  }

  return content;
}
