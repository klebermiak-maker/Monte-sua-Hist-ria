export interface SynonymEntry {
  word: string;
  category: 'verbo' | 'adjetivo' | 'substantivo' | 'adverbio';
  synonyms: string[];
  simpleMeaning: string;
  exampleSentence: string;
}

export const ELEMENTARY_SYNONYMS: Record<string, SynonymEntry> = {
  // Verbos de elocução / fala (os mais repetidos em redações infantis)
  disse: {
    word: 'disse',
    category: 'verbo',
    synonyms: ['falou', 'afirmou', 'exclamou', 'perguntou', 'sussurrou', 'gritou', 'respondeu', 'declarou', 'murmurou'],
    simpleMeaning: 'Expressar algo em palavras.',
    exampleSentence: '— "Achei a chave!", exclamou o detetive com alegria.',
  },
  falou: {
    word: 'falou',
    category: 'verbo',
    synonyms: ['disse', 'pronunciou', 'comentou', 'conversou', 'discursou', 'balbuciou'],
    simpleMeaning: 'Emitir som com a voz para se comunicar.',
    exampleSentence: 'O sábio falou com calma diante de toda a aldeia.',
  },
  olhou: {
    word: 'olhou',
    category: 'verbo',
    synonyms: ['avistou', 'observou', 'fitou', 'espiou', 'contemplou', 'enxergou', 'examinou'],
    simpleMeaning: 'Direcionar os olhos para ver algo.',
    exampleSentence: 'A menina avistou um castelo misterioso no alto da montanha.',
  },
  viu: {
    word: 'viu',
    category: 'verbo',
    synonyms: ['enxergou', 'notou', 'percebeu', 'avistou', 'presenciou'],
    simpleMeaning: 'Captar imagens com os olhos.',
    exampleSentence: 'Ele percebeu pegadas frescas que seguiam pela trilha.',
  },
  andou: {
    word: 'andou',
    category: 'verbo',
    synonyms: ['caminhou', 'marchou', 'perambulou', 'passeou', 'avançou'],
    simpleMeaning: 'Mover-se dando passos.',
    exampleSentence: 'Eles caminharam silenciosamente pela floresta encantada.',
  },
  correu: {
    word: 'correu',
    category: 'verbo',
    synonyms: ['disparou', 'acelerou', 'voou', 'fugiu', 'apressou-se'],
    simpleMeaning: 'Deslocar-se com rapidez.',
    exampleSentence: 'O corajoso bombeiro disparou para salvar o gatinho.',
  },
  comecou: {
    word: 'começou',
    category: 'verbo',
    synonyms: ['iniciou', 'principou', 'deu início', 'inaugurou', 'despertou'],
    simpleMeaning: 'Dar o primeiro passo de algo.',
    exampleSentence: 'Naquela tarde, iniciou-se a mais emocionante das jornadas.',
  },
  terminou: {
    word: 'terminou',
    category: 'verbo',
    synonyms: ['concluiu', 'finalizou', 'encerrou', 'completou', 'acabou'],
    simpleMeaning: 'Chegar ao fim de uma atividade.',
    exampleSentence: 'O inventor finalmente concluiu a incrível máquina do tempo.',
  },
  pensou: {
    word: 'pensou',
    category: 'verbo',
    synonyms: ['refletiu', 'imaginou', 'cogitou', 'ponderou', 'raciocinou', 'supôs'],
    simpleMeaning: 'Formar ideias na mente.',
    exampleSentence: 'Ela refletiu por alguns instantes antes de tomar a decisão.',
  },
  achou: {
    word: 'achou',
    category: 'verbo',
    synonyms: ['encontrou', 'descobriu', 'localizou', 'desvendou'],
    simpleMeaning: 'Passar a ter ou ver algo que procurava.',
    exampleSentence: 'O jovem encontrou um mapa secreto dentro da garrafa.',
  },

  // Adjetivos comuns (para enriquecer descrições)
  bonito: {
    word: 'bonito',
    category: 'adjetivo',
    synonyms: ['lindo', 'belo', 'encantador', 'maravilhoso', 'deslumbrante', 'gracioso'],
    simpleMeaning: 'Que agrada aos olhos e tem harmonia.',
    exampleSentence: 'Aquele era um bosque deslumbrante, cheio de flores douradas.',
  },
  bom: {
    word: 'bom',
    category: 'adjetivo',
    synonyms: ['ótimo', 'excelente', 'maravilhoso', 'agradável', 'bondoso', 'benévolo'],
    simpleMeaning: 'Que tem boas qualidades ou faz bem aos outros.',
    exampleSentence: 'O robô era bondoso e ajudava todas as crianças da vila.',
  },
  legal: {
    word: 'legal',
    category: 'adjetivo',
    synonyms: ['divertido', 'fantástico', 'bacana', 'sensacional', 'empolgante', 'agradável'],
    simpleMeaning: 'Muito agradável ou divertido.',
    exampleSentence: 'Tivemos uma tarde sensacional inventando novos brinquedos.',
  },
  grande: {
    word: 'grande',
    category: 'adjetivo',
    synonyms: ['enorme', 'gigantesco', 'imenso', 'vasto', 'colossal', 'monumental'],
    simpleMeaning: 'Que tem tamanho muito maior que o normal.',
    exampleSentence: 'Diante deles surgiu uma árvore colossal com raízes brilhantes.',
  },
  pequeno: {
    word: 'pequeno',
    category: 'adjetivo',
    synonyms: ['minúsculo', 'reduzido', 'miúdo', 'diminuto', 'delicado'],
    simpleMeaning: 'De tamanho menor que o comum.',
    exampleSentence: 'Um pássaro minúsculo pousou suavemente na janela.',
  },
  rapido: {
    word: 'rápido',
    category: 'adjetivo',
    synonyms: ['veloz', 'ágil', 'ligeiro', 'instantâneo', 'veloz'],
    simpleMeaning: 'Que se move com velocidade.',
    exampleSentence: 'Com um salto ágil, a avó aventureira alcançou a margem do rio.',
  },
  devagar: {
    word: 'devagar',
    category: 'adverbio',
    synonyms: ['lentamente', 'vagarosamente', 'calmamente', 'passo a passo'],
    simpleMeaning: 'Sem pressa, com calma.',
    exampleSentence: 'A tartaruga caminhou vagarosamente sob o sol da manhã.',
  },
  feliz: {
    word: 'feliz',
    category: 'adjetivo',
    synonyms: ['alegre', 'contente', 'radiante', 'animado', 'eufórico', 'satisfeito'],
    simpleMeaning: 'Sentindo grande alegria no coração.',
    exampleSentence: 'Todos ficaram radiantes quando o desafio foi superado.',
  },
  triste: {
    word: 'triste',
    category: 'adjetivo',
    synonyms: ['chateado', 'desanimado', 'melancólico', 'cabisbaixo', 'desolado'],
    simpleMeaning: 'Sem alegria ou magoado.',
    exampleSentence: 'O cachorrinho estava cabisbaixo esperando pelo seu dono.',
  },
  bravo: {
    word: 'bravo',
    category: 'adjetivo',
    synonyms: ['irritado', 'furioso', 'zangado', 'enfurecido', 'indignado'],
    simpleMeaning: 'Sentindo raiva ou contrariedade.',
    exampleSentence: 'O dragão ficou furioso quando perturbaram seu sono.',
  },
  medo: {
    word: 'medo',
    category: 'substantivo',
    synonyms: ['temor', 'receio', 'pavor', 'apreensão', 'espanto'],
    simpleMeaning: 'Sensação de perigo ou susto.',
    exampleSentence: 'Superando todo o temor, o herói avançou na caverna escura.',
  },
  corajoso: {
    word: 'corajoso',
    category: 'adjetivo',
    synonyms: ['valente', 'destemido', 'bravo', 'audacioso', 'heroico'],
    simpleMeaning: 'Que enfrenta o perigo sem recuar.',
    exampleSentence: 'A detetive destemida seguiu a pista sem hesitar.',
  },
  casa: {
    word: 'casa',
    category: 'substantivo',
    synonyms: ['lar', 'moradia', 'residência', 'habitação', 'mansão', 'cabana'],
    simpleMeaning: 'Lugar onde alguém mora e se abriga.',
    exampleSentence: 'Depois de um longo dia, retornaram para o aconchegante lar.',
  },
  amigo: {
    word: 'amigo',
    category: 'substantivo',
    synonyms: ['companheiro', 'camarada', 'parceiro', 'aliado', 'colega'],
    simpleMeaning: 'Pessoa com quem temos laço de carinho e lealdade.',
    exampleSentence: 'Seu fiel companheiro nunca o deixava sozinho nas missões.',
  },
  muito: {
    word: 'muito',
    category: 'adverbio',
    synonyms: ['bastante', 'imensamente', 'extremamente', 'demais', 'em grande quantidade'],
    simpleMeaning: 'Em quantidade grande ou intensidade elevada.',
    exampleSentence: 'A turma ficou extremamente curiosa com o novo mistério.',
  },
  ruim: {
    word: 'ruim',
    category: 'adjetivo',
    synonyms: ['péssimo', 'desagradável', 'horrível', 'nocivo', 'ruinoso'],
    simpleMeaning: 'De má qualidade ou prejudicial.',
    exampleSentence: 'A tempestade causou um estrago terrível no telhado.',
  },
  forte: {
    word: 'forte',
    category: 'adjetivo',
    synonyms: ['vigoroso', 'robusto', 'potente', 'poderoso', 'resistente'],
    simpleMeaning: 'Com grande vigor físico ou potência.',
    exampleSentence: 'O poderoso vento balançava as copas das castanheiras.',
  },
  fraco: {
    word: 'fraco',
    category: 'adjetivo',
    synonyms: ['frágil', 'debilitado', 'franzino', 'delicado', 'vulnerável'],
    simpleMeaning: 'Com pouca força ou fácil de quebrar.',
    exampleSentence: 'A ponte de cordas era frágil e exigia muito cuidado.',
  },
  brilhou: {
    word: 'brilhou',
    category: 'verbo',
    synonyms: ['resplandeceu', 'cintilou', 'reluziu', 'iluminou', 'fulgurou'],
    simpleMeaning: 'Emitir ou refletir luz viva.',
    exampleSentence: 'O medalhão cintilou quando tocou a luz do luar.',
  },
};

// Normalize word (remove accents, lowercase, trim punctuation)
export function normalizeWord(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Find local synonyms with fuzzy matching
export function findLocalSynonyms(rawWord: string): SynonymEntry | null {
  const clean = normalizeWord(rawWord);
  if (!clean) return null;

  // Direct lookup
  if (ELEMENTARY_SYNONYMS[clean]) {
    return ELEMENTARY_SYNONYMS[clean];
  }

  // Look for match inside synonyms list or keys
  for (const key of Object.keys(ELEMENTARY_SYNONYMS)) {
    const entry = ELEMENTARY_SYNONYMS[key];
    if (normalizeWord(entry.word) === clean) {
      return entry;
    }
    const hasInSynonyms = entry.synonyms.some((s) => normalizeWord(s) === clean);
    if (hasInSynonyms) {
      return {
        word: rawWord.trim().toLowerCase(),
        category: entry.category,
        synonyms: [entry.word, ...entry.synonyms.filter((s) => normalizeWord(s) !== clean)],
        simpleMeaning: entry.simpleMeaning,
        exampleSentence: entry.exampleSentence,
      };
    }
  }

  return null;
}
