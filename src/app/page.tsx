// page.tsx
'use client'; // next/js treats this as a client component since it uses hooks and browser api's?
import Dropzone from '@/components/Dropzone'; // import the Dropzone component
import { useState } from 'react'; // import the useState hook from react
import { parsePdfFile, parseTextFile, parseDocxFile } from '@/lib/parser';
import { extractInsuredNameFromText } from '@/lib/llm'; // import the function to extract the insured name from the text

type UploadFile = {
  file: File;
  status: 'uploaded' | 'processing' | 'done' | 'error';
  text?: string;
  insuredName?: string; // optional property to hold the insured name
};

export default function Page(){
  
  const [files, setFiles] = useState<UploadFile[]>([]); // state to hold the files dropped in the dropzone

  const handleFiles = async (newFiles: File[]) => {
    for ( const file of newFiles){
      console.log('files received:', file.name); // log the files received from the dropzone
      setFiles((prevFiles) => [...prevFiles, {file, status: 'processing'}]); // update the state with the new files

      try {
        let text ;
        if (file.type === 'text/plain') {
          text = await parseTextFile(file); // parse the file if it is a text file
        } 
        else if (file.type === 'application/pdf') {
          text = await parsePdfFile(file);
        }
        else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          text = await parseDocxFile(file);
        }

        const res = await fetch('/api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        const data = await res.json();
        const insuredName = data.name;
        
        console.log('LLM Insured Name:', insuredName);
        


        // Update status to done and we attch the text to the file object
        setFiles(prev =>
          prev.map(f =>
            f.file.name === file.name
              ? { ...f, status: 'done', insuredName }
              : f
          )
        );

      } catch (error)  {
        // If there is an error, update the status to error
        console.error('Error parsing file:', file.name, error); // log the error
        setFiles(prev =>
          prev.map(f =>
            f.file.name === file.name
              ? { ...f, status: 'error' }
              : f
          )
        );
      }

    }
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4">AI Insurance Claim Parser</h1>

      {/* Include Dropzone Component and give it handlefiles funct as a prop to ensure accurate handling of files upon drop*/}
      <Dropzone onFiles={handleFiles} />

      {/* Display the files dropped in the dropzone */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Files Uploaded:</h2>
        <ul className="list-disc list-inside">
          {/* loop thru file arr and display each file name */}
          {files.map((f, index) => (
            <li key={index}>
              {f.file.name} – <span className="italic">{f.status}</span>
            </li> //for each file, display the file name
          ))}
        </ul>
        </div>
    </main>
    );
  }
