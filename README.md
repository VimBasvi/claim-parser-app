## References & Resources

### Core Functionality

* **React Dropzone Library**

  * [https://react-dropzone.js.org/](https://react-dropzone.js.org/)
  * [https://medium.com/stackanatomy/create-a-drag-and-drop-zone-in-react-with-react-dropzone-1fcdc6a3be4b](https://medium.com/stackanatomy/create-a-drag-and-drop-zone-in-react-with-react-dropzone-1fcdc6a3be4b)
  * [https://www.geeksforgeeks.org/how-to-use-react-dropzone-module-in-reactjs/](https://www.geeksforgeeks.org/how-to-use-react-dropzone-module-in-reactjs/)

* **Gemini API + Google Generative AI**

  * [https://aistudio.google.com/u/2/prompts/1BVU-c9aeA2Wbp-nRRAQ\_TKUstyyNziyV](https://aistudio.google.com/u/2/prompts/1BVU-c9aeA2Wbp-nRRAQ_TKUstyyNziyV)
  * [https://medium.com/google-cloud/developers-guide-to-getting-started-with-gemini-2-0-flash-on-vertex-ai-6b4fe3c6899f](https://medium.com/google-cloud/developers-guide-to-getting-started-with-gemini-2-0-flash-on-vertex-ai-6b4fe3c6899f)

* **File Uploading / Reading**

  * [https://www.geeksforgeeks.org/how-to-load-data-from-a-file-in-next-js/](https://www.geeksforgeeks.org/how-to-load-data-from-a-file-in-next-js/)
  * [https://developer.mozilla.org/en-US/docs/Web/API/FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
  * [https://github.com/mwilliamson/mammoth.js](https://github.com/mwilliamson/mammoth.js)

* **String Matching**

  * [`fastest-levenshtein`](https://www.npmjs.com/package/fastest-levenshtein) — for fuzzy string matching using Levenshtein distance

---

##  Setup & Installs

```bash
npm install pdfjs-dist@3.11.174
npm install @google/generative-ai
npm install mammoth
npm install fastest-levenshtein
```

---
## Gemini API Setup

To use the Gemini API (via `@google/generative-ai`), follow these steps:

### 1. Create a Google Cloud Project

If you don’t already have one, visit:  
 [https://console.cloud.google.com/](https://console.cloud.google.com/)

### 2. Enable the Gemini API for Your Project

- Go to the **Gemini API dashboard**
- Select or create your project
- Enable the **"Generative Language API"**

### 3. Create an API Key

- In the **API dashboard**, go to the **API Keys** section
- Click **“Create API Key”**
- Copy it and keep it secure (do **not** share publicly)

### 4. Create a `.env.local` File

At the root of your project, create a `.env.local` file and add:

```env
GEMINI_API_KEY=your_api_key_here

### 5. Restart  Development Server

```bash
npm run dev



## Learning Resources

* [React JS 19 Full Course (2025)](https://www.youtube.com/watch?v=dCLhUialKPQ&t=2479s)
* [Learn JavaScript (ES6+) in 30 Minutes](https://www.youtube.com/watch?v=Ks0Z_qP2WEk)

---

##  Journey & Implementation Notes

* **Started with**: Implementing the Dropzone component
* **Initial blockers**:

  * Drag and drop wasn’t working — turned out `.txt` files weren’t in the accepted file types for the Dropzone.
* **Progression**:

  * Parsed `.txt`, `.pdf`, and `.docx` using custom parsers
  * Implemented LLM call using Gemini (`@google/generative-ai`)
  * Built Levenshtein-based fuzzy match logic to identify the insured entity
  * Added fallback UI for manual selection if similarity < `0.8`
* **Current LLM Setup**:

* Google Gemini API website was useful in figuring out the typecript code.
---

## Troubleshooting

* **Turn off browser extensions** (e.g., Grammarly) to avoid hydration mismatch errors in Next.js
* **LLM errors** (like token limits or service unavailable) must be caught and surfaced gracefully in the UI to prevent crashes
* **Use `console.error`** for debugging but provide fallback UI for user-friendly feedback


