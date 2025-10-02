
import React from 'react';
import { RephrasingStyle } from '../types';
import { REPHRASING_STYLES } from '../constants';

interface StyleSelectorProps {
  selectedStyle: RephrasingStyle;
  onStyleChange: (style: RephrasingStyle) => void;
  disabled: boolean;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange, disabled }) => {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-300 mb-3">CHOOSE A TONE</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {REPHRASING_STYLES.map(({ style, label, emoji }) => (
          <button
            key={style}
            onClick={() => onStyleChange(style)}
            disabled={disabled}
            className={`
              p-3 border-2 rounded-lg text-sm font-medium transition-all duration-200
              flex items-center justify-center space-x-2
              ${selectedStyle === style
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
