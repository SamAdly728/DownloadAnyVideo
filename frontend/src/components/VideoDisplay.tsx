import React from 'react';
import type { VideoData } from '../types';

interface VideoDisplayProps {
  videoData: VideoData;
}

export const VideoDisplay: React.FC<VideoDisplayProps> = ({ videoData }) => {
  
  const handleDownload = () => {
    if (videoData.downloadUrl && videoData.downloadUrl !== '#') {
      window.open(videoData.downloadUrl, '_blank');
    } else {
      alert('Simulating download... A real download link would be provided by the backend server.');
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-md p-6 border border-white/40 text-left animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex-shrink-0">
          <img
            src={videoData.thumbnailUrl}
            alt="Video Thumbnail"
            className="w-full rounded-lg shadow-lg aspect-video object-cover"
          />
        </div>
        <div className="md:w-2/3 flex flex-col justify-between">
          <div>
            <span className="inline-block bg-dark-blue text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
              Platform: {videoData.platform}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-dark-blue line-clamp-2">
              {videoData.title}
            </h2>
            <p className="text-sm text-dark-blue/80 mt-2 line-clamp-3">
              {videoData.description}
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="w-full mt-4 h-14 px-8 text-lg font-bold text-white bg-gradient-to-r from-light-green to-turquoise rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-light-green/50"
          >
            Download MP4
          </button>
        </div>
      </div>
    </div>
  );
};

// Add a simple fade-in animation for when the component appears
if (typeof window !== 'undefined' && !document.getElementById('video-display-animation')) {
  const style = document.createElement('style');
  style.id = 'video-display-animation';
  style.innerHTML = `
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
}
