import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Define the type for your state
type CitationState = {
  [key: number]: boolean;
};

// Define the type for a message
type Message = {
  isUser: boolean;
  citations?: { url: string; title: string; snippet: string }[];
};

const Chatbot = () => {
  const citationRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [messages] = React.useState<Message[]>([]);
  const [showCitations, setShowCitations] = React.useState<CitationState>({});

  // Helper function to get domain from URL
  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch {
      return url;
    }
  };

  // Helper function to get favicon
  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).origin;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const handleCitationClick = (index: number) => {
    setShowCitations(prev => {
      const newState = {
        ...prev,
        [index]: !prev[index]
      };
      
      if (newState[index]) {
        setTimeout(() => {
          citationRefs.current[index]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }, 100);
      }
      
      return newState;
    });
  };

  return (
    <div className="p-4">
      {messages.map((message, index) => (
        <div key={index} className="mb-4">
          {/* Your existing message rendering code */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-2 ml-12">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCitationClick(index)}
                className="text-[#F7931A] hover:text-[#F7931A]/80"
              >
                {showCitations[index] ? 'Hide Sources' : 'Show Sources'}
              </Button>
              
              {showCitations[index] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 flex flex-wrap gap-2"
                >
                  {message.citations?.map((citation, citIndex) => (
                    <a
                      key={citIndex}
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                               bg-white/5 border border-white/10 hover:bg-white/10 
                               transition-colors text-sm text-[#F7931A]"
                    >
                      {getFavicon(citation.url) && (
                        <img 
                          src={getFavicon(citation.url)!}
                          alt=""
                          className="w-4 h-4 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      {getDomainFromUrl(citation.url)}
                    </a>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Chatbot;
