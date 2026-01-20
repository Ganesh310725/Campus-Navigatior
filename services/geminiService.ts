
import { GoogleGenAI, Type } from "@google/genai";
import { Building, WebSearchResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function semanticSearch(query: string, buildings: Building[]) {
  if (buildings.length === 0) return null;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this campus search query: "${query}". 
    Based on the available buildings: ${JSON.stringify(buildings.map(b => ({ id: b.id, name: b.name, description: b.description, amenities: b.amenities })))}
    Determine if this refers to a specific building in the list. If yes, return its ID. If no, or if it's a general question, return null for buildingId.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          buildingId: { type: Type.STRING, nullable: true },
          explanation: { type: Type.STRING },
          isGeneralQuestion: { type: Type.BOOLEAN }
        },
        required: ["explanation", "isGeneralQuestion"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    return null;
  }
}

export async function campusWebSearch(query: string): Promise<WebSearchResponse> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Answer this question about Cambridge Institute of Technology (CIT) Bangalore or general campus life: "${query}". Use Google Search for the latest info.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map((chunk: any) => ({
      title: chunk.web?.title || "Source",
      uri: chunk.web?.uri || "#"
    })) || [];

  return {
    text: response.text || "I couldn't find specific information on the web right now.",
    sources: sources
  };
}

export async function getRouteAdvice(startName: string, endName: string, preference: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are a campus guide. A student wants to go from ${startName} to ${endName} with a preference for ${preference} routes.
    Write a short, friendly encouraging 2-sentence advice about this walk. Mention something specific about the campus layout or features.`,
  });

  return response.text;
}
