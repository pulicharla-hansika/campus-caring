import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpDown, ArrowRight, MapPin, Calendar, User } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';

export default function AllComplaintsPage() {
  const { complaints } = useComplaints();
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const filtered = complaints
    .filter((c) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.studentName.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      const rank = { High: 3, Medium: 2, Low: 1 };
      return (rank[b.priority] || 0) - (rank[a.priority] || 0);
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263451]">
            All Complaints Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Complete searchable archive of every student complaint logged in VOXORA.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search any field..."
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#7050C8] focus:ring-2 focus:ring-[#A78BFA]/30"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#263451]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#7050C8]" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort complaints"
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Highest Priority</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-[#A78BFA]/60 transition-all flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F0EBFF] text-[#7050C8]">
                  {c.id}
                </span>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                </div>
              </div>

              <h2 className="mt-3 text-base font-bold text-[#263451]">{c.title}</h2>
              <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{c.description}</p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#7050C8]" />
                  {c.studentName}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#60A5FA]" />
                  {new Date(c.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span className="col-span-2 inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#7050C8]" />
                  {c.location} • {c.category}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Dept: {c.studentDepartment}</span>
              <Link
                to={`/admin/complaints/${c.id}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#7050C8] hover:text-[#263451]"
              >
                Open Complaint
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
