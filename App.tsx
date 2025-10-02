
import React, { useState, useCallback } from 'react';
import StyleSelector from './components/StyleSelector';
import ResultDisplay from './components/ResultDisplay';
import ReplyInput from './components/ReplyInput';
import Loader from './components/Loader';
import { SparklesIcon } from './components/icons';
import { RephrasingStyle } from './types';
import { REPHRASING_STYLES } from './constants';
import { startChat, sendMessage } from './services/geminiService';
import type { Chat } from '@google/genai';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<RephrasingStyle>(REPHRASING_STYLES[0].style);
  const [rephrasedText, setRephrasedText] = useState<string>('');
  const [isRephrasing, setIsRephrasing] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);

  const handleRephrase = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to rephrase.');
      return;
    }
    
    setIsRephrasing(true);
    setError(null);
    setRephrasedText('');
    setChat(null);

    try {
      const chatSession = startChat();
      setChat(chatSession);
      const prompt = `
        Rephrase the following text in a ${selectedStyle} tone.
        Your response should ONLY be the rephrased text, without any additional introductory phrases, explanations, or labels like "Rephrased Text:".
        
        Original Text:
        ---
        ${inputText}
        ---
      `;
      const result = await sendMessage(chatSession, prompt);
      setRephrasedText(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsRephrasing(false);
    }
  }, [inputText, selectedStyle]);

  const handleReply = useCallback(async (replyMessage: string) => {
    if (!chat || !replyMessage.trim()) return;

    setIsReplying(true);
    setError(null);
    try {
      const result = await sendMessage(chat, replyMessage);
      setRephrasedText(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsReplying(false);
    }
  }, [chat]);

  const handleStyleChange = (style: RephrasingStyle) => {
    setSelectedStyle(style);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if(error){
      setError(null);
    }
  };

  const isLoading = isRephrasing || isReplying;

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center p-4 bg-slate-900 font-sans">
      <div className="w-full max-w-2xl mx-auto my-12 sm:my-0">
        <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
              AI Rephraser
            </h1>
          <p className="text-slate-400">Refine your writing with the power of AI</p>
        </header>

        <main className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
          <div className="space-y-6">
            <div>
              <label htmlFor="input-text" className="text-sm font-semibold text-slate-300 mb-2 block">
                YOUR TEXT
              </label>
              <textarea
                id="input-text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter the text you want to rephrase..."
                className="w-full h-36 p-3 bg-slate-900 border-2 border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none"
                disabled={isLoading}
              />
            </div>

            <StyleSelector 
              selectedStyle={selectedStyle}
              onStyleChange={handleStyleChange}
              disabled={isLoading}
            />
            
            <button
              onClick={handleRephrase}
              disabled={isLoading || !inputText.trim()}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center h-12"
            >
              {isRephrasing ? (
                <Loader />
              ) : (
                <span className="flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5" />
                  Rephrase
                </span>
              )}
            </button>
            
            <ResultDisplay 
              rephrasedText={rephrasedText}
              isLoading={isRephrasing}
              isReplying={isReplying}
              error={error}
            />

            {rephrasedText && !error && (
              <ReplyInput onReply={handleReply} isLoading={isReplying} />
            )}
          </div>
        </main>

        <footer className="text-center mt-8">
            <p className="text-slate-500 text-sm">Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
