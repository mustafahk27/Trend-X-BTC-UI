'use client'

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const generateRandomPosition = (width = 1000, height = 1000) => ({
  x: Math.random() * width,
  y: Math.random() * height,
  rotation: Math.random() * 360,
  scale: 0.5 + Math.random() * 0.5,
});

export default function FloatingBitcoins() {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });
  const [bitcoins, setBitcoins] = useState(Array(5).fill(null).map(() => generateRandomPosition()));

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const interval = setInterval(() => {
      setBitcoins(prev => prev.map(() => generateRandomPosition(window.innerWidth, window.innerHeight)));
    }, 5000);

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {bitcoins.map((bitcoin, index) => (
        <motion.div
          key={index}
          initial={generateRandomPosition(dimensions.width, dimensions.height)}
          animate={{
            x: bitcoin.x,
            y: bitcoin.y,
            rotate: bitcoin.rotation,
            scale: bitcoin.scale,
          }}
          transition={{
            duration: 5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute text-[#F7931A]/20 text-4xl"
          style={{ left: -20, top: -20 }}
        >
          ₿
        </motion.div>
      ))}
    </div>
  );
} 