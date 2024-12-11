import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Chatbot = () => {
  const citationRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [messages] = React.useState([]);
  const [showCitations, setShowCitations] = React.useState({});

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
          {!message.isUser && message.citations && message.citations.length > 0 && (
            <div className="mt-2 ml-12">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCitations(prev => ({
                  ...prev,
                  [index]: !prev[index]
                }))}
                className="text-[#F7931A] hover:text-[#F7931A]/80"
              >
                {showCitations[index] ? 'Hide Citations' : 'Show Citations'}
              </Button>
              
              {showCitations[index] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-2"
                >
                  {message.citations.map((citation, citIndex) => (
                    <div
                      key={citIndex}
                      className="p-2 rounded bg-white/5 border border-white/10"
                    >
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F7931A] hover:underline text-sm font-medium"
                      >
                        {citation.title}
                      </a>
                      <p className="text-sm text-gray-400 mt-1">{citation.snippet}</p>
                    </div>
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
