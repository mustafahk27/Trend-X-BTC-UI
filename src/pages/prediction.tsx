import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PredictionPage() {
  const [timeframe, setTimeframe] = useState('24h');
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<null | {
    price: number;
    confidence: number;
    trend: 'up' | 'down';
  }>(null);

  const handlePredict = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPrediction({
        price: 45000,
        confidence: 85,
        trend: 'up'
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">Bitcoin Price Prediction</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Input Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Prediction Timeframe
                </label>
                <Select
                  value={timeframe}
                  onValueChange={setTimeframe}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handlePredict} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Analyzing..." : "Generate Prediction"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prediction Results</CardTitle>
            </CardHeader>
            <CardContent>
              {prediction ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Predicted Price</p>
                    <p className="text-3xl font-bold">${prediction.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Confidence Level</p>
                    <p className="text-xl font-semibold">{prediction.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trend</p>
                    <p className={`text-xl font-semibold ${
                      prediction.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {prediction.trend === 'up' ? '↑ Upward' : '↓ Downward'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No prediction generated yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
