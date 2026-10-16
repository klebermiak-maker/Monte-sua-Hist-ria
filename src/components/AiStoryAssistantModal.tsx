import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Wand2,
  X,
  Lightbulb,
  Check,
  Copy,
  RotateCcw,
  BookOpen,
  MessageSquare,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { StoryCard } from '../data/storyCards';
import { sound } from '../utils/audio';

export interface AiSuggestion {
  type: string;
  idea: string;
  starterSentence: string;
}

export interface AiStoryResponse {
  suggestions: AiSuggestion[];
  connectiveTip: string;
  motivationalQuote: string;
}

interface AiStoryAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  genreName: string;
  storyTitle: string;
  authorName: string;
  currentSectionKey: string;
  currentSectionTitle: string;
  currentSectionPrompt: string;
  currentSectionContent: string;
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
  onApplySuggestion: (starterSentence: string) => void;
}

export const AiStoryAssistantModal: React.FC<AiStoryAssistantModalProps> = ({
  isOpen,
  onClose,
  genreName,
  storyTitle,
  authorName,
  currentSectionKey,
  currentSectionTitle,
  currentSectionPrompt,
  currentSectionContent,
  cards,
  sections,
  onApplySuggestion,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AiStoryResponse | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);

  // Generate fallback suggestions in case the server is offline or key is missing
  const getPedagogicalFallback = (): AiStoryResponse => {
    const charName = cards.personagem?.text || 'nosso personagem';
    const placeName = cards.lugar?.text || 'um lugar misterioso';
    const actionName = cards.acao?.text || 'uma missão especial';
    const complementName = cards.complemento?.text || 'um detalhe surpreendente';

    if (currentSectionKey === 'introducao' || currentSectionKey === 'manchete_lide') {
      return {
        suggestions: [
          {
            type: '⚡ Início Empolgante',
            idea: `Apresente ${charName} logo no primeiro parágrafo, mostrando o que ele estava fazendo em ${placeName}.`,
            starterSentence: `Era uma manhã ensolarada quando ${charName} chegou a ${placeName} sem imaginar a grande surpresa que o aguardava...`,
          },
          {
            type: '💬 Diálogo Inicial',
            idea: 'Comece com uma fala divertida ou um grito de aviso do personagem.',
            starterSentence: `— "Atenção todos! Precisamos resolver isso agora mesmo!", exclamou ${charName} ao avistar ${placeName}.`,
          },
          {
            type: '🔍 Clima de Mistério',
            idea: 'Descreva um detalhe intrigante do cenário para prender a atenção do leitor.',
            starterSentence: `Dizem os mais velhos que ${placeName} guardava um enigma antigo, mas ${charName} não tinha medo de explorá-lo...`,
          },
        ],
        connectiveTip: 'Experimente iniciar usando "Certo dia", "Era uma vez" ou "Naquela manhã ensolarada".',
        motivationalQuote: 'Todo grande escritor começa com o primeiro parágrafo! Deixe sua imaginação voar alto! ✨',
      };
    }

    if (currentSectionKey === 'conflito' || currentSectionKey === 'desenvolvimento' || currentSectionKey === 'corpo_noticia') {
      return {
        suggestions: [
          {
            type: '⚡ Ação Inesperada',
            idea: `Crie um imprevisto na hora de ${actionName}, envolvendo ${complementName}.`,
            starterSentence: `De repente, no exato momento em que tentava ${actionName}, um barulho estranho quebrou o silêncio...`,
          },
          {
            type: '🔍 Pista ou Desafio',
            idea: `Mostre que ${charName} descobriu uma pista oculta ou um obstáculo difícil de atravessar.`,
            starterSentence: `Para a surpresa de ${charName}, havia um enigma no caminho: para avançar, seria preciso ${actionName}!`,
          },
          {
            type: '💬 Diálogo de Coragem',
            idea: 'Faça os personagens conversarem sobre o que fazer diante do problema.',
            starterSentence: `— "Não podemos desistir agora!", disse ${charName} com determinação nos olhos. "Vamos precisar de toda a nossa coragem!"`,
          },
        ],
        connectiveTip: 'Conectivos excelentes para o conflito: "De repente", "No entanto", "Porém", "Enquanto isso".',
        motivationalQuote: 'Histórias emocionantes têm desafios que testam nossos heróis! Você está indo muito bem! 🚀',
      };
    }

    if (currentSectionKey === 'climax') {
      return {
        suggestions: [
          {
            type: '⚡ Momento de Maior Tensão',
            idea: `Coloque tudo em jogo! O momento mais perigoso ou decisivo da aventura.`,
            starterSentence: `Foi o instante mais decisivo de todos: ${charName} respirou fundo e arriscou tudo para ${actionName}!`,
          },
          {
            type: '🔍 Grande Revelação',
            idea: `Revele o segredo que estava escondido com ${complementName}.`,
            starterSentence: `Num piscar de olhos, uma luz forte revelou o grande segredo escondido em ${placeName}!`,
          },
          {
            type: '💬 Grito de Vitória ou Alerta',
            idea: 'Mostre o personagem tomando uma atitude heroica com palavras de incentivo.',
            starterSentence: `— "É agora ou nunca!", gritou ${charName}, enfrentando o perigo cara a cara!`,
          },
        ],
        connectiveTip: 'Conectivos de impacto para o clímax: "De repente", "No instante em que", "Inesperadamente".',
        motivationalQuote: 'Esse é o ápice da sua história! Deixe o leitor na pontinha da cadeira! 🌟',
      };
    }

    // Desfecho / Conclusão
    return {
      suggestions: [
        {
          type: '⚡ Final Vitorioso',
          idea: `Mostre como ${charName} superou o desafio e o que aconteceu em ${placeName}.`,
          starterSentence: `Finalmente, a paz voltou a reinar em ${placeName}, e todos celebraram a coragem de ${charName}.`,
        },
        {
          type: '💡 Aprendizado & Amizade',
          idea: 'Conclua com uma lição bonita sobre união, amizade ou perseverança.',
          starterSentence: `A partir daquele dia inesquecível, ${charName} compreendeu que a verdadeira força está na determinação e no companheirismo.`,
        },
        {
          type: '🔍 Gancho para o Futuro',
          idea: 'Termine deixando um gostinho de novas aventuras por vir.',
          starterSentence: `E assim terminou essa grande aventura... pelo menos até o próximo mistério bater à porta!`,
        },
      ],
      connectiveTip: 'Conectivos para fechar com chave de ouro: "Finalmente", "Por fim", "Desde aquele dia", "Assim".',
      motivationalQuote: 'Parabéns pela dedicação! Concluir uma história é a marca de um(a) verdadeiro(a) autor(a)! 🏆',
    };
  };

  const fetchAiSuggestions = async () => {
    setLoading(true);
    setErrorNotice(null);
    setCopiedIndex(null);
    setAppliedIndex(null);

    try {
      const response = await fetch('/api/ai/story-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genreName,
          storyTitle,
          authorName,
          currentSectionKey,
          currentSectionTitle,
          currentSectionPrompt,
          currentSectionContent,
          cards,
          sections,
        }),
      });

      if (!response.ok) {
        throw new Error(`Falha no servidor (${response.status})`);
      }

      const json = await response.json();
      if (json && Array.isArray(json.suggestions) && json.suggestions.length > 0) {
        setData(json);
      } else {
        // Fallback
        setData(getPedagogicalFallback());
      }
    } catch (err: any) {
      console.warn('Usando sugestões pedagógicas locais:', err.message);
      setErrorNotice('Sugestões geradas com o Guia Pedagógico de Escrita');
      setData(getPedagogicalFallback());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAiSuggestions();
    }
  }, [isOpen, currentSectionKey]);

  if (!isOpen) return null;

  const handleApply = (starterSentence: string, index: number) => {
    sound.playMagic();
    onApplySuggestion(starterSentence);
    setAppliedIndex(index);
    setTimeout(() => {
      setAppliedIndex(null);
    }, 2500);
  };

  const handleCopy = (text: string, index: number) => {
    sound.playPop();
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-amber-300 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-200 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shadow-xs shrink-0">
              🧙‍♂️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg font-display tracking-wide">
                  Ajuda da IA: Mago das Histórias
                </h3>
                <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full border border-white/30">
                  3º ao 5º Ano
                </span>
              </div>
              <p className="text-xs text-amber-100">
                Sugestões contextuais e lúdicas para inspirar sua redação
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Context Pill Bar */}
        <div className="bg-amber-50/80 px-4 py-2.5 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-900 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              Gênero: <strong>{genreName}</strong>
            </span>
            <span className="text-amber-400">•</span>
            <span className="font-bold text-amber-900">
              Parte Atual: <strong className="text-orange-700">{currentSectionTitle}</strong>
            </span>
          </div>

          <button
            onClick={fetchAiSuggestions}
            disabled={loading}
            className="text-[11px] font-bold text-amber-800 hover:text-orange-900 flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Gerar Novas Ideias</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50">
          {errorNotice && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Section Prompt Reminder */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 shadow-2xs">
            <span className="font-bold text-slate-900 block mb-1">
              🎯 Objetivo pedagógico desta parte:
            </span>
            <p className="text-slate-600 leading-relaxed font-medium">
              {currentSectionPrompt}
            </p>
            {currentSectionContent.trim() && (
              <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Seu texto até agora: </span>
                <span className="italic">"{currentSectionContent.slice(-100)}"</span>
              </div>
            )}
          </div>

          {/* Loading Animation */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl animate-bounce">
                  ✨
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs animate-spin">
                  🪄
                </div>
              </div>
              <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-900">
                Consultando o Mago das Histórias...
              </h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Lendo seu texto e criando 3 caminhos mágicos para continuar sua aventura!
              </p>
            </div>
          ) : data ? (
            <div className="space-y-4">
              {/* 3 Creative Continuation Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  3 Ideias Mágicas de Continuação:
                </h4>

                {data.suggestions.map((sug, idx) => {
                  const isApplied = appliedIndex === idx;
                  const isCopied = copiedIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-400 transition-all shadow-xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                          {sug.type}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          Opção {idx + 1}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        {sug.idea}
                      </p>

                      {/* The Starter Sentence */}
                      <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs font-semibold text-slate-900 flex items-start gap-2">
                        <span className="text-amber-500 text-base leading-none select-none">“</span>
                        <p className="flex-1 italic">{sug.starterSentence}</p>
                        <span className="text-amber-500 text-base leading-none select-none">”</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleCopy(sug.starterSentence, idx)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApply(sug.starterSentence, idx)}
                          className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer transition-transform hover:scale-102 active:scale-98"
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-4 h-4 text-white" />
                              <span>Inserido no Texto! ✨</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-3.5 h-3.5" />
                              <span>Inserir no meu texto ✍️</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Connective Tip & Motivational Quote */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Connective Tip */}
                <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 flex items-center gap-1">
                    <Wand2 className="w-3.5 h-3.5" />
                    Dica de Conectivo do Mago
                  </span>
                  <p className="text-xs text-purple-900 font-medium">
                    {data.connectiveTip}
                  </p>
                </div>

                {/* Motivational Quote */}
                <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Incentivo ao Jovem Autor
                  </span>
                  <p className="text-xs text-emerald-900 font-medium">
                    {data.motivationalQuote}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Você pode editar livremente qualquer frase inserida no seu texto!
          </span>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black cursor-pointer shadow-xs transition-colors"
          >
            Pronto, vou continuar escrevendo! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
