import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, LogIn, ArrowLeft, LockKeyhole } from 'lucide-react';
import VoxoraLogo from '../components/VoxoraLogo';
import Button from '../components/Button';
import { FormField, inputBaseClass } from '../components/FormInput';
import { DEMO_CREDENTIALS, UNIVERSITY_NAME } from '../constants/campusData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoFill = () => {
    setEmail(DEMO_CREDENTIALS.admin.email);
    setPassword(DEMO_CREDENTIALS.admin.password);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both Administrator Email and Password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login({ email, password, role: 'admin', rememberMe: true });
      setLoading(false);

      if (!res.success) {
        setError(res.error);
        return;
      }

      showToast(`Administrator access granted. Welcome, ${res.user.fullName}.`, 'success');
      navigate('/admin/dashboard', { replace: true });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#263451] via-[#314166] to-[#7050C8] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-7 sm:p-9 border border-white/20">
        <div className="flex items-center justify-between">
          <VoxoraLogo size="sm" />
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#7050C8] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Student Login
          </Link>
        </div>

        <div className="mt-7">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0EBFF] text-[#7050C8] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Restricted Administration Portal
          </span>
          <h1 className="mt-3 text-2xl font-extrabold text-[#263451]">
            Administrator Login
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {UNIVERSITY_NAME} — Authorized Grievance & Facilities Staff Only.
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <FormField label="Admin Email" htmlFor="admin-email" required>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="admin@marwadiuniversity.ac.in"
              className={inputBaseClass(Boolean(error))}
            />
          </FormField>

          <FormField label="Password" htmlFor="admin-password" required>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter administrator password"
                className={`${inputBaseClass(Boolean(error))} pr-11`}
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={LogIn}
            isLoading={loading}
            className="w-full"
          >
            Login to Admin Dashboard
          </Button>
        </form>

        {/* Clearly Labelled Demo Admin Credentials */}
        <div className="mt-6 p-4 rounded-2xl bg-[#F0EBFF]/70 border border-[#A78BFA]/30">
          <div className="flex items-center gap-2 text-xs font-bold text-[#7050C8]">
            <LockKeyhole className="w-3.5 h-3.5" />
            Demo Administrator Credentials
          </div>
          <div className="mt-2 text-xs text-[#263451]/80 space-y-0.5 font-mono">
            <p>Email: {DEMO_CREDENTIALS.admin.email}</p>
            <p>Pass: {DEMO_CREDENTIALS.admin.password}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDemoFill}
            className="mt-3 w-full"
          >
            Auto-fill Demo Admin Login
          </Button>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          VOXORA Role-Based Access Control • Students cannot access admin routes.
        </p>
      </div>
    </div>
  );
}
