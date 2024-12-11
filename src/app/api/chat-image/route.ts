import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Define error interface
interface APIError extends Error {
  message: string;
  type?: string;
  code?: string;
}

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.error('GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq({
  apiKey: apiKey || '',
  dangerouslyAllowBrowser: true
});

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { 
        role: 'assistant', 
        content: 'API key is not configured. Please add GROQ_API_KEY to your environment variables.' 
      },
      { status: 401 }
    );
  }

  try {
    const { messages } = await request.json();
    const latestMessage = messages[messages.length - 1];
    
    if (!latestMessage?.content || !Array.isArray(latestMessage.content)) {
      throw new Error('Invalid message format');
    }

    const imageContent = latestMessage.content.find(
      (item: { type: string }) => item.type === 'image_url'
    );
    const textContent = latestMessage.content.find(
      (item: { type: string }) => item.type === 'text'
    );

    if (!imageContent?.image_url?.url) {
      throw new Error('No image provided');
    }

    const base64Image = imageContent.image_url.url.replace(
      /^data:image\/\w+;base64,/, ''
    );

    // Create a properly typed message for Groq API
    const systemMessage = {
      role: 'system' as const,
      content: 'You are a helpful AI assistant that can analyze images and provide detailed insights.'
    };

    const userMessage = {
      role: 'user' as const,
      content: [
        { 
          type: 'text', 
          text: textContent?.text || 'Analyze this image and provide insights...' 
        },
        { 
          type: 'image_url', 
          image_url: { 
            url: `data:image/jpeg;base64,${base64Image}` 
          } 
        }
      ]
    };

    const completion = await groq.chat.completions.create({
      messages: [systemMessage, userMessage],
      model: "llama-3.2-11b-vision-preview",
      temperature: 0.5,
      max_tokens: 8192,
      top_p: 1,
      stream: false,
    });

    if (!completion.choices[0]?.message) {
      throw new Error('No response from API');
    }

    return NextResponse.json(completion.choices[0].message);
  } catch (error: unknown) {
    console.error('Error in chat-image API:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Sorry, there was an error processing your image. Please try again.';
    let statusCode = 500;

    // Type guard to check if error is our APIError type
    if (error instanceof Error && (error as APIError).message?.includes('Invalid API Key')) {
      errorMessage = 'Invalid API key. Please check your GROQ_API_KEY configuration.';
      statusCode = 401;
    }

    return NextResponse.json(
      { 
        role: 'assistant', 
        content: errorMessage 
      },
      { status: statusCode }
    );
  }
} 