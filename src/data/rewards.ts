export type BadgeCategory = 'escrita' | 'gramatica' | 'especial';
export type BadgeTier = 'bronze' | 'prata' | 'ouro' | 'platina';

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  emoji: string;
  targetCount: number;
  unit: string;
  rewardCoins: number;
  rewardXp: number;
  bnccNote: string;
  pedagogicalTip: string;
}

export interface Sticker {
  id: string;
  name: string;
  category: string;
  rarity: 'comum' | 'rara' | 'epica' | 'lendaria';
  emoji: string;
  description: string;
  cost: number;
}

export interface AvatarOption {
  id: string;
  name: string;
  title: string;
  emoji: string;
  requiredLevel: number;
  unlockedByDefault: boolean;
}

export interface UserProgress {
  xp: number;
  coins: number;
  currentAvatar: string;
  studentName: string;
  unlockedStickers: string[];
  unlockedAvatars: string[];
  completedAchievements: string[]; // for backwards compatibility
  unlockedBadges: string[]; // Badge IDs
  unlockedBadgeDetails: Record<string, { unlockedAt: string }>;
  storiesWrittenCount: number;
  genresUsed: string[]; // e.g. ['narrativa', 'fabula']
  storiesMaxWords: number;
  connectivesUsedInStories: number;
  collaborativeStoriesCount: number;
  grammarTotalCorrect: number;
  grammarCorrectByCategory: Record<string, number>; // { classes: 0, pontuacao: 0, verbos: 0, conectivos: 0, concordancia: 0 }
  highestStreak: number;
  chestsOpenedCount: number;
  grammarQuizzesCompleted: number;
  correctAnswersCount: number;
  soundEnabled: boolean;
}

export const LEVELS = [
  { level: 1, title: 'Aprendiz das Letras', minXp: 0, maxXp: 100, badge: '🌱' },
  { level: 2, title: 'Explorador de Palavras', minXp: 100, maxXp: 250, badge: '🧭' },
  { level: 3, title: 'Detetive das Frases', minXp: 250, maxXp: 500, badge: '🔍' },
  { level: 4, title: 'Criador de Histórias', minXp: 500, maxXp: 850, badge: '🎨' },
  { level: 5, title: 'Mestre da Narrativa', minXp: 850, maxXp: 1300, badge: '📜' },
  { level: 6, title: 'Feiticeiro dos Conectivos', minXp: 1300, maxXp: 1900, badge: '✨' },
  { level: 7, title: 'Guardião da Gramática', minXp: 1900, maxXp: 2700, badge: '🛡️' },
  { level: 8, title: 'Autor Premiado da Turma', minXp: 2700, maxXp: 3800, badge: '🏆' },
  { level: 9, title: 'Grande Escritor Mirim', minXp: 3800, maxXp: 5200, badge: '👑' },
  { level: 10, title: 'Lenda Literária Galáctica', minXp: 5200, maxXp: 10000, badge: '🌟' },
];

export function getLevelInfo(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      const current = LEVELS[i];
      const next = LEVELS[i + 1] || null;
      const progressPercent = next
        ? Math.min(100, Math.floor(((xp - current.minXp) / (next.minXp - current.minXp)) * 100))
        : 100;
      return { current, next, progressPercent };
    }
  }
  return { current: LEVELS[0], next: LEVELS[1], progressPercent: 0 };
}

// ----------------- COMPLETE BADGES SYSTEM -----------------
export const BADGES: Badge[] = [
  // --- ESCRITA (8 Badges) ---
  {
    id: 'badge_first_story',
    title: 'Primeiro Autor da Turma',
    description: 'Escreva e publique sua primeira história completa na oficina.',
    category: 'escrita',
    tier: 'bronze',
    emoji: '📝',
    targetCount: 1,
    unit: 'história',
    rewardCoins: 50,
    rewardXp: 100,
    bnccNote: 'BNCC EF15LP05 - Produção autônoma de texto narrativo.',
    pedagogicalTip: 'O primeiro passo de todo grande escritor começa com uma simples ideia!',
  },
  {
    id: 'badge_three_stories',
    title: 'Trilogia Fantástica',
    description: 'Escreva 3 histórias completas com começo, meio e fim.',
    category: 'escrita',
    tier: 'prata',
    emoji: '📚',
    targetCount: 3,
    unit: 'histórias',
    rewardCoins: 80,
    rewardXp: 180,
    bnccNote: 'BNCC EF35LP25 - Criação de narrativas ficcionais consistentes.',
    pedagogicalTip: 'Quem escreve com regularidade desenvolve repertório e imaginação sem limites.',
  },
  {
    id: 'badge_five_stories',
    title: 'Biblioteca de Ouro',
    description: 'Alcance a marca lendária de 5 histórias salvas em sua estante.',
    category: 'escrita',
    tier: 'ouro',
    emoji: '🏛️',
    targetCount: 5,
    unit: 'histórias',
    rewardCoins: 120,
    rewardXp: 300,
    bnccNote: 'BNCC EF35LP26 - Leitura e circulação das próprias produções literárias.',
    pedagogicalTip: 'Você já possui uma verdadeira coletânea de obras dignas de publicação!',
  },
  {
    id: 'badge_genre_explorer',
    title: 'Mestre dos Gêneros',
    description: 'Experimente pelo menos 3 gêneros textuais diferentes (ex: Conto, Fábula, Notícia, Tirinha ou Carta).',
    category: 'escrita',
    tier: 'ouro',
    emoji: '🎭',
    targetCount: 3,
    unit: 'gêneros diferentes',
    rewardCoins: 90,
    rewardXp: 220,
    bnccNote: 'BNCC EF15LP01 - Identificação e produção em múltiplos gêneros da esfera escolar e artística.',
    pedagogicalTip: 'Variar o gênero desenvolve flexibilidade comunicativa e senso crítico.',
  },
  {
    id: 'badge_long_story',
    title: 'Odisseia Literária',
    description: 'Escreva uma narrativa rica com mais de 70 palavras.',
    category: 'escrita',
    tier: 'prata',
    emoji: '📜',
    targetCount: 70,
    unit: 'palavras em 1 texto',
    rewardCoins: 70,
    rewardXp: 160,
    bnccNote: 'BNCC EF35LP25 - Expansão de detalhes, cenários e caracterização de personagens.',
    pedagogicalTip: 'Detalhar ações, sentimentos e cenários enriquece a experiência do leitor.',
  },
  {
    id: 'badge_connectives_wizard',
    title: 'Varinha dos Conectivos',
    description: 'Utilize 5 ou mais conectivos ao longo de suas histórias para garantir coesão.',
    category: 'escrita',
    tier: 'prata',
    emoji: '🪄',
    targetCount: 5,
    unit: 'conectivos usados',
    rewardCoins: 60,
    rewardXp: 150,
    bnccNote: 'BNCC EF35LP08 - Uso articulado de conjunções e operadores temporais.',
    pedagogicalTip: 'Conectivos como "de repente", "por isso" e "enquanto" transformam frases soltas em uma história fluida.',
  },
  {
    id: 'badge_fable_master',
    title: 'Fabulista da Sabedoria',
    description: 'Escreva uma Fábula com ensinamento e Moral da História.',
    category: 'escrita',
    tier: 'prata',
    emoji: '🦊',
    targetCount: 1,
    unit: 'fábula',
    rewardCoins: 60,
    rewardXp: 140,
    bnccNote: 'BNCC EF35LP21 - Leitura e composição de fábulas com personificação e moral.',
    pedagogicalTip: 'As fábulas ensinam valores eternos de empatia, esforço e solidariedade.',
  },
  {
    id: 'badge_team_story',
    title: 'Roda da Amizade Coletiva',
    description: 'Complete uma história cooperativa com a turma no modo Roda Coletiva.',
    category: 'escrita',
    tier: 'ouro',
    emoji: '🤝',
    targetCount: 1,
    unit: 'história coletiva',
    rewardCoins: 80,
    rewardXp: 200,
    bnccNote: 'BNCC EF15LP05 - Escrita compartilhada e colaborativa.',
    pedagogicalTip: 'Construir enredos em grupo fortalece a escuta, o respeito e a criatividade mútua.',
  },

  // --- GRAMÁTICA (7 Badges) ---
  {
    id: 'badge_first_grammar',
    title: 'Primeiro Acerto Gramatical',
    description: 'Acerte sua primeira questão em qualquer módulo da Arena de Gramática.',
    category: 'gramatica',
    tier: 'bronze',
    emoji: '🎯',
    targetCount: 1,
    unit: 'acerto',
    rewardCoins: 30,
    rewardXp: 80,
    bnccNote: 'BNCC EF03LP08 - Reconhecimento de elementos e classes de palavras.',
    pedagogicalTip: 'Cada dúvida esclarecida abre portas para escrever cada vez melhor.',
  },
  {
    id: 'badge_classes_master',
    title: 'Caçador de Palavras',
    description: 'Acerte 4 questões no módulo de Substantivos, Adjetivos e Verbos.',
    category: 'gramatica',
    tier: 'prata',
    emoji: '🏷️',
    targetCount: 4,
    unit: 'acertos em classes',
    rewardCoins: 60,
    rewardXp: 150,
    bnccNote: 'BNCC EF03LP08 / EF04LP07 - Identificação e diferenciação morfológica.',
    pedagogicalTip: 'Substantivo nomeia, adjetivo dá cor/qualidade e verbo põe tudo em movimento!',
  },
  {
    id: 'badge_punctuation_ninja',
    title: 'Mestre da Pontuação',
    description: 'Acerte 4 questões no módulo de Pontuação (ponto final, ?, !, :, -).',
    category: 'gramatica',
    tier: 'prata',
    emoji: '🎯',
    targetCount: 4,
    unit: 'acertos em pontuação',
    rewardCoins: 60,
    rewardXp: 150,
    bnccNote: 'BNCC EF03LP07 / EF04LP05 - Emprego expressivo dos sinais de pontuação.',
    pedagogicalTip: 'A pontuação é a respiração e a emoção do texto: ela dita o tom da voz do leitor!',
  },
  {
    id: 'badge_verbs_timetraveler',
    title: 'Viajante dos Verbos',
    description: 'Acerte 4 questões de Tempos Verbais (Pretérito, Presente, Futuro e terminação -am/-ão).',
    category: 'gramatica',
    tier: 'ouro',
    emoji: '⏳',
    targetCount: 4,
    unit: 'acertos em verbos',
    rewardCoins: 70,
    rewardXp: 170,
    bnccNote: 'BNCC EF04LP06 / EF05LP05 - Domínio da flexão temporal dos verbos.',
    pedagogicalTip: 'Lembre-se sempre: "-am" já passou (ontem fizeram) e "-ão" ainda vai acontecer (amanhã farão)!',
  },
  {
    id: 'badge_agreement_guru',
    title: 'Guardião da Concordância',
    description: 'Acerte 3 questões de Concordância Verbal e Nominal.',
    category: 'gramatica',
    tier: 'prata',
    emoji: '⚖️',
    targetCount: 3,
    unit: 'acertos em concordância',
    rewardCoins: 60,
    rewardXp: 150,
    bnccNote: 'BNCC EF04LP07 / EF05LP06 - Concordância em gênero e número.',
    pedagogicalTip: 'Quando o sujeito vai para o plural, suas palavras companheiras vão juntas!',
  },
  {
    id: 'badge_streak_fire',
    title: 'Combo de Fogo (5x)',
    description: 'Atinja uma sequência impressionante de 5 acertos seguidos sem errar na Arena!',
    category: 'gramatica',
    tier: 'ouro',
    emoji: '🔥',
    targetCount: 5,
    unit: 'acertos seguidos',
    rewardCoins: 90,
    rewardXp: 220,
    bnccNote: 'BNCC EF35LP07 - Fixação de normas ortográficas e gramaticais com atenção sustentada.',
    pedagogicalTip: 'Concentração total e raciocínio afiado garantem combos imbatíveis!',
  },
  {
    id: 'badge_grammar_scholar',
    title: 'Sábio da Língua Portuguesa',
    description: 'Acumule 15 acertos totais em desafios da Arena de Gramática.',
    category: 'gramatica',
    tier: 'platina',
    emoji: '🧠',
    targetCount: 15,
    unit: 'acertos totais',
    rewardCoins: 150,
    rewardXp: 350,
    bnccNote: 'BNCC EF15LP06 / EF35LP08 - Consolidação dos conhecimentos linguísticos do fundamental.',
    pedagogicalTip: 'Você alcançou um domínio de gramática que orgulha qualquer professor!',
  },

  // --- ESPECIAIS & COLECIONADOR (3 Badges) ---
  {
    id: 'badge_treasure_hunter',
    title: 'Caçador de Baús',
    description: 'Abra pelo menos 3 Baús Mágicos do Tesouro com suas moedas conquistadas.',
    category: 'especial',
    tier: 'bronze',
    emoji: '🗝️',
    targetCount: 3,
    unit: 'baús abertos',
    rewardCoins: 50,
    rewardXp: 120,
    bnccNote: 'Gamificação & Estímulo à economia de moedas pedagógicas.',
    pedagogicalTip: 'Poupar moedas com acertos permite resgatar grandes tesouros!',
  },
  {
    id: 'badge_sticker_collector',
    title: 'Álbum Encantado (5 Figurinhas)',
    description: 'Colecione 5 ou mais figurinhas virtuais em seu álbum de recompensas.',
    category: 'especial',
    tier: 'prata',
    emoji: '✨',
    targetCount: 5,
    unit: 'figurinhas',
    rewardCoins: 70,
    rewardXp: 160,
    bnccNote: 'Colecionismo lúdico e engajamento contínuo.',
    pedagogicalTip: 'Figurinhas raras e épicas mostram a sua dedicação nas atividades.',
  },
  {
    id: 'badge_level_five',
    title: 'Mestre da Narrativa (Nível 5)',
    description: 'Suba até o Nível 5 de escritor acumulando XP nas atividades.',
    category: 'especial',
    tier: 'platina',
    emoji: '👑',
    targetCount: 5,
    unit: 'nível de escritor',
    rewardCoins: 200,
    rewardXp: 400,
    bnccNote: 'Progressão pedagógica estruturada do 3º ao 5º ano.',
    pedagogicalTip: 'O título de Mestre da Narrativa consagra uma trajetória brilhante na oficina!',
  },
];

