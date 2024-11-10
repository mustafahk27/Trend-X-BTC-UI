"use client"

import React, { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion, useAnimation } from "framer-motion"
import { Send, Mic, ChevronRight, BarChart2, RefreshCw, Bitcoin, Zap, TrendingUp, DollarSign } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const sendMessage = async (message: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return `This is a response to: "${message}"`
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{ content: string; isUser: boolean }[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [context, setContext] = useState("General")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const floatingIconsControl = useAnimation()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    floatingIconsControl.start({
      y: [0, -10, 0],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    })
  }, [messages, floatingIconsControl])

  const handleSend = async () => {
    if (inputValue.trim() === "") return
    setMessages((prev) => [...prev, { content: inputValue, isUser: true }])
    setInputValue("")
    setIsLoading(true)
    const response = await sendMessage(inputValue)
    setMessages((prev) => [...prev, { content: response, isUser: false }])
    setIsLoading(false)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
    handleSend()
  }

  const clearContext = () => {
    setMessages([])
    setContext("General")
  }

  const generateFloatingIcons = () => {
    const icons = [Bitcoin, Zap, TrendingUp, DollarSign]
    return icons.map((Icon, index) => (
      <motion.div
        key={index}
        animate={floatingIconsControl}
        style={{
          position: 'absolute',
          top: `${Math.random() * 80 + 10}%`,
          left: `${Math.random() * 80 + 10}%`,
          opacity: 0.1,
        }}
      >
        <Icon size={32} />
      </motion.div>
    ))
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="relative flex flex-col flex-grow p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] to-[#E114E5] opacity-10 blur-3xl" />
          {generateFloatingIcons()}
        </motion.div>
        <header className="flex justify-between items-center mb-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#E114E5]"
          >
            TradingAI Chat
          </motion.h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="bg-white text-black hover:bg-gray-200 transition-transform transform hover:scale-105">
                <BarChart2 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#111111] border-l border-gray-800">
              <SheetHeader>
                <SheetTitle className="text-white">Dashboard Integration</SheetTitle>
                <SheetDescription className="text-gray-400">View relevant charts and data here.</SheetDescription>
              </SheetHeader>
              <div className="mt-4 p-4 bg-black rounded-lg">
                <p className="text-gray-300">Dashboard components will be integrated here.</p>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <div className="flex-grow flex flex-col relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[#111111] text-gray-300 text-sm p-2 rounded-md mb-4 flex justify-between items-center"
          >
            <span>Context: {context}</span>
            <Button variant="ghost" size="sm" onClick={clearContext} className="text-white hover:text-gray-200 transition-transform transform hover:scale-105">
              <RefreshCw className="h-4 w-4 mr-2" />Clear Context
            </Button>
          </motion.div>
          <ScrollArea className="flex-grow pr-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.isUser ? "flex-row-reverse" : ""}`}>
                    <Avatar>
                      <AvatarImage src={message.isUser ? "/user-avatar.png" : "/ai-avatar.png"} />
                      <AvatarFallback>{message.isUser ? "U" : "AI"}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`p-3 rounded-lg ${
                        message.isUser
                          ? "bg-gradient-to-r from-[#4F46E5] to-[#E114E5] text-white"
                          : "bg-[#111111] text-gray-300"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </ScrollArea>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4 flex flex-wrap gap-2"
        >
          {["Predict BTC price", "Explain RSI", "Recent market news"].map((question) => (
            <Button
              key={question}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedQuestion(question)}
              className="bg-white text-black hover:bg-gray-200 transition-transform transform hover:scale-105"
            >
              {question}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-4 flex items-center gap-2"
        >
          <Input
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="bg-[#111111] text-white border-gray-700 focus:border-[#4F46E5]"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-white text-black hover:bg-gray-200 transition-transform transform hover:scale-105"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="bg-[#111111] text-white border-gray-700 hover:bg-[#222222] transition-transform transform hover:scale-105"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 bg-white text-black hover:bg-gray-200 transition-transform transform hover:scale-110"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-[#111111] border-l border-gray-800">
          <SheetHeader>
            <SheetTitle className="text-white">How to use TradingAI Chat</SheetTitle>
            <SheetDescription className="text-gray-400">
              Here are some tips to get the most out of your conversation with TradingAI.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4 text-gray-300">
            <h3 className="font-semibold">Example Questions:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>What's the current trend for Bitcoin?</li>
              <li>Explain the concept of market capitalization.</li>
              <li>How does the fear and greed index work?</li>
              <li>What are the top-performing cryptocurrencies this week?</li>
            </ul>
          </div>
        </SheetContent>
      </Sheet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-4 left-4 text-[#4F46E5]"
      >
        <Bitcoin className="h-8 w-8 animate-pulse" />
      </motion.div>
    </div>
  )
}