import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            H
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">AI Headshot Pro</h1>
        </div>
        <div className="text-sm font-medium text-slate-500">
          Powered by Gemini 2.5
        </div>
      </div>
    </header>
  );
};
