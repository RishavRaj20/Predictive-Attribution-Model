import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ChannelData, PredictionResult } from "../types";
import { MODEL_NAME } from "../constants";

// Initialize Gemini Client
// Note: In a production app, ensure this is handled securely.
// For this demo, we assume process.env.API_KEY is available as per instructions.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAttributionAnalysis = async (
  currentData: ChannelData[],
  targetBudget: number
): Promise<PredictionResult> => {

  const systemInstruction = `
    You are an expert Data Scientist and Marketing Attribution Specialist. 
    Your goal is to analyze marketing channel performance using Media Mix Modeling (MMM) principles.
    Identify diminishing returns (saturation points) for each channel.
    Reallocate the Total Budget provided to maximize Total Revenue (ROAS) and Conversions.
    
    Principles:
    1. Search and Social often have diminishing returns at high scale.
    2. Email usually has high ROAS but limited scalability (saturation).
    3. Display/Video are often assist channels but may have lower direct attribution.
    
    Output strictly in the requested JSON format.
  `;

  const prompt = `
    Current Channel Performance Data:
    ${JSON.stringify(currentData)}

    Target Total Budget for Next Period: $${targetBudget}

    Task:
    1. Analyze the efficiency (CPA, ROAS) of each channel.
    2. Suggest an optimal spend distribution for the new target budget.
    3. Predict the outcome (conversions, revenue) based on the new spend, assuming standard diminishing return curves (e.g., logarithmic or power law) relative to the current data points.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      totalBudget: { type: Type.NUMBER, description: "The total budget used in calculation" },
      projectedTotalConversions: { type: Type.NUMBER, description: "Sum of predicted conversions" },
      projectedTotalRevenue: { type: Type.NUMBER, description: "Sum of predicted revenue" },
      summaryAnalysis: { type: Type.STRING, description: "A brief strategic summary of the changes (max 2 sentences)." },
      suggestions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            channelName: { type: Type.STRING },
            currentSpend: { type: Type.NUMBER },
            recommendedSpend: { type: Type.NUMBER },
            predictedConversions: { type: Type.NUMBER },
            predictedRevenue: { type: Type.NUMBER },
            reasoning: { type: Type.STRING, description: "Why this change was made (e.g., 'High ROAS headroom', 'Hit diminishing returns')" },
            action: { type: Type.STRING, enum: ["increase", "decrease", "maintain"] }
          },
          required: ["channelName", "currentSpend", "recommendedSpend", "predictedConversions", "predictedRevenue", "reasoning", "action"]
        }
      }
    },
    required: ["totalBudget", "suggestions", "projectedTotalConversions", "projectedTotalRevenue", "summaryAnalysis"]
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for consistent analytical results
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as PredictionResult;
  } catch (error) {
    console.error("Error generating attribution analysis:", error);
    throw error;
  }
};
