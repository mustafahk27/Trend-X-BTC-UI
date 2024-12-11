"use client"

import React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, Send, ArrowLeft, BarChart2, Search, ChevronDown, Users } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { UserButton, useUser, UserResource } from "@clerk/nextjs";
import { Wand2 } from "lucide-react";
import { NavButton } from "@/components/ui/nav-button";
import ReactMarkdown from 'react-markdown';
import Groq from 'groq-sdk';

// Initialize clients with browser safety flag
const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true
});

// Note: These APIs are prepared for future use in advanced features
/* const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const tvly = tavily({ 
  apiKey: process.env.NEXT_PUBLIC_TAVILY_API_KEY || '' 
}); */

type UserType = UserResource | null;

type Message = {
  content: string;
  isUser: boolean;
  timestamp: Date;
};

// Update type definitions for better type safety
type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type Citation = {
  url: string;
  title: string;
  snippet: string;
};

type EnhancedMessage = Message & {
  citations?: Citation[];
};

type LLMModel = {
  id: string;
  name: string;
  description: string;
};

type ModelCategory = {
  title: string;
  models: LLMModel[];
};

const modelCategories: ModelCategory[] = [
  {
    title: "Google LLMs",
    models: [
      { id: 'gemini-pro', name: 'Gemini 1.5 Pro', description: 'Advanced Google AI model with strong reasoning' },
      { id: 'gemini-flash', name: 'Gemini 1.5 Flash', description: 'Fast and efficient Google AI model' },
      { id: 'gemma-2-9b', name: 'Gemma 2 9B', description: 'Efficient mid-sized language model' },
      { id: 'gemma-7b', name: 'Gemma 7B', description: 'Lightweight yet capable language model' },
    ]
  },
  {
    title: "Mistral LLMs",
    models: [
      { id: 'mixtral-8x7b-32k', name: 'Mixtral 8x7B-32K', description: 'Large context window model with strong general capabilities' },
    ]
  },
  {
    title: "Meta LLMs",
    models: [
      { id: 'llama-3-70b-versatile', name: 'Llama 3.1 70B Versatile', description: 'Large-scale model for diverse tasks' },
      { id: 'llama-3-8b-instant', name: 'Llama 3.1 8B Instant', description: 'Fast, efficient model for quick responses' },
      { id: 'llama-3-1b-preview', name: 'Llama 3.2 1B Preview', description: 'Compact preview model' },
      { id: 'llama-3-3b-preview', name: 'Llama 3.2 3B Preview', description: 'Enhanced preview model' },
      { id: 'llama-3-70b-tool', name: 'Llama 3 Groq 70B Tool', description: 'Tool-optimized large model' },
      { id: 'llama-3-8b-tool', name: 'Llama 3 Groq 8B Tool', description: 'Efficient tool-optimized model' },
    ]
  }
];

// Note: This type is used for API response handling
/* type TavilySearchResult = {
  url: string;
  title: string;
  content: string;
}; */

const ModelSelector = ({ 
  selectedModel, 
  onModelSelect, 
  isOpen, 
  onToggle 
}: {
  selectedModel: LLMModel;
  onModelSelect: (model: LLMModel) => void;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="fixed top-2 sm:top-6 inset-x-0 mx-auto z-50 w-full max-w-[calc(90vw-80px)] sm:max-w-[400px] px-4 sm:px-0" ref={dropdownRef}>
      <div className="relative">
        <Button
          onClick={onToggle}
          className="bg-black/50 backdrop-blur-sm border border-white/10 hover:bg-white/5 text-white flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base w-full"
        >
          <span className="text-[#F7931A]">{selectedModel.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 w-full bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg overflow-hidden max-h-[60vh] sm:max-h-[80vh] overflow-y-auto scrollbar-hide z-50"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {modelCategories.map((category) => (
                <div 
                  key={category.title}
                  className="border-b border-white/10 last:border-b-0 w-full"
                >
                  <div className="px-4 py-2 bg-white/5 sticky top-0 backdrop-blur-sm">
                    <h3 className="text-sm font-semibold text-[#F7931A] uppercase tracking-wider">
                      {category.title}
                    </h3>
                  </div>

                  <div className="divide-y divide-white/5">
                    {category.models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          onModelSelect(model);
                          onToggle();
                        }}
                        className={`w-full px-4 py-3 text-left transition-colors
                          ${selectedModel.id === model.id 
                            ? 'bg-[#F7931A]/10 text-[#F7931A]' 
                            : 'text-white hover:bg-white/5'
                          }`}
                      >
                        <div className="font-medium text-sm sm:text-base">{model.name}</div>
                        <div className="text-xs sm:text-sm text-gray-400 mt-0.5">{model.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ChatMessage = ({ message, user, isTyping }: { 
  message: EnhancedMessage; 
  user: UserType | null; 
  isTyping: boolean 
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const citationRef = useRef<HTMLDivElement>(null);
  const [showCitation, setShowCitation] = useState(false);

  useEffect(() => {
    if (!message.isUser) {
      setDisplayedContent('');
      
      const text = typeof message.content === 'string' ? message.content : '';
      if (!text) return;
      let currentIndex = 0;

      const getRandomDelay = () => {
        const baseDelay = 5;
        const variationRange = 3;
        return baseDelay + Math.random() * variationRange;
      };
      
      const typeNextCharacter = () => {
        setDisplayedContent(text.slice(0, currentIndex + 1));
        currentIndex++;
        
        if (currentIndex < text.length) {
          setTimeout(typeNextCharacter, getRandomDelay());
        }
      };

      typeNextCharacter();

      return () => {
        setDisplayedContent('');
      };
    } else {
      setDisplayedContent(message.content);
    }
  }, [message.content, message.isUser]);

  const handleCitationClick = useCallback(() => {
    setShowCitation(!showCitation);
    if (!showCitation) {
      setTimeout(() => {
        citationRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [showCitation]);

  return (
    <motion.div
      initial={{ opacity: 0, x: message.isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
      className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-3 sm:mb-2 px-2 sm:px-0`}
    >
      <div className={`flex flex-col ${message.isUser ? "items-end" : "items-start"} max-w-[92vw] sm:max-w-[80%] last:mb-0`}>
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
                  <Image 
                    src="/ai-avatar.png" 
                    alt="AI" 
                    className="w-full h-full object-cover"
                    width={40}
                    height={40}
                  />
                </AvatarFallback>
              </>
            )}
          </Avatar>
          
          {message.isUser ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-[#F7931A] text-black"
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </motion.div>
          ) : (
            <div className="text-white relative">
              <motion.div
                animate={isTyping ? {
                  x: [0, 0.3, -0.3, 0],
                  transition: { 
                    duration: 0.1, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }
                } : {}}
              >
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mt-4 mb-2 text-[#F7931A]">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold mt-3 mb-2 text-[#F7931A]/80">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold mt-2 mb-1 text-[#F7931A]/60">{children}</h3>
                    ),
                    p: ({ children }) => {
                      if (!children) return null;
                      return <p className="mb-4 text-gray-200">{children}</p>;
                    },
                    ul: ({ children }) => (
                      <ul className="mb-4 ml-4 space-y-2">{children}</ul>
                    ),
                    li: ({ children }) => {
                      if (!children) return null;
                      return (
                        <li className="flex items-start">
                          <span className="mr-2 text-[#F7931A]">•</span>
                          <span className="text-gray-200">{children}</span>
                        </li>
                      );
                    },
                    strong: ({ children }) => (
                      <strong className="font-bold text-[#F7931A]">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-gray-300">{children}</em>
                    ),
                    code: ({ inline, children, ...props }: { 
                      inline?: boolean; 
                      children?: React.ReactNode;
                    } & React.HTMLAttributes<HTMLElement>) => {
                      return inline ? (
                        <code className="bg-black/30 rounded px-1 py-0.5 font-mono text-sm" {...props}>{children}</code>
                      ) : (
                        <pre className="bg-black/30 rounded p-3 font-mono text-sm overflow-x-auto my-2" {...props}>{children}</pre>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[#F7931A]/50 pl-4 italic my-4 text-gray-300">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {displayedContent}
                </ReactMarkdown>
              </motion.div>
              {isTyping && (
                <span 
                  className="inline-block ml-1 animate-cursor-blink"
                  style={{
                    borderRight: '2px solid #F7931A',
                    height: '1.2em',
                    verticalAlign: 'text-bottom'
                  }}
                />
              )}
            </div>
          )}
        </div>
        
        {!message.isUser && message.citations && !isTyping && (
          <div className="mt-2 ml-12">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCitationClick}
              className="text-[#F7931A] hover:text-[#F7931A]/80"
            >
              {showCitation ? 'Hide Citations' : 'Show Citations'}
            </Button>
            {showCitation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-2"
                ref={citationRef}
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
    </motion.div>
  );
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<EnhancedMessage[]>([
    {
      content: "Hello! I'm your AI assistant for Bitcoin predictions. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const { user } = useUser();
  const [selectedModel, setSelectedModel] = useState<LLMModel>(modelCategories[0].models[0]);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: EnhancedMessage = {
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      if (webSearchEnabled) {
        await handleWebSearch();
        return;
      }

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant. Please format your responses with:
            - Bold headings using markdown (e.g., **Heading**)
            - Clear paragraph separation with blank lines
            - Strategic use of bullet points and numbered lists
            - Proper hierarchy with headings and subheadings
            - Professional formatting throughout
            - Code blocks when sharing code
            - Tables when presenting structured data`
          },
          {
            role: 'user',
            content: input
          }
        ],
        model: selectedModel.id,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const aiMessage: EnhancedMessage = {
        content: completion.choices[0]?.message?.content || 'No response generated.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage: EnhancedMessage = {
        content: `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}. Please try again.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleWebSearch = async () => {
    setIsSearching(true);
    try {
      // Get search results and analysis
      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: input,
          webSearchEnabled: true
        })
      });

      if (!searchResponse.ok) {
        throw new Error('Failed to get search results');
      }

      const searchData = await searchResponse.json();
      
      if (!searchData.results || searchData.results.length === 0) {
        throw new Error('No search results found');
      }

      const aiMessage: EnhancedMessage = {
        content: searchData.analysis,
        isUser: false,
        timestamp: new Date(),
        citations: searchData.citations.map((citation: {
          url: string;
          title: string;
          snippet: string;
        }) => ({
          url: citation.url,
          title: citation.title,
          snippet: citation.snippet
        }))
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Web search error:', error);
      const errorMessage: EnhancedMessage = {
        content: `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}. Please try rephrasing your question.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearContext = () => {
    setMessages([{
      content: "Context cleared. How can I help you with Bitcoin analysis?",
      isUser: false,
      timestamp: new Date(),
    }]);
  };

  const toggleWebSearch = () => {
    setWebSearchEnabled(prev => !prev);
  };

  const handleSubmit = () => {
    handleSend();
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

  return (
    <div className="min-h-screen bg-black">
      {/* Background Elements */}
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

      {/* Navigation */}
      <div className="fixed top-2 sm:top-6 left-2 sm:left-6 z-20 flex items-center gap-2 sm:gap-4">
        <NavButton 
          href="/dashboard" 
          icon={ArrowLeft} 
          label="Back" 
          className="!px-3 sm:!px-6 !py-2 sm:!py-5" 
        />
        <NavButton 
          href="/dashboard" 
          icon={BarChart2} 
          label="Dashboard" 
          className="hidden sm:flex" 
        />
        <NavButton 
          href="/tech-team" 
          icon={Users} 
          label="Tech & Team" 
          className="hidden sm:flex" 
        />
      </div>

      {/* Model Selector */}
      <ModelSelector
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
        isOpen={isModelMenuOpen}
        onToggle={() => setIsModelMenuOpen(!isModelMenuOpen)}
      />

      {/* User Button */}
      <div className="fixed top-2 sm:top-6 right-2 sm:right-6 z-20">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/10 hover:border-[#F7931A]/50 transition-all",
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
            className="bg-[#111111] text-gray-300 text-xs sm:text-sm p-2 sm:p-3 rounded-t-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/prediction">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="bg-[#F7931A]/10 hover:bg-[#F7931A]/20 text-[#F7931A] text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                  >
                    <Wand2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Generate Prediction
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={clearContext}
                  variant="ghost"
                  className="bg-[#F7931A]/10 hover:bg-[#F7931A]/20 text-[#F7931A] border border-[#F7931A]/20"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Chat
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Messages Area with enhanced animations */}
          <ScrollArea className="h-[calc(100%-8rem)] p-4 relative z-10">
            {messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                message={message} 
                user={user}
                isTyping={isTyping}
              />
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
                    <Image 
                      src="/ai-avatar.png" 
                      alt="AI" 
                      className="w-full h-full object-cover"
                      width={40}
                      height={40}
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
                    <Image 
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
          <motion.div className="fixed bottom-2 sm:bottom-6 left-0 right-0 px-2 sm:px-4 z-20">
            <div className="max-w-4xl mx-auto flex justify-center">
              <div className={`search-container-wrapper mx-auto ${input ? 'expanded' : ''}`}>
                <Button
                  onClick={toggleWebSearch}
                  className={`web-search-button hidden sm:flex ${webSearchEnabled ? 'active' : ''}`}
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
                  className={`search-input text-base sm:text-sm px-3 sm:px-4 ${input ? 'expanded' : ''}`}
                  onFocus={(e) => {
                    e.currentTarget.parentElement?.classList.add('expanded');
                  }}
                  onBlur={(e) => {
                    if (!input) {
                      e.currentTarget.parentElement?.classList.remove('expanded');
                    }
                  }}
                  aria-label="Chat input"
                />

                <Button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className="send-button min-w-[40px] sm:min-w-[48px]"
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
          className="fixed top-16 sm:top-20 right-4 sm:right-6 z-50 text-xs sm:text-sm text-[#F7931A]/80 flex items-center gap-2 bg-black/50 backdrop-blur-sm py-1.5 px-3 rounded-full border border-[#F7931A]/20 whitespace-nowrap shadow-lg"
        >
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#F7931A] rounded-full animate-pulse" />
          <span>Web Search Mode</span>
        </motion.div>
      )}
    </div>
  );
}