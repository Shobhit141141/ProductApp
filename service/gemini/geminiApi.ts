import { Product, Recommendation } from "@/types";
import Constants from "expo-constants";
const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey;

export const buildPrompt = (userQuery: string, products: Product[]): string => {
  const productList = products
    .map(
      (p) =>
        `Product: ${p.product_name}\nBrand: ${p.brand}\nCategory: ${p.category}\nPrice: ${p.price}\nDescription: ${p.description}`
    )
    .join("\n\n");

  return `
You are an AI product advisor.
User request: "${userQuery}"

Available products:
${productList}

Please recommend all products that best match the user's request. 
Explain why you recommend each product briefly.
Return the result in JSON format like:
[
  { "product_name": "...", "brand": "...", "reason": "...", "price": "...","category": "...", "description": "...", "isTopPick": true/false }
]
`;
};
export const getRecommendations = async (prompt: string): Promise<Recommendation[]> => {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    let text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) return [];

    text = text.trim().replace(/^```json\s*/, "").replace(/```$/, "");

    const match = text.match(/\[.*\]/s);
    if (!match) {
      console.error("No JSON array found in AI response:", text);
      return [];
    }

    const rawArray = JSON.parse(match[0]);

    const recommendations: Recommendation[] = rawArray.map((item: any) => ({
      product: {
        product_name: item.product_name,
        brand: item.brand,
        category: item.category ?? "",
        price: item.price ?? 0,
        description: item.description ?? "",
      },
      reason: item.reason,
      isTopPick: item.isTopPick ?? false,
    }));

    return recommendations;
  } catch (err) {
    console.error("Failed to parse AI response:", err);
    return [];
  }
};
