import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  CheckCircle2,
  Edit3,
  Eye,
  X,
  Save,
} from 'lucide-react';
import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_STATUSES,
  PRIORITY_LEVELS,
} from '../../constants/campusData';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';
import Button from '../../components/Button';
import { FormField, inputBaseClass } from '../../components/FormInput';

export default function ManageComplaintsPage() {
  const { user } = useAuth();
  const { complaints, updateComplaint } = useComplaints();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Update Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [nextStatus, setNextStatus] = useState('Pending');
  const [remark, setRemark] = useState('');

  useEffect(() => {
    const st = searchParams.get('status');
    if (st && COMPLAINT_STATUSES.includes(st)) {
      setStatusFilter(st);
    }
  }, [searchParams]);

  const filtered = complaints.filter((c) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.studentName.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const openModal = (item) => {
    setEditingItem(item);
    setNextStatus(item.status);
    setRemark('');
  };

  const handleSaveUpdate = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    updateComplaint(editingItem.id, {
      status: nextStatus,
      remark,
      adminName: user?.fullName || 'Campus Administrator',
    });

    showToast(`Complaint ${editingItem.id} updated to "${nextStatus}".`, 'success');
    setEditingItem(null);
    setRemark('');
  };

  const handleQuickResolve = (item) => {
    updateComplaint(item.id, {
      status: 'Resolved',
      remark: 'Issue verified and marked as resolved by campus administration.',
      adminName: user?.fullName || 'Campus Administrator',
    });
    showToast(`${item.id} marked as Resolved.`, 'success');
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('All');
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263451]">
            Manage Complaints
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review student complaints, update resolution stages, add remarks, and close resolved issues.
          </p>
        </div>
        <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#F0EBFF] text-[#7050C8]">
          Showing {filtered.length} of {complaints.length}
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7050C8] focus:ring-2 focus:ring-[#A78BFA]/30"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            className={inputBaseClass(false)}
          >
            <option value="All">All Categories</option>
            {COMPLAINT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className={inputBaseClass(false)}
          >
            <option value="All">All Statuses</option>
            {COMPLAINT_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter by priority"
            className={inputBaseClass(false)}
          >
            <option value="All">All Priorities</option>
            {PRIORITY_LEVELS.map((pr) => (
              <option key={pr} value={pr}>
                {pr} Priority
              </option>
            ))}
          </select>
        </div>

        {(search || categoryFilter !== 'All' || statusFilter !== 'All' || priorityFilter !== 'All') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <Filter className="w-3.5 h-3.5 text-[#7050C8]" />
              Active filters applied
            </span>
            <button
              type="button"
              onClick={clearFilters}
              className="font-bold text-[#7050C8] hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Complaints Management Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-base font-bold text-[#263451]">No complaints match your filters</p>
          <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F0EBFF]/50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                  <th className="py-3.5 px-5">Complaint ID</th>
                  <th className="py-3.5 px-5">Title & Student</th>
                  <th className="py-3.5 px-5">Category & Location</th>
                  <th className="py-3.5 px-5">Priority</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F0EBFF]/20 transition-colors">
                    <td className="py-4 px-5 font-mono text-xs font-bold text-[#7050C8] whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-4 px-5 max-w-xs">
                      <p className="font-bold text-[#263451] line-clamp-1">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.studentName} ({item.studentRollNo})
                      </p>
                    </td>
                    <td className="py-4 px-5">
                      <p className="text-xs font-semibold text-[#263451]">{item.category}</p>
                      <p className="text-xs text-slate-500">{item.location}</p>
                    </td>
                    <td className="py-4 px-5">
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/complaints/${item.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-[#263451] hover:bg-[#BFDBFE]/60 transition-colors"
                          title="Open details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => openModal(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F0EBFF] text-[#7050C8] hover:bg-[#7050C8] hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Update
                        </button>
                        {item.status !== 'Resolved' && (
                          <button
                            type="button"
                            onClick={() => handleQuickResolve(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Status & Remark Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263451]/45 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-fade-up">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F0EBFF] text-[#7050C8]">
                  {editingItem.id}
                </span>
                <h2 className="mt-2 text-lg font-extrabold text-[#263451]">
                  Update Complaint Status
                </h2>
                <p className="text-xs text-slate-500 line-clamp-1">{editingItem.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#263451] hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="mt-5 space-y-4">
              <FormField label="Complaint Status" htmlFor="modal-status">
                <select
                  id="modal-status"
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value)}
                  className={inputBaseClass(false)}
                >
                  {COMPLAINT_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Administrator Remark"
                htmlFor="modal-remark"
                hint="Visible to the student on their Track Complaint timeline."
              >
                <textarea
                  id="modal-remark"
                  rows={3}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter progress update, assigned technician, or resolution summary..."
                  className={inputBaseClass(false)}
                />
              </FormField>

              <div className="pt-2 flex justify-end gap-2.5">
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" icon={Save}>
                  Update & Sync
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
