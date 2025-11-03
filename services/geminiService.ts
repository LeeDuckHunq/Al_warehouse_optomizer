
import { GoogleGenAI } from '@google/genai';
import { Sku } from '../types';
import { WAREHOUSE_LAYOUT_PROMPT } from '../constants';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getOptimalPlacement = async (skus: Sku[]): Promise<string> => {
  const model = 'gemini-2.5-flash';

  const skuDataString = skus
    .map(sku => `- SKU '${sku.name}': Priority Score = ${sku.priority.toFixed(4)}, Weight = ${sku.w} kg`)
    .join('\n');

  const prompt = `
You are an AI expert in warehouse logistics and optimization. Your task is to solve a Storage Location Assignment Problem (SLAP) based on the provided data.

**Objective:**
Assign each of the following SKUs to an optimal location in the described warehouse. The primary goal is to place SKUs with higher 'Priority Scores' closer to the main exit. A secondary goal is to place heavier items on lower, more accessible shelf tiers (T1 or T2) for safety and ease of handling.

**SKU Data:**
Here is the list of SKUs with their calculated Priority Score (higher is more urgent), and original weight.
${skuDataString}

**Warehouse Layout:**
${WAREHOUSE_LAYOUT_PROMPT}

**Your Task:**
Provide a specific location assignment for each SKU. Present the result as a clear, formatted list. For the top 5 highest priority SKUs, provide a brief sentence explaining the reasoning for your placement choice. The reasoning should be concise and directly related to the objectives.

**Output Format:**
- SKU '[SKU Name]': Assigned to **[Row]-[Section]-[Shelf]-[Tier]**
...
---
**Reasoning for Top Placements:**
1. **SKU '[SKU Name]':** [Your reasoning here].
2. **SKU '[SKU Name]':** [Your reasoning here].
...
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate content from Gemini API.");
  }
};
