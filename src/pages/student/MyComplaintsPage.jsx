import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, PlusCircle, ArrowRight, MapPin, Calendar, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';
import Button from '../../components/Button';

const FILTER_TABS = ['All', 'Pending', 'Under Review', 'In Progress', 'Resolved'];

export default function MyComplaintsPage() {
  const { user } = useAuth();
  const { getStudentComplaints } = useComplaints();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilter = searchParams.get('status') || 'All';
  const [statusFilter, setStatusFilter] = useState(
    FILTER_TABS.includes(initialFilter) ? initialFilter : 'All'
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const param = searchParams.get('status');
    if (param && FILTER_TABS.includes(param)) {
      setStatusFilter(param);
    }
  }, [searchParams]);

  const myComplaints = getStudentComplaints(user?.id);

  const filtered = myComplaints.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleFilterChange = (tab) => {
    setStatusFilter(tab);
    if (tab === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ status: tab });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263451]">
            My Complaints
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View, filter, and inspect every complaint you have submitted to VOXORA.
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => navigate('/student/submit')}
        >
          New Complaint
        </Button>
      </div>

      {/* Filters + Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTER_TABS.map((tab) => {
            const count =
              tab === 'All'
                ? myComplaints.length
                : myComplaints.filter((c) => c.status === tab).length;
            const active = statusFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => handleFilterChange(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  active
                    ? 'bg-gradient-to-r from-[#7050C8] to-[#60A5FA] text-white shadow-sm'
                    : 'bg-[#F0EBFF]/60 text-[#263451] hover:bg-[#F0EBFF]'
                }`}
              >
                {tab}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    active ? 'bg-white/25 text-white' : 'bg-white text-[#7050C8]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, title, location..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7050C8] focus:ring-2 focus:ring-[#A78BFA]/30"
          />
        </div>
      </div>

      {/* Complaints List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-base font-bold text-[#263451]">
            No complaints match this filter
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try switching the status tab or submit a new campus issue.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F0EBFF]/50 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Complaint ID</th>
                  <th className="py-3.5 px-5">Complaint Title</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Submission Date</th>
                  <th className="py-3.5 px-5">Location</th>
                  <th className="py-3.5 px-5">Current Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F0EBFF]/20 transition-colors">
                    <td className="py-4 px-5 font-mono text-xs font-bold text-[#7050C8]">
                      {c.id}
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-bold text-[#263451] line-clamp-1">{c.title}</p>
                      <div className="mt-1">
                        <PriorityBadge priority={c.priority} />
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-600 font-medium">{c.category}</td>
                    <td className="py-4 px-5 text-slate-500 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-5 text-slate-600">{c.location}</td>
                    <td className="py-4 px-5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        to={`/student/complaints/${c.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F0EBFF] text-[#7050C8] hover:bg-[#7050C8] hover:text-white transition-all"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {filtered.map((c) => (
              <div key={c.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F0EBFF] text-[#7050C8]">
                    {c.id}
                  </span>
                  <StatusBadge status={c.status} />
                </div>
                <h3 className="text-sm font-bold text-[#263451]">{c.title}</h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#7050C8]" />
                    {c.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#60A5FA]" />
                    {new Date(c.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="col-span-2 inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#7050C8]" />
                    {c.location}
                  </span>
                </div>
                <Link
                  to={`/student/complaints/${c.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#F0EBFF] text-[#7050C8]"
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
