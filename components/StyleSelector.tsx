import React from 'react';
import { HeadshotStyle } from '../types';
import { HEADSHOT_STYLES } from '../constants';

interface StyleSelectorProps {
  selectedStyleId: string;
  onSelect: (style: HeadshotStyle) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyleId, onSelect }) => {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Choose your style</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HEADSHOT_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style)}
            className={`
              relative p-4 rounded-xl text-left transition-all duration-200 border-2
              hover:shadow-md flex items-start gap-4 group
              ${selectedStyleId === style.id 
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 ring-offset-2' 
                : 'border-slate-200 bg-white hover:border-indigo-300'}
            `}
          >
            <div className={`
              w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl
              ${style.previewColor} text-white shadow-sm
            `}>
              {style.icon}
            </div>
            
            <div>
              <div className="font-semibold text-slate-800 group-hover:text-indigo-700">
                {style.name}
              </div>
              <p className="text-sm text-slate-500 mt-1 leading-snug">
                {style.description}
              </p>
            </div>

            {selectedStyleId === style.id && (
              <div className="absolute top-4 right-4 text-indigo-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
