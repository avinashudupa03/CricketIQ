import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'pitch';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger', onConfirm, onCancel }: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md animate-scale-in">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${variant === 'danger' ? 'bg-red-500/15' : 'bg-pitch-500/15'}`}>
            <AlertTriangle className={`w-5 h-5 ${variant === 'danger' ? 'text-red-400' : 'text-pitch-400'}`} />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2.5 glass rounded-lg text-sm font-medium text-slate-300 hover:glass-hover transition-all">{cancelLabel}</button>
          <button onClick={onConfirm} className={`px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 ${variant === 'danger' ? 'bg-red-600' : 'gradient-pitch'}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
