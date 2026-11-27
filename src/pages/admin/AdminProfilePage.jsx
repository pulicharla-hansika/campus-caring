import React from 'react';
import { ShieldCheck, Mail, Building2, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useToast } from '../../context/ToastContext';
import { UNIVERSITY_NAME } from '../../constants/campusData';
import Button from '../../components/Button';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const { complaints, resetAllDemoData } = useComplaints();
  const { showToast } = useToast();

  const handleReset = () => {
    resetAllDemoData();
    showToast('Demo complaints and sample data restored to defaults.', 'info');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263451]">
          Administrator Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {UNIVERSITY_NAME} — Grievance Redressal & Facility Operations Account.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7050C8] to-[#60A5FA] text-white flex items-center justify-center text-xl font-extrabold shadow-md">
            RM
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0EBFF] text-[#7050C8] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Administrator
            </span>
            <h2 className="mt-1.5 text-xl font-extrabold text-[#263451]">
              {user?.fullName || 'Dr. Rajesh Mehta'}
            </h2>
            <p className="text-sm text-slate-500">
              {user?.designation || 'Chief Campus Grievance Officer'}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Mail className="w-4 h-4 text-[#7050C8]" />
              Official Email
            </div>
            <p className="mt-1 font-bold text-[#263451]">{user?.email}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Building2 className="w-4 h-4 text-[#60A5FA]" />
              Office / Department
            </div>
            <p className="mt-1 font-bold text-[#263451]">{user?.department}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#F0EBFF]/60 border border-[#A78BFA]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#263451]">
              Demo Data Management ({complaints.length} records active)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Restore the initial Marwadi University sample complaints if you wish to reset your demo session.
            </p>
          </div>
          <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleReset}>
            Reset Sample Data
          </Button>
        </div>
      </div>
    </div>
  );
}
