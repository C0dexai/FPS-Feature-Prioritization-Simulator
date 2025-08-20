import React from 'react';
import { Card } from './ui/Card';
import { InformationCircleIcon } from './icons/InformationCircleIcon';

export const ApiKeyInstructions: React.FC = () => {
  return (
    <Card className="mt-8 border-yellow-500/50 bg-yellow-900/20">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <InformationCircleIcon className="h-8 w-8 text-yellow-400 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-yellow-300">AI Features Disabled: API Key Required</h2>
            <p className="text-yellow-200/80 mt-1">
              To enable AI-powered feature generation and the chat assistant, a Google Gemini API key is necessary.
            </p>
          </div>
        </div>

        <div className="prose prose-sm prose-invert max-w-none mt-4 text-gray-300">
            <p>For security reasons, your API key must be configured as an environment variable, not entered into the browser.</p>
            <p><strong>To fix this:</strong></p>
            <ol>
                <li>Obtain an API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google AI Studio</a>.</li>
                <li>Set the <code>API_KEY</code> environment variable in your terminal before running the application.</li>
            </ol>
            <p>Example of how to run the app with the key:</p>
            <pre className="bg-gray-900/50 p-3 rounded-md overflow-x-auto">
                <code className="font-mono text-sm">
                    API_KEY="your_api_key_here" npm run start
                </code>
            </pre>
            <p>After setting the key, please refresh this page.</p>
        </div>
      </div>
    </Card>
  );
};
