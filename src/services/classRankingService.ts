import {
  ClassRankingItem,
  INITIAL_CLASSES_DATA,
  CheerMessage,
  INITIAL_CHEER_MESSAGES,
  getClassId,
  ClassActivityLog,
  COLLECTIVE_BADGES,
} from '../data/classRanking';
import { SchoolGrade, SchoolClassLetter } from '../data/studentProfile';

const STORAGE_KEY_CLASSES = 'monte_sua_historia_class_ranking_v2';
const STORAGE_KEY_CHEERS = 'monte_sua_historia_class_cheers_v2';
const STORAGE_KEY_USER_CONTRIBS = 'monte_sua_historia_user_contribs_v2';

export interface UserClassContribution {
  totalPoints: number;
  grammarPoints: number;
  writingPoints: number;
  storiesCount: number;
  grammarQuestsCount: number;
}

// Event emitter pattern for real-time reactivity in React hooks
type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((l) => {
    try {
      l();
    } catch (e) {
      console.error('Error notifying class ranking listener:', e);
    }
  });
}

export function subscribeToClassRanking(callback: Listener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getStoredClasses(): ClassRankingItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLASSES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored class ranking, using initial data:', err);
  }
  return INITIAL_CLASSES_DATA;
}

function saveClasses(classes: ClassRankingItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
    notifyListeners();
  } catch (err) {
    console.warn('Failed to save class ranking:', err);
  }
}

export function getStoredCheers(): CheerMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHEERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse cheers, using initial data:', err);
  }
  return INITIAL_CHEER_MESSAGES;
}

function saveCheers(cheers: CheerMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY_CHEERS, JSON.stringify(cheers));
    notifyListeners();
  } catch (err) {
    console.warn('Failed to save cheers:', err);
  }
}

export function getUserContributions(): Record<string, UserClassContribution> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER_CONTRIBS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse user class contributions:', e);
  }
  return {};
}

function saveUserContributions(contribs: Record<string, UserClassContribution>) {
  try {
    localStorage.setItem(STORAGE_KEY_USER_CONTRIBS, JSON.stringify(contribs));
  } catch (e) {
    console.warn('Failed to save user class contributions:', e);
  }
}

/**
 * Record points to a specific class from a student activity (Grammar or Story writing)
 */
