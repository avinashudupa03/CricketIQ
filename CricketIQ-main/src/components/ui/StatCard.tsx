import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  iconColor?: string;
}

export default function StatCard({ title, value, change, icon, iconColor = 'text-pitch-400' }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="glass rounded-xl p-6 transition-all duration-300 hover:glass-hover group animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-pitch-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(change)}%</span>
              <span className="text-slate-500 text-xs">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${iconColor} p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-200`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
