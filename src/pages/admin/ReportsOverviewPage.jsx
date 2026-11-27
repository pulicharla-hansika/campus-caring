import React from 'react';
import {
  FileStack,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  BarChart3,
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import StatCard from '../../components/StatCard';

export default function ReportsOverviewPage() {
  const { complaints } = useComplaints();

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const pending = complaints.filter((c) => c.status !== 'Resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Most common complaint categories
  const categoryStats = Object.entries(
    complaints.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const maxCat = categoryStats[0]?.[1] || 1;

  // Complaints by campus location
  const locationStats = Object.entries(
    complaints.reduce((acc, c) => {
      acc[c.location] = (acc[c.location] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const maxLoc = locationStats[0]?.[1] || 1;

  // Monthly complaint statistics (Last 6 months aggregated dynamically + baseline context)
  const monthNames = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const monthMap = { Jun: 4, Jul: 6, Aug: 9, Sep: 0, Oct: 0, Nov: 0 };

  complaints.forEach((c) => {
    const d = new Date(c.createdAt);
    const label = d.toLocaleString('en-US', { month: 'short' });
    if (Object.prototype.hasOwnProperty.call(monthMap, label)) {
      monthMap[label] += 1;
    }
  });

  const monthlyData = monthNames.map((m) => ({
    month: m,
    count: monthMap[m],
  }));
  const maxMonth = Math.max(...monthlyData.map((d) => d.count), 1);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263451]">
          Reports & Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Campus-wide complaint analytics, hotspot locations, and monthly resolution trends at Marwadi University.
        </p>
      </div>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Complaints Received"
          value={total}
          subtitle="Cumulative logged issues"
          icon={FileStack}
          accent="lavender"
        />
        <StatCard
          title="Resolved Complaints"
          value={resolved}
          subtitle="Closed with verification"
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          title="Pending & Active"
          value={pending}
          subtitle="Pending, Under Review & In Progress"
          icon={Clock}
          accent="amber"
        />
        <StatCard
          title="Resolution Rate"
          value={`${resolutionRate}%`}
          subtitle="Overall campus SLA efficiency"
          icon={TrendingUp}
          accent="blue"
        />
      </section>

      {/* Monthly Complaint Statistics Chart */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-[#263451]">
              Monthly Complaint Statistics
            </h2>
            <p className="text-xs text-slate-500">
              Volume of campus complaints over the academic semester (2026)
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0EBFF] text-[#7050C8]">
            <BarChart3 className="w-3.5 h-3.5" />
            6-Month Trend
          </span>
        </div>

        <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-6 pt-6 pb-2 border-b border-slate-100">
          {monthlyData.map((item) => {
            const pct = Math.max(12, Math.round((item.count / maxMonth) * 100));
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-xs font-extrabold text-[#263451] group-hover:text-[#7050C8] transition-colors">
                  {item.count}
                </span>
                <div className="w-full max-w-[56px] h-40 bg-[#F0EBFF]/50 rounded-2xl p-1 flex items-end overflow-hidden">
                  <div
                    className="w-full rounded-xl bg-gradient-to-t from-[#7050C8] via-[#A78BFA] to-[#60A5FA] transition-all duration-500 group-hover:brightness-105"
                    style={{ height: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-6 gap-3 sm:gap-6 px-2 sm:px-6 pt-3 text-center">
          {monthlyData.map((item) => (
            <span key={item.month} className="text-xs font-bold text-slate-500">
              {item.month}
            </span>
          ))}
        </div>
      </section>

      {/* Two-Column Breakdown: Categories & Locations */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Most Common Categories */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#263451]">
            Most Common Complaint Categories
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Distribution by problem domain across university facilities
          </p>

          <div className="space-y-4">
            {categoryStats.map(([cat, count]) => (
              <div key={cat}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#263451]">{cat}</span>
                  <span className="font-bold text-[#7050C8]">
                    {count} ({total ? Math.round((count / total) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#F0EBFF] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7050C8] to-[#A78BFA]"
                    style={{ width: `${Math.round((count / maxCat) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Complaints by Campus Location */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#263451]">
                Complaints by Campus Location
              </h2>
              <p className="text-xs text-slate-500">
                Blocks and buildings at Marwadi University, Rajkot
              </p>
            </div>
            <MapPin className="w-5 h-5 text-[#60A5FA]" />
          </div>

          <div className="space-y-4">
            {locationStats.map(([loc, count]) => (
              <div key={loc}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#263451]">{loc}</span>
                  <span className="font-bold text-[#263451] bg-[#BFDBFE]/60 px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#BFDBFE]/35 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#60A5FA] to-[#7050C8]"
                    style={{ width: `${Math.round((count / maxLoc) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
