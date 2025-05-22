

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