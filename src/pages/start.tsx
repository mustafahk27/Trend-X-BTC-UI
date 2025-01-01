'use client'

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { NavButton } from "@/components/ui/nav-button";

export default function StartPage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Background with large text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.07 }}
          transition={{ duration: 1 }}
          className="text-[20vw] font-bold text-white whitespace-nowrap select-none"
        >
          TREND-X-BTC
        </motion.h1>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#F7931A_0%,transparent_35%)] opacity-15" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Welcome to <span className="text-[#F7931A]">TREND-X-BTC</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose your path to start predicting Bitcoin&apos;s future with AI precision
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1"
          >
            <Link href="/auth/sign-in">
              <div className="group relative overflow-hidden rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 p-8 hover:bg-black/60 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F7931A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <h2 className="text-2xl font-bold text-white mb-3">Sign In</h2>
                <p className="text-gray-400">
                  Already have an account? Continue your journey with us
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1"
          >
            <Link href="/auth/sign-up">
              <div className="group relative overflow-hidden rounded-xl bg-[#F7931A] p-8 hover:bg-[#F7931A]/90 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <h2 className="text-2xl font-bold text-black mb-3">Sign Up</h2>
                <p className="text-black/70">
                  New to TREND-X-BTC? Create your account and start predicting
                </p>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="fixed top-2 sm:top-6 left-2 sm:left-6 z-20 flex flex-wrap gap-2 sm:gap-4">
          <NavButton 
            href="/" 
            icon={ArrowLeft} 
            label="Back"
            className="flex items-center gap-2 !px-3 sm:!px-6 !py-2 sm:!py-5"
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
      </div>
    </div>
  );
} 