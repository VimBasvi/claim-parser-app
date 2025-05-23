https://medium.com/stackanatomy/create-a-drag-and-drop-zone-in-react-with-react-dropzone-1fcdc6a3be4b

https://www.geeksforgeeks.org/how-to-use-react-dropzone-module-in-reactjs/


Looks into uploading data from csv but still useful to take a peek
https://www.geeksforgeeks.org/how-to-load-data-from-a-file-in-next-js/


https://react-dropzone.js.org/


Journey

Started with Dropzone Component
Checked if it worked in page.tsx 
Parsed .txt file - had hard time with drag and drop - realized I had forgotten to include it in accepted files for the dropzone after an hr or so when upload wasn't working 


Installs:

npm install pdfjs-dist
npm install pdfjs-dist@3.11.174
npm install @google/generative-ai
npm install mammoth

// lib/llm.ts
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// This function receives raw text from a file and asks Gemini to extract the name
export async function extractInsuredNameFromText(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
You are reading an insurance document. Extract ONLY the full name of the **primary insured entity** from the text below.

TEXT:
${text}

Return only the name as plain text. No explanations, no formatting.
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('LLM error:', error);
    return 'Unknown';
  }
}

Turn off extensions like grammarly to prevent error like.....