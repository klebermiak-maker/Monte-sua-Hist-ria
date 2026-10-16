import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  RotateCcw,
  Check,
  Copy,
  ArrowRight,
  Lightbulb,
  X,
  BookMarked,
  Volume2,
} from 'lucide-react';
import { findLocalSynonyms, normalizeWord, SynonymEntry, ELEMENTARY_SYNONYMS } from '../data/synonyms';
import { sound } from '../utils/audio';

interface SupportDictionaryProps {
  selectedWord?: string;
  sentenceContext?: string;
  onReplaceSelectedWord?: (newWord: string) => void;
  onInsertWord?: (word: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const SupportDictionary: React.FC<SupportDictionaryProps> = ({
  selectedWord = '',
  sentenceContext = '',
  onReplaceSelectedWord,
  onInsertWord,
  onClose,
  isModal = false,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentEntry, setCurrentEntry] = useState<SynonymEntry | null>(null);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const [replacedWord, setReplacedWord] = useState<string | null>(null);

  // Quick suggestions list for 3rd-5th graders
  const quickWords = ['disse', 'olhou', 'correu', 'grande', 'bonito', 'feliz', 'medo', 'amigo', 'achou', 'muito'];

  // Handle word change (either from selection or manual input)
  const lookupWord = async (wordToSearch: string, useAi: boolean = false) => {
    const clean = wordToSearch.trim();
    if (!clean) return;

    sound.playPop();
    setSearchTerm(clean);
    setReplacedWord(null);

    // First check local dictionary
    const local = findLocalSynonyms(clean);

    if (local && !useAi) {
      setCurrentEntry(local);
      setAiTip(null);
      return;
    }

    // If not found locally or user requested AI expansion, call server API
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/synonyms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: clean,
          sentenceContext: sentenceContext || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.synonyms && data.synonyms.length > 0) {
          setCurrentEntry({
            word: data.word || clean,
            category: data.category || 'adjetivo',
            synonyms: data.synonyms,
            simpleMeaning: data.simpleMeaning || 'Significado no contexto da história.',
            exampleSentence: data.exampleSentence || '',
          });
          setAiTip(data.writingTip || null);
          return;
        }
      }
    } catch (err) {
      console.warn('AI synonyms fetch failed, using fallback:', err);
    } finally {
      setIsLoadingAi(false);
    }

