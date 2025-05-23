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
        parts: [{ text: `You are reading insurance documents. Extract ONLY the full name of the primary insured entity from each input. Return ONLY the name as plain text. No explanations, no formatting.` }]
      },
      {
        role: 'user',
        parts: [{ text: `TEXT:\nThis claim involves Starlight Entertainment Corp.\n\nAnswer:` }]
      },
      {
        role: 'model',
        parts: [{ text: `Starlight Entertainment Corp` }]
      },
      {
        role: 'user',
        parts: [{ text: `TEXT:\nPayment processed for Golden Gate Ventures LLC.\n\nAnswer:` }]
      },
      {
        role: 'model',
        parts: [{ text: `Golden Gate Ventures LLC` }]
      },
      {
        role: 'user',
        parts: [{ text: `TEXT:\n${text}\n\nAnswer:` }]
      }
    ];

    // call generateContent on the model instance and pass the contents array directly or as part of a GenerateContentRequest object
    const result = await model.generateContent({ contents });
    
    //   access the response through response.text()  because ... if available for simple text
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