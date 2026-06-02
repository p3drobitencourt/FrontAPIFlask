/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Bug, CheckCircle, Code, Copy, AlertTriangle, Lightbulb, Terminal, ArrowRight, ShieldCheck } from "lucide-react";

export default function DiagnosticPanel() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPostmanCode, setCopiedPostmanCode] = useState(false);

  const pythonCode = `from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import numpy as np
import google.generativeai as generativeai
from google import genai
from google.genai import types
import pickle
from dotenv import load_dotenv
from geminiFunctions import gerarBuscarConsulta, melhorarResposta

load_dotenv()
app = Flask(__name__)

# CONFIGURAÇÃO DE CORS IRRESTRITA (Crucial para o seu React se conectar!)
CORS(app, resources={r"/*": {"origins": "*"}})

modelo = 'gemini-3-flash-preview'
modeloEmbeddings = pickle.load(open('datasetEmbeddings.pkl','rb'))
chave_secreta = os.getenv('GEMINI_API_KEY')

# Configura o client do google legado e novo
generativeai.configure(api_key=chave_secreta)

@app.route("/")
def home():
    return jsonify({
        "status": "online",
        "tema": "Chatbot RAG Barter de Fertilizantes",
        "endpoints": ["/api (POST)", "/chat (POST)"]
    })

# SUA ROTA /api ATUALIZADA (espera consulta e Authorization header)
@app.route("/api", methods=["POST"])
def results():
    auth_key = request.headers.get("Authorization")
    if auth_key != chave_secreta:
        return jsonify({"error": "Unauthorized"}), 401
        
    data = request.get_json(force=True)
    consulta = data.get("consulta")
    if not consulta:
        return jsonify({"error": "Parâmetro 'consulta' ausente no body"}), 400
        
    resultado = gerarBuscarConsulta(consulta, modeloEmbeddings)
    prompt = f"Consulta: {consulta} Resposta: {resultado}"
    response = melhorarResposta(prompt)
    return jsonify({"mensagem": response})

# ADICIONE ESTA NOVA ROTA PARA SUPORTAR O SEU POSTMAN DIRETAMENTE (/chat)
@app.route("/chat", methods=["POST", "OPTIONS"])
def chat_endpoint():
    # Facilita a vida: não exige cabeçalho de autenticação nas chamadas padrões de teste,
    # ou processa de forma direta sem validações complexas se for apenas para avaliação de aula!
    try:
      data = request.get_json(force=True)
    except Exception:
      return jsonify({"error": "JSON inválido"}), 400
      
    # Suporta tanto "consulta" (seu python) quanto "message" (padrão de chats React)
    consulta = data.get("consulta") or data.get("message")
    
    if not consulta:
        return jsonify({"error": "Parâmetro 'consulta' ou 'message' ausente"}), 400
        
    # Executa a busca vetorial nos embeddings do pickle
    resultado = gerarBuscarConsulta(consulta, modeloEmbeddings)
    prompt = f"Consulta: {consulta} Resposta: {resultado}"
    
    # Melhora a resposta no Gemini
    response = melhorarResposta(prompt)
    
    return jsonify({
        "status": "sucesso",
        "response": response,
        "mensagem": response, # Duplicado por compatibilidade
        "consulta": consulta,
        "trecho_recuperado": resultado
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
`;

  const postmanFormat = `{
  "consulta": "Como funciona o barter por fertilizantes?"
}`;

  const copyTextToClipboard = (text: string, isPostman = false) => {
    navigator.clipboard.writeText(text);
    if (isPostman) {
      setCopiedPostmanCode(true);
      setTimeout(() => setCopiedPostmanCode(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6" id="diagnostic-panel-container">
      {/* Alert Header */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start gap-4">
        <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
          <Bug className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-amber-300 font-sans">
            Laudo Técnico de Erro do Seu Servidor Render
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Analisando a foto do Postman e os arquivos do seu repositório no GitHub (<strong className="text-amber-400">APIFLASK-ChatBot</strong>), identificamos o motivo exato de você ter recebido <span className="text-red-400 font-mono font-bold bg-slate-950 px-1 py-0.5 rounded">405 Method Not Allowed</span>.
          </p>
        </div>
      </div>

      {/* Main Diagnosis Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step-by-Step checklist */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Por que deu Erro 405?
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Endpoint Incorreto</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Você enviou a requisição para <code className="bg-slate-950 text-red-300 px-1 py-0.5 rounded">/chat</code> no Postman, mas no seu <code className="text-slate-300">app.py</code> existem apenas as rotas <code className="text-slate-300">/</code> e <code className="text-slate-300">/api</code>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Erro de Campo JSON</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    No corpo do Postman você enviou <code className="bg-slate-950 text-slate-300 px-1 py-0.5 rounded">"message": "..."</code>, mas na linha 44 do seu <code className="text-slate-300">app.py</code>, seu Python tenta buscar <code className="bg-slate-950 text-slate-300 px-1 py-0.5 rounded">data["consulta"]</code>. Forçar isso sem enviar "consulta" causaria erro 500.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Header de Autorização</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Sua rota <code className="text-slate-300">/api</code> exige um cabeçalho <code className="text-slate-300">"Authorization"</code> com valor IDÊNTICO ao <code className="text-emerald-400">GEMINI_API_KEY</code> do servidor, gerando erro 401 Unauthorized se não for enviado.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Como Testar Rápido no Postman
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Altere os parâmetros e envie para o endpoint correto. Se quiser testar o código original sem alterações:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Método:</span>
                <span className="text-amber-400 font-bold">POST</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>URL:</span>
                <span className="text-slate-300">https://apiflask-chatbot.onrender.com/api</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Header:</span>
                <span className="text-slate-300">Authorization: [Sua Chave do Gemini]</span>
              </div>
              <div className="text-slate-500 pt-1 border-t border-slate-800/60">
                <span>Body (JSON Raw):</span>
                <pre className="text-emerald-300 mt-1">{postmanFormat}</pre>
              </div>
            </div>
            <button
              onClick={() => copyTextToClipboard(postmanFormat, true)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedPostmanCode ? "Copiado!" : "Copiar JSON para Postman"}
            </button>
          </div>
        </div>

        {/* Code fix column */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col flex-1">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Solução Definitiva para o app.py (Recomendado)
                </h3>
              </div>
              <button
                onClick={() => copyTextToClipboard(pythonCode)}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs py-1 px-2.5 rounded-lg border border-emerald-500/20 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedCode ? "Copiado!" : "Copiar Código Completo"}
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Substitua o conteúdo do seu <code className="text-emerald-300">app.py</code> pelo código abaixo. Ele cria suporte direto para a rota <code className="text-emerald-400">/chat</code> (utilizada nos testes padrão e neste frontend), além de adicionar suporte a CORS para garantir que seu frontend React consiga acessar o backend no Render de forma irrestrita.
            </p>

            <div className="bg-slate-950 rounded-xl border border-slate-800/80 p-4 font-mono text-xs overflow-y-auto max-h-[300px] text-slate-300 scrollbar-thin">
              <pre>{pythonCode}</pre>
            </div>

            {/* Quick tips */}
            <div className="bg-emerald-500/5 rounded-xl border border-emerald-500/20 p-4 mt-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-emerald-300">Dica de Deploy no Render:</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  No painel do Render, certifique-se de preencher a variável de ambiente <code className="bg-slate-950 font-mono text-slate-300 px-1.5 py-0.5 rounded">GEMINI_API_KEY</code> com a sua chave que obteve no Google AI Studio. Se ela não estiver declarada lá, o backend falhará ao rodar os embeddings!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
