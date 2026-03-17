export const LiveIndicator = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </div>
      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Live</span>
    </div>
  );
};
