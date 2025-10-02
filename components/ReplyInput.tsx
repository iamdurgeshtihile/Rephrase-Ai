
import React, { useState } from 'react';
import Loader from './Loader';
import { SendIcon } from './icons';

interface ReplyInputProps {
  onReply: (message: string) => void;
  isLoading: boolean;
}

const ReplyInput: React.FC<ReplyInputProps> = ({ onReply, isLoading }) => {
  const [replyText, setReplyText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isLoading) return;
    onReply(replyText);
    setReplyText('');
  };

  return (
    <div className="mt-2 animate-fade-in">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Refine your result (e.g., 'make it shorter')"
          disabled={isLoading}
          className="w-full p-3 pr-24 bg-slate-700/50 border-2 border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
          aria-label="Refine result"
        />
        <button
          type="submit"
          disabled={isLoading || !replyText.trim()}
          className="absolute inset-y-1.5 right-1.5 flex items-center justify-center px-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200 w-20"
          aria-label="Send refinement"
        >
          {isLoading ? <Loader /> : <SendIcon className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};

export default ReplyInput;
