import { motion } from 'motion/react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAuth } from '../hooks/useAuth';
import { LiveIndicator } from '../components/leaderboard/LiveIndicator';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Trophy, Target, TrendingUp } from 'lucide-react';

export const LeaderboardPage = () => {
  const { entries, loading, currentUserRank } = useLeaderboard();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <LoadingSpinner size="lg" color="text-indigo-400" />
      </div>
    );
  }

  const currentUserEntry = entries.find(e => e.uid === user?.uid);
  const totalUsers = entries.length;
  const topPercentile = totalUsers > 0 ? Math.round((currentUserRank / totalUsers) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-display font-bold text-white">Live Leaderboard</h1>
          <LiveIndicator />
        </div>
        <p className="text-indigo-200/70">See how you stack up against other students.</p>
      </div>

      {currentUserEntry && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 bg-gradient-to-br from-indigo-900/50 to-purple-900/30 border border-indigo-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 flex flex-col items-center justify-center bg-black/40 border border-white/10 rounded-2xl p-6 w-40 h-40 shadow-inner">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Your Rank</span>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  #{currentUserRank}
                </span>
              </div>
              <span className="text-xs text-gray-500 mt-2">of {totalUsers} students</span>
            </div>

            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full">
              <div className="flex items-center gap-4 mb-4">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full border-2 border-indigo-500/50" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold border-2 border-indigo-500/50">
                    {user?.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-white">{user?.displayName}</h2>
                  <p className="text-indigo-300">Keep up the great work!</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mt-4">
                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm">Completion</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{Math.round(currentUserEntry.percentage)}%</span>
                </div>
                
                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">Percentile</span>
                  </div>
                  <span className="text-2xl font-bold text-white">Top {topPercentile}%</span>
                </div>

                <div className="bg-black/20 rounded-xl p-4 border border-white/5 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm">Tasks Done</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{currentUserEntry.completedTasks} <span className="text-gray-500 text-lg">/ {currentUserEntry.totalTasks}</span></span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {entries.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-gray-400">No users on the leaderboard yet.</p>
        </div>
      ) : (
        <LeaderboardTable entries={entries} />
      )}
    </div>
  );
};
