import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { players, teams, runRateData, formatDistribution, monthlyMatches } from '../data/dummy';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler, RadialLinearScale);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { size: 12 } } },
    tooltip: {
      backgroundColor: 'rgba(15,18,25,0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      titleColor: '#fff',
      bodyColor: '#94a3b8',
      cornerRadius: 8,
    },
  },
  scales: {
    x: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
    y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
  },
};

const topBatsmen = players.filter(p => p.role === 'Batsman' || p.role === 'Wicketkeeper').sort((a, b) => b.runs - a.runs).slice(0, 5);
const topBowlers = players.filter(p => p.role === 'Bowler').sort((a, b) => b.wickets - a.wickets).slice(0, 5);

export default function Analytics() {
  const [compareA, setCompareA] = useState(players[0]);
  const [compareB, setCompareB] = useState(players[1]);

  // Runs Trend
  const runsTrendData = {
    labels: topBatsmen.map(p => p.name.split(' ').pop()),
    datasets: [{
      label: 'Career Runs',
      data: topBatsmen.map(p => p.runs),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#22c55e',
      pointRadius: 5,
    }],
  };

  // Strike Rate Chart
  const srData = {
    labels: topBatsmen.map(p => p.name.split(' ').pop()),
    datasets: [{
      label: 'Strike Rate',
      data: topBatsmen.map(p => p.strikeRate),
      backgroundColor: ['rgba(34,197,94,0.7)', 'rgba(245,158,11,0.7)', 'rgba(59,130,246,0.7)', 'rgba(168,85,247,0.7)', 'rgba(239,68,68,0.7)'],
      borderRadius: 6,
    }],
  };

  // Wicket Analysis
  const wicketData = {
    labels: topBowlers.map(p => p.name.split(' ').pop()),
    datasets: [{
      label: 'Wickets',
      data: topBowlers.map(p => p.wickets),
      backgroundColor: 'rgba(245,158,11,0.7)',
      borderRadius: 6,
    }, {
      label: 'Economy Rate x10',
      data: topBowlers.map(p => p.economy * 10),
      backgroundColor: 'rgba(59,130,246,0.7)',
      borderRadius: 6,
    }],
  };

  // Team Comparison (Radar)
  const topTeams = teams.slice(0, 4);
  const teamRadarData = {
    labels: ['Wins', 'Points', 'NRR x100', 'Win %', 'Draws'],
    datasets: topTeams.map((t, i) => ({
      label: t.shortName,
      data: [t.wins, t.points, Math.abs(t.netRunRate) * 100, Math.round((t.wins / (t.wins + t.losses + t.draws)) * 100), t.draws],
      borderColor: ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444'][i],
      backgroundColor: ['rgba(34,197,94,0.1)', 'rgba(245,158,11,0.1)', 'rgba(59,130,246,0.1)', 'rgba(239,68,68,0.1)'][i],
      pointBackgroundColor: ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444'][i],
    })),
  };

  // Player Comparison (Radar)
  const playerCompareData = {
    labels: ['Runs/100', 'Wickets x5', 'Average', 'SR/2', 'Economy x10'],
    datasets: [
      {
        label: compareA.name,
        data: [compareA.runs / 100, compareA.wickets * 5, compareA.average, compareA.strikeRate / 2, compareA.economy * 10],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.15)',
        pointBackgroundColor: '#22c55e',
      },
      {
        label: compareB.name,
        data: [compareB.runs / 100, compareB.wickets * 5, compareB.average, compareB.strikeRate / 2, compareB.economy * 10],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.15)',
        pointBackgroundColor: '#f59e0b',
      },
    ],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Deep-dive into cricket performance metrics and insights</p>
      </div>

      {/* Row 1: Runs Trend + Strike Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Runs Trend</h3>
              <p className="text-sm text-slate-400">Top batsmen career runs</p>
            </div>
            <Badge variant="pitch">Chart.js</Badge>
          </div>
          <div className="h-72">
            <Line data={runsTrendData} options={chartOptions} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Strike Rate Analysis</h3>
              <p className="text-sm text-slate-400">Batting strike rate comparison</p>
            </div>
          </div>
          <div className="h-72">
            <Bar data={srData} options={{ ...chartOptions, indexAxis: 'y' as const }} />
          </div>
        </GlassCard>
      </div>

      {/* Row 2: Wicket Analysis + Format Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Wicket Analysis</h3>
              <p className="text-sm text-slate-400">Top bowlers: wickets and economy</p>
            </div>
          </div>
          <div className="h-72">
            <Bar data={wicketData} options={chartOptions} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-1">Format Distribution</h3>
          <p className="text-sm text-slate-400 mb-4">Season breakdown</p>
          <div className="h-52">
            <Pie data={{
              labels: formatDistribution.map(f => f.name),
              datasets: [{ data: formatDistribution.map(f => f.value), backgroundColor: formatDistribution.map(f => f.color), borderWidth: 0 }],
            }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 15, font: { size: 11 } } } } }} />
          </div>
        </GlassCard>
      </div>

      {/* Row 3: Team Comparison Radar + Monthly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Team Comparison</h3>
              <p className="text-sm text-slate-400">Radar analysis of top teams</p>
            </div>
          </div>
          <div className="h-72">
            <Radar data={teamRadarData} options={{
              responsive: true, maintainAspectRatio: false,
              scales: { r: { angleLines: { color: 'rgba(255,255,255,0.1)' }, grid: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#94a3b8', font: { size: 11 } }, ticks: { display: false } } },
              plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } } },
            }} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Monthly Match Volume</h3>
              <p className="text-sm text-slate-400">By format across months</p>
            </div>
          </div>
          <div className="h-72">
            <Bar data={{
              labels: monthlyMatches.map(m => m.month),
              datasets: [
                { label: 'Test', data: monthlyMatches.map(m => m.test), backgroundColor: 'rgba(34,197,94,0.7)', borderRadius: 4 },
                { label: 'ODI', data: monthlyMatches.map(m => m.odi), backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 4 },
                { label: 'T20', data: monthlyMatches.map(m => m.t20), backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 4 },
              ],
            }} options={chartOptions} />
          </div>
        </GlassCard>
      </div>

      {/* Row 4: Player Comparison */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Player Comparison</h3>
            <p className="text-sm text-slate-400">Head-to-head radar analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={compareA.id} onChange={(e) => setCompareA(players.find(p => p.id === e.target.value) || players[0])} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-pitch-500/50 appearance-none">
              {players.map(p => <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>)}
            </select>
            <span className="text-slate-500 text-sm font-bold">VS</span>
            <select value={compareB.id} onChange={(e) => setCompareB(players.find(p => p.id === e.target.value) || players[1])} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-pitch-500/50 appearance-none">
              {players.map(p => <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>)}
            </select>
          </div>
        </div>
        <div className="h-80">
          <Radar data={playerCompareData} options={{
            responsive: true, maintainAspectRatio: false,
            scales: { r: { angleLines: { color: 'rgba(255,255,255,0.1)' }, grid: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#94a3b8', font: { size: 12 } }, ticks: { display: false } } },
            plugins: { legend: { labels: { color: '#94a3b8', font: { size: 12 } } } },
          }} />
        </div>
        {/* Comparison Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 pt-6 border-t border-white/5">
          {[
            { label: 'Runs', a: compareA.runs, b: compareB.runs },
            { label: 'Wickets', a: compareA.wickets, b: compareB.wickets },
            { label: 'Average', a: compareA.average, b: compareB.average },
            { label: 'Strike Rate', a: compareA.strikeRate, b: compareB.strikeRate },
            { label: 'Economy', a: compareA.economy, b: compareB.economy },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-xs text-slate-400 mb-2">{stat.label}</p>
              <div className="flex items-center justify-center gap-4">
                <span className={`text-sm font-bold ${stat.a > stat.b ? 'text-pitch-400' : 'text-slate-300'}`}>{stat.a}</span>
                <span className="text-xs text-slate-500">vs</span>
                <span className={`text-sm font-bold ${stat.b > stat.a ? 'text-boundary-400' : 'text-slate-300'}`}>{stat.b}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Run Rate Data Table */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Run Rate by Phase (Tabular)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Overs</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">India</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Australia</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase">England</th>
              </tr>
            </thead>
            <tbody>
              {runRateData.map(row => (
                <tr key={row.over} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-sm text-white font-medium">{row.over}</td>
                  <td className="px-4 py-3 text-sm text-pitch-400">{row.india}</td>
                  <td className="px-4 py-3 text-sm text-boundary-400">{row.australia}</td>
                  <td className="px-4 py-3 text-sm text-blue-400">{row.england}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
