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

**Market Analysis**
• Current BTC Price: $[price from data]
• Market Sentiment: [Fear and Greed Index] ([classification])
• 24h Trend: [Up/Down] [percentage]%
• Volatility: [High/Medium/Low] based on 24h data

**Key Recommendations**
[List 3-5 coins with complete analysis]

For each coin:
• [Coin Name] ([SYMBOL])
  - Current Price: $[price]
  - 24h Change: [percentage]%
  - Key Catalyst: [specific reason for recommendation]
  - Risk Level: [High/Medium/Low]
  - Technical Outlook: [Brief analysis]

**Risk Assessment**
• Market Condition: [Based on Fear and Greed Index]
• Position Sizing: [Conservative/Moderate/Aggressive]
• Key Warning Signs: [List specific risks]

Citations will be handled separately by the UI - do not include source links in your analysis. Focus on providing accurate information and clear analysis.`;

const ADVISOR_PROMPT = `You are a knowledgeable crypto research advisor. Based on the current market data provided, offer your insights and recommendations.

Focus on:
1. Current market conditions and sentiment
2. Potential opportunities given the market state
3. Risk management suggestions
4. Specific coin recommendations with rationale

Keep your response professional, factual, and focused on the data provided.`;

export async function POST(request: Request) {
  try {
    const { query, webSearchEnabled } = await request.json();
    const searchApiKey = process.env.TAVILY_API_KEY;
    const headersList = headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    // Fetch current Bitcoin price and market data
    const btcResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true');
    if (!btcResponse.ok) {
      throw new Error('Failed to fetch Bitcoin data');
    }
    const btcData = await btcResponse.json();
    if (!btcData?.bitcoin?.usd) {
      throw new Error('Invalid Bitcoin data format');
    }

    // Fetch Fear and Greed Index
    const fgResponse = await fetch('https://api.alternative.me/fng/');
    if (!fgResponse.ok) {
      throw new Error('Failed to fetch Fear and Greed Index');
    }
    const fgData = await fgResponse.json();
    if (!fgData?.data?.[0]) {
      throw new Error('Invalid Fear and Greed Index data format');
    }

    // Try to fetch top coins data, but continue if it fails
    let topCoinsData = [];
    try {
      const topCoinsResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h&locale=en');
      if (topCoinsResponse.ok) {
        const data = await topCoinsResponse.json();
        if (Array.isArray(data)) {
          topCoinsData = data;
        }
      }
    } catch (error) {
      console.error('Failed to fetch top coins data:', error);
      // Continue without top coins data
    }

    // Prepare market context with detailed data
    const marketContext = `
REAL-TIME MARKET DATA (As of ${new Date().toISOString()}):

Bitcoin Status:
- Current Price: $${btcData.bitcoin.usd.toLocaleString()}
- 24h Volume: $${btcData.bitcoin.usd_24h_vol.toLocaleString()}
- 24h Change: ${btcData.bitcoin.usd_24h_change.toFixed(2)}%
- Market Cap: $${btcData.bitcoin.usd_market_cap.toLocaleString()}
- Fear and Greed Index: ${fgData.data[0].value} (${fgData.data[0].value_classification})

${topCoinsData.length > 0 ? `Top Performing Altcoins (Last 24h):
${topCoinsData
  .filter(coin => coin.symbol !== 'btc')
  .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
  .slice(0, 5)
  .map(coin => `- ${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price} (${(coin.price_change_percentage_24h || 0).toFixed(2)}%)`)
  .join('\n')}` : ''}
`;

    // If web search is not enabled, just use the LLM with market data
    if (!webSearchEnabled) {
      const llmResponse = await fetch(`${protocol}://${host}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: ADVISOR_PROMPT
            },
            {
              role: 'user',
              content: `Here is the current market data:\n\n${marketContext}\n\nBased on this data, ${query}`
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
        analysis: llmData.content,
        marketData: {
          bitcoin: btcData.bitcoin,
          fearAndGreed: fgData.data[0],
          topAltcoins: topCoinsData.slice(0, 10)
        },
        status: 'success'
      });
    }

    // Web search mode - existing functionality
    if (!searchApiKey) {
      throw new Error('Tavily API key is not configured');
    }

    console.log('[Search] Starting web search with query:', query);

    // Simpler search query without overcomplicating it
    const searchQuery = `${query} cryptocurrency latest news price analysis`;

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
        max_results: 10,
        include_answer: true,
        include_raw_content: true
      }),
    });

    if (!response.ok) {
      console.error('[Search] Tavily API error:', response.status, response.statusText);
      throw new Error('Failed to fetch search results');
    }

    const searchData = await response.json();
    console.log('[Search] Got', searchData.results?.length || 0, 'results');

    // No filtering - just use the results directly
    const results = searchData.results || [];
    
    // Format search results for citations
    const citations: Citation[] = results.map((result: any, index: number) => ({
      id: index + 1,
      url: result.url,
      title: result.title,
      snippet: result.content
    }));

    console.log('[Search] Formatted', citations.length, 'citations');

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
      results: results,
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