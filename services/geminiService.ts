
import { GoogleGenAI, Type } from "@google/genai";
import { ActionType, MacroAction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AIMovementResponse {
  actions: MacroAction[];
  guide: string;
}

export const generateMovementMacro = async (
  techniqueName: string, 
  userBindings: Record<string, string>
): Promise<AIMovementResponse> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Du bist ein Experte für die Geekvice App und den Aimzenix Mouse & Keyboard (MnK) Adapter für Apex Legends.
               Der Aimzenix Adapter emuliert einen Controller. Erstelle ein Movement-Makro für: ${techniqueName}.
               
               WICHTIG:
               1. Nutze Controller-Stick-Bewegungen (STICK_MOVE) in PROZENT (-100 bis 100).
               2. Nutze KEY_PRESS Aktionen für Buttons. Ordne jeder KEY_PRESS Aktion eine logische "role" zu (z.B. "jump", "crouch", "interact", "tactical").
               3. Verwende für das Feld "key" die aktuell vom User gewählten Bindings: ${JSON.stringify(userBindings)}.
               4. Timings müssen extrem präzise sein (Aimzenix verarbeitet Makros im Millisekundenbereich).
               5. Erstelle eine deutsche Anleitung für die Geekvice App.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          actions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: "ActionType: STICK_MOVE, KEY_PRESS oder WAIT" },
                stick: { type: Type.STRING, description: "LS oder RS" },
                x: { type: Type.NUMBER, description: "Prozentwert -100 bis 100" },
                y: { type: Type.NUMBER, description: "Prozentwert -100 bis 100" },
                duration: { type: Type.NUMBER, description: "Zeit in ms" },
                role: { type: Type.STRING, description: "Logische Rolle: jump, crouch, interact, tactical" },
                key: { type: Type.STRING, description: "Der physische Button basierend auf den Bindings" }
              },
              required: ["type", "duration"]
            }
          },
          guide: { type: Type.STRING, description: "Anleitung für Geekvice/Aimzenix Konfiguration" }
        },
        required: ["actions", "guide"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "{}");
    const actions = (data.actions || []).map((d: any, index: number) => ({
      ...d,
      id: `geek_mnk_${Date.now()}_${index}`,
      type: d.type as ActionType
    }));
    
    return {
      actions,
      guide: data.guide || "Keine Anleitung verfügbar."
    };
  } catch (error) {
    console.error("AI Generation Error", error);
    return { actions: [], guide: "Fehler bei der KI-Generierung." };
  }
};
