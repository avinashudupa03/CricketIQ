import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, MapPin, Calendar, Shield, Bell, Key, LogOut, Loader2 } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/authApi';

const recentActivity = [
  { action: 'Generated batting analysis report', time: '2 hours ago' },
  { action: 'Added Jasprit Bumrah to watchlist', time: '5 hours ago' },
  { action: 'Updated team comparison for IND vs AUS', time: '1 day ago' },
  { action: 'Exported tournament standings', time: '2 days ago' },
  { action: 'Created custom bowling metrics dashboard', time: '3 days ago' },
];

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: user?.name || 'Arjun Kumar',
    email: user?.email || 'arjun@cricketiq.com',
    phone: user?.phone || '+91 98765 43210',
    location: user?.location || 'Mumbai, India',
    organization: user?.organization || 'Cricket Analytics Corp',
  });

  const [prefs, setPrefs] = useState({
    emailNotifications: user?.emailNotifications ?? true,
    twoFactorEnabled: user?.twoFactorEnabled ?? false,
    apiAccess: user?.apiAccess ?? true,
  });

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        organization: user.organization || '',
      });
      setPrefs({
        emailNotifications: user.emailNotifications ?? true,
        twoFactorEnabled: user.twoFactorEnabled ?? false,
        apiAccess: user.apiAccess ?? true,
      });
    }
  }, [user]);

  const profileStats = [
    { label: 'Reports Generated', value: user?.reportsGenerated ?? 47 },
    { label: 'Players Tracked', value: user?.playersTracked ?? 32 },
    { label: 'Teams Followed', value: user?.teamsFollowed ?? 8 },
    { label: 'Matches Analyzed', value: user?.matchesAnalyzed ?? 156 },
  ];

  async function handleSave() {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res = await authApi.updateProfile(form);
      updateUser(res.data.user);
      setMessage('Profile updated successfully.');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update profile.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePref(key: keyof typeof prefs) {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    try {
      const res = await authApi.updateProfile(newPrefs);
      updateUser(res.data.user);
    } catch {
      setPrefs(prefs);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setChangingPassword(true);
    setError('');
    setMessage('');
    try {
      await authApi.changePassword(passwordForm);
      setMessage('Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to change password.';
      setError(msg);
    } finally {
      setChangingPassword(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const nameParts = (user?.name || 'Arjun Kumar').split(' ');
  const initials = nameParts.length >= 2 ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() : nameParts[0].slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl lg:text-3xl font-bold text-white">Profile</h1>

      {message && <div className="p-3 rounded-lg bg-pitch-500/10 border border-pitch-500/20 text-pitch-400 text-sm">{message}</div>}
      {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {/* Profile Header */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative group">
            <Avatar initials={initials} size="xl" />
            <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{user?.name || 'Arjun Kumar'}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user?.email || 'arjun@cricketiq.com'}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {user?.location || 'Mumbai, India'}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined Jan 2025</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="pitch">{(user?.plan || 'pro').charAt(0).toUpperCase() + (user?.plan || 'pro').slice(1)} Plan</Badge>
              <Badge variant="boundary">{(user?.role || 'analyst').charAt(0).toUpperCase() + (user?.role || 'analyst').slice(1)}</Badge>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {profileStats.map((stat) => (
          <GlassCard key={stat.label} className="p-5 text-center">
            <p className="text-2xl font-bold text-gradient-pitch">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Personal Info */}
        <GlassCard className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { key: 'name', label: 'Full Name' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Phone' },
              { key: 'location', label: 'Location' },
              { key: 'organization', label: 'Organization' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">{field.label}</label>
                <input
                  type="text"
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-pitch-500/50 focus:ring-1 focus:ring-pitch-500/25 transition-all"
                />
              </div>
            ))}
          </div>
          <button onClick={handleSave} disabled={saving} className="mt-6 px-6 py-2.5 gradient-pitch rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
          </button>
        </GlassCard>

        {/* Settings */}
        <div className="space-y-4">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
            <div className="space-y-4">
              {[
                { icon: Bell, label: 'Email Notifications', key: 'emailNotifications' as const },
                { icon: Shield, label: 'Two-Factor Auth', key: 'twoFactorEnabled' as const },
                { icon: Key, label: 'API Access', key: 'apiAccess' as const },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <pref.icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">{pref.label}</span>
                  </div>
                  <button
                    onClick={() => handleTogglePref(pref.key)}
                    className={`w-10 h-5 rounded-full transition-colors ${prefs[pref.key] ? 'bg-pitch-600' : 'bg-white/10'} relative`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${prefs[pref.key] ? 'left-5' : 'left-0.5'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <input type="password" placeholder="Current password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
              <input type="password" placeholder="New password (min 8 chars)" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pitch-500/50" />
              <button type="submit" disabled={changingPassword} className="w-full px-4 py-2.5 gradient-pitch rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                {changingPassword && <Loader2 className="w-4 h-4 animate-spin" />} Update Password
              </button>
            </form>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 transition-colors text-left">
                <Shield className="w-4 h-4 text-slate-400" /> Privacy Settings
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/5 transition-colors text-left">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Recent Activity */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="w-2 h-2 rounded-full bg-pitch-500 shrink-0" />
              <p className="text-sm text-slate-300 flex-1">{activity.action}</p>
              <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
