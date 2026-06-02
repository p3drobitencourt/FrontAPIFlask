/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, BarterRecordWithScore } from "../types.js";
import { Send, Bot, User, RefreshCw, Cpu, BookOpen, Layers, BarChart, Sparkles, HelpCircle } from "lucide-react";

export default function RAGChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastRetrievals, setLastRetrievals] = useState<BarterRecordWithScore[]>([]);
  const [retrievalMode, setRetrievalMode] = useState<string>("");
  const [retrievalStats, setRetrievalStats] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    "Como funciona o barter por fertilizantes?",
    "Que garantias são associadas à CPR física?",
    "Como se calcula a relação de troca?",
    "Quais as tributações de ICMS na saída de adubo?"
  ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Inject first default welcome message
    setMessages([
      {
        id: "welcome-msg",
        role: "assistant",
        content: "Olá! Bem-vindo ao **Assistente Inteligente de Operações Barter & Fertilizantes**.\n\nEu sou um protótipo de **RAG (Retrieval-Augmented Generation)** alimentado pela planilha de conhecimento do projeto. Faça qualquer pergunta sobre troca de fertilizantes por grãos, contratos de barter, emissão de CPR, taxas de ICMS ou cálculos de troca física e eu responderei estritamente com base nos dados do repositório!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const resData = await response.json();

      if (resData.success) {
        // Collect retrieved matches to display in the inspector right away
        setLastRetrievals(resData.sources || []);
        setRetrievalMode(resData.retrievalMode || "Simulador Local");
        setRetrievalStats(resData.metrics || null);

        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: resData.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: resData.sources?.slice(0, 3) || [],
          metrics: resData.metrics
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(resData.error || "Erro desconhecido na resposta");
      }
    } catch (err: any) {
      console.error(err);
      
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `❌ **Ocorreu uma falha na chamada com o servidor:** ${err.message}\n\nPor favor, certifique-se de que o servidor local está instalado e rodando corretamente.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: "Histórico limpo! Faça uma nova pergunta sobre operações estruturadas de barter rurais.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setLastRetrievals([]);
    setRetrievalStats(null);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 h-full min-h-[580px]" id="rag-chatbot-main-grid">
      {/* LEFT COLUMN: Chat window (3/5ths) */}
      <div className="xl:col-span-3 flex flex-col bg-slate-900 border border-slate-805/80 rounded-2xl overflow-hidden shadow-2xl h-[580px]">
        {/* Chat header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 font-sans">
                Assistente AgroBarter RAG
              </h3>
              <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-emerald-400" />
                Vetorizado com Google AI Embeddings
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="text-slate-400 hover:text-slate-200 text-xs px-2.5 py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-900 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Limpar
          </button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-900/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              {/* Avatar circle */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  msg.role === "user"
                    ? "bg-slate-800 border-slate-700 text-slate-200"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message text bubble */}
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-600/10 border border-emerald-500/30 text-emerald-100 rounded-tr-none"
                    : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none"
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {/* Basic custom markdown rendering */}
                  {msg.content.split("\n\n").map((paragraph, pIdx) => {
                    // Highlight bold items
                    const formatted = paragraph.split("**").map((text, tIdx) => {
                      if (tIdx % 2 === 1) {
                        return <strong key={tIdx} className="text-emerald-300 font-semibold">{text}</strong>;
                      }
                      return text;
                    });
                    return <p key={pIdx} className={pIdx > 0 ? "mt-2" : ""}>{formatted}</p>;
                  })}
                </div>

                {/* Footnotes for documents in answering chat */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-[9px] text-slate-400">
                    <span className="font-medium mr-1 select-none">Recuperado:</span>
                    {msg.sources.map((src, sIdx) => (
                      <span
                        key={src.id}
                        className="bg-slate-900 border border-slate-800/80 rounded px-1.5 py-0.5 text-slate-300 cursor-help"
                        title={`Score de similaridade: ${(src.similarity * 100).toFixed(1)}%\n${src.content}`}
                      >
                        [{sIdx + 1}] {src.sourceId} ({(src.similarity * 100).toFixed(0)}%)
                      </span>
                    ))}
                  </div>
                )}

                <div className={`text-[9px] text-slate-500 mt-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 text-xs text-slate-400 rounded-tl-none italic flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Buscando embeddings e gerando resposta RAG...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Action input bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Digite aqui sua pergunta de Barter..."
              className="flex-1 bg-slate-905 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-40 text-slate-950 rounded-xl transition-all flex items-center justify-center cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 font-bold" />
            </button>
          </form>

          {/* Quick Suggestions list */}
          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium select-none">
              <HelpCircle className="w-3.5 h-3.5" /> Sugestões:
            </span>
            {sampleQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 hover:text-emerald-300 disabled:opacity-50 text-slate-400 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: RAG Inspector (2/5ths) */}
      <div className="xl:col-span-2 flex flex-col bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl h-[580px] overflow-y-auto">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
          <Layers className="w-4 h-4 text-emerald-400" />
          Inspetor Interno RAG - Retrieval em Ação
        </h3>

        {lastRetrievals.length > 0 ? (
          <div className="space-y-4">
            {/* Status indicators */}
            <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-400" /> Modo de Busca:
              </span>
              <span className="font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                {retrievalMode}
              </span>
            </div>

            {/* Timings */}
            {retrievalStats && (
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-900">
                  <span className="text-slate-500">Busca Vetorial:</span>
                  <div className="text-slate-200 mt-0.5 text-xs font-semibold">{retrievalStats.retrievalTimeMs} ms</div>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-900">
                  <span className="text-slate-500">Geração LLM:</span>
                  <div className="text-slate-200 mt-0.5 text-xs font-semibold">
                    {retrievalStats.apiKeyActive ? `${retrievalStats.generationTimeMs} ms` : "Simulado"}
                  </div>
                </div>
              </div>
            )}

            {/* Document Rankers */}
            <div className="space-y-3.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Rank de Escores de Similaridade
              </span>

              {lastRetrievals.map((doc, idx) => {
                const percentage = (doc.similarity * 100).toFixed(1);
                const isSelected = idx < 3; // Top 3 injected in the prompt

                return (
                  <div
                    key={doc.id}
                    className={`p-3.5 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? "bg-slate-900/80 border-emerald-500/30 shadow"
                        : "bg-slate-950/40 border-slate-900 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-medium text-slate-300 truncate max-w-[70%]">
                        {idx + 1}. {doc.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {percentage}% Match
                      </span>
                    </div>

                    {/* Custom styling progress bar */}
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-850/80 mb-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSelected ? "bg-gradient-to-r from-emerald-600 to-emerald-400" : "bg-slate-800"
                        }`}
                        style={{ width: `${Math.min(doc.similarity * 100, 100)}%` }}
                      ></div>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                      {doc.content}
                    </p>

                    <div className="flex items-center justify-between text-[8.5px] text-slate-500 mt-2 border-t border-slate-900 pt-1.5">
                      <span>Célula: {doc.sourceId}</span>
                      {isSelected ? (
                        <span className="text-emerald-500/80 font-medium flex items-center gap-0.5 uppercase tracking-wider text-[8px]">
                          <Sparkles className="w-2.5 h-2.5" /> Injetado no Prompt
                        </span>
                      ) : (
                        <span>Excluído (fora do Top-3)</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl my-4">
            <BookOpen className="w-10 h-10 text-slate-800 mb-2" />
            <h4 className="text-slate-400 text-xs font-semibold">Inspector em Standby</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed mt-1 max-w-[180px]">
              Envie uma pergunta ou clique em um template para simular e inspecionar a busca vetorial em tempo real!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
