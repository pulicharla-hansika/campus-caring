import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import VoxoraLogo from '../components/VoxoraLogo';
import Button from '../components/Button';
import { FormField, inputBaseClass } from '../components/FormInput';
import { DEMO_CREDENTIALS, UNIVERSITY_NAME } from '../constants/campusData';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resetPasswordDemo } = useAuth();
  const { showToast } = useToast();

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState(() => storageService.getRememberedEmail() || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => Boolean(storageService.getRememberedEmail()));
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetFeedback, setResetFeedback] = useState(null);

  const handleRoleSwitch = (nextRole) => {
    setRole(nextRole);
    setAuthError('');
    setErrors({});
  };

  const fillDemo = (targetRole) => {
    setRole(targetRole);
    const creds = DEMO_CREDENTIALS[targetRole];
    setEmail(creds.email);
    setPassword(creds.password);
    setAuthError('');
    setErrors({});
  };

  const validate = () => {
    const next = {};
    if (!email.trim()) {
      next.email = 'University email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (!password) {
      next.password = 'Password is required.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const res = login({ email, password, role, rememberMe });
      setLoading(false);

      if (!res.success) {
        setAuthError(res.error);
        return;
      }

      showToast(`Welcome back, ${res.user.fullName}!`, 'success');
      const fromPath = location.state?.from?.pathname;
      if (fromPath && ((role === 'admin' && fromPath.startsWith('/admin')) || (role === 'student' && fromPath.startsWith('/student')))) {
        navigate(fromPath, { replace: true });
      } else {
        navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard', { replace: true });
      }
    }, 300);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetFeedback({ type: 'error', text: 'Please enter your university email.' });
      return;
    }
    const res = resetPasswordDemo(resetEmail);
    setResetFeedback({
      type: res.success ? 'success' : 'error',
      text: res.success ? res.message : res.error,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0EBFF]/70 via-white to-[#BFDBFE]/45 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl shadow-[#7050C8]/10 border border-slate-200/70 overflow-hidden grid lg:grid-cols-12">
        {/* Left Lavender Decorative Illustration Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#F0EBFF] via-[#E5DCFF] to-[#BFDBFE]/70 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-[#A78BFA]/25 blur-2xl" />
          <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-[#60A5FA]/25 blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <VoxoraLogo size="sm" />
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#7050C8] hover:text-[#263451] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Welcome
              </Link>
            </div>

            <div className="mt-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-[#7050C8] text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                {UNIVERSITY_NAME}
              </span>
              <h1 className="mt-4 text-3xl font-extrabold text-[#263451] leading-tight">
                Your Voice. Our Campus.{' '}
                <span className="text-[#7050C8]">Better Together.</span>
              </h1>
              <p className="mt-3 text-sm text-[#263451]/75 leading-relaxed">
                Sign in to report campus maintenance concerns, monitor hostel resolutions, and collaborate with university administration.
              </p>
            </div>

            {/* Minimal SVG Campus Voice Illustration */}
            <div className="mt-8 bg-white/75 backdrop-blur-md rounded-2xl p-5 border border-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7050C8] to-[#60A5FA] text-white flex items-center justify-center font-bold text-sm">
                  MU
                </div>
                <div>
                  <p className="text-xs font-bold text-[#263451]">Transparent 4-Stage Tracking</p>
                  <p className="text-[11px] text-slate-500">Submitted → Under Review → In Progress → Resolved</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-1.5">
                <div className="h-1.5 rounded-full bg-[#7050C8]" />
                <div className="h-1.5 rounded-full bg-[#A78BFA]" />
                <div className="h-1.5 rounded-full bg-[#60A5FA]" />
                <div className="h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-5 border-t border-[#A78BFA]/25 flex items-center justify-between text-xs text-[#263451]/70">
            <span>VOXORA Portal</span>
            <Link to="/admin/login" className="font-bold text-[#7050C8] hover:underline">
              Dedicated Admin Portal →
            </Link>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-[#263451]">Sign In to VOXORA</h2>
              <p className="text-sm text-slate-500 mt-0.5">Choose your portal role to continue</p>
            </div>
          </div>

          {/* Role Toggle */}
          <div className="mt-6 grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#F0EBFF]/70 border border-[#A78BFA]/25">
            <button
              type="button"
              onClick={() => handleRoleSwitch('student')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-white text-[#7050C8] shadow-sm'
                  : 'text-slate-600 hover:text-[#263451]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('admin')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-white text-[#7050C8] shadow-sm'
                  : 'text-slate-600 hover:text-[#263451]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Administrator
            </button>
          </div>

          {authError && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-sm font-medium text-rose-700">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <FormField label="University Email" htmlFor="login-email" required error={errors.email}>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  if (authError) setAuthError('');
                }}
                placeholder={
                  role === 'admin'
                    ? 'admin@marwadiuniversity.ac.in'
                    : 'aarav.patel@marwadiuniversity.ac.in'
                }
                className={inputBaseClass(errors.email)}
              />
            </FormField>

            <FormField label="Password" htmlFor="login-password" required error={errors.password}>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                    if (authError) setAuthError('');
                  }}
                  placeholder="Enter your password"
                  className={`${inputBaseClass(errors.password)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#7050C8] cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#7050C8] focus:ring-[#A78BFA]"
                />
                Remember Me
              </label>

              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setResetFeedback(null);
                  setForgotOpen(true);
                }}
                className="font-semibold text-[#7050C8] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={LogIn}
              isLoading={loading}
              className="w-full"
            >
              Login as {role === 'admin' ? 'Administrator' : 'Student'}
            </Button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Demo Quick Login (Marwadi University)
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F0EBFF] text-[#7050C8] hover:bg-[#A78BFA]/25 transition-colors cursor-pointer"
              >
                Fill Demo Student ({DEMO_CREDENTIALS.student.name})
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#BFDBFE]/50 text-[#263451] hover:bg-[#BFDBFE] transition-colors cursor-pointer"
              >
                Fill Demo Admin ({DEMO_CREDENTIALS.admin.name})
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-600">
            <span>
              New student at MU?{' '}
              <Link to="/register" className="font-bold text-[#7050C8] hover:underline">
                Create an account
              </Link>
            </span>
            <Link to="/admin/login" className="text-xs font-semibold text-slate-500 hover:text-[#7050C8]">
              Admin Login Page →
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263451]/45 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-up">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#263451]">Reset Password</h3>
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#263451] hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-1.5 text-sm text-slate-500">
              Enter your registered Marwadi University email to retrieve password reset guidance.
            </p>
            <form onSubmit={handleForgotSubmit} className="mt-4 space-y-4">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name@marwadiuniversity.ac.in"
                className={inputBaseClass(false)}
              />
              {resetFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    resetFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {resetFeedback.text}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setForgotOpen(false)}>
                  Close
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Send Reset Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
