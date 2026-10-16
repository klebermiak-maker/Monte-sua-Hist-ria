import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { CardDrawView } from './components/CardDrawView';
import { StoryWorkshop } from './components/StoryWorkshop';
import { GrammarArena } from './components/GrammarArena';
import { RewardsView } from './components/RewardsView';
import { LibraryView } from './components/LibraryView';
import { PedagogicalGuide } from './components/PedagogicalGuide';
import { BadgeUnlockModal } from './components/BadgeUnlockModal';
import { CommunityMural } from './components/CommunityMural';
import { ClassRankingView } from './components/ClassRankingView';

const MainContent: React.FC = () => {
  const { activeTab } = useGame();

  return (
    <main className="min-h-[calc(100vh-140px)] pb-12">
      {activeTab === 'draw' && <CardDrawView />}
      {activeTab === 'workshop' && <StoryWorkshop />}
      {activeTab === 'grammar' && <GrammarArena />}
      {activeTab === 'ranking' && <ClassRankingView />}
      {activeTab === 'mural' && <CommunityMural />}
      {activeTab === 'rewards' && <RewardsView />}
      {activeTab === 'library' && <LibraryView />}
      {activeTab === 'pedagogical' && <PedagogicalGuide />}

      <BadgeUnlockModal />
    </main>
  );
};

export default function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
        <Header />
        <MainContent />

        {/* Child-friendly Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌟</span>
              <span className="font-extrabold text-slate-800">Monte Sua História</span>
              <span className="text-slate-400">•</span>
              <span>Oficina Lúdica de Gêneros Textuais e Gramática</span>
            </div>

            <div className="text-[11px] text-slate-400">
              Inspirado no material didático <strong className="text-slate-600">Alfabetiza MT</strong> • SEDUC Governo de Mato Grosso
            </div>
          </div>
        </footer>
      </div>
    </GameProvider>
  );
}
