import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { Subject, Chapter, LeaderboardEntry } from '../types';
import * as dbHelpers from '../lib/db';
import { useToast } from '../components/ui/ToastProvider';

export const useSyllabus = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubjects([]);
      setLoading(false);
      return;
    }

    const syllabusRef = ref(db, `users/${user.uid}/syllabus`);
    const unsubscribe = onValue(syllabusRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as Record<string, Subject>;
        const subjectsArray = Object.values(data).map(subject => ({
          ...subject,
          chapters: subject.chapters || {}
        })).sort((a, b) => a.order - b.order);
        setSubjects(subjectsArray);
      } else {
        setSubjects([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const recalculateAndUpdateLeaderboard = async (currentSubjects: Subject[]) => {
    if (!user) return;

    let totalTasks = 0;
    let completedTasks = 0;

    currentSubjects.forEach(subject => {
      const chapters = Object.values(subject.chapters || {});
      totalTasks += chapters.length * 3;
      chapters.forEach(chapter => {
        if (chapter.mcq) completedTasks++;
        if (chapter.abQuestion) completedTasks++;
        if (chapter.cdQuestion) completedTasks++;
      });
    });

    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const entry: Omit<LeaderboardEntry, 'uid'> = {
      displayName: user.displayName || 'Anonymous',
      photoURL: user.photoURL || '',
      totalTasks,
      completedTasks,
      percentage,
      lastUpdated: Date.now()
    };

    await dbHelpers.updateLeaderboard(user.uid, entry);
  };

  const refreshLeaderboard = async () => {
    if (!user) return;
    try {
      const currentSyllabus = await dbHelpers.getUserSyllabus(user.uid);
      const subjectsArray = Object.values(currentSyllabus).map(subject => ({
        ...subject,
        chapters: subject.chapters || {}
      }));
      await recalculateAndUpdateLeaderboard(subjectsArray);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCheckbox = async (subjectId: string, chapterId: string, field: 'mcq' | 'abQuestion' | 'cdQuestion', value: boolean) => {
    if (!user) return;
    
    const updatedSubjects = subjects.map(sub => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          chapters: {
            ...sub.chapters,
            [chapterId]: {
              ...sub.chapters[chapterId],
              [field]: value
            }
          }
        };
      }
      return sub;
    });

    try {
      await dbHelpers.toggleCheckbox(user.uid, subjectId, chapterId, field, value);
      await recalculateAndUpdateLeaderboard(updatedSubjects);
    } catch (err) {
      error("Failed to update task");
      console.error(err);
    }
  };

  const addSubject = async (data: Omit<Subject, 'id' | 'chapters'>) => {
    if (!user) return;
    try {
      const id = await dbHelpers.addSubject(user.uid, data);
      success("Subject added successfully");
      return id;
    } catch (err) {
      error("Failed to add subject");
      console.error(err);
    }
  };

  const updateSubject = async (subjectId: string, data: Partial<Subject>) => {
    if (!user) return;
    try {
      await dbHelpers.updateSubject(user.uid, subjectId, data);
      success("Subject updated");
    } catch (err) {
      error("Failed to update subject");
      console.error(err);
    }
  };

  const deleteSubject = async (subjectId: string) => {
    if (!user) return;
    try {
      await dbHelpers.deleteSubject(user.uid, subjectId);
      success("Subject deleted");
    } catch (err) {
      error("Failed to delete subject");
      console.error(err);
    }
  };

  const addChapter = async (subjectId: string, data: Omit<Chapter, 'id'>) => {
    if (!user) return;
    try {
      await dbHelpers.addChapter(user.uid, subjectId, data);
      success("Chapter added");
    } catch (err) {
      error("Failed to add chapter");
      console.error(err);
    }
  };

  const updateChapter = async (subjectId: string, chapterId: string, data: Partial<Chapter>) => {
    if (!user) return;
    try {
      await dbHelpers.updateChapter(user.uid, subjectId, chapterId, data);
      success("Chapter updated");
    } catch (err) {
      error("Failed to update chapter");
      console.error(err);
    }
  };

  const deleteChapter = async (subjectId: string, chapterId: string) => {
    if (!user) return;
    try {
      await dbHelpers.deleteChapter(user.uid, subjectId, chapterId);
      success("Chapter deleted");
    } catch (err) {
      error("Failed to delete chapter");
      console.error(err);
    }
  };

  return {
    subjects,
    loading,
    addSubject,
    updateSubject,
    deleteSubject,
    addChapter,
    updateChapter,
    deleteChapter,
    toggleCheckbox,
    refreshLeaderboard
  };
};
