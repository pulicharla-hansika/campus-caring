import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import VoxoraLogo from '../components/VoxoraLogo';
import Button from '../components/Button';
import { FormField, inputBaseClass } from '../components/FormInput';
import { DEPARTMENTS, YEARS_OF_STUDY, UNIVERSITY_NAME } from '../constants/campusData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerStudent } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    studentId: '',
    department: '',
    yearOfStudy: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      next.fullName = 'Please enter your full name (at least 3 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      next.email = 'University email is required.';
    } else if (!emailRegex.test(form.email.trim())) {
      next.email = 'Please enter a valid university email address.';
    }

    if (!form.studentId.trim() || form.studentId.trim().length < 5) {
      next.studentId = 'Please enter your valid Student ID (e.g., 23010101045).';
    }

    if (!form.department) {
      next.department = 'Please select your department.';
    }

    if (!form.yearOfStudy) {
      next.yearOfStudy = 'Please select your year of study.';
    }

    if (!form.password) {
      next.password = 'Please create a password.';
    } else if (form.password.length < 6) {
      next.password = 'Password must be at least 6 characters long.';
    }

    if (!form.confirmPassword) {
      next.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      next.confirmPassword = 'Passwords do not match.';
    }

    if (!form.acceptTerms) {
      next.acceptTerms = 'You must agree to the VOXORA Terms and Conditions.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      const res = registerStudent(form);
      setSubmitting(false);

      if (!res.success) {
        setServerError(res.error);
        return;
      }

      showToast(`Welcome to VOXORA, ${res.user.fullName}! Your account is ready.`, 'success');
      navigate('/student/dashboard');
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0EBFF]/75 via-white to-[#BFDBFE]/45 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#263451] hover:text-[#7050C8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Welcome
          </Link>
          <VoxoraLogo size="sm" />
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-[#7050C8]/10 border border-slate-200/70 overflow-hidden grid lg:grid-cols-12">
          {/* Left decorative lavender-blue panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#7050C8] via-[#8B6CE8] to-[#60A5FA] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-white/10 blur-xl" />
            <div className="absolute -bottom-20 -left-16 w-60 h-60 rounded-full bg-[#BFDBFE]/20 blur-2xl" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                {UNIVERSITY_NAME}
              </span>
              <h1 className="mt-6 text-3xl font-extrabold leading-tight">
                Join VOXORA Student Portal
              </h1>
              <p className="mt-3 text-sm text-white/90 leading-relaxed">
                Register with your Marwadi University student profile to submit campus or hostel complaints and track every resolution step in real time.
              </p>

              <ul className="mt-8 space-y-3.5 text-sm">
                {[
                  'Submit maintenance, hostel & Wi-Fi issues in seconds',
                  'Unique Complaint ID generated for every request',
                  'Live 4-stage progress timeline & admin remarks',
                  'Protected student data & private complaint history',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#BFDBFE] shrink-0 mt-0.5" />
                    <span className="text-white/95">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 mt-10 pt-6 border-t border-white/20 text-xs text-white/80">
              Your Voice. Our Campus. Better Together.
            </div>
          </div>

          {/* Right registration form */}
          <div className="lg:col-span-7 p-7 sm:p-10">
            <h2 className="text-2xl font-extrabold text-[#263451]">
              Create Student Account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your academic details to activate your VOXORA access.
            </p>

            {serverError && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-sm font-medium text-rose-700">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Full Name" htmlFor="fullName" required error={errors.fullName}>
                  <input
                    id="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange('fullName')}
                    placeholder="e.g. Aarav Patel"
                    className={inputBaseClass(errors.fullName)}
                  />
                </FormField>

                <FormField label="Student ID" htmlFor="studentId" required error={errors.studentId}>
                  <input
                    id="studentId"
                    type="text"
                    value={form.studentId}
                    onChange={handleChange('studentId')}
                    placeholder="e.g. 23010101045"
                    className={inputBaseClass(errors.studentId)}
                  />
                </FormField>
              </div>

              <FormField
                label="University Email"
                htmlFor="reg-email"
                required
                error={errors.email}
                hint="Use your official Marwadi University email address"
              >
                <input
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="name@marwadiuniversity.ac.in"
                  className={inputBaseClass(errors.email)}
                />
              </FormField>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Department" htmlFor="department" required error={errors.department}>
                  <select
                    id="department"
                    value={form.department}
                    onChange={handleChange('department')}
                    className={inputBaseClass(errors.department)}
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Year of Study" htmlFor="yearOfStudy" required error={errors.yearOfStudy}>
                  <select
                    id="yearOfStudy"
                    value={form.yearOfStudy}
                    onChange={handleChange('yearOfStudy')}
                    className={inputBaseClass(errors.yearOfStudy)}
                  >
                    <option value="">Select year</option>
                    {YEARS_OF_STUDY.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Password" htmlFor="reg-password" required error={errors.password}>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange('password')}
                      placeholder="Minimum 6 characters"
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

                <FormField
                  label="Confirm Password"
                  htmlFor="confirmPassword"
                  required
                  error={errors.confirmPassword}
                >
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      placeholder="Re-enter password"
                      className={`${inputBaseClass(errors.confirmPassword)} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#7050C8] cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormField>
              </div>

              <div>
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.acceptTerms}
                    onChange={handleChange('acceptTerms')}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-[#7050C8] focus:ring-[#A78BFA]"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    I agree to the{' '}
                    <span className="font-semibold text-[#7050C8]">
                      VOXORA Terms & Campus Grievance Policy
                    </span>{' '}
                    and confirm that the submitted student information belongs to me.
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{errors.acceptTerms}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={UserPlus}
                isLoading={submitting}
                className="w-full mt-2"
              >
                Register Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already registered on VOXORA?{' '}
              <Link to="/login" className="font-bold text-[#7050C8] hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
