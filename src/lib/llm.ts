// lib/llm.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function extractInsuredNameFromText(text: string): Promise<string> {
  try {
    // Get generative model instance
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash', // model name
    });

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `
You are reading an insurance document. Extract ONLY the full name of the **primary insured entity** from the text below.

TEXT:
${text}

Return only the name as plain text. No explanations, no formatting.
`.trim(),
          },
        ],
      },
    ];

    // all generateContent on the model instance and pass the contents array directly or as part of a GenerateContentRequest object
    const result = await model.generateContent({ contents });
    
    // It's good practice to access the response through response.text()  because ... if available for simple text
    const response = result.response; // Get the full response
    const firstCandidate = response.candidates?.[0];
    const part = firstCandidate?.content?.parts?.[0];

    if (typeof part?.text === 'string') {
      return part.text.trim();
    } else {
      throw new Error('No text content found in LLM response');
    }
  } catch (error) {
    console.error('LLM error:', error);
    return 'Unknown'; // Or rethrow, or handle more gracefully
  }
}