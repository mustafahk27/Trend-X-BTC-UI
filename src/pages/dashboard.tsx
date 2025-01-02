// Dashboard.tsx
//hehe changes

'use client'

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Activity, DollarSign, Wand2, Database, Home, MessageSquare, Users, LineChart } from "lucide-react";
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";
import { NavButton } from "@/components/ui/nav-button";
import { useEffect, useState, useCallback } from 'react';
import { BitcoinChart } from "@/components/ui/chart";
import { BinanceTicker } from "@/components/BinanceTicker";
import { OrderFlowTicker } from "@/components/OrderFlowTicker";
import { ActiveAddressesTicker } from "@/components/ActiveAddressesTicker";

interface BTCMetrics {
  Date: string;
  Open: number;
  High: number;
  Volume: number;
  'Number of trades': number;
  avg_block_size: number;
  value: number;
  net_order_flow: number;
  num_user_addresses: number;
}

interface APIResponse {
  metrics: BTCMetrics;
  lastUpdated: string;
  isStale: boolean;
}

// Define the type for a prediction point
type PredictionPoint = {
  x: string | number;
  y: string | number;
};

interface PredictionDataPoint {
  timestamp: string;
  price: number;
}

interface MetricsResponse {
  metrics: BTCMetrics;
  lastUpdated: string;
  isStale: boolean;
}

