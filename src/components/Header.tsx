import React, { useState } from 'react';
import {
  Sparkles,
  Coins,
  Volume2,
  VolumeX,
  BookOpen,
  Edit3,
  Dices,
  Trophy,
  GraduationCap,
  Library,
  Flame,
  Check,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getLevelInfo, AVATARS } from '../data/rewards';
import { sound } from '../utils/audio';

export const Header: React.FC = () => {
  const { progress, activeTab, setActiveTab, toggleSound, updateStudentName } = useGame();
  const levelData = getLevelInfo(progress.xp);
  const currentAvatarObj = AVATARS.find((a) => a.id === progress.currentAvatar) || AVATARS[0];

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.studentName);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentName(tempName);
    setIsEditingName(false);
    sound.playPop();
  };

  const unlockedCount = progress.unlockedBadges?.length || 0;
  const navItems = [
    { id: 'draw', label: 'Monte a História', icon: Dices, color: 'text-amber-500', badge: 'Cartas' },
    { id: 'workshop', label: 'Oficina de Escrita', icon: Edit3, color: 'text-blue-500', badge: 'Criar' },
    { id: 'grammar', label: 'Arena de Gramática', icon: Flame, color: 'text-purple-500', badge: 'Desafios' },
    { id: 'mural', label: 'Mural da Turma', icon: Sparkles, color: 'text-orange-500', badge: 'Nuvem 🌟' },
    { id: 'rewards', label: 'Medalhas & Baú', icon: Trophy, color: 'text-yellow-500', badge: `${unlockedCount}🏅` },
    { id: 'library', label: 'Meus Livros', icon: Library, color: 'text-emerald-500', badge: '' },
    { id: 'pedagogical', label: 'Guia do Professor', icon: GraduationCap, color: 'text-slate-500', badge: 'BNCC' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      {/* Top Banner / Player Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 transform -rotate-3 hover:rotate-0 transition-transform">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                  Monte Sua História
                  <span className="text-xs bg-amber-100 text-amber-800 font-sans font-semibold px-2 py-0.5 rounded-full border border-amber-300">
                    3º ao 5º Ano
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Alfabetiza MT • Oficina de Redação & Gramática Lúdica
              </p>
            </div>
          </div>

          {/* Player stats: Avatar, Level, XP bar, Coins, Sound */}
          <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3">
            {/* Student Name & Avatar */}
            <div className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 px-3 py-1.5 rounded-2xl border border-slate-200 transition-colors">
              <button
                onClick={() => {
                  setActiveTab('rewards');
                  sound.playPop();
                }}
                title="Trocar avatar no Baú de Recompensas"
                className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-lg hover:scale-110 transition-transform cursor-pointer"
              >
                {currentAvatarObj.emoji}
              </button>

              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    maxLength={20}
                    autoFocus
                    className="text-xs font-bold bg-white border border-amber-400 rounded-lg px-2 py-0.5 outline-hidden w-28 text-slate-800"
                  />
                  <button
                    type="submit"
                    className="p-1 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div
                  onClick={() => setIsEditingName(true)}
                  className="cursor-pointer group flex items-center gap-1"
                  title="Clique para editar seu nome de escritor(a)"
                >
                  <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate">
                    {progress.studentName}
                  </span>
                  <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-amber-600 transition-colors" />
                </div>
              )}
            </div>

            {/* Level & XP Gauge */}
            <div
              onClick={() => {
                setActiveTab('rewards');
                sound.playPop();
              }}
              className="cursor-pointer flex items-center gap-2 bg-amber-50 hover:bg-amber-100/80 px-3 py-1.5 rounded-2xl border border-amber-200 transition-colors"
              title={`${progress.xp} XP acumulados. Próximo nível em ${levelData.next ? levelData.next.minXp - progress.xp : 0} XP`}
            >
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-extrabold text-amber-900 flex items-center gap-0.5">
                    {levelData.current.badge} Nív. {levelData.current.level}
                  </span>
                  <span className="text-[10px] text-amber-700 hidden md:inline">
                    ({levelData.current.title})
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-20 sm:w-24 bg-amber-200 h-2 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${levelData.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Coins Counter */}
            <button
              onClick={() => {
                setActiveTab('rewards');
                sound.playPop();
              }}
              className="flex items-center gap-1.5 bg-yellow-50 hover:bg-yellow-100 border border-yellow-300 text-yellow-900 font-extrabold text-xs px-3 py-1.5 rounded-2xl cursor-pointer transition-colors shadow-2xs"
              title="Moedas do Conhecimento para abrir Baús e Colecionáveis!"
            >
              <Coins className="w-4 h-4 text-amber-500 animate-bounce" />
              <span>{progress.coins}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-2xl border transition-colors cursor-pointer ${
                progress.soundEnabled
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100'
              }`}
              title={progress.soundEnabled ? 'Efeitos sonoros ativados' : 'Efeitos sonoros desativados'}
            >
              {progress.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playPop();
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : item.color}`} />
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-slate-200/70 text-slate-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
