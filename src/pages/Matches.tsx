import { useState, useEffect, useCallback } from 'react';
import { Plus, Clock, MapPin, Radio, Loader2, Download, Brain, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import SearchBar from '../components/ui/SearchBar';
import FilterSelect from '../components/ui/FilterSelect';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { matches as dummyMatches, Match, players } from '../data/dummy';
import { matchApi } from '../api/matchApi';
import { generateMatchSummary, predictPlayerOfTheMatch, calculateWinPercentage } from '../utils/matchIntelligence';
import { exportMatchScorecard } from '../utils/pdfExport';

const statusOptions = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Live', value: 'live' },
  { label: 'Completed', value: 'completed' },
];

const formatOptions = [
  { label: 'Test', value: 'Test' },
  { label: 'ODI', value: 'ODI' },
  { label: 'T20', value: 'T20' },
];

const formatVariant: Record<string, 'pitch' | 'boundary' | 'blue'> = {
  Test: 'pitch',
  ODI: 'boundary',
  T20: 'blue',
};

const emptyMatch: { teamA: string; teamB: string; date: string; venue: string; format: string; tournament: string; status: string; scoreA: string; scoreB: string; result: string } = { teamA: '', teamB: '', date: '', venue: '', format: 'ODI', tournament: '', status: 'upcoming', scoreA: '', scoreB: '', result: '' };

