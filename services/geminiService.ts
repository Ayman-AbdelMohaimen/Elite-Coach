
import { GoogleGenAI, Type } from "@google/genai";
import { AGENT_SYSTEM_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean base64 string
const getBase64 = (base64String: string) => {
    return base64String.includes(',') ? base64String.split(',')[1] : base64String;
};

// 1. Generate Speech (TTS)
export const generateSpeech = async (text: string, voiceName: string = 'Kore'): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: { parts: [{ text }] },
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });
  
  const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!audioData) throw new Error("No audio generated");
  return audioData;
}

// 2. Analyze Articulation Drill
export const analyzeArticulationDrill = async (audioBase64: string, text: string, focus: string, mimeType: string, lang: 'en' | 'ar') => {
    const prompt = `
      Analyze the user's pronunciation of the text: "${text}".
      Focus specifically on: ${focus}.
      Language: ${lang}.
      
      Return a JSON object with:
      - score: number (0-100)
      - feedback: string (markdown, concise corrections)
      - intonationScore: number (0-100)
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: mimeType || 'audio/webm', data: getBase64(audioBase64) } },
                { text: prompt }
            ]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.INTEGER },
                    feedback: { type: Type.STRING },
                    intonationScore: { type: Type.INTEGER },
                },
                required: ['score', 'feedback', 'intonationScore']
            }
        }
    });

    return JSON.parse(response.text || '{}');
}

// 3. Analyze Diagnostic
export const analyzeDiagnostic = async (audioBase64: string, mimeType: string, lang: 'en' | 'ar') => {
     const prompt = `
      Analyze this diagnostic reading. Identify specific articulation weaknesses (like TH, R, L, S, etc.).
      Language context: ${lang}.
      
      Return JSON:
      - score: number (0-100)
      - weaknesses: string[] (list of phonemes)
      - plan: string (recommended focus areas)
      - feedback: string (detailed analysis)
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: mimeType || 'audio/webm', data: getBase64(audioBase64) } },
                { text: prompt }
            ]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.INTEGER },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    plan: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                },
                 required: ['score', 'weaknesses', 'plan', 'feedback']
            }
        }
    });
     return JSON.parse(response.text || '{}');
}

// 4. Analyze Shadowing
export const analyzeShadowing = async (audioBase64: string, text: string, mimeType: string, lang: 'en' | 'ar') => {
     const prompt = `
      Compare user speech to target text: "${text}".
      Evaluate rhythm, stress, and pronunciation match.
      Language: ${lang}.
      
      Return JSON:
      - score: number (0-100)
      - feedback: string (specific tips on rhythm/stress)
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: mimeType || 'audio/webm', data: getBase64(audioBase64) } },
                { text: prompt }
            ]
        },
         config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.INTEGER },
                    feedback: { type: Type.STRING },
                },
                required: ['score', 'feedback']
            }
        }
    });
    return JSON.parse(response.text || '{}');
}

// 5. Analyze Speed Drill
export const analyzeSpeedDrill = async (audioBase64: string, question: string, mimeType: string, lang: 'en' | 'ar') => {
    const prompt = `
      User is answering: "${question}".
      Evaluate speed, coherence, and grammar.
      Language: ${lang}.
      
      Return JSON:
      - score: number (0-100)
      - feedback: string (grammar correction and speed assessment)
    `;

     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: mimeType || 'audio/webm', data: getBase64(audioBase64) } },
                { text: prompt }
            ]
        },
         config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.INTEGER },
                    feedback: { type: Type.STRING },
                },
                required: ['score', 'feedback']
            }
        }
    });
    return JSON.parse(response.text || '{}');
}

// 6. Transcribe Audio
export const transcribeAudio = async (audioBase64: string, mimeType: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: mimeType || 'audio/webm', data: getBase64(audioBase64) } },
                { text: "Transcribe this audio exactly." }
            ]
        },
        config: {
            responseMimeType: 'text/plain'
        }
    });
    return response.text || "";
}

// 7. Generate Visual Summary (Infographic)
export const generateVisualSummary = async (text: string, lang: 'en' | 'ar'): Promise<string> => {
    const prompt = `
      Create a visual infographic summary of the following text: "${text.substring(0, 500)}...".
      Style: Minimalist, educational, clear headers.
      Language of text in image: ${lang === 'ar' ? 'Arabic' : 'English'}.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }]
        },
        config: {
            // responseMimeType is not supported for image models
        }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("No image generated");
}

// 8. Chat with Agent
export const chatWithAgent = async (audioBase64: string, personaId: string, lang: 'en' | 'ar' = 'en') => {
  const prompt = `
    USER AUDIO INPUT RECEIVED.
    User Persona Context: ${personaId}
    Output Language: ${lang === 'ar' ? 'Arabic' : 'English'}
    
    Task:
    1. Transcribe the user's audio internally.
    2. Formulate a natural, empathetic response.
    3. If they made a significant pronunciation or grammar error, gently point it out.
    4. Keep response under 40 words.
    
    Response Format (JSON):
    {
      "replyText": "The text of your response."
    }
  `;

  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: AGENT_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyText: { type: Type.STRING },
          },
          required: ["replyText"],
        }
      },
      contents: {
        parts: [
          { inlineData: { mimeType: 'audio/webm', data: getBase64(audioBase64) } }, 
          { text: prompt }
        ]
      }
    });
    
    return JSON.parse(response.text || '{}');
};
