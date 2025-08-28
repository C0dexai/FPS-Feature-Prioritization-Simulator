import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Framework, type Feature, type ChatMessage } from './types';
import { INITIAL_FEATURES, FRAMEWORK_DESCRIPTIONS } from './constants';
import { Header } from './components/Header';
import { FrameworkTabs } from './components/FrameworkTabs';
import { MoSCoWView } from './components/frameworks/MoSCoWView';
import { RICEView } from './components/frameworks/RICEView';
import { KanoView } from './components/frameworks/KanoView';
import { generateFeatures, startChat } from './services/geminiService';
import { Card } from './components/ui/Card';
import { ChatPanel } from './components/ChatPanel';
import { FloatingActionButton } from './components/FloatingActionButton';
import { ChatIcon } from './components/icons/ChatIcon';
import type { Chat } from '@google/genai';
import { ApiKeyInstructions } from './components/ApiKeyInstructions';
import { SessionManager } from './components/SessionManager';

const STORAGE_KEY = 'feature-prioritization-session';

const App: React.FC = () => {
  const [activeFramework, setActiveFramework] = useState<Framework>(Framework.MoSCoW);
  const [features, setFeatures] = useState<Feature[]>(INITIAL_FEATURES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [productConcept, setProductConcept] = useState<string>('a project management tool');
  const [isApiKeyMissing, setIsApiKeyMissing] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // Chat state
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatSessionRef = useRef<Chat | null>(null);

  useEffect(() => {
    try {
      const savedSessionJSON = localStorage.getItem(STORAGE_KEY);
      if (savedSessionJSON) {
        const savedSession = JSON.parse(savedSessionJSON);
        if (savedSession.features && Array.isArray(savedSession.features) && savedSession.productConcept) {
          setFeatures(savedSession.features);
          setProductConcept(savedSession.productConcept);
          setLastSaved(savedSession.lastSaved || null);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error("Failed to load or parse saved session from localStorage", e);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const initializeChat = useCallback(() => {
    try {
      chatSessionRef.current = startChat(features);
      setChatMessages([]);
      if (isApiKeyMissing) {
        setIsApiKeyMissing(false);
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("API_KEY environment variable is not set")) {
        setIsApiKeyMissing(true);
      }
    }
  }, [features, isApiKeyMissing]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);


  const handleUpdateFeature = useCallback((updatedFeature: Feature) => {
    setFeatures(prevFeatures =>
      prevFeatures.map(f => (f.id === updatedFeature.id ? updatedFeature : f))
    );
  }, []);

  const handleGenerateFeatures = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newFeatures = await generateFeatures(productConcept);
      setFeatures(newFeatures);
      localStorage.removeItem(STORAGE_KEY);
      setLastSaved(null);
      if (isApiKeyMissing) setIsApiKeyMissing(false);
    } catch (err) {
      if (err instanceof Error && err.message.includes("API_KEY environment variable is not set")) {
        setIsApiKeyMissing(true);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSession = useCallback(() => {
    try {
        const now = new Date();
        const sessionData = {
            features,
            productConcept,
            lastSaved: now.toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
        setLastSaved(now.toISOString());
    } catch (e) {
        console.error("Failed to save session to localStorage", e);
        setError("Could not save your session. Your browser's storage might be full or blocked.");
    }
  }, [features, productConcept]);

  const handleClearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setFeatures(INITIAL_FEATURES);
    setProductConcept('a project management tool');
    setLastSaved(null);
  }, []);

  const handleToggleChat = () => {
    setIsChatOpen(prev => !prev);
  }

  const handleSendMessage = async (message: string) => {
    if (!chatSessionRef.current) {
        console.error("Chat not initialized");
        setChatMessages(prev => [...prev, {role: 'model', text: 'Sorry, the chat is not available right now. Please try again.'}]);
        return;
    }

    setIsChatLoading(true);
    setChatMessages(prev => [...prev, { role: 'user', text: message }]);
    
    try {
        const stream = await chatSessionRef.current.sendMessageStream({ message });
        
        let modelResponse = '';
        setChatMessages(prev => [...prev, { role: 'model', text: '' }]);

        for await (const chunk of stream) {
            modelResponse += chunk.text;
            setChatMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
                return newMessages;
            });
        }

    } catch(err) {
        console.error("Error sending chat message:", err);
        const errorText = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setChatMessages(prev => {
            const newMessages = [...prev];
            if (newMessages[newMessages.length - 1]?.role === 'model') {
                 newMessages[newMessages.length - 1].text = `Sorry, I ran into an error: ${errorText}`;
            } else {
                 newMessages.push({ role: 'model', text: `Sorry, I ran into an error: ${errorText}` });
            }
            return newMessages;
        });
    } finally {
        setIsChatLoading(false);
    }
  }


  const renderActiveFramework = () => {
    switch (activeFramework) {
      case Framework.MoSCoW:
        return <MoSCoWView features={features} onUpdateFeature={handleUpdateFeature} />;
      case Framework.RICE:
        return <RICEView features={features} onUpdateFeature={handleUpdateFeature} />;
      case Framework.Kano:
        return <KanoView features={features} onUpdateFeature={handleUpdateFeature} />;
      default:
        return null;
    }
  };
  
  const currentFrameworkInfo = FRAMEWORK_DESCRIPTIONS[activeFramework];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="mt-8">
          {isApiKeyMissing ? (
            <ApiKeyInstructions />
          ) : (
            <>
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white">Feature Generation</h2>
                  <p className="text-gray-400 mt-2">
                    Use AI to generate a new set of hypothetical features for a product concept.
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center">
                    <input
                      type="text"
                      value={productConcept}
                      onChange={(e) => setProductConcept(e.target.value)}
                      placeholder="e.g., an app for pet owners"
                      className="w-full sm:w-1/2 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleGenerateFeatures}
                      disabled={isLoading}
                      className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        'Generate New Feature Set'
                      )}
                    </button>
                  </div>
                  {error && <p className="text-red-400 mt-4">{error}</p>}
                  <SessionManager
                    onSave={handleSaveSession}
                    onClear={handleClearSession}
                    lastSaved={lastSaved}
                  />
                </div>
              </Card>

              <div className="mt-8">
                <FrameworkTabs activeFramework={activeFramework} onSelectFramework={setActiveFramework} />
                <div className="mt-4">
                   <Card>
                     <div className="p-6">
                        <h3 className="text-2xl font-bold text-white">{currentFrameworkInfo.title}</h3>
                        <p className="mt-2 text-gray-300">{currentFrameworkInfo.description}</p>
                     </div>
                   </Card>
                </div>
                <div className="mt-6">
                  {renderActiveFramework()}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      
      {!isApiKeyMissing && (
        <>
            <FloatingActionButton onClick={handleToggleChat}>
                <ChatIcon className="h-6 w-6" />
            </FloatingActionButton>
            
            <ChatPanel 
                isOpen={isChatOpen}
                onClose={handleToggleChat}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
            />
        </>
      )}
    </div>
  );
};

export default App;
