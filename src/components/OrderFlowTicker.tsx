import React, { useState, useEffect } from 'react';

interface OrderFlowState {
  netFlow: number;
  isPositive: boolean;
  trendPercentage: number;
}

const initialState: OrderFlowState = {
  netFlow: 0,
  isPositive: true,
  trendPercentage: 25
};

export function OrderFlowTicker() {
  const [orderFlow, setOrderFlow] = useState<OrderFlowState>(initialState);

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth@100ms');
    let buyVolume = 0;
    let sellVolume = 0;
    const maxFlow = 1000000;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Calculate volumes
      data.b?.forEach((bid: string[]) => {
        buyVolume += parseFloat(bid[0]) * parseFloat(bid[1]);
      });

      data.a?.forEach((ask: string[]) => {
        sellVolume += parseFloat(ask[0]) * parseFloat(ask[1]);
      });

      const netFlow = buyVolume - sellVolume;
      const absoluteFlow = Math.abs(netFlow);
      
      // Calculate trend percentage (0-100)
      const trendPercentage = Math.min(
        Math.max((absoluteFlow / maxFlow) * 100, 25),
        95
      );

      setOrderFlow({
        netFlow: absoluteFlow,
        isPositive: netFlow > 0,
        trendPercentage
      });

      // Reset volumes
      buyVolume = 0;
      sellVolume = 0;
    };

    return () => ws.close();
  }, []);

  return (
    <div className="flex items-center text-sm">
      <span className={`${orderFlow.isPositive ? 'text-[#4CD964]' : 'text-[#FF3B30]'} font-medium`}>
        ${orderFlow.netFlow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        {orderFlow.isPositive ? ' Buy' : ' Sell'} Flow
      </span>
    </div>
  );
} 