import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Coins,
  Award,
  Zap,
  BookOpen,
} from 'lucide-react';
import { GRAMMAR_MODULES, GrammarModule, GrammarQuestion } from '../data/grammarGames';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';

export const GrammarArena: React.FC = () => {
  const { recordGrammarSuccess, triggerConfetti } = useGame();

  const [activeModuleId, setActiveModuleId] = useState<string>('classes');
  const currentModule = GRAMMAR_MODULES.find((m) => m.id === activeModuleId) || GRAMMAR_MODULES[0];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Score & Streak tracking
  const [streak, setStreak] = useState(0);
  const [moduleScore, setModuleScore] = useState(0);
  const [showRuleModal, setShowRuleModal] = useState(false);

  const question: GrammarQuestion = currentModule.questions[currentQuestionIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const correct = option.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      sound.playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setModuleScore((prev) => prev + question.rewardCoins);

      // Give XP, Coins and evaluate grammar badges
      recordGrammarSuccess(question.module, question.rewardXp, question.rewardCoins, newStreak);

      if (newStreak % 3 === 0) {
        triggerConfetti();
      }
    } else {
      sound.playError();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    sound.playPop();
    if (currentQuestionIndex + 1 < currentModule.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      // Completed all questions in module
      sound.playFanfare();
      triggerConfetti();
      // Reset or stay at celebration
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    }
  };

  const handleSwitchModule = (modId: string) => {
    sound.playPop();
    setActiveModuleId(modId);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-purple-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-2 border border-purple-500/30">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Arena Gamificada de Gramática BNCC
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              Desafios Gramaticais Divertidos
            </h2>
            <p className="text-purple-200 text-xs sm:text-sm max-w-xl mt-1">
              Treine substantivos, adjetivos, verbos, pontuação e conectivos. Cada acerto rende moedas para abrir baús!
            </p>
          </div>

          {/* Streak & Score Counter */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase tracking-wider text-purple-200 font-bold block">
                Combo de Acertos
              </span>
              <div className="flex items-center justify-center gap-1 font-extrabold text-amber-300 text-lg">
                <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-400 animate-bounce' : 'text-slate-400'}`} />
                <span>{streak}x</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playPop();
                setShowRuleModal(!showRuleModal);
              }}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ver Regra</span>
            </button>
          </div>
        </div>

        {/* Rule explanation collapsible/modal */}
        {showRuleModal && (
          <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs leading-relaxed space-y-2">
            <h4 className="font-extrabold text-amber-300 flex items-center gap-1.5">
              <span>📖</span> Regra Didática: {currentModule.title} ({currentModule.bnccTag})
            </h4>
            <p className="whitespace-pre-line text-purple-100 font-medium">
              {currentModule.ruleExplanation}
            </p>
          </div>
        )}
      </div>

      {/* Module Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {GRAMMAR_MODULES.map((m) => {
          const isActive = activeModuleId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSwitchModule(m.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="text-base">{m.emoji}</span>
              <span>{m.title.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Question Card Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        {/* Question Progress Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold bg-purple-100 text-purple-900 px-3 py-1 rounded-full border border-purple-200">
              Questão {currentQuestionIndex + 1} de {currentModule.questions.length}
            </span>
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
              {question.bnccCode}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>+{question.rewardCoins} Moedas</span>
            <span>•</span>
            <span>+{question.rewardXp} XP</span>
          </div>
        </div>

        {/* Prompt */}
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
            {question.prompt}
          </h3>

          {question.sentence && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-base sm:text-lg font-bold text-slate-800 text-center leading-relaxed">
              {question.sentence.split(' ').map((word, i) => {
                const cleanWord = word.replace(/[^a-zA-ZáéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ]/g, '');
                const isHighlight =
                  question.highlightedWord &&
                  cleanWord.toUpperCase() === question.highlightedWord.toUpperCase();

                return isHighlight ? (
                  <span
                    key={i}
                    className="mx-1 px-2.5 py-0.5 rounded-lg bg-amber-300 text-amber-950 font-black shadow-xs ring-2 ring-amber-400 inline-block animate-pulse"
                  >
                    {word}
                  </span>
                ) : (
                  <span key={i} className="mx-0.5">{word}</span>
                );
              })}
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {question.options.map((option, idx) => {
            let optionStyles = 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/50 text-slate-800';

            if (isAnswered) {
              const isOptionCorrect = option.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
              const isOptionSelected = selectedOption === option;

              if (isOptionCorrect) {
                optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30 font-bold';
              } else if (isOptionSelected && !isOptionCorrect) {
                optionStyles = 'border-rose-400 bg-rose-50 text-rose-950 font-bold';
              } else {
                optionStyles = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={option + idx}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyles}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && option.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase() && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && selectedOption === option && option.trim().toLowerCase() !== question.correctAnswer.trim().toLowerCase() && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Explanation Banner */}
        {isAnswered && (
          <div
            className={`p-5 rounded-2xl border transition-all space-y-3 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <h4 className="font-extrabold text-base">Excelente! Resposta correta! 🎉</h4>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  <h4 className="font-extrabold text-base">Não foi dessa vez! Vamos aprender? 🤔</h4>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              {question.explanation}
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>
                  {currentQuestionIndex + 1 < currentModule.questions.length
                    ? 'Próxima Questão'
                    : 'Finalizar Módulo'}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
