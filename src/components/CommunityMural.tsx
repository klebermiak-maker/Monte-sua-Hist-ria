import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  BookOpen,
  Send,
  Search,
  Filter,
  Download,
  Share2,
  Calendar,
  User,
  Star,
  Award,
  PlusCircle,
  X,
  Flame,
  Check,
} from 'lucide-react';
import { useGame, SavedStory } from '../context/GameContext';
import { MuralStory, subscribeToMuralStories, publishStoryToMural, likeStoryOnMural } from '../services/muralService';
import { generateStoryPdf } from '../utils/pdfExport';
import { sound } from '../utils/audio';

export const CommunityMural: React.FC = () => {
  const { savedStories, progress, addXpAndCoins, setActiveTab, triggerConfetti } = useGame();

  const [muralStories, setMuralStories] = useState<MuralStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState('all');

  const [readingStory, setReadingStory] = useState<MuralStory | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Real-time Firestore subscription
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToMuralStories(
      (stories) => {
        setMuralStories(stories);
        setLoading(false);
      },
      (err) => {
        setError('Não foi possível conectar ao Firebase no momento.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLike = async (storyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedMap[storyId]) return;

    sound.playCoin();
    setLikedMap((prev) => ({ ...prev, [storyId]: true }));

    // Optimistic UI update
    setMuralStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, likesCount: (s.likesCount || 0) + 1 } : s))
    );

    if (readingStory && readingStory.id === storyId) {
      setReadingStory((prev) => (prev ? { ...prev, likesCount: (prev.likesCount || 0) + 1 } : null));
    }

    try {
      await likeStoryOnMural(storyId);
    } catch (err) {
      console.error('Falha ao curtir história no Firebase:', err);
    }
  };

  const handlePublishStory = async (story: SavedStory) => {
    setPublishingId(story.id);
    sound.playMagic();

    try {
      await publishStoryToMural({
        title: story.title,
        author: story.author || progress.studentName,
        authorUid: progress.studentName || 'aluno',
        genreId: story.genreId,
        genreName: story.genreName,
        createdAt: story.createdAt,
        coverEmoji: story.coverEmoji,
        coverBg: story.coverBg,
        wordCount: story.wordCount || 0,
        cards: story.cards,
        sections: story.sections,
      });

      sound.playFanfare();
      triggerConfetti();
      addXpAndCoins(100, 40);
      setShowPublishModal(false);
      alert('🌟 Parabéns! Sua história foi publicada com sucesso no Mural da Turma e salva no Firebase!');
    } catch (err: any) {
      alert('Erro ao publicar no Firebase. Tente novamente.');
    } finally {
      setPublishingId(null);
    }
  };

  const handleDownloadPdf = (story: MuralStory, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playSuccess();

    const doc = generateStoryPdf({
      title: story.title,
      author: story.author,
      genreName: story.genreName,
      createdAt: story.createdAt,
      cards: story.cards,
      sections: story.sections,
    });

    const sanitizedFileName = (story.title || 'historia_do_mural')
      .toLowerCase()
      .replace(/[^a-z0-9áéíóúâêôãõç]/gi, '_');

    doc.save(`${sanitizedFileName}.pdf`);
  };

  // Filtered stories
  const filteredStories = muralStories.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.author.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesGenre = selectedGenreFilter === 'all' || s.genreId === selectedGenreFilter;

    return matchesSearch && matchesGenre;
  });

  const totalLikes = muralStories.reduce((acc, s) => acc + (s.likesCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl select-none">🎨</div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black tracking-wide uppercase border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>Conexão em Tempo Real • Firebase Firestore</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              Mural das Histórias da Turma 🌟
            </h2>
            <p className="text-sm text-amber-100 max-w-xl font-medium leading-relaxed">
              Descubra as produções textuais criadas pelos colegas, curta as suas favoritas e compartilhe seus livros para todos lerem!
            </p>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              setShowPublishModal(true);
            }}
            className="px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-5 h-5 text-orange-600" />
            <span>Publicar Minha História 🚀</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3">
            <span className="text-2xl sm:text-3xl font-black">{muralStories.length}</span>
            <p className="text-xs text-amber-100 font-bold mt-0.5">Histórias no Mural</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3">
            <span className="text-2xl sm:text-3xl font-black">{totalLikes} ⭐</span>
            <p className="text-xs text-amber-100 font-bold mt-0.5">Estrelas Distribuídas</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 col-span-2 sm:col-span-1">
            <span className="text-2xl sm:text-3xl font-black">100% ☁️</span>
            <p className="text-xs text-amber-100 font-bold mt-0.5">Salvo na Nuvem</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Buscar por título ou autor..."
            className="w-full text-xs font-bold pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 outline-none focus:border-amber-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'Todos os Gêneros' },
            { id: 'narrativa', label: 'Aventura' },
            { id: 'fabula', label: 'Fábula' },
            { id: 'noticia', label: 'Notícia' },
            { id: 'carta_diario', label: 'Carta/Diário' },
            { id: 'tirinha', label: 'Tirinha' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                sound.playPop();
                setSelectedGenreFilter(item.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedGenreFilter === item.id
                  ? 'bg-amber-500 text-white shadow-xs scale-102'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Mural Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-sm font-bold text-slate-600">
            Carregando o Mural das Histórias do Firebase...
          </p>
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-300 space-y-4">
          <div className="text-5xl">📌</div>
          <h3 className="font-extrabold text-lg text-slate-800 font-display">
            Nenhuma história encontrada no Mural
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Seja o primeiro a publicar sua história para a turma toda ler e dar estrelas!
          </p>
          <button
            onClick={() => {
              sound.playPop();
              setShowPublishModal(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md cursor-pointer transition-transform hover:scale-105"
          >
            Publicar Primeira História 🚀
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStories.map((story) => {
            const isLiked = likedMap[story.id];

            return (
              <div
                key={story.id}
                onClick={() => {
                  sound.playCardFlip();
                  setReadingStory(story);
                }}
                className="group bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-400 p-5 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                {/* Decorative Pin */}
                <div className="absolute top-3 right-3 text-lg opacity-40 group-hover:opacity-100 transition-opacity">
                  📌
                </div>

                <div className="space-y-3">
                  {/* Header: Cover + Genre */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${story.coverBg} flex items-center justify-center text-3xl shadow-sm shrink-0`}
                    >
                      {story.coverEmoji}
                    </div>

                    <div className="min-w-0 pr-6">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        {story.genreName.split(' ')[0]}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 font-display truncate mt-1 group-hover:text-amber-700 transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        Por: {story.author}
                      </p>
                    </div>
                  </div>

                  {/* Cards Elements tags */}
                  {story.cards && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {story.cards.personagem && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 truncate max-w-[120px]">
                          {story.cards.personagem.emoji} {story.cards.personagem.text}
                        </span>
                      )}
                      {story.cards.lugar && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 truncate max-w-[120px]">
                          {story.cards.lugar.emoji} {story.cards.lugar.text}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Excerpt preview */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans pt-1">
                    {story.sections[0]?.content || story.sections[1]?.content || 'Uma emocionante história criada na oficina.'}
                  </p>
                </div>

                {/* Footer of Card */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleLike(story.id, e)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-rose-500 text-white scale-105 shadow-xs'
                          : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                      }`}
                      title="Curtir e enviar estrelas para o autor"
                    >
                      <Star className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                      <span>{story.likesCount || 0}</span>
                    </button>

                    <span className="text-[10px] text-slate-400 font-medium">
                      {story.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDownloadPdf(story, e)}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                      title="Baixar em PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <span className="text-xs font-extrabold text-amber-600 hover:underline">
                      Ler 📖
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Story Reader Modal */}
      {readingStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-amber-300 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${readingStory.coverBg} flex items-center justify-center text-2xl shadow-xs`}
                >
                  {readingStory.coverEmoji}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    {readingStory.genreName}
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
                    {readingStory.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Autor(a): {readingStory.author} • Publicado em {readingStory.createdAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleLike(readingStory.id, e)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black flex items-center gap-1 cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>{readingStory.likesCount || 0} Curtidas</span>
                </button>

                <button
                  onClick={() => setReadingStory(null)}
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Story Sections */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-amber-50/30 font-sans">
              {/* Cards Reference Box */}
              {readingStory.cards && (
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Cartas Usadas pelo Autor:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-semibold">
                    {readingStory.cards.personagem && (
                      <span className="text-amber-900">
                        {readingStory.cards.personagem.emoji} {readingStory.cards.personagem.text}
                      </span>
                    )}
                    {readingStory.cards.lugar && (
                      <span className="text-emerald-900">
                        {readingStory.cards.lugar.emoji} {readingStory.cards.lugar.text}
                      </span>
                    )}
                    {readingStory.cards.acao && (
                      <span className="text-sky-900">
                        {readingStory.cards.acao.emoji} {readingStory.cards.acao.text}
                      </span>
                    )}
                    {readingStory.cards.complemento && (
                      <span className="text-rose-900">
                        {readingStory.cards.complemento.emoji} {readingStory.cards.complemento.text}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Sections Narrative */}
              <div className="space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                {readingStory.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      {sec.title}
                    </h4>
                    <p className="text-sm text-slate-800 leading-relaxed pl-3 border-l-2 border-amber-400 whitespace-pre-line font-serif">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
              <button
                onClick={() => handleDownloadPdf(readingStory)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Baixar PDF da História</span>
              </button>

              <button
                onClick={() => setReadingStory(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Fechar Leitura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Selector Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-2 border-amber-300 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 font-display">
                    Publicar no Mural da Turma
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sua história será salva no Firebase para toda a turma ler!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPublishModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {savedStories.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-xs text-slate-600">
                  Você ainda não salvou nenhuma história na sua biblioteca pessoal.
                </p>
                <button
                  onClick={() => {
                    setShowPublishModal(false);
                    setActiveTab('workshop');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white font-extrabold text-xs shadow-xs cursor-pointer"
                >
                  Ir para a Oficina de Escrita ✍️
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                <p className="text-xs text-slate-600 font-medium">
                  Escolha qual história deseja salvar no Firebase e compartilhar:
                </p>
                {savedStories.map((story) => (
                  <div
                    key={story.id}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-white flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl">{story.coverEmoji}</span>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 truncate">
                          {story.title}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {story.genreName} • {story.createdAt}
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={publishingId === story.id}
                      onClick={() => handlePublishStory(story)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1 shrink-0"
                    >
                      {publishingId === story.id ? (
                        <span>Salvando...</span>
                      ) : (
                        <>
                          <span>Publicar</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
