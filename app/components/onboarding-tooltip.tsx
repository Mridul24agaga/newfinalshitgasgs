"use client"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingTooltipProps {
  isVisible: boolean
  title: string
  description: string
  position: "right" | "bottom" | "top" | "left"
  onNext: () => void
  onSkip: () => void
  step: number
  totalSteps: number
}

export function OnboardingTooltip({
  isVisible,
  title,
  description,
  position = "right",
  onNext,
  onSkip,
  step,
  totalSteps,
}: OnboardingTooltipProps) {
  const positionClasses = {
    right: "left-full ml-2",
    left: "right-full mr-2",
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute z-50 w-64 p-4 rounded-lg bg-white text-gray-800 shadow-xl border border-gray-200",
            positionClasses[position],
          )}
        >
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-[#294fd6]">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>

            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={cn("w-2 h-2 rounded-full", i === step - 1 ? "bg-[#294fd6]" : "bg-gray-300")}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={onSkip} className="text-xs text-gray-500 hover:text-gray-700">
                  Skip
                </button>
                <button
                  onClick={onNext}
                  className="flex items-center gap-1 text-sm font-medium text-[#294fd6] hover:text-[#3a61e0]"
                >
                  {step === totalSteps ? "Finish" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
