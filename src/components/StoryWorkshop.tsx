import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Save,
  CheckCircle2,
  Wand2,
  HelpCircle,
  Eye,
  Dices,
  Layers,
  ChevronDown,
  Smile,
  AlertCircle,
  Check,
  Send,
  Download,
  Printer,
  FileText,
} from 'lucide-react';
import { TEXT_GENRES, TextGenre } from '../data/genres';
import { StoryCard, CATEGORY_INFO } from '../data/storyCards';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { generateStoryPdf } from '../utils/pdfExport';
import { AiStoryAssistantModal } from './AiStoryAssistantModal';
import { SupportDictionary } from './SupportDictionary';
import { publishStoryToMural } from '../services/muralService';

export const StoryWorkshop: React.FC = () => {
  const { currentDrawnCards, saveStory, setActiveTab, progress } = useGame();

  const [selectedGenreId, setSelectedGenreId] = useState<string>('narrativa');
  const activeGenre = TEXT_GENRES.find((g) => g.id === selectedGenreId) || TEXT_GENRES[0];

  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState(progress.studentName || 'Jovem Escritor(a)');
  const [coverEmoji, setCoverEmoji] = useState('📖');
  const [coverBg, setCoverBg] = useState('from-amber-400 to-orange-500');

  // Text contents keyed by genre structure keys
  const [sectionsData, setSectionsData] = useState<Record<string, string>>({
    introducao: '',
    desenvolvimento: '',
    climax: '',
    desfecho: '',
  });

  const [focusedSectionKey, setFocusedSectionKey] = useState<string>('introducao');
  const [showConnectivesPanel, setShowConnectivesPanel] = useState(true);

  // Sync section keys if genre changes
  useEffect(() => {
    const initial: Record<string, string> = {};
    activeGenre.structure.forEach((step, idx) => {
      initial[step.key] = sectionsData[step.key] || '';
    });
    setSectionsData(initial);
    setFocusedSectionKey(activeGenre.structure[0]?.key || 'introducao');
  }, [selectedGenreId]);

  // Insert connective word into currently focused section
  const handleInsertConnective = (word: string) => {
    sound.playPop();
    const currentText = sectionsData[focusedSectionKey] || '';
    const newText = currentText ? `${currentText.trim()} ${word} ` : `${word} `;
    setSectionsData({
      ...sectionsData,
      [focusedSectionKey]: newText,
    });
  };

  // Word count & grammar checks
  const totalWords = Object.values(sectionsData).reduce((acc, text) => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    return acc + words.length;
  }, 0);

  const checks = {
    hasTitle: title.trim().length >= 3,
    hasMinWords: totalWords >= 40,
    hasCapitalLetters: Object.values(sectionsData).some((text) => /^[A-ZÁÉÍÓÚÂÊÔÃÕ]/.test(text.trim())),
    hasPunctuation: Object.values(sectionsData).some((text) => /[.!?]/.test(text)),
    hasUsedConnective: activeGenre.connectives.some((cat) =>
      cat.words.some((word) =>
        Object.values(sectionsData).some((txt) => txt.toLowerCase().includes(word.toLowerCase()))
      )
    ),
  };

  const handleSave = () => {
    if (!title.trim()) {
      sound.playError();
      alert('Por favor, dê um título bem criativo para sua história!');
      return;
    }

    const sections = activeGenre.structure.map((s) => ({
      key: s.key,
      title: s.title,
      content: sectionsData[s.key] || '',
    }));

    const fullStoryText = Object.values(sectionsData).join(' ').toLowerCase();
    let usedConnectivesCount = 0;
    activeGenre.connectives.forEach((cat) => {
      cat.words.forEach((word) => {
        if (fullStoryText.includes(word.toLowerCase())) {
          usedConnectivesCount++;
        }
      });
    });

    saveStory({
      title: title.trim(),
      author: authorName.trim() || progress.studentName,
      genreId: activeGenre.id,
      genreName: activeGenre.name,
      coverEmoji,
      coverBg,
      cards: currentDrawnCards,
      sections,
      wordCount: totalWords,
      connectivesCount: usedConnectivesCount,
    });

    setActiveTab('library');
  };

  const [isSavingToMural, setIsSavingToMural] = useState(false);

  const handleSaveAndPublishToMural = async () => {
    if (!title.trim()) {
      sound.playError();
      alert('Por favor, dê um título bem criativo para sua história antes de publicar!');
      return;
    }

    const sections = activeGenre.structure.map((s) => ({
      key: s.key,
      title: s.title,
      content: sectionsData[s.key] || '',
    }));

    setIsSavingToMural(true);
    sound.playMagic();

    try {
      saveStory({
        title: title.trim(),
        author: authorName.trim() || progress.studentName,
        genreId: activeGenre.id,
        genreName: activeGenre.name,
        coverEmoji,
        coverBg,
        cards: currentDrawnCards,
        sections,
        wordCount: totalWords,
        connectivesCount: 0,
      });

      await publishStoryToMural({
        title: title.trim(),
        author: authorName.trim() || progress.studentName,
        authorUid: progress.studentName || 'aluno',
        genreId: activeGenre.id,
        genreName: activeGenre.name,
        coverEmoji,
        coverBg,
        cards: currentDrawnCards,
        sections,
        wordCount: totalWords,
        createdAt: new Date().toLocaleDateString('pt-BR'),
      });

      alert('🌟 Incrível! Sua história foi salva e publicada no Mural da Turma no Firebase!');
      setActiveTab('mural');
    } catch (err) {
      console.error(err);
      alert('Sua história foi salva na sua estante pessoal! Ocorreu uma instabilidade ao enviar para o Firebase.');
      setActiveTab('library');
    } finally {
      setIsSavingToMural(false);
    }
  };

  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const handleOpenAiHelp = (sectionKey?: string) => {
    sound.playMagic();
    if (sectionKey) {
      setFocusedSectionKey(sectionKey);
    }
    setShowAiModal(true);
  };

  const handleApplyAiSuggestion = (starterSentence: string) => {
    const currentText = sectionsData[focusedSectionKey] || '';
    const newText = currentText
      ? `${currentText.trim()} ${starterSentence}`
      : starterSentence;
    setSectionsData({
      ...sectionsData,
      [focusedSectionKey]: newText,
    });
  };

  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const [sidebarToolTab, setSidebarToolTab] = useState<'dictionary' | 'connectives'>('dictionary');
  const [selectedWord, setSelectedWord] = useState('');
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number; sectionKey: string } | null>(null);
  const [sentenceContext, setSentenceContext] = useState('');

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>, sectionKey: string) => {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    if (start !== end) {
      const text = target.value.substring(start, end).trim();
      if (text && text.split(/\s+/).length <= 3) {
        setSelectedWord(text);
        setSelectedRange({ start, end, sectionKey });

        const fullText = target.value;
        const sentenceStart = Math.max(0, fullText.lastIndexOf('.', start) + 1);
        const sentenceEnd = fullText.indexOf('.', end);
        const ctx = fullText.substring(sentenceStart, sentenceEnd !== -1 ? sentenceEnd : fullText.length).trim();
        setSentenceContext(ctx);
      }
    }
  };

  const handleReplaceSelectedWord = (newWord: string) => {
    sound.playMagic();
    if (selectedRange && selectedRange.sectionKey === focusedSectionKey) {
      const currentText = sectionsData[focusedSectionKey] || '';
      const before = currentText.substring(0, selectedRange.start);
      const after = currentText.substring(selectedRange.end);
      const updated = `${before}${newWord}${after}`;
      setSectionsData({
        ...sectionsData,
        [focusedSectionKey]: updated,
      });
      setSelectedRange({
        start: selectedRange.start,
        end: selectedRange.start + newWord.length,
        sectionKey: focusedSectionKey,
      });
      setSelectedWord(newWord);
    } else if (selectedWord.trim()) {
      const currentText = sectionsData[focusedSectionKey] || '';
      const regex = new RegExp(`\\b${selectedWord.trim()}\\b`, 'i');
      if (regex.test(currentText)) {
        const updated = currentText.replace(regex, newWord);
        setSectionsData({
          ...sectionsData,
          [focusedSectionKey]: updated,
        });
        setSelectedWord(newWord);
      } else {
        setSectionsData({
          ...sectionsData,
          [focusedSectionKey]: `${currentText.trim()} ${newWord} `,
        });
      }
    }
  };

  const handleInsertWord = (word: string) => {
    sound.playPop();
    const currentText = sectionsData[focusedSectionKey] || '';
    const newText = currentText ? `${currentText.trim()} ${word} ` : `${word} `;
    setSectionsData({
      ...sectionsData,
      [focusedSectionKey]: newText,
    });
  };

  const handleDownloadPdf = () => {
    if (!title.trim()) {
      sound.playError();
      alert('Por favor, dê um título para sua história antes de baixar o PDF!');
      return;
    }

    sound.playSuccess();
    const sections = activeGenre.structure.map((s) => ({
      key: s.key,
      title: s.title,
      content: sectionsData[s.key] || '',
    }));

    const doc = generateStoryPdf({
      title: title.trim(),
      author: authorName.trim() || progress.studentName,
      genreName: activeGenre.name,
      cards: currentDrawnCards,
      sections,
    });

    const sanitizedFileName = (title.trim() || 'minha_historia')
      .toLowerCase()
      .replace(/[^a-z0-9áéíóúâêôãõç]/gi, '_');

    doc.save(`${sanitizedFileName}.pdf`);
  };

  const coverEmojisList = ['📖', '🚀', '🧙‍♂️', '🏰', '🤖', '🐶', '🕵️', '🌋', '📜', '⭐', '🎈', '🦊'];
  const coverGradients = [
    { label: 'Dourado Solar', value: 'from-amber-400 to-orange-500' },
    { label: 'Floresta Esmeralda', value: 'from-emerald-500 to-teal-600' },
    { label: 'Oceano Cósmico', value: 'from-sky-500 to-indigo-600' },
    { label: 'Pôr do Sol Mágico', value: 'from-rose-500 to-pink-600' },
    { label: 'Mistério Noturno', value: 'from-purple-600 to-indigo-900' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Cards Pinned Reference Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500 text-white">
              <Dices className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-extrabold font-display tracking-wide">
              Cartas Sorteadas de Referência
            </h3>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              (Use estes elementos em seu texto)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setSidebarToolTab('dictionary');
                setShowDictionaryModal(true);
              }}
              className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Abrir o Dicionário de Apoio com sinônimos e enriquecimento de vocabulário"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Dicionário de Sinônimos 📖</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenAiHelp(focusedSectionKey)}
              className="text-xs font-black px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title="Receber ideias e sugestões criativas da IA para continuar sua história"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>Ajuda da IA ✨</span>
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('draw');
              }}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              Sortear cartas 🎲
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {(['personagem', 'lugar', 'acao', 'complemento'] as const).map((catKey) => {
            const card = currentDrawnCards[catKey];
            const info = CATEGORY_INFO[catKey];
            return (
              <div
                key={catKey}
                onClick={() => {
                  if (card?.connectiveSuggestion) {
                    handleInsertConnective(card.connectiveSuggestion);
                  }
                }}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  card
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-amber-400'
                    : 'bg-slate-800/40 border-dashed border-slate-700'
                }`}
                title={card ? `Clique para inserir a sugestão: "${card.connectiveSuggestion}"` : 'Nenhuma carta sorteada nesta categoria'}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <span>{info.singularName}</span>
                  <span className="text-sm">{card?.emoji || '❓'}</span>
                </div>
                <p className="text-xs font-semibold text-slate-200 line-clamp-2 leading-tight">
                  {card ? card.text : 'Não sorteado (clique em Sortear)'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Workshop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Editor Sections (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Genre Tabs Selector */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
              1. Escolha o Gênero Textual:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {TEXT_GENRES.map((g) => {
                const isSelected = selectedGenreId === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      sound.playPop();
                      setSelectedGenreId(g.id);
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold shadow-xs scale-102'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700 font-medium'
                    }`}
                  >
                    <span className="text-xl">{g.emoji}</span>
                    <span className="text-[11px] leading-tight line-clamp-1">{g.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-slate-400 font-normal">{g.suitableGrades}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-1.5">
              <span>💡</span>
              <span>{activeGenre.description}</span>
            </p>
          </div>

          {/* Title & Author Inputs */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-extrabold text-slate-700 block mb-1">
                  Título da História:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: O Segredo do Robô na Estação Esquecida..."
                  className="w-full text-sm font-bold p-3 rounded-2xl border border-slate-300 text-slate-900 bg-amber-50/30 focus:bg-white outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">
                  Autor(a) Mirim:
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full text-sm font-bold p-3 rounded-2xl border border-slate-300 text-slate-900 bg-slate-50 focus:bg-white outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* The 4 Structure Blocks */}
          <div className="space-y-4">
            {activeGenre.structure.map((step, idx) => {
              const isFocused = focusedSectionKey === step.key;
              const textContent = sectionsData[step.key] || '';
              const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;

              return (
                <div
                  key={step.key}
                  className={`bg-white rounded-3xl p-5 border-2 transition-all shadow-xs ${
                    isFocused ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200'
                  }`}
                  onClick={() => setFocusedSectionKey(step.key)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {step.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAiHelp(step.key);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer hover:scale-105"
                        title="Pedir ideias à IA para esta parte"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Ajuda da IA</span>
                      </button>
                      <span className="text-[11px] font-bold text-slate-400">
                        {wordCount} {wordCount === 1 ? 'palavra' : 'palavras'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-2 font-medium">
                    {step.prompt}
                  </p>

                  <textarea
                    value={textContent}
                    onChange={(e) =>
                      setSectionsData({
                        ...sectionsData,
                        [step.key]: e.target.value,
                      })
                    }
                    onFocus={() => setFocusedSectionKey(step.key)}
                    onSelect={(e) => handleTextareaSelect(e, step.key)}
                    onMouseUp={(e) => handleTextareaSelect(e, step.key)}
                    onKeyUp={(e) => handleTextareaSelect(e, step.key)}
                    rows={4}
                    placeholder={step.placeholder}
                    className="w-full text-sm p-3.5 rounded-2xl border border-slate-200 text-slate-800 placeholder:text-slate-400 outline-none focus:border-amber-500 transition-colors resize-y leading-relaxed font-sans"
                  />

                  {/* Selected Word Synonym Shortcut Bar */}
                  {selectedWord.trim() && focusedSectionKey === step.key && (
                    <div className="mt-2 p-2 px-3 bg-amber-50 rounded-xl border border-amber-300 flex items-center justify-between text-xs animate-in fade-in duration-150">
                      <div className="flex items-center gap-1.5 text-amber-950 font-bold truncate">
                        <span>📖</span>
                        <span className="truncate">
                          Palavra selecionada: <strong className="text-amber-800 underline font-black">"{selectedWord}"</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            sound.playPop();
                            setSidebarToolTab('dictionary');
                            setShowDictionaryModal(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <span>Ver Sinônimos 🔄</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedWord('');
                            setSelectedRange(null);
                          }}
                          className="w-5 h-5 rounded-full text-slate-400 hover:text-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                          title="Limpar seleção"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  {step.helperHint && (
                    <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{step.helperHint}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Helper, Connectives Wand, Quality Checklist, Cover Customizer (1/3 width) */}
        <div className="space-y-5">
          {/* AI Story Assistant Callout */}
          <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 text-white shadow-md shadow-orange-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧙‍♂️</span>
                <h4 className="font-extrabold text-sm font-display tracking-wide">
                  Ajuda da IA do Mago
                </h4>
              </div>
              <span className="text-[10px] bg-white/20 font-bold px-2 py-0.5 rounded-full border border-white/30">
                Tutor Criativo
              </span>
            </div>
            <p className="text-xs text-amber-100 font-medium leading-relaxed">
              Travou em alguma parte? A IA lê suas cartas sorteadas e seu texto para sugerir continuações incríveis!
            </p>
            <button
              type="button"
              onClick={() => handleOpenAiHelp(focusedSectionKey)}
              className="w-full py-2.5 px-3 rounded-2xl bg-white text-slate-900 font-black text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-transform hover:scale-102 active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Pedir Ideias da IA ✨</span>
            </button>
          </div>

          {/* Writing Tools Tabs: Dicionário de Apoio vs Varinha dos Conectivos */}
          <div className="flex p-1 rounded-2xl bg-slate-200/90 border border-slate-300 text-xs font-black">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setSidebarToolTab('dictionary');
              }}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                sidebarToolTab === 'dictionary'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📖</span>
              <span>Dicionário de Apoio</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setSidebarToolTab('connectives');
              }}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                sidebarToolTab === 'connectives'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🪄</span>
              <span>Varinha dos Conectivos</span>
            </button>
          </div>

          {/* Dicionário de Apoio Component */}
          {sidebarToolTab === 'dictionary' && (
            <SupportDictionary
              selectedWord={selectedWord}
              sentenceContext={sentenceContext}
              onReplaceSelectedWord={handleReplaceSelectedWord}
              onInsertWord={handleInsertWord}
            />
          )}

          {/* Connectives Wand Panel */}
          {sidebarToolTab === 'connectives' && (
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-purple-600" />
                  <h4 className="font-extrabold text-sm text-slate-900 font-display">
                    Varinha dos Conectivos
                  </h4>
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                  1 clique para inserir
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Clique em qualquer conectivo para adicionar na parte em que você está escrevendo:
              </p>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {activeGenre.connectives.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                      {group.category}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {group.words.map((word) => (
                        <button
                          key={word}
                          type="button"
                          onClick={() => handleInsertConnective(word)}
                          className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
                        >
                          + {word}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grammar & Quality Checklist */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200">
            <h4 className="font-extrabold text-sm text-slate-900 font-display flex items-center gap-1.5 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Inspetor de Qualidade do Texto
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${checks.hasTitle ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {checks.hasTitle ? '✓' : '•'}
                </span>
                <span className={checks.hasTitle ? 'text-slate-800 font-semibold' : 'text-slate-500'}>
                  Título criativo definido
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${checks.hasMinWords ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {checks.hasMinWords ? '✓' : '•'}
                </span>
                <span className={checks.hasMinWords ? 'text-slate-800 font-semibold' : 'text-slate-500'}>
                  Mais de 40 palavras ({totalWords} palavras escritas)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${checks.hasCapitalLetters ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {checks.hasCapitalLetters ? '✓' : '•'}
                </span>
                <span className={checks.hasCapitalLetters ? 'text-slate-800 font-semibold' : 'text-slate-500'}>
                  Iniciou com letra maiúscula
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${checks.hasPunctuation ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {checks.hasPunctuation ? '✓' : '•'}
                </span>
                <span className={checks.hasPunctuation ? 'text-slate-800 font-semibold' : 'text-slate-500'}>
                  Usou pontuação (. ! ?)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${checks.hasUsedConnective ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {checks.hasUsedConnective ? '✓' : '•'}
                </span>
                <span className={checks.hasUsedConnective ? 'text-slate-800 font-semibold' : 'text-slate-500'}>
                  Enriqueceu com conectivos
                </span>
              </div>
            </div>
          </div>

          {/* Book Cover Customizer */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 font-display flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" />
              Capa do Livro
            </h4>

            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Ícone da Capa:</label>
              <div className="flex flex-wrap gap-1.5">
                {coverEmojisList.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setCoverEmoji(em);
                    }}
                    className={`w-8 h-8 rounded-xl border text-base flex items-center justify-center cursor-pointer transition-transform ${
                      coverEmoji === em ? 'border-amber-500 bg-amber-100 scale-110 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Cor de Fundo da Capa:</label>
              <div className="grid grid-cols-2 gap-1.5">
                {coverGradients.map((grad) => (
                  <button
                    key={grad.value}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setCoverBg(grad.value);
                    }}
                    className={`p-2 rounded-xl text-left text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      coverBg === grad.value ? 'border-slate-800 bg-slate-100 ring-1 ring-slate-800' : 'border-slate-200'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${grad.value} shrink-0`} />
                    <span className="truncate">{grad.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PDF Export & Print Panel */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-900 font-display flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                Salvar ou Imprimir em PDF
              </h4>
              <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                Folha A4
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Gere um documento formatado com cabeçalho oficial, suas cartas sorteadas e espaço para a nota do(a) professor(a)!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="w-full py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-102 active:scale-98"
                title="Baixar arquivo PDF diretamente para o seu computador ou celular"
              >
                <Download className="w-4 h-4" />
                <span>Baixar PDF (.pdf)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setShowPdfModal(true);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-102 active:scale-98"
                title="Pré-visualizar como a folha ficará impressa"
              >
                <Eye className="w-4 h-4 text-slate-600" />
                <span>Visualizar Folha</span>
              </button>
            </div>
          </div>

          {/* Save / Publish Story Button */}
          <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 text-white text-center shadow-lg shadow-orange-500/25 space-y-3">
            <h4 className="font-display font-extrabold text-base">
              Pronto para Publicar?
            </h4>
            <p className="text-xs text-amber-100">
              Salvar sua história rende <strong>+150 XP</strong>, <strong>+60 Moedas</strong> e adiciona um novo volume à sua estante mágica!
            </p>
            <button
              onClick={handleSaveAndPublishToMural}
              disabled={isSavingToMural}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-200 hover:from-amber-400 hover:to-yellow-300 text-slate-900 font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border-2 border-white/80"
            >
              <Send className="w-4 h-4 text-orange-600" />
              <span>{isSavingToMural ? 'Publicando no Firebase...' : 'Salvar & Publicar no Mural 🌟'}</span>
            </button>

            <button
              onClick={handleSave}
              className="w-full py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-white/40"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Apenas na Minha Estante</span>
            </button>
          </div>
        </div>
      </div>

      {/* PDF / Print Preview Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 font-display flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Visualização da Folha de Redação A4
                </h3>
                <p className="text-xs text-slate-500">
                  Pronto para exportar em formato PDF ou imprimir para entregar na escola.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    window.print();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPdfModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Document Sheet Simulation */}
            <div className="p-6 sm:p-10 overflow-y-auto bg-slate-100 flex justify-center">
              <div className="bg-white w-full max-w-2xl p-6 sm:p-10 shadow-lg border border-slate-300 rounded-sm text-slate-900 font-sans space-y-6">
                {/* Top Colored Accent Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-emerald-400 via-sky-400 to-rose-400 -mt-2 mb-4" />

                {/* Institutional Header */}
                <div className="text-center border-b border-slate-200 pb-3">
                  <span className="text-[10px] font-black tracking-widest uppercase text-slate-500 block">
                    ALFABETIZA MT • SEDUC GOVERNO DE MATO GROSSO
                  </span>
                  <p className="text-[9px] text-slate-400">
                    Oficina de Redação & Produção de Gêneros Textuais (3º ao 5º Ano)
                  </p>
                </div>

                {/* Title & Metadata */}
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    Gênero: {activeGenre.name}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-display">
                    {title.trim() || 'Título da História'}
                  </h2>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-4">
                    <span><strong>Autor(a):</strong> {authorName || progress.studentName}</span>
                    <span><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                {/* Cards Used Box */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 block">
                    Elementos Sorteados (Monte Sua História):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                    <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                      <strong>Personagem:</strong> {currentDrawnCards.personagem?.text || 'Não sorteado'}
                    </div>
                    <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                      <strong>Lugar:</strong> {currentDrawnCards.lugar?.text || 'Não sorteado'}
                    </div>
                    <div className="p-1.5 bg-sky-50 rounded-lg border border-sky-200 text-sky-900">
                      <strong>Ação:</strong> {currentDrawnCards.acao?.text || 'Não sorteado'}
                    </div>
                    <div className="p-1.5 bg-rose-50 rounded-lg border border-rose-200 text-rose-900">
                      <strong>Complemento:</strong> {currentDrawnCards.complemento?.text || 'Não sorteado'}
                    </div>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-4 pt-1">
                  {activeGenre.structure.map((step, idx) => {
                    const text = sectionsData[step.key] || '';
                    return (
                      <div key={step.key} className="space-y-1">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          <span className="w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[9px]">
                            {idx + 1}
                          </span>
                          {step.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line pl-3 border-l-2 border-slate-200">
                          {text.trim() || <span className="text-slate-400 italic font-normal">Nenhum texto informado nesta parte...</span>}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Teacher evaluation line */}
                <div className="pt-6 border-t border-slate-200 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="w-full sm:w-auto">
                    <span>Visto do(a) Professor(a): ________________________________</span>
                  </div>
                  <div>
                    <span>Nota: [   ] ⭐⭐⭐⭐⭐</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between no-print">
              <span className="text-xs text-slate-500">
                O arquivo é gerado em tamanho A4 pronto para impressão.
              </span>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Story Assistant Modal */}
      <AiStoryAssistantModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        genreName={activeGenre.name}
        storyTitle={title}
        authorName={authorName || progress.studentName}
        currentSectionKey={focusedSectionKey}
        currentSectionTitle={activeGenre.structure.find((s) => s.key === focusedSectionKey)?.title || 'Seção Atual'}
        currentSectionPrompt={activeGenre.structure.find((s) => s.key === focusedSectionKey)?.prompt || ''}
        currentSectionContent={sectionsData[focusedSectionKey] || ''}
        cards={currentDrawnCards}
        sections={activeGenre.structure.map((s) => ({
          key: s.key,
          title: s.title,
          content: sectionsData[s.key] || '',
        }))}
        onApplySuggestion={handleApplyAiSuggestion}
      />

      {/* Support Dictionary Modal */}
      {showDictionaryModal && (
        <SupportDictionary
          isModal={true}
          onClose={() => setShowDictionaryModal(false)}
          selectedWord={selectedWord}
          sentenceContext={sentenceContext}
          onReplaceSelectedWord={handleReplaceSelectedWord}
          onInsertWord={handleInsertWord}
        />
      )}
    </div>
  );
};
