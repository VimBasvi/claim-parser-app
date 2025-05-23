// page.tsx
'use client'; // next/js treats this as a client component since it uses hooks and browser api's?
import Dropzone from '@/components/Dropzone'; // import the Dropzone component
import { useState } from 'react'; // import the useState hook from react
import { parsePdfFile, parseTextFile, parseDocxFile } from '@/lib/parser';
import { extractInsuredNameFromText } from '@/lib/llm'; // import the function to extract the insured name from the text
import { matchInsuredName } from '@/lib/match';
import { INSUREDS } from '@/lib/data'; // import the list of insured names

type UploadFile = {
  file: File;
  status: 'uploaded' | 'processing' | 'done' | 'error';
  text?: string;
  insuredName?: string; // optional property to hold the insured name
  matchedName?: string;
  distance?: number;
  allowPick?: boolean;
  internalId?: string | null;
};

export default function Page(){

  const handleManualPick = (fileIndex: number, name: string) => {
      const insured = INSUREDS.find(i => i.name === name);
      if (!insured) return;

      setFiles(prev =>
        prev.map((f, i) =>
          i === fileIndex
            ? {
                ...f,
                matchedName: insured.name,
                distance: 0,
                allowPick: false,
              }
            : f
        )
      );
    };

  
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
        const matchResult = matchInsuredName(insuredName);
        const matchedName = matchResult?.name ?? 'No match found';
        const distance = matchResult?.distance ?? 0;
        const allowPick = matchResult?.allowPick ?? false;
        const internalId = matchResult?.internalId ?? null;



        // Update status to done and we attch the text to the file object
        setFiles(prev =>
          prev.map(f =>
            f.file.name === file.name
              ? {
                  ...f,
                  status: 'done',
                  insuredName,
                  matchedName,
                  distance,
                  allowPick,
                  internalId,
                }
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
        <ul className="space-y-4">
          {files.map((f, index) => (
            <li key={index} className="border p-4 rounded shadow-sm bg-white">
              <p><strong>File:</strong> {f.file.name}</p>
              <p><strong>Status:</strong> <span className="italic">{f.status}</span></p>
              {f.status === 'done' && (
              <>
                <p><strong>Extracted Name:</strong> {f.insuredName}</p>
                <p><strong>Matched Name:</strong> {f.matchedName}</p>
                <p><strong>Levenshtein Distance:</strong> {f.distance}</p>
                <p><strong> Internal ID:</strong> {f.internalId}</p>

                {f.allowPick && (
                  <div className="mt-2">
                    <label className="block mb-1 font-medium">No confident match found. Select manually:</label>
                    <select
                      className="border rounded px-2 py-1"
                      onChange={(e) => handleManualPick(index, e.target.value)}
                      value={f.matchedName ?? ''}
                    >
                      <option value="">Select a name</option>
                      {INSUREDS.map((i) => (
                        <option key={i.internalId} value={i.name}>
                          {i.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            </li>
          ))}
        </ul>

        </div>
    </main>
    );
  }
