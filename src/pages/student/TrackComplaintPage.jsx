import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  Tag,
  MessageSquareText,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import Button from '../../components/Button';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';
import ProgressTimeline from '../../components/ProgressTimeline';

export default function TrackComplaintPage() {
  const { id: routeId } = useParams();
  const { user } = useAuth();
  const { getComplaintById, getStudentComplaints } = useComplaints();

  const myComplaints = getStudentComplaints(user?.id);
  const [searchInput, setSearchInput] = useState(routeId || myComplaints[0]?.id || '');
  const [activeQuery, setActiveQuery] = useState(routeId || myComplaints[0]?.id || '');

  useEffect(() => {
    if (routeId) {
      setSearchInput(routeId);
      setActiveQuery(routeId);
    }
  }, [routeId]);

  const foundComplaint = activeQuery ? getComplaintById(activeQuery) : null;
  const isOwnedByStudent =
    foundComplaint && (foundComplaint.studentId === user?.id || user?.role === 'admin');

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveQuery(searchInput.trim());
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263451]">
          Track Complaint Status
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter your unique VOXORA Complaint ID to inspect real-time progress and administrator remarks.
        </p>
      </div>

      {/* Search Bar Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Complaint ID (e.g. VOX-2026-1001)"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-[#263451] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#7050C8] focus:ring-2 focus:ring-[#A78BFA]/30"
            />
          </div>
          <Button type="submit" variant="primary" size="lg" icon={Search}>
            Track Complaint
          </Button>
        </form>

        {/* Quick-select student's own complaint IDs */}
        {myComplaints.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Your IDs:</span>
            {myComplaints.slice(0, 6).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSearchInput(c.id);
                  setActiveQuery(c.id);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                  activeQuery.toUpperCase() === c.id
                    ? 'bg-[#7050C8] text-white shadow-xs'
                    : 'bg-[#F0EBFF] text-[#7050C8] hover:bg-[#A78BFA]/25'
                }`}
              >
                {c.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Result Section */}
      {!activeQuery ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-base font-bold text-[#263451]">Enter a Complaint ID above</p>
          <p className="mt-1 text-sm text-slate-500">
            Example: <span className="font-mono font-semibold text-[#7050C8]">VOX-2026-1001</span>
          </p>
        </div>
      ) : !foundComplaint ? (
        <div className="bg-white rounded-3xl border border-rose-200 bg-rose-50/30 p-8 text-center">
          <p className="text-lg font-bold text-[#263451]">
            No complaint found for &ldquo;{activeQuery}&rdquo;
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Please verify the Complaint ID format (e.g., VOX-2026-1001) and try again.
          </p>
        </div>
      ) : !isOwnedByStudent ? (
        <div className="bg-white rounded-3xl border border-amber-200 bg-amber-50/40 p-8 text-center">
          <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
          <p className="mt-3 text-lg font-bold text-[#263451]">
            Protected Student Record
          </p>
          <p className="mt-1 text-sm text-slate-600 max-w-md mx-auto">
            Complaint <span className="font-mono font-bold">{foundComplaint.id}</span> belongs to another student. To protect student privacy, detailed records are only visible to the submitting student and campus administrators.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header & Progress Tracker Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-[#F0EBFF] text-[#7050C8]">
                    {foundComplaint.id}
                  </span>
                  <StatusBadge status={foundComplaint.status} size="md" />
                  <PriorityBadge priority={foundComplaint.priority} />
                </div>
                <h2 className="mt-3 text-xl sm:text-2xl font-extrabold text-[#263451]">
                  {foundComplaint.title}
                </h2>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#7050C8]" />
                    {foundComplaint.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#60A5FA]" />
                    {foundComplaint.location}
                    {foundComplaint.buildingBlock ? ` (${foundComplaint.buildingBlock})` : ''}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#7050C8]" />
                    Submitted{' '}
                    {new Date(foundComplaint.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <Link
                to={`/student/complaints/${foundComplaint.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#F0EBFF] text-[#7050C8] hover:bg-[#A78BFA]/25 transition-colors shrink-0 self-start"
              >
                Full Details
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4-Stage Visual Progress Timeline */}
            <div className="pt-7">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-5">
                Resolution Progress
              </h3>
              <ProgressTimeline
                currentStatus={foundComplaint.status}
                updates={foundComplaint.updates}
              />
            </div>
          </div>

          {/* Administrator Updates Log */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#BFDBFE]/50 text-[#263451] flex items-center justify-center">
                <MessageSquareText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#263451]">
                  Administrator Updates & Remarks
                </h3>
                <p className="text-xs text-slate-500">
                  Chronological log of actions taken on this complaint
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[...(foundComplaint.updates || [])].reverse().map((upd) => (
                <div
                  key={upd.id}
                  className="p-4 rounded-2xl bg-gradient-to-r from-[#F0EBFF]/45 to-[#BFDBFE]/20 border border-[#A78BFA]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={upd.status} />
                      <span className="text-xs font-semibold text-slate-500">
                        by {upd.updatedBy}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#263451] font-medium">{upd.remark}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium shrink-0">
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
      )}
    </div>
  );
}
