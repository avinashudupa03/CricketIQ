import { useEffect, useState } from 'react';
import { Activity, CalendarDays, MapPin, RefreshCw, Trophy } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';

type Score = {
  r?: number;
  w?: number;
  o?: number;
  inning?: string;
};

type LiveMatch = {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue?: string;
  date?: string;
  teams?: string[];
  score?: Score[];
  matchStarted?: boolean;
  matchEnded?: boolean;
};

export default function Dashboard() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const liveMatches = matches.filter((m) => m.matchStarted && !m.matchEnded);
  const finishedMatches = matches.filter((m) => m.matchEnded);
  const upcomingMatches = matches.filter((m) => !m.matchStarted);

  const fetchLiveMatches = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://cricketiq-nwsy.onrender.com/api/cricket/live');
      const data = await res.json();

      setMatches(data.data || []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching live matches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            CricketIQ Live Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Live cricket scores, match status, and real-time cricket intelligence.
          </p>
        </div>

        <button
          onClick={fetchLiveMatches}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pitch-500/20 text-pitch-300 hover:bg-pitch-500/30 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Activity className="w-4 h-4 text-pitch-400" />
        Last updated: {lastUpdated || 'Loading...'}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Matches"
          value={loading ? '...' : matches.length}
          change={0}
          icon={<Trophy className="w-5 h-5" />}
          iconColor="text-pitch-400"
        />
        <StatCard
          title="Live Matches"
          value={loading ? '...' : liveMatches.length}
          change={0}
          icon={<Activity className="w-5 h-5" />}
          iconColor="text-red-400"
        />
        <StatCard
          title="Upcoming"
          value={loading ? '...' : upcomingMatches.length}
          change={0}
          icon={<CalendarDays className="w-5 h-5" />}
          iconColor="text-blue-400"
        />
        <StatCard
          title="Completed"
          value={loading ? '...' : finishedMatches.length}
          change={0}
          icon={<Trophy className="w-5 h-5" />}
          iconColor="text-willow-400"
        />
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-white">Live & Recent Matches</h2>
            <p className="text-sm text-slate-400">
              Data fetched from your backend live cricket API.
            </p>
          </div>
          <Badge variant="pitch">{liveMatches.length} Live</Badge>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading live matches...</p>
        ) : matches.length === 0 ? (
          <p className="text-slate-400">No matches found right now.</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {matches.slice(0, 12).map((match) => (
              <div
                key={match.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-white font-semibold text-base">
                      {match.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-400">
                      <span>{match.matchType?.toUpperCase()}</span>
                      {match.venue && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {match.venue}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <Badge
                    variant={
                      match.matchStarted && !match.matchEnded
                        ? 'pitch'
                        : match.matchEnded
                        ? 'boundary'
                        : 'blue'
                    }
                  >
                    {match.matchStarted && !match.matchEnded
                      ? 'Live'
                      : match.matchEnded
                      ? 'Result'
                      : 'Upcoming'}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  {match.score && match.score.length > 0 ? (
                    match.score.map((s, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2"
                      >
                        <span className="text-sm text-slate-300">
                          {s.inning || `Innings ${index + 1}`}
                        </span>
                        <span className="text-sm font-semibold text-white">
                          {s.r ?? 0}/{s.w ?? 0} ({s.o ?? 0})
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">Score not available yet.</p>
                  )}
                </div>

                <p className="text-sm text-pitch-300 font-medium">
                  {match.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}