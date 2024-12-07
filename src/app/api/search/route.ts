import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const searchApiKey = process.env.TAVILY_API_KEY;

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': searchApiKey!,
      },
      body: JSON.stringify({
        query,
        search_depth: 'advanced',
        include_domains: ['bitcoin.org', 'github.com', 'stackoverflow.com', 'developer.mozilla.org'],
      }),
    });

    const data = await response.json();
    return NextResponse.json(data.results);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 