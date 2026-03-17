export interface Chapter {
  id: string;
  name: string;
  order: number;
  mcq: boolean;
  abQuestion: boolean;
  cdQuestion: boolean;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  order: number;
  chapters: Record<string, Chapter>;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  joinedAt: number;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL: string;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  lastUpdated: number;
}

export interface SyllabusStats {
  totalSubjects: number;
  totalChapters: number;
  completedMCQ: number;
  completedAB: number;
  completedCD: number;
  overallPercent: number;
}
