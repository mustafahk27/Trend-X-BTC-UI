'use client'

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function SignUpPage() {
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
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Join <span className="text-[#F7931A]">TREND-X-BTC</span>
          </h1>
          <p className="text-gray-400">
            Start your journey in AI-powered Bitcoin predictions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full max-w-md backdrop-blur-sm"
        >
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-black/50 backdrop-blur-sm border border-white/10",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 border-white/10 text-white",
                socialButtonsBlockButtonText: "text-white font-medium",
                dividerLine: "bg-white/10",
                dividerText: "text-white/60",
                formFieldLabel: "text-white",
                formFieldInput: "bg-black/30 border-white/10 text-white placeholder:text-white/40",
                formButtonPrimary: "bg-[#F7931A] hover:bg-[#F7931A]/90 text-black font-medium",
                footerActionLink: "text-[#F7931A] hover:text-[#F7931A]/90",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-[#F7931A] hover:text-[#F7931A]/90",
              },
            }}
            routing="path"
            path="/auth/sign-up"
            signInUrl="/auth/sign-in"
            redirectUrl="/dashboard"
          />
        </motion.div>
      </div>
    </div>
  );
} 