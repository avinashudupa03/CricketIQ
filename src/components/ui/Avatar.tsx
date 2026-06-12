interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const colors = [
  'bg-pitch-600/30 text-pitch-400 border-pitch-500/20',
  'bg-boundary-600/30 text-boundary-400 border-boundary-500/20',
  'bg-blue-600/30 text-blue-400 border-blue-500/20',
  'bg-purple-600/30 text-purple-400 border-purple-500/20',
  'bg-willow-600/30 text-willow-400 border-willow-500/20',
];

export default function Avatar({ initials, size = 'md', color }: AvatarProps) {
  const colorClass = color || colors[initials.charCodeAt(0) % colors.length];

  return (
    <div
      className={`${sizeStyles[size]} ${colorClass} rounded-full flex items-center justify-center font-semibold border shrink-0`}
    >
      {initials}
    </div>
  );
}
