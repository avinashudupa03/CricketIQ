interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pitch' | 'boundary' | 'willow' | 'blue' | 'red' | 'slate';
  size?: 'sm' | 'md';
}

const variantStyles = {
  pitch: 'bg-pitch-500/15 text-pitch-400 border-pitch-500/20',
  boundary: 'bg-boundary-500/15 text-boundary-400 border-boundary-500/20',
  willow: 'bg-willow-500/15 text-willow-400 border-willow-500/20',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  red: 'bg-red-500/15 text-red-400 border-red-500/20',
  slate: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
};

export default function Badge({ children, variant = 'pitch', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full ${variantStyles[variant]} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {children}
    </span>
  );
}
