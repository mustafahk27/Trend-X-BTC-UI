import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GROQ_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GROQ_API_KEY is not defined in environment variables');
}

if (!geminiKey) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const groq = new Groq({
  apiKey,
});

const genAI = new GoogleGenerativeAI(geminiKey);

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
    console.log('Using model:', actualModelId);

    if (modelId === 'gemini-pro' || modelId === 'gemini-flash') {
      const model = genAI.getGenerativeModel({ model: actualModelId });
      const chat = model.startChat();
      
      for (const message of messages) {
        if (message.role === 'user') {
          await chat.sendMessage(message.content);
        }
      }
      
      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response.text();
      
      return NextResponse.json({
        content: response,
        role: 'assistant'
      });
    }

    const completion = await groq.chat.completions.create({
      messages: messages.map(msg => ({
        role: msg.role || (msg.isUser ? 'user' : 'assistant'),
        content: msg.content
      })),
      model: actualModelId,
      temperature: 0.7,
      max_tokens: 1024,
    });

    if (!completion.choices?.[0]?.message) {
      throw new Error('No response from API');
    }

    return NextResponse.json({
      content: completion.choices[0].message.content,
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