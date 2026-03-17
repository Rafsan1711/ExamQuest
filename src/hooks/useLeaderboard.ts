import { useState, useEffect } from 'react';
import { subscribeLeaderboard } from '../lib/db';
import { LeaderboardEntry } from '../types';
import { useAuth } from './useAuth';

export const useLeaderboard = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = subscribeLeaderboard((data) => {
      // Sort entries by percentage descending
      const sortedEntries = [...data].sort((a, b) => {
        if (b.percentage === a.percentage) {
          return b.completedTasks - a.completedTasks;
        }
        return b.percentage - a.percentage;
      });
      
      setEntries(sortedEntries);
      
      if (user) {
        const rank = sortedEntries.findIndex(entry => entry.uid === user.uid) + 1;
        setCurrentUserRank(rank);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { entries, loading, currentUserRank };
};