// Helper to calculate progress for any badge
export function getBadgeProgress(progress: UserProgress, badge: Badge): {
  current: number;
  max: number;
  isUnlocked: boolean;
  percent: number;
} {
  const isUnlocked = progress.unlockedBadges?.includes(badge.id) ?? false;
  let current = 0;

  switch (badge.id) {
    case 'badge_first_story':
    case 'badge_three_stories':
    case 'badge_five_stories':
      current = progress.storiesWrittenCount;
      break;
    case 'badge_genre_explorer':
      current = progress.genresUsed?.length || 0;
      break;
    case 'badge_long_story':
      current = progress.storiesMaxWords || 0;
      break;
    case 'badge_connectives_wizard':
      current = progress.connectivesUsedInStories || 0;
      break;
    case 'badge_fable_master':
      current = progress.genresUsed?.includes('fabula') ? 1 : 0;
      break;
    case 'badge_team_story':
      current = progress.collaborativeStoriesCount || 0;
      break;

    case 'badge_first_grammar':
    case 'badge_grammar_scholar':
      current = progress.grammarTotalCorrect || 0;
      break;
    case 'badge_classes_master':
      current = progress.grammarCorrectByCategory?.['classes'] || 0;
      break;
    case 'badge_punctuation_ninja':
      current = progress.grammarCorrectByCategory?.['pontuacao'] || 0;
      break;
    case 'badge_verbs_timetraveler':
      current = progress.grammarCorrectByCategory?.['verbos'] || 0;
      break;
    case 'badge_agreement_guru':
      current = progress.grammarCorrectByCategory?.['concordancia'] || 0;
      break;
    case 'badge_streak_fire':
      current = progress.highestStreak || 0;
      break;

    case 'badge_treasure_hunter':
      current = progress.chestsOpenedCount || 0;
      break;
    case 'badge_sticker_collector':
      current = progress.unlockedStickers?.length || 0;
      break;
    case 'badge_level_five':
      current = getLevelInfo(progress.xp).current.level;
      break;
    default:
      current = isUnlocked ? badge.targetCount : 0;
  }

  const max = badge.targetCount;
  const percent = Math.min(100, Math.floor((Math.min(current, max) / max) * 100));

  return {
    current: Math.min(current, max),
    max,
    isUnlocked: isUnlocked || current >= max,
    percent: isUnlocked ? 100 : percent,
  };
}

export const STICKERS: Sticker[] = [
  { id: 's1', name: 'Lápis Mágico Dourado', category: 'Ferramentas', rarity: 'comum', emoji: '✏️', description: 'Escreve histórias cheias de imaginação!', cost: 25 },
  { id: 's2', name: 'Coruja da Sabedoria', category: 'Mascotes', rarity: 'comum', emoji: '🦉', description: 'Atenta a cada vírgula e ponto final.', cost: 25 },
  { id: 's3', name: 'Livro Voador', category: 'Objetos Mágicos', rarity: 'comum', emoji: '📖', description: 'Leva você para terras distantes.', cost: 25 },
  { id: 's4', name: 'Estrela Guia', category: 'Cosmos', rarity: 'comum', emoji: '⭐', description: 'Ilumina o clímax da narrativa.', cost: 25 },

  { id: 's5', name: 'Robô Poeta', category: 'Personagens', rarity: 'rara', emoji: '🤖', description: 'Cria rimas em linguagem binária!', cost: 50 },
  { id: 's6', name: 'Vovó Radical', category: 'Personagens', rarity: 'rara', emoji: '👵', description: 'Desce cachoeiras e escala vulcões.', cost: 50 },
  { id: 's7', name: 'Bússola Secreta', category: 'Aventura', rarity: 'rara', emoji: '🧭', description: 'Aponta sempre para um novo mistério.', cost: 50 },
  { id: 's8', name: 'Pena de Fênix', category: 'Objetos Mágicos', rarity: 'rara', emoji: '🪶', description: 'Tinta eterna de cores reluzentes.', cost: 50 },
  { id: 's9', name: 'Caldeirão dos Feitiços', category: 'Magia', rarity: 'rara', emoji: '🧙‍♂️', description: 'Mistura adjetivos com perfeição.', cost: 50 },

  { id: 's10', name: 'Castelo nas Nuvens', category: 'Lugares', rarity: 'epica', emoji: '🏰', description: 'Onde vivem os guardiões dos contos.', cost: 90 },
  { id: 's11', name: 'Foguete Estelar', category: 'Cosmos', rarity: 'epica', emoji: '🚀', description: 'Viaja além das fronteiras da imaginação.', cost: 90 },
  { id: 's12', name: 'Baú dos Segredos Antigos', category: 'Tesouros', rarity: 'epica', emoji: '📦', description: 'Guarda revelações surpreendentes.', cost: 90 },
  { id: 's13', name: 'Cachorrinho Detetive', category: 'Mascotes', rarity: 'epica', emoji: '🐕', description: 'Fareja qualquer erro gramatical!', cost: 90 },

  { id: 's14', name: 'Dragão das Letras Douradas', category: 'Lendas', rarity: 'lendaria', emoji: '🐉', description: 'A criatura lendária que cospe ideias brilhantes.', cost: 150 },
  { id: 's15', name: 'Troféu Monteiro Lobato', category: 'Troféus', rarity: 'lendaria', emoji: '🏆', description: 'Símbolo máximo dos pequenos escritores.', cost: 150 },
  { id: 's16', name: 'Chave dos Mundos Secretos', category: 'Tesouros', rarity: 'lendaria', emoji: '🗝️', description: 'Abre portas para infinitos finais felizes.', cost: 150 },
];

