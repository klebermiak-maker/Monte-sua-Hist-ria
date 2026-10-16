import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI Story Assistant for 3rd-5th grade students
app.post('/api/ai/story-help', async (req, res) => {
  try {
    const {
      genreName,
      storyTitle,
      authorName,
      currentSectionTitle,
      currentSectionPrompt,
      currentSectionContent,
      cards,
      sections,
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'Chave GEMINI_API_KEY não configurada no servidor.',
      });
    }

    const cardDetails = [
      cards?.personagem?.text ? `Personagem sorteado: ${cards.personagem.text}` : null,
      cards?.lugar?.text ? `Lugar sorteado: ${cards.lugar.text}` : null,
      cards?.acao?.text ? `Ação sorteada: ${cards.acao.text}` : null,
      cards?.complemento?.text ? `Complemento sorteado: ${cards.complemento.text}` : null,
    ].filter(Boolean).join('; ');

    const previousSections = (sections || [])
      .map((s: { title: string; content: string }) => `- ${s.title}: "${s.content || '(ainda não preenchido)'}"`)
      .join('\n');

    const prompt = `Você é o "Mago das Histórias", um tutor pedagógico amigável, criativo e motivador para crianças do 3º ao 5º ano do Ensino Fundamental (8 a 10 anos) no Brasil.

O aluno está escrevendo uma produção textual com base no material pedagógico "Monte Sua História".

DADOS DA PRODUÇÃO:
- Gênero textual: ${genreName || 'Narrativa de Aventura'}
- Título da história: ${storyTitle ? `"${storyTitle}"` : 'Ainda sem título'}
- Nome do(a) jovem autor(a): ${authorName || 'Jovem Escritor(a)'}
- Cartas sorteadas: ${cardDetails || 'Nenhuma carta sorteada'}
- Parte atual em que o aluno precisa de ideias: "${currentSectionTitle || 'Seção atual'}"
- Orientação pedagógica da parte: "${currentSectionPrompt || ''}"
- O que o aluno já escreveu nesta parte: "${currentSectionContent || '(o campo está vazio)'}"

HISTÓRIA ATÉ O MOMENTO (OUTRAS PARTES):
${previousSections}

SUA MISSÃO:
Gere 3 sugestões criativas, envolventes e diferentes entre si para que a criança continue ou inicie a escrita da parte "${currentSectionTitle}".
- Sugestão 1: Foque em AÇÃO OU REVIRAVOLTA INESPERADA.
- Sugestão 2: Foque em DIÁLOGO OU EMOÇÃO DOS PERSONAGENS.
- Sugestão 3: Foque em MISTÉRIO, PISTA OU DESCOBERTA MÁGICA.

As frases devem ser simples, ricas em vocabulário adequado para o Ensino Fundamental I, e não devem entregar o final da história pronto — devem dar um impulso criativo ("pontapé inicial").
Além disso, forneça:
1. Uma dica de conectivo textual útil para esta fase (ex: "De repente", "Enquanto isso", "Por causa disso", "Finalmente").
2. Uma frase motivacional carinhosa incentivando a imaginação do estudante.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Você é um assistente pedagógico de literatura infantil brasileira. Seja sempre positivo, acolhedor, use linguagem adaptada para crianças de 8 a 10 anos do Ensino Fundamental I.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              description: '3 ideias criativas para a criança continuar a história',
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    description: 'Categoria da ideia (ex: Ação Emocionante, Diálogo Divertido, Mistério Curioso)',
                  },
                  idea: {
                    type: Type.STRING,
                    description: 'Breve explicação lúdica da ideia para a criança',
                  },
                  starterSentence: {
                    type: Type.STRING,
                    description: 'Frase inicial pronta para o aluno começar a escrever ou colar no texto',
                  },
                },
                required: ['type', 'idea', 'starterSentence'],
              },
            },
            connectiveTip: {
              type: Type.STRING,
              description: 'Dica pedagógica de um conectivo textual adequado com exemplo curto',
            },
            motivationalQuote: {
              type: Type.STRING,
              description: 'Frase curta e calorosa de encorajamento para a criança',
            },
          },
          required: ['suggestions', 'connectiveTip', 'motivationalQuote'],
        },
      },
    });

    const outputText = response.text || '{}';
    const parsedData = JSON.parse(outputText);
    return res.json(parsedData);
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({
      error: err.message || 'Erro ao consultar a IA.',
    });
  }
});

// Endpoint: AI-Powered Synonym & Vocabulary Assistant for Kids
app.post('/api/ai/synonyms', async (req, res) => {
  try {
    const { word, sentenceContext } = req.body;

    if (!word || typeof word !== 'string') {
      return res.status(400).json({ error: 'Palavra não fornecida.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'Chave GEMINI_API_KEY não configurada.' });
    }

    const prompt = `Você é um dicionário pedagógico interativo e lúdico para estudantes do 3º ao 5º ano do Ensino Fundamental no Brasil.
O aluno selecionou a palavra: "${word}".
${sentenceContext ? `Contexto da frase onde a palavra foi usada: "${sentenceContext}"` : ''}

Sua tarefa:
1. Identifique a classe gramatical simples (verbo, adjetivo, substantivo, advérbio).
2. Forneça de 4 a 8 sinônimos ricos e expressivos adequados para crianças de 8 a 10 anos enriquecerem suas histórias e evitarem repetições.
3. Dê uma explicação curtíssima e clara do significado (linguagem simples para crianças).
4. Crie uma frase de exemplo divertida e inspiradora usando um dos sinônimos.
5. Dê uma dica rápida de escritor ("Dica do Dicionário") explicando como trocar a palavra deixa o texto mais emocionante.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Você é um dicionário infantil brasileiro, acolhedor e focado no vocabulário do Ensino Fundamental I.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            category: {
              type: Type.STRING,
              description: 'verbo, adjetivo, substantivo ou advérbio',
            },
            synonyms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Lista de 4 a 8 sinônimos adequados para crianças',
            },
            simpleMeaning: {
              type: Type.STRING,
              description: 'Significado simples em 1 frase',
            },
            exampleSentence: {
              type: Type.STRING,
              description: 'Frase ilustrativa de exemplo',
            },
            writingTip: {
              type: Type.STRING,
              description: 'Dica curta de como enriquecer o texto com essa palavra',
            },
          },
          required: ['word', 'category', 'synonyms', 'simpleMeaning', 'exampleSentence', 'writingTip'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in synonyms endpoint:', err);
    return res.status(500).json({ error: err.message || 'Erro ao buscar sinônimos.' });
  }
});

// Serve frontend with Vite middlewares in development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
