import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  ListChecks,
  BarChart3,
  UserCircle,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import VoxoraLogo from './VoxoraLogo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/manage', label: 'Manage Complaints', icon: ClipboardCheck },
  { to: '/admin/complaints', label: 'All Complaints', icon: ListChecks },
  { to: '/admin/reports', label: 'Reports & Overview', icon: BarChart3 },
  { to: '/admin/profile', label: 'Profile', icon: UserCircle },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Administrator session closed.', 'info');
    navigate('/');
  };

  const SidebarContent = ({ onLinkClick }) => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-slate-100">
        <Link to="/admin/dashboard" onClick={onLinkClick}>
          <VoxoraLogo size="sm" />
        </Link>
        <div className="mt-4 px-3 py-2 rounded-xl bg-gradient-to-r from-[#F0EBFF] to-[#BFDBFE]/45 border border-[#A78BFA]/25 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#7050C8] shrink-0" />
          <span className="text-xs font-bold text-[#263451]">Admin Control Center</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5" aria-label="Administrator navigation">
        {ADMIN_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#7050C8] to-[#60A5FA] text-white shadow-md shadow-[#7050C8]/20'
                    : 'text-[#263451]/80 hover:bg-[#F0EBFF]/70 hover:text-[#7050C8]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-bold text-[#263451] truncate">
            {user?.fullName || 'Administrator'}
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            {user?.designation || 'Marwadi University Admin'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#F0EBFF]/45 via-white to-[#BFDBFE]/25">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-68 shrink-0 bg-white border-r border-slate-200/80 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#263451]/40 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl z-10">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-[#263451] hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#263451] hover:bg-[#F0EBFF]"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-sm font-bold text-[#263451]">
                VOXORA Administration
              </p>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Marwadi University, Rajkot • Campus Grievance & Facility Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/about"
              className="text-xs font-semibold text-[#7050C8] hover:underline hidden sm:inline"
            >
              About VOXORA
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0EBFF] text-[#7050C8] border border-[#A78BFA]/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Admin Active
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto page-transition">
          {children || <Outlet />}
        </main>

        <footer className="bg-white/80 border-t border-slate-200/70 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              <strong className="text-[#263451]">VOXORA</strong> Admin Portal • Marwadi University, Rajkot
            </span>
            <span className="text-slate-400">Your Voice. Our Campus. Better Together.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
