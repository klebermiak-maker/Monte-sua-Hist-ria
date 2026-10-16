import React, { useState } from 'react';
import {
  Dices,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Users,
  User,
  Lightbulb,
  Check,
  Eye,
  PlusCircle,
  Clock,
  Info,
} from 'lucide-react';
import {
  OFFICIAL_STORY_CARDS,
  CATEGORY_INFO,
  CardCategory,
  StoryCard,
} from '../data/storyCards';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';

export const CardDrawView: React.FC = () => {
  const { currentDrawnCards, setCurrentDrawnCards, setActiveTab, triggerConfetti } = useGame();

  const [mode, setMode] = useState<'individual' | 'duplo' | 'coletivo'>('individual');
  const [isShufflingAll, setIsShufflingAll] = useState(false);
  const [shufflingCategory, setShufflingCategory] = useState<CardCategory | null>(null);

  // For Double Choice Mode (stores 2 candidates per category)
  const [doubleCandidates, setDoubleCandidates] = useState<{
    personagem: [StoryCard, StoryCard] | null;
    lugar: [StoryCard, StoryCard] | null;
    acao: [StoryCard, StoryCard] | null;
    complemento: [StoryCard, StoryCard] | null;
  }>({
    personagem: null,
    lugar: null,
    acao: null,
    complemento: null,
  });

  // For Collective Mode
  const [collectivePlayers, setCollectivePlayers] = useState<string[]>([
    'Colega 1 (Início)',
    'Colega 2 (Conflito)',
    'Colega 3 (Clímax)',
    'Colega 4 (Desfecho)',
  ]);
  const [activeStepColetivo, setActiveStepColetivo] = useState(0);

  // Browser Modal for All 40 Cards
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<CardCategory>('personagem');

  // Custom card creation modal
  const [showCustomCardModal, setShowCustomCardModal] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customEmoji, setCustomEmoji] = useState('✨');
  const [customCategory, setCustomCategory] = useState<CardCategory>('personagem');
  const [customCards, setCustomCards] = useState<StoryCard[]>([]);

  const getAllCardsForCategory = (cat: CardCategory) => {
    const official = OFFICIAL_STORY_CARDS.filter((c) => c.category === cat);
    const custom = customCards.filter((c) => c.category === cat);
    return [...official, ...custom];
  };

  const drawSingleCard = (cat: CardCategory): StoryCard => {
    const list = getAllCardsForCategory(cat);
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  };

  const handleDrawCategory = (cat: CardCategory) => {
    sound.playCardFlip();
    setShufflingCategory(cat);
    setTimeout(() => {
      const drawn = drawSingleCard(cat);
      setCurrentDrawnCards({
        ...currentDrawnCards,
        [cat]: drawn,
      });
      setShufflingCategory(null);
    }, 250);
  };

  const handleDrawAll = () => {
    sound.playFanfare();
    setIsShufflingAll(true);

    if (mode === 'individual' || mode === 'coletivo') {
      setTimeout(() => {
        const newDrawn = {
          personagem: drawSingleCard('personagem'),
          lugar: drawSingleCard('lugar'),
          acao: drawSingleCard('acao'),
          complemento: drawSingleCard('complemento'),
        };
        setCurrentDrawnCards(newDrawn);
        setIsShufflingAll(false);
        triggerConfetti();
      }, 500);
    } else {
      // Double choice mode
      setTimeout(() => {
        const pickTwo = (cat: CardCategory): [StoryCard, StoryCard] => {
          const list = getAllCardsForCategory(cat);
          const i1 = Math.floor(Math.random() * list.length);
          let i2 = Math.floor(Math.random() * list.length);
          if (i2 === i1 && list.length > 1) {
            i2 = (i1 + 1) % list.length;
          }
          return [list[i1], list[i2]];
        };

        const pairs = {
          personagem: pickTwo('personagem'),
          lugar: pickTwo('lugar'),
          acao: pickTwo('acao'),
          complemento: pickTwo('complemento'),
        };

        setDoubleCandidates(pairs);
        // Pre-select first of each
        setCurrentDrawnCards({
          personagem: pairs.personagem[0],
          lugar: pairs.lugar[0],
          acao: pairs.acao[0],
          complemento: pairs.complemento[0],
        });
        setIsShufflingAll(false);
        triggerConfetti();
      }, 500);
    }
  };

  const isAllDrawn =
    Boolean(currentDrawnCards.personagem) &&
    Boolean(currentDrawnCards.lugar) &&
    Boolean(currentDrawnCards.acao) &&
    Boolean(currentDrawnCards.complemento);

  const handleProceedToWorkshop = () => {
    if (!isAllDrawn) {
      handleDrawAll();
    }
    sound.playSuccess();
    setActiveTab('workshop');
  };

  const handleAddCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const newCard: StoryCard = {
      id: 'custom_' + Date.now(),
      category: customCategory,
      text: customText.trim(),
      emoji: customEmoji || '✨',
      color: customCategory === 'personagem' ? 'amber' : customCategory === 'lugar' ? 'emerald' : customCategory === 'acao' ? 'sky' : 'rose',
      accentColor: customCategory === 'personagem' ? '#f59e0b' : customCategory === 'lugar' ? '#10b981' : customCategory === 'acao' ? '#0ea5e9' : '#f43f5e',
      bgGradient:
        customCategory === 'personagem'
          ? 'from-amber-400 to-orange-500'
          : customCategory === 'lugar'
          ? 'from-emerald-500 to-teal-600'
          : customCategory === 'acao'
          ? 'from-sky-500 to-blue-600'
          : 'from-rose-500 to-pink-600',
      helpTip: 'Criada com a criatividade da turma!',
      connectiveSuggestion: 'Em um momento extraordinário...',
    };

    setCustomCards((prev) => [newCard, ...prev]);
    setCurrentDrawnCards({
      ...currentDrawnCards,
      [customCategory]: newCard,
    });
    setCustomText('');
    setShowCustomCardModal(false);
    sound.playSuccess();
  };

  const categories: CardCategory[] = ['personagem', 'lugar', 'acao', 'complemento'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & Mode Switcher */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-emerald-400 via-sky-400 to-rose-400" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3 border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
          Material Didático: Alfabetiza MT • SEDUC Mato Grosso
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Sorteador das 40 Cartas da Imaginação
        </h2>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-2">
          Combine <strong>Personagem</strong>, <strong>Lugar</strong>, <strong>Ação</strong> e <strong>Complemento</strong> para iniciar sua grande narrativa!
        </p>

        {/* Mode Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button
            onClick={() => {
              sound.playPop();
              setMode('individual');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'individual'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            Opção 1: História Individual
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setMode('duplo');
              if (!doubleCandidates.personagem) {
                // Auto trigger double draw if empty
                setTimeout(handleDrawAll, 100);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'duplo'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Opção 2: Desafio Criativo (Escolha Dupla)
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setMode('coletivo');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'coletivo'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Opção 3: Roda Coletiva (Grupo/Turma)
          </button>
        </div>

        {/* Collective mode explanation banner */}
        {mode === 'coletivo' && (
          <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 max-w-2xl mx-auto text-left">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-700" />
              Dinâmica em Grupo: Cada estudante constrói um pedaço!
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {collectivePlayers.map((player, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl text-center border text-xs font-bold cursor-pointer transition-all ${
                    activeStepColetivo === idx
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-emerald-800 border-emerald-200'
                  }`}
                  onClick={() => setActiveStepColetivo(idx)}
                >
                  <p className="text-[10px] text-emerald-600 font-normal">Turno {idx + 1}</p>
                  <input
                    type="text"
                    value={player}
                    onChange={(e) => {
                      const next = [...collectivePlayers];
                      next[idx] = e.target.value;
                      setCollectivePlayers(next);
                    }}
                    className="w-full text-center bg-transparent border-none outline-none font-bold text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Big Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={handleDrawAll}
            disabled={isShufflingAll}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Dices className={`w-5 h-5 ${isShufflingAll ? 'animate-spin' : ''}`} />
            {isShufflingAll ? 'Embaralhando Cartas...' : '🎲 Sortear Todas as Cartas!'}
          </button>

          {isAllDrawn && (
            <button
              onClick={handleProceedToWorkshop}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Escrever História com essas Cartas</span>
              <ArrowRight className="w-5 h-5 text-amber-400" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playPop();
                setShowCatalogModal(true);
              }}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Explorar o catálogo completo com as 40 cartas de MT"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Ver 40 Cartas</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setShowCustomCardModal(true);
              }}
              className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Inventar uma nova carta para a coleção da turma"
            >
              <PlusCircle className="w-4 h-4 text-amber-600" />
              <span>Criar Carta</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((categoryKey) => {
          const info = CATEGORY_INFO[categoryKey];
          const drawnCard = currentDrawnCards[categoryKey];
          const isShuffling = shufflingCategory === categoryKey || isShufflingAll;
          const doublePair = doubleCandidates[categoryKey];

          return (
            <div
              key={categoryKey}
              className={`flex flex-col bg-white rounded-3xl border-2 transition-all duration-300 relative overflow-hidden shadow-xs hover:shadow-md ${info.borderColor}`}
            >
              {/* Category Header */}
              <div className={`${info.headerColor} text-white px-4 py-3 flex items-center justify-between`}>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-90">
                    {info.singularName}
                  </span>
                  <h3 className="text-sm font-black flex items-center gap-1.5">
                    {info.name}
                  </h3>
                </div>
                <button
                  onClick={() => handleDrawCategory(categoryKey)}
                  disabled={isShuffling}
                  className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer disabled:opacity-50"
                  title={`Sortear nova carta de ${info.name}`}
                >
                  <RotateCcw className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Question helper */}
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{info.question}</span>
              </div>

              {/* Card Body / Double Choice */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                {mode === 'duplo' && doublePair ? (
                  /* Dual Choice Mode: show both cards with selection radio */
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded-md text-center">
                      Escolha a sua favorita desta categoria:
                    </p>
                    {doublePair.map((candidate, idx) => {
                      const isSelected = drawnCard?.id === candidate.id;
                      return (
                        <div
                          key={candidate.id + idx}
                          onClick={() => {
                            sound.playPop();
                            setCurrentDrawnCards({
                              ...currentDrawnCards,
                              [categoryKey]: candidate,
                            });
                          }}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-sky-500 bg-sky-50/70 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-2xl">{candidate.emoji}</span>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-slate-800 leading-snug">
                                {candidate.text}
                              </p>
                            </div>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : drawnCard ? (
                  /* Single Card Mode */
                  <div
                    className={`flex flex-col h-full justify-between transition-all duration-300 ${
                      isShuffling ? 'opacity-40 scale-95 blur-xs' : 'opacity-100 scale-100'
                    }`}
                  >
                    <div className="text-center py-4">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr shadow-md flex items-center justify-center text-3xl mb-3 transform hover:scale-110 transition-transform select-none">
                        {drawnCard.emoji}
                      </div>

                      <div className="min-h-[70px] flex items-center justify-center px-2">
                        <p className="text-sm font-extrabold text-slate-800 leading-snug">
                          {drawnCard.text}
                        </p>
                      </div>
                    </div>

                    {/* Pedagogical Hint & Connective suggestion */}
                    <div className="space-y-2 mt-2 pt-3 border-t border-slate-100">
                      {drawnCard.helpTip && (
                        <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 leading-tight">
                          <strong className="text-slate-800 block mb-0.5">💡 Ideia Criativa:</strong>
                          {drawnCard.helpTip}
                        </div>
                      )}
                      {drawnCard.connectiveSuggestion && (
                        <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200 text-[10px] text-amber-900 leading-tight">
                          <span className="font-bold">✨ Sugestão de Conectivo:</span> "{drawnCard.connectiveSuggestion}"
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-2xl mb-2">
                      ?
                    </div>
                    <p className="text-xs font-semibold text-slate-500">Carta não sorteada</p>
                    <button
                      onClick={() => handleDrawCategory(categoryKey)}
                      className="mt-3 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                    >
                      Sortear {info.singularName}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Inspiration Callout */}
      {isAllDrawn && (
        <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-sky-50 rounded-3xl p-5 border border-amber-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <span className="text-3xl">🎉</span>
            <div>
              <h4 className="text-sm font-black text-slate-900">
                Suas 4 cartas estão prontas para a grande aventura!
              </h4>
              <p className="text-xs text-slate-600">
                Na Oficina, você poderá escolher o <strong>Gênero Textual</strong> (Aventura, Fábula, Notícia, Tirinha ou Carta) e terá um banco de conectivos para te guiar passo a passo.
              </p>
            </div>
          </div>
          <button
            onClick={handleProceedToWorkshop}
            className="w-full md:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
          >
            <span>Ir para a Oficina de Escrita</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      )}

      {/* Catalog Modal: 40 Official Cards */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 font-display">
                  Baralho Completo: 40 Cartas Oficiais (Alfabetiza MT)
                </h3>
                <p className="text-xs text-slate-500">
                  Clique em qualquer carta para selecioná-la manualmente para a sua história.
                </p>
              </div>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Category tabs inside modal */}
            <div className="flex border-b border-slate-200 px-5 pt-3 gap-2 bg-white overflow-x-auto">
              {categories.map((catKey) => {
                const info = CATEGORY_INFO[catKey];
                const isActive = selectedCatalogCategory === catKey;
                return (
                  <button
                    key={catKey}
                    onClick={() => {
                      sound.playPop();
                      setSelectedCatalogCategory(catKey);
                    }}
                    className={`px-4 py-2 font-bold text-xs rounded-t-xl transition-colors cursor-pointer ${
                      isActive
                        ? `${info.headerColor} text-white shadow-xs`
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {info.name} (10)
                  </button>
                );
              })}
            </div>

            {/* Cards List in Catalog */}
            <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 bg-slate-50">
              {getAllCardsForCategory(selectedCatalogCategory).map((card, idx) => {
                const isSelected = currentDrawnCards[selectedCatalogCategory]?.id === card.id;
                return (
                  <div
                    key={card.id + idx}
                    onClick={() => {
                      sound.playPop();
                      setCurrentDrawnCards({
                        ...currentDrawnCards,
                        [selectedCatalogCategory]: card,
                      });
                      setShowCatalogModal(false);
                    }}
                    className={`p-3.5 rounded-2xl border-2 bg-white hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{card.emoji}</span>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400">Carta #{idx + 1}</span>
                        <p className="text-xs font-bold text-slate-800 leading-snug">{card.text}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-amber-500 text-white shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
              <button
                onClick={() => setShowCatalogModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Custom Card */}
      {showCustomCardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-extrabold text-slate-900 font-display flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-500" />
              Criar Nova Carta da Turma
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Invente um personagem maluco, um lugar mágico ou uma reviravolta para usar nas histórias!
            </p>

            <form onSubmit={handleAddCustomCard} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Categoria da Carta:
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as CardCategory)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 outline-none focus:border-amber-500"
                >
                  <option value="personagem">Personagem (Amarelo)</option>
                  <option value="lugar">Lugar (Verde)</option>
                  <option value="acao">Ação (Azul)</option>
                  <option value="complemento">Complemento / Reviravolta (Rosa)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Emoji representativo:
                </label>
                <div className="flex gap-2">
                  {['🧙', '🚀', '🦖', '💎', '🎨', '⚡', '🛸', '🦄'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setCustomEmoji(em)}
                      className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center cursor-pointer transition-transform ${
                        customEmoji === em ? 'border-amber-500 bg-amber-50 scale-110' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Texto da Carta (Frase curta e criativa):
                </label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Ex: Um cientista que fala a língua das formigas..."
                  rows={3}
                  maxLength={120}
                  required
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomCardModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer shadow-md shadow-amber-500/20"
                >
                  Adicionar Carta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
