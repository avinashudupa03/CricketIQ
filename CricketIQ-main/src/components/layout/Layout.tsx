import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, Users, Shield, Swords, Trophy } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { globalSearch, GlobalSearchResult } from '../../utils/search';
import { players, teams, matches, tournaments } from '../../data/dummy';

const resultIcons: Record<string, typeof Users> = {
  player: Users,
  team: Shield,
  match: Swords,
  tournament: Trophy,
};

const resultRoutes: Record<string, string> = {
  player: '/players',
  team: '/teams',
  match: '/matches',
  tournament: '/tournaments',
};

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GlobalSearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const name = user?.name || 'Arjun Kumar';
  const nameParts = name.split(' ');
  const initials = nameParts.length >= 2 ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(globalSearch(searchQuery, players, teams, matches, tournaments));
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen gradient-dark flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 glass-strong flex items-center justify-between px-4 lg:px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search players, teams, matches..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50 focus:ring-1 focus:ring-pitch-500/25 transition-all duration-200 w-64 lg:w-80"
              />
              {showSearch && searchResults.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-80 glass-strong rounded-xl p-2 z-50 max-h-80 overflow-y-auto animate-scale-in">
                  {searchResults.map((r) => {
                    const Icon = resultIcons[r.type] || Users;
                    return (
                      <button
                        key={`${r.type}-${r.id}`}
                        onClick={() => { navigate(resultRoutes[r.type]); setSearchQuery(''); setShowSearch(false); }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                      >
                        <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{r.title}</p>
                          <p className="text-xs text-slate-400 truncate">{r.subtitle}</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400 capitalize shrink-0">{r.type}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {showSearch && searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full left-0 mt-2 w-80 glass-strong rounded-xl p-4 z-50 animate-scale-in">
                  <p className="text-sm text-slate-400 text-center">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pitch-500 rounded-full" />
            </button>
            <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full bg-pitch-600/30 border border-pitch-500/20 flex items-center justify-center text-sm font-semibold text-pitch-400 cursor-pointer hover:bg-pitch-600/40 transition-colors">
              {initials}
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