export const AVATARS: AvatarOption[] = [
  { id: 'av1', name: 'Aventureiro(a) da Floresta', title: 'Curioso(a)', emoji: '🧒', requiredLevel: 1, unlockedByDefault: true },
  { id: 'av2', name: 'Detetive Mirim', title: 'Olho Vivo', emoji: '🕵️', requiredLevel: 1, unlockedByDefault: true },
  { id: 'av3', name: 'Cientista Inovador(a)', title: 'Inventor(a)', emoji: '🔬', requiredLevel: 2, unlockedByDefault: false },
  { id: 'av4', name: 'Aprendiz de Mago(a)', title: 'Encantador(a)', emoji: '🧙‍♀️', requiredLevel: 3, unlockedByDefault: false },
  { id: 'av5', name: 'Astronauta Cósmico(a)', title: 'Viajante Estelar', emoji: '🧑‍🚀', requiredLevel: 4, unlockedByDefault: false },
  { id: 'av6', name: 'Repórter Investigativo(a)', title: 'Buscador da Verdade', emoji: '📰', requiredLevel: 5, unlockedByDefault: false },
  { id: 'av7', name: 'Robô Inteligente', title: 'Circuito Poético', emoji: '🤖', requiredLevel: 6, unlockedByDefault: false },
  { id: 'av8', name: 'Guardião(ã) Dragão', title: 'Mestre Supremo', emoji: '👑', requiredLevel: 8, unlockedByDefault: false },
];

export const INITIAL_USER_PROGRESS: UserProgress = {
  xp: 120, // starts at level 2
  coins: 80,
  currentAvatar: 'av1',
  studentName: 'Escritor(a) Estrela',
  unlockedStickers: ['s1'],
  unlockedAvatars: ['av1', 'av2'],
  completedAchievements: [],
  unlockedBadges: [],
  unlockedBadgeDetails: {},
  storiesWrittenCount: 0,
  genresUsed: [],
  storiesMaxWords: 0,
  connectivesUsedInStories: 0,
  collaborativeStoriesCount: 0,
  grammarTotalCorrect: 0,
  grammarCorrectByCategory: {
    classes: 0,
    pontuacao: 0,
    verbos: 0,
    conectivos: 0,
    concordancia: 0,
  },
  highestStreak: 0,
  chestsOpenedCount: 0,
  grammarQuizzesCompleted: 0,
  correctAnswersCount: 0,
  soundEnabled: true,
};
