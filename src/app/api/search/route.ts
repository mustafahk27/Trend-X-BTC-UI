import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Define types for better type safety
type Citation = {
  id: number;
  url: string;
  title: string;
  snippet: string;
};

// Add the interface for search result
interface SearchResult {
  url: string;
  title: string;
  content: string;
}

export async function POST(request: Request) {
  try {
    const { query, webSearchEnabled } = await request.json();
    const searchApiKey = process.env.TAVILY_API_KEY;
    const headersList = headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    // Validate API key
    if (!searchApiKey) {
      console.error('[Search] Missing Tavily API key');
      return NextResponse.json({
        error: 'Configuration error',
        message: 'Search API key is not configured'
      }, { status: 500 });
    }

    console.log('[Search] Starting web search with query:', query);

    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${searchApiKey}`,
        },
        body: JSON.stringify({
          query: query,
          search_depth: 'advanced',
          max_results: 10,
          include_answer: false,
          include_raw_content: false
        }),
      });

      const responseText = await response.text();
      let searchData;
      
      try {
        searchData = JSON.parse(responseText);
      } catch (e) {
        console.error('[Search] Failed to parse Tavily response:', responseText);
        throw new Error('Invalid response from search API');
      }

      if (!response.ok) {
        console.error('[Search] Tavily API error:', {
          status: response.status,
          statusText: response.statusText,
          data: searchData
        });
        return NextResponse.json({
          error: 'Search API error',
          message: searchData.message || `Failed with status ${response.status}`,
        }, { status: response.status });
      }

      const results = searchData.results || [];
      const citations = results.map((result: SearchResult, index: number) => ({
        id: index + 1,
        url: result.url,
        title: result.title,
        snippet: result.content
      }));

      return NextResponse.json({
        results,
        citations,
        status: 'success'
      });

    } catch (searchError) {
      console.error('[Search] Error during Tavily API call:', searchError);
      throw searchError;
    }

  } catch (error) {
    console.error('[Search] Critical error:', error);
    return NextResponse.json({
      error: 'Search operation failed',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    }, { status: 500 });
  }
} 