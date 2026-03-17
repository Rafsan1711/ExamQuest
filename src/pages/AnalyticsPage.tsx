import { useSyllabus } from '../hooks/useSyllabus';
import { useAnalytics } from '../hooks/useAnalytics';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { CardSkeleton } from '../components/ui/CardSkeleton';
import { BarChart3 } from 'lucide-react';
import { OverallDonutChart } from '../components/analytics/OverallDonutChart';
import { TaskTypePieChart } from '../components/analytics/TaskTypePieChart';
import { SubjectBarChart } from '../components/analytics/SubjectBarChart';
import { ChapterHeatmap } from '../components/analytics/ChapterHeatmap';

export const AnalyticsPage = () => {
  const { subjects, loading } = useSyllabus();
  const { overallPercent, subjectStats, taskTypeStats, chapterGrid } = useAnalytics(subjects);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[300px] flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[300px] flex items-center justify-center">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 h-[400px]">
          <Skeleton className="h-6 w-48 mb-6" />
          <Skeleton className="h-full w-full" />
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[400px]">
          <Skeleton className="h-6 w-48 mb-6" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon={<BarChart3 className="w-12 h-12 text-cyan-400" />}
          title="No Analytics Yet"
          description="Add subjects and chapters to your syllabus to see your progress analytics."
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-blue-200/70">Visualize your preparation progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Overall Progress */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-white mb-6 w-full text-left">Overall Completion</h2>
          <OverallDonutChart percentage={overallPercent} />
        </div>

        {/* Task Distribution */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-white mb-6 w-full text-left">Task Distribution</h2>
          <TaskTypePieChart stats={taskTypeStats} />
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-6">Subject Breakdown</h2>
        <SubjectBarChart data={subjectStats} />
      </div>

      {/* Chapter Heatmap */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Chapter Heatmap</h2>
        <ChapterHeatmap data={chapterGrid} />
      </div>
    </div>
  );
};
