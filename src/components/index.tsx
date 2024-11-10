'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart2, Zap, Cpu, Users } from 'lucide-react'

export function Index() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount + 1) % 100)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-yellow-400 opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxsaW5lIHgxPSIwIiB5PSIwIiB4Mj0iMCIgeTI9IjQwIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-10"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Predict Bitcoin's Future with AI Precision
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Harness the power of machine learning for smarter crypto investments
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center transition duration-300">
              Start Predicting Now
              <ArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Cpu, title: "Advanced AI Model", description: "Our LSTM neural network analyzes multiple data points for accurate predictions" },
              { icon: Zap, title: "Real-time Data", description: "Continuously updated market data ensures the most current predictions" },
              { icon: Users, title: "User-friendly Interface", description: "Easy-to-use dashboard for both beginners and experts" },
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-700 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className="w-12 h-12 mb-4 text-blue-400" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-wrap justify-center">
            {[
              { title: "Input Parameters", description: "Set your prediction timeframe and data sources" },
              { title: "AI Analysis", description: "Our advanced AI model processes the data" },
              { title: "Receive Prediction", description: "Get detailed price predictions and trends" },
              { title: "Make Informed Decisions", description: "Use insights to guide your investment strategy" },
            ].map((step, index) => (
              <motion.div 
                key={index} 
                className="w-full sm:w-1/2 md:w-1/4 px-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-gray-700 p-6 rounded-lg h-full">
                  <div className="text-3xl font-bold text-blue-400 mb-4">{index + 1}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by Investors</h2>
          <div className="flex justify-center items-center mb-8">
            <div className="mr-8">
              <div className="text-4xl font-bold text-blue-400">{count.toString().padStart(2, '0')}M+</div>
              <div className="text-gray-400">Predictions Made</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400">95%</div>
              <div className="text-gray-400">Accuracy Rate</div>
            </div>
          </div>
          <div className="flex justify-center items-center opacity-50">
            <BarChart2 className="w-16 h-16 mx-4" />
            <Cpu className="w-16 h-16 mx-4" />
            <Zap className="w-16 h-16 mx-4" />
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="relative py-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-yellow-400 opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxsaW5lIHgxPSIwIiB5PSIwIiB4Mj0iMCIgeTI9IjQwIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-10"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Predict the Future?</h2>
          <p className="text-xl mb-8">Join thousands of investors making smarter decisions with AI</p>
          <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full inline-flex items-center transition duration-300">
            Try Demo Now
            <ArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
