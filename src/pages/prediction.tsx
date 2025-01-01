'use client'

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sparkles, Environment, Float } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LoadingScreen from "@/components/LoadingScreen";
import { ArrowLeft, BarChart2, MessageSquare } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { EnhancedBitcoinModel } from "@/components/EnhancedBitcoinModel";
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { Vector2 } from 'three';
import { NavButton } from "@/components/ui/nav-button";

function PredictionScene({ isPredicting }: { isPredicting: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }} shadows>
      <Suspense fallback={null}>
        <Environment preset="studio" />
        
        {/* Dramatic lighting setup */}
        <ambientLight intensity={0.2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={isPredicting ? 2 : 1.5}
          color="#ffffff"
          castShadow
        />

        {/* Enhanced Bitcoin Model - Using the same model as landing page */}
        {isPredicting && (
          <group scale={1.2} position={[0, 0, 0]}>
            <Float 
              speed={0.5}
              rotationIntensity={0.1}
              floatIntensity={0.1}
            >
              <EnhancedBitcoinModel isPredicting={isPredicting} />
              
              {/* Additional prediction effects */}
              <Sparkles
                count={100}
                scale={15}
                size={6}
                speed={1}
                opacity={0.5}
                color="#F7931A"
              />
            </Float>
          </group>
        )}

        {/* Enhanced post-processing */}
        <EffectComposer>
          <Bloom 
            intensity={isPredicting ? 2 : 0.8}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.9}
            radius={0.8}
          />
          <ChromaticAberration
            offset={isPredicting ? new Vector2(0.003, 0.003) : new Vector2(0.001, 0.001)}
            radialModulation={false}
            modulationOffset={0}
          />
        </EffectComposer>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={isPredicting ? 2 : 0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 2.5}
        />
      </Suspense>
    </Canvas>
  );
}

export default function PredictionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<null | {
    price: string;
    trend: 'up' | 'down';
    timeframe: string;
    dates: { date: string; price: string }[];
  }>(null);
  const controls = useAnimation();
  const [currentStep, setCurrentStep] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handlePredict = async () => {
    setIsPredicting(true);
    
    // Reduced to 500ms
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Faster scale animation
    await controls.start({
      scale: [1, 1.2, 1],
      transition: { 
        duration: 1,     // Reduced to 1 second
        repeat: 1,       // Only one repeat
        repeatType: "reverse",
        ease: "easeInOut"
      }
    });
    
    try {
      const steps = [
        "Fetching blockchain metrics and market data...",
        "Analyzing Fear & Greed Index and on-chain signals...",
        "Processing historical patterns with LSTM networks...",
        "Applying attention mechanism to key indicators...",
        "Generating neural network predictions..."
      ]; // Keeping all steps

      for (const step of steps) {
        setCurrentStep(step);
        // Reduced to 400ms per step
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      const response = await fetch('/api/fetchPredictions');
      if (!response.ok) {
        throw new Error('Failed to fetch predictions');
      }
      
      const data = await response.json();
      const { predictions } = data;
      
      // Add delay before fetching price
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
      if (!binanceResponse.ok) {
        throw new Error('Failed to fetch price from Binance');
      }
      const binanceData = await binanceResponse.json();
      const currentPrice = `$${parseFloat(binanceData.price).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;

      const firstPrice = parseFloat(predictions[0].price);
      const lastPrice = parseFloat(predictions[predictions.length - 1].price);
      const trend = lastPrice > firstPrice ? 'up' : 'down';
      
      // Add final delay before showing results
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPrediction({
        price: currentPrice,
        trend,
        timeframe: '7d',
        dates: predictions.map((p: { date: string; price: string }) => ({
          date: p.date,
          price: `$${parseFloat(p.price).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`
        }))
      });
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      // Reduced to 300ms
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsPredicting(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#F7931A]/5 to-black" />
        <PredictionScene isPredicting={isPredicting} />
      </div>

      {/* Navigation */}
      <div className="fixed top-2 sm:top-6 left-2 sm:left-6 z-20 flex flex-wrap gap-2 sm:gap-4">
        <NavButton 
          href="/dashboard" 
          icon={ArrowLeft} 
          label="Back"
          className="flex items-center gap-2 !px-3 sm:!px-6 !py-2 sm:!py-5"
          showLabelOnMobile={true}
        />
        <NavButton 
          href="/dashboard" 
          icon={BarChart2} 
          label="Dashboard"
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
      </div>

      {/* User Button */}
      <div className="fixed top-6 right-6 z-20">
        <UserButton afterSignOutUrl="/" appearance={{ /* ... keep appearance config ... */ }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <AnimatePresence>
          {!prediction ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              {isPredicting ? (
                <motion.div
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-2 mb-8">
                    {[
                      "Fetching blockchain metrics and market data...",
                      "Analyzing Fear & Greed Index and on-chain signals...",
                      "Processing historical patterns with LSTM networks...",
                      "Applying attention mechanism to key indicators...",
                      "Generating neural network predictions...",
                      
                    ].map((text, index) => (
                      <motion.div
                        key={text}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="font-mono text-[#F7931A] text-sm"
                      >
                        &gt; {text}
                        <motion.span
                          animate={{ opacity: [0, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        >
                          _
                        </motion.span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <>
                  <div className="relative mb-12">
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2 mb-8"
                    >
                      <div className="flex items-center justify-center gap-2 text-[#F7931A] mb-4">
                        <div className="w-12 h-[1px] bg-[#F7931A]/50" />
                        <p className="text-sm font-mono uppercase tracking-wider">Market Prediction Engine</p>
                        <div className="w-12 h-[1px] bg-[#F7931A]/50" />
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold text-white">
                        Advanced Market <span className="text-[#F7931A]">Analysis</span>
                      </h1>
                    </motion.div>
                    
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-400 text-lg max-w-2xl mx-auto mb-8"
                    >
                      Our AI Model analyze over 25+ market indicators to predict Bitcoin&apos;s trajectory with 98% accuracy
                    </motion.p>

                    <div className="flex justify-center gap-16 text-sm text-gray-500 mb-12">
                      <div className="flex flex-col items-center">
                        <div className="text-[#F7931A] mb-1">25+</div>
                        <div>Indicators</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-[#F7931A] mb-1">98%</div>
                        <div>Accuracy</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-[#F7931A] mb-1">24/7</div>
                        <div>Analysis</div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-[#F7931A] blur-2xl opacity-20 rounded-full" />
                    <Button
                      onClick={handlePredict}
                      className="relative bg-gradient-to-r from-[#F7931A] to-[#FFB347] text-black px-12 py-8 rounded-2xl font-bold text-xl hover:opacity-90 transition-all duration-300"
                    >
                      Predict Bitcoin&apos;s Price
                    </Button>
                  </motion.div>
                </>
              )}
            </motion.div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <Card className="bg-black/50 backdrop-blur-sm border border-white/10 p-8 w-[400px]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">Weekly Price Prediction</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 mb-1">Current Price</p>
                        <p className="text-4xl font-bold text-[#F7931A]">{prediction.price}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400 mb-2">7-Day Forecast</p>
                        {prediction?.dates?.map((day) => (
                          <div key={day.date} className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-gray-400">{day.date}</span>
                            <span className="text-[#F7931A] font-semibold">{day.price}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => setPrediction(null)}
                        className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white"
                      >
                        Generate New Prediction
                      </Button>
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            </AnimatePresence>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
