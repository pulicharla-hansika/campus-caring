import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag, ArrowRight } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './StatusBadge';

export default function ComplaintCard({ complaint, detailBasePath = '/student/complaints' }) {
  const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-[#A78BFA]/60 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F0EBFF] text-[#7050C8]">
            {complaint.id}
          </span>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        <h3 className="mt-3.5 text-base font-bold text-[#263451] group-hover:text-[#7050C8] transition-colors line-clamp-2">
          {complaint.title}
        </h3>

        <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {complaint.description}
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#7050C8] shrink-0" />
            <span className="truncate font-medium">{complaint.category}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#60A5FA] shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:col-span-2">
            <MapPin className="w-3.5 h-3.5 text-[#7050C8] shrink-0" />
            <span className="truncate">
              {complaint.location}
              {complaint.buildingBlock ? ` • ${complaint.buildingBlock}` : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {complaint.updates?.length || 1} update{(complaint.updates?.length || 1) > 1 ? 's' : ''}
        </span>
        <Link
          to={`${detailBasePath}/${complaint.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7050C8] hover:text-[#263451] transition-colors"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