export default function Matches() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [matches, setMatches] = useState<Match[]>(dummyMatches);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyMatch);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await matchApi.getAll({ search, status: statusFilter, format: formatFilter });
      setMatches(res.data.matches);
    } catch {
      const filtered = dummyMatches.filter((m) => {
        const ms = m.teamA.toLowerCase().includes(search.toLowerCase()) || m.teamB.toLowerCase().includes(search.toLowerCase()) || m.venue.toLowerCase().includes(search.toLowerCase());
        const mst = !statusFilter || m.status === statusFilter;
        const mf = !formatFilter || m.format === formatFilter;
        return ms && mst && mf;
      });
      setMatches(filtered);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, formatFilter]);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await matchApi.create(form);
      toast.success('Match created');
      setShowForm(false);
      fetchMatches();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create match.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  const live = matches.filter((m) => m.status === 'live');
  const upcoming = matches.filter((m) => m.status === 'upcoming');
  const completed = matches.filter((m) => m.status === 'completed');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Match Management</h1>
          <p className="text-slate-400 text-sm mt-1">Track and manage cricket matches across all formats</p>
        </div>
        <button onClick={() => { setForm(emptyMatch); setShowForm(true); setError(''); }} className="flex items-center gap-2 px-4 py-2.5 gradient-pitch rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity self-start">
          <Plus className="w-4 h-4" /> Create Match
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by teams, venue..." />
        </div>
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={statusOptions} placeholder="All Status" />
        <FilterSelect value={formatFilter} onChange={setFormatFilter} options={formatOptions} placeholder="All Formats" />
      </div>

      {/* Create Match Form */}
      {showForm && (
        <GlassCard className="p-6 animate-scale-in">
          <h3 className="text-lg font-semibold text-white mb-4">Create Match</h3>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input required placeholder="Team A" value={form.teamA} onChange={(e) => setForm({ ...form, teamA: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input required placeholder="Team B" value={form.teamB} onChange={(e) => setForm({ ...form, teamB: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50 [color-scheme:dark]" />
            <input required placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value as Match['format'] })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-pitch-500/50 appearance-none">
              {formatOptions.map((f) => <option key={f.value} value={f.value} className="bg-slate-900">{f.label}</option>)}
            </select>
            <input placeholder="Tournament" value={form.tournament} onChange={(e) => setForm({ ...form, tournament: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <div className="col-span-full flex items-center gap-3 mt-2">
              <button type="submit" disabled={saving} className="px-6 py-2.5 gradient-pitch rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Create Match
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 glass rounded-lg text-sm font-medium text-slate-300 hover:glass-hover transition-all">Cancel</button>
            </div>
          </form>
        </GlassCard>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({length: 4}).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <>
          {/* Live Matches */}
          {live.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 animate-pulse" /> Live Now
              </h2>
              {live.map((match) => (
                <GlassCard key={match.id} className="p-5 glow-boundary">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar initials={match.teamA.slice(0, 3).toUpperCase()} size="lg" />
                      <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase font-semibold">VS</p>
                      </div>
                      <Avatar initials={match.teamB.slice(0, 3).toUpperCase()} size="lg" />
                      <div className="ml-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{match.teamA}</span>
                          <span className="text-pitch-400 font-bold">{match.scoreA}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{match.teamB}</span>
                          <span className="text-boundary-400 font-bold">{match.scoreB}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={formatVariant[match.format]}>{match.format}</Badge>
                      <Badge variant="red">LIVE</Badge>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" /> {match.venue}
                    <span className="text-slate-600">|</span>
                    <Clock className="w-3 h-3" /> {match.date}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Upcoming</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcoming.map((match) => (
                  <GlassCard key={match.id} className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar initials={match.teamA.slice(0, 3).toUpperCase()} size="md" />
                        <span className="text-xs text-slate-500 font-bold">VS</span>
                        <Avatar initials={match.teamB.slice(0, 3).toUpperCase()} size="md" />
                      </div>
                      <Badge variant={formatVariant[match.format]}>{match.format}</Badge>
                    </div>
                    <p className="text-sm font-medium text-white">
                      {match.teamA} vs {match.teamB}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                      <MapPin className="w-3 h-3" /> {match.venue}
                      <span className="text-slate-600">|</span>
                      <Clock className="w-3 h-3" /> {match.date}
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">{match.tournament}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Completed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completed.map((match) => (
                  <GlassCard key={match.id} className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar initials={match.teamA.slice(0, 3).toUpperCase()} size="md" />
                        <span className="text-xs text-slate-500 font-bold">VS</span>
                        <Avatar initials={match.teamB.slice(0, 3).toUpperCase()} size="md" />
                      </div>
                      <Badge variant="slate">Completed</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-white">{match.teamA} {match.scoreA}</p>
                      <p className="text-sm font-medium text-white">{match.teamB} {match.scoreB}</p>
                    </div>
                    {match.result && (
                      <p className="text-xs text-pitch-400 font-medium">{match.result}</p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                      <MapPin className="w-3 h-3" /> {match.venue}
                      <span className="text-slate-600">|</span>
                      <Clock className="w-3 h-3" /> {match.date}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Match Intelligence */}
      {!loading && completed.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-pitch-400" />
            <h2 className="text-lg font-semibold text-white">Match Intelligence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.slice(0, 3).map((match) => {
              const summary = generateMatchSummary(match);
              const potm = predictPlayerOfTheMatch(match, players);
              const winA = calculateWinPercentage(match.teamA, completed);
              const winB = calculateWinPercentage(match.teamB, completed);
              return (
                <div key={match.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-white">{match.teamA} vs {match.teamB}</p>
                    <button onClick={() => { exportMatchScorecard(match); toast.success('Scorecard PDF exported'); }} className="p-1.5 rounded-md text-slate-400 hover:text-pitch-400 hover:bg-white/5 transition-colors"><Download className="w-4 h-4" /></button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{summary}</p>
                  {potm && (
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-3.5 h-3.5 text-willow-400" />
                      <span className="text-xs text-willow-400 font-medium">Predicted POTM: {potm.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-pitch-400">{match.teamA}: {winA}% win rate</span>
                    <span className="text-boundary-400">{match.teamB}: {winB}% win rate</span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {!loading && matches.length === 0 && (
        <EmptyState title="No matches found" description="Try adjusting your filters or create a new match." />
      )}
    </div>
  );
}
