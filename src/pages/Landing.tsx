import { Link } from 'react-router-dom';
import {
  BarChart3,
  Shield,
  Swords,
  Trophy,
  Users,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Deep statistical insights powered by comprehensive cricket data analysis.',
    color: 'text-pitch-400',
    bg: 'bg-pitch-500/10',
  },
  {
    icon: Users,
    title: 'Player Tracking',
    description: 'Monitor player performance across formats with detailed career statistics.',
    color: 'text-boundary-400',
    bg: 'bg-boundary-500/10',
  },
  {
    icon: Shield,
    title: 'Team Management',
    description: 'Comprehensive team analytics including squad composition and strategy.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Swords,
    title: 'Match Analysis',
    description: 'Ball-by-ball analysis with predictive modeling and real-time tracking.',
    color: 'text-willow-400',
    bg: 'bg-willow-500/10',
  },
  {
    icon: Trophy,
    title: 'Tournament Insights',
    description: 'Track tournaments, standings, and progression in real-time.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Target,
    title: 'Predictive Models',
    description: 'AI-powered match predictions and performance forecasting.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
];

const stats = [
  { value: '2.4M+', label: 'Data Points' },
  { value: '150+', label: 'International Players' },
  { value: '10K+', label: 'Matches Analyzed' },
  { value: '99.2%', label: 'Accuracy Rate' },
];

export default function Landing() {
  return (
    <div className="min-h-screen gradient-dark overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-pitch flex items-center justify-center">
              <span className="text-white font-bold text-sm">CI</span>
            </div>
            <span className="text-xl font-bold text-white">CricketIQ</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg gradient-pitch text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pitch-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-boundary-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pitch-500/10 border border-pitch-500/20 text-pitch-400 text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            Next-Gen Cricket Analytics
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-slide-up">
            Unlock the Power of
            <br />
            <span className="text-gradient-pitch">Cricket Intelligence</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-slide-up">
            The most comprehensive cricket analytics platform. Track players, analyze matches,
            and gain strategic insights that transform the way you understand the game.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link
              to="/signup"
              className="px-8 py-3.5 rounded-xl gradient-pitch text-white font-semibold text-base hover:opacity-90 transition-opacity flex items-center gap-2 glow-pitch"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-xl glass text-white font-semibold text-base hover:glass-hover transition-all flex items-center gap-2"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-6 text-center animate-scale-in">
              <p className="text-3xl lg:text-4xl font-bold text-gradient-pitch mb-1">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Everything You Need to Dominate
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From player statistics to match predictions, CricketIQ provides the complete toolkit
              for cricket analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass rounded-xl p-6 transition-all duration-300 hover:glass-hover group animate-scale-in"
              >
                <div className={`w-12 h-12 rounded-lg ${feature.bg} ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto glass rounded-2xl p-12 text-center glow-pitch animate-scale-in">
          <TrendingUp className="w-12 h-12 text-pitch-400 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Cricket Strategy?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join thousands of analysts, coaches, and cricket enthusiasts who trust CricketIQ
            for their data-driven decisions.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-pitch text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md gradient-pitch flex items-center justify-center">
              <span className="text-white font-bold text-xs">CI</span>
            </div>
            <span className="text-sm font-semibold text-white">CricketIQ</span>
          </div>
          <p className="text-xs text-slate-500">2026 CricketIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
