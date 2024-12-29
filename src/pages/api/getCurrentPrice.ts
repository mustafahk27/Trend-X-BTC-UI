import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Fetching current BTC price from Binance');
    
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.price) {
      throw new Error('No price data in Binance response');
    }

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    res.status(200).json({
      price: data.price,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching current price:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch current price',
      timestamp: new Date().toISOString()
    });
  }
} 