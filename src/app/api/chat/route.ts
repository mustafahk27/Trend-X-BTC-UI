import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
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
    const modelId = body.modelId;
    const isGemini = modelId.startsWith('gemini-');

    if (isGemini) {
      // Handle Gemini models
      const model = genAI.getGenerativeModel({ model: MODEL_MAP[modelId] });
      
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "You are a helpful AI assistant. Please format your responses with: - Bold headings using markdown - Clear paragraph separation - Strategic use of bullet points and lists - Professional formatting throughout" }],
          },
          {
            role: "model",
            parts: [{ text: "I understand. I will format my responses using markdown with bold headings, clear paragraphs, and strategic use of bullet points and lists while maintaining professional formatting." }],
          },
        ],
      });

      const result = await chat.sendMessage(body.message);
      const response = await result.response;
      
      return NextResponse.json({
        choices: [
          {
            message: {
              content: response.text(),
            },
          },
        ],
      });
    } else {
      // Handle non-Gemini models with Groq
      const actualModelId = MODEL_MAP[modelId];
      
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant. Please format your responses with:
            - Bold headings using markdown
            - Clear paragraph separation
            - Strategic use of bullet points and lists
            - Professional formatting throughout`
          },
          {
            role: 'user',
            content: body.message
          }
        ],
        model: actualModelId,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return NextResponse.json(completion);
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' }, 
      { status: 500 }
    );
  }
} 