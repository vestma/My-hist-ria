import fs from 'fs';
import http from 'http';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

interface ReflectChoiceInput {
  chapterTitle: string;
  dilemma: string;
  chosenLabel: string;
  reflectionNote: string;
}

interface ReflectRequestBody {
  characterName: string;
  originTitle: string;
  tensionTitle: string;
  archetypeTitle: string;
  topValues: Array<{ label: string; score: number }>;
  choices: ReflectChoiceInput[];
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/reflect', async (req, res) => {
    const body = req.body as ReflectRequestBody;

    if (!body || !body.characterName || !Array.isArray(body.choices)) {
      res.status(400).json({ error: 'Dados insuficientes para gerar a reflexão.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.json({ fallback: true });
      return;
    }

    try {
      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const choicesSummary = body.choices
        .map(
          (c, i) =>
            `${i + 1}. ${c.chapterTitle} — Dilema: ${c.dilemma} | Escolha: "${c.chosenLabel}" (${c.reflectionNote})`
        )
        .join('\n');

      const valuesSummary = body.topValues
        .map((v) => `${v.label}: ${v.score}%`)
        .join(', ');

      const prompt = `Você é um escritor literário e mentor de autoconhecimento empático, sereno e profundo.
O usuário acabou de conduzir o personagem "${body.characterName}" (origem: "${body.originTitle}", inquietação inicial: "${body.tensionTitle}") por 6 encruzilhadas de vida.
Arquétipo revelado: "${body.archetypeTitle}".
Bússola de valores resultante: ${valuesSummary}.

Decisões tomadas na travessia:
${choicesSummary}

Escreva em português brasileiro elegante, humano e sem clichês motivacionais:
1. "synthesis": Uma reflexão íntima e observadora (2 parágrafos curtos, cerca de 110–140 palavras no total) conectando diretamente a inquietação inicial do personagem às escolhas concretas que ele fez — falando com o leitor com calor, lucidez e respeito.
2. "blindSpot": Uma observação gentil sobre o possível ponto cego ou preço invisível desse padrão de escolhas (1 parágrafo curto, ~45 palavras).
3. "guidingQuestion": Uma pergunta aberta e memorável para o leitor carregar consigo após fechar a página (1 frase).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'Responda exclusivamente em JSON válido em português brasileiro, com tom literário, reflexivo e psicologicamente honesto.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              synthesis: { type: Type.STRING },
              blindSpot: { type: Type.STRING },
              guidingQuestion: { type: Type.STRING },
            },
            required: ['synthesis', 'blindSpot', 'guidingQuestion'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.json({ fallback: true });
        return;
      }

      const parsed = JSON.parse(rawText) as {
        synthesis: string;
        blindSpot: string;
        guidingQuestion: string;
      };

      res.json({
        fallback: false,
        synthesis: parsed.synthesis,
        blindSpot: parsed.blindSpot,
        guidingQuestion: parsed.guidingQuestion,
      });
    } catch (error) {
      console.error('Erro ao gerar reflexão personalizada:', error);
      res.json({ fallback: true });
    }
  });

  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vitePromise = createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
      },
      appType: 'spa',
    });

    app.use(async (req, res, next) => {
      try {
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath, { index: false }));

    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      let html = fs.readFileSync(indexPath, 'utf-8');

      const rawBaseUrl =
        process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL'
          ? process.env.APP_URL
          : `${req.protocol}://${req.get('host')}`;
      const baseUrl = rawBaseUrl.replace(/\/+$/, '');

      html = html
        .replace(/content="\.?\/og-cover\.jpg"/g, `content="${baseUrl}/og-cover.jpg"`)
        .replace(
          '</head>',
          `  <link rel="canonical" href="${baseUrl}/" />\n    <meta property="og:url" content="${baseUrl}/" />\n  </head>`
        );

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Travessia server listening on http://0.0.0.0:${PORT}`);
  });
}

createServer();
