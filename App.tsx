import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { StyleSelector } from './components/StyleSelector';
import { Button } from './components/Button';
import { BackgroundTool } from './components/BackgroundTool';
import { generateHeadshot } from './services/geminiService';
import { AppState, HeadshotStyle } from './types';
import { HEADSHOT_STYLES } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.UPLOAD);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<HeadshotStyle>(HEADSHOT_STYLES[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showBgTool, setShowBgTool] = useState(false);

  const handleImageSelected = (base64: string) => {
    setOriginalImage(base64);
    setState(AppState.CONFIGURE);
    setError(null);
    setShowBgTool(false);
  };

  const handleGenerate = async () => {
    if (!originalImage || !selectedStyle) return;

    setState(AppState.GENERATING);
    setError(null);
    setShowBgTool(false);

    // If custom style is selected, use the user's custom prompt.
    // Otherwise use the preset prompt.
    const promptToUse = selectedStyle.id === 'custom' ? customPrompt : selectedStyle.prompt;

    if (!promptToUse.trim()) {
      setError("Please enter a custom prompt.");
      setState(AppState.CONFIGURE);
      return;
    }

    try {
      const resultBase64 = await generateHeadshot(originalImage, promptToUse);
      setGeneratedImage(resultBase64);
      setState(AppState.RESULT);
    } catch (err: any) {
      setError(err.message || "Something went wrong during generation.");
      setState(AppState.CONFIGURE);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setCustomPrompt('');
    setState(AppState.UPLOAD);
    setError(null);
    setShowBgTool(false);
  };

  const handleTryAgain = () => {
    setState(AppState.CONFIGURE);
    setGeneratedImage(null);
    setError(null);
    setShowBgTool(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
             <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <span>{error}</span>
          </div>
        )}

        {/* STEP 1: UPLOAD */}
        {state === AppState.UPLOAD && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                Professional Headshots in Seconds
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Upload a casual selfie and let Gemini AI transform it into a professional studio-quality headshot.
              </p>
            </div>
            <ImageUpload onImageSelected={handleImageSelected} />
          </div>
        )}

        {/* STEP 2: CONFIGURE (Select Style) */}
        {(state === AppState.CONFIGURE || state === AppState.GENERATING) && originalImage && (
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
            
            {/* Left Column: Preview */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-slate-800">Original Photo</h3>
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white aspect-[3/4] md:aspect-auto">
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={handleReset}
                  disabled={state === AppState.GENERATING}
                  className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-slate-600 hover:text-red-600 hover:bg-white transition-colors shadow-sm disabled:opacity-0"
                  title="Remove image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Column: Controls */}
            <div className="flex flex-col gap-6">
              <StyleSelector 
                selectedStyleId={selectedStyle.id} 
                onSelect={(s) => !state.toString().includes('GENERATING') && setSelectedStyle(s)} 
              />
              
              {/* Custom Prompt Input */}
              {selectedStyle.id === 'custom' && (
                <div className="animate-fade-in">
                  <label htmlFor="custom-prompt" className="block text-sm font-medium text-slate-700 mb-2">
                    Describe your desired edit
                  </label>
                  <textarea
                    id="custom-prompt"
                    rows={4}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none resize-none"
                    placeholder="E.g., Make me look like a superhero, or add a vintage film grain..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    disabled={state === AppState.GENERATING}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Be descriptive for the best results.
                  </p>
                </div>
              )}

              <div className="mt-auto pt-6 border-t border-slate-200">
                <Button 
                  onClick={handleGenerate} 
                  className="w-full text-lg shadow-indigo-200 shadow-lg"
                  isLoading={state === AppState.GENERATING}
                >
                  Generate Headshot
                </Button>
                <p className="text-center text-xs text-slate-400 mt-3">
                  Generating usually takes 5-10 seconds.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RESULT */}
        {state === AppState.RESULT && generatedImage && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Your New Look</h2>
              <p className="text-slate-600">Here is your professional headshot generated by Gemini.</p>
            </div>
            
            {/* Show background tool OR results */}
            {showBgTool ? (
               <div className="max-w-4xl mx-auto">
                 <button 
                   onClick={() => setShowBgTool(false)}
                   className="mb-4 text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                   </svg>
                   Back to results
                 </button>
                 <BackgroundTool imageSrc={generatedImage} />
               </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  {/* Result Card */}
                  <div className="bg-white p-2 rounded-2xl shadow-xl border border-indigo-100 transform transition-transform hover:scale-[1.01] duration-300">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100">
                        <img 
                          src={generatedImage} 
                          alt="Generated Headshot" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          AI Generated
                        </div>
                    </div>
                  </div>

                  {/* Comparison / Original Card */}
                  <div className="bg-white p-2 rounded-2xl shadow border border-slate-100 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 grayscale hover:grayscale-0 transition-all duration-500">
                        <img 
                          src={originalImage || ''} 
                          alt="Original" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          Original
                        </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center mt-8 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href={generatedImage} 
                      download={`ai-headshot-${Date.now()}.jpg`}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Image
                    </a>
                    
                    <Button variant="secondary" onClick={() => setShowBgTool(true)}>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Edit Background
                    </Button>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={handleTryAgain} className="text-sm py-2 px-4">
                      Try Another Style
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="text-sm py-2 px-4">
                      Start Over
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </main>
      
      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 bg-white mt-8">
        <p>&copy; {new Date().getFullYear()} AI Headshot Pro. Built with Gemini 2.5 Flash Image.</p>
      </footer>
    </div>
  );
};

export default App;