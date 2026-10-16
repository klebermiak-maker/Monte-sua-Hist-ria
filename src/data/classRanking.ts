import { SchoolGrade, SchoolClassLetter, formatTurmaLabel } from './studentProfile';

export interface CollectiveBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'grammar' | 'writing' | 'cooperation';
}

export interface ClassActivityLog {
  id: string;
  studentName?: string;
  text: string;
  timeAgo: string;
  pointsAdded: number;
  type: 'grammar' | 'writing' | 'cooperation';
}

export interface ClassRankingItem {
  id: string; // e.g. "3-A", "4-B"
  grade: SchoolGrade;
  classLetter: SchoolClassLetter;
  label: string; // "3º Ano A"
  teacher: string;
  motto: string;
  mascotEmoji: string;
  mascotName: string;
  studentCount: number;
  grammarPoints: number;
  writingPoints: number;
  totalPoints: number;
  storiesCount: number;
  grammarQuestsCount: number;
  collaborativeStreak: number;
  collectiveBadges: CollectiveBadge[];
  recentActivities: ClassActivityLog[];
  weeklyGoalTarget: number;
  weeklyGoalCurrent: number;
}

export interface CheerMessage {
  id: string;
  classId: string;
  senderName: string;
  senderTurma: string;
  message: string;
  timestamp: string;
  likes: number;
  emoji: string;
}

// Initial collective badges available for turmas
export const COLLECTIVE_BADGES: Record<string, CollectiveBadge> = {
  ouro_escrita: {
    id: 'ouro_escrita',
    name: 'Fábrica de Histórias',
    icon: '📚',
    description: 'A sala produziu mais de 40 histórias completas com introdução, clímax e desfecho.',
    category: 'writing',
  },
  mestres_pontuacao: {
    id: 'mestres_pontuacao',
    name: 'Guardiões do Ponto Final',
    icon: '🎯',
    description: 'Mais de 150 acertos em pontuação expressiva (exclamação, interrogação e travessão).',
    category: 'grammar',
  },
  campeoes_coesao: {
    id: 'campeoes_coesao',
    name: 'Mestres dos Conectivos',
    icon: '🔗',
    description: 'Uso exemplar de elementos coesivos (então, logo depois, repentinamente).',
    category: 'writing',
  },
  ortografia_brilhante: {
    id: 'ortografia_brilhante',
    name: 'Esquadrão Ortográfico',
    icon: '✨',
    description: 'Domínio das regras de M antes de P e B, R/RR e concordância nominal.',
    category: 'grammar',
  },
  turma_solidaria: {
    id: 'turma_solidaria',
    name: 'Turma Hiper Colaborativa',
    icon: '🤝',
    description: 'Todos os alunos da sala participaram com pelo menos uma produção ou desafio.',
    category: 'cooperation',
  },
  diamante_leitura: {
    id: 'diamante_leitura',
    name: 'Exploradores de Gêneros',
    icon: '💎',
    description: 'Escreveram histórias em todos os 6 gêneros textuais do Alfabetiza MT.',
    category: 'writing',
  },
  desafio_mato_grosso: {
    id: 'desafio_mato_grosso',
    name: 'Orgulho de Mato Grosso',
    icon: '🌿',
    description: 'Histórias ambientadas no Pantanal, Chapada e Cerrado mato-grossense.',
    category: 'writing',
  },
};

// Base initial scores for the 15 classes (3º ao 5º ano, turmas A até E)
export const INITIAL_CLASSES_DATA: ClassRankingItem[] = [
  // --- 4º ANO (Destaque equilibrado) ---
  {
    id: '4-B',
    grade: '4',
    classLetter: 'B',
    label: '4º Ano B',
    teacher: 'Profª. Mariana Lima',
    motto: 'Palavras que Conectam Sonhos e Saberes',
    mascotEmoji: '🚀',
    mascotName: 'Foguetes da Imaginação',
    studentCount: 26,
    grammarPoints: 3420,
    writingPoints: 4180,
    totalPoints: 7600,
    storiesCount: 42,
    grammarQuestsCount: 168,
    collaborativeStreak: 12,
    weeklyGoalTarget: 8000,
    weeklyGoalCurrent: 7600,
    collectiveBadges: [
      COLLECTIVE_BADGES.ouro_escrita,
      COLLECTIVE_BADGES.mestres_pontuacao,
      COLLECTIVE_BADGES.campeoes_coesao,
    ],
    recentActivities: [
      { id: 'act-1', studentName: 'Lucas e Sofia', text: 'Completaram o desafio de Pontuação Expressiva', timeAgo: 'Há 15 min', pointsAdded: 120, type: 'grammar' },
      { id: 'act-2', studentName: 'Helena Ribeiro', text: 'Publicou a história "O Mistério do Lobo Guará"', timeAgo: 'Há 1 hora', pointsAdded: 150, type: 'writing' },
      { id: 'act-3', studentName: 'Turma Toda', text: 'Atingiram 40 contos coletivos no Mural!', timeAgo: 'Hoje de manhã', pointsAdded: 300, type: 'cooperation' },
    ],
  },
  {
    id: '5-A',
    grade: '5',
    classLetter: 'A',
    label: '5º Ano A',
    teacher: 'Prof. Carlos Eduardo',
    motto: 'Mestres da Coesão e Autores do Futuro',
    mascotEmoji: '🦁',
    mascotName: 'Leões Literários',
    studentCount: 28,
    grammarPoints: 3750,
    writingPoints: 3690,
    totalPoints: 7440,
    storiesCount: 39,
    grammarQuestsCount: 185,
    collaborativeStreak: 14,
    weeklyGoalTarget: 8000,
    weeklyGoalCurrent: 7440,
    collectiveBadges: [
      COLLECTIVE_BADGES.ortografia_brilhante,
      COLLECTIVE_BADGES.campeoes_coesao,
      COLLECTIVE_BADGES.turma_solidaria,
    ],
    recentActivities: [
      { id: 'act-4', studentName: 'Mateus Castro', text: 'Acertou 10 perguntas seguidas de Concordância Verbal', timeAgo: 'Há 25 min', pointsAdded: 140, type: 'grammar' },
      { id: 'act-5', studentName: 'Beatriz Almeida', text: 'Finalizou fábula "A Coruja e a Seriema"', timeAgo: 'Há 2 horas', pointsAdded: 150, type: 'writing' },
    ],
  },
  {
    id: '3-A',
    grade: '3',
    classLetter: 'A',
    label: '3º Ano A',
    teacher: 'Profª. Fernanda Duarte',
    motto: 'Primeiras Linhas, Grandes Aventuras',
    mascotEmoji: '🌱',
    mascotName: 'Brotinhos do Conhecimento',
    studentCount: 25,
    grammarPoints: 3120,
    writingPoints: 3980,
    totalPoints: 7100,
    storiesCount: 44,
    grammarQuestsCount: 152,
    collaborativeStreak: 10,
    weeklyGoalTarget: 7500,
    weeklyGoalCurrent: 7100,
    collectiveBadges: [
      COLLECTIVE_BADGES.ouro_escrita,
      COLLECTIVE_BADGES.turma_solidaria,
      COLLECTIVE_BADGES.desafio_mato_grosso,
    ],
    recentActivities: [
      { id: 'act-6', studentName: 'Pedro Henrique', text: 'Criou HQ sobre a fauna do Pantanal', timeAgo: 'Há 40 min', pointsAdded: 130, type: 'writing' },
      { id: 'act-7', studentName: 'Clara Santos', text: 'Superou a Trilha de Substantivos e Adjetivos', timeAgo: 'Há 3 horas', pointsAdded: 110, type: 'grammar' },
    ],
  },
  {
    id: '4-C',
    grade: '4',
    classLetter: 'C',
    label: '4º Ano C',
    teacher: 'Profª. Juliana Silva',
    motto: 'Criatividade Sem Fronteiras',
    mascotEmoji: '🦉',
    mascotName: 'Corujas Sábias',
    studentCount: 27,
    grammarPoints: 3340,
    writingPoints: 3510,
    totalPoints: 6850,
    storiesCount: 36,
    grammarQuestsCount: 162,
    collaborativeStreak: 9,
    weeklyGoalTarget: 7500,
    weeklyGoalCurrent: 6850,
    collectiveBadges: [
      COLLECTIVE_BADGES.mestres_pontuacao,
      COLLECTIVE_BADGES.diamante_leitura,
    ],
    recentActivities: [
      { id: 'act-8', studentName: 'Gabriel Viana', text: 'Ilustrou conto folclórico mato-grossense', timeAgo: 'Há 1 hora', pointsAdded: 120, type: 'writing' },
    ],
  },
  {
    id: '5-C',
    grade: '5',
    classLetter: 'C',
    label: '5º Ano C',
    teacher: 'Prof. Roberto Ramos',
    motto: 'Textos Vivos, Ideias Brilhantes',
    mascotEmoji: '🌟',
    mascotName: 'Estrelas Guia',
    studentCount: 26,
    grammarPoints: 3580,
    writingPoints: 3120,
    totalPoints: 6700,
    storiesCount: 33,
    grammarQuestsCount: 176,
    collaborativeStreak: 8,
    weeklyGoalTarget: 7000,
    weeklyGoalCurrent: 6700,
    collectiveBadges: [
      COLLECTIVE_BADGES.ortografia_brilhante,
      COLLECTIVE_BADGES.campeoes_coesao,
    ],
    recentActivities: [
      { id: 'act-9', studentName: 'Larissa Manoela', text: 'Revisou parágrafos com conectivos temporais', timeAgo: 'Há 2 horas', pointsAdded: 100, type: 'grammar' },
    ],
  },
  {
    id: '4-A',
    grade: '4',
    classLetter: 'A',
    label: '4º Ano A',
    teacher: 'Profª. Camila Reis',
    motto: 'Comunicação Clara, Amizade Verdadeira',
    mascotEmoji: '🐬',
    mascotName: 'Golfinhos Navegadores',
    studentCount: 24,
    grammarPoints: 3190,
    writingPoints: 3410,
    totalPoints: 6600,
    storiesCount: 35,
    grammarQuestsCount: 154,
    collaborativeStreak: 7,
    weeklyGoalTarget: 7000,
    weeklyGoalCurrent: 6600,
    collectiveBadges: [
      COLLECTIVE_BADGES.turma_solidaria,
      COLLECTIVE_BADGES.desafio_mato_grosso,
    ],
    recentActivities: [
      { id: 'act-10', studentName: 'João Victor', text: 'Publicou aventura nas cavernas de Nobres MT', timeAgo: 'Há 3 horas', pointsAdded: 140, type: 'writing' },
    ],
  },
  {
    id: '3-B',
    grade: '3',
    classLetter: 'B',
    label: '3º Ano B',
    teacher: 'Prof. André Martins',
    motto: 'Pequenos Passos, Histórias Gigantes',
    mascotEmoji: '🐝',
    mascotName: 'Abelhinhas Trabalhadoras',
    studentCount: 25,
    grammarPoints: 2980,
    writingPoints: 3540,
    totalPoints: 6520,
    storiesCount: 38,
    grammarQuestsCount: 142,
    collaborativeStreak: 11,
    weeklyGoalTarget: 7000,
    weeklyGoalCurrent: 6520,
    collectiveBadges: [
      COLLECTIVE_BADGES.ouro_escrita,
      COLLECTIVE_BADGES.turma_solidaria,
    ],
    recentActivities: [
      { id: 'act-11', studentName: 'Ana Clara', text: 'Escreveu poesia rimada sobre o Araguaia', timeAgo: 'Há 4 horas', pointsAdded: 130, type: 'writing' },
    ],
  },
  {
    id: '5-B',
    grade: '5',
    classLetter: 'B',
    label: '5º Ano B',
    teacher: 'Profª. Patrícia Gomes',
    motto: 'Argumentação Forte, Escrita Impecável',
    mascotEmoji: '🦅',
    mascotName: 'Águias da Retórica',
    studentCount: 27,
    grammarPoints: 3410,
    writingPoints: 3040,
    totalPoints: 6450,
    storiesCount: 31,
    grammarQuestsCount: 169,
    collaborativeStreak: 6,
    weeklyGoalTarget: 7000,
    weeklyGoalCurrent: 6450,
    collectiveBadges: [
      COLLECTIVE_BADGES.ortografia_brilhante,
      COLLECTIVE_BADGES.mestres_pontuacao,
    ],
    recentActivities: [
      { id: 'act-12', studentName: 'Felipe Antunes', text: 'Completou desafio de crônicas escolares', timeAgo: 'Há 5 horas', pointsAdded: 110, type: 'writing' },
    ],
  },
  {
    id: '3-C',
    grade: '3',
    classLetter: 'C',
    label: '3º Ano C',
    teacher: 'Profª. Renata Meireles',
    motto: 'Cores, Rimas e Descobertas',
    mascotEmoji: '🎨',
    mascotName: 'Pintores de Palavras',
    studentCount: 26,
    grammarPoints: 2890,
    writingPoints: 3380,
    totalPoints: 6270,
    storiesCount: 34,
    grammarQuestsCount: 138,
    collaborativeStreak: 8,
    weeklyGoalTarget: 6800,
    weeklyGoalCurrent: 6270,
    collectiveBadges: [
      COLLECTIVE_BADGES.ouro_escrita,
    ],
    recentActivities: [
      { id: 'act-13', studentName: 'Enzo Gabriel', text: 'Pontuou com diálogo no conto de fadas', timeAgo: 'Há 5 horas', pointsAdded: 95, type: 'grammar' },
    ],
  },
  {
    id: '4-D',
    grade: '4',
    classLetter: 'D',
    label: '4º Ano D',
    teacher: 'Prof. Thiago Nogueira',
    motto: 'Detetives do Vocabulário',
    mascotEmoji: '🦊',
    mascotName: 'Raposas Astutas',
    studentCount: 25,
    grammarPoints: 3050,
    writingPoints: 3110,
    totalPoints: 6160,
    storiesCount: 30,
    grammarQuestsCount: 147,
    collaborativeStreak: 7,
    weeklyGoalTarget: 6800,
    weeklyGoalCurrent: 6160,
    collectiveBadges: [
      COLLECTIVE_BADGES.mestres_pontuacao,
    ],
    recentActivities: [
      { id: 'act-14', studentName: 'Isabela Souza', text: 'Encontrou 5 sinônimos para enriquecer o texto', timeAgo: 'Hoje cedo', pointsAdded: 90, type: 'grammar' },
    ],
  },
  {
    id: '5-D',
    grade: '5',
    classLetter: 'D',
    label: '5º Ano D',
    teacher: 'Profª. Beatriz Lins',
    motto: 'Navegando nas Letras e Parágrafos',
    mascotEmoji: '🐯',
    mascotName: 'Tigres da Redação',
    studentCount: 28,
    grammarPoints: 3180,
    writingPoints: 2940,
    totalPoints: 6120,
    storiesCount: 29,
    grammarQuestsCount: 155,
    collaborativeStreak: 6,
    weeklyGoalTarget: 6500,
    weeklyGoalCurrent: 6120,
    collectiveBadges: [
      COLLECTIVE_BADGES.campeoes_coesao,
    ],
    recentActivities: [
      { id: 'act-15', studentName: 'Gustavo Lima', text: 'Produziu texto de suspense com clímax marcado', timeAgo: 'Ontem', pointsAdded: 120, type: 'writing' },
    ],
  },
  {
    id: '3-D',
    grade: '3',
    classLetter: 'D',
    label: '3º Ano D',
    teacher: 'Profª. Vanessa Morais',
    motto: 'Semeando Leitores Apaixonados',
    mascotEmoji: '🐢',
    mascotName: 'Tartarugas Velozes no Conhecimento',
    studentCount: 24,
    grammarPoints: 2750,
    writingPoints: 3240,
    totalPoints: 5990,
    storiesCount: 31,
    grammarQuestsCount: 130,
    collaborativeStreak: 5,
    weeklyGoalTarget: 6500,
    weeklyGoalCurrent: 5990,
    collectiveBadges: [
      COLLECTIVE_BADGES.turma_solidaria,
    ],
    recentActivities: [
      { id: 'act-16', studentName: 'Marina Lopes', text: 'Desvendou o uso de letra maiúscula em nomes próprios', timeAgo: 'Ontem', pointsAdded: 80, type: 'grammar' },
    ],
  },
  {
    id: '4-E',
    grade: '4',
    classLetter: 'E',
    label: '4º Ano E',
    teacher: 'Prof. Lucas Guimarães',
    motto: 'União que Gera Conhecimento',
    mascotEmoji: '🦄',
    mascotName: 'Unicórnios Criativos',
    studentCount: 25,
    grammarPoints: 2820,
    writingPoints: 3020,
    totalPoints: 5840,
    storiesCount: 28,
    grammarQuestsCount: 139,
    collaborativeStreak: 5,
    weeklyGoalTarget: 6500,
    weeklyGoalCurrent: 5840,
    collectiveBadges: [
      COLLECTIVE_BADGES.desafio_mato_grosso,
    ],
    recentActivities: [
      { id: 'act-17', studentName: 'Rafael Moreira', text: 'Criou fábula sobre a preservação do Pantanal', timeAgo: 'Ontem', pointsAdded: 110, type: 'writing' },
    ],
  },
  {
    id: '5-E',
    grade: '5',
    classLetter: 'E',
    label: '5º Ano E',
    teacher: 'Profª. Clarice Fontana',
    motto: 'Pensamento Crítico e Palavra Viva',
    mascotEmoji: '🐼',
    mascotName: 'Pandas Autores',
    studentCount: 26,
    grammarPoints: 2950,
    writingPoints: 2810,
    totalPoints: 5760,
    storiesCount: 27,
    grammarQuestsCount: 144,
    collaborativeStreak: 4,
    weeklyGoalTarget: 6200,
    weeklyGoalCurrent: 5760,
    collectiveBadges: [
      COLLECTIVE_BADGES.mestres_pontuacao,
    ],
    recentActivities: [
      { id: 'act-18', studentName: 'Guilherme Paz', text: 'Treinou adjetivos descritivos para personagens', timeAgo: 'Ontem', pointsAdded: 90, type: 'grammar' },
    ],
  },
  {
    id: '3-E',
    grade: '3',
    classLetter: 'E',
    label: '3º Ano E',
    teacher: 'Prof. Daniel Silveira',
    motto: 'Alegria de Aprender e Escrever Junto',
    mascotEmoji: '🌈',
    mascotName: 'Arco-Íris da Alfabetização',
    studentCount: 24,
    grammarPoints: 2640,
    writingPoints: 3050,
    totalPoints: 5690,
    storiesCount: 29,
    grammarQuestsCount: 126,
    collaborativeStreak: 6,
    weeklyGoalTarget: 6200,
    weeklyGoalCurrent: 5690,
    collectiveBadges: [
      COLLECTIVE_BADGES.turma_solidaria,
    ],
    recentActivities: [
      { id: 'act-19', studentName: 'Alice Furtado', text: 'Aprendeu o uso correto de R e RR', timeAgo: 'Ontem', pointsAdded: 85, type: 'grammar' },
    ],
  },
];

export const INITIAL_CHEER_MESSAGES: CheerMessage[] = [
  {
    id: 'ch-1',
    classId: '4-B',
    senderName: 'Profª. Mariana Lima',
    senderTurma: '4º Ano B',
    message: 'Orgulho imenso dos nossos escritores e escritoras! Cada parágrafo revisado nos coloca mais perto da grande celebração!',
    timestamp: 'Hoje às 10:15',
    likes: 18,
    emoji: '💖',
  },
  {
    id: 'ch-2',
    classId: '4-B',
    senderName: 'Lucas M.',
    senderTurma: '4º Ano B',
    message: 'Vamos turma! Se cada um fizer mais um desafio de gramática hoje alcançamos o 1º lugar isolado!',
    timestamp: 'Hoje às 11:20',
    likes: 14,
    emoji: '🔥',
  },
  {
    id: 'ch-3',
    classId: '5-A',
    senderName: 'Prof. Carlos Eduardo',
    senderTurma: '5º Ano A',
    message: 'Parabéns 5º A pelo domínio dos conectivos de causa e consequência! Vocês estão voando!',
    timestamp: 'Hoje às 09:40',
    likes: 16,
    emoji: '🦁',
  },
  {
    id: 'ch-4',
    classId: '3-A',
    senderName: 'Sofia e Turma',
    senderTurma: '3º Ano A',
    message: 'Nossa sala é muito unida! Já escrevemos 44 histórias lindas para o mural da escola!',
    timestamp: 'Hoje às 08:30',
    likes: 22,
    emoji: '🌱',
  },
];

// Helper to get class ID from grade and letter
export function getClassId(grade: SchoolGrade | string, classLetter: SchoolClassLetter | string): string {
  return `${grade}-${classLetter}`;
}
