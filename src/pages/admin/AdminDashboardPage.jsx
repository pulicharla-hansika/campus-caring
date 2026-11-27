import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileStack,
  Clock,
  SearchCheck,
  Wrench,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import StatCard from '../../components/StatCard';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';
import Button from '../../components/Button';

export default function AdminDashboardPage() {
  const { complaints } = useComplaints();
  const navigate = useNavigate();

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const underReview = complaints.filter((c) => c.status === 'Under Review').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Category counts (top 6)
  const categoryMap = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxCatCount = topCategories[0]?.[1] || 1;

  // Priority overview
  const priorityCounts = {
    High: complaints.filter((c) => c.priority === 'High').length,
    Medium: complaints.filter((c) => c.priority === 'Medium').length,
    Low: complaints.filter((c) => c.priority === 'Low').length,
  };

  // Status chart bars
  const statusChart = [
    { label: 'Pending', count: pending, color: 'from-[#A78BFA] to-[#7050C8]' },
    { label: 'Under Review', count: underReview, color: 'from-[#BFDBFE] to-[#60A5FA]' },
    { label: 'In Progress', count: inProgress, color: 'from-indigo-400 to-[#7050C8]' },
    { label: 'Resolved', count: resolved, color: 'from-emerald-400 to-emerald-600' },
  ];
  const maxStatusCount = Math.max(...statusChart.map((s) => s.count), 1);

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263451]">
            Administrator Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time overview of campus complaints across Marwadi University, Rajkot.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" onClick={() => navigate('/admin/reports')}>
            View Reports
          </Button>
          <Button variant="primary" onClick={() => navigate('/admin/manage')}>
            Manage Complaints
          </Button>
        </div>
      </div>

      {/* 5 Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Complaints"
          value={total}
          subtitle="All campus tickets"
          icon={FileStack}
          accent="lavender"
          onClick={() => navigate('/admin/complaints')}
        />
        <StatCard
          title="Pending"
          value={pending}
          subtitle="Awaiting triage"
          icon={Clock}
          accent="amber"
          onClick={() => navigate('/admin/manage?status=Pending')}
        />
        <StatCard
          title="Under Review"
          value={underReview}
          subtitle="Assigned to team"
          icon={SearchCheck}
          accent="blue"
          onClick={() => navigate('/admin/manage?status=Under Review')}
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          subtitle="Work underway"
          icon={Wrench}
          accent="indigo"
          onClick={() => navigate('/admin/manage?status=In Progress')}
        />
        <StatCard
          title="Resolved"
          value={resolved}
          subtitle={`${total ? Math.round((resolved / total) * 100) : 0}% resolution rate`}
          icon={CheckCircle2}
          accent="emerald"
          onClick={() => navigate('/admin/manage?status=Resolved')}
        />
      </section>

      {/* Charts Row: Status Distribution & Category Overview & Priority Overview */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Status Distribution Chart */}
        <section className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-extrabold text-[#263451]">
                Status Distribution
              </h2>
              <p className="text-xs text-slate-500">Complaints across resolution stages</p>
            </div>
            <Layers className="w-4 h-4 text-[#7050C8]" />
          </div>

          <div className="h-44 flex items-end justify-around gap-4 pt-4 pb-2 px-2 border-b border-slate-100">
            {statusChart.map((item) => {
              const heightPct = Math.max(12, Math.round((item.count / maxStatusCount) * 100));
              return (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-extrabold text-[#263451]">{item.count}</span>
                  <div className="w-full max-w-[46px] bg-slate-100 rounded-xl h-28 flex items-end overflow-hidden p-1">
                    <div
                      className={`w-full rounded-lg bg-gradient-to-t ${item.color} transition-all duration-500`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-4 gap-2 pt-2.5 text-center">
            {statusChart.map((item) => (
              <span key={item.label} className="text-[11px] font-semibold text-slate-500 truncate">
                {item.label}
              </span>
            ))}
          </div>
        </section>

        {/* Complaint Category Overview */}
        <section className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-[#263451]">
                Category Overview
              </h2>
              <p className="text-xs text-slate-500">Top reported campus areas</p>
            </div>
            <Link to="/admin/reports" className="text-xs font-bold text-[#7050C8] hover:underline">
              Full Analytics
            </Link>
          </div>

          <div className="space-y-3.5">
            {topCategories.map(([cat, count]) => (
              <div key={cat}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#263451] truncate pr-2">{cat}</span>
                  <span className="font-bold text-[#7050C8]">{count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F0EBFF] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7050C8] to-[#60A5FA]"
                    style={{ width: `${Math.round((count / maxCatCount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Priority Overview */}
        <section className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-[#263451]">Priority Overview</h2>
                <p className="text-xs text-slate-500">Urgency breakdown</p>
              </div>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>

            <div className="space-y-3">
              {[
                { label: 'High Priority', count: priorityCounts.High, box: 'bg-rose-50 border-rose-200 text-rose-700' },
                { label: 'Medium Priority', count: priorityCounts.Medium, box: 'bg-amber-50 border-amber-200 text-amber-700' },
                { label: 'Low Priority', count: priorityCounts.Low, box: 'bg-[#F0EBFF] border-[#A78BFA]/40 text-[#7050C8]' },
              ].map((p) => (
                <div
                  key={p.label}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between ${p.box}`}
                >
                  <span className="text-xs font-bold">{p.label}</span>
                  <span className="text-lg font-extrabold">{p.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
            Focus on <strong className="text-[#263451]">{priorityCounts.High} high-priority</strong> items for rapid student relief.
          </div>
        </section>
      </div>

      {/* Recent Complaints Table & Latest Student Submissions */}
      <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#263451]">
              Recent Complaints & Latest Student Submissions
            </h2>
            <p className="text-xs text-slate-500">
              Newest grievances submitted by students across campus blocks
            </p>
          </div>
          <Link
            to="/admin/manage"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7050C8] hover:underline"
          >
            Open Manage Queue
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F0EBFF]/50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/70">
                <th className="py-3.5 px-5">ID</th>
                <th className="py-3.5 px-5">Student</th>
                <th className="py-3.5 px-5">Title & Location</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Priority</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentComplaints.map((c) => (
                <tr key={c.id} className="hover:bg-[#F0EBFF]/20 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-xs font-bold text-[#7050C8] whitespace-nowrap">
                    {c.id}
                  </td>
                  <td className="py-3.5 px-5">
                    <p className="font-bold text-[#263451] text-xs">{c.studentName}</p>
                    <p className="text-[11px] text-slate-500">{c.studentRollNo}</p>
                  </td>
                  <td className="py-3.5 px-5">
                    <p className="font-semibold text-[#263451] line-clamp-1">{c.title}</p>
                    <p className="text-xs text-slate-500">{c.location}</p>
                  </td>
                  <td className="py-3.5 px-5 text-xs font-medium text-slate-600">{c.category}</td>
                  <td className="py-3.5 px-5">
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <Link
                      to={`/admin/complaints/${c.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F0EBFF] text-[#7050C8] hover:bg-[#7050C8] hover:text-white transition-all"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
