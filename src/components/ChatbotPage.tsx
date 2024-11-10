"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Send, Mic, ChevronRight, BarChart2, RefreshCw } from "lucide-react"
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
  // ... (rest of the provided code)
}
