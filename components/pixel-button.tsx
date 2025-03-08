"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface PixelButtonProps {
  children: ReactNode
  onClick: () => void
  color?: string
  borderColor?: string
  textColor?: string
  className?: string
  disabled?: boolean
}

export default function PixelButton({
  children,
  onClick,
  color = "bg-blue-700",
  borderColor = "border-blue-500",
  textColor = "text-white",
  className = "",
  disabled = false,
}: PixelButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={disabled ? undefined : onClick}
      className={`${color} ${borderColor} ${textColor} border-2 font-mono px-4 py-2 rounded-md ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}

