import { useState, useEffect, useCallback } from 'react';
import { Plus, Calendar, MapPin, Trophy, Users, Loader2 } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import FilterSelect from '../components/ui/FilterSelect';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { tournaments as dummyTournaments, Tournament } from '../data/dummy';
import { tournamentApi } from '../api/tournamentApi';

const statusOptions = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
];

const statusVariant: Record<string, 'blue' | 'pitch' | 'slate'> = {
  upcoming: 'blue',
  ongoing: 'pitch',
  completed: 'slate',
};

const emptyTournament = { name: '', startDate: '', endDate: '', format: '', teamCount: 0, matchCount: 0, venue: '', status: 'upcoming' as const, winner: '' };

export default function Tournaments() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tournaments, setTournaments] = useState<Tournament[]>(dummyTournaments);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyTournament);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tournamentApi.getAll({ search, status: statusFilter });
      setTournaments(res.data.tournaments);
    } catch {
      const filtered = dummyTournaments.filter((t) => {
        const ms = t.name.toLowerCase().includes(search.toLowerCase()) || t.venue.toLowerCase().includes(search.toLowerCase());
        const mst = !statusFilter || t.status === statusFilter;
        return ms && mst;
      });
      setTournaments(filtered);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchTournaments(); }, [fetchTournaments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await tournamentApi.create(form);
      setShowForm(false);
      fetchTournaments();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create tournament.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Tournament Management</h1>
          <p className="text-slate-400 text-sm mt-1">Track international and domestic cricket tournaments</p>
        </div>
        <button onClick={() => { setForm(emptyTournament); setShowForm(true); setError(''); }} className="flex items-center gap-2 px-4 py-2.5 gradient-pitch rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity self-start">
          <Plus className="w-4 h-4" /> Create Tournament
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search tournaments..." />
        </div>
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={statusOptions} placeholder="All Status" />
      </div>

      {/* Create Form */}
      {showForm && (
        <GlassCard className="p-6 animate-scale-in">
          <h3 className="text-lg font-semibold text-white mb-4">Create Tournament</h3>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input required placeholder="Tournament Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input required type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50 [color-scheme:dark]" />
            <input required type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50 [color-scheme:dark]" />
            <input required placeholder="Format (e.g. Test, ODI, T20)" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input type="number" placeholder="Number of Teams" value={form.teamCount} onChange={(e) => setForm({ ...form, teamCount: +e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input type="number" placeholder="Number of Matches" value={form.matchCount} onChange={(e) => setForm({ ...form, matchCount: +e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input required placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <div className="col-span-full flex items-center gap-3 mt-2">
              <button type="submit" disabled={saving} className="px-6 py-2.5 gradient-pitch rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Create Tournament
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 glass rounded-lg text-sm font-medium text-slate-300 hover:glass-hover transition-all">Cancel</button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Tournament Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-pitch-400 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournaments.map((t) => (
            <GlassCard key={t.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-willow-600/20 border border-willow-500/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-willow-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white leading-tight">{t.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{t.format} Format</p>
                  </div>
                </div>
                <Badge variant={statusVariant[t.status]}>
                  {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{t.teams} Teams</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Trophy className="w-4 h-4 text-slate-400" />
                  <span>{t.matches} Matches</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{t.startDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{t.venue}</span>
                </div>
              </div>

              {t.winner && (
                <div className="pt-3 border-t border-white/5">
                  <p className="text-sm text-pitch-400 font-medium flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" /> Winner: {t.winner}
                  </p>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {!loading && tournaments.length === 0 && (
        <GlassCard className="p-12 text-center">
          <p className="text-slate-400 text-sm">No tournaments found.</p>
        </GlassCard>
      )}
    </div>
  );
}
