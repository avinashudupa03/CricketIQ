import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  Swords,
  Trophy,
  BarChart3,
  User,
  ChevronLeft,
  Menu,
  Award,
  Star,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/players', icon: Users, label: 'Players' },
  { to: '/teams', icon: Shield, label: 'Teams' },
  { to: '/matches', icon: Swords, label: 'Matches' },
  { to: '/tournaments', icon: Trophy, label: 'Tournaments' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/rankings', icon: Award, label: 'Rankings' },
  { to: '/career', icon: Star, label: 'Career' },
  { to: '/profile', icon: User, label: 'Profile' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const name = user?.name || 'Arjun Kumar';
  const email = user?.email || 'arjun@cricketiq.com';
  const nameParts = name.split(' ');
  const initials = nameParts.length >= 2 ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 glass-strong transition-all duration-300 flex flex-col ${
          collapsed ? 'w-[72px]' : 'w-64'
        } lg:relative lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
          <div className="w-9 h-9 rounded-lg gradient-pitch flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">CI</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-white whitespace-nowrap">CricketIQ</h1>
            </div>
          )}
        </div>

        {/* Toggle */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all mx-auto mt-4 mb-2"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'} ${
                  collapsed ? 'justify-center px-0 py-2' : 'py-2'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-pitch-600/30 border border-pitch-500/20 flex items-center justify-center text-sm font-semibold text-pitch-400 shrink-0">
              {initials}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{name}</p>
                <p className="text-xs text-slate-400 truncate">{email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
