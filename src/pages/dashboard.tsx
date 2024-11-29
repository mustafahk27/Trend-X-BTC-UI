'use client'

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Activity, DollarSign, Clock, Home, MessageSquare, Wand2, Database, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";
import { NavButton } from "@/components/ui/nav-button";

// Sample data - replace with real data
const data = [
  { time: '00:00', price: 41000 },
  { time: '04:00', price: 42500 },
  { time: '08:00', price: 42000 },
  { time: '12:00', price: 43500 },
  { time: '16:00', price: 44000 },
  { time: '20:00', price: 43800 },
  { time: '24:00', price: 44200 },
];

const stats = [
  {
    title: "Current Price",
    value: "$44,231.54",
    change: "+2.5%",
    isPositive: true,
    icon: DollarSign,
  },
  {
    title: "24h Volume",
    value: "$28.5B",
    change: "-1.2%",
    isPositive: false,
    icon: Activity,
  },
  {
    title: "Number of Trades",
    value: "847,392",
    change: "+5.3%",
    isPositive: true,
    icon: TrendingUp,
  },
  {
    title: "Average Block Size",
    value: "1.37 MB",
    change: "+0.2 MB",
    isPositive: true,
    icon: Database,
  },
];

export default function Dashboard() {
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
      <div className="fixed top-6 left-6 z-20 flex gap-4">
        <NavButton href="/" icon={Home} label="Home" />
        <NavButton href="/chatbot" icon={MessageSquare} label="AI Chat" />
        <NavButton href="/prediction" icon={Wand2} label="Predict Latest" />
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
                    <div className={`flex items-center mt-2 ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      <span className="text-sm ml-1">{stat.change}</span>
                    </div>
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
          <Card className="lg:col-span-2 bg-black/50 backdrop-blur-sm border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Bitcoin Price Chart</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis 
                    dataKey="time" 
                    stroke="#666" 
                    strokeWidth={0.5}
                  />
                  <YAxis 
                    stroke="#666" 
                    strokeWidth={0.5}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#F7931A" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Predictions Panel */}
          <Card className="bg-black/50 backdrop-blur-sm border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Market Analysis</h3>
            <div className="space-y-4">
              {/* Fear & Greed Index */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Fear & Greed Index</span>
                  <span className="text-[#4CD964] font-medium">83</span>
                </div>
                <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" 
                    style={{
                      width: '83%',
                      background: 'linear-gradient(90deg, #FF3B30 0%, #FF9500 50%, #4CD964 100%)'
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">Extreme Fear</span>
                  <span className="text-xs text-gray-400">Extreme Greed</span>
                </div>
                <div className="text-right mt-1">
                  <span className="text-xs text-[#4CD964]">Extreme Greed</span>
                </div>
              </div>

              {/* Market Metrics */}
              {[
                { 
                  metric: "Net Order Flow", 
                  value: "+$247.8M", 
                  trend: 92,
                  isPositive: true 
                },
                { 
                  metric: "Active Addresses", 
                  value: "1.24M", 
                  trend: 87,
                  isPositive: true 
                }
              ].map((metric, index) => (
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
                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-400">
                      {metric.trend}% of daily average
                    </span>
                  </div>
                </div>
              ))}
              
              <Link href="/prediction">
                <Button 
                  className="w-full bg-[#F7931A] hover:bg-[#F7931A]/90 text-black font-medium mt-4"
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
