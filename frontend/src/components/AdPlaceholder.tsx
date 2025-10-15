import React from 'react';

interface AdPlaceholderProps {
  description: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ description }) => {
  return (
    <div className="w-full max-w-4xl h-24 bg-gray-200/50 rounded-lg flex items-center justify-center text-gray-500 border border-gray-300/50 shadow-inner my-4">
      <div className="text-center">
        <p className="font-semibold">Ad Placeholder</p>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};
