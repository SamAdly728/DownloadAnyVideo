import React, { useState } from 'react';

interface VideoInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export const VideoInput: React.FC<VideoInputProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(url);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste Video URL Here..."
        className="w-full h-14 px-5 text-lg text-dark-blue bg-white/50 rounded-xl border-2 border-transparent focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/50 shadow-md transition-all duration-300 placeholder-dark-blue/60"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto h-14 px-8 text-lg font-bold text-white bg-gradient-to-r from-pink to-turquoise rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-turquoise/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  );
};
