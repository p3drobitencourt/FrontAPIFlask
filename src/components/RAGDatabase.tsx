/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { barterDatabase } from "../barterData.js";
import { Search, Database, Tag, FileText, ChevronRight } from "lucide-react";

export default function RAGDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tudo");

  // Filter types based on unique categories
  const categories = ["Tudo", "Conceito", "Operacional", "Cálculo", "Riscos & CPR", "Legislação & ICMS"];

  const filteredRecords = barterDatabase.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.sourceId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "Tudo" || rec.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full space-y-6" id="rag-database-container">
      {/* Search Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-emerald-400 font-sans flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            Base de Dados de Conhecimento (RAG)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Esta base representa as <strong className="text-white">30 linhas de registros</strong> exigidas pelo trabalho prático, utilizadas como corpus de embeddings para as consultas.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar termo ou fonte..."
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex flex-wrap gap-2 pb-1 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer border transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Cards */}
      {filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[500px] pr-2">
          {filteredRecords.map((rec, index) => (
            <div
              key={rec.id}
              className="bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500/30 rounded-xl p-5 hover:bg-slate-900 shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Registro {index + 1}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {rec.category}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors mb-2">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[72px]">
                  {rec.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-slate-500" />
                  Fonte: {rec.sourceId}
                </span>
                <span className="text-slate-600 font-mono text-[9px]">ID: {rec.id}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl text-center">
          <Database className="w-12 h-12 text-slate-700 mb-3" />
          <p className="text-slate-400 text-sm">Nenhum registro encontrado para estes filtros.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("Tudo");
            }}
            className="mt-3 text-xs text-emerald-400 hover:underline"
          >
            Limpar filtros e buscar novamente
          </button>
        </div>
      )}
    </div>
  );
}
