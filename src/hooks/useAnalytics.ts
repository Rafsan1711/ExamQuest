import { useMemo } from 'react';
import { Subject } from '../types';

export const useAnalytics = (subjects: Subject[]) => {
  return useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;

    let mcqDone = 0, mcqTotal = 0;
    let abDone = 0, abTotal = 0;
    let cdDone = 0, cdTotal = 0;

    const subjectStats = subjects.map(subject => {
      const chapters = Object.values(subject.chapters || {});
      const totalChapters = chapters.length;
      
      let subMcqDone = 0, subAbDone = 0, subCdDone = 0;
      
      chapters.forEach(chapter => {
        if (chapter.mcq) { subMcqDone++; mcqDone++; completedTasks++; }
        if (chapter.abQuestion) { subAbDone++; abDone++; completedTasks++; }
        if (chapter.cdQuestion) { subCdDone++; cdDone++; completedTasks++; }
        
        mcqTotal++;
        abTotal++;
        cdTotal++;
        totalTasks += 3;
      });

      return {
        id: subject.id,
        name: subject.name,
        color: subject.color,
        mcqPercent: totalChapters > 0 ? (subMcqDone / totalChapters) * 100 : 0,
        abPercent: totalChapters > 0 ? (subAbDone / totalChapters) * 100 : 0,
        cdPercent: totalChapters > 0 ? (subCdDone / totalChapters) * 100 : 0,
        overallPercent: totalChapters > 0 ? ((subMcqDone + subAbDone + subCdDone) / (totalChapters * 3)) * 100 : 0,
        totalChapters
      };
    });

    const overallPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const chapterGrid = subjects.flatMap(subject => {
      const chapters = Object.values(subject.chapters || {}).sort((a, b) => a.order - b.order);
      return chapters.map(chapter => {
        let completedCount = 0;
        if (chapter.mcq) completedCount++;
        if (chapter.abQuestion) completedCount++;
        if (chapter.cdQuestion) completedCount++;
        return {
          subjectName: subject.name,
          subjectColor: subject.color,
          chapterName: chapter.name,
          completedCount: completedCount as 0 | 1 | 2 | 3
        };
      });
    });

    return {
      overallPercent,
      subjectStats,
      taskTypeStats: { mcqDone, mcqTotal, abDone, abTotal, cdDone, cdTotal },
      chapterGrid
    };
  }, [subjects]);
};
