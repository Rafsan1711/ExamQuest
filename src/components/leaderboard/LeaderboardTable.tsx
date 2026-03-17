import { motion } from 'motion/react';
import { LeaderboardEntry } from '../../types';
import { RankBadge } from './RankBadge';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '../../hooks/useAuth';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export const LeaderboardTable = ({ entries }: LeaderboardTableProps) => {
  const { user } = useAuth();

  const getProgressColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-emerald-500';
    if (percentage >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400 bg-black/20">
              <th className="px-6 py-4 font-medium w-20 text-center">Rank</th>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium w-1/3">Progress</th>
              <th className="px-6 py-4 font-medium text-right">Completion</th>
              <th className="px-6 py-4 font-medium text-right">Tasks</th>
              <th className="px-6 py-4 font-medium text-right">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = user?.uid === entry.uid;
              
              return (
                <motion.tr
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={entry.uid}
                  className={`
                    border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors
                    ${isCurrentUser ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}
                  `}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center">
                      <RankBadge rank={rank} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <UserAvatar 
                        photoURL={entry.photoURL} 
                        displayName={entry.displayName} 
                        rank={rank} 
                      />
                      <div className="flex flex-col">
                        <span className={`font-medium ${isCurrentUser ? 'text-indigo-300' : 'text-gray-200'}`}>
                          {entry.displayName}
                          {isCurrentUser && <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">You</span>}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${entry.percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-2.5 rounded-full ${getProgressColor(entry.percentage)}`}
                      ></motion.div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`font-bold ${
                      entry.percentage >= 70 ? 'text-emerald-400' : 
                      entry.percentage >= 40 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {Math.round(entry.percentage)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-400 text-sm font-mono">
                    {entry.completedTasks} / {entry.totalTasks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500 text-sm">
                    {formatTimeAgo(entry.lastUpdated)}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
