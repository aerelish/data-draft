import path from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { GoogleGenAI } from "@google/genai";
import { parsePrismaModels } from "./parsePrismaModels";

const ai = new GoogleGenAI({  
  apiKey: process.env.GEMINI_API!
});

export const generateMockData = async (schemaPath: string, dataPath: string, count: number) => {
  
  const models = await parsePrismaModels(schemaPath);

  for (const model of models) {
    
    const prompt = `Generate ${count} mock data objects that match the following prisma.schema model:\n${JSON.stringify(model, null, 2)}\nRespond with ONLY a JSON array of ${count} items. No explanation, no markdown, no extra text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      }
    });

    const jsonData = response.text;

    if (jsonData) {

      // create directory if not exist yet
      mkdirSync(dataPath, { recursive: true });
      
      // set path to that directory
      const filePath = path.join(dataPath, `ddraft-${model.name}.json`);
      writeFileSync(filePath, jsonData || "");

    }

  }

  console.log('✅ File Created!');

}