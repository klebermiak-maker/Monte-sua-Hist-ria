export interface TextGenre {
  id: string;
  name: string;
  badge: string;
  emoji: string;
  description: string;
  suitableGrades: string;
  structure: {
    key: string;
    title: string;
    prompt: string;
    placeholder: string;
    helperHint: string;
  }[];
  connectives: {
    category: string;
    words: string[];
  }[];
  grammarChecklist: string[];
}

export const TEXT_GENRES: TextGenre[] = [
  {
    id: 'narrativa',
    name: 'Narrativa de Aventura / Mistério',
    badge: 'Conto & Aventura',
    emoji: '🧭',
    description: 'Crie uma história cheia de suspense, desafios e reviravoltas com início, meio e fim.',
    suitableGrades: '3º ao 5º ano',
    structure: [
      {
        key: 'introducao',
        title: '1. Introdução (Quem e Onde?)',
        prompt: 'Apresente seus personagens e o lugar onde tudo começa. Como estava o dia?',
        placeholder: 'Era uma vez... Em um lugar muito especial chamado...',
        helperHint: 'Use adjetivos para descrever a personalidade e a aparência dos personagens.',
      },
      {
        key: 'desenvolvimento',
        title: '2. Conflito / Ação (O Problema)',
        prompt: 'Qual desafio ou mistério apareceu? O que quebrou a tranquilidade?',
        placeholder: 'Tudo parecia calmo até que, de repente...',
        helperHint: 'Mostre o que impulsionou o herói a agir. O que estava em jogo?',
      },
      {
        key: 'climax',
        title: '3. Clímax (Momento Decisivo)',
        prompt: 'O momento de maior suspense e tensão! Como enfrentaram o perigo?',
        placeholder: 'O coração batia forte! Foi nesse instante que...',
        helperHint: 'Use pontos de exclamação e frases mais ágeis para dar emoção.',
      },
      {
        key: 'desfecho',
        title: '4. Desfecho (A Resolução)',
        prompt: 'Como tudo terminou? Qual lição foi aprendida pelos personagens?',
        placeholder: 'Por fim, após tanta correria...',
        helperHint: 'Finalize explicando as consequências da aventura.',
      },
    ],
    connectives: [
      {
        category: 'Para Iniciar (Tempo)',
        words: ['Certo dia', 'Numa tarde chuvosa', 'Há muito tempo', 'Tudo começou quando'],
      },
      {
        category: 'Para o Conflito (Surpresa)',
        words: ['De repente', 'Inesperadamente', 'Sem que ninguém esperasse', 'Foi quando'],
      },
      {
        category: 'Para Continuidade',
        words: ['Em seguida', 'Logo depois', 'Enquanto isso', 'À medida que'],
      },
      {
        category: 'Para Concluir',
        words: ['Finalmente', 'Por fim', 'Desde aquele dia', 'E assim todos aprenderam que'],
      },
    ],
    grammarChecklist: [
      'Iniciei todos os parágrafos com letra maiúscula?',
      'Utilizei parágrafos para separar as partes da história?',
      'Coloquei ponto final, de interrogação ou de exclamação no fim das frases?',
      'Usei travessão (-) quando um personagem começou a falar?',
    ],
  },
  {
    id: 'fabula',
    name: 'Fábula com Moral da História',
    badge: 'Lição & Sabedoria',
    emoji: '🦊',
    description: 'História onde animais ou seres mágicos ensinam uma valiosa lição de convivência.',
    suitableGrades: '3º ao 5º ano',
    structure: [
      {
        key: 'situacao_inicial',
        title: '1. O Encontro dos Personagens',
        prompt: 'Apresente os personagens (com qualidades ou defeitos: esperto, orgulhoso, tímido, gentil).',
        placeholder: 'Naquela floresta encantada viviam dois animais bem diferentes...',
        helperHint: 'Fábulas costumam ter animais que pensam, conversam e agem como humanos (personificação).',
      },
      {
        key: 'desafio_dialogo',
        title: '2. O Desafio e o Diálogo',
        prompt: 'Eles discordam sobre algo ou enfrentam uma prova de inteligência/força.',
        placeholder: '- Veja como sou rápido! - zombou um deles...',
        helperHint: 'Use travessão (-) para as falas e dois-pontos (:) para introduzir a fala.',
      },
      {
        key: 'reviravolta',
        title: '3. A Reviravolta',
        prompt: 'O que aconteceu que surpreendeu quem estava muito confiante ou egoísta?',
        placeholder: 'Porém, algo inesperado ocorreu no caminho...',
        helperHint: 'A astúcia, a humildade ou a cooperação superam o egoísmo.',
      },
      {
        key: 'moral',
        title: '4. Moral da História',
        prompt: 'Qual é o grande ensinamento para quem lê esta fábula?',
        placeholder: 'Moral da história: Quem planta bondade, colhe...',
        helperHint: 'Uma frase curta e marcante que ensina uma lição para a vida toda!',
      },
    ],
    connectives: [
      {
        category: 'Para Diálogos',
        words: ['disse ele', 'retrucou com orgulho', 'perguntou intrigado', 'exclamou'],
      },
      {
        category: 'Contraste / Oposição',
        words: ['Porém', 'No entanto', 'Contudo', 'Apesar disso', 'Mas'],
      },
      {
        category: 'Causa e Efeito',
        words: ['Porque', 'Já que', 'Por causa disso', 'Consequentemente'],
      },
      {
        category: 'Para a Moral',
        words: ['Moral da história:', 'Com isso aprendemos que', 'Mais vale'],
      },
    ],
    grammarChecklist: [
      'Coloquei dois-pontos (:) antes da fala do personagem?',
      'Usei travessão (-) no início da fala?',
      'Destaquei a Moral da História no final?',
      'Concordei o singular e plural corretamente?',
    ],
  },
  {
    id: 'noticia',
    name: 'Notícia de Jornal Infantil',
    badge: 'Jornalismo Mirim',
    emoji: '📰',
    description: 'Relate um fato extraordinário como um repórter de verdade!',
    suitableGrades: '4º e 5º ano',
    structure: [
      {
        key: 'manchete',
        title: '1. Manchete Chamativa e Data',
        prompt: 'Crie um título impactante e empolgante em letras garrafais!',
        placeholder: 'MISTÉRIO RESOLVIDO: DETETIVE E CÃO ENCONTRAM OBJETO HISTÓRICO!',
        helperHint: 'A manchete deve resumir o fato mais surpreendente em poucas palavras.',
      },
      {
        key: 'lide',
        title: '2. O Lide (O quê, Quem, Quando e Onde?)',
        prompt: 'Responda às 4 perguntas de ouro no primeiro parágrafo.',
        placeholder: 'Na manhã desta quinta-feira, na pequena comunidade ribeirinha...',
        helperHint: 'O leitor precisa entender rapidamente quem esteve envolvido e onde tudo aconteceu.',
      },
      {
        key: 'detalhes',
        title: '3. Como aconteceu e Entrevistas',
        prompt: 'Explique como se desenrolou o fato e inclua uma fala entre aspas (" ").',
        placeholder: 'Segundo testemunhas que estavam no local: "Nunca vimos nada parecido..."',
        helperHint: 'Em notícias, usamos aspas (" ") para registrar a fala exata de uma testemunha.',
      },
      {
        key: 'desdobramentos',
        title: '4. Próximos Passos e Conclusão',
        prompt: 'Qual a situação atual? O que as autoridades ou a comunidade pretendem fazer?',
        placeholder: 'Agora, os cientistas irão analisar o material no laboratório...',
        helperHint: 'Use linguagem clara, objetiva e informativa.',
      },
    ],
    connectives: [
      {
        category: 'Para Informar',
        words: ['De acordo com', 'Segundo relatos de', 'Informações apuradas indicam que'],
      },
      {
        category: 'Tempo e Espaço',
        words: ['Na manhã de hoje', 'No início da tarde', 'No próprio local'],
      },
      {
        category: 'Causa e Consequência',
        words: ['Devido ao ocorrido', 'Por esse motivo', 'Em resposta aos acontecimentos'],
      },
    ],
    grammarChecklist: [
      'A manchete está destacada e sem ponto final?',
      'Usei aspas (" ") para citar a fala das pessoas entrevistadas?',
      'Escrevi os verbos no tempo correto (geralmente passado)?',
      'Mencionei O QUÊ, QUEM, ONDE e QUANDO no primeiro parágrafo?',
    ],
  },
  {
    id: 'carta',
    name: 'Carta Misteriosa / Diário Secreto',
    badge: 'Confidencial & Pessoal',
    emoji: '✉️',
    description: 'Envie uma mensagem empolgante para um amigo distante ou escreva em seu diário secreto.',
    suitableGrades: '3º ao 5º ano',
    structure: [
      {
        key: 'cabecalho',
        title: '1. Local, Data e Saudação',
        prompt: 'Escreva a cidade, data e para quem você está escrevendo.',
        placeholder: 'Mato Grosso, 15 de outubro.\nQuerido(a) amigo(a),',
        helperHint: 'Não esqueça da vírgula após a cidade e após a saudação carinhosa!',
      },
      {
        key: 'mensagem',
        title: '2. O Grande Relato',
        prompt: 'Conte a novidade incrível ou o mistério que você acabou de presenciar.',
        placeholder: 'Você não vai acreditar no que me aconteceu hoje cedo...',
        helperHint: 'Escreva em primeira pessoa (eu vi, eu descobri, nós fomos).',
      },
      {
        key: 'pedido',
        title: '3. Pergunta ou Pedido de Ajuda',
        prompt: 'Peça conselho ou marque um encontro para juntos resolverem o enigma.',
        placeholder: 'Preciso muito da sua ajuda para desvendar esse segredo...',
        helperHint: 'Faça perguntas ao destinatário usando ponto de interrogação (?).',
      },
      {
        key: 'despedida',
        title: '4. Despedida Afetuosa e Assinatura',
        prompt: 'Finalize com carinho e assine seu nome.',
        placeholder: 'Com carinho e expectativa,\nSeu amigo aventureiro.',
        helperHint: 'Exemplos: "Um abraço apertado", "Até breve", "Com saudades".',
      },
    ],
    connectives: [
      {
        category: 'Saudações',
        words: ['Querido(a)', 'Caro(a) colega', 'Meu grande amigo'],
      },
      {
        category: 'Relato Pessoal',
        words: ['Acredite se quiser', 'Para minha surpresa', 'Como você sabe'],
      },
      {
        category: 'Despedidas',
        words: ['Com um abraço', 'Até logo', 'Com muita saudade', 'Espero sua resposta'],
      },
    ],
    grammarChecklist: [
      'Coloquei o local e a data no topo com vírgula correta?',
      'Fiz a saudação inicial (Querido amigo,)?',
      'Escrevi os parágrafos com recuo e pontuação?',
      'Assinei meu nome ao final da carta?',
    ],
  },
  {
    id: 'tirinha',
    name: 'História em Quadrinhos (Tirinha)',
    badge: 'HQ & Diálogos',
    emoji: '💬',
    description: 'Escreva falas curtas, onomatopeias e descrições visuais para 4 quadrinhos divertidos!',
    suitableGrades: '3º ao 5º ano',
    structure: [
      {
        key: 'quadrinho1',
        title: 'Quadrinho 1 (Abertura)',
        prompt: 'O que o personagem está fazendo? O que ele diz no balão de fala?',
        placeholder: '[Cena: No meio da floresta]\nPersonagem 1: - Olhe o que achei aqui!',
        helperHint: 'Indique a expressão no rosto do personagem (sorrindo, curioso, espantado).',
      },
      {
        key: 'quadrinho2',
        title: 'Quadrinho 2 (O Barulho ou Surpresa)',
        prompt: 'Adicione uma onomatopeia! (POW!, TOC TOC!, CRASH!, BEEP!)',
        placeholder: '[Som: TIC-TAC! TIC-TAC!]\nPersonagem 2: - O que é isso pulsando dentro da caixa?!',
        helperHint: 'Onomatopeias representam sons do ambiente com letras maiúsculas e pontos de exclamação.',
      },
      {
        key: 'quadrinho3',
        title: 'Quadrinho 3 (A Confusão)',
        prompt: 'A situação fica cômica ou perigosa! Os personagens reagem.',
        placeholder: '[Cena: O cachorro pula na caixa]\nPersonagem 1: - Cuidado, Totó! Não morda isso!',
        helperHint: 'Balões de pensamento usam (pensou:) e gritos usam CAIXA ALTA.',
      },
      {
        key: 'quadrinho4',
        title: 'Quadrinho 4 (Piada ou Conclusão)',
        prompt: 'A reviravolta engraçada que fecha a tirinha com chave de ouro!',
        placeholder: '[Cena: Um filhote de dragão espirra purpurina]\nAmbos: - Ufa! É só um novo amigo!',
        helperHint: 'O último quadrinho geralmente traz a quebra de expectativa ou a piada final.',
      },
    ],
    connectives: [
      {
        category: 'Onomatopeias',
        words: ['POW!', 'TOC-TOC!', 'CABUM!', 'SPLASH!', 'BZZZZ!', 'AU-AU!', 'BEEP-BEEP!'],
      },
      {
        category: 'Interjeições',
        words: ['Uau!', 'Socorro!', 'Epa!', 'Ufa!', 'Caramba!', 'Ai ai ai!'],
      },
    ],
    grammarChecklist: [
      'Usei pontos de exclamação (!) para demonstrar emoção ou gritos?',
      'Usei reticências (...) para indicar suspense ou hesitação?',
      'Coloquei as onomatopeias com escrita expressiva?',
      'As falas cabem bem no espaço do balão?',
    ],
  },
];
