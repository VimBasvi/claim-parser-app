'use client'; // next/js treats this as a client component since it uses hooks and browser api's?

import { useDropzone } from 'react-dropzone'; // hook handles the drag and drop functionality


type DropzoneProps = {
	  onFiles: (files: File[]) => void; //dropzone component epects a prop called onFiles which is a function that takes an array of files
};

// Dropzone component
// this is our default export when referencing this file
// it takes a prop called onFiles which is a function that takes an array of files
export default function Dropzone({ onFiles }: DropzoneProps) {
	const { getRootProps, getInputProps} = useDropzone({
		// accept only pdf, docx, and txt files 
		accept: {
			'application/pdf': [],
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
			'application/msword': [],
		},
		// funct called when files are dropped
		onDrop: (acceptedFiles) => {
			// call the onFiles prop with the accepted files
			onFiles(acceptedFiles); // pass the accepted files to the onFiles prop
			}
		});
	
		return (
		   // Spread the props from getRootProps() onto this <div>
    // It will handle all the drag-and-drop interactions
    <div
		{...getRootProps()}
		className="border-2 border-dashed border-gray-400 p-6 text-center cursor-pointer rounded-md"
	>
		{/* This hidden input lets users click the box to open the file picker */}
		<input {...getInputProps()} />

		{/* Instructional text for the user */}
		<p className="text-gray-600">
		Drag & drop .pdf, .docx, or .txt files here.
		</p>
		</div> 
	
			);
	
	}



