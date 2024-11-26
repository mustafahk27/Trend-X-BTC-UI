"use client"

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, Send, ArrowLeft, Home, BarChart2, Check, Search } from "lucide-react";
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";
import { Sparkles } from "@react-three/drei";
import FloatingBitcoins from "@/components/FloatingBitcoins";
import { Wand2 } from "lucide-react";
import { tavily } from "@tavily/core";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { useUser } from "@clerk/nextjs";

type Message = {
  content: string;
  isUser: boolean;
  timestamp: Date;
};

type Citation = {
  url: string;
  title: string;
  snippet: string;
};

type EnhancedMessage = Message & {
  citations?: Citation[];
};

// Initialize Tavily client outside the component
const tvly = tavily({ 
  apiKey: process.env.NEXT_PUBLIC_TAVILY_API_KEY || '' 
});

function LoadingBitcoin() {
  return (
    <mesh>
      <cylinderGeometry args={[2, 2, 0.2, 32]} />
      <meshPhysicalMaterial
        color="#F7931A"
        metalness={0.9}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        emissive="#F7931A"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<EnhancedMessage[]>([
    {
      content: "Hello! I'm your AI assistant for Bitcoin predictions. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState('General Bitcoin Analysis');
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showCitations, setShowCitations] = useState<{[key: number]: boolean}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const citationRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const { user } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Check if API key is available
      if (!process.env.NEXT_PUBLIC_TAVILY_API_KEY) {
        throw new Error('Tavily API key is not configured');
      }

      // Perform Tavily search with error logging
      const searchResponse = await tvly.search(input, {
        searchDepth: "basic",
      });
      
      console.log('Search response:', searchResponse); // Add this for debugging

      // Create AI response using the search results
      const aiMessage = {
        content: searchResponse.results[0]?.content || "I couldn't find relevant information for your query.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Tavily API error:', error); // Add this for debugging
      const errorMessage = {
        content: `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleWebSearch = async () => {
    if (!input.trim()) return;
    setIsSearching(true);

    const userMessage = {
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      if (!process.env.NEXT_PUBLIC_TAVILY_API_KEY) {
        throw new Error('Tavily API key is not configured');
      }

      const searchResponse = await tvly.search(input, {
        searchDepth: "advanced",
        includeRawContent: true,
      });

      const citations = searchResponse.results.map(result => ({
        url: result.url,
        title: result.title,
        snippet: result.snippet,
      }));

      const aiMessage = {
        content: searchResponse.results
          .slice(0, 3)
          .map(r => r.content)
          .join('\n\n'),
        isUser: false,
        timestamp: new Date(),
        citations,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Web search error:', error);
      const errorMessage = {
        content: `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearContext = () => {
    setContext('General Bitcoin Analysis');
    setMessages([{
      content: "Context cleared. How can I help you with Bitcoin analysis?",
      isUser: false,
      timestamp: new Date(),
    }]);
  };

  const toggleWebSearch = () => {
    setWebSearchEnabled(prev => !prev);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000); // Hide tooltip after 2 seconds
  };

  const handleSubmit = () => {
    if (webSearchEnabled) {
      handleWebSearch();
    } else {
      handleSend();
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        toggleWebSearch();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleCitationClick = (index: number) => {
    setShowCitations(prev => {
      const newState = {
        ...prev,
        [index]: !prev[index]
      };
      
      // If showing citations, scroll to them after they render
      if (newState[index]) {
        setTimeout(() => {
          citationRefs.current[index]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 100);
      }
      
      return newState;
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Background Elements */}
      <FloatingBitcoins />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#F7931A_0%,transparent_35%)] opacity-15" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 1 }}
          className="text-[20vw] font-bold text-white whitespace-nowrap select-none"
        >
          TREND-X-BTC
        </motion.h1>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed top-6 left-6 z-20 flex gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" className="bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost" className="bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10">
            <BarChart2 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </Link>
      </div>

      {/* User Button (Logout) */}
      <div className="fixed top-6 right-6 z-20">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-10 h-10 rounded-full border-2 border-white/10 hover:border-[#F7931A]/50 transition-all",
              userButtonPopover: "bg-black/90 border border-white/10 backdrop-blur-sm",
              userButtonPopoverCard: "bg-transparent",
              userButtonPopoverActions: "bg-transparent",
              userButtonPopoverActionButton: "hover:bg-white/10",
              userButtonPopoverActionButtonText: "text-white",
              userButtonPopoverFooter: "hidden"
            }
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative min-h-screen z-10 p-6 max-w-4xl mx-auto pt-24">
        {/* Chat Container */}
        <Card className="bg-black/50 backdrop-blur-sm border border-white/10 h-[calc(100vh-8rem)]">
          {/* Context Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[#111111] text-gray-300 text-sm p-3 rounded-t-xl flex justify-between items-center border-b border-white/10"
          >
            <div className="flex items-center gap-4">
              <span>Context: {context}</span>
              <Link href="/prediction">
                <Button 
                  variant="ghost"
                  size="sm"
                  className="bg-[#F7931A]/10 hover:bg-[#F7931A]/20 text-[#F7931A]"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Prediction
                </Button>
              </Link>
            </div>
            <Button
              onClick={clearContext}
              variant="ghost"
              className="bg-[#F7931A]/10 hover:bg-[#F7931A]/20 text-[#F7931A] border border-[#F7931A]/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Chat
            </Button>
          </motion.div>

          {/* Messages Area with enhanced animations */}
          <ScrollArea className="h-[calc(100%-8rem)] p-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: message.isUser ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}
              >
                <div className={`flex flex-col ${message.isUser ? "items-end" : "items-start"} max-w-[80%]`}>
                  <div className={`flex items-start gap-3 ${message.isUser ? "flex-row-reverse" : ""}`}>
                    <Avatar className={message.isUser ? "bg-[#F7931A]/20" : "bg-white/10 overflow-hidden"}>
                      {message.isUser ? (
                        <>
                          <AvatarImage 
                            src={user?.imageUrl || "/user-avatar.png"} 
                            alt={user?.fullName || "User"}
                          />
                          <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage 
                            src="/ai-avatar.png" 
                            alt="AI Assistant" 
                            className="object-cover w-full h-full"
                          />
                          <AvatarFallback>
                            <img 
                              src="/ai-avatar.png" 
                              alt="AI" 
                              className="w-full h-full object-cover" 
                            />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-xl ${
                        message.isUser
                          ? "bg-[#F7931A] text-black"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {message.content}
                    </motion.div>
                  </div>
                  
                  {!message.isUser && message.citations && message.citations.length > 0 && (
                    <div className="mt-2 ml-12">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCitationClick(index)}
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
                          ref={el => citationRefs.current[index] = el}
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
                              <p className="text-sm text-gray-400 mt-1">
                                {citation.snippet}
                              </p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-gray-400"
              >
                <Avatar className="bg-white/10 w-8 h-8 overflow-hidden">
                  <AvatarImage 
                    src="/ai-avatar.png" 
                    alt="AI Assistant" 
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback>
                    <img 
                      src="/ai-avatar.png" 
                      alt="AI" 
                      className="w-full h-full object-cover" 
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>●</span>
                </div>
              </motion.div>
            )}
            {isSearching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-gray-400"
              >
                <Avatar className="bg-white/10 w-8 h-8 overflow-hidden">
                  <AvatarImage 
                    src="/ai-avatar.png" 
                    alt="AI Assistant" 
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback>
                    <img 
                      src="/ai-avatar.png" 
                      alt="AI" 
                      className="w-full h-full object-cover" 
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-xl bg-white/10">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Searching the web...
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Enhanced Input Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-6 left-0 right-0 px-4 z-50"
          >
            <div className="max-w-4xl mx-auto flex justify-center">
              <div 
                className={`search-container-wrapper ${input ? 'expanded' : ''}`}
                onFocus={(e) => e.currentTarget.classList.add('expanded')}
                onBlur={(e) => !input && e.currentTarget.classList.remove('expanded')}
              >
                <Button
                  onClick={toggleWebSearch}
                  className={`web-search-button ${webSearchEnabled ? 'active' : ''}`}
                  aria-label="Toggle web search"
                >
                  <Search className="h-4 w-4" />
                  <span className="button-text">Web</span>
                </Button>

                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Ask AI..."
                  className="search-input"
                  aria-label="Chat input"
                />

                <Button
                  onClick={handleSubmit}
                  className="send-button"
                  disabled={!input.trim()}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </Card>
      </main>

      {/* Active Search Mode Indicator */}
      {webSearchEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-6 z-50 text-sm text-[#F7931A]/80 flex items-center gap-2 bg-black/50 backdrop-blur-sm py-2 px-4 rounded-full border border-[#F7931A]/20"
        >
          <div className="w-2 h-2 bg-[#F7931A] rounded-full animate-pulse" />
          Web Search Mode Active
        </motion.div>
      )}
    </div>
  );
}