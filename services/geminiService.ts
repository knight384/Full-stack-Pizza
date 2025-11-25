import { GoogleGenAI, Type } from "@google/genai";
import { CustomPizza } from "../types";

// NOTE: In a real app, API keys should not be exposed on the client side like this unless restricted by domain.
// The user prompt implies a frontend demo. 
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generatePizzaNameAndDescription = async (pizza: CustomPizza): Promise<{ name: string; description: string }> => {
  if (!process.env.API_KEY) {
    return { name: "Custom Creation", description: "A delicious custom pizza made just for you." };
  }

  try {
    const prompt = `
      I have a pizza with the following ingredients:
      Base: ${pizza.base}
      Sauce: ${pizza.sauce}
      Cheese: ${pizza.cheese}
      Toppings: ${pizza.veggies.join(', ')}

      Please generate a creative, appetizing name (max 5 words) and a short, mouth-watering description (max 2 sentences) for this pizza.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Error:", error);
    return { name: "Custom Creation", description: "A delicious custom pizza made just for you." };
  }
};

export const suggestPizzaConfig = async (mood: string, inventory: { bases: string[], sauces: string[], cheeses: string[], veggies: string[] }): Promise<Partial<CustomPizza>> => {
    if (!process.env.API_KEY) {
        // Fallback random mock
        return {
            base: inventory.bases[0],
            sauce: inventory.sauces[0],
            cheese: inventory.cheeses[0],
            veggies: [inventory.veggies[0], inventory.veggies[1]]
        };
    }

    try {
        const prompt = `
            Suggest a pizza configuration based on this mood/craving: "${mood}".
            Available ingredients:
            Bases: ${inventory.bases.join(', ')}
            Sauces: ${inventory.sauces.join(', ')}
            Cheeses: ${inventory.cheeses.join(', ')}
            Veggies: ${inventory.veggies.join(', ')}

            Return a valid JSON object with fields: base, sauce, cheese, veggies (array).
            Only use available ingredients.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        base: { type: Type.STRING },
                        sauce: { type: Type.STRING },
                        cheese: { type: Type.STRING },
                        veggies: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Suggest Error:", error);
        return {};
    }
};

export const suggestToppings = async (mood: string, currentConfig: { base: string, sauce: string, cheese: string }, availableVeggies: string[]): Promise<string[]> => {
    if (!process.env.API_KEY) {
        return [availableVeggies[0], availableVeggies[Math.floor(Math.random() * availableVeggies.length)]];
    }

    try {
         const prompt = `
            I am building a pizza. 
            Current selection: Base: ${currentConfig.base}, Sauce: ${currentConfig.sauce}, Cheese: ${currentConfig.cheese}.
            
            My mood/craving is: "${mood}".
            
            Suggest a list of vegetable toppings from the available list that complement the current selection and match the mood.
            Available Veggies: ${availableVeggies.join(', ')}.

            Return a JSON object with a "veggies" array of strings.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        veggies: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        
        const text = response.text;
        if (!text) return [];
        const json = JSON.parse(text);
        return json.veggies || [];
    } catch (e) {
        console.error("AI Topping Suggest Error", e);
        return [];
    }
};