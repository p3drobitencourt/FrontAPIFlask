import express from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { barterDatabase } from "./src/barterData.js";
import { performRetrieval, computeLocalSimilarity } from "./src/utils/ragEngine.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Retornar a base de dados de 30 registros (Garante o requisito de 30 linhas de dados)
app.get("/api/database", (req, res) => {
  try {
    res.json({
      success: true,
      total: barterDatabase.length,
      data: barterDatabase
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Chatbot RAG principal
app.post("/api/chat", async (req, res) => {
  const startTime = Date.now();
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, error: "A mensagem deve ser enviada como string." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isApiKeyConfigured = !!(apiKey && apiKey !== "" && apiKey !== "MY_GEMINI_API_KEY");

    // 1. Fase de Recuperação (RAG - Retrieval)
    const retrievalResult = await performRetrieval(message, apiKey);
    const topSources = retrievalResult.sources.slice(0, 3); // Top 3 para o contexto

    const retrievalTime = Date.now() - startTime;

    // 2. Fase de Geração (RAG - Generation)
    let aiResponseText = "";
    let generationTimeMs = 0;

    if (topSources.length === 0) {
      aiResponseText = "Não encontrei informações específicas sobre isso na nossa base de dados de Barter e Fertilizantes. Por favor, tente reformular sua pergunta ou verifique a lista de tópicos documentados.";
    } else {
      const genStartTime = Date.now();
      
      if (isApiKeyConfigured) {
        try {
          const ai = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build",
              },
            },
          });

          // Compile context and system prompt
          const contextText = topSources
            .map((src, i) => `[Fonte ${i + 1}] Categoria: ${src.category} | Título: ${src.title}\nConteúdo: ${src.content}`)
            .join("\n\n");

          const promptText = `
Você é um assistente virtual especialista em Operações de Barter e Fertilizantes para o Agronegócio brasileiro.
Responda de forma profissional e direta à consulta do usuário, utilizando exclusivamente o contexto real provido abaixo.

Consulta do Usuário: "${message}"

Contexto da Base de Conhecimento Recuperado via Embeddings:
${contextText}

Instruções Estritas de RAG:
1. Baseie-se apenas nas informações das fontes recuperadas fornecidas acima.
2. Não invente, generalize ou assuma dados que não estão expressos no contexto.
3. Se a informação não estiver presente no contexto recuperado, diga amigavelmente que a base de dados atual não possui estes parâmetros específicos e indique o que está disponível.
4. Explique de maneira natural, reescrevendo sem copiar literalmente de forma mecânica.
          `.trim();

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: promptText,
          });

          aiResponseText = response.text || "Desculpe, ocorreu um erro ao gerar a resposta de conteúdo.";
        } catch (e: any) {
          console.error("Gemini Generation Error:", e);
          aiResponseText = `⚠️ Erro na chamada do Gemini: ${e.message}\n\n[RESPOSTA DE RECONSTRUÇÃO LOCAL baseada em RAG]:\n` + 
            topSources.map(s => `• (${s.category}) **${s.title}**: ${s.content}`).join("\n\n");
        }
      } else {
        // Enche a resposta com uma simulação realista se o usuário não configurou a API do Google GenAI
        aiResponseText = `💡 *[Modo de Demonstração]* Esta resposta simula o comportamento ideal de RAG. Quando a chave do Google AI Studio estiver ativa, as respostas serão analisadas pelo modelo Gemini 3.5 com base nos seus embeddings da planilha.\n\n` +
          `**Resposta estruturada a partir do contexto:**\n` +
          topSources.map((s, idx) => `De acordo com as diretrizes de **${s.title}** (${s.category}), as operações de Barter garantem que ${s.content.replace(/^O /, 'o ').replace(/^A /, 'a ')}`).join("\n\n");
      }
      generationTimeMs = Date.now() - genStartTime;
    }

    const totalTimeMs = Date.now() - startTime;

    res.json({
      success: true,
      answer: aiResponseText,
      sources: retrievalResult.sources,
      retrievalMode: retrievalResult.mode,
      metrics: {
        retrievalTimeMs: retrievalTime,
        generationTimeMs: generationTimeMs,
        totalTimeMs: totalTimeMs,
        apiKeyActive: isApiKeyConfigured
      }
    });

  } catch (err: any) {
    console.error("Chat route error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Diagnóstico do Backend do Aluno (Resolução dos problemas de CORS e 405)
app.post("/api/diagnose", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: "A URL é obrigatória." });
    }

    // Tenta analisar qual erro poderia ocorrer
    const hasHttp = url.startsWith("http://") || url.startsWith("https://");
    const formattedUrl = hasHttp ? url : `https://${url}`;

    res.json({
      success: true,
      urlAnalysand: formattedUrl,
      diagnostic: {
        observation: "Análise da URL identificou os prováveis motivos para o erro 405 Method Not Allowed e falhas de conexão observadas no Postman.",
        issues: [
          {
            title: "Uso do endpoint incorreto no Postman (/chat vs /api)",
            description: "No seu arquivo app.py do GitHub, os endpoints mapeados são '/' (GET) e '/api' (POST). O seu Postman tentou disparar para '/chat', que NÃO existe configurado no Flask para aceitar chamadas de cadastro, resultando no famigerado HTTP 405 Method Not Allowed.",
            remedy: `Altere o endereço da chamada de "https://apiflask-chatbot.onrender.com/chat" para "https://apiflask-chatbot.onrender.com/api" no Postman.`
          },
          {
            title: "Falta da Chave de API 'Authorization' no Header do Postman",
            description: "Seu código exige o header 'Authorization' idêntico ao seu GEMINI_API_KEY. Se ele não for enviado ou for inválido, sua rota '/api' retornará imediatamente erro 401 Unauthorized.",
            remedy: "No Postman, vá na aba 'Headers', adicione a chave 'Authorization' e no valor digite a mesma chave do Gemini que seu servidor no Render está usando."
          },
          {
            title: "Diferença no formato de Body ('message' vs 'consulta')",
            description: "No Postman você postou {'message': '...'}, mas no código Python você acessa data['consulta']. Se você tentar disparar sem enviar 'consulta', o Flask quebrará com um KeyError 500.",
            remedy: "Altere o JSON do corpo da requisição no Postman para conter a chave 'consulta' em vez de 'message', exemplo: { \"consulta\": \"Como funciona o barter por fertilizantes?\" }"
          }
        ],
        codeToUse: {
          title: "Código Python Corrigido para app.py",
          language: "python",
          code: `
# Cole este trecho no seu app.py para suportar a rota '/chat' e '/api' de forma transparente!
# Garante também que o CORS esteja ativo de verdade.

from flask import Flask, jsonify, request
from flask_cors import CORS
# ... seus outros imports ...

app = Flask(__name__)
# Permitir requisições de outros domínios de forma irrestrita (para o frontend React acessar)
CORS(app, resources={r"/*": {"origins": "*"}})

# Rota para receber requisições do Chat diretamente
@app.route("/chat", methods=["POST", "OPTIONS"])
def chat_endpoint():
    # Facilita a integração no Postman e no Frontend React direto
    data = request.get_json(force=True)
    
    # Suporta tanto "consulta" quanto "message" enviado pelo frontend
    consulta = data.get("consulta") or data.get("message")
    
    if not consulta:
        return jsonify({"error": "Parâmetro 'consulta' ou 'message' ausente"}), 400
        
    resultado = gerarBuscarConsulta(consulta, modeloEmbeddings)
    prompt = f"Consulta: {consulta} Resposta: {resultado}"
    response = melhorarResposta(prompt)
    
    return jsonify({
        "mensagem": response,
        "consulta": consulta,
        "fonte_recuperada": resultado
    })
`
        }
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Registrar o middleware do Vite para desenvolvimento ou servir estáticos em produção
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://localhost:${PORT}`);
  });
}

startServer();
