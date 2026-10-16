export type CardCategory = 'personagem' | 'lugar' | 'acao' | 'complemento';

export interface StoryCard {
  id: string;
  category: CardCategory;
  text: string;
  emoji: string;
  color: string; // Tailwind color theme identifier
  accentColor: string; // Hex for borders / badges
  bgGradient: string;
  helpTip: string;
  connectiveSuggestion: string;
}

export const CATEGORY_INFO: Record<CardCategory, {
  name: string;
  singularName: string;
  question: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  bgColor: string;
  headerColor: string;
  iconName: string;
}> = {
  personagem: {
    name: 'Personagens',
    singularName: 'Personagem',
    question: 'Quem participa da história?',
    description: 'Quem é o herói ou heroína? Quais são suas características físicas e seu jeito de ser?',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/40',
    badgeText: 'text-amber-800 dark:text-amber-300',
    borderColor: 'border-amber-400',
    bgColor: 'bg-amber-50',
    headerColor: 'bg-amber-500',
    iconName: 'User',
  },
  lugar: {
    name: 'Lugares',
    singularName: 'Lugar',
    question: 'Onde se passa o enredo?',
    description: 'Como é o cenário? Descreva os sons, cheiros, iluminação e detalhes deste ambiente.',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    borderColor: 'border-emerald-400',
    bgColor: 'bg-emerald-50',
    headerColor: 'bg-emerald-600',
    iconName: 'MapPin',
  },
  acao: {
    name: 'Ações',
    singularName: 'Ação',
    question: 'O que o personagem decide fazer?',
    description: 'Qual desafio ou acontecimento principal impulsiona os personagens a agir?',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/40',
    badgeText: 'text-sky-800 dark:text-sky-300',
    borderColor: 'border-sky-400',
    bgColor: 'bg-sky-50',
    headerColor: 'bg-sky-500',
    iconName: 'Zap',
  },
  complemento: {
    name: 'Complementos',
    singularName: 'Complemento / Reviravolta',
    question: 'Qual é o elemento surpresa ou desfecho?',
    description: 'Uma reviravolta mágica, um segredo revelado ou a solução final do conflito.',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/40',
    badgeText: 'text-rose-800 dark:text-rose-300',
    borderColor: 'border-rose-400',
    bgColor: 'bg-rose-50',
    headerColor: 'bg-rose-500',
    iconName: 'Sparkles',
  },
};

// All 40 official cards from Alfabetiza MT (SEDUC Mato Grosso)
export const OFFICIAL_STORY_CARDS: StoryCard[] = [
  // --- PERSONAGEM (10 cartas) ---
  {
    id: 'p1',
    category: 'personagem',
    text: 'Uma bombeira e um bombeiro em uma missão de resgate',
    emoji: '🚒',
    color: 'amber',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-400 to-orange-500',
    helpTip: 'Pense na coragem deles! Que ferramentas eles carregam para salvar o dia?',
    connectiveSuggestion: 'Determinados e atentos, eles...'
  },
  {
    id: 'p2',
    category: 'personagem',
    text: 'Uma avó muito aventureira',
    emoji: '👵',
    color: 'amber',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-400 to-orange-500',
    helpTip: 'Ela usa óculos escuros, adora mochilão e não tem medo de nada!',
    connectiveSuggestion: 'Apesar da idade avançada, vovó...'
  },
  {
    id: 'p3',
    category: 'personagem',
    text: 'Um(a) detetive que acabou de encontrar uma pista importante',
    emoji: '🕵️',
    color: 'amber',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-400 to-orange-500',
    helpTip: 'Com sua lupa afiada, o(a) detetive observa cada pegada ou detalhe.',
    connectiveSuggestion: 'Olhando atentamente para a pista, ele(a)...'
  },
  {
    id: 'p4',
    category: 'personagem',
    text: 'Um robô que começou a sentir emoções',
    emoji: '🤖',
    color: 'amber',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-400 to-orange-500',
    helpTip: 'Luzes piscam em seu peito quando sente alegria, medo ou surpresa!',
    connectiveSuggestion: 'Com seus circuitos vibrando de curiosidade...'
  },
  {
    id: 'p5',
    category: 'personagem',
    text: 'Um(a) aprendiz de feiticeiro(a)',
    emoji: '🧙',
    color: 'amber',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-400 to-orange-500',
    helpTip: 'Às vezes o feitiço sai pela culatra, mas sua varinha tem muito poder.',
    connectiveSuggestion: 'Pronunciando palavras quase esquecidas...'
  },
  {
    id: 'p6',
    category: 'personagem',
    text: 'Duas crianças que descobriram um mapa misterioso',
    emoji: '🧒👧',
    color: 'amber',
    accentColor: '#f59e0b',
    helpTip: 'Melhores amigos inseparáveis que adoram desvendar segredos antigos.',
    bgGradient: 'from-amber-400 to-orange-500',
    connectiveSuggestion: 'Com os olhos brilhando de expectativa...'
  },
  {
    id: 'p7',
    category: 'personagem',
    text: 'Um cachorro muito esperto que adora resolver problemas',
    emoji: '🐶',
    color: 'amber',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-400 to-orange-500',
    helpTip: 'Ele late para dar pistas e fareja tudo com velocidade impressionante!',
    connectiveSuggestion: 'Abanando o rabo freneticamente...'
  },
  {
    id: 'p8',
    category: 'personagem',
    text: 'Uma cientista que fez uma grande descoberta',
    emoji: '🔬',
    color: 'amber',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-400 to-orange-500',
    helpTip: 'Seu jaleco branco e cadernos estão cheios de fórmulas e invenções.',
    connectiveSuggestion: 'Ao conferir os resultados em seu tubo de ensaio...'
  },
  {
    id: 'p9',
    category: 'personagem',
    text: 'Um(a) astronauta perdido(a) em outro planeta',
    emoji: '🧑‍🚀',
    color: 'amber',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-400 to-orange-500',
    helpTip: 'O oxigênio e o rádio são preciosos. Olhando as estrelas distantes...',
    connectiveSuggestion: 'Flutuando com passos cautelosos sobre o solo...'
  },
  {
    id: 'p10',
    category: 'personagem',
    text: 'Um(a) agricultor(a) que encontrou algo inesperado na plantação',
    emoji: '🌾',
    color: 'amber',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-400 to-orange-500',
    helpTip: 'Cuidava da terra com carinho quando a enxada bateu em algo reluzente.',
    connectiveSuggestion: 'Limpando o suor da testa com o chapéu de palha...'
  },

  // --- LUGAR (10 cartas) ---
  {
    id: 'l1',
    category: 'lugar',
    text: 'Um castelo abandonado na floresta',
    emoji: '🏰',
    color: 'emerald',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-500 to-teal-600',
    helpTip: 'Torres tomadas por heras, ecos antigos e portões enferrujados.',
    connectiveSuggestion: 'No coração da floresta densa e sombria...'
  },
  {
    id: 'l2',
    category: 'lugar',
    text: 'Uma antiga estação de trem',
    emoji: '🚉',
    color: 'emerald',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-500 to-teal-600',
    helpTip: 'Trilhos que parecem não ter fim, relógios parados e vapores no ar.',
    connectiveSuggestion: 'Sob o teto arqueado da estação deserta...'
  },
  {
    id: 'l3',
    category: 'lugar',
    text: 'Uma ilha onde um vulcão acabou de despertar',
    emoji: '🌋',
    color: 'emerald',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-500 to-teal-600',
    helpTip: 'A terra treme de leve e fumaça alaranjada sobe aos céus!',
    connectiveSuggestion: 'À medida que o chão esquentava ao redor...'
  },
  {
    id: 'l4',
    category: 'lugar',
    text: 'Uma biblioteca com uma sala secreta',
    emoji: '📚',
    color: 'emerald',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-500 to-teal-600',
    helpTip: 'Cheiro de livros velhos e uma estante falsa que gira ao puxar um livro.',
    connectiveSuggestion: 'Atrás de uma pesada prateleira de carvalho...'
  },
  {
    id: 'l5',
    category: 'lugar',
    text: 'Um planeta desconhecido muito distante da Terra',
    emoji: '🪐',
    color: 'emerald',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-500 to-teal-600',
    helpTip: 'Céus em tons de roxo, duas luas reluzentes e plantas que brilham no escuro.',
    connectiveSuggestion: 'Sob o brilho prateado das duas luas alienígenas...'
  },
  {
    id: 'l6',
    category: 'lugar',
    text: 'Uma árvore gigante com uma casa construída entre seus galhos',
    emoji: '🌳',
    color: 'emerald',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-500 to-teal-600',
    helpTip: 'Pontes de corda, janelas redondas e vista para todo o vale.',
    connectiveSuggestion: 'No alto da copa frondosa, balançando com o vento...'
  },
  {
    id: 'l7',
    category: 'lugar',
    text: 'Uma pequena comunidade às margens de um grande rio',
    emoji: '🛶',
    color: 'emerald',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-500 to-teal-600',
    helpTip: 'Casas de palafita, canoas atracadas e águas mansas repletas de peixes.',
    connectiveSuggestion: 'Enquanto a brisa do rio refrescava a tarde...'
  },
  {
    id: 'l8',
    category: 'lugar',
    text: 'Uma caverna de gelo cheia de túneis misteriosos',
    emoji: '🧊',
    color: 'emerald',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-500 to-teal-600',
    helpTip: 'Paredes azul-claras de cristal e estalactites pontiagudas pingando devagar.',
    connectiveSuggestion: 'Nas profundezas geladas da montanha...'
  },
  {
    id: 'l9',
    category: 'lugar',
    text: 'Um parque de diversões fechado durante a noite',
    emoji: '🎡',
    color: 'emerald',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-500 to-teal-600',
    helpTip: 'A roda-gigante parada contra a lua e o carrossel silencioso.',
    connectiveSuggestion: 'No silêncio enigmático do parque adormecido...'
  },
  {
    id: 'l10',
    category: 'lugar',
    text: 'Uma escola onde acontecimentos muito estranhos começaram a acontecer',
    emoji: '🏫',
    color: 'emerald',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-500 to-teal-600',
    helpTip: 'Giz que escreve sozinho no quadro e armários que sussurram!',
    connectiveSuggestion: 'Pelos corredores vazios após o toque da sineta...'
  },

  // --- AÇÃO (10 cartas) ---
  {
    id: 'a1',
    category: 'acao',
    text: 'Encontrar um objeto misterioso escondido',
    emoji: '🗝️',
    color: 'sky',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-500 to-blue-600',
    helpTip: 'O que é esse objeto? Uma chave dourada? Um medalhão brilhante?',
    connectiveSuggestion: 'Ao afastar as folhas e poeira, deparou-se com...'
  },
  {
    id: 'a2',
    category: 'acao',
    text: 'Seguir um mapa que leva a um lugar desconhecido',
    emoji: '🗺️',
    color: 'sky',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-500 to-blue-600',
    helpTip: 'O mapa tem um X vermelho e símbolos que precisam ser decifrados.',
    connectiveSuggestion: 'Passo a passo, conferindo cada ponto cardeal...'
  },
  {
    id: 'a3',
    category: 'acao',
    text: 'Abrir uma porta que nunca havia sido aberta',
    emoji: '🚪',
    color: 'sky',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-500 to-blue-600',
    helpTip: 'A maçaneta emperrada rangeu... Que surpresa há do outro lado?',
    connectiveSuggestion: 'Com a respiração presa, girou lentamente a maçaneta...'
  },
  {
    id: 'a4',
    category: 'acao',
    text: 'Receber uma mensagem inesperada',
    emoji: '📩',
    color: 'sky',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-500 to-blue-600',
    helpTip: 'Chegou num bilhete, numa garrafa ou em código sonoro no rádio?',
    connectiveSuggestion: 'De repente, um som agudo anunciou uma mensagem...'
  },
  {
    id: 'a5',
    category: 'acao',
    text: 'Ajudar alguém que estava precisando',
    emoji: '🤝',
    color: 'sky',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-500 to-blue-600',
    helpTip: 'Um ato de solidariedade, empatia e coragem faz a diferença.',
    connectiveSuggestion: 'Sem hesitar nem por um segundo, correu para estender a mão...'
  },
  {
    id: 'a6',
    category: 'acao',
    text: 'Tentar resolver um grande mistério',
    emoji: '🧩',
    color: 'sky',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-500 to-blue-600',
    helpTip: 'Juntar pistas, conversar com testemunhas e testar hipóteses.',
    connectiveSuggestion: 'Analisando os fatos um a um, percebeu que...'
  },
  {
    id: 'a7',
    category: 'acao',
    text: 'Procurar abrigo durante uma forte tempestade',
    emoji: '⛈️',
    color: 'sky',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-500 to-blue-600',
    helpTip: 'Trovões ribombam e a chuva cai torrencialmente molhando tudo.',
    connectiveSuggestion: 'Enquanto os relâmpagos cortavam o céu escuro...'
  },
  {
    id: 'a8',
    category: 'acao',
    text: 'Descobrir algo muito estranho dentro de uma mochila',
    emoji: '🎒',
    color: 'sky',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-500 to-blue-600',
    helpTip: 'Abriu o zíper e encontrou algo que não havia colocado lá...',
    connectiveSuggestion: 'Ao abrir o zíper da mochila com curiosidade...'
  },
  {
    id: 'a9',
    category: 'acao',
    text: 'Perseguir alguém que deixou cair um objeto importante',
    emoji: '🏃‍♂️',
    color: 'sky',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-500 to-blue-600',
    helpTip: 'A pessoa sumiu na esquina! A corrida contra o tempo começou.',
    connectiveSuggestion: 'Acelerando os passos no meio da multidão...'
  },
  {
    id: 'a10',
    category: 'acao',
    text: 'Tomar uma decisão que pode mudar tudo',
    emoji: '⚖️',
    color: 'sky',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-500 to-blue-600',
    helpTip: 'Um dilema difícil: seguir pelo caminho fácil ou pelo correto?',
    connectiveSuggestion: 'Diante de duas escolhas cruciais, respirou fundo e...'
  },

  // --- COMPLEMENTO / REVIRAVOLTA (10 cartas) ---
  {
    id: 'c1',
    category: 'complemento',
    text: 'Algo inesperado dentro de uma caixa',
    emoji: '📦',
    color: 'rose',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-500 to-pink-600',
    helpTip: 'A fita se soltou e lá dentro havia algo brilhante e vivo...',
    connectiveSuggestion: 'Para a surpresa de todos, no interior da caixa...'
  },
  {
    id: 'c2',
    category: 'complemento',
    text: 'O tempo estava acabando e era preciso agir rapidamente',
    emoji: '⏳',
    color: 'rose',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-500 to-pink-600',
    helpTip: 'Os segundos voavam no ponteiro do relógio! Foco total!',
    connectiveSuggestion: 'Cada segundo era vital, por isso...'
  },
  {
    id: 'c3',
    category: 'complemento',
    text: 'Uma pista importante apareceu quando ninguém esperava',
    emoji: '🔍',
    color: 'rose',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-500 to-pink-600',
    helpTip: 'Quando parecia que tudo estava perdido, um detalhe chamou a atenção.',
    connectiveSuggestion: 'Quando a esperança já fraquejava, inesperadamente...'
  },
  {
    id: 'c4',
    category: 'complemento',
    text: 'Alguém guardava um segredo',
    emoji: '🤫',
    color: 'rose',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-500 to-pink-600',
    helpTip: 'Uma verdade guardada a sete chaves finalmente veio à tona.',
    connectiveSuggestion: 'Foi então que a verdade secreta foi revelada: ...'
  },
  {
    id: 'c5',
    category: 'complemento',
    text: 'Um animal começou a agir de maneira estranha',
    emoji: '🦉',
    color: 'rose',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-500 to-pink-600',
    helpTip: 'Ele apontava para a parede e emitia sons peculiares, como um aviso!',
    connectiveSuggestion: 'O bicho não parava de pular e indicar o caminho...'
  },
  {
    id: 'c6',
    category: 'complemento',
    text: 'Surgiu uma grande ideia',
    emoji: '💡',
    color: 'rose',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-500 to-pink-600',
    helpTip: 'Uma lâmpada se acendeu na mente! Um plano genial nasceu.',
    connectiveSuggestion: 'Como um estalo de genialidade, concluiu que...'
  },
  {
    id: 'c7',
    category: 'complemento',
    text: 'Algo mágico aconteceu',
    emoji: '✨',
    color: 'rose',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-500 to-pink-600',
    helpTip: 'Faíscas douradas no ar, gravidade diminuída ou palavras que flutuam!',
    connectiveSuggestion: 'Um brilho encantador envolveu o ambiente quando...'
  },
  {
    id: 'c8',
    category: 'complemento',
    text: 'De repente, alguém apareceu',
    emoji: '👀',
    color: 'rose',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-500 to-pink-600',
    helpTip: 'Passos se aproximaram na sombra... Amigo ou adversário?',
    connectiveSuggestion: 'De repente, uma sombra se projetou na parede e...'
  },
  {
    id: 'c9',
    category: 'complemento',
    text: 'Uma antiga carta revelou uma informação surpreendente',
    emoji: '📜',
    color: 'rose',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-500 to-pink-600',
    helpTip: 'O papel amarelado e a tinta de caligrafia traziam uma confissão.',
    connectiveSuggestion: 'Ao desdobrar o pergaminho amarelado, pôde ler...'
  },
  {
    id: 'c10',
    category: 'complemento',
    text: 'No final, tudo terminou bem',
    emoji: '🌈',
    color: 'rose',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-500 to-pink-600',
    helpTip: 'Alívio, risadas, amizade fortalecida e uma grande lição aprendida.',
    connectiveSuggestion: 'Finalmente, com o perigo superado, todos celebraram...'
  },
];
