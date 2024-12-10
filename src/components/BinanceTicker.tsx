import { useState, useEffect } from 'react';

export function BinanceTicker() {
  const [tickerData, setTickerData] = useState<{
    priceChange: string;
    priceChangePercent: string;
  } | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTickerData({
        priceChange: parseFloat(data.p).toFixed(2),
        priceChangePercent: data.P,
      });
    };

    // Cleanup on unmount
    return () => ws.close();
  }, []);

  if (!tickerData) return null;

  const isPositive = parseFloat(tickerData.priceChange) >= 0;

  return (
    <div className="flex items-center text-sm">
      <span className={`${isPositive ? 'text-[#4CD964]' : 'text-[#FF3B30]'} font-medium`}>
        ${tickerData.priceChange} ({tickerData.priceChangePercent}%)
      </span>
    </div>
  );
} 