export type SchoolGrade = '3' | '4' | '5';
export type SchoolClassLetter = 'A' | 'B' | 'C' | 'D' | 'E';

export interface StudentProfile {
  name: string;
  grade: SchoolGrade;
  classLetter: SchoolClassLetter;
  schoolName?: string;
}

export interface GradeOption {
  grade: SchoolGrade;
  label: string;
  shortLabel: string;
  stageName: string;
  emoji: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
  bnccFocus: string;
}

export const GRADE_OPTIONS: GradeOption[] = [
  {
    grade: '3',
    label: '3º Ano (Terceiro Ano)',
    shortLabel: '3º Ano',
    stageName: 'Ensino Fundamental I',
    emoji: '🌱',
    colorClass: 'emerald',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-300',
    description: 'Consolidação da alfabetização, pontuação e histórias com começo, meio e fim.',
    bnccFocus: 'BNCC: EF35LP01, EF35LP07, EF35LP09 • Produção de pequenos textos e parágrafos',
  },
  {
    grade: '4',
    label: '4º Ano (Quarto Ano)',
    shortLabel: '4º Ano',
    stageName: 'Ensino Fundamental I',
    emoji: '🚀',
    colorClass: 'amber',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-300',
    description: 'Expansão de vocabulário, uso de conectivos, concordância e diálogos ricos.',
    bnccFocus: 'BNCC: EF35LP25, EF35LP26, EF04LP05 • Narrativas com conflito e clímax expressivo',
  },
  {
    grade: '5',
    label: '5º Ano (Quinto Ano)',
    shortLabel: '5º Ano',
    stageName: 'Ensino Fundamental I',
    emoji: '🌟',
    colorClass: 'purple',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    badgeBorder: 'border-purple-300',
    description: 'Autonomia autoral, variedade de gêneros, coesão textual e revisão crítica.',
    bnccFocus: 'BNCC: EF35LP27, EF05LP04, EF05LP26 • Domínio dos gêneros textuais e autoria',
  },
];

export const CLASS_LETTERS: SchoolClassLetter[] = ['A', 'B', 'C', 'D', 'E'];

export function formatTurmaLabel(grade: SchoolGrade | string, classLetter: SchoolClassLetter | string): string {
  const g = grade ? `${grade}º Ano` : '4º Ano';
  const c = classLetter || 'A';
  return `${g} ${c}`;
}

export function getTurmaColor(grade?: string): {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accent: string;
} {
  switch (grade) {
    case '3':
      return {
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-300',
        accent: 'from-emerald-500 to-teal-600',
      };
    case '4':
      return {
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-300',
        accent: 'from-amber-500 to-orange-600',
      };
    case '5':
      return {
        badgeBg: 'bg-purple-50',
        badgeText: 'text-purple-700',
        badgeBorder: 'border-purple-300',
        accent: 'from-purple-500 to-indigo-600',
      };
    default:
      return {
        badgeBg: 'bg-sky-50',
        badgeText: 'text-sky-700',
        badgeBorder: 'border-sky-300',
        accent: 'from-sky-500 to-blue-600',
      };
  }
}
