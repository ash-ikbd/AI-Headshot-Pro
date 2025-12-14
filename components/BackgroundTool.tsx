import React, { useState, useRef, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { Button } from './Button';

interface BackgroundToolProps {
  imageSrc: string;
}

const BG_OPTIONS = [
  { id: 'transparent', name: 'Transparent', value: 'transparent', class: 'checkerboard border-slate-300' },
  { id: 'white', name: 'White', value: '#ffffff', class: 'bg-white border-slate-200' },
  { id: 'grey', name: 'Grey', value: '#94a3b8', class: 'bg-slate-400 border-slate-400' },
  { id: 'dark', name: 'Dark', value: '#1e293b', class: 'bg-slate-800 border-slate-800' },
  { id: 'blue', name: 'Blue', value: '#dbeafe', class: 'bg-blue-100 border-blue-200' },
  { id: 'green', name: 'Green', value: '#22c55e', class: 'bg-green-500 border-green-600' },
];

export const BackgroundTool: React.FC<BackgroundToolProps> = ({ imageSrc }) => {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('transparent');
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (processedImage) URL.revokeObjectURL(processedImage);
    };
  }, [processedImage]);

  const processImage = async () => {
    if (processedImage) return;
    setIsProcessing(true);
    setError(null);
    try {
      const blob = await removeBackground(imageSrc);
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (err: any) {
      console.error(err);
      setError("Failed to remove background. Your browser might block the required resources.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.download = `headshot-bg-removed-${Date.now()}.png`;

    if (selectedColor === 'transparent') {
      link.href = processedImage;
      link.click();
    } else {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Draw background
        ctx.fillStyle = BG_OPTIONS.find(o => o.id === selectedColor)?.value || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw image
        ctx.drawImage(img, 0, 0);
        
        // Convert to data URL
        const format = selectedColor === 'transparent' ? 'image/png' : 'image/jpeg';
        link.href = canvas.toDataURL(format, 0.95);
        link.download = `headshot-${selectedColor}-${Date.now()}.${format === 'image/jpeg' ? 'jpg' : 'png'}`;
        link.click();
      };
      img.src = processedImage;
    }
  };

  if (!processedImage && !isProcessing && !error) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Edit Background</h3>
        <p className="text-slate-500 mb-4 text-sm">Remove the background to use a transparent or solid color backdrop.</p>
        <Button onClick={processImage} variant="secondary">
          Remove Background
        </Button>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
        <p className="font-medium text-slate-700">Removing background...</p>
        <p className="text-xs text-slate-400 mt-2">This happens locally in your browser and may take a moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg border border-indigo-100 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Preview Area */}
        <div className="flex-1 relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
           {/* Background Layer */}
           <div 
             className={`absolute inset-0 transition-colors duration-300 ${
               selectedColor === 'transparent' ? 'checkerboard' : ''
             }`}
             style={{ 
               backgroundColor: selectedColor !== 'transparent' 
                 ? BG_OPTIONS.find(o => o.id === selectedColor)?.value 
                 : undefined 
             }}
           />
           
           {/* Image Layer */}
           {processedImage && (
             <img 
               src={processedImage} 
               alt="Background Removed" 
               className="absolute inset-0 w-full h-full object-cover relative z-10"
             />
           )}
           
           {/* Canvas for compositing (hidden) */}
           <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Area */}
        <div className="flex flex-col gap-6 md:w-64">
           <div>
             <h3 className="font-semibold text-slate-800 mb-3">Select Background</h3>
             <div className="grid grid-cols-3 gap-3">
               {BG_OPTIONS.map((opt) => (
                 <button
                   key={opt.id}
                   onClick={() => setSelectedColor(opt.id)}
                   className={`
                     w-full aspect-square rounded-lg border-2 transition-all flex items-center justify-center overflow-hidden
                     ${selectedColor === opt.id ? 'ring-2 ring-indigo-500 ring-offset-2 border-transparent' : 'border-slate-200 hover:border-slate-300'}
                     ${opt.class}
                   `}
                   title={opt.name}
                 >
                   {opt.id === 'transparent' && (
                     <span className="text-xs text-slate-400 font-medium bg-white/80 px-1 rounded">None</span>
                   )}
                 </button>
               ))}
             </div>
           </div>

           {error && (
             <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg">
               {error}
             </div>
           )}

           <div className="mt-auto space-y-3">
             <Button onClick={handleDownload} className="w-full">
               Download Edited
             </Button>
             <button 
               onClick={() => {
                 setProcessedImage(null);
                 setError(null);
               }}
               className="w-full py-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
             >
               Cancel Editing
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