interface PredictionResponse {
  graphData: Array<{
    x: number;
    y: number;
  }>;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<BTCMetrics | null>(null);
  const [predictions, setPredictions] = useState<{
    x: number;
    y: number;
  }[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [activeAddressMetrics, setActiveAddressMetrics] = useState({
    trend: 65,
    isPositive: true
  });

  const fetchMetrics = useCallback(async (): Promise<MetricsResponse | null> => {
    try {
      const response = await fetch('/api/fetchMetrics');
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return null;
    }
  }, []);

  const fetchCurrentPrice = useCallback(async () => {
    try {
      const response = await fetch('/api/getCurrentPrice');
      if (!response.ok) {
        throw new Error('Failed to fetch current price');
      }
      const data = await response.json();
      if (data.price) {
        setCurrentPrice(parseFloat(data.price));
      } else {
        // Add fallback to Binance WebSocket price if API fails
        const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const binanceData = await binanceResponse.json();
        if (binanceData.price) {
          setCurrentPrice(parseFloat(binanceData.price));
        }
      }
    } catch (error) {
      console.error('Error fetching current price:', error);
      // Don't set currentPrice to null to maintain last known price
    }
  }, []);

  const formatPredictionData = (data: any[]) => {
    console.log('Raw prediction data:', data); // Debug log

    return data.map(point => {
      // Handle different possible data structures
      const timestamp = point.timestamp || point.x || point.date;
      const price = point.price || point.y || point.value;

      console.log('Processing point:', { timestamp, price }); // Debug log

      return {
        x: new Date(timestamp).getTime(),
        y: typeof price === 'string' ? parseFloat(price) : price
      };
    }).filter(point => {
      const isValid = !isNaN(point.x) && !isNaN(point.y);
      if (!isValid) {
        console.log('Filtered out invalid point:', point); // Debug log
      }
      return isValid;
    });
  };

  const fetchPredictions = async (): Promise<PredictionResponse | null> => {
    try {
      const response = await fetch('/api/fetchPredictions');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (!data.graphData) {
        console.error('No graphData in response');
        return null;
      }

      return {
        graphData: formatPredictionData(data.graphData)
      };
    } catch (error) {
      console.error('Error in fetchPredictions:', error);
      return null;
    }
  };

  // Fetch metrics on component mount and set up periodic fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        
        // Fetch all data in parallel
        const [metricsResponse, predictionsResponse, priceData] = await Promise.all([
          fetchMetrics(),
          fetchPredictions(),
          fetchCurrentPrice()
        ]);

        // Update states as soon as data is available
        if (metricsResponse?.metrics) {
          setMetrics(metricsResponse.metrics);
        }

        if (predictionsResponse?.graphData) {
          setPredictions(predictionsResponse.graphData);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false); // End loading regardless of outcome
      }
    };

    fetchData();
    const priceInterval = setInterval(fetchCurrentPrice, 30000);
    return () => clearInterval(priceInterval);
  }, [fetchCurrentPrice]);

  // Generate stats array from metrics
  const stats = [
    {
      title: "Current Price",
      value: currentPrice 
        ? `$${currentPrice.toLocaleString(undefined, { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          })}` 
        : <BinanceTicker showFullPrice={true} />,
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "BTC Last Day Volume",
      value: metrics ? `${metrics.Volume.toLocaleString()} ₿` : 'Loading...',
      change: "",
      isPositive: true,
      icon: Activity,
    },
    {
      title: "Number of Trades",
      value: metrics ? metrics['Number of trades'].toLocaleString() : 'Loading...',
      change: "",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: "Average Block Size",
      value: metrics ? `${metrics.avg_block_size.toFixed(2)} MB` : 'Loading...',
      change: "",
      isPositive: true,
      icon: Database,
    }
  ];

  // Render error state with retry option
  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button onClick={fetchMetrics} className="bg-[#F7931A] hover:bg-[#F7931A]/90 text-black">
          Retry
        </Button>
      </div>
    );
  }

  // Main dashboard render
  return (
    <div className="min-h-screen bg-black">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#F7931A_0%,transparent_35%)] opacity-15" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 1 }}
          className="text-[20vw] font-bold text-white whitespace-nowrap select-none"
        >
          TREND-X-BTC
        </motion.h1>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed top-2 sm:top-6 left-2 sm:left-6 z-20 flex flex-wrap gap-2 sm:gap-4">
        <NavButton 
          href="/prediction" 
          icon={LineChart} 
          label="Predict"
          className="flex items-center gap-2"
          showLabelOnMobile={true}
        />
        <NavButton 
          href="/chatbot" 
          icon={MessageSquare} 
          label="AI Chat"
          className="flex items-center gap-2"
          showLabelOnMobile={true}
        />
        <NavButton 
          href="/tech-team" 
          icon={Users} 
          label="Team"
          className="flex items-center gap-2"
          showLabelOnMobile={true}
        />
      </div>

      {/* User Button (Logout) */}
      <div className="fixed top-6 right-6 z-20">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-10 h-10 rounded-full border-2 border-white/10 hover:border-[#F7931A]/50 transition-all",
              userButtonPopover: "bg-black/90 border border-white/10 backdrop-blur-sm",
              userButtonPopoverCard: "bg-transparent",
              userButtonPopoverActions: "bg-transparent",
              userButtonPopoverActionButton: "hover:bg-white/10",
              userButtonPopoverActionButtonText: "text-white",
              userButtonPopoverFooter: "hidden"
            }
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative min-h-screen z-10 p-6 max-w-7xl mx-auto pt-24">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="bg-black/50 backdrop-blur-sm border border-white/10 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                    {stat.change && (
                      <div className={`flex items-center mt-2 ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span className="text-sm ml-1">{stat.change}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-[#F7931A]/10 rounded-lg">
                    <stat.icon className="w-6 h-6 text-[#F7931A]" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Bitcoin Price Prediction - Next 30 Days</h3>
              <div className="w-full" style={{ height: 300 }}>
                {loading ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Loading chart data...
                  </div>
                ) : (
                  <BitcoinChart data={predictions} />
                )}
              </div>
            </div>
          </div>

          {/* Predictions Panel */}
          <Card className="bg-black/50 backdrop-blur-sm border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Market Analysis</h3>
            <div className="space-y-4">
              {/* Fear & Greed Index */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Fear & Greed Index</span>
                  <span className={`font-medium ${(metrics?.value ?? 0) >= 50 ? 'text-[#4CD964]' : 'text-[#FF3B30]'}`}>
                    {metrics?.value ?? 0}
                  </span>
                </div>
                <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" 
                    style={{
                      width: `${metrics?.value ?? 0}%`,
                      background: 'linear-gradient(90deg, #FF3B30 0%, #FF9500 50%, #4CD964 100%)'
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">Extreme Fear</span>
                  <span className="text-xs text-gray-400">Extreme Greed</span>
                </div>
              </div>

              {/* Market Metrics */}
              {metrics && [
                { 
                  metric: "Net Order Flow", 
                  value: <OrderFlowTicker />,
                  trend: 65,
                  isPositive: true 
                },
                { 
                  metric: "Active Addresses", 
                  value: <ActiveAddressesTicker 
                    onDataUpdate={setActiveAddressMetrics}
                  />,
                  trend: activeAddressMetrics.trend,
                  isPositive: activeAddressMetrics.isPositive
                }
              ].map((metric) => (
                <div 
                  key={metric.metric}
                  className="p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">{metric.metric}</span>
                    <span className={`font-medium ${metric.isPositive ? 'text-[#4CD964]' : 'text-[#FF3B30]'}`}>
                      {metric.value}
                    </span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        metric.isPositive ? 'bg-[#4CD964]' : 'bg-[#FF3B30]'
                      }`}
                      style={{ width: `${metric.trend}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Generate AI Suggestions Button */}
              <Link href="/prediction">
                <Button 
                  className="w-full bg-[#F7931A] hover:bg-[#F7931A]/90 text-black font-medium mt-4 flex items-center justify-center"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate New AI Suggestions
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}