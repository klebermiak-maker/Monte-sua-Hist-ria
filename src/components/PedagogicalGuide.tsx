import React, { useState } from 'react';
import {
  GraduationCap,
  Printer,
  BookOpen,
  Sparkles,
  Layers,
  Users,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { OFFICIAL_STORY_CARDS, CATEGORY_INFO } from '../data/storyCards';
import { sound } from '../utils/audio';

export const PedagogicalGuide: React.FC = () => {
  const [printDeckMode, setPrintDeckMode] = useState(false);

  const handlePrint = () => {
    sound.playPop();
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-500/30">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            Orientações Oficiais • Alfabetiza MT
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            Guia Pedagógico: Monte Sua História
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
            Material didático voltado ao desenvolvimento da criatividade, oralidade e produção escrita de narrativas para alunos do 3º ao 5º ano do Ensino Fundamental.
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => {
              setPrintDeckMode(!printDeckMode);
              sound.playPop();
            }}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>{printDeckMode ? 'Voltar às Orientações' : 'Imprimir 40 Cartas para Sala'}</span>
          </button>
        </div>
      </div>

      {/* Mode: Printable 40-Card Deck for Classroom Paper Cutting */}
      {printDeckMode ? (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 flex items-center justify-between no-print">
            <div>
              <strong>Modo de Impressão de Cartas Ativado:</strong> As 40 cartas estão formatadas em grade com linhas de corte para uso físico em sala de aula.
            </div>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Imprimir Agora
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:gap-2">
            {OFFICIAL_STORY_CARDS.map((card, idx) => {
              const info = CATEGORY_INFO[card.category];
              return (
                <div
                  key={card.id + idx}
                  className="bg-white border-2 border-dashed border-slate-300 p-4 rounded-2xl flex flex-col justify-between min-h-[160px] text-center shadow-2xs print:border-slate-800 print:break-inside-avoid"
                >
                  <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400">
                    <span>{info.singularName}</span>
                    <span>#{idx + 1}</span>
                  </div>

                  <div className="my-2">
                    <span className="text-3xl block mb-1">{card.emoji}</span>
                    <p className="text-xs font-black text-slate-900 leading-snug">
                      {card.text}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[8px] text-slate-400">
                    Alfabetiza MT • SEDUC
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Pedagogical Instructions from the uploaded documents */
        <div className="space-y-6">
          {/* Section 1: Orientações Gerais */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 font-display flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              1. Objetivo Didático do Material
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              O material didático <strong>MONTE SUA HISTÓRIA</strong> tem como objetivo desenvolver a criatividade, a oralidade e a produção de narrativas por meio da combinação de cartas com personagens, lugares, ações e complementos. Ao criar histórias a partir dos elementos sorteados, os(as) estudantes usam a imaginação, organizam ideias, estabelecem relações entre os acontecimentos e exercitam a construção de narrativas coerentes, de forma lúdica, colaborativa e significativa.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                <span className="text-xs font-black uppercase block">10 Cartas</span>
                <h4 className="text-sm font-extrabold">Personagem</h4>
                <p className="text-[11px] text-amber-800 mt-1">
                  Quem participa e protagoniza o enredo.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <span className="text-xs font-black uppercase block">10 Cartas</span>
                <h4 className="text-sm font-extrabold">Lugar</h4>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Onde a aventura e o enredo acontecem.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900">
                <span className="text-xs font-black uppercase block">10 Cartas</span>
                <h4 className="text-sm font-extrabold">Ação</h4>
                <p className="text-[11px] text-sky-800 mt-1">
                  O que os personagens decidem fazer.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
                <span className="text-xs font-black uppercase block">10 Cartas</span>
                <h4 className="text-sm font-extrabold">Complemento</h4>
                <p className="text-[11px] text-rose-800 mt-1">
                  O mistério, reviravolta ou desfecho.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Três Modos de Utilização */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 font-display flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              2. Como Utilizar: 3 Metodologias Ativas
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Opção 1 – História Individual
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>O(A) estudante retira uma carta de cada categoria (4 cartas no total).</li>
                  <li>Após observar os quatro elementos sorteados, cria a sua história e conta oralmente para a turma e/ou faz o registro escrito.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Opção 2 – História Coletiva (Roda de Conversa)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Organize a turma em círculo.</li>
                  <li>O(A) professor(a) ou um(a) estudante retira uma carta e inicia oralmente a narrativa.</li>
                  <li>Cada participante seguinte retira uma nova carta e continua a história, incorporando o novo elemento ao enredo.</li>
                  <li>A atividade prossegue até que todos(as) tenham participado. Ao final, com ajuda da turma, faz-se o registro escrito no quadro ou na oficina digital.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Opção 3 – Desafio Criativo
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Cada estudante ou grupo retira duas cartas de cada categoria.</li>
                  <li>Em seguida, escolhe quais elementos utilizará para produzir a narrativa.</li>
                  <li>Essa versão aumenta o desafio e amplia as possibilidades de criação.</li>
                  <li>Após a construção oral ou escrita, os estudantes podem ilustrá-la e compartilhar no mural da sala.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Orientações ao Professor & BNCC */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 font-display flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              3. Orientações Pedagógicas & Alinhamento BNCC
            </h3>

            <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                • <strong>Antes da atividade:</strong> Converse com a turma sobre os elementos que compõem uma narrativa: personagens, espaço, tempo, conflito e desfecho.
              </p>
              <p>
                • <strong>Durante a produção das histórias:</strong> Incentive os(as) estudantes a justificar as escolhas feitas, ampliar os detalhes da narrativa e utilizar conectivos para garantir a sequência lógica dos acontecimentos.
              </p>
              <p>
                • <strong>Lembrete importante:</strong> Não existe apenas uma história correta. O mais importante é que se estabeleça relações coerentes entre os elementos sorteados, com organização das ideias para a produção de narrativas criativas, respeitando a sequência dos acontecimentos.
              </p>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
              <span className="font-black uppercase tracking-wider block text-[10px] text-emerald-700">
                Habilidades Desenvolvidas na BNCC (Língua Portuguesa):
              </span>
              <p>• <strong>EF15LP05:</strong> Planejar, com a ajuda do professor, o texto que será produzido, considerando a situação comunicativa.</p>
              <p>• <strong>EF35LP25:</strong> Criar narrativas ficcionais, utilizando detalhes de cenário e personagens, marcadores de tempo e espaço.</p>
              <p>• <strong>EF35LP08:</strong> Utilizar conectivos e pontuação adequada para articular partes do texto.</p>
              <p>• <strong>EF04LP05 / EF05LP04:</strong> Identificar e empregar concordância verbal/nominal e pontuação expressiva.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
