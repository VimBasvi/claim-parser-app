const mammoth = require('mammoth'); //sidestep the typing problem by using require instead of import

// starting with a .txt file parser
export async function parseTextFile(file: File): Promise<string> {
	return new Promise((resolve, reject) => {

		// FileReader allows us to read files stored in memory by the browser
		const reader = new FileReader();

		reader.onload = () => {
			resolve(reader.result as string); // resolve the promise with the file content	
			console.log('File content:', reader.result); // log the file content
		};

		reader.onerror = () => {
			reject(new Error('Error reading file')); // reject the promise with an error
		};
		reader.readAsText(file); // read the file as plain text for .txt files
	})};


export async function parsePdfFile(file: File): Promise<string> { 
	// moved bcz of err: DOMMatrix is not defined
	const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
	const pdfjsWorker = (await import('pdfjs-dist/legacy/build/pdf.worker')) as any;
	//Could not find a declaration file for module 'pdfjs-dist/legacy/build/pdf.worker'. 'c:/Users/Vimbi/OneDrive/Desktop/AI Insurance/claim-parser-app/node_modules/pdfjs-dist/legacy/build/pdf.worker.js' implicitly has an 'any' type.
  
	// Assign the local worker correctly
	pdfjsLib.GlobalWorkerOptions.workerSrc = (pdfjsWorker as any).default;  


	const arrayBuff = await file.arrayBuffer(); // convert the file to an array buffer
	const pdf = await pdfjsLib.getDocument({data: arrayBuff}).promise; // load the pdf document

	let fullText = ''; // variable to hold the full text from all pages of pdf

	// Loop through each page in the PDF (from page 1 to the last page)
	for (let i = 1; i <= pdf.numPages; i++) {
		// Get the current page
		const page = await pdf.getPage(i);

		// Get the text content from the page
		const content = await page.getTextContent();

		// Extract just the text strings from the content
		const strings = content.items.map(item => (item as any).str);

		// Join the strings with spaces and add them to our fullText
		fullText += strings.join(' ') + '\n\n'; // Add spacing between pages
	}

	console.log('Extracted PDF Text:', fullText);

	//return the full text so we can store or display it elsewhere
	return fullText;
}

export async function parseDocxFile(file:File): Promise<string> {
	const arrayBuffer = await file.arrayBuffer(); // convert the file to an array buffer
	const {value} = await mammoth.convertToHtml({arrayBuffer}); // use mammoth to convert the array buffer to plain text
	console.log (value);
	return value.replace(/<[^>]*>/g, ''); // return the plain text no html tags
}

