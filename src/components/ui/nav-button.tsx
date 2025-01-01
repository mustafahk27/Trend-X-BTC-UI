import { Button } from "./button";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface NavButtonProps {
  href: string;
  icon: LucideIcon;
  label: string;
  className?: string;
  showLabelOnMobile?: boolean;
}

export function NavButton({ 
  href, 
  icon: Icon, 
  label, 
  className = "",
  showLabelOnMobile = false 
}: NavButtonProps) {
  return (
    <Link href={href}>
      <button className={`
        flex items-center gap-2 px-3 py-2 
        rounded-lg bg-black/50 backdrop-blur-sm 
        border border-white/10 hover:border-[#F7931A]/50 
        transition-all text-white
        ${className}
      `}>
        <Icon className="w-4 h-4" />
        <span className={`${showLabelOnMobile ? 'inline-block' : 'hidden sm:inline-block'} text-sm`}>
          {label}
        </span>
      </button>
    </Link>
  );
}