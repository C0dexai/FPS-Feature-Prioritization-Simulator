
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { Card } from './ui/Card';
import { CloseIcon } from './icons/CloseIcon';
import { SendIcon } from './icons/SendIcon';
import { marked } from 'marked';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const WelcomeMessage: React.FC<{ onPromptClick: (prompt: string) => void }> = ({ onPromptClick }) => {
    const prompts = [
        "Which feature is most critical?",
        "Help me write RICE scores for 'AI-Powered Suggestions'.",
        "Which features are 'delighters' in the Kano model?",
    ];
    return (
        <div className="p-4 text-sm text-gray-300">
            <p className="font-bold text-white mb-2">Welcome to your AI Product Coach!</p>
            <p className="mb-4">I can help you analyze and prioritize the features on your list. Try asking something like:</p>
            <div className="flex flex-col items-start gap-2">
                {prompts.map(prompt => (
                    <button 
                        key={prompt} 
                        onClick={() => onPromptClick(prompt)}
                        className="bg-gray-700/50 hover:bg-gray-600/50 text-left text-indigo-300 py-1.5 px-3 rounded-lg text-xs transition-colors"
                    >
                       {`"${prompt}"`}
                    </button>
                ))}
            </div>
        </div>
    );
}


export const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose, messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const handlePromptClick = (prompt: string) => {
      onSendMessage(prompt);
      setInput('');
  }

  const parseMarkdown = (text: string) => {
      const dirty = marked.parse(text, { breaks: true, gfm: true });
      return { __html: dirty as string };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-24 sm:right-6 w-[calc(100%-3rem)] max-w-md h-[70vh] max-h-[600px] z-50">
      <Card className="flex flex-col h-full w-full bg-gray-800/80 backdrop-blur-md shadow-2xl">
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-lg font-bold text-white">AI Assistant</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && <WelcomeMessage onPromptClick={handlePromptClick} />}
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 shadow-md ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                 {msg.role === 'model' ? (
                     <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={parseMarkdown(msg.text)} />
                 ) : (
                     <p>{msg.text}</p>
                 )}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length-1]?.role === 'user' && (
             <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-200 rounded-lg px-4 py-2 shadow-md">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold p-2.5 rounded-md transition-colors duration-200"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};
