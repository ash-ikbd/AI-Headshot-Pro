import React, { useRef, useState } from 'react';
import { Button } from './Button';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          onImageSelected(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`
          relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300
          flex flex-col items-center justify-center gap-4 bg-white
          ${dragActive ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-slate-300 hover:border-indigo-400'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-2">
           <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
        </div>
        
        <h3 className="text-xl font-semibold text-slate-800">Upload your selfie</h3>
        <p className="text-slate-500 max-w-sm">
          Drag and drop your photo here, or browse.
          <br/>
          <span className="text-xs text-slate-400">Supports JPG, PNG (Max 5MB)</span>
        </p>

        <input 
          ref={inputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleChange} 
        />
        
        <Button onClick={() => inputRef.current?.click()} className="mt-4">
          Select Photo
        </Button>
      </div>
      
      <div className="mt-6 flex gap-4 overflow-x-auto pb-4 opacity-70 justify-center">
         {/* Sample thumbnails for trust signals */}
         {[1, 2, 3].map(i => (
           <div key={i} className="w-16 h-16 rounded-lg bg-slate-200 animate-pulse" />
         ))}
      </div>
    </div>
  );
};
