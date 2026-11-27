import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  SearchCheck,
  FolderKanban,
  Info,
  UserCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import VoxoraLogo from './VoxoraLogo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const STUDENT_LINKS = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/submit', label: 'Submit Complaint', icon: PlusCircle },
  { to: '/student/track', label: 'Track Complaint', icon: SearchCheck },
  { to: '/student/complaints', label: 'My Complaints', icon: FolderKanban },
  { to: '/about', label: 'About', icon: Info },
  { to: '/student/profile', label: 'Profile', icon: UserCircle },
];

export default function StudentLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('You have been logged out of VOXORA.', 'info');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F0EBFF]/55 via-white to-[#BFDBFE]/25">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/student/dashboard" className="shrink-0">
            <VoxoraLogo size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Student navigation">
            {STUDENT_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#F0EBFF] text-[#7050C8] shadow-xs'
                        : 'text-[#263451]/80 hover:text-[#7050C8] hover:bg-[#F0EBFF]/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right User + Logout */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-[#263451] leading-tight">
                {user?.fullName || 'Student'}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {user?.studentId || 'Marwadi University'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl text-[#263451] hover:bg-[#F0EBFF] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1.5 shadow-lg">
            <div className="px-3 py-2 mb-2 rounded-xl bg-[#F0EBFF]/60 border border-[#A78BFA]/20">
              <p className="text-sm font-bold text-[#263451]">{user?.fullName}</p>
              <p className="text-xs text-slate-500">
                {user?.department} • {user?.studentId}
              </p>
            </div>
            {STUDENT_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#F0EBFF] text-[#7050C8]'
                        : 'text-[#263451] hover:bg-[#F0EBFF]/40'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 page-transition">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-slate-200/70 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#263451]">VOXORA</span>
            <span>•</span>
            <span>Campus Complaint Management Portal — Marwadi University, Rajkot</span>
          </div>
          <p className="text-slate-400">Your Voice. Our Campus. Better Together.</p>
        </div>
      </footer>
    </div>
  );
}
