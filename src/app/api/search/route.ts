import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Define types for better type safety
type Citation = {
  id: number;
  url: string;
  title: string;
  snippet: string;
};

const SYSTEM_PROMPT = `You are a crypto market researcher providing technical data analysis for academic research purposes.

IMPORTANT: First analyze the real-time market data provided, then combine it with the search results to give accurate, up-to-date information.

When asked about alt coin recommendations:
1. First acknowledge the current market conditions using the real-time data provided
2. Then analyze the search results for emerging opportunities
3. Consider the Fear and Greed Index for overall market sentiment
4. Provide detailed analysis of each recommended coin

Format your response EXACTLY as follows:

Market Overview:
• Bitcoin Current Price: $[exact number from real-time data]
• 24h Change: [number]% [trend arrow ↑/↓]
• Market Sentiment: [Fear and Greed Index] ([classification])
• Current Trend: [Brief description based on real-time data]

Recommended Alternative Coins:
[Only include coins with verified recent data and clear upward potential]

• [Coin Name] ([Symbol])
  - Current Price: $[exact number]
  - 24h Volume: $[exact number]
  - 24h Change: [number]% [trend arrow ↑/↓]
  - Market Cap: $[exact number]
  - Risk Level: [High/Medium/Low]
  - Recent Development: [specific event/news] [citation]
  - Investment Thesis: [2-3 bullet points about why it's recommended]
  - Key Metrics:
    * Trading Volume Trend: [increasing/decreasing]
    * Development Activity: [active/moderate/low]
    * Market Sentiment: [positive/neutral/negative]

[List 3-5 coins with complete metrics, ordered by confidence level]

Risk Warning:
• Market Condition: [Based on Fear and Greed Index]
• Volatility Level: [Based on current market data]
• Recommended Position Size: [Based on risk level]

[All price and volume data must match real-time data where available, with search results providing supporting information]`;

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const searchApiKey = process.env.TAVILY_API_KEY;
    const headersList = headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    if (!searchApiKey) {
      throw new Error('Tavily API key is not configured');
    }

    // Get current date for time-based filtering
    const now = new Date();
    const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const dateFilter = yesterday.toISOString().split('T')[0];

    // Fetch current Bitcoin price and market data
    const btcResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true');
    const btcData = await btcResponse.json();

    // Fetch Fear and Greed Index
    const fgResponse = await fetch('https://api.alternative.me/fng/');
    const fgData = await fgResponse.json();

    // Fetch top 100 coins data for better alt coin analysis
    const topCoinsResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h&locale=en');
    const topCoinsData = await topCoinsResponse.json();

    // Prepare market context with detailed data
    const marketContext = `
REAL-TIME MARKET DATA (As of ${new Date().toISOString()}):

Bitcoin Status:
- Current Price: $${btcData.bitcoin.usd.toLocaleString()}
- 24h Volume: $${btcData.bitcoin.usd_24h_vol.toLocaleString()}
- 24h Change: ${btcData.bitcoin.usd_24h_change.toFixed(2)}%
- Market Cap: $${btcData.bitcoin.usd_market_cap.toLocaleString()}
- Fear and Greed Index: ${fgData.data[0].value} (${fgData.data[0].value_classification})

Top Performing Altcoins (Last 24h):
${topCoinsData
  .filter(coin => coin.symbol !== 'btc')
  .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
  .slice(0, 5)
  .map(coin => `- ${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price} (${coin.price_change_percentage_24h.toFixed(2)}%)`)
  .join('\n')}
`;

    // Enhanced search query based on user's question
    const searchQuery = query.toLowerCase().includes('alt') || query.toLowerCase().includes('alternative')
      ? `${query} altcoin alternative cryptocurrency price analysis market cap volume changes "last 24 hours" -bitcoin -btc`
      : `${query} cryptocurrency price volume market cap changes "last 24 hours" "current price" after:${dateFilter}`;

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${searchApiKey}`,
      },
      body: JSON.stringify({
        query: searchQuery,
        search_depth: 'advanced',
        include_domains: [
          'coinmarketcap.com',
          'coingecko.com',
          'binance.com',
          'coindesk.com',
          'cointelegraph.com',
          'cryptoslate.com',
          'decrypt.co',
          'theblock.co',
          'bitcoinist.com',
          'cryptonews.com'
        ],
        max_results: 15,
        include_answer: true,
        include_images: false,
        include_raw_content: true,
        search_quality: 'high',
        sort_by: 'relevance'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API responded with status ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const searchData = await response.json();

    // Filter out results that don't have recent timestamps or price data
    const filteredResults = searchData.results.filter((result: any) => {
      const content = result.content.toLowerCase();
      const isRecent = content.includes('hours ago') || content.includes('today') || content.includes('just') || content.includes('breaking');
      const hasData = content.includes('price') || content.includes('volume') || content.includes('market cap');
      return isRecent && hasData;
    });

    // Format search results for citations
    const citations: Citation[] = filteredResults.map((result: any, index: number) => ({
      id: index + 1,
      url: result.url,
      title: result.title,
      snippet: result.content
    }));

    // Format search context with citation numbers
    const searchContext = citations
      .map((citation: Citation) => `[${citation.id}] ${citation.url}\n${citation.snippet}\n`)
      .join('\n');

    // Get LLM response using absolute URL
    const llmResponse = await fetch(`${protocol}://${host}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `IMPORTANT: First analyze this real-time market data:\n\n${marketContext}\n\nThen incorporate these recent news and analyses:\n\n${searchContext}\n\nBased on ALL this information, provide your response following the exact format specified.`
          }
        ],
        modelId: 'mixtral-8x7b-32k'
      })
    });

    if (!llmResponse.ok) {
      throw new Error('Failed to get LLM response');
    }

    const llmData = await llmResponse.json();

    return NextResponse.json({
      results: filteredResults,
      citations,
      analysis: llmData.content,
      marketData: {
        bitcoin: btcData.bitcoin,
        fearAndGreed: fgData.data[0],
        topAltcoins: topCoinsData.slice(0, 10)
      },
      status: 'success'
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to perform search', 
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 