import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 mb-6 relative">
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
        <div className="relative bg-[#111827] border border-white/10 rounded-2xl w-full h-full flex items-center justify-center shadow-xl">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-blue-200/70 max-w-sm mb-8">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-cyan-500/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
