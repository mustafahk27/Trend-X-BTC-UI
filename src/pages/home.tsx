import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { BarChart2, MessageCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const router = useRouter();

  const sections = [
    {
      title: 'Dashboard',
      description: 'View detailed analytics and market trends',
      icon: BarChart2,
      path: '/dashboard',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'AI Chatbot',
      description: 'Get instant answers to your trading questions',
      icon: MessageCircle,
      path: '/chatbot',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Price Prediction',
      description: 'AI-powered cryptocurrency price predictions',
      icon: TrendingUp,
      path: '/prediction',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to TradingAI</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => router.push(section.path)}
            className="cursor-pointer"
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-10`} />
              <CardHeader>
                <section.icon className="w-8 h-8 mb-2" />
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
