import React, { useState } from 'react';
import {
  Library,
  BookOpen,
  Award,
  Printer,
  Trash2,
  Share2,
  Calendar,
  User,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Download,
} from 'lucide-react';
import { useGame, SavedStory } from '../context/GameContext';
import { sound } from '../utils/audio';
import { generateStoryPdf } from '../utils/pdfExport';
import { publishStoryToMural } from '../services/muralService';
import { getTurmaColor, formatTurmaLabel } from '../data/studentProfile';

export const LibraryView: React.FC = () => {
  const { savedStories, deleteStory, progress, setActiveTab, addXpAndCoins, triggerConfetti } = useGame();

  const [selectedStory, setSelectedStory] = useState<SavedStory | null>(
    savedStories.length > 0 ? savedStories[0] : null
  );
  const [showCertificate, setShowCertificate] = useState(false);

  const handleDownloadSelectedPdf = () => {
    if (!selectedStory) return;
    sound.playSuccess();
    const doc = generateStoryPdf({
      title: selectedStory.title,
      author: selectedStory.author,
      studentGrade: selectedStory.studentGrade,
      studentClass: selectedStory.studentClass,
      studentTurma: selectedStory.studentTurma,
      schoolName: selectedStory.schoolName,
      genreName: selectedStory.genreName,
      createdAt: selectedStory.createdAt,
      cards: selectedStory.cards,
      sections: selectedStory.sections,
    });
    const sanitizedFileName = (selectedStory.title || 'historia')
      .toLowerCase()
      .replace(/[^a-z0-9áéíóúâêôãõç]/gi, '_');
    doc.save(`${sanitizedFileName}.pdf`);
  };

  const handlePrint = () => {
    sound.playPop();
    window.print();
  };

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishToMural = async () => {
    if (!selectedStory) return;
    setIsPublishing(true);
    sound.playMagic();
    const grade = selectedStory.studentGrade || progress.studentGrade || '4';
    const classLetter = selectedStory.studentClass || progress.studentClass || 'B';
    const turmaStr = selectedStory.studentTurma || formatTurmaLabel(grade, classLetter);

    try {
      await publishStoryToMural({
        title: selectedStory.title,
        author: selectedStory.author || progress.studentName,
        studentGrade: String(grade),
        studentClass: String(classLetter),
        studentTurma: turmaStr,
        schoolName: selectedStory.schoolName || progress.schoolName,
        authorUid: progress.studentName || 'aluno',
        genreId: selectedStory.genreId,
        genreName: selectedStory.genreName,
        createdAt: selectedStory.createdAt,
        coverEmoji: selectedStory.coverEmoji,
        coverBg: selectedStory.coverBg,
        wordCount: selectedStory.wordCount || 0,
        cards: selectedStory.cards,
        sections: selectedStory.sections,
      });
      sound.playFanfare();
      triggerConfetti();
      addXpAndCoins(100, 40);
      alert('🌟 História publicada com sucesso no Mural das Histórias (salva no Firebase)!');
      setActiveTab('mural');
    } catch (err) {
      alert('Erro ao publicar no Firebase. Tente novamente.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2">
            <Library className="w-6 h-6 text-emerald-600" />
            Minha Estante de Livros & Histórias
          </h2>
          <p className="text-xs text-slate-500">
            Todas as histórias escritas e publicadas por você e sua turma ficam guardadas aqui.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setActiveTab('workshop');
          }}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 cursor-pointer self-start sm:self-auto transition-transform hover:scale-105"
        >
          + Escrever Nova História
        </button>
      </div>

      {savedStories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-md mx-auto space-y-3 no-print">
          <span className="text-5xl block animate-bounce">📚</span>
          <h3 className="font-extrabold text-lg text-slate-900">Sua estante ainda está vazia!</h3>
          <p className="text-xs text-slate-500">
            Vá até a Oficina de Escrita ou sorteie cartas para produzir sua primeira obra e ganhar recompensas.
          </p>
          <button
            onClick={() => setActiveTab('draw')}
            className="mt-2 px-6 py-2.5 rounded-2xl bg-slate-900 text-white font-extrabold text-xs cursor-pointer"
          >
            Sortear Cartas Agora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookshelf list (1/3) */}
          <div className="space-y-3 no-print">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
              Histórias Salvas ({savedStories.length})
            </span>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {savedStories.map((story) => {
                const isSelected = selectedStory?.id === story.id;

                return (
                  <div
                    key={story.id}
                    onClick={() => {
                      sound.playCardFlip();
                      setSelectedStory(story);
                      setShowCertificate(false);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${story.coverBg} flex items-center justify-center text-2xl shadow-xs shrink-0 text-white`}
                      >
                        {story.coverEmoji}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 truncate">
                          {story.title}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <p className="text-[10px] text-slate-500 truncate">
                            Por: {story.author}
                          </p>
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.2 rounded-md border ${getTurmaColor(story.studentGrade).badgeBg} ${getTurmaColor(story.studentGrade).badgeText} ${getTurmaColor(story.studentGrade).badgeBorder}`}
                          >
                            🎒 {story.studentTurma || (story.studentGrade ? `${story.studentGrade}º Ano ${story.studentClass || ''}` : '4º Ano B')}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 block mt-0.5">
                          {story.createdAt} • {story.genreName.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Deseja mesmo excluir "${story.title}"?`)) {
                          deleteStory(story.id);
                          if (selectedStory?.id === story.id) {
                            setSelectedStory(savedStories.find((s) => s.id !== story.id) || null);
                          }
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                      title="Excluir história"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reader / Certificate Mode (2/3) */}
          <div className="lg:col-span-2">
            {selectedStory && (
              <div className="space-y-4">
                {/* Actions Toolbar (hidden in print) */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs no-print">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCertificate(false)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        !showCertificate
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      📖 Ler Livro
                    </button>
                    <button
                      onClick={() => {
                        sound.playFanfare();
                        setShowCertificate(true);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        showCertificate
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Ver Certificado de Autor</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handlePublishToMural}
                      disabled={isPublishing}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer transition-transform hover:scale-102 active:scale-98 disabled:opacity-50"
                      title="Publicar esta história no Mural das Histórias para toda a turma ler (salva no Firebase)"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{isPublishing ? 'Publicando...' : 'Publicar no Mural 🌟'}</span>
                    </button>

                    <button
                      onClick={handleDownloadSelectedPdf}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                      title="Baixar história selecionada em PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar PDF</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir</span>
                    </button>
                  </div>
                </div>

                {/* Displaying Certificate */}
                {showCertificate ? (
                  <div className="bg-amber-50 rounded-3xl p-8 sm:p-12 border-8 border-double border-amber-400 shadow-xl text-center space-y-6 relative overflow-hidden">
                    <div className="absolute top-4 left-4 text-4xl opacity-30 select-none">⭐</div>
                    <div className="absolute top-4 right-4 text-4xl opacity-30 select-none">⭐</div>
                    <div className="absolute bottom-4 left-4 text-4xl opacity-30 select-none">⭐</div>
                    <div className="absolute bottom-4 right-4 text-4xl opacity-30 select-none">⭐</div>

                    <div className="space-y-1">
                      <span className="text-xs font-extrabold tracking-widest uppercase text-amber-800">
                        Governo do Estado de Mato Grosso • Alfabetiza MT
                      </span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-amber-950 font-display">
                        Certificado de Pequeno(a) Autor(a)
                      </h2>
                      <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mt-2" />
                    </div>

                    <div className="max-w-xl mx-auto space-y-4 text-slate-800 leading-relaxed font-sans text-sm sm:text-base">
                      <p>Certificamos com muito orgulho e louvor que</p>
                      <p className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-display underline decoration-amber-400 decoration-wavy">
                        {selectedStory.author}
                      </p>
                      <p className="text-xs font-bold text-amber-800">
                        🎒 Aluno(a) do {selectedStory.studentTurma || (selectedStory.studentGrade ? `${selectedStory.studentGrade}º Ano ${selectedStory.studentClass || ''}` : '4º Ano B')} • {selectedStory.schoolName || 'Escola Municipal Alfabetiza MT'}
                      </p>
                      <p>
                        escreveu e publicou a extraordinária obra literária intitulada:
                      </p>
                      <p className="text-lg sm:text-xl font-black text-slate-900 bg-white/80 py-2.5 px-4 rounded-2xl border border-amber-300 shadow-xs inline-block">
                        "{selectedStory.title}"
                      </p>
                      <p className="text-xs text-slate-600">
                        Demonstrando criatividade, domínio de conectivos, organização em parágrafos e respeito à gramática da Língua Portuguesa (BNCC 3º ao 5º Ano).
                      </p>
                    </div>

                    <div className="pt-6 border-t border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-md mx-auto text-xs text-slate-600">
                      <div className="text-center">
                        <div className="w-32 border-b border-slate-400 mb-1" />
                        <span className="font-bold">Professor(a) / Orientador(a)</span>
                      </div>
                      <div className="text-center">
                        <div className="w-32 border-b border-slate-400 mb-1" />
                        <span className="font-bold">Data: {selectedStory.createdAt}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Displaying Book Reader */
                  <article className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6">
                    {/* Story Cover Header */}
                    <header className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${selectedStory.coverBg} flex items-center justify-center text-3xl shadow-md text-white shrink-0`}
                        >
                          {selectedStory.coverEmoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              {selectedStory.genreName}
                            </span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${getTurmaColor(selectedStory.studentGrade).badgeBg} ${getTurmaColor(selectedStory.studentGrade).badgeText} ${getTurmaColor(selectedStory.studentGrade).badgeBorder} flex items-center gap-0.5`}
                            >
                              🎒 {selectedStory.studentTurma || (selectedStory.studentGrade ? `${selectedStory.studentGrade}º Ano ${selectedStory.studentClass || ''}` : '4º Ano B')}
                            </span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-1">
                            {selectedStory.title}
                          </h2>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 font-semibold text-slate-700">
                              <User className="w-3.5 h-3.5" />
                              {selectedStory.author}
                            </span>
                            <span>•</span>
                            <span className="text-slate-500">
                              {selectedStory.schoolName || 'Alfabetiza MT'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {selectedStory.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    </header>

                    {/* Cards used badge strip */}
                    {selectedStory.cards && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                          Elementos Sorteados da História:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {selectedStory.cards.personagem && (
                            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold flex items-center gap-1.5">
                              <span>{selectedStory.cards.personagem.emoji}</span>
                              <span className="truncate">{selectedStory.cards.personagem.text}</span>
                            </div>
                          )}
                          {selectedStory.cards.lugar && (
                            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold flex items-center gap-1.5">
                              <span>{selectedStory.cards.lugar.emoji}</span>
                              <span className="truncate">{selectedStory.cards.lugar.text}</span>
                            </div>
                          )}
                          {selectedStory.cards.acao && (
                            <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 font-bold flex items-center gap-1.5">
                              <span>{selectedStory.cards.acao.emoji}</span>
                              <span className="truncate">{selectedStory.cards.acao.text}</span>
                            </div>
                          )}
                          {selectedStory.cards.complemento && (
                            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 font-bold flex items-center gap-1.5">
                              <span>{selectedStory.cards.complemento.emoji}</span>
                              <span className="truncate">{selectedStory.cards.complemento.text}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Story Content Blocks */}
                    <div className="space-y-6 pt-2">
                      {selectedStory.sections.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            {section.title}
                          </h3>
                          <div className="p-4 rounded-2xl bg-amber-50/20 border border-amber-100/60 text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans indent-4">
                            {section.content || <span className="text-slate-400 italic font-normal">Nenhum texto nesta seção.</span>}
                          </div>
                        </div>
                      ))}
                    </div>

                    <footer className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
                      ✨ Fim da História • Produzido na Oficina Monte Sua História (Alfabetiza MT) ✨
                    </footer>
                  </article>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
