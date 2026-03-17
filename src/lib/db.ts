import { ref, get, set, update, remove, push, onValue, off } from 'firebase/database';
import { db } from './firebase';
import { Subject, Chapter, LeaderboardEntry } from '../types';

export const getUserSyllabus = async (uid: string): Promise<Record<string, Subject>> => {
  const syllabusRef = ref(db, `users/${uid}/syllabus`);
  const snapshot = await get(syllabusRef);
  if (snapshot.exists()) {
    return snapshot.val() as Record<string, Subject>;
  }
  return {};
};

export const addSubject = async (uid: string, data: Omit<Subject, 'id' | 'chapters'>): Promise<string> => {
  const subjectsRef = ref(db, `users/${uid}/syllabus`);
  const newSubjectRef = push(subjectsRef);
  const subjectId = newSubjectRef.key as string;
  
  const subject: Subject = {
    ...data,
    id: subjectId,
    chapters: {}
  };
  
  await set(newSubjectRef, subject);
  return subjectId;
};

export const updateSubject = async (uid: string, subjectId: string, data: Partial<Subject>): Promise<void> => {
  const subjectRef = ref(db, `users/${uid}/syllabus/${subjectId}`);
  await update(subjectRef, data);
};

export const deleteSubject = async (uid: string, subjectId: string): Promise<void> => {
  const subjectRef = ref(db, `users/${uid}/syllabus/${subjectId}`);
  await remove(subjectRef);
};

export const addChapter = async (uid: string, subjectId: string, data: Omit<Chapter, 'id'>): Promise<string> => {
  const chaptersRef = ref(db, `users/${uid}/syllabus/${subjectId}/chapters`);
  const newChapterRef = push(chaptersRef);
  const chapterId = newChapterRef.key as string;
  
  const chapter: Chapter = {
    ...data,
    id: chapterId
  };
  
  await set(newChapterRef, chapter);
  return chapterId;
};

export const updateChapter = async (uid: string, subjectId: string, chapterId: string, data: Partial<Chapter>): Promise<void> => {
  const chapterRef = ref(db, `users/${uid}/syllabus/${subjectId}/chapters/${chapterId}`);
  await update(chapterRef, data);
};

export const deleteChapter = async (uid: string, subjectId: string, chapterId: string): Promise<void> => {
  const chapterRef = ref(db, `users/${uid}/syllabus/${subjectId}/chapters/${chapterId}`);
  await remove(chapterRef);
};

export const toggleCheckbox = async (
  uid: string, 
  subjectId: string, 
  chapterId: string, 
  field: 'mcq' | 'abQuestion' | 'cdQuestion', 
  value: boolean
): Promise<void> => {
  const fieldRef = ref(db, `users/${uid}/syllabus/${subjectId}/chapters/${chapterId}`);
  await update(fieldRef, { [field]: value });
};

export const updateLeaderboard = async (uid: string, entry: Omit<LeaderboardEntry, 'uid'>): Promise<void> => {
  const leaderboardRef = ref(db, `leaderboard/${uid}`);
  const fullEntry: LeaderboardEntry = {
    ...entry,
    uid
  };
  await set(leaderboardRef, fullEntry);
};

export const subscribeLeaderboard = (callback: (entries: LeaderboardEntry[]) => void): () => void => {
  const leaderboardRef = ref(db, 'leaderboard');
  
  const listener = onValue(leaderboardRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val() as Record<string, LeaderboardEntry>;
      const entries = Object.values(data).sort((a, b) => b.percentage - a.percentage);
      callback(entries);
    } else {
      callback([]);
    }
  });
  
  return () => off(leaderboardRef, 'value', listener);
};
