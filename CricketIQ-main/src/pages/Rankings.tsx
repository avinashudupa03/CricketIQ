import { useState } from 'react';
import { Trophy, TrendingUp, Target, Zap, BarChart3 } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import FilterSelect from '../components/ui/FilterSelect';
import EmptyState from '../components/ui/EmptyState';
import { players } from '../data/dummy';

type RankCategory = 'runs' | 'wickets' | 'strikeRate' | 'average' | 'overall';

const categoryOptions = [
  { label: 'Overall', value: 'overall' },
  { label: 'Most Runs', value: 'runs' },
  { label: 'Most Wickets', value: 'wickets' },
  { label: 'Best Average', value: 'average' },
  { label: 'Best Strike Rate', value: 'strikeRate' },
];

const roleOptions = [
  { label: 'Batsman', value: 'Batsman' },
  { label: 'Bowler', value: 'Bowler' },
  { label: 'All-rounder', value: 'All-rounder' },
  { label: 'Wicketkeeper', value: 'Wicketkeeper' },
];

const categoryConfig: Record<RankCategory, { icon: typeof Trophy; label: string; color: string }> = {
  runs: { icon: TrendingUp, label: 'Most Runs', color: 'text-pitch-400' },
  wickets: { icon: Target, label: 'Most Wickets', color: 'text-boundary-400' },
  strikeRate: { icon: Zap, label: 'Best Strike Rate', color: 'text-blue-400' },
  average: { icon: BarChart3, label: 'Best Average', color: 'text-willow-400' },
  overall: { icon: Trophy, label: 'Overall Ranking', color: 'text-pitch-400' },
};

function getOverallScore(p: typeof players[0]): number {
  let score = 0;
  score += p.runs * 0.01;
  score += p.wickets * 5;
  score += p.average * 2;
  score += p.strikeRate * 0.5;
  if (p.economy > 0) score += (10 - p.economy) * 10;
  if (p.role === 'All-rounder') score *= 1.1;
  return Math.round(score);
}

const rankBadgeColors = ['text-willow-400', 'text-slate-300', 'text-amber-600'];

export default function Rankings() {
  const [category, setCategory] = useState<RankCategory>('overall');
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = players.filter(p => {
    const matchesRole = !roleFilter || p.role === roleFilter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const ranked = [...filtered].sort((a, b) => {
    switch (category) {
      case 'runs': return b.runs - a.runs;
      case 'wickets': return b.wickets - a.wickets;
      case 'average': return b.average - a.average;
      case 'strikeRate': return b.strikeRate - a.strikeRate;
      case 'overall': return getOverallScore(b) - getOverallScore(a);
    }
  });

  const config = categoryConfig[category];
  const getValue = (p: typeof players[0]) => {
    switch (category) {
      case 'runs': return p.runs.toLocaleString();
      case 'wickets': return p.wickets.toString();
      case 'average': return p.average.toFixed(1);
      case 'strikeRate': return p.strikeRate.toFixed(1);
      case 'overall': return getOverallScore(p).toString();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Player Rankings</h1>
        <p className="text-slate-400 text-sm mt-1">Rank players across multiple performance metrics</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search players..." />
        </div>
        <FilterSelect value={category} onChange={(v) => setCategory(v as RankCategory)} options={categoryOptions} placeholder="Ranking Category" />
        <FilterSelect value={roleFilter} onChange={setRoleFilter} options={roleOptions} placeholder="All Roles" />
      </div>

      {/* Top 3 Podium */}
      {ranked.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {[1, 0, 2].map((idx) => {
            const p = ranked[idx];
            const rank = idx + 1;
            const isFirst = rank === 1;
            return (
              <GlassCard key={p.id} className={`p-5 text-center ${isFirst ? 'glow-pitch ring-1 ring-pitch-500/20' : ''}`}>
                <div className={`text-2xl font-bold mb-2 ${rankBadgeColors[idx] || 'text-slate-400'}`}>#{rank}</div>
                <Avatar initials={p.avatar || p.name.split(' ').map(n => n[0]).join('').slice(0, 2)} size={isFirst ? 'xl' : 'lg'} />
                <p className="text-sm font-semibold text-white mt-3 truncate">{p.name}</p>
                <p className="text-xs text-slate-400">{p.team}</p>
                <div className="mt-2">
                  <Badge variant={isFirst ? 'willow' : 'pitch'} size="md">{getValue(p)}</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">{config.label}</p>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Full Rankings Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Player</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Team</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{config.label}</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Matches</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((player, i) => (
                <tr key={player.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${i < 3 ? rankBadgeColors[i] : 'text-slate-500'}`}>#{i + 1}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={player.avatar || player.name.split(' ').map(n => n[0]).join('').slice(0, 2)} size="sm" />
                      <span className="text-sm font-medium text-white">{player.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Badge variant={player.role === 'Batsman' ? 'pitch' : player.role === 'Bowler' ? 'boundary' : player.role === 'All-rounder' ? 'blue' : 'willow'}>{player.role}</Badge></td>
                  <td className="px-6 py-4 text-sm text-slate-300">{player.team}</td>
                  <td className="px-6 py-4 text-sm font-bold text-white">{getValue(player)}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{player.matches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {ranked.length === 0 && <EmptyState title="No players found" description="Try adjusting your filters." />}
      </GlassCard>
    </div>
  );
}
