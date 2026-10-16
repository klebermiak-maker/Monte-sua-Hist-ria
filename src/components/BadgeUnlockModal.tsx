import React from 'react';
import { Award, Coins, Sparkles, X, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { BadgeTier } from '../data/rewards';
import { sound } from '../utils/audio';

export const BadgeUnlockModal: React.FC = () => {
  const { newlyUnlockedBadge, dismissBadgeNotification, setActiveTab } = useGame();

  if (!newlyUnlockedBadge) return null;

  const getTierColor = (tier: BadgeTier) => {
    switch (tier) {
      case 'platina':
        return 'from-purple-500 via-indigo-500 to-cyan-400 border-purple-400 text-purple-950';
      case 'ouro':
        return 'from-amber-400 via-yellow-400 to-orange-400 border-amber-400 text-amber-950';
      case 'prata':
        return 'from-slate-200 to-slate-400 border-slate-300 text-slate-800';
      case 'bronze':
      default:
        return 'from-amber-600 to-amber-800 border-amber-600 text-amber-950';
    }
  };

  const handleGoToGallery = () => {
    sound.playPop();
    dismissBadgeNotification();
    setActiveTab('rewards');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-400 text-center relative overflow-hidden space-y-4 animate-in zoom-in-95 duration-300">
        <button
          onClick={dismissBadgeNotification}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
          Nova Medalha Conquistada!
        </div>

        {/* Big Animated Medal */}
        <div
          className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr ${getTierColor(
            newlyUnlockedBadge.tier
          )} flex items-center justify-center text-5xl shadow-xl border-4 border-white animate-bounce`}
        >
          {newlyUnlockedBadge.emoji}
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block">
            Medalha de {newlyUnlockedBadge.tier.toUpperCase()} • {newlyUnlockedBadge.category.toUpperCase()}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-0.5">
            {newlyUnlockedBadge.title}
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
            {newlyUnlockedBadge.description}
          </p>
        </div>

        {/* Rewards pill */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-around text-xs font-black">
          <div className="flex items-center gap-1 text-amber-800">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>+{newlyUnlockedBadge.rewardCoins} Moedas</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1 text-purple-800">
            <Award className="w-4 h-4 text-purple-600" />
            <span>+{newlyUnlockedBadge.rewardXp} XP</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 italic">
          "{newlyUnlockedBadge.pedagogicalTip}"
        </p>

        <div className="flex gap-2 pt-2">
          <button
            onClick={dismissBadgeNotification}
            className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
          >
            Continuar Atividade
          </button>
          <button
            onClick={handleGoToGallery}
            className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors"
          >
            <span>Ver na Galeria</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
