
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize GoogleGenAI with the API key from process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async generateBlogPosts() {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Write 3 professional blog posts for a URL shortener SaaS. Include Title, Excerpt, and Body content for each. Focus on digital marketing, link tracking, and SEO.',
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                excerpt: { type: Type.STRING },
                content: { type: Type.STRING },
                author: { type: Type.STRING },
                date: { type: Type.STRING }
              }
            }
          }
        }
      });
      // Use the .text property directly to access the generated content
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Gemini Error:", error);
      return [];
    }
  },

  async suggestAlias(originalUrl: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest 3 short, catchy URL alias words for: ${originalUrl}. Output only the words separated by commas.`,
      });
      // Use the .text property directly to access the generated content
      return response.text?.split(',').map(s => s.trim()) || [];
    } catch (error) {
      return ['link', 'go', 'visit'];
    }
  }
};
