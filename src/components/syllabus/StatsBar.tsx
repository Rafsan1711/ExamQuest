import { Subject } from '../../types';
import { BookOpen, CheckCircle2, Target, Layers } from 'lucide-react';

interface StatsBarProps {
  subjects: Subject[];
}

export const StatsBar = ({ subjects }: StatsBarProps) => {
  let totalSubjects = subjects.length;
  let totalChapters = 0;
  let totalTasks = 0;
  let completedTasks = 0;

  subjects.forEach(subject => {
    const chapters = Object.values(subject.chapters || {});
    totalChapters += chapters.length;
    totalTasks += chapters.length * 3;
    chapters.forEach(chapter => {
      if (chapter.mcq) completedTasks++;
      if (chapter.abQuestion) completedTasks++;
      if (chapter.cdQuestion) completedTasks++;
    });
  });

  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const cards = [
    {
      label: 'Overall Progress',
      value: `${percentage}%`,
      icon: <Target className="w-5 h-5 text-cyan-400" />,
      isChart: true,
    },
    {
      label: 'Total Subjects',
      value: totalSubjects.toString(),
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
    },
    {
      label: 'Total Chapters',
      value: totalChapters.toString(),
      icon: <Layers className="w-5 h-5 text-purple-400" />,
    },
    {
      label: 'Tasks Completed',
      value: `${completedTasks} / ${totalTasks}`,
      icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 transition-transform duration-200 hover:scale-[1.02] hover:bg-white/10"
        >
          {card.isChart ? (
            <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-black/20">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#06b6d4 ${percentage}%, transparent ${percentage}%)`,
                }}
              />
              <div className="absolute inset-1 bg-[#111827] rounded-full" />
              <span className="relative text-xs font-bold text-white">{percentage}%</span>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center">
              {card.icon}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-blue-200/70">{card.label}</p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
