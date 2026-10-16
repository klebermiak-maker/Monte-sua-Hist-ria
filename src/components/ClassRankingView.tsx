import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  BookOpen,
  Flame,
  Users,
  Search,
  Filter,
  ArrowUpRight,
  Heart,
  MessageSquarePlus,
  Send,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Star,
  ExternalLink,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import {
  ClassRankingItem,
  CheerMessage,
  getClassId,
  COLLECTIVE_BADGES,
} from '../data/classRanking';
import {
  getStoredClasses,
  getStoredCheers,
  getUserContributions,
  addCheer,
  likeCheer,
  subscribeToClassRanking,
  getSchoolWideStats,
  resetClassRankingToDefaults,
} from '../services/classRankingService';
import { getTurmaColor, GRADE_OPTIONS, SchoolGrade, SchoolClassLetter } from '../data/studentProfile';
import { StudentProfileModal } from './StudentProfileModal';

type SortCategory = 'total' | 'writing' | 'grammar' | 'streak';
type GradeFilter = 'all' | '3' | '4' | '5';

export const ClassRankingView: React.FC = () => {
  const { progress, studentTurmaLabel, setActiveTab, triggerConfetti } = useGame();

  const [classes, setClasses] = useState<ClassRankingItem[]>(() => getStoredClasses());
  const [cheers, setCheers] = useState<CheerMessage[]>(() => getStoredCheers());
  const [userContribs, setUserContribs] = useState(() => getUserContributions());

  const [selectedGrade, setSelectedGrade] = useState<GradeFilter>('all');
  const [sortCategory, setSortCategory] = useState<SortCategory>('total');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // Cheer form state
  const [cheerText, setCheerText] = useState('');
  const [cheerEmoji, setCheerEmoji] = useState('👏');
  const [cheerTargetClass, setCheerTargetClass] = useState<string>('4-B');
  const [cheerSuccessMsg, setCheerSuccessMsg] = useState(false);

  // Profile modal toggle
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Listen to changes in class rankings (e.g. from activities)
  useEffect(() => {
    const unsubscribe = subscribeToClassRanking(() => {
      setClasses(getStoredClasses());
      setCheers(getStoredCheers());
      setUserContribs(getUserContributions());
    });
    return unsubscribe;
  }, []);

  // Current user's class ID
  const currentUserClassId = getClassId(progress.studentGrade, progress.studentClass);
  const currentUserClass = classes.find((c) => c.id === currentUserClassId) || classes[0];
  const currentUserPersonalContrib = userContribs[currentUserClassId] || {
    totalPoints: 0,
    grammarPoints: 0,
    writingPoints: 0,
    storiesCount: 0,
    grammarQuestsCount: 0,
  };

  // Filter & sort classes
  const sortedClasses = useMemo(() => {
    return [...classes]
      .filter((c) => {
        if (selectedGrade !== 'all' && c.grade !== selectedGrade) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            c.label.toLowerCase().includes(q) ||
            c.teacher.toLowerCase().includes(q) ||
            c.motto.toLowerCase().includes(q) ||
            c.mascotName.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortCategory === 'total') return b.totalPoints - a.totalPoints;
        if (sortCategory === 'writing') return b.writingPoints - a.writingPoints;
        if (sortCategory === 'grammar') return b.grammarPoints - a.grammarPoints;
        if (sortCategory === 'streak') return b.collaborativeStreak - a.collaborativeStreak;
        return 0;
      });
  }, [classes, selectedGrade, sortCategory, searchQuery]);

  // Overall ranks (computed against all 15 classes for total points)
  const classRanksMap = useMemo(() => {
    const map = new Map<string, number>();
    const allSorted = [...classes].sort((a, b) => b.totalPoints - a.totalPoints);
    allSorted.forEach((c, idx) => map.set(c.id, idx + 1));
    return map;
  }, [classes]);

  // Top 3 Podium (from current filtered view or overall)
  const podiumTop3 = useMemo(() => {
    return sortedClasses.slice(0, 3);
  }, [sortedClasses]);

  // School-wide stats
  const schoolStats = useMemo(() => getSchoolWideStats(classes), [classes]);

  // Handle cheer submission
  const handleSendCheer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cheerText.trim()) return;

    sound.playSuccess();
    triggerConfetti();

    addCheer(
      cheerTargetClass,
      progress.studentName || 'Colega de Escola',
      studentTurmaLabel,
      cheerText.trim(),
      cheerEmoji
    );

    setCheerText('');
    setCheerSuccessMsg(true);
    setTimeout(() => setCheerSuccessMsg(false), 3500);
  };

  const handleLikeCheer = (cheerId: string) => {
    sound.playPop();
    likeCheer(cheerId);
  };

  // Preset cheer phrases for kids
  const CHEER_PRESETS = [
    '👏 Parabéns pela dedicação da turma toda!',
    '🚀 Vamos juntos rumo à grande celebração!',
    '🌟 Vocês escrevem histórias incríveis!',
    '🔥 Que show na pontuação de gramática!',
    '🤝 Nossa escola unida pelo Alfabetiza MT!',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-amber-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold border border-white/30">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
              <span>Alfabetiza MT • Cooperação Escolar & Gamificação</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-xs">
              🏆 Ranking Cooperativo de Turmas
            </h1>

            <p className="text-sm sm:text-base text-amber-100 font-medium leading-relaxed">
              Descubra as salas do <strong className="text-white">3º ao 5º Ano (A ao E)</strong> com maior pontuação acumulada nas atividades de gramática e escrita! Aqui todos pontuam juntos para levar sua turma ao pódio!
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-xl bg-black/20 font-semibold backdrop-blur-xs flex items-center gap-1.5">
                <span>📚 15 Salas Participantes</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-black/20 font-semibold backdrop-blur-xs flex items-center gap-1.5">
                <span>✨ Gramática + Redação</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-black/20 font-semibold backdrop-blur-xs flex items-center gap-1.5">
                <span>🤝 Pontuação 100% Coletiva</span>
              </span>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('grammar');
              }}
              className="px-4 py-3 bg-white text-amber-900 rounded-2xl font-black text-xs sm:text-sm shadow-md hover:bg-amber-50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Pontuar na Gramática (+pts)</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('workshop');
              }}
              className="px-4 py-3 bg-amber-950/40 border border-white/30 text-white rounded-2xl font-black text-xs sm:text-sm hover:bg-amber-950/60 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-yellow-300" />
              <span>Escrever Nova História (+pts)</span>
            </button>
          </div>
        </div>
      </div>

      {/* School-Wide Collective Target Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-indigo-700/50 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌟</span>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-indigo-100 uppercase">
                Grande Meta Coletiva da Escola
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                100.000 pts
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Quando todas as 15 turmas somarem juntas 100.000 pontos em gramática e escrita, a escola inteira conquista a <strong className="text-yellow-400">Estrela Dourada do Alfabetiza MT</strong> e desbloqueia o Livro de Ouro!
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              {schoolStats.totalPoints.toLocaleString('pt-BR')} <span className="text-xs font-semibold text-slate-400">/ 100.000 pts</span>
            </div>
            <div className="text-xs font-semibold text-indigo-300">
              {schoolStats.totalStories} histórias • {schoolStats.totalGrammarQuests} desafios resolvidos
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-200 mb-1.5">
            <span>Progresso da Escola Unida</span>
            <span className="text-amber-300 font-extrabold">{schoolStats.progressPercent}% Concluído</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3.5 p-0.5 overflow-hidden border border-indigo-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-all duration-1000 shadow-sm"
              style={{ width: `${schoolStats.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Student's Current Turma Banner ("Minha Sala") */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-100 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-md shrink-0 border-2 border-white">
              {currentUserClass.mascotEmoji}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-200">
                  🎒 Sua Sala Atual
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {currentUserClass.teacher}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>{currentUserClass.label}</span>
                <span className="text-sm font-semibold text-slate-500">
                  • "{currentUserClass.mascotName}"
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 italic">
                "{currentUserClass.motto}"
              </p>
            </div>
          </div>

          {/* Stats for user class */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Posição Geral</div>
              <div className="text-lg font-black text-amber-600 flex items-center justify-center gap-1">
                <span>🏆 #{classRanksMap.get(currentUserClass.id) || 1}</span>
              </div>
            </div>

            <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 text-center">
              <div className="text-[10px] font-bold text-purple-700 uppercase">Gramática</div>
              <div className="text-lg font-black text-purple-900">
                {currentUserClass.grammarPoints.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200 text-center">
              <div className="text-[10px] font-bold text-blue-700 uppercase">Escrita</div>
              <div className="text-lg font-black text-blue-900">
                {currentUserClass.writingPoints.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-300 text-center">
              <div className="text-[10px] font-bold text-amber-800 uppercase">Total da Turma</div>
              <div className="text-lg font-black text-amber-700">
                {currentUserClass.totalPoints.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Contribution highlight */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-slate-50/80 -mx-6 -mb-6 px-6 py-3.5 rounded-b-3xl">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-base">🤝</span>
            <span>
              <strong>{progress.studentName}:</strong> você já contribuiu com{' '}
              <strong className="text-amber-700 font-extrabold">
                {currentUserPersonalContrib.totalPoints} pontos
              </strong>{' '}
              ({currentUserPersonalContrib.storiesCount} histórias e {currentUserPersonalContrib.grammarQuestsCount} desafios) para o {currentUserClass.label}!
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                sound.playPop();
                setShowProfileModal(true);
              }}
              className="text-amber-700 hover:text-amber-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Trocar de Sala</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Podium (Pódio dos Campeões) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Pódio dos Campeões • Top 3
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Classificação em tempo real
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* 2nd Place */}
          {podiumTop3[1] && (
            <div
              onClick={() => {
                sound.playPop();
                setSelectedClassId(podiumTop3[1].id);
              }}
              className="cursor-pointer bg-gradient-to-b from-slate-100 to-slate-200/80 rounded-3xl p-5 border-2 border-slate-300 shadow-md flex flex-col items-center text-center relative hover:scale-[1.02] transition-transform order-2 md:order-1"
            >
              <div className="absolute -top-4 w-9 h-9 rounded-full bg-slate-300 text-slate-800 font-black flex items-center justify-center border-2 border-white shadow-sm text-sm">
                🥈 2º
              </div>
              <div className="text-3xl mt-2 mb-1">{podiumTop3[1].mascotEmoji}</div>
              <h3 className="font-extrabold text-slate-800 text-base">{podiumTop3[1].label}</h3>
              <p className="text-xs text-slate-600 font-medium">{podiumTop3[1].teacher}</p>
              <div className="mt-3 bg-white px-3 py-1 rounded-full text-slate-800 font-black text-sm border border-slate-300">
                {podiumTop3[1].totalPoints.toLocaleString('pt-BR')} pts
              </div>
              <div className="flex gap-2 text-[11px] text-slate-500 mt-2 font-semibold">
                <span>⚡ {podiumTop3[1].grammarPoints} gram</span>
                <span>•</span>
                <span>✍️ {podiumTop3[1].writingPoints} escr</span>
              </div>
            </div>
          )}

          {/* 1st Place (Gold) */}
          {podiumTop3[0] && (
            <div
              onClick={() => {
                sound.playFanfare();
                triggerConfetti();
                setSelectedClassId(podiumTop3[0].id);
              }}
              className="cursor-pointer bg-gradient-to-b from-amber-100 via-amber-50 to-orange-100/90 rounded-3xl p-6 border-2 border-amber-400 shadow-lg flex flex-col items-center text-center relative hover:scale-[1.03] transition-transform order-1 md:order-2 md:-translate-y-2 ring-4 ring-amber-300/40"
            >
              <div className="absolute -top-5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black flex items-center gap-1 border-2 border-white shadow-md text-sm">
                <span>👑 1º Lugar Ouro</span>
              </div>
              <div className="text-4xl mt-3 mb-1 animate-bounce-subtle">{podiumTop3[0].mascotEmoji}</div>
              <h3 className="font-black text-amber-950 text-lg">{podiumTop3[0].label}</h3>
              <p className="text-xs text-amber-800 font-semibold">{podiumTop3[0].teacher}</p>
              <div className="mt-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full font-black text-base shadow-sm">
                {podiumTop3[0].totalPoints.toLocaleString('pt-BR')} pts
              </div>
              <div className="flex gap-2 text-xs text-amber-900 mt-2 font-bold">
                <span>⚡ {podiumTop3[0].grammarPoints} gramática</span>
                <span>•</span>
                <span>✍️ {podiumTop3[0].writingPoints} escrita</span>
              </div>
              <div className="mt-2 text-[10px] font-bold text-amber-700 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                {podiumTop3[0].storiesCount} histórias escritas • {podiumTop3[0].studentCount} alunos
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {podiumTop3[2] && (
            <div
              onClick={() => {
                sound.playPop();
                setSelectedClassId(podiumTop3[2].id);
              }}
              className="cursor-pointer bg-gradient-to-b from-orange-50 to-amber-100/70 rounded-3xl p-5 border-2 border-orange-300 shadow-md flex flex-col items-center text-center relative hover:scale-[1.02] transition-transform order-3"
            >
              <div className="absolute -top-4 w-9 h-9 rounded-full bg-orange-300 text-orange-950 font-black flex items-center justify-center border-2 border-white shadow-sm text-sm">
                🥉 3º
              </div>
              <div className="text-3xl mt-2 mb-1">{podiumTop3[2].mascotEmoji}</div>
              <h3 className="font-extrabold text-slate-800 text-base">{podiumTop3[2].label}</h3>
              <p className="text-xs text-slate-600 font-medium">{podiumTop3[2].teacher}</p>
              <div className="mt-3 bg-white px-3 py-1 rounded-full text-slate-800 font-black text-sm border border-orange-300">
                {podiumTop3[2].totalPoints.toLocaleString('pt-BR')} pts
              </div>
              <div className="flex gap-2 text-[11px] text-slate-500 mt-2 font-semibold">
                <span>⚡ {podiumTop3[2].grammarPoints} gram</span>
                <span>•</span>
                <span>✍️ {podiumTop3[2].writingPoints} escr</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Category Controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Grade filter buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                sound.playPop();
                setSelectedGrade('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                selectedGrade === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas as Salas (15)
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setSelectedGrade('3');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                selectedGrade === '3'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span>🌱 3º Ano (A-E)</span>
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setSelectedGrade('4');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                selectedGrade === '4'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <span>🚀 4º Ano (A-E)</span>
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setSelectedGrade('5');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                selectedGrade === '5'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
            >
              <span>🌟 5º Ano (A-E)</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar turma, professor(a)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>
        </div>

        {/* Category sorting tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-400 shrink-0">Ordenar por:</span>

          <button
            onClick={() => {
              sound.playPop();
              setSortCategory('total');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all ${
              sortCategory === 'total'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Pontuação Geral (Gramática + Escrita)</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setSortCategory('writing');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all ${
              sortCategory === 'writing'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>✍️ Campeões da Escrita</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setSortCategory('grammar');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all ${
              sortCategory === 'grammar'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>⚡ Mestres da Gramática</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setSortCategory('streak');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all ${
              sortCategory === 'streak'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>🤝 Mais Colaborativas</span>
          </button>
        </div>
      </div>

      {/* Main Ranking List */}
      <div className="space-y-3">
        {sortedClasses.map((item, index) => {
          const isUserClass = item.id === currentUserClassId;
          const style = getTurmaColor(item.grade);
          const maxPoints = sortedClasses[0]?.totalPoints || 1;
          const grammarPercent = Math.round((item.grammarPoints / item.totalPoints) * 100);
          const writingPercent = 100 - grammarPercent;
          const isSelected = selectedClassId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => {
                sound.playPop();
                setSelectedClassId(isSelected ? null : item.id);
              }}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer relative ${
                isUserClass
                  ? 'border-2 border-amber-400 bg-amber-50/40 shadow-md ring-2 ring-amber-300/30'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Position, Mascot & Class details */}
                <div className="flex items-center gap-3.5">
                  {/* Position Badge */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      index === 0
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : index === 1
                        ? 'bg-slate-300 text-slate-800'
                        : index === 2
                        ? 'bg-orange-300 text-orange-950'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {index + 1}º
                  </div>

                  {/* Mascot emoji */}
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                    {item.mascotEmoji}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 text-base sm:text-lg">
                        {item.label}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${style.badgeBg} ${style.badgeText} ${style.badgeBorder}`}
                      >
                        {item.grade}º Ano • Sala {item.classLetter}
                      </span>
                      {isUserClass && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                          Sua Sala 🎒
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                      <span>{item.teacher}</span>
                      <span>•</span>
                      <span className="text-slate-400 italic">"{item.mascotName}"</span>
                      <span>•</span>
                      <span>{item.studentCount} alunos</span>
                    </div>
                  </div>
                </div>

                {/* Right: Points breakdown & dual bar */}
                <div className="flex flex-col sm:items-end gap-1.5 shrink-0 min-w-[220px]">
                  <div className="flex items-baseline justify-between sm:justify-end gap-2">
                    <span className="text-xs text-slate-500 font-bold uppercase sm:hidden">
                      Pontos Acumulados:
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900">
                      {item.totalPoints.toLocaleString('pt-BR')}{' '}
                      <span className="text-xs font-bold text-slate-400">pts</span>
                    </span>
                  </div>

                  {/* Dual progress bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex border border-slate-200">
                    <div
                      className="bg-purple-500 h-full transition-all"
                      style={{ width: `${grammarPercent}%` }}
                      title={`Gramática: ${item.grammarPoints} pts (${grammarPercent}%)`}
                    />
                    <div
                      className="bg-blue-500 h-full transition-all"
                      style={{ width: `${writingPercent}%` }}
                      title={`Escrita: ${item.writingPoints} pts (${writingPercent}%)`}
                    />
                  </div>

                  <div className="flex items-center justify-between w-full text-[11px] font-semibold text-slate-500">
                    <span className="text-purple-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                      {item.grammarPoints} gramática
                    </span>
                    <span className="text-blue-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                      {item.writingPoints} escrita
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges preview row */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">
                    Conquistas da Sala:
                  </span>
                  {item.collectiveBadges.map((b) => (
                    <span
                      key={b.id}
                      title={`${b.name}: ${b.description}`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold border border-slate-200/80 transition-colors"
                    >
                      <span>{b.icon}</span>
                      <span>{b.name}</span>
                    </span>
                  ))}
                </div>

                <div className="text-[11px] text-amber-700 font-bold hover:underline flex items-center gap-1">
                  <span>{isSelected ? 'Ocultar Detalhes' : 'Ver Detalhes da Turma'}</span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transform transition-transform ${isSelected ? 'rotate-90' : ''}`}
                  />
                </div>
              </div>

              {/* Expanded Card Details */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-200 space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-purple-50 p-3.5 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs mb-1">
                        <Flame className="w-4 h-4 text-purple-600" />
                        <span>Desafios de Gramática</span>
                      </div>
                      <div className="text-xl font-black text-purple-900">
                        {item.grammarQuestsCount}{' '}
                        <span className="text-xs font-semibold text-purple-700">concluídos</span>
                      </div>
                      <p className="text-[11px] text-purple-800 mt-1">
                        Pontuação de exclamação, concordância, ortografia (M antes de P/B) e substantivos.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs mb-1">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span>Oficina de Escrita</span>
                      </div>
                      <div className="text-xl font-black text-blue-900">
                        {item.storiesCount}{' '}
                        <span className="text-xs font-semibold text-blue-700">histórias criadas</span>
                      </div>
                      <p className="text-[11px] text-blue-800 mt-1">
                        Contos de fadas, fábulas com moral, aventuras pantaneiras e histórias em quadrinhos.
                      </p>
                    </div>

                    <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs mb-1">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span>Sequência Colaborativa</span>
                      </div>
                      <div className="text-xl font-black text-emerald-900">
                        {item.collaborativeStreak}{' '}
                        <span className="text-xs font-semibold text-emerald-700">dias ativos</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 mt-1">
                        Meta semanal: {item.weeklyGoalCurrent} / {item.weeklyGoalTarget} pts atingidos!
                      </p>
                    </div>
                  </div>

                  {/* Recent Activity Timeline */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Últimas Contribuições da Turma:</span>
                    </h4>

                    <div className="space-y-2">
                      {item.recentActivities && item.recentActivities.length > 0 ? (
                        item.recentActivities.slice(0, 4).map((act) => (
                          <div
                            key={act.id}
                            className="flex items-center justify-between text-xs bg-white px-3 py-2 rounded-lg border border-slate-200"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {act.type === 'grammar' ? '⚡' : act.type === 'writing' ? '✍️' : '🤝'}
                              </span>
                              <span>
                                <strong className="text-slate-800">{act.studentName || 'Aluno'}:</strong>{' '}
                                <span className="text-slate-600">{act.text}</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-right shrink-0">
                              <span className="font-extrabold text-emerald-600">
                                +{act.pointsAdded} pts
                              </span>
                              <span className="text-[10px] text-slate-400">{act.timeAgo}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic">
                          Nenhuma atividade recente registrada nesta sala ainda.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Collaborative Cheers Section ("Mural de Torcida & Incentivo") */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-800 text-xs font-bold uppercase tracking-wide">
              <span>📣 Espírito de Equipe</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              Mural de Torcida & Incentivo Coletivo
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Envie uma mensagem animadora para sua sala ou elogie o esforço das outras turmas da escola!
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900 shadow-2xs">
            <span>❤️ {cheers.length} mensagens compartilhadas</span>
          </div>
        </div>

        {/* Send Cheer Form */}
        <form onSubmit={handleSendCheer} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-48 shrink-0">
              <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                Para qual sala?
              </label>
              <select
                value={cheerTargetClass}
                onChange={(e) => setCheerTargetClass(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.teacher})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-32 shrink-0">
              <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                Emoji da Torcida
              </label>
              <div className="flex items-center gap-1">
                {['👏', '🔥', '🚀', '🌟', '💖'].map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setCheerEmoji(em)}
                    className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-transform cursor-pointer ${
                      cheerEmoji === em
                        ? 'bg-amber-100 border-2 border-amber-500 scale-110'
                        : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                Sua mensagem de incentivo
              </label>
              <input
                type="text"
                value={cheerText}
                onChange={(e) => setCheerText(e.target.value)}
                placeholder="Ex: Parabéns turma! Vocês arrasaram nas histórias!"
                maxLength={140}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:self-end">
              <button
                type="submit"
                disabled={!cheerText.trim()}
                className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Torcida</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sugestões rápidas:</span>
            {CHEER_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCheerText(preset)}
                className="text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200 font-semibold cursor-pointer transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>

          {cheerSuccessMsg && (
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Grito de torcida publicado com sucesso no mural da escola!</span>
            </div>
          )}
        </form>

        {/* Cheers Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {cheers.map((ch) => {
            const targetClassObj = classes.find((c) => c.id === ch.classId);
            return (
              <div
                key={ch.id}
                className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      Para: {targetClassObj?.label || 'Turma'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {ch.timestamp}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 pt-1">
                    "{ch.message}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <div className="flex items-center gap-1 text-slate-600 font-bold">
                    <span>{ch.emoji}</span>
                    <span>{ch.senderName}</span>
                    <span className="text-slate-400">({ch.senderTurma})</span>
                  </div>

                  <button
                    onClick={() => handleLikeCheer(ch.id)}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-black cursor-pointer bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md transition-colors"
                  >
                    <Heart className="w-3 h-3 fill-rose-500" />
                    <span>{ch.likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pedagogical Alignment Box (Alfabetiza MT) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-amber-400" />
          <h3 className="font-extrabold text-slate-100 text-base">
            Como funciona a pontuação pedagógica do Ranking de Turmas?
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          O ranking de turmas foi desenvolvido com base nas diretrizes do programa <strong>Alfabetiza MT</strong> (SEDUC Governo de Mato Grosso) e na BNCC para o Ensino Fundamental I (3º ao 5º Ano). Seu objetivo é promover o <em>aprendizado cooperativo</em>, valorizando o progresso de toda a sala:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <strong className="text-purple-300 block mb-1">⚡ Arena de Gramática:</strong>
            <span className="text-slate-300">
              Cada acerto em pontuação, concordância verbal/nominal, classes de palavras e ortografia soma de 20 a 50 pontos para a sala.
            </span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <strong className="text-blue-300 block mb-1">✍️ Oficina de Escrita:</strong>
            <span className="text-slate-300">
              Cada história finalizada com clímax, conectivos e revisão autoral soma 150 a 250 pontos para a turma.
            </span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <strong className="text-amber-300 block mb-1">🤝 Metas Coletivas:</strong>
            <span className="text-slate-300">
              Incentiva alunos com mais facilidade a apoiarem os colegas nas leituras e na revisão de parágrafos.
            </span>
          </div>
        </div>
      </div>

      {/* Student Profile Modal for changing room */}
      <StudentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};
