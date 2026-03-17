import { Trophy, Medal } from 'lucide-react';

interface RankBadgeProps {
  rank: number;
}

export const RankBadge = ({ rank }: RankBadgeProps) => {
  if (rank === 1) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
        <Trophy className="w-4 h-4 text-white" />
      </div>
    );
  }
  
  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg shadow-gray-500/30">
        <Medal className="w-4 h-4 text-white" />
      </div>
    );
  }
  
  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-700/30">
        <Medal className="w-4 h-4 text-white" />
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
      <span className="text-sm font-semibold text-gray-400">{rank}</span>
    </div>
  );
};