export function recordClassPoints(
  grade: SchoolGrade | string,
  classLetter: SchoolClassLetter | string,
  type: 'grammar' | 'writing',
  points: number,
  studentName: string = 'Escritor(a) Mirim',
  actionDetail?: string
): { updatedClass: ClassRankingItem; pointsAdded: number } {
  const targetId = getClassId(grade, classLetter);
  const classes = getStoredClasses();

  let targetIndex = classes.findIndex((c) => c.id === targetId);

  // If not found, look up or fallback
  if (targetIndex === -1) {
    targetIndex = 0;
  }

  const current = classes[targetIndex];
  const newGrammar = type === 'grammar' ? current.grammarPoints + points : current.grammarPoints;
  const newWriting = type === 'writing' ? current.writingPoints + points : current.writingPoints;
  const newTotal = newGrammar + newWriting;
  const newStories = type === 'writing' ? current.storiesCount + 1 : current.storiesCount;
  const newGrammarQuests = type === 'grammar' ? current.grammarQuestsCount + 1 : current.grammarQuestsCount;

  // New activity log entry
  const newActivity: ClassActivityLog = {
    id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    studentName,
    text: actionDetail || (type === 'grammar' ? 'Pontuou na Arena de Gramática' : 'Criou uma nova história mágica'),
    timeAgo: 'Agora mesmo',
    pointsAdded: points,
    type,
  };

  const updatedActivities = [newActivity, ...(current.recentActivities || [])].slice(0, 10);

  // Check collective badges
  const badges = [...(current.collectiveBadges || [])];
  if (newStories >= 45 && !badges.find((b) => b.id === 'ouro_escrita')) {
    badges.push(COLLECTIVE_BADGES.ouro_escrita);
  }
  if (newGrammarQuests >= 180 && !badges.find((b) => b.id === 'mestres_pontuacao')) {
    badges.push(COLLECTIVE_BADGES.mestres_pontuacao);
  }
  if (newTotal >= 7500 && !badges.find((b) => b.id === 'diamante_leitura')) {
    badges.push(COLLECTIVE_BADGES.diamante_leitura);
  }

  const updatedClass: ClassRankingItem = {
    ...current,
    grammarPoints: newGrammar,
    writingPoints: newWriting,
    totalPoints: newTotal,
    storiesCount: newStories,
    grammarQuestsCount: newGrammarQuests,
    weeklyGoalCurrent: Math.min(current.weeklyGoalTarget, current.weeklyGoalCurrent + points),
    recentActivities: updatedActivities,
    collectiveBadges: badges,
  };

  classes[targetIndex] = updatedClass;
  saveClasses(classes);

  // Also update user's personal contribution breakdown
  const contribs = getUserContributions();
  const userClassContrib = contribs[targetId] || {
    totalPoints: 0,
    grammarPoints: 0,
    writingPoints: 0,
    storiesCount: 0,
    grammarQuestsCount: 0,
  };

  contribs[targetId] = {
    totalPoints: userClassContrib.totalPoints + points,
    grammarPoints: type === 'grammar' ? userClassContrib.grammarPoints + points : userClassContrib.grammarPoints,
    writingPoints: type === 'writing' ? userClassContrib.writingPoints + points : userClassContrib.writingPoints,
    storiesCount: type === 'writing' ? userClassContrib.storiesCount + 1 : userClassContrib.storiesCount,
    grammarQuestsCount: type === 'grammar' ? userClassContrib.grammarQuestsCount + 1 : userClassContrib.grammarQuestsCount,
  };
  saveUserContributions(contribs);

  return { updatedClass, pointsAdded: points };
}

/**
 * Add a cheer / motivational message to a class
 */
export function addCheer(
  classId: string,
  senderName: string,
  senderTurma: string,
  message: string,
  emoji: string = '👏'
): CheerMessage {
  const cheers = getStoredCheers();
  const newCheer: CheerMessage = {
    id: 'ch_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    classId,
    senderName: senderName.trim() || 'Colega de Escola',
    senderTurma: senderTurma || 'Alfabetiza MT',
    message: message.trim(),
    timestamp: 'Agora mesmo',
    likes: 1,
    emoji,
  };

  const updated = [newCheer, ...cheers];
  saveCheers(updated);
  return newCheer;
}

/**
 * Like a cheer message
 */
export function likeCheer(cheerId: string): void {
  const cheers = getStoredCheers();
  const target = cheers.find((c) => c.id === cheerId);
  if (target) {
    target.likes += 1;
    saveCheers([...cheers]);
  }
}

/**
 * Reset ranking back to initial data (useful for teacher demonstrations or resetting terms)
 */
export function resetClassRankingToDefaults(): void {
  saveClasses(INITIAL_CLASSES_DATA);
  saveCheers(INITIAL_CHEER_MESSAGES);
  saveUserContributions({});
}

/**
 * Calculate grand total across all 15 classes for the school-wide collaborative goal
 */
export function getSchoolWideStats(classes: ClassRankingItem[]): {
  totalPoints: number;
  totalStories: number;
  totalGrammarQuests: number;
  targetGoal: number;
  progressPercent: number;
  classesCount: number;
} {
  const totalPoints = classes.reduce((sum, c) => sum + c.totalPoints, 0);
  const totalStories = classes.reduce((sum, c) => sum + c.storiesCount, 0);
  const totalGrammarQuests = classes.reduce((sum, c) => sum + c.grammarQuestsCount, 0);
  const targetGoal = 100000; // 100k school festival goal
  const progressPercent = Math.min(100, Math.round((totalPoints / targetGoal) * 100));

  return {
    totalPoints,
    totalStories,
    totalGrammarQuests,
    targetGoal,
    progressPercent,
    classesCount: classes.length,
  };
}
