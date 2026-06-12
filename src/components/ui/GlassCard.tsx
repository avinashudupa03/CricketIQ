import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
}

export default function GlassCard({ children, className = '', hover = true, animate = true }: GlassCardProps) {
  return (
    <div
      className={`glass rounded-xl ${hover ? 'transition-all duration-300 hover:glass-hover' : ''} ${animate ? 'animate-fade-in' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
