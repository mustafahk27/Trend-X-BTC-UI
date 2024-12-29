import { useState, useEffect } from 'react';

interface BinanceTickerProps {
  showFullPrice?: boolean;
}

export const BinanceTicker: React.FC<BinanceTickerProps> = ({ showFullPrice = false }) => {
  const [tickerData, setTickerData] = useState<{
    price: string;
    priceChange: string;
    priceChangePercent: string;
  } | null>(null);

  useEffect(() => {
    // Initial price fetch
    fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
      .then(response => response.json())
      .then(data => {
        if (data.price) {
          setTickerData(prev => ({
            ...prev,
            price: data.price,
            priceChange: '0',
            priceChangePercent: '0'
          }));
        }
      });

    // WebSocket connection for real-time updates
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTickerData({
        price: data.c, // Current price
        priceChange: data.p, // Price change
        priceChangePercent: data.P, // Price change percent
      });
    };

    return () => ws.close();
  }, []);

  if (!tickerData) return <div>Loading...</div>;

  const isPositive = parseFloat(tickerData.priceChange) >= 0;

  return (
    <div className="flex items-center">
      {showFullPrice && (
        <span className="text-2xl font-bold text-white mr-2">
          ${parseFloat(tickerData.price).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </span>
      )}
      <span className={`${isPositive ? 'text-[#4CD964]' : 'text-[#FF3B30]'} text-sm font-medium`}>
        ${Math.abs(parseFloat(tickerData.priceChange)).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })} 
        ({isPositive ? '+' : '-'}{Math.abs(parseFloat(tickerData.priceChangePercent))}%)
      </span>
    </div>
  );
}; 