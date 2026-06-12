import { useState, useEffect, useCallback } from 'react';
import { Plus, ArrowUpRight, ArrowDownRight, Loader2, Trash2, Pencil, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import SearchBar from '../components/ui/SearchBar';
import GlassCard from '../components/ui/GlassCard';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { teams as dummyTeams, Team } from '../data/dummy';
import { teamApi } from '../api/teamApi';
import { exportTeamReport } from '../utils/pdfExport';

const emptyTeam = { name: '', shortName: '', country: '', wins: 0, losses: 0, draws: 0, points: 0, netRunRate: 0 };

export default function Teams() {
  const [search, setSearch] = useState('');
  const [teams, setTeams] = useState<Team[]>(dummyTeams);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyTeam);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await teamApi.getAll({ search });
      setTeams(res.data.teams);
    } catch {
      const filtered = dummyTeams.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) || t.shortName.toLowerCase().includes(search.toLowerCase())
      );
      setTeams(filtered);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  function openAdd() { setForm(emptyTeam); setEditingId(null); setShowForm(true); setError(''); }
  function openEdit(t: Team) {
    setForm({ name: t.name, shortName: t.shortName, country: t.country, wins: t.wins, losses: t.losses, draws: t.draws, points: t.points, netRunRate: t.netRunRate });
    setEditingId(t.id);
    setShowForm(true);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await teamApi.update(editingId, form);
        toast.success('Team updated');
      } else {
        await teamApi.create(form);
        toast.success('Team created');
      }
      setShowForm(false);
      fetchTeams();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save team.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await teamApi.delete(deleteTarget);
      toast.success('Team deleted');
      fetchTeams();
    } catch {
      setTeams((prev) => prev.filter((t) => t.id !== deleteTarget));
      toast.success('Team removed');
    }
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Team Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage international cricket teams and their standings</p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <button onClick={() => { exportTeamReport(teams); toast.success('PDF exported'); }} className="flex items-center gap-2 px-4 py-2.5 glass rounded-lg text-sm font-medium text-slate-300 hover:glass-hover transition-all">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 gradient-pitch rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Team
          </button>
        </div>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search teams..." />

      {/* Add/Edit Form */}
      {showForm && (
        <GlassCard className="p-6 animate-scale-in">
          <h3 className="text-lg font-semibold text-white mb-4">{editingId ? 'Edit Team' : 'Add Team'}</h3>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input required placeholder="Team Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input required placeholder="Short Name (e.g. IND)" value={form.shortName} onChange={(e) => setForm({ ...form, shortName: e.target.value.toUpperCase() })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input required placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input type="number" placeholder="Wins" value={form.wins} onChange={(e) => setForm({ ...form, wins: +e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input type="number" placeholder="Losses" value={form.losses} onChange={(e) => setForm({ ...form, losses: +e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input type="number" placeholder="Draws" value={form.draws} onChange={(e) => setForm({ ...form, draws: +e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input type="number" placeholder="Points" value={form.points} onChange={(e) => setForm({ ...form, points: +e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input type="number" step="0.01" placeholder="Net Run Rate" value={form.netRunRate} onChange={(e) => setForm({ ...form, netRunRate: +e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <div className="col-span-full flex items-center gap-3 mt-2">
              <button type="submit" disabled={saving} className="px-6 py-2.5 gradient-pitch rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editingId ? 'Update' : 'Create'} Team
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 glass rounded-lg text-sm font-medium text-slate-300 hover:glass-hover transition-all">Cancel</button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Team Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length: 6}).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => {
            const total = team.wins + team.losses + team.draws;
            const winPct = total > 0 ? ((team.wins / total) * 100).toFixed(1) : '0.0';
            const nrrPositive = team.netRunRate >= 0;

            return (
              <GlassCard key={team.id} className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <Avatar initials={team.shortName} size="lg" color="bg-pitch-600/30 text-pitch-400 border-pitch-500/20" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                      <p className="text-xs text-slate-400">{team.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={nrrPositive ? 'pitch' : 'red'}>
                      <span className="flex items-center gap-0.5">
                        {nrrPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(team.netRunRate).toFixed(2)}
                      </span>
                    </Badge>
                    <button onClick={() => openEdit(team)} className="p-1.5 rounded-md text-slate-400 hover:text-pitch-400 hover:bg-white/5 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteTarget(team.id)} className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div className="text-center">
                    <p className="text-lg font-bold text-pitch-400">{team.wins}</p>
                    <p className="text-xs text-slate-400">Wins</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-400">{team.losses}</p>
                    <p className="text-xs text-slate-400">Losses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-300">{team.draws}</p>
                    <p className="text-xs text-slate-400">Draws</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Win Rate</span>
                    <span className="text-white font-medium">{winPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full gradient-pitch rounded-full transition-all duration-500" style={{ width: `${winPct}%` }} />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{Array.isArray(team.players) ? team.players.length : team.players || 0} Players</span>
                  <span className="text-xs text-slate-400">{team.points} Points</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {!loading && teams.length === 0 && (
        <EmptyState title="No teams found" description="Try adjusting your search or add a new team." />
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Team"
        message="Are you sure you want to delete this team? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
