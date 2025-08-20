
import React from 'react';

interface FloatingActionButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-transform transform hover:scale-110"
            aria-label="Open AI Assistant"
        >
            {children}
        </button>
    );
};
