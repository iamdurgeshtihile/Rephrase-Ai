
import React, { useState, useEffect } from 'react';
import { ClipboardIcon, CheckIcon } from './icons';
import Loader from './Loader';

interface ResultDisplayProps {
  rephrasedText: string;
  isLoading: boolean;
  isReplying: boolean;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ rephrasedText, isLoading, isReplying, error }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (rephrasedText) {
      navigator.clipboard.writeText(rephrasedText);
      setCopied(true);
    }
  };
  
  const hasContent = rephrasedText || error || isLoading;

  return (
    <div className={`relative mt-4 bg-slate-800/70 rounded-lg transition-all duration-300 min-h-[6rem] flex items-center ${hasContent ? 'p-4 border border-slate-700' : 'p-0 border-transparent'} ${isReplying ? 'opacity-50' : ''}`}>
      {isLoading && <div className="w-full flex justify-center"><Loader /></div>}
      
      {rephrasedText && !isLoading && !error && (
        <>
          <p className="text-slate-200 whitespace-pre-wrap pr-10">{rephrasedText}</p>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors duration-200"
            aria-label="Copy to clipboard"
          >
            {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
          </button>
        </>
      )}
      
      {error && !isLoading && (
        <p className="text-red-400 w-full text-center">{error}</p>
      )}
    </div>
  );
};

export default ResultDisplay;