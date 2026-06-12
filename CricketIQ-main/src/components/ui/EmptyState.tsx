import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        {icon || <SearchX className="w-8 h-8 text-slate-500" />}
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-400 max-w-md mb-4">{description}</p>}
      {action}
    </div>
  );
}
