import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  Building2,
  User,
  CheckCircle2,
  MessageSquarePlus,
  ShieldAlert,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { useToast } from '../context/ToastContext';
import { COMPLAINT_STATUSES } from '../constants/campusData';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import ProgressTimeline from '../components/ProgressTimeline';
import Button from '../components/Button';
import { FormField, inputBaseClass } from '../components/FormInput';

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { getComplaintById, updateComplaint } = useComplaints();
  const { showToast } = useToast();

  const complaint = getComplaintById(id);

  const [statusInput, setStatusInput] = useState(complaint?.status || 'Pending');
  const [remarkInput, setRemarkInput] = useState('');
  const [saving, setSaving] = useState(false);

  if (!complaint) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-10 text-center">
        <h1 className="text-xl font-extrabold text-[#263451]">Complaint Not Found</h1>
        <p className="mt-2 text-sm text-slate-500">
          We could not find a complaint with ID &ldquo;{id}&rdquo;.
        </p>
        <Button
          variant="primary"
          className="mt-5"
          onClick={() => navigate(isAdmin ? '/admin/manage' : '/student/complaints')}
        >
          Back to Complaints
        </Button>
      </div>
    );
  }

  // Privacy guard: students can only view their own complaints
  if (!isAdmin && complaint.studentId !== user?.id) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-amber-200 bg-amber-50/40 p-10 text-center">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
        <h1 className="mt-3 text-xl font-extrabold text-[#263451]">Access Restricted</h1>
        <p className="mt-2 text-sm text-slate-600">
          For student privacy protection, you can only inspect details of complaints submitted from your own account.
        </p>
        <Button
          variant="primary"
          className="mt-5"
          onClick={() => navigate('/student/complaints')}
        >
          Go to My Complaints
        </Button>
      </div>
    );
  }

  const handleAdminUpdate = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateComplaint(complaint.id, {
        status: statusInput,
        remark: remarkInput,
        adminName: user?.fullName || 'Campus Administrator',
      });
      setSaving(false);
      setRemarkInput('');
      showToast(`Complaint ${complaint.id} updated to "${statusInput}".`, 'success');
    }, 250);
  };

  const handleQuickResolve = () => {
    setStatusInput('Resolved');
    updateComplaint(complaint.id, {
      status: 'Resolved',
      remark: remarkInput.trim() || 'Issue verified and marked as resolved by administration.',
      adminName: user?.fullName || 'Campus Administrator',
    });
    setRemarkInput('');
    showToast(`Complaint ${complaint.id} marked as Resolved.`, 'success');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#263451] hover:text-[#7050C8] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {!isAdmin && (
          <Link
            to={`/student/track/${complaint.id}`}
            className="text-xs font-bold text-[#7050C8] hover:underline"
          >
            Open in Track View →
          </Link>
        )}
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-[#F0EBFF] text-[#7050C8]">
                {complaint.id}
              </span>
              <StatusBadge status={complaint.status} size="md" />
              <PriorityBadge priority={complaint.priority} />
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#263451]">
              {complaint.title}
            </h1>
          </div>
          <div className="text-left md:text-right text-xs text-slate-500 shrink-0">
            <p className="font-semibold text-[#263451]">Date Submitted</p>
            <p>
              {new Date(complaint.createdAt).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Tag className="w-3.5 h-3.5 text-[#7050C8]" />
              Category
            </div>
            <p className="mt-1 text-sm font-bold text-[#263451]">{complaint.category}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-[#60A5FA]" />
              Location
            </div>
            <p className="mt-1 text-sm font-bold text-[#263451]">{complaint.location}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Building2 className="w-3.5 h-3.5 text-[#7050C8]" />
              Building / Block
            </div>
            <p className="mt-1 text-sm font-bold text-[#263451]">
              {complaint.buildingBlock || 'Not specified'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-[#60A5FA]" />
              Date of Issue
            </div>
            <p className="mt-1 text-sm font-bold text-[#263451]">{complaint.dateOfIssue}</p>
          </div>
        </div>

        {isAdmin && (
          <div className="p-4 rounded-2xl bg-[#F0EBFF]/50 border border-[#A78BFA]/25 flex flex-wrap items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#263451]">
              <User className="w-4 h-4 text-[#7050C8]" />
              Submitted by: {complaint.studentName}
            </span>
            <span className="text-slate-600">ID: {complaint.studentRollNo}</span>
            <span className="text-slate-600">Department: {complaint.studentDepartment}</span>
          </div>
        )}

        {/* Description */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
            Detailed Description
          </h2>
          <p className="text-sm sm:text-base text-[#263451]/90 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            {complaint.description}
          </p>
        </div>

        {/* Uploaded Image */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
            Attached Evidence
          </h2>
          {complaint.imageUrl ? (
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-w-md bg-slate-50">
              <img
                src={complaint.imageUrl}
                alt={complaint.title}
                className="w-full max-h-72 object-cover"
              />
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
              <ImageIcon className="w-4 h-4 text-slate-400" />
              No image was uploaded with this complaint.
            </div>
          )}
        </div>

        {/* Progress Timeline */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-5">
            Progress Timeline
          </h2>
          <ProgressTimeline currentStatus={complaint.status} updates={complaint.updates} />
        </div>
      </div>

      {/* Admin Action Panel (only for Administrators) */}
      {isAdmin && (
        <form
          onSubmit={handleAdminUpdate}
          className="bg-white rounded-3xl border border-[#A78BFA]/40 shadow-sm p-6 sm:p-8 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#263451]">
                Administrator Action & Status Update
              </h2>
              <p className="text-xs text-slate-500">
                Changes immediately sync to the student&apos;s VOXORA tracking view.
              </p>
            </div>
            {complaint.status !== 'Resolved' && (
              <Button
                type="button"
                variant="success"
                size="sm"
                icon={CheckCircle2}
                onClick={handleQuickResolve}
              >
                Mark as Resolved
              </Button>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <FormField label="Update Status" htmlFor="adm-status">
              <select
                id="adm-status"
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                className={inputBaseClass(false)}
              >
                {COMPLAINT_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="sm:col-span-2">
              <FormField label="Administrator Remark" htmlFor="adm-remark">
                <input
                  id="adm-remark"
                  type="text"
                  value={remarkInput}
                  onChange={(e) => setRemarkInput(e.target.value)}
                  placeholder="Add an update note for the student (e.g., Technician dispatched)"
                  className={inputBaseClass(false)}
                />
              </FormField>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" icon={MessageSquarePlus} isLoading={saving}>
              Save Update & Notify Student
            </Button>
          </div>
        </form>
      )}

      {/* Administrator Remarks History */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <h2 className="text-base font-extrabold text-[#263451] mb-4">
          Administrator Remarks & Activity Log
        </h2>
        <div className="space-y-3">
          {[...(complaint.updates || [])].reverse().map((upd) => (
            <div
              key={upd.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={upd.status} />
                  <span className="text-xs font-semibold text-slate-500">
                    Updated by {upd.updatedBy}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#263451] font-medium">{upd.remark}</p>
              </div>
              <span className="text-xs text-slate-400 shrink-0">
                {new Date(upd.timestamp).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
