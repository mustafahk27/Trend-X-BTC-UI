import { Button } from "./button";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface NavButtonProps {
  href: string;
  icon: LucideIcon;
  label: string;
  className?: string;
}

export function NavButton({ href, icon: Icon, label, className }: NavButtonProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-[#F7931A] opacity-0 hover:opacity-20 rounded-xl transition-opacity duration-300 blur-xl" />
        <Button
          variant="ghost"
          className={`relative bg-black/50 backdrop-blur-sm border border-white/10 text-white 
          hover:bg-black/60 hover:border-[#F7931A]/50 transition-all duration-300 
          rounded-xl flex items-center gap-3 group overflow-hidden ${className}`}
        >
          <div className="relative z-10">
            <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="relative z-10 font-medium transition-colors duration-300 group-hover:text-[#F7931A] hidden sm:inline">
            {label}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7931A]/0 via-[#F7931A]/5 to-[#F7931A]/0 
            opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
        </Button>
      </motion.div>
    </Link>
  );
}