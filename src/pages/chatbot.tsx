"use client"

import { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, Send, ArrowLeft, Home, BarChart2 } from "lucide-react";
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";
import { Sparkles } from "@react-three/drei";
import FloatingBitcoins from "@/components/FloatingBitcoins";
import { Wand2 } from "lucide-react";

type Message = {
  content: string;
  isUser: boolean;
  timestamp: Date;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your AI assistant for Bitcoin predictions. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState('General Bitcoin Analysis');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage = {
        content: "Based on current market trends and technical analysis, Bitcoin shows strong support at the current level. However, always remember that cryptocurrency markets are highly volatile.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const clearContext = () => {
    setContext('General Bitcoin Analysis');
    setMessages([{
      content: "Context cleared. How can I help you with Bitcoin analysis?",
      isUser: false,
      timestamp: new Date(),
    }]);
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
              variant="ghost" 
              size="sm" 
              onClick={clearContext} 
              className="text-white hover:text-gray-200 transition-transform transform hover:scale-105"
            >
              <RefreshCw className="h-4 w-4 mr-2" />Clear Context
            </Button>
          </motion.div>

          {/* Messages Area with enhanced animations */}
          <ScrollArea className="h-[calc(100%-8rem)] p-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: message.isUser ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.5,
                  type: "spring",
                  bounce: 0.3
                }}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}
              >
                <div className={`flex items-start gap-3 max-w-[80%] ${message.isUser ? "flex-row-reverse" : ""}`}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <Avatar className={message.isUser ? "bg-[#F7931A]/20" : "bg-white/10"}>
                      <AvatarImage src={message.isUser ? "/user-avatar.png" : "/ai-avatar.png"} />
                      <AvatarFallback>{message.isUser ? "U" : "AI"}</AvatarFallback>
                    </Avatar>
                  </motion.div>
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
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-gray-400"
              >
                <Avatar className="bg-white/10 w-8 h-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>●</span>
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
            className="p-4 border-t border-white/10 bg-black/30"
          >
            <motion.div 
              className="flex gap-2"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Bitcoin predictions..."
                className="bg-white/10 border-white/10 text-white placeholder:text-gray-500"
              />
              <Button
                onClick={handleSend}
                className="bg-[#F7931A] hover:bg-[#F7931A]/90 text-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </Card>
      </main>
    </div>
  );
}