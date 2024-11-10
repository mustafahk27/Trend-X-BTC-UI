'use client'

import { useState, useEffect } from "react"
import { ArrowUpIcon, ArrowDownIcon, RefreshCwIcon, MessageCircle } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useSpring, animated, config } from "react-spring"
import { useInView } from "react-intersection-observer"
import Link from "next/link"

const historicalData = [
  { date: "2023-01-01", price: 16500 },
  { date: "2023-02-01", price: 23000 },
  { date: "2023-03-01", price: 28000 },
  { date: "2023-04-01", price: 30000 },
  { date: "2023-05-01", price: 27000 },
  { date: "2023-06-01", price: 31000 },
]

const accuracyData = [
  { date: "2023-01-01", accuracy: 95 },
  { date: "2023-02-01", accuracy: 92 },
  { date: "2023-03-01", accuracy: 97 },
  { date: "2023-04-01", accuracy: 94 },
  { date: "2023-05-01", accuracy: 96 },
  { date: "2023-06-01", accuracy: 98 },
]

const AnimatedNumber = ({ n }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: config.molasses,
  })
  return <animated.span>{number.to((n) => n.toFixed(0))}</animated.span>
}

const AnimatedCard = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const animProps = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0px)" : "translateY(50px)",
    config: config.wobbly,
  })

  return (
    <animated.div ref={ref} style={animProps}>
      {children}
    </animated.div>
  )
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState(null)

  const handlePredict = () => {
    setIsLoading(true)
    setTimeout(() => {
      setPrediction({
        price: 32500,
        trend: "up",
        confidence: [31800, 33200],
      })
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black bg-opacity-70 border-b border-gray-800">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Bitcoin Prediction Dashboard
          </h1>
          <Link href="/chatbot">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Go to Chatbot
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnimatedCard>
            <Card className="bg-gray-900 border border-gray-800 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Current Price</CardTitle>
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  $<AnimatedNumber n={30123} />
                </div>
                <p className="text-xs text-gray-400">+2.5% from yesterday</p>
              </CardContent>
            </Card>
          </AnimatedCard>
          <AnimatedCard>
            <Card className="bg-gray-900 border border-gray-800 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">24h Volume</CardTitle>
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  $<AnimatedNumber n={42.8} />B
                </div>
                <p className="text-xs text-gray-400">+5.1% from yesterday</p>
              </CardContent>
            </Card>
          </AnimatedCard>
          <AnimatedCard>
            <Card className="bg-gray-900 border border-gray-800 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Market Cap</CardTitle>
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  $<AnimatedNumber n={586.3} />B
                </div>
                <p className="text-xs text-gray-400">-0.8% from yesterday</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AnimatedCard>
            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Prediction Input</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="symbol" className="text-white">Symbol</Label>
                    <Select defaultValue="BTC">
                      <SelectTrigger id="symbol" className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select symbol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC">BTC</SelectItem>
                        <SelectItem value="ETH">ETH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="window-size" className="text-white">Window Size</Label>
                    <Input id="window-size" type="number" defaultValue={30} className="bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="generate-data" />
                    <Label htmlFor="generate-data" className="text-white">Generate New Data</Label>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white relative overflow-hidden group"
                    onClick={handlePredict} 
                    disabled={isLoading}
                  >
                    <span className="relative z-10">
                      {isLoading ? (
                        <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin inline" />
                      ) : (
                        "Predict"
                      )}
                    </span>
                    <span className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white opacity-25 transition-all duration-300 group-hover:scale-100" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AnimatedCard>

          {prediction && (
            <AnimatedCard>
              <Card className="bg-gray-900 border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Prediction Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                      ${prediction.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      Confidence Interval: ${prediction.confidence[0].toLocaleString()} - $
                      {prediction.confidence[1].toLocaleString()}
                    </p>
                    <div className="mt-4">
                      {prediction.trend === "up" ? (
                        <ArrowUpIcon className="w-8 h-8 text-green-500 mx-auto animate-bounce" />
                      ) : (
                        <ArrowDownIcon className="w-8 h-8 text-red-500 mx-auto animate-bounce" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          )}
        </div>

        <AnimatedCard>
          <Card className="bg-gray-900 border border-gray-800 mb-8 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-white">Historical Bitcoin Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  price: {
                    label: "Price",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <XAxis dataKey="date" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </AnimatedCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedCard>
            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Historical Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    accuracy: {
                      label: "Accuracy",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={accuracyData}>
                      <XAxis dataKey="date" stroke="#888888" />
                      <YAxis stroke="#888888" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="accuracy" stroke="#3B82F6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 text-center">
                  <p className="text-2xl font-semibold text-white">MAPE: <AnimatedNumber n={3.2} />%</p>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard>
            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Additional Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "RSI", value: 62.5, color: "from-yellow-400 to-orange-500" },
                    { name: "Order Flow", value: 1.2, color: "from-blue-400 to-indigo-500" },
                    { name: "Fear & Greed Index", value: 75, color: "from-green-400 to-emerald-500" },
                    { name: "Volume", value: 12.5, color: "from-purple-400 to-pink-500" },
                  ].map((indicator) => (
                    <div key={indicator.name} className="bg-gray-800 border border-gray-700 p-4 rounded-lg overflow-hidden relative group">
                      <p className="text-sm text-gray-400">{indicator.name}</p>
                      <p className={`text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r ${indicator.color}`}>
                        <AnimatedNumber n={indicator.value} />
                        {indicator.name === "Volume" && "B"}
                      </p>
                      <div className={`absolute inset-0 bg-gradient-to-r ${indicator.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>
      </main>
    </div>
  )
}
