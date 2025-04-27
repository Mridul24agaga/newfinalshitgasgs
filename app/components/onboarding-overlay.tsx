"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface OnboardingOverlayProps {
  isVisible: boolean
  targetRef: React.RefObject<HTMLElement>
  padding?: number
}

export function OnboardingOverlay({ isVisible, targetRef, padding = 8 }: OnboardingOverlayProps) {
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0, height: 0 })

  React.useEffect(() => {
    if (isVisible && targetRef.current) {
      const updatePosition = () => {
        const rect = targetRef.current?.getBoundingClientRect()
        if (rect) {
          setPosition({
            top: rect.top - padding + window.scrollY,
            left: rect.left - padding + window.scrollX,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
          })
        }
      }

      updatePosition()
      window.addEventListener("resize", updatePosition)
      return () => window.removeEventListener("resize", updatePosition)
    }
  }, [isVisible, targetRef, padding])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 pointer-events-none"
        >
          <div
            className={cn("absolute rounded-lg", "ring-2 ring-[#294fd6] ring-offset-2 bg-transparent")}
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
              height: position.height,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
