'use client'

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic';

interface Bitcoin {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

function FloatingBitcoins() {
  const [bitcoins, setBitcoins] = useState<Bitcoin[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateBitcoins = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newBitcoins = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        size: Math.random() * 20 + 10,
        speed: Math.random() * 1 + 0.5,
      }));
      setBitcoins(newBitcoins);
    };

    updateBitcoins();
    window.addEventListener('resize', updateBitcoins);
    return () => window.removeEventListener('resize', updateBitcoins);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0" ref={containerRef}>
      {bitcoins.map((bitcoin, index) => (
        <motion.div
          key={`bitcoin-${index}`}
          initial={{
            x: -20,
            y: -20,
            rotate: 0,
            scale: 0
          }}
          animate={{
            x: bitcoin.x,
            y: bitcoin.y,
            rotate: 0,
            scale: bitcoin.size,
          }}
          transition={{
            duration: bitcoin.speed,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute text-[#F7931A]/20 text-4xl"
          style={{ left: 0, top: 0 }}
        >
          ₿
        </motion.div>
      ))}
    </div>
  );
}

// Export a client-side only version of the component
export default dynamic(() => Promise.resolve(FloatingBitcoins), {
  ssr: false
}); 