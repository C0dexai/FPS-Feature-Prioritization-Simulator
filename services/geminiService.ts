import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { Feature } from '../types';
import { MoSCoWCategory, KanoCategory } from '../types';

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

const featureSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: "A short, descriptive name for the feature (e.g., 'User Authentication')."
        },
        description: {
            type: Type.STRING,
            description: "A one-sentence explanation of what the feature does."
        },
    },
    required: ["name", "description"]
};

export const generateFeatures = async (productConcept: string): Promise<Feature[]> => {
    const aiClient = getAiClient();
    const prompt = `
        Generate a list of 8 diverse and realistic software features for a new product concept: "${productConcept}".
        Include a mix of essential features, performance improvements, and delightful "nice-to-haves".
        Do not include features that have already been generated. Make them unique.
    `;

    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        features: {
                            type: Type.ARRAY,
                            items: featureSchema
                        }
                    },
                    required: ["features"]
                }
            }
        });

        const jsonText = response.text;
        const parsed = JSON.parse(jsonText);
        
        if (!parsed.features || !Array.isArray(parsed.features)) {
            throw new Error("Invalid response format from API.");
        }

        return parsed.features.map((featureData: any, index: number) => ({
            id: `gen-${Date.now()}-${index}`,
            name: featureData.name,
            description: featureData.description,
            moscow: MoSCoWCategory.None,
            kano: KanoCategory.None,
            rice: { reach: 50, impact: 2, confidence: 80, effort: 5 }
        }));
    } catch (error) {
        console.error("Error generating features with Gemini:", error);
        if (error instanceof Error && error.message.includes("API_KEY environment variable is not set")) {
            throw error; // Re-throw the specific error to be caught in the UI
        }
        throw new Error("Failed to generate features. Please check your network connection and try again.");
    }
};

export const startChat = (features: Feature[]): Chat => {
    const aiClient = getAiClient();
    const systemInstruction = `
        You are a world-class product management coach. 
        Your goal is to help the user understand and apply prioritization frameworks (MoSCoW, RICE, Kano) to the list of features provided.
        Be concise, insightful, and ask clarifying questions to guide the user. 
        When asked for analysis, refer to the frameworks and explain your reasoning.
        Do not output JSON unless explicitly asked. Your responses should be conversational markdown.

        Here is the current list of features to discuss:
        ${JSON.stringify(features.map(({ id, name, description }) => ({ id, name, description })), null, 2)}
    `;

    const chat = aiClient.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
    });

    return chat;
};
