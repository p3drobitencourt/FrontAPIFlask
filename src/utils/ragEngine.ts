import { GoogleGenAI } from "@google/genai";
import { barterDatabase } from "../barterData.js";
import { BarterRecord, BarterRecordWithScore } from "../types.js";

// Normalize text for basic keyword overlap
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s]/g, " ") // remove punctuation
    .trim();
}

// Compute simple TF-IDF / overlap vector cosine similarity
export function computeLocalSimilarity(query: string, docs: BarterRecord[]): BarterRecordWithScore[] {
  const normQuery = normalizeText(query);
  const queryWords = normQuery.split(/\s+/).filter(w => w.length > 2);

  if (queryWords.length === 0) {
    // Default uniform scoring if query is too short
    return docs.map(doc => ({ ...doc, similarity: 0.1 }));
  }

  // Calculate TF-IDF of each doc for query terms
  const docFrequencies: Record<string, number> = {};
  docs.forEach(doc => {
    const normContent = normalizeText(doc.title + " " + doc.content);
    const words = normContent.split(/\s+/);
    const uniqueWords = new Set(words);
    uniqueWords.forEach(w => {
      docFrequencies[w] = (docFrequencies[w] || 0) + 1;
    });
  });

  const scores = docs.map(doc => {
    const normContent = normalizeText(doc.title + " " + doc.content);
    const words = normContent.split(/\s+/);
    
    // Count matches weighted by Inverse Document Frequency (IDF)
    let score = 0;
    queryWords.forEach(qWord => {
      const tf = words.filter(w => w === qWord).length;
      if (tf > 0) {
        const df = docFrequencies[qWord] || 1;
        const idf = Math.log((docs.length + 1) / (df + 1)) + 1;
        // Boost matches in title
        const titleWords = normalizeText(doc.title).split(/\s+/);
        const inTitleBoost = titleWords.includes(qWord) ? 2.5 : 1.0;
        score += tf * idf * inTitleBoost;
      }
    });

    // Length normalization factor
    const docLength = Math.sqrt(words.length) || 1;
    const finalScore = Math.min(score / docLength, 1.0);

    return {
      ...doc,
      similarity: isNaN(finalScore) ? 0 : parseFloat(finalScore.toFixed(4))
    };
  });

  // Sort by highest similarity
  return scores.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Perform retrieval using either Gemini Embeddings or Local Fallback
 */
export async function performRetrieval(
  query: string,
  apiKey?: string,
  threshold = 0.05
): Promise<{ sources: BarterRecordWithScore[]; mode: "Google AI Studio Embeddings" | "Simulador Local (TF-IDF)" }> {
  // Try to use Google AI Studio Embeddings if API Key is configured
  if (apiKey && apiKey !== "" && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Fetch query embedding
      const queryEmbedResult = await ai.models.embedContent({
        model: "gemini-embedding-2-preview",
        contents: query,
      });

      const qEmbedding = Array.isArray(queryEmbedResult.embeddings)
        ? queryEmbedResult.embeddings[0]
        : queryEmbedResult.embeddings;
      const queryVector = qEmbedding?.values;

      if (queryVector && queryVector.length > 0) {
        // Since we cannot run embedding for all 30 documents on every API request 
        // because of latency and token limits, we precalculate a deterministic mapping seed 
        // to embed documents, or we compute local similarity first to pre-rank, or we fetch embeddings for the top subset!
        // To make it beautiful and 100% reliable, let's combine Google Embeddings for the Query and Top Candidates,
        // or Fallback.
        // Let's first rank with TF-IDF to get the top 10 candidates quickly.
        const candidates = computeLocalSimilarity(query, barterDatabase).slice(0, 8);
        
        // Let's fetch embeddings for these top candidates to perform a real high-fidelity Cosine Similarity!
        const embeddedCandidates: BarterRecordWithScore[] = [];
        
        for (const doc of candidates) {
          try {
            const docEmbedResult = await ai.models.embedContent({
              model: "gemini-embedding-2-preview",
              contents: doc.title + "\n" + doc.content,
            });
            const dEmbedding = Array.isArray(docEmbedResult.embeddings)
              ? docEmbedResult.embeddings[0]
              : docEmbedResult.embeddings;
            const docVector = dEmbedding?.values;

            if (docVector && docVector.length > 0) {
              // Calculate Cosine Similarity
              let dotProduct = 0;
              let queryNormSq = 0;
              let docNormSq = 0;
              for (let i = 0; i < Math.min(queryVector.length, docVector.length); i++) {
                dotProduct += queryVector[i] * docVector[i];
                queryNormSq += queryVector[i] * queryVector[i];
                docNormSq += docVector[i] * docVector[i];
              }
              const cosineSim = dotProduct / (Math.sqrt(queryNormSq) * Math.sqrt(docNormSq));
              // Convert scale slightly to look elegant [0, 1]
              const scaledSim = parseFloat(((cosineSim + 1) / 2).toFixed(4));
              embeddedCandidates.push({
                ...doc,
                similarity: scaledSim,
              });
            } else {
              embeddedCandidates.push(doc);
            }
          } catch (err) {
            console.error("Error embedding document", doc.id, err);
            embeddedCandidates.push(doc); // fall back to TF-IDF score for this element
          }
        }

        // Sort embedded candidates by updated Cosine Similarity
        embeddedCandidates.sort((a, b) => b.similarity - a.similarity);
        
        return {
          sources: embeddedCandidates.filter(src => src.similarity >= threshold),
          mode: "Google AI Studio Embeddings",
        };
      }
    } catch (e) {
      console.warn("Gemini Embeddings call failed, fallback to Local similarity matcher:", e);
    }
  }

  // Fallback to local
  const localMatched = computeLocalSimilarity(query, barterDatabase);
  return {
    sources: localMatched.filter(src => src.similarity >= threshold),
    mode: "Simulador Local (TF-IDF)",
  };
}
