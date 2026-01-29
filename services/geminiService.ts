
import { GoogleGenAI, Type } from "@google/genai";
import { WineDryness, WineInfo } from "../types";

const API_KEY = process.env.API_KEY || "";

export const identifyWineFromImage = async (base64Image: string): Promise<WineInfo> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
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
          text: `Zidentyfikuj to włoskie wino na podstawie etykiety lub kodu kreskowego. 
          Zwróć szczególną uwagę na poziom słodkości: czy jest wytrawne (secco), półwytrawne (abboccato), półsłodkie (amabile) czy słodkie (dolce).
          Zwróć dane w formacie JSON.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Pełna nazwa wina" },
          region: { type: Type.STRING, description: "Region pochodzenia we Włoszech" },
          dryness: { 
            type: Type.STRING, 
            enum: ['Wytrawne', 'Półwytrawne', 'Półsłodkie', 'Słodkie'],
            description: "Poziom słodkości w języku polskim" 
          },
          description: { type: Type.STRING, description: "Krótki opis charakteru wina" },
          pairings: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Z czym najlepiej podawać to wino"
          },
          grapeType: { type: Type.STRING, description: "Odmiana winogron" },
          alcoholContent: { type: Type.STRING, description: "Zawartość alkoholu (szacowana jeśli nie widać)" }
        },
        required: ["name", "region", "dryness", "description", "pairings", "grapeType", "alcoholContent"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return data as WineInfo;
  } catch (error) {
    throw new Error("Nie udało się przeanalizować zdjęcia. Spróbuj ponownie z wyraźniejszym ujęciem.");
  }
};
