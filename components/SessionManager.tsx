import React, { useState } from 'react';
import { SaveIcon } from './icons/SaveIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SessionManagerProps {
    onSave: () => void;
    onClear: () => void;
    lastSaved: string | null;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ onSave, onClear, lastSaved }) => {
    const [justSaved, setJustSaved] = useState(false);

    const handleSaveClick = () => {
        onSave();
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
    };

    const handleClearClick = () => {
        if (window.confirm("Are you sure you want to clear your session? This will reset all features to their defaults and cannot be undone.")) {
            onClear();
        }
    };

    const formatTime = (isoString: string | null): string => {
        if (!isoString) return 'Not saved yet.';
        try {
            return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return 'Invalid date';
        }
    }

    return (
        <div className="mt-6 border-t border-gray-700 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="text-sm text-gray-400">
                <span>Last saved: </span>
                <span className="font-medium text-gray-300">{formatTime(lastSaved)}</span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={handleSaveClick}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-3 rounded-md transition-colors duration-200 text-sm"
                >
                    <SaveIcon className="h-4 w-4" />
                    {justSaved ? 'Saved!' : 'Save Session'}
                </button>
                {lastSaved && (
                     <button
                        onClick={handleClearClick}
                        className="flex items-center gap-2 bg-red-800/50 hover:bg-red-700/50 text-red-300 font-semibold py-2 px-3 rounded-md transition-colors duration-200 text-sm"
                        aria-label="Clear Session"
                    >
                        <TrashIcon className="h-4 w-4" />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
};
