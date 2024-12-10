"use client"

import React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, Send, ArrowLeft, Home, BarChart2, Check, Search, ChevronDown } from "lucide-react";
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
import { NavButton } from "@/components/ui/nav-button";
import ReactMarkdown from 'react-markdown';
import { ThreeElements } from '@react-three/fiber';
import { Components } from 'react-markdown';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize clients with browser safety flag
const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true
});

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Update type definitions for better type safety
type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const MODEL_MAP: { [key: string]: string } = {
  'mixtral-8x7b-32k': 'mixtral-8x7b-32768',
  'gemma-2-9b': 'gemma2-9b-it',
  'gemma-7b': 'gemma-7b-it',
  'gemini-pro': 'gemini-1.5-pro',
  'gemini-flash': 'gemini-1.5-flash',
  'llama-3-70b-versatile': 'llama-3.1-70b-versatile',
  'llama-3-8b-instant': 'llama-3.1-8b-instant',
  'llama-3-1b-preview': 'llama-3.2-1b-preview',
  'llama-3-3b-preview': 'llama-3.2-3b-preview',
  'llama-3-70b-tool': 'llama3-groq-70b-8192-tool-use-preview',
  'llama-3-8b-tool': 'llama3-groq-8b-8192-tool-use-preview',
  'chat-api': 'mixtral-8x7b-32768',
  'audio-api': 'whisper-large-v3'
};

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

// Initialize Tavily client outside the component
const tvly = tavily({ 
  apiKey: process.env.NEXT_PUBLIC_TAVILY_API_KEY || '' 
});

// Define Tavily types since they're not exported
type TavilySearchResult = {
  url: string;
  title: string;
  content: string;
};

function LoadingBitcoin() {
  return (
    <mesh>
      <cylinderGeometry args={[2, 2, 0.2, 32]} />
      <meshStandardMaterial
        color="#F7931A"
        metalness={0.9}
        roughness={0.1}
        emissive="#F7931A"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

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
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-20" ref={dropdownRef}>
      <div className="relative">
        <Button
          onClick={onToggle}
          className="bg-black/50 backdrop-blur-sm border border-white/10 hover:bg-white/5 text-white flex items-center gap-2 px-4 py-2 rounded-lg"
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
              className="absolute top-full mt-2 w-96 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg overflow-hidden max-h-[80vh] overflow-y-auto scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {modelCategories.map((category) => (
                <div 
                  key={category.title}
                  className="border-b border-white/10 last:border-b-0"
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
                        <div className="font-medium">{model.name}</div>
                        <div className="text-sm text-gray-400 mt-0.5">{model.description}</div>
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

// Add custom styles for markdown formatting
const markdownStyles = {
  heading: "text-xl font-bold mt-4 mb-2 text-[#F7931A]",
  subheading: "text-lg font-semibold mt-3 mb-2 text-[#F7931A]/80",
  paragraph: "mb-4 text-gray-200",
  list: "mb-4 ml-4 space-y-2",
  listItem: "text-gray-200",
};

// Update the message rendering in the ChatbotPage component
function ChatMessage({ message, user, index, isTyping }: { message: EnhancedMessage; user: any; index: number; isTyping: boolean }) {
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
      className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-2`}
    >
      <div className={`flex flex-col ${message.isUser ? "items-end" : "items-start"} max-w-[80%] last:mb-0`}>
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
                    code: ({ node, inline, className, children, ...props }: Components['code']) => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
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

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
          modelId: selectedModel.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from API');
      }

      const data = await response.json();

      const aiMessage: EnhancedMessage = {
        content: data.content,
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
        citations: searchData.citations.map((citation: any) => ({
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
        <NavButton href="/dashboard" icon={ArrowLeft} label="Back" />
        <NavButton href="/" icon={Home} label="Home" />
        <NavButton href="/dashboard" icon={BarChart2} label="Dashboard" />
      </div>

      {/* Model Selector */}
      <ModelSelector
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
        isOpen={isModelMenuOpen}
        onToggle={() => setIsModelMenuOpen(!isModelMenuOpen)}
      />

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
              <ChatMessage 
                key={index} 
                message={message} 
                user={user}
                index={index}
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