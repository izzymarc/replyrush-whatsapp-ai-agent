
import { GoogleGenAI, Type } from "@google/genai";
import { Business, Product, FAQ } from "../types";

export const generateAIResponse = async (
  message: string,
  history: { role: 'user' | 'model', text: string }[],
  context: { business: Business; products: Product[]; faqs: FAQ[] }
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const productContext = context.products.map(p => 
    `- ${p.name}: ${p.description} | Price: ₦${p.price.toLocaleString()} | ${p.inStock ? 'In Stock' : 'Out of Stock'}`
  ).join('\n');
  
  const faqContext = context.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');

  const systemPrompt = `
You are a professional, helpful, and polite Nigerian AI Sales Assistant for "${context.business.name}".
Your tone should be "${context.business.tone}".

Business Info:
- Name: ${context.business.name}
- WhatsApp: ${context.business.whatsapp}
- Address: ${context.business.address}
- Working Hours: ${context.business.workingHours}
- Delivery Fee: ₦${context.business.deliveryFee}
- Payment: ${context.business.bankDetails}

Product Catalog:
${productContext}

FAQs:
${faqContext}

Rules:
1. Never hallucinate prices.
2. Order Extraction: Extract customerName, deliveryAddress, and items.
3. Use your search tool to answer questions about Nigerian context (traffic, weather, holidays) if it helps provide better service.
4. Response Format: Always return the JSON structure specified.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        thinkingConfig: { thinkingBudget: 4000 },
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply_message: { type: Type.STRING },
            order_intent: { type: Type.BOOLEAN },
            extracted_order_fields: {
              type: Type.OBJECT,
              properties: {
                customerName: { type: Type.STRING },
                deliveryAddress: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      quantity: { type: Type.NUMBER }
                    }
                  }
                }
              }
            }
          },
          required: ["reply_message", "order_intent"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return {
      reply_message: "Eyah, boss. Network is slow on my end. Abeg, try again.",
      order_intent: false
    };
  }
};
