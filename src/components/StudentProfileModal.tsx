import React, { useState } from 'react';
import {
  X,
  Check,
  GraduationCap,
  Sparkles,
  School,
  User,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import {
  SchoolGrade,
  SchoolClassLetter,
  GRADE_OPTIONS,
  CLASS_LETTERS,
  formatTurmaLabel,
  getTurmaColor,
} from '../data/studentProfile';
import { AVATARS } from '../data/rewards';
import { sound } from '../utils/audio';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ isOpen, onClose }) => {
  const { progress, updateStudentProfile, triggerConfetti } = useGame();

  const [name, setName] = useState(progress.studentName);
  const [grade, setGrade] = useState<SchoolGrade>(progress.studentGrade || '4');
  const [classLetter, setClassLetter] = useState<SchoolClassLetter>(progress.studentClass || 'B');
  const [schoolName, setSchoolName] = useState(progress.schoolName || 'Escola Municipal Alfabetiza MT');

  if (!isOpen) return null;

  const currentAvatarObj = AVATARS.find((a) => a.id === progress.currentAvatar) || AVATARS[0];
  const selectedGradeInfo = GRADE_OPTIONS.find((g) => g.grade === grade) || GRADE_OPTIONS[1];
  const turmaStyle = getTurmaColor(grade);
  const currentTurmaLabel = formatTurmaLabel(grade, classLetter);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Escritor(a) Mirim';
    updateStudentProfile(finalName, grade, classLetter, schoolName.trim());
    sound.playSuccess();
    triggerConfetti();
    onClose();
  };

  const handleSelectGrade = (g: SchoolGrade) => {
    sound.playPop();
    setGrade(g);
  };

  const handleSelectClass = (c: SchoolClassLetter) => {
    sound.playPop();
    setClassLetter(c);
  };

  const nameQuickPicks = ['Lucas', 'Beatriz', 'Gabriel', 'Sofia', 'Davi', 'Helena', 'Arthur', 'Alice'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight flex items-center gap-2">
                Crachá do(a) Aluno(a)
                <span className="text-xs bg-white/25 text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Turmas A ao E
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                Identificação escolar para produções, crachá oficial e Mural da Turma
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Live Badge Preview */}
          <div className="bg-gradient-to-br from-slate-50 to-amber-50/50 rounded-2xl p-4 sm:p-5 border-2 border-dashed border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Pré-visualização do Crachá Escolar:
              </span>
              <span className="text-[11px] font-bold text-slate-500">Alfabetiza MT</span>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-100 to-orange-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-sm shrink-0">
                {currentAvatarObj.emoji}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg font-black text-slate-900">
                    {name.trim() || 'Escritor(a) Mirim'}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-lg border ${turmaStyle.badgeBg} ${turmaStyle.badgeText} ${turmaStyle.badgeBorder}`}
                  >
                    🎒 {currentTurmaLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-semibold flex items-center justify-center sm:justify-start gap-1">
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  {schoolName || 'Escola Municipal de Ensino Fundamental'}
                </p>
                <p className="text-[11px] text-amber-700 font-medium">
                  {selectedGradeInfo.emoji} {selectedGradeInfo.description}
                </p>
              </div>
            </div>
          </div>

          {/* Student Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-600" />
              1. Nome Completo ou Apelido do(a) Aluno(a):
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pedro Henrique, Luísa Ferreira..."
              maxLength={40}
              className="w-full text-sm sm:text-base font-bold p-3.5 rounded-2xl border border-slate-300 text-slate-900 bg-slate-50 focus:bg-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
            />
            {/* Quick pick names */}
            <div className="flex items-center flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-bold mr-1">Exemplos rápidos:</span>
              {nameQuickPicks.map((pick) => (
                <button
                  type="button"
                  key={pick}
                  onClick={() => {
                    sound.playPop();
                    setName(pick);
                  }}
                  className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-600 transition-colors cursor-pointer border border-slate-200"
                >
                  {pick}
                </button>
              ))}
            </div>
          </div>

          {/* School Grade (3º, 4º ou 5º Ano) */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-orange-600" />
                2. Ano Escolar (Ensino Fundamental I):
              </span>
              <span className="text-[11px] text-slate-500 lowercase font-medium">selecione um</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {GRADE_OPTIONS.map((opt) => {
                const isSelected = grade === opt.grade;
                return (
                  <button
                    type="button"
                    key={opt.grade}
                    onClick={() => handleSelectGrade(opt.grade)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-2xl">{opt.emoji}</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{opt.label}</h4>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-0.5">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Class Letter (Turmas A ao E) */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                3. Sua Turma (do A ao E):
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Turma selecionada: {classLetter}</span>
            </label>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {CLASS_LETTERS.map((letter) => {
                const isSelected = classLetter === letter;
                return (
                  <button
                    type="button"
                    key={letter}
                    onClick={() => handleSelectClass(letter)}
                    className={`py-3 px-2 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-orange-500 bg-gradient-to-b from-orange-500 to-amber-500 text-white shadow-md transform scale-105'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span className="text-base sm:text-lg font-black">Turma {letter}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider ${
                        isSelected ? 'text-amber-100' : 'text-slate-400'
                      }`}
                    >
                      {grade}º {letter}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* School Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <School className="w-4 h-4 text-blue-600" />
              4. Nome da Escola (opcional para o cabeçalho do PDF e trabalhos):
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Ex: Escola Municipal Monteiro Lobato"
              maxLength={80}
              className="w-full text-xs sm:text-sm font-semibold p-3 rounded-2xl border border-slate-300 text-slate-800 bg-slate-50 focus:bg-white outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <Check className="w-4 h-4" />
              Salvar Identificação do(a) Aluno(a)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
