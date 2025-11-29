
import { GoogleGenAI, Type } from "@google/genai";
import { COACH_PERSONA, DIAGNOSTIC_TEXT } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Text to Speech (TTS) ---
// Note: Speed is now handled by the AudioContext in the frontend hook.
export const generateSpeech = async (text: string, voiceName: 'Fenrir' | 'Kore' | 'Puck' | 'Charon' | 'Aoede') => {
  try {
    // Gemini 2.5 TTS Model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: {
        parts: [{ text: text }]
      },
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName
            }
          }
        }
      }
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) {
      throw new Error("No audio data received from Gemini TTS");
    }

    console.log(`Gemini TTS: Received ${audioData.length} chars.`);
    return audioData;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    throw error;
  }
};

// --- Existing Analysis Functions ---

export const analyzeArticulationDrill = async (audioBase64: string, drillText: string, drillFocus: string, mimeType: string, lang: 'en' | 'ar' = 'en') => {
  const prompt = `
    PHASE 1: ARTICULATION & INTONATION ANALYSIS
    
    Target Phrase: "${drillText}"
    Mechanics to Focus On: "${drillFocus}"
    User Interface Language: ${lang === 'ar' ? 'Arabic' : 'English'}

    Task:
    1. Listen to the user's pronunciation.
    2. ARTICULATION: Verify the "Mechanics to Focus On" (e.g., Tongue placement for TH, Lip position for V).
    3. INTONATION & STRESS: Did the user sound robotic or natural? Did they stress the correct words?
    4. SCORING:
       - Phonetic Accuracy Score (0-100): Based on clarity of sounds.
       - Intonation Score (0-100): Based on natural flow and stress.
    5. FEEDBACK:
       - Provide a Markdown list of physical corrections.
       - Specifically mention if they need more air (plosives) or vibration (voiced sounds).
    
    IMPORTANT: Provide the feedback text in ${lang === 'ar' ? 'Arabic' : 'English'} (but keep technical phonetics terms in English).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: COACH_PERSONA,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            intonationScore: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          },
          required: ["score", "intonationScore", "feedback"],
        }
      },
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: audioBase64 } },
          { text: prompt }
        ]
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Articulation Analysis Error:", error);
    throw error;
  }
};

export const analyzeDiagnostic = async (audioBase64: string, mimeType: string, lang: 'en' | 'ar' = 'en') => {
  const prompt = `
    DIAGNOSTIC TEST ANALYSIS
    Reference Text: "${DIAGNOSTIC_TEXT}"
    User Interface Language: ${lang === 'ar' ? 'Arabic' : 'English'}
    Task: Identify weaknesses (TH, R/L, P/B, V/W), Generate Plan, Score 0-100.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: COACH_PERSONA,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            plan: { type: Type.STRING },
            feedback: { type: Type.STRING }
          },
          required: ["score", "weaknesses", "plan", "feedback"],
        }
      },
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: audioBase64 } },
          { text: prompt }
        ]
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Diagnostic Error:", error);
    throw error;
  }
};

export const analyzeShadowing = async (audioBase64: string, text: string, mimeType: string, lang: 'en' | 'ar' = 'en') => {
  const prompt = `
    SHADOWING DRILL ANALYSIS
    Target Text: "${text}"
    Language: ${lang}
    Task: Check Rhythm and Pronunciation. Score 0-100. Feedback on speed/clarity.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: COACH_PERSONA,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          },
          required: ["score", "feedback"],
        }
      },
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: audioBase64 } },
          { text: prompt }
        ]
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Shadowing Error:", error);
    throw error;
  }
};

export const analyzeSpeedDrill = async (audioBase64: string, questionText: string, mimeType: string, lang: 'en' | 'ar' = 'en') => {
  const prompt = `
    SPEED TRAINING ANALYSIS
    Question: "${questionText}"
    Language: ${lang}
    Task: Evaluate answer speed, directness, and grammar. Feedback as Markdown list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: { systemInstruction: COACH_PERSONA },
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: audioBase64 } },
          { text: prompt }
        ]
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini Speed Analysis Error:", error);
    throw error;
  }
};

export const transcribeAudio = async (audioBase64: string, mimeType: string) => {
  const prompt = "Transcribe speech exactly. No markdown.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: audioBase64 } },
          { text: prompt }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Transcription Error:", error);
    throw error;
  }
};