    // Fallback if local exists
    if (local) {
      setCurrentEntry(local);
      setAiTip(null);
    } else {
      // Create a generic helpful entry
      setCurrentEntry({
        word: clean,
        category: 'substantivo',
        synonyms: [`outro modo de falar "${clean}"`, 'termo similar'],
        simpleMeaning: `A palavra "${clean}" pode ser expressa de outras formas para deixar o texto mais rico.`,
        exampleSentence: `Tente usar palavras que descrevam melhor como isso aconteceu!`,
      });
      setAiTip('Dica: Use palavras mais detalhadas para mostrar exatamente o que o personagem sentiu!');
    }
  };

  // Sync when selectedWord prop changes
  useEffect(() => {
    if (selectedWord && selectedWord.trim()) {
      lookupWord(selectedWord);
    } else if (!currentEntry) {
      // Default to "disse" as opening example
      lookupWord('disse');
    }
  }, [selectedWord]);

  const handleApplyReplacement = (synonym: string) => {
    sound.playMagic();
    setReplacedWord(synonym);

    if (onReplaceSelectedWord && selectedWord.trim()) {
      onReplaceSelectedWord(synonym);
    } else if (onInsertWord) {
      onInsertWord(synonym);
    }

    setTimeout(() => {
      setReplacedWord(null);
    }, 2000);
  };

  const handleCopyWord = (synonym: string) => {
    sound.playPop();
    navigator.clipboard.writeText(synonym);
    setCopiedWord(synonym);
    setTimeout(() => setCopiedWord(null), 1800);
  };

  const content = (
    <div className="space-y-4">
      {/* Search Bar & Selected Word Indicator */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                lookupWord(searchTerm);
              }
            }}
            placeholder="Digite uma palavra para ver sinônimos..."
            className="w-full text-xs font-bold pl-8 pr-20 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 outline-none focus:border-amber-500 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <button
            type="button"
            onClick={() => lookupWord(searchTerm)}
            className="absolute right-1.5 top-1.5 px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] cursor-pointer shadow-xs transition-colors"
          >
            Buscar
          </button>
        </div>

        {/* Selected Word Banner */}
        {selectedWord.trim() ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 flex items-center justify-between text-xs">
            <span className="text-amber-900 font-semibold flex items-center gap-1.5 truncate">
              <span className="text-sm">👆</span>
              Palavra selecionada: <strong className="text-amber-950 font-black">"{selectedWord.trim()}"</strong>
            </span>
            <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md font-bold shrink-0">
              Pronta para trocar
            </span>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400">
            💡 <strong>Dica:</strong> Selecione com o mouse qualquer palavra do seu texto para ver sinônimos instantâneos!
          </p>
        )}

        {/* Quick Words Tag Cloud */}
        <div className="pt-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
            Palavras muito repetidas em histórias:
          </span>
          <div className="flex flex-wrap gap-1">
            {quickWords.map((w) => {
              const isCurrent = normalizeWord(currentEntry?.word || '') === normalizeWord(w);
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => lookupWord(w)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-500 text-white shadow-xs scale-105'
                      : 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900'
                  }`}
                >
                  {w}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Synonym Entry Card */}
      {currentEntry && (
        <div className="bg-white rounded-2xl border-2 border-amber-300 p-4 shadow-xs space-y-3">
          {/* Header of Word */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-slate-900 font-display capitalize">
                  {currentEntry.word}
                </h4>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  {currentEntry.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {currentEntry.simpleMeaning}
              </p>
            </div>

            <button
              type="button"
              onClick={() => lookupWord(currentEntry.word, true)}
              disabled={isLoadingAi}
              className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50 shrink-0"
              title="Pedir sinônimos criativos à IA"
            >
              <Sparkles className={`w-3 h-3 text-purple-600 ${isLoadingAi ? 'animate-spin' : ''}`} />
              <span>{isLoadingAi ? 'Consultando...' : 'Mais com IA ✨'}</span>
            </button>
          </div>

          {/* Synonym Buttons Grid */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              Sugestões de sinônimos para substituir:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentEntry.synonyms.map((syn) => {
                const isReplaced = replacedWord === syn;
                const isCopied = copiedWord === syn;

                return (
                  <div
                    key={syn}
                    className="group relative inline-flex items-center rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 transition-all shadow-2xs hover:scale-102"
                  >
                    <button
                      type="button"
                      onClick={() => handleApplyReplacement(syn)}
                      className="px-2.5 py-1 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                      title={
                        selectedWord.trim()
                          ? `Substituir "${selectedWord.trim()}" por "${syn}"`
                          : `Inserir "${syn}" na história`
                      }
                    >
                      {isReplaced ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-black">Substituído! ✨</span>
                        </>
                      ) : (
                        <span>{syn}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyWord(syn)}
                      className="pr-2 pl-1 py-1 text-slate-400 hover:text-amber-800 transition-colors cursor-pointer text-[10px]"
                      title="Copiar sinônimo"
                    >
                      {isCopied ? '✓' : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Example Sentence Box */}
          {currentEntry.exampleSentence && (
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-0.5">
                Exemplo de uso na redação:
              </span>
              <p className="italic text-slate-800">
                "{currentEntry.exampleSentence}"
              </p>
            </div>
          )}

          {/* AI Tip / Pedagogical Advice */}
          {aiTip && (
            <div className="bg-purple-50/70 p-2.5 rounded-xl border border-purple-200 text-[11px] text-purple-900 flex items-start gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
              <span>{aiTip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // If rendered as a standalone modal
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-2 border-amber-300 space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500 text-white">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 font-display">
                  Dicionário de Apoio
                </h3>
                <p className="text-xs text-slate-500">
                  Enriqueça seu vocabulário e evite repetições
                </p>
              </div>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {content}

          <div className="pt-2 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Voltar para a História ✍️
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Rendered embedded in sidebar
  return (
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-amber-600" />
          <h4 className="font-extrabold text-sm text-slate-900 font-display">
            Dicionário de Apoio
          </h4>
        </div>
        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-200">
          Sinônimos
        </span>
      </div>

      {content}
    </div>
  );
};
