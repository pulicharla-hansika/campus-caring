import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  PlusCircle,
  SearchCheck,
  History,
  ArrowRight,
  BellRing,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import StatCard from '../../components/StatCard';
import Button from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import ComplaintCard from '../../components/ComplaintCard';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { getStudentComplaints } = useComplaints();
  const navigate = useNavigate();

  const myComplaints = getStudentComplaints(user?.id);

  const totalCount = myComplaints.length;
  const pendingCount = myComplaints.filter(
    (c) => c.status === 'Pending' || c.status === 'Under Review'
  ).length;
  const inProgressCount = myComplaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = myComplaints.filter((c) => c.status === 'Resolved').length;

  // Build flat feed of recent updates across this student's complaints
  const recentUpdates = myComplaints
    .flatMap((c) =>
      (c.updates || []).map((u) => ({
        ...u,
        complaintId: c.id,
        complaintTitle: c.title,
      }))
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  const recentComplaints = [...myComplaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="space-y-7">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7050C8] via-[#8B6CE8] to-[#60A5FA] p-6 sm:p-8 text-white shadow-lg shadow-[#7050C8]/20">
        <div className="absolute -top-16 -right-12 w-56 h-56 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-20 left-1/3 w-48 h-48 rounded-full bg-[#BFDBFE]/25 blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm">
              Marwadi University • {user?.department} ({user?.yearOfStudy})
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-white/90 max-w-2xl">
              Your Voice. Our Campus. Better Together. Track your active campus complaints or report a new issue right away.
            </p>
          </div>

          {/* Quick-action buttons */}
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Button
              variant="outline"
              icon={PlusCircle}
              onClick={() => navigate('/student/submit')}
              className="!bg-white !text-[#7050C8] !border-white hover:!bg-[#F0EBFF]"
            >
              Submit a Complaint
            </Button>
            <Button
              variant="ghost"
              icon={SearchCheck}
              onClick={() => navigate('/student/track')}
              className="!bg-white/15 !text-white hover:!bg-white/25 border border-white/25"
            >
              Track My Complaints
            </Button>
            <Button
              variant="ghost"
              icon={History}
              onClick={() => navigate('/student/complaints')}
              className="!bg-white/15 !text-white hover:!bg-white/25 border border-white/25"
            >
              View Complaint History
            </Button>
          </div>
        </div>
      </section>

      {/* Statistic Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Complaints"
          value={totalCount}
          subtitle="All submitted by you"
          icon={FileText}
          accent="lavender"
          onClick={() => navigate('/student/complaints')}
        />
        <StatCard
          title="Pending Complaints"
          value={pendingCount}
          subtitle="Submitted & under review"
          icon={Clock}
          accent="amber"
          onClick={() => navigate('/student/complaints?status=Pending')}
        />
        <StatCard
          title="In Progress Complaints"
          value={inProgressCount}
          subtitle="Active maintenance underway"
          icon={Wrench}
          accent="blue"
          onClick={() => navigate('/student/complaints?status=In Progress')}
        />
        <StatCard
          title="Resolved Complaints"
          value={resolvedCount}
          subtitle="Completed & verified"
          icon={CheckCircle2}
          accent="emerald"
          onClick={() => navigate('/student/complaints?status=Resolved')}
        />
      </section>

      {/* Main Grid: Recent Complaints + Recent Updates */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Recent Submissions */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#263451]">My Recent Complaints</h2>
              <p className="text-xs text-slate-500">Latest issues reported from your account</p>
            </div>
            <Link
              to="/student/complaints"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#7050C8] hover:underline"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#A78BFA]/50 p-10 text-center">
              <p className="text-base font-bold text-[#263451]">No complaints submitted yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Spot an issue in your hostel, classroom, or lab? Let campus administration know.
              </p>
              <Button
                variant="primary"
                icon={PlusCircle}
                className="mt-5"
                onClick={() => navigate('/student/submit')}
              >
                Submit Your First Complaint
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {recentComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          )}
        </section>

        {/* Recent Complaint Updates */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F0EBFF] text-[#7050C8] flex items-center justify-center">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#263451]">
                  Recent Complaint Updates
                </h2>
                <p className="text-xs text-slate-500">Real-time status & remark activity</p>
              </div>
            </div>
          </div>

          {recentUpdates.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">
              Updates from campus administrators will appear here once you submit a complaint.
            </p>
          ) : (
            <div className="space-y-4">
              {recentUpdates.map((upd) => (
                <div
                  key={upd.id}
                  className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-[#A78BFA]/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Link
                      to={`/student/complaints/${upd.complaintId}`}
                      className="font-mono text-xs font-bold text-[#7050C8] hover:underline"
                    >
                      {upd.complaintId}
                    </Link>
                    <StatusBadge status={upd.status} showIcon={false} />
                  </div>
                  <p className="mt-1.5 text-xs font-bold text-[#263451] line-clamp-1">
                    {upd.complaintTitle}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{upd.remark}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>By {upd.updatedBy}</span>
                    <span>
                      {new Date(upd.timestamp).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
