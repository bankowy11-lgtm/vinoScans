
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { WineInfo } from "../types.ts";

// Bezpieczny dostęp do klucza API
const getApiKey = () => {
  try {
    return (window as any).process?.env?.API_KEY || "";
  } catch (e) {
    return "";
  }
};

export const identifyWineFromImage = async (base64Image: string): Promise<WineInfo> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: `Zidentyfikuj to włoskie wino. Zwróć dane w formacie JSON. 
          Dodaj informację o klasyfikacji (DOCG, DOC, IGT), optymalnej temperaturze serwowania oraz rozbuduj opis sommelierski.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          region: { type: Type.STRING },
          dryness: { type: Type.STRING, enum: ['Wytrawne', 'Półwytrawne', 'Półsłodkie', 'Słodkie'] },
          description: { type: Type.STRING },
          pairings: { type: Type.ARRAY, items: { type: Type.STRING } },
          grapeType: { type: Type.STRING },
          alcoholContent: { type: Type.STRING },
          servingTemp: { type: Type.STRING, description: "Np. 16-18°C" },
          classification: { type: Type.STRING, description: "Np. DOCG" }
        },
        required: ["name", "region", "dryness", "description", "pairings", "grapeType", "alcoholContent", "servingTemp", "classification"]
      }
    }
  });

  try {
    const text = response.text || "{}";
    const data = JSON.parse(text);
    return { ...data, timestamp: Date.now(), id: Math.random().toString(36).substr(2, 9) } as WineInfo;
  } catch (error) {
    throw new Error("Nie udało się przeanalizować zdjęcia. Spróbuj ponownie.");
  }
};

export const speakSommelierNotes = async (text: string) => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Jesteś profesjonalnym włoskim sommelierem. Przeczytaj te notatki z pasją i elegancją: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64Audio) {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const arrayBuffer = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer;
    
    const dataInt16 = new Int16Array(arrayBuffer);
    const audioBuffer = audioContext.createBuffer(1, dataInt16.length, 24000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
    return audioContext;
  }
};
