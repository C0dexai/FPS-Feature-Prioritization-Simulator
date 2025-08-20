
import React from 'react';

const SparklesIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M4 17v4M2 19h4M17 3v4M15 5h4M19 17v4M17 19h4M12 9v6M9 12h6" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="text-center">
        <div className="flex items-center justify-center gap-4">
            <SparklesIcon />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                Feature Prioritization Simulator
            </h1>
        </div>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
        An interactive workshop to master product management frameworks.
      </p>
    </header>
  );
};