// src/services/geminiService.ts
// REPLACE THE ENTIRE FILE WITH THIS CODE

import { ApiService } from './apiService';

export const GeminiService = {
  generateLifeInsights: async (): Promise<string> => {
    try {
      const response = await ApiService.generateInsights();
      return response.data;
    } catch (error: any) {
      console.error("AI Insights Error:", error);
      return error.message || "AI services are currently offline. Please try again later.";
    }
  }
};