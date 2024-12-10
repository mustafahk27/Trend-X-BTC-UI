import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from "@google/generative-ai";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, modelId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    if (!modelId) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }

    const actualModelId = MODEL_MAP[modelId];

    if (modelId === 'gemini-pro' || modelId === 'gemini-flash') {
      const model = genAI.getGenerativeModel({ model: actualModelId });
      const chat = model.startChat();
      
      const systemMessage = messages.find(msg => msg.role === 'system');
      if (systemMessage) {
        await chat.sendMessage(systemMessage.content);
      }
      
      const userMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(userMessage.content);
      const response = await result.response.text();
      
      return NextResponse.json({
        content: response,
        role: 'assistant'
      });
    }

    const completion = await groq.chat.completions.create({
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      model: actualModelId,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json({
      content: completion.choices[0]?.message?.content || '',
      role: 'assistant'
    });

  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat request', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 