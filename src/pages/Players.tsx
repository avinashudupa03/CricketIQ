import { useState, useEffect, useCallback } from 'react';
import { Plus, Download, Loader2, Trash2, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import SearchBar from '../components/ui/SearchBar';
import FilterSelect from '../components/ui/FilterSelect';
import GlassCard from '../components/ui/GlassCard';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';
import { StatCardSkeleton, TableRowSkeleton } from '../components/ui/Skeleton';
import { players as dummyPlayers, Player } from '../data/dummy';
import { playerApi } from '../api/playerApi';
import { exportPlayerReport } from '../utils/pdfExport';

const roleOptions = [
  { label: 'Batsman', value: 'Batsman' },
  { label: 'Bowler', value: 'Bowler' },
  { label: 'All-rounder', value: 'All-rounder' },
  { label: 'Wicketkeeper', value: 'Wicketkeeper' },
];

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Injured', value: 'injured' },
  { label: 'Retired', value: 'retired' },
];

const roleVariant: Record<string, 'pitch' | 'boundary' | 'blue' | 'willow'> = {
  Batsman: 'pitch',
  Bowler: 'boundary',
  'All-rounder': 'blue',
  Wicketkeeper: 'willow',
};

const statusVariant: Record<string, 'pitch' | 'red' | 'slate'> = {
  active: 'pitch',
  injured: 'red',
  retired: 'slate',
};

const emptyPlayer: { name: string; role: string; team: string; country: string; matches: number; runs: number; wickets: number; average: number; strikeRate: number; economy: number; avatar: string; status: string } = { name: '', role: 'Batsman', team: '', country: '', matches: 0, runs: 0, wickets: 0, average: 0, strikeRate: 0, economy: 0, avatar: '', status: 'active' };

export default function Players() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [players, setPlayers] = useState<Player[]>(dummyPlayers);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPlayer);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await playerApi.getAll({ search, role: roleFilter, status: statusFilter });
      setPlayers(res.data.players);
    } catch {
      const filtered = dummyPlayers.filter((p) => {
        const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase());
        const mr = !roleFilter || p.role === roleFilter;
        const mst = !statusFilter || p.status === statusFilter;
        return ms && mr && mst;
      });
      setPlayers(filtered);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => { fetchPlayers(); }, [fetchPlayers]);

  function openAdd() { setForm(emptyPlayer); setEditingId(null); setShowForm(true); setError(''); }
  function openEdit(p: Player) {
    setForm({ name: p.name, role: p.role, team: p.team, country: p.country, matches: p.matches, runs: p.runs, wickets: p.wickets, average: p.average, strikeRate: p.strikeRate, economy: p.economy, avatar: p.avatar, status: p.status });
    setEditingId(p.id);
    setShowForm(true);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await playerApi.update(editingId, form);
        toast.success('Player updated successfully');
      } else {
        await playerApi.create({ ...form, avatar: form.avatar || form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() });
        toast.success('Player created successfully');
      }
      setShowForm(false);
      fetchPlayers();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save player.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await playerApi.delete(deleteTarget);
      toast.success('Player deleted');
      fetchPlayers();
    } catch {
      setPlayers((prev) => prev.filter((p) => p.id !== deleteTarget));
      toast.success('Player removed');
    }
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Player Management</h1>
          <p className="text-slate-400 text-sm mt-1">Track and manage player profiles and statistics</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { exportPlayerReport(players); toast.success('PDF exported'); }} className="flex items-center gap-2 px-4 py-2.5 glass rounded-lg text-sm font-medium text-slate-300 hover:glass-hover transition-all">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 gradient-pitch rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Player
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search players by name or team..." />
        </div>
        <FilterSelect value={roleFilter} onChange={setRoleFilter} options={roleOptions} placeholder="All Roles" />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={statusOptions} placeholder="All Status" />
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <GlassCard className="p-6 animate-scale-in">
          <h3 className="text-lg font-semibold text-white mb-4">{editingId ? 'Edit Player' : 'Add Player'}</h3>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-pitch-500/50 appearance-none">
              {roleOptions.map((r) => <option key={r.value} value={r.value} className="bg-slate-900">{r.label}</option>)}
            </select>
            <input required placeholder="Team" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input required placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input type="number" placeholder="Matches" value={form.matches} onChange={(e) => setForm({ ...form, matches: +e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input type="number" placeholder="Runs" value={form.runs} onChange={(e) => setForm({ ...form, runs: +e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input type="number" placeholder="Wickets" value={form.wickets} onChange={(e) => setForm({ ...form, wickets: +e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <input type="number" step="0.1" placeholder="Average" value={form.average} onChange={(e) => setForm({ ...form, average: +e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Player['status'] })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-pitch-500/50 appearance-none">
              {statusOptions.map((s) => <option key={s.value} value={s.value} className="bg-slate-900">{s.label}</option>)}
            </select>
            <div className="col-span-full flex items-center gap-3 mt-2">
              <button type="submit" disabled={saving} className="px-6 py-2.5 gradient-pitch rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {editingId ? 'Update' : 'Create'} Player
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 glass rounded-lg text-sm font-medium text-slate-300 hover:glass-hover transition-all">Cancel</button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Table */}
      <GlassCard className="overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-2">
            <StatCardSkeleton />
            {Array.from({length: 5}).map((_, i) => <TableRowSkeleton key={i} cols={9} />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Matches</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Runs</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Wickets</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Average</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={player.avatar || player.name.split(' ').map(n => n[0]).join('').slice(0, 2)} size="md" />
                        <div>
                          <p className="text-sm font-medium text-white">{player.name}</p>
                          <p className="text-xs text-slate-400">{player.country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={roleVariant[player.role] || 'slate'}>{player.role}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{player.team}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{player.matches}</td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{player.runs.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{player.wickets}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{player.average}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant[player.status]}>
                        {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(player)} className="p-1.5 rounded-md text-slate-400 hover:text-pitch-400 hover:bg-white/5 transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(player.id)} className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && players.length === 0 && (
          <EmptyState title="No players found" description="Try adjusting your search or filters, or add a new player." />
        )}
      </GlassCard>

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Player"
        message="Are you sure you want to delete this player? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
