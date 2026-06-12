import { useState } from 'react';
import { Star, ChevronRight } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import EmptyState from '../components/ui/EmptyState';
import { players } from '../data/dummy';
import { getLevelForXP, getXPProgress, calculateMatchXP, ALL_BADGES, LEVEL_COLORS, LEVEL_GLOW, CareerLevel } from '../utils/careerMode';

// Generate career profiles from players
function generateCareerXP(p: typeof players[0]): number {
  let xp = p.matches * 10;
  xp += p.runs * 0.05;
  xp += p.wickets * 25;
  xp += p.average * 5;
  if (p.role === 'All-rounder') xp *= 1.2;
  return Math.round(xp);
}

const careerProfiles = players.map(p => {
  const xp = generateCareerXP(p);
  return {
    ...p,
    xp,
    level: getLevelForXP(xp),
    progress: getXPProgress(xp),
    matchXP: calculateMatchXP(p),
    earnedBadges: ALL_BADGES.filter(b => {
      if (b.id === 'centurion' && p.runs > 5000) return true;
      if (b.id === 'veteran' && p.matches > 100) return true;
      if (b.id === 'economy-master' && p.economy > 0 && p.economy < 3.5) return true;
      if (b.id === 'five-wicket' && p.wickets > 200) return true;
      if (b.id === 'legend-status' && getLevelForXP(xp) === 'Legend') return true;
      return false;
    }),
  };
}).sort((a, b) => b.xp - a.xp);

const levelOrder: CareerLevel[] = ['Local Player', 'District Player', 'State Player', 'National Player', 'Legend'];

export default function Career() {
  const [search, setSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<typeof careerProfiles[0] | null>(careerProfiles[0]);

  const filtered = careerProfiles.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Career Mode</h1>
        <p className="text-slate-400 text-sm mt-1">Track player career progression, XP, levels, and achievements</p>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search players..." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Player List */}
        <GlassCard className="p-4 max-h-[700px] overflow-y-auto">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Players</h3>
          <div className="space-y-2">
            {filtered.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPlayer(p)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${selectedPlayer?.id === p.id ? 'bg-pitch-600/15 border border-pitch-500/20' : 'hover:bg-white/5'}`}
              >
                <Avatar initials={p.avatar || p.name.slice(0, 2)} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.xp} XP | {p.level}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            ))}
            {filtered.length === 0 && <EmptyState title="No players found" />}
          </div>
        </GlassCard>

        {/* Career Detail */}
        {selectedPlayer && (
          <div className="lg:col-span-2 space-y-4">
            {/* Player Header */}
            <GlassCard className={`p-6 ${LEVEL_GLOW[selectedPlayer.level]}`}>
              <div className="flex items-center gap-4 mb-4">
                <Avatar initials={selectedPlayer.avatar || selectedPlayer.name.slice(0, 2)} size="xl" />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">{selectedPlayer.name}</h2>
                  <p className="text-sm text-slate-400">{selectedPlayer.team} | {selectedPlayer.role}</p>
                </div>
                <Badge variant={selectedPlayer.level === 'Legend' ? 'willow' : selectedPlayer.level === 'National Player' ? 'pitch' : selectedPlayer.level === 'State Player' ? 'boundary' : 'blue'} size="md">
                  {selectedPlayer.level}
                </Badge>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">XP Progress</span>
                  <span className="text-white font-medium">{selectedPlayer.xp} XP</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-pitch rounded-full transition-all duration-700"
                    style={{ width: `${selectedPlayer.progress.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{selectedPlayer.level}</span>
                  <span>{selectedPlayer.progress.current}/{selectedPlayer.progress.needed} to next level</span>
                  <span>{levelOrder[levelOrder.indexOf(selectedPlayer.level) + 1] || 'Max'}</span>
                </div>
              </div>
            </GlassCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Matches Played', value: selectedPlayer.matches, icon: 'M' },
                { label: 'XP Per Match', value: selectedPlayer.matchXP, icon: 'XP' },
                { label: 'Total XP', value: selectedPlayer.xp, icon: 'T' },
                { label: 'Badges Earned', value: `${selectedPlayer.earnedBadges.length}/${ALL_BADGES.length}`, icon: 'B' },
              ].map(stat => (
                <GlassCard key={stat.label} className="p-4 text-center">
                  <p className="text-2xl font-bold text-gradient-pitch">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                </GlassCard>
              ))}
            </div>

            {/* Level Roadmap */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Level Roadmap</h3>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {levelOrder.map((level, i) => {
                  const currentIdx = levelOrder.indexOf(selectedPlayer.level);
                  const isCompleted = i <= currentIdx;
                  const isCurrent = level === selectedPlayer.level;
                  return (
                    <div key={level} className="flex items-center gap-2 shrink-0">
                      <div className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${isCurrent ? LEVEL_COLORS[level] + ' ' + LEVEL_GLOW[level] : isCompleted ? LEVEL_COLORS[level] : 'bg-white/5 border-white/10 text-slate-500'}`}>
                        <Star className={`w-3 h-3 inline mr-1 ${isCompleted ? 'text-willow-400' : 'text-slate-600'}`} />
                        {level}
                      </div>
                      {i < levelOrder.length - 1 && <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Badges & Achievements */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Badges & Achievements</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {ALL_BADGES.map(badge => {
                  const earned = selectedPlayer.earnedBadges.some(eb => eb.id === badge.id);
                  return (
                    <div key={badge.id} className={`p-3 rounded-lg border text-center transition-all ${earned ? 'bg-pitch-600/10 border-pitch-500/20' : 'bg-white/[0.02] border-white/5 opacity-40'}`}>
                      <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center text-xs font-bold mb-2 ${earned ? 'bg-pitch-500/20 text-pitch-400' : 'bg-white/5 text-slate-500'}`}>
                        {badge.icon}
                      </div>
                      <p className={`text-xs font-medium ${earned ? 'text-white' : 'text-slate-500'}`}>{badge.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{badge.description}</p>
                      {earned && <div className="mt-1"><Badge variant="pitch" size="sm">Earned</Badge></div>}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
