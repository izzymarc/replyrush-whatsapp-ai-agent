
import { GoogleGenAI, Type } from "@google/genai";
import { Business, Product, FAQ, Order } from "../types";

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
Your tone should be "Nigerian-friendly" (polite, respects the customer, uses phrases like "boss", "customer", "good day", but stays professional).

Business Info:
- Name: ${context.business.name}
- WhatsApp: ${context.business.whatsapp}
- Address: ${context.business.address}
- Working Hours: ${context.business.workingHours}
- Delivery Fee: ₦${context.business.deliveryFee} (flat rate)
- Payment: ${context.business.bankDetails}

Product Catalog:
${productContext}

FAQs:
${faqContext}

Rules:
1. Never hallucinate prices or products. If something isn't listed, say we don't have it or suggest the closest alternative.
2. If a customer wants to order:
   - Check if the item is in stock.
   - Collect their Name, Delivery Address, and specific item/quantity if missing.
   - Once you have all details, provide an order summary including the delivery fee and the payment instructions.
3. If a customer is angry or the request is too complex, apologize and say "I'll connect you to one of our human staff shortly to resolve this."
4. Keep messages short and easy to read on WhatsApp.
5. If you identify a clear intent to buy and all fields (Name, Address, Item) are present, you MUST return a structured response for the order system.

Detecting Order Intent:
You should respond with JSON when the user is finalizing an order.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply_message: { type: Type.STRING, description: "The message to send back to the user on WhatsApp." },
            order_intent: { type: Type.BOOLEAN, description: "Set to true if the user is confirming a specific order." },
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
      reply_message: "Eyah, sorry boss. My network is acting up. Could you please send that again?",
      order_intent: false
    };
  }
};
