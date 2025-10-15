
import React, { useState } from 'react';
import { VideoInput } from './components/VideoInput';
import { VideoDisplay } from './components/VideoDisplay';
import { AdPlaceholder } from './components/AdPlaceholder';
import { analyzeVideoUrl } from './services/geminiService';
import type { VideoData } from './types';

const App: React.FC = () => {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAnalyze = async (url: string) => {
    if (!url) {
      setError('Please enter a video URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setVideoData(null);

    try {
      const data = await analyzeVideoUrl(url);
      if (data.isValid && data.platform !== 'Unknown') {
        setVideoData(data);
      } else {
        setError('Could not identify the video platform from the URL. Please check the URL and try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while analyzing the URL. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full font-poppins bg-gradient-to-br from-turquoise via-light-blue to-pink flex flex-col items-center justify-between p-4 sm:p-6 md:p-8">
      <AdPlaceholder description="Top Banner Ad (e.g., 728x90)" />
      
      <main className="w-full flex flex-col items-center justify-center flex-grow">
        <div className="w-full max-w-2xl bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-6 sm:p-8 text-center border border-white/30">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark-blue mb-2">
            UniVideo Downloader 🌐
          </h1>
          <p className="text-dark-blue/80 mb-8">
            Paste a video link from YouTube, TikTok, Instagram, and more.
          </p>

          <VideoInput onAnalyze={handleAnalyze} isLoading={isLoading} />

          {isLoading && (
            <div className="mt-8 flex items-center justify-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-pink animate-bounce"></div>
              <div className="w-4 h-4 rounded-full bg-pink animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-4 h-4 rounded-full bg-pink animate-bounce [animation-delay:-.5s]"></div>
              <span className="text-dark-blue">Analyzing...</span>
            </div>
          )}

          {error && (
            <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {videoData && (
            <div className="mt-8">
              <VideoDisplay videoData={videoData} />
            </div>
          )}
        </div>
      </main>

      <AdPlaceholder description="Bottom Banner Ad (e.g., 728x90)" />
    </div>
  );
};

export default App;
