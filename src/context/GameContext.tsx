import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProgress,
  INITIAL_USER_PROGRESS,
  getLevelInfo,
  STICKERS,
  AVATARS,
  BADGES,
  Badge,
  getBadgeProgress,
  Sticker,
} from '../data/rewards';
import { StoryCard } from '../data/storyCards';
import { sound } from '../utils/audio';

export interface SavedStory {
  id: string;
  title: string;
  author: string;
  genreId: string;
  genreName: string;
  createdAt: string;
  coverEmoji: string;
  coverBg: string;
  cards: {
    personagem?: StoryCard | null;
    lugar?: StoryCard | null;
    acao?: StoryCard | null;
    complemento?: StoryCard | null;
  };
  sections: {
    key: string;
    title: string;
    content: string;
  }[];
  wordCount?: number;
  connectivesCount?: number;
  isCooperative?: boolean;
  contributors?: string[];
}

interface GameContextType {
  progress: UserProgress;
  savedStories: SavedStory[];
  currentDrawnCards: {
    personagem: StoryCard | null;
    lugar: StoryCard | null;
    acao: StoryCard | null;
    complemento: StoryCard | null;
  };
  setCurrentDrawnCards: (cards: {
    personagem: StoryCard | null;
    lugar: StoryCard | null;
    acao: StoryCard | null;
    complemento: StoryCard | null;
  }) => void;
  activeTab: 'draw' | 'workshop' | 'grammar' | 'rewards' | 'library' | 'pedagogical' | 'mural';
  setActiveTab: (tab: 'draw' | 'workshop' | 'grammar' | 'rewards' | 'library' | 'pedagogical' | 'mural') => void;
  addXpAndCoins: (xp: number, coins: number) => void;
  unlockSticker: (stickerId: string) => boolean;
  openTreasureChest: () => { sticker: Sticker | null; isNew: boolean; cashback: number } | null;
  selectAvatar: (avatarId: string) => void;
  updateStudentName: (name: string) => void;
  saveStory: (story: Omit<SavedStory, 'id' | 'createdAt'>) => string;
  deleteStory: (id: string) => void;
  toggleSound: () => void;
  triggerConfetti: () => void;
  recordGrammarSuccess: (moduleKey: string, earnedXp: number, earnedCoins: number, currentStreak: number) => void;
  newlyUnlockedBadge: Badge | null;
  dismissBadgeNotification: () => void;
}

const STORAGE_KEY_PROGRESS = 'monte_sua_historia_progress_v2';
const STORAGE_KEY_STORIES = 'monte_sua_historia_stories_v2';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS) || localStorage.getItem('monte_sua_historia_progress_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_USER_PROGRESS,
          ...parsed,
          grammarCorrectByCategory: {
            ...INITIAL_USER_PROGRESS.grammarCorrectByCategory,
            ...(parsed.grammarCorrectByCategory || {}),
          },
          unlockedBadges: parsed.unlockedBadges || parsed.completedAchievements || [],
          unlockedBadgeDetails: parsed.unlockedBadgeDetails || {},
          genresUsed: parsed.genresUsed || [],
        };
      }
      return INITIAL_USER_PROGRESS;
    } catch {
      return INITIAL_USER_PROGRESS;
    }
  });

  const [savedStories, setSavedStories] = useState<SavedStory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STORIES) || localStorage.getItem('monte_sua_historia_stories_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'starter-1',
        title: 'O Mistério da Estação e o Robô Curioso',
        author: 'Professora Mariana & Turma',
        genreId: 'narrativa',
        genreName: 'Narrativa de Aventura / Mistério',
        createdAt: new Date().toLocaleDateString('pt-BR'),
        coverEmoji: '🚂',
        coverBg: 'from-amber-400 to-emerald-500',
        wordCount: 78,
        connectivesCount: 4,
        cards: {
          personagem: {
            id: 'p4',
            category: 'personagem',
            text: 'Um robô que começou a sentir emoções',
            emoji: '🤖',
            color: 'amber',
            accentColor: '#f59e0b',
            bgGradient: 'from-amber-400 to-orange-500',
            helpTip: '',
            connectiveSuggestion: '',
          },
          lugar: {
            id: 'l2',
            category: 'lugar',
            text: 'Uma antiga estação de trem',
            emoji: '🚉',
            color: 'emerald',
            accentColor: '#10b981',
            bgGradient: 'from-emerald-500 to-teal-600',
            helpTip: '',
            connectiveSuggestion: '',
          },
          acao: {
            id: 'a1',
            category: 'acao',
            text: 'Encontrar um objeto misterioso escondido',
            emoji: '🗝️',
            color: 'sky',
            accentColor: '#0ea5e9',
            bgGradient: 'from-sky-500 to-blue-600',
            helpTip: '',
            connectiveSuggestion: '',
          },
          complemento: {
            id: 'c1',
            category: 'complemento',
            text: 'Algo inesperado dentro de uma caixa',
            emoji: '📦',
            color: 'rose',
            accentColor: '#f43f5e',
            bgGradient: 'from-rose-500 to-pink-600',
            helpTip: '',
            connectiveSuggestion: '',
          },
        },
        sections: [
          {
            key: 'introducao',
            title: '1. Introdução',
            content:
              'Certo dia, na antiga estação de trem abandonada, vivia o robô Zé-Luz. Seus olhos piscavam em azul quando sentia curiosidade e em verde quando ficava contente.',
          },
          {
            key: 'desenvolvimento',
            title: '2. Conflito',
            content:
              'De repente, ao inspecionar os trilhos enferrujados, Zé-Luz encontrou um objeto misterioso preso sob a plataforma: uma velha caixa de madeira gravada com engrenagens.',
          },
          {
            key: 'climax',
            title: '3. Clímax',
            content:
              'Com os dedos metálicos trêmulos de tanta emoção, ele puxou a trava. Inesperadamente, a caixa abriu e lá de dentro saltou uma borboleta prateada feita de relógios!',
          },
          {
            key: 'desfecho',
            title: '4. Desfecho',
            content:
              'A borboleta ensinou ao robô que as melhores memórias nunca enferrujam. E assim, a velha estação voltou a se encher de alegria e novas histórias para contar.',
          },
        ],
      },
    ];
  });

  const [currentDrawnCards, setCurrentDrawnCards] = useState<{
    personagem: StoryCard | null;
    lugar: StoryCard | null;
    acao: StoryCard | null;
    complemento: StoryCard | null;
  }>({
    personagem: null,
    lugar: null,
    acao: null,
    complemento: null,
  });

  const [activeTab, setActiveTab] = useState<'draw' | 'workshop' | 'grammar' | 'rewards' | 'library' | 'pedagogical' | 'mural'>('draw');
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    sound.enabled = progress.soundEnabled;
  }, [progress.soundEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
    } catch {
      // storage error
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STORIES, JSON.stringify(savedStories));
    } catch {
      // storage error
    }
  }, [savedStories]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#0ea5e9', '#ec4899', '#8b5cf6', '#ffd700'],
    });
  };

  const dismissBadgeNotification = () => {
    setNewlyUnlockedBadge(null);
  };

  // Central badge checker
  const checkAndUnlockBadges = (currentProgress: UserProgress): UserProgress => {
    let updatedProgress = { ...currentProgress };
    let latestUnlockedBadge: Badge | null = null;
    let totalExtraCoins = 0;
    let totalExtraXp = 0;

    BADGES.forEach((badge) => {
      const alreadyUnlocked = updatedProgress.unlockedBadges?.includes(badge.id);
      if (!alreadyUnlocked) {
        const status = getBadgeProgress(updatedProgress, badge);
        if (status.isUnlocked) {
          // Unlock this badge!
          updatedProgress = {
            ...updatedProgress,
            unlockedBadges: [...(updatedProgress.unlockedBadges || []), badge.id],
            unlockedBadgeDetails: {
              ...(updatedProgress.unlockedBadgeDetails || {}),
              [badge.id]: { unlockedAt: new Date().toLocaleDateString('pt-BR') },
            },
          };
          totalExtraCoins += badge.rewardCoins;
          totalExtraXp += badge.rewardXp;
          latestUnlockedBadge = badge;
        }
      }
    });

    if (latestUnlockedBadge) {
      sound.playFanfare();
      triggerConfetti();
      setNewlyUnlockedBadge(latestUnlockedBadge);

      updatedProgress.coins += totalExtraCoins;
      updatedProgress.xp += totalExtraXp;
    }

    return updatedProgress;
  };

  const addXpAndCoins = (earnedXp: number, earnedCoins: number) => {
    setProgress((prev) => {
      const oldLevel = getLevelInfo(prev.xp).current.level;
      const newXp = prev.xp + earnedXp;
      const newCoins = prev.coins + earnedCoins;
      const newLevel = getLevelInfo(newXp).current.level;

      if (newLevel > oldLevel) {
        sound.playFanfare();
        triggerConfetti();
      } else {
        sound.playCoin();
      }

      const updated = {
        ...prev,
        xp: newXp,
        coins: newCoins,
      };

      return checkAndUnlockBadges(updated);
    });
  };

  const recordGrammarSuccess = (
    moduleKey: string,
    earnedXp: number,
    earnedCoins: number,
    currentStreak: number
  ) => {
    setProgress((prev) => {
      const currentCategoryScore = prev.grammarCorrectByCategory?.[moduleKey] || 0;
      const newTotalCorrect = (prev.grammarTotalCorrect || 0) + 1;
      const newHighestStreak = Math.max(prev.highestStreak || 0, currentStreak);

      const nextProgress: UserProgress = {
        ...prev,
        xp: prev.xp + earnedXp,
        coins: prev.coins + earnedCoins,
        grammarTotalCorrect: newTotalCorrect,
        correctAnswersCount: (prev.correctAnswersCount || 0) + 1,
        highestStreak: newHighestStreak,
        grammarCorrectByCategory: {
          ...(prev.grammarCorrectByCategory || {}),
          [moduleKey]: currentCategoryScore + 1,
        },
      };

      return checkAndUnlockBadges(nextProgress);
    });
  };

  const unlockSticker = (stickerId: string): boolean => {
    const sticker = STICKERS.find((s) => s.id === stickerId);
    if (!sticker || progress.coins < sticker.cost || progress.unlockedStickers.includes(stickerId)) {
      return false;
    }

    sound.playSuccess();
    triggerConfetti();

    setProgress((prev) => {
      const newStickers = [...prev.unlockedStickers, stickerId];
      const nextProgress = {
        ...prev,
        coins: prev.coins - sticker.cost,
        unlockedStickers: newStickers,
      };
      return checkAndUnlockBadges(nextProgress);
    });
    return true;
  };

  const openTreasureChest = (): { sticker: Sticker | null; isNew: boolean; cashback: number } | null => {
    const chestCost = 40;
    if (progress.coins < chestCost) {
      sound.playError();
      return null;
    }

    const randomIndex = Math.floor(Math.random() * STICKERS.length);
    const chosenSticker = STICKERS[randomIndex];
    const alreadyHad = progress.unlockedStickers.includes(chosenSticker.id);
    const cashback = alreadyHad ? 20 : 0;

    sound.playFanfare();
    triggerConfetti();

    setProgress((prev) => {
      const newUnlocked = alreadyHad ? prev.unlockedStickers : [...prev.unlockedStickers, chosenSticker.id];
      const nextProgress: UserProgress = {
        ...prev,
        coins: prev.coins - chestCost + cashback,
        xp: prev.xp + 25,
        unlockedStickers: newUnlocked,
        chestsOpenedCount: (prev.chestsOpenedCount || 0) + 1,
      };

      return checkAndUnlockBadges(nextProgress);
    });

    return {
      sticker: chosenSticker,
      isNew: !alreadyHad,
      cashback,
    };
  };

  const selectAvatar = (avatarId: string) => {
    const avatar = AVATARS.find((a) => a.id === avatarId);
    const userLevel = getLevelInfo(progress.xp).current.level;

    if (avatar && (avatar.unlockedByDefault || progress.unlockedAvatars.includes(avatarId) || userLevel >= avatar.requiredLevel)) {
      sound.playPop();
      setProgress((prev) => ({
        ...prev,
        currentAvatar: avatarId,
        unlockedAvatars: prev.unlockedAvatars.includes(avatarId) ? prev.unlockedAvatars : [...prev.unlockedAvatars, avatarId],
      }));
    }
  };

  const updateStudentName = (name: string) => {
    setProgress((prev) => ({
      ...prev,
      studentName: name.trim() || 'Escritor(a) Mirim',
    }));
  };

  const saveStory = (storyData: Omit<SavedStory, 'id' | 'createdAt'>): string => {
    const newId = 'story_' + Date.now();
    const newStory: SavedStory = {
      ...storyData,
      id: newId,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    setSavedStories((prev) => [newStory, ...prev]);

    sound.playFanfare();
    triggerConfetti();

    setProgress((prev) => {
      const newStoriesCount = prev.storiesWrittenCount + 1;
      const currentGenres = prev.genresUsed || [];
      const updatedGenres = currentGenres.includes(storyData.genreId)
        ? currentGenres
        : [...currentGenres, storyData.genreId];

      const currentMaxWords = Math.max(prev.storiesMaxWords || 0, storyData.wordCount || 0);
      const newConnectivesTotal = (prev.connectivesUsedInStories || 0) + (storyData.connectivesCount || 0);
      const newCollabCount = storyData.isCooperative ? (prev.collaborativeStoriesCount || 0) + 1 : (prev.collaborativeStoriesCount || 0);

      const nextProgress: UserProgress = {
        ...prev,
        storiesWrittenCount: newStoriesCount,
        genresUsed: updatedGenres,
        storiesMaxWords: currentMaxWords,
        connectivesUsedInStories: newConnectivesTotal,
        collaborativeStoriesCount: newCollabCount,
        xp: prev.xp + 150,
        coins: prev.coins + 60,
      };

      return checkAndUnlockBadges(nextProgress);
    });

    return newId;
  };

  const deleteStory = (id: string) => {
    sound.playPop();
    setSavedStories((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleSound = () => {
    const nextState = !progress.soundEnabled;
    sound.enabled = nextState;
    if (nextState) sound.playPop();
    setProgress((prev) => ({
      ...prev,
      soundEnabled: nextState,
    }));
  };

  return (
    <GameContext.Provider
      value={{
        progress,
        savedStories,
        currentDrawnCards,
        setCurrentDrawnCards,
        activeTab,
        setActiveTab,
        addXpAndCoins,
        unlockSticker,
        openTreasureChest,
        selectAvatar,
        updateStudentName,
        saveStory,
        deleteStory,
        toggleSound,
        triggerConfetti,
        recordGrammarSuccess,
        newlyUnlockedBadge,
        dismissBadgeNotification,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
