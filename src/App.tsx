/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import RAGChatbot from "./components/RAGChatbot.tsx";
import RAGDatabase from "./components/RAGDatabase.tsx";
import { Bot, Database, Landmark, HelpCircle, GraduationCap, Github } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"chat" | "database">("chat");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="app-root-div">
      {/* Top Header Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-md sm:text-lg font-bold text-slate-100 font-sans tracking-tight">
                Simulador RAG - Barter & Fertilizantes
              </h1>
              <p className="text-[11px] text-slate-400">
                Trabalho Prático • Inteligência Artificial com Embeddings do Google AI Studio
              </p>
            </div>
          </div>

          {/* Academic Badge Details */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800/80 px-4 py-1.5 rounded-xl text-xs text-slate-400">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Alvo:</span>
            <strong className="text-slate-200">Entrega de TCC / Prática IA</strong>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-slate-800 gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "chat"
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/[0.03]"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800"
            }`}
          >
            <Bot className="w-4 h-4" />
            Chatbot RAG
          </button>
          <button
            onClick={() => setActiveTab("database")}
            className={`px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "database"
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/[0.03]"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800"
            }`}
          >
            <Database className="w-4 h-4" />
            Base de Dados (30 Itens)
          </button>
        </div>

        {/* Dynamic Display of active tabs */}
        <div className="flex-1 transition-opacity duration-300">
          {activeTab === "chat" && <RAGChatbot />}
          {activeTab === "database" && <RAGDatabase />}
        </div>
      </main>

      {/* Sticky Bottom Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-5 text-center text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 flex items-center justify-center gap-1">
            <span>Desenvolvido como base prática para e-fidelidade no TCC de Agronegócios</span>
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded font-mono text-emerald-400">
              API STATUS: ONLINE
            </span>
            <a
              href="https://github.com/p3drobitencourt/APIFLASK-ChatBot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center gap-1 text-slate-400 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              Repositório Original
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
