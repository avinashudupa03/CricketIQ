import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  Swords,
  Trophy,
  TrendingUp,
  Activity,
  ArrowRight,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StatCard from '../components/ui/StatCard';
import GlassCard from '../components/ui/GlassCard';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { matches as dummyMatches, players as dummyPlayers, formatDistribution, runRateData, topPerformers } from '../data/dummy';
import { useAuth } from '../contexts/AuthContext';
import { playerApi } from '../api/playerApi';
import { teamApi } from '../api/teamApi';
import { matchApi } from '../api/matchApi';
import { tournamentApi } from '../api/tournamentApi';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ players: dummyPlayers.length, teams: 10, matches: 24, tournaments: 3 });
  const [liveMatches, setLiveMatches] = useState(dummyMatches.filter((m) => m.status === 'live'));
  const [upcomingMatches, setUpcomingMatches] = useState(dummyMatches.filter((m) => m.status === 'upcoming').slice(0, 3));
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, tRes, mRes, tnRes] = await Promise.allSettled([
        playerApi.getAll(),
        teamApi.getAll(),
        matchApi.getAll(),
        tournamentApi.getAll({ status: 'ongoing' }),
      ]);

      const pData = pRes.status === 'fulfilled' ? pRes.value.data : null;
      const tData = tRes.status === 'fulfilled' ? tRes.value.data : null;
      const mData = mRes.status === 'fulfilled' ? mRes.value.data : null;
      const tnData = tnRes.status === 'fulfilled' ? tnRes.value.data : null;

      setStats({
        players: pData?.total || dummyPlayers.length,
        teams: tData?.total || 10,
        matches: mData?.total || 24,
        tournaments: tnData?.total || 3,
      });

      if (mData?.matches) {
        const allMatches = mData.matches;
        setLiveMatches(allMatches.filter((m: { status: string }) => m.status === 'live'));
        setUpcomingMatches(allMatches.filter((m: { status: string }) => m.status === 'upcoming').slice(0, 3));
      }
    } catch {
      // Fallback data already set by defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, {user?.name || 'Arjun'}. Here's your cricket overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="pitch" size="md">
            <Activity className="w-3.5 h-3.5 mr-1.5" />
            {liveMatches.length} Live
          </Badge>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Players" value={loading ? '...' : stats.players} change={12} icon={<Users className="w-5 h-5" />} iconColor="text-pitch-400" />
        <StatCard title="Active Teams" value={loading ? '...' : stats.teams} change={5} icon={<Shield className="w-5 h-5" />} iconColor="text-boundary-400" />
        <StatCard title="Matches This Month" value={loading ? '...' : stats.matches} change={-3} icon={<Swords className="w-5 h-5" />} iconColor="text-blue-400" />
        <StatCard title="Live Tournaments" value={loading ? '...' : stats.tournaments} change={8} icon={<Trophy className="w-5 h-5" />} iconColor="text-willow-400" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Run Rate Chart */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Run Rate by Phase</h3>
              <p className="text-sm text-slate-400">Overs vs run rate comparison</p>
            </div>
            <Badge variant="pitch">Live Data</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={runRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="over" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(15,18,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="india" fill="#22c55e" radius={[4, 4, 0, 0]} name="India" />
                <Bar dataKey="australia" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Australia" />
                <Bar dataKey="england" fill="#3b82f6" radius={[4, 4, 0, 0]} name="England" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Format Distribution */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-1">Match Formats</h3>
          <p className="text-sm text-slate-400 mb-4">Distribution this season</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {formatDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'rgba(15,18,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {formatDistribution.map((f) => (
              <div key={f.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                <span className="text-xs text-slate-400">{f.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Performers */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Top Performers</h3>
            <Link to="/analytics" className="text-pitch-400 text-sm hover:text-pitch-300 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Batting */}
            <div>
              <h4 className="text-sm font-medium text-pitch-400 mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Batting
              </h4>
              <div className="space-y-3">
                {topPerformers.batting.slice(0, 3).map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-4">{i + 1}</span>
                    <Avatar initials={p.name.split('.').pop()!.slice(0, 2)} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.runs} runs</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bowling */}
            <div>
              <h4 className="text-sm font-medium text-boundary-400 mb-3 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Bowling
              </h4>
              <div className="space-y-3">
                {topPerformers.bowling.slice(0, 3).map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-4">{i + 1}</span>
                    <Avatar initials={p.name.split('.').pop()!.slice(0, 2)} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.wickets} wickets</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Upcoming Matches */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Upcoming Matches</h3>
            <Link to="/matches" className="text-pitch-400 text-sm hover:text-pitch-300 flex items-center gap-1 transition-colors">
              All Matches <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingMatches.map((match) => (
              <div key={match.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">{match.teamA}</span>
                    <span className="text-xs text-slate-500">vs</span>
                    <span className="text-sm font-medium text-white">{match.teamB}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{match.date}</span>
                    <span className="text-slate-600">|</span>
                    <span>{match.venue}</span>
                  </div>
                </div>
                <Badge variant={match.format === 'Test' ? 'pitch' : match.format === 'ODI' ? 'boundary' : 'blue'}>
                  {match.format}
                </Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
