import React, { useState } from 'react';
import {
  Trophy,
  Coins,
  Sparkles,
  Lock,
  Check,
  PackageOpen,
  Award,
  Crown,
  Gift,
  HelpCircle,
  Filter,
  CheckCircle2,
  Calendar,
  Flame,
  BookOpen,
  PenTool,
  Zap,
  Star,
  X,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import {
  STICKERS,
  AVATARS,
  BADGES,
  Badge,
  BadgeCategory,
  BadgeTier,
  getBadgeProgress,
  getLevelInfo,
  Sticker,
} from '../data/rewards';
import { sound } from '../utils/audio';

export const RewardsView: React.FC = () => {
  const {
    progress,
    openTreasureChest,
    unlockSticker,
    selectAvatar,
    triggerConfetti,
  } = useGame();

  const [activeRewardsTab, setActiveRewardsTab] = useState<'badges' | 'chest' | 'avatars'>('badges');
  const [badgeCategoryFilter, setBadgeCategoryFilter] = useState<'all' | BadgeCategory>('all');
  const [onlyUnlocked, setOnlyUnlocked] = useState(false);
  const [inspectingBadge, setInspectingBadge] = useState<Badge | null>(null);

  const [isOpeningChest, setIsOpeningChest] = useState(false);
  const [chestPrize, setChestPrize] = useState<{
    sticker: Sticker | null;
    isNew: boolean;
    cashback: number;
  } | null>(null);

  const levelData = getLevelInfo(progress.xp);

  // Badge calculations
  const totalBadges = BADGES.length;
  const unlockedBadgesCount = BADGES.filter((b) => getBadgeProgress(progress, b).isUnlocked).length;
  const badgeProgressPercent = Math.round((unlockedBadgesCount / totalBadges) * 100);

  const filteredBadges = BADGES.filter((badge) => {
    if (badgeCategoryFilter !== 'all' && badge.category !== badgeCategoryFilter) {
      return false;
    }
    if (onlyUnlocked && !getBadgeProgress(progress, badge).isUnlocked) {
      return false;
    }
    return true;
  });

  const handleOpenChest = () => {
    if (progress.coins < 40) {
      sound.playError();
      alert('Você precisa de 40 Moedas do Conhecimento para abrir o Baú do Tesouro!');
      return;
    }

    sound.playPop();
    setIsOpeningChest(true);
    setChestPrize(null);

    setTimeout(() => {
      const prize = openTreasureChest();
      setIsOpeningChest(false);
      setChestPrize(prize);
    }, 800);
  };

  const getTierDetails = (tier: BadgeTier) => {
    switch (tier) {
      case 'platina':
        return {
          name: 'Platina / Diamante',
          borderColor: 'border-purple-400 dark:border-purple-500',
          bgRing: 'ring-4 ring-purple-400/20',
          gradient: 'from-purple-500 via-indigo-500 to-cyan-400',
          badgeBg: 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white',
          glow: 'shadow-lg shadow-purple-500/20',
          label: '💎 Platina',
        };
      case 'ouro':
        return {
          name: 'Ouro Real',
          borderColor: 'border-amber-400',
          bgRing: 'ring-4 ring-amber-400/20',
          gradient: 'from-amber-400 via-yellow-400 to-orange-400',
          badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-black',
          glow: 'shadow-lg shadow-amber-500/25',
          label: '🥇 Ouro',
        };
      case 'prata':
        return {
          name: 'Prata Reluzente',
          borderColor: 'border-slate-300',
          bgRing: 'ring-4 ring-slate-300/20',
          gradient: 'from-slate-300 to-slate-400',
          badgeBg: 'bg-slate-200 text-slate-800 font-bold',
          glow: 'shadow-md shadow-slate-400/15',
          label: '🥈 Prata',
        };
      case 'bronze':
      default:
        return {
          name: 'Bronze Heroico',
          borderColor: 'border-amber-700/60',
          bgRing: 'ring-4 ring-amber-700/10',
          gradient: 'from-amber-600 to-amber-800',
          badgeBg: 'bg-amber-100 text-amber-900 font-bold',
          glow: 'shadow-md shadow-amber-900/10',
          label: '🥉 Bronze',
        };
    }
  };

  const getRarityBadge = (rarity: Sticker['rarity']) => {
    switch (rarity) {
      case 'lendaria':
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black border border-amber-300 shadow-xs animate-pulse';
      case 'epica':
        return 'bg-purple-100 text-purple-900 font-bold border border-purple-300';
      case 'rara':
        return 'bg-sky-100 text-sky-900 font-bold border border-sky-300';
      default:
        return 'bg-slate-100 text-slate-700 font-semibold border border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Section: Player Level & Nav Sub-Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Level Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-3xl shadow-md text-white">
              {levelData.current.badge}
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-600">
                Nível do Escritor Mirim
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Nível {levelData.current.level}: {levelData.current.title}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span>{progress.xp} XP Acumulados</span>
                <span>•</span>
                <span className="text-amber-600 font-bold flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  {progress.coins} Moedas do Conhecimento
                </span>
              </div>
            </div>
          </div>

          {/* Sub-Tabs for Rewards View */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 w-full lg:w-auto">
            <button
              onClick={() => {
                sound.playPop();
                setActiveRewardsTab('badges');
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeRewardsTab === 'badges'
                  ? 'bg-slate-900 text-white shadow-md scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Medalhas ({unlockedBadgesCount}/{totalBadges})</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setActiveRewardsTab('chest');
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeRewardsTab === 'chest'
                  ? 'bg-slate-900 text-white shadow-md scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <PackageOpen className="w-4 h-4 text-rose-400" />
              <span>Baú & Figurinhas</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setActiveRewardsTab('avatars');
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeRewardsTab === 'avatars'
                  ? 'bg-slate-900 text-white shadow-md scale-102'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Crown className="w-4 h-4 text-yellow-400" />
              <span>Avatares</span>
            </button>
          </div>
        </div>

        {/* Global Level progress bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 font-medium">
            Progresso para o próximo nível ({levelData.next ? `${levelData.next.minXp} XP` : 'Nível Máximo!'}):
          </span>
          <div className="flex-1 max-w-md bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${levelData.progressPercent}%` }}
            />
          </div>
          <span className="font-extrabold text-amber-700">{levelData.progressPercent}%</span>
        </div>
      </div>

      {/* ================= TAB 1: BADGES (MEDALHAS VIRTUAIS) ================= */}
      {activeRewardsTab === 'badges' && (
        <div className="space-y-6">
          {/* Badges Hero Summary Banner */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
                  <Trophy className="w-3.5 h-3.5" />
                  Galeria de Conquistas do Aluno
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
                  Medalhas Virtuais de Escrita & Gramática
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                  Desbloqueie medalhas ao produzir textos, usar conectivos, dominar a pontuação e vencer desafios na Arena! Cada medalha garante XP e Moedas.
                </p>
              </div>

              {/* Progress Summary Card */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center min-w-[200px] w-full md:w-auto">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block mb-1">
                  Total de Medalhas
                </span>
                <div className="text-3xl font-black text-white flex items-center justify-center gap-1.5">
                  <span>{unlockedBadgesCount}</span>
                  <span className="text-slate-400 text-lg">/ {totalBadges}</span>
                </div>
                <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mt-3 p-0.5">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-yellow-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${badgeProgressPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-amber-200 mt-1 block">
                  {badgeProgressPercent}% Completado
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    sound.playPop();
                    setBadgeCategoryFilter('all');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    badgeCategoryFilter === 'all'
                      ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  Todas ({BADGES.length})
                </button>

                <button
                  onClick={() => {
                    sound.playPop();
                    setBadgeCategoryFilter('escrita');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    badgeCategoryFilter === 'escrita'
                      ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Desafios de Escrita (8)</span>
                </button>

                <button
                  onClick={() => {
                    sound.playPop();
                    setBadgeCategoryFilter('gramatica');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    badgeCategoryFilter === 'gramatica'
                      ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Desafios de Gramática (7)</span>
                </button>

                <button
                  onClick={() => {
                    sound.playPop();
                    setBadgeCategoryFilter('especial');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    badgeCategoryFilter === 'especial'
                      ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Especiais (3)</span>
                </button>
              </div>

              {/* Toggle Only Unlocked */}
              <button
                onClick={() => {
                  sound.playPop();
                  setOnlyUnlocked(!onlyUnlocked);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  onlyUnlocked
                    ? 'bg-emerald-500 text-white border-emerald-400'
                    : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/20'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apenas Conquistadas</span>
              </button>
            </div>
          </div>

          {/* Badges Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBadges.map((badge) => {
              const status = getBadgeProgress(progress, badge);
              const tierInfo = getTierDetails(badge.tier);
              const unlockedDetails = progress.unlockedBadgeDetails?.[badge.id];

              return (
                <div
                  key={badge.id}
                  onClick={() => {
                    sound.playPop();
                    setInspectingBadge(badge);
                  }}
                  className={`bg-white rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between relative group hover:-translate-y-1 ${
                    status.isUnlocked
                      ? `${tierInfo.borderColor} ${tierInfo.glow} shadow-sm`
                      : 'border-slate-200 bg-slate-50/60 opacity-80 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Header: Tier tag & Category */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${tierInfo.badgeBg}`}>
                        {tierInfo.label}
                      </span>

                      <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {badge.category === 'escrita'
                          ? '✍️ Escrita'
                          : badge.category === 'gramatica'
                          ? '⚡ Gramática'
                          : '🌟 Especial'}
                      </span>
                    </div>

                    {/* Medal Graphic & Title */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border shrink-0 transition-transform group-hover:scale-110 ${
                          status.isUnlocked
                            ? `bg-gradient-to-tr ${tierInfo.gradient} border-white text-white`
                            : 'bg-slate-200 border-slate-300 grayscale opacity-40'
                        }`}
                      >
                        {badge.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-1 group-hover:text-amber-600 transition-colors">
                          {badge.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & Footer */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100 mt-2">
                    {/* Progress details */}
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className={status.isUnlocked ? 'text-emerald-700' : 'text-slate-500'}>
                        {status.isUnlocked
                          ? '✓ Concluído!'
                          : `${status.current} de ${status.max} ${badge.unit}`}
                      </span>
                      <span className="text-slate-400">{status.percent}%</span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          status.isUnlocked
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-amber-400 to-orange-400'
                        }`}
                        style={{ width: `${status.percent}%` }}
                      />
                    </div>

                    {/* Status Ribbon & Rewards */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      {status.isUnlocked ? (
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Desbloqueada</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Bloqueada</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-700">
                        <span className="flex items-center gap-0.5">
                          <Coins className="w-3 h-3 text-amber-500" />
                          +{badge.rewardCoins}
                        </span>
                        <span>•</span>
                        <span>+{badge.rewardXp} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: TREASURE CHEST & STICKERS ================= */}
      {activeRewardsTab === 'chest' && (
        <div className="space-y-6">
          {/* The Interactive Treasure Chest Hero */}
          <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                Baú Mágico do Tesouro
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
                Abra o Baú e Colecione Figurinhas!
              </h3>
              <p className="text-amber-100 text-xs sm:text-sm max-w-md">
                Cada abertura sorteia uma figurinha colecionável misteriosa para o seu álbum. Custa <strong>40 Moedas</strong>!
              </p>

              <div className="pt-2">
                <button
                  onClick={handleOpenChest}
                  disabled={isOpeningChest || progress.coins < 40}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mx-auto sm:mx-0"
                >
                  <PackageOpen className="w-5 h-5 text-amber-400" />
                  <span>{isOpeningChest ? 'Abrindo o Baú...' : 'Abrir Baú (40 Moedas)'}</span>
                </button>
              </div>
            </div>

            {/* Big Animated Chest Graphic */}
            <div className="relative shrink-0">
              <div
                className={`w-36 h-36 rounded-3xl bg-white/10 backdrop-blur-md border-2 border-white/20 flex flex-col items-center justify-center text-6xl shadow-2xl transition-transform ${
                  isOpeningChest ? 'scale-115 rotate-6 animate-bounce' : 'hover:scale-105'
                }`}
              >
                <span className="animate-float">🎁</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200 mt-1">
                  Tesouro
                </span>
              </div>
            </div>
          </div>

          {/* Prize Reveal Box */}
          {chestPrize && chestPrize.sticker && (
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-400 shadow-xl text-center max-w-md mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <span className="text-5xl block animate-bounce">{chestPrize.sticker.emoji}</span>
              <div>
                <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full ${getRarityBadge(chestPrize.sticker.rarity)}`}>
                  {chestPrize.sticker.rarity}
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-1">
                  {chestPrize.sticker.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {chestPrize.sticker.description}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 text-xs font-bold text-amber-900 border border-amber-200">
                {chestPrize.isNew ? (
                  <span>🎉 Nova figurinha adicionada ao seu álbum!</span>
                ) : (
                  <span>🔁 Figurinha repetida! Você recebeu {chestPrize.cashback} moedas de volta de bônus!</span>
                )}
              </div>

              <button
                onClick={() => setChestPrize(null)}
                className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Guardar no Álbum
              </button>
            </div>
          )}

          {/* Stickers Album */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-display flex items-center gap-2">
                  <Gift className="w-5 h-5 text-rose-500" />
                  Álbum de Figurinhas Virtuais
                </h3>
                <p className="text-xs text-slate-500">
                  Colecionadas: <strong>{progress.unlockedStickers.length}</strong> de {STICKERS.length} figurinhas
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                Abra baús para completar a coleção!
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {STICKERS.map((sticker) => {
                const isUnlocked = progress.unlockedStickers.includes(sticker.id);

                return (
                  <div
                    key={sticker.id}
                    className={`p-3 rounded-2xl border-2 text-center flex flex-col items-center justify-between min-h-[140px] transition-all relative ${
                      isUnlocked
                        ? 'border-slate-200 bg-white hover:border-amber-300 shadow-2xs'
                        : 'border-dashed border-slate-200 bg-slate-50'
                    }`}
                    title={isUnlocked ? `${sticker.name}: ${sticker.description}` : 'Figurinha bloqueada'}
                  >
                    <span className={`text-[8px] uppercase px-1.5 py-0.2 rounded-md ${getRarityBadge(sticker.rarity)}`}>
                      {sticker.rarity}
                    </span>

                    <div className="my-2">
                      <span className={`text-3xl block transition-transform ${isUnlocked ? 'hover:scale-125' : 'grayscale opacity-30'}`}>
                        {sticker.emoji}
                      </span>
                    </div>

                    <div className="w-full">
                      <p className="text-[10px] font-bold text-slate-800 truncate">
                        {isUnlocked ? sticker.name : '???'}
                      </p>

                      {!isUnlocked && (
                        <button
                          onClick={() => unlockSticker(sticker.id)}
                          disabled={progress.coins < sticker.cost}
                          className="mt-1 w-full py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[9px] font-extrabold flex items-center justify-center gap-0.5 cursor-pointer disabled:opacity-40"
                        >
                          <Coins className="w-2.5 h-2.5 text-amber-500" />
                          {sticker.cost}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: AVATARS ================= */}
      {activeRewardsTab === 'avatars' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
          <div>
            <h3 className="font-extrabold text-xl text-slate-900 font-display flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              Avatares de Escritores Mirins
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Escolha seu personagem favorito para assinar seus livros e certificados oficiais:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {AVATARS.map((avatar) => {
              const isEquipped = progress.currentAvatar === avatar.id;
              const isUnlocked =
                avatar.unlockedByDefault ||
                progress.unlockedAvatars.includes(avatar.id) ||
                levelData.current.level >= avatar.requiredLevel;

              return (
                <button
                  key={avatar.id}
                  onClick={() => isUnlocked && selectAvatar(avatar.id)}
                  disabled={!isUnlocked}
                  className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-between gap-2 relative ${
                    isEquipped
                      ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-500/20 scale-105'
                      : isUnlocked
                      ? 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer hover:scale-102'
                      : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <span className="text-4xl">{avatar.emoji}</span>
                  <div>
                    <h5 className="text-xs font-black text-slate-800 leading-tight">
                      {avatar.name.split(' ')[0]}
                    </h5>
                    <p className="text-[10px] text-slate-400">{avatar.title}</p>
                  </div>

                  {isEquipped ? (
                    <span className="text-[9px] font-black uppercase text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                      Em Uso
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Usar
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Nív. {avatar.requiredLevel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= BADGE INSPECTOR MODAL ================= */}
      {inspectingBadge && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setInspectingBadge(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            {(() => {
              const status = getBadgeProgress(progress, inspectingBadge);
              const tierInfo = getTierDetails(inspectingBadge.tier);
              const unlockedDetails = progress.unlockedBadgeDetails?.[inspectingBadge.id];

              return (
                <div className="text-center space-y-4">
                  {/* Medal Icon with Tier Glow */}
                  <div
                    className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-5xl shadow-xl border-4 ${
                      status.isUnlocked
                        ? `bg-gradient-to-tr ${tierInfo.gradient} border-white text-white animate-float`
                        : 'bg-slate-100 border-slate-300 grayscale opacity-40'
                    }`}
                  >
                    {inspectingBadge.emoji}
                  </div>

                  <div>
                    <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full ${tierInfo.badgeBg}`}>
                      {tierInfo.label} • {inspectingBadge.category.toUpperCase()}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-2 font-display">
                      {inspectingBadge.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                      {inspectingBadge.description}
                    </p>
                  </div>

                  {/* Progress Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">Progresso do Desafio:</span>
                      <span className={status.isUnlocked ? 'text-emerald-700 font-black' : 'text-slate-800'}>
                        {status.current} / {status.max} {inspectingBadge.unit} ({status.percent}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          status.isUnlocked ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${status.percent}%` }}
                      />
                    </div>

                    {status.isUnlocked ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold pt-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Conquistada e atribuída ao seu perfil!</span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 pt-0.5">
                        Faltam apenas {status.max - status.current} {inspectingBadge.unit} para desbloquear esta medalha!
                      </p>
                    )}
                  </div>

                  {/* Pedagogical Note / BNCC */}
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1">
                    <span className="font-extrabold block text-[10px] uppercase tracking-wider text-amber-800">
                      💡 Nota Pedagógica:
                    </span>
                    <p className="text-[11px] leading-relaxed">{inspectingBadge.pedagogicalTip}</p>
                    <span className="text-[10px] font-semibold text-amber-700 block mt-1">
                      {inspectingBadge.bnccNote}
                    </span>
                  </div>

                  {/* Reward & Close button */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-amber-700">
                      <span>Recompensa:</span>
                      <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-600" />
                        +{inspectingBadge.rewardCoins}
                      </span>
                      <span className="bg-purple-100 text-purple-900 px-2.5 py-1 rounded-xl">
                        +{inspectingBadge.rewardXp} XP
                      </span>
                    </div>

                    <button
                      onClick={() => setInspectingBadge(null)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs cursor-pointer shadow-md"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
