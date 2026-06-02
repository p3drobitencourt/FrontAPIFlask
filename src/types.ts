/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BarterRecord {
  id: string;
  sourceId: string;
  category: "Conceito" | "Operacional" | "Cálculo" | "Riscos & CPR" | "Legislação & ICMS";
  title: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: BarterRecordWithScore[];
  metrics?: {
    searchTimeMs?: number;
    generationTimeMs?: number;
    similarityThresholdUsed?: number;
    tokensEstimate?: number;
  };
}

export interface BarterRecordWithScore extends BarterRecord {
  similarity: number;
}

export interface DiagnosisConfig {
  backendUrl: string;
  apiKeySet: boolean;
  contentTypeChecked: boolean;
  methodsAllowed: string[];
}
