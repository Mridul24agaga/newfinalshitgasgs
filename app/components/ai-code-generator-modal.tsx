"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, Copy, Check, Loader2, AlertCircle, FileCode, RefreshCw, Code } from "lucide-react"

interface AiCodeGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  content: string
  title: string
  seoSettings: any
}

const AiCodeGeneratorModal: React.FC<AiCodeGeneratorModalProps> = ({
  isOpen,
  onClose,
  content,
  title,
  seoSettings,
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [displayedCode, setDisplayedCode] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [contentHash, setContentHash] = useState("")
  const [typingSpeed, setTypingSpeed] = useState(5) // Characters per frame
  const [isTyping, setIsTyping] = useState(false)
  const [isCodeComplete, setIsCodeComplete] = useState(false)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Generate a simple hash of the content
  useEffect(() => {
    if (isOpen) {
      const hash = generateSimpleHash(content + title)
      setContentHash(hash)

      // Check if we've already generated code for this content
      const savedCode = localStorage.getItem(`generated_code_${hash}`)
      if (savedCode) {
        setGeneratedCode(savedCode)
        // Don't start typing animation for cached code
        setDisplayedCode(savedCode)
        setIsCodeComplete(true)
      } else {
        setGeneratedCode(null)
        setDisplayedCode("")
        setIsCodeComplete(false)
      }
    }
  }, [isOpen, content, title])

  // Typing animation effect
  useEffect(() => {
    if (generatedCode && !isCodeComplete && !isTyping) {
      setIsTyping(true)
      setDisplayedCode("")

      let currentIndex = 0

      const typeCode = () => {
        if (currentIndex < generatedCode.length) {
          const nextChunk = generatedCode.substring(currentIndex, currentIndex + typingSpeed)
          setDisplayedCode((prev) => prev + nextChunk)
          currentIndex += typingSpeed
          typingTimerRef.current = setTimeout(typeCode, 10) // Adjust timing for speed
        } else {
          setIsTyping(false)
          setIsCodeComplete(true)
        }
      }

      typeCode()

      return () => {
        if (typingTimerRef.current) {
          clearTimeout(typingTimerRef.current)
        }
      }
    }
  }, [generatedCode, isCodeComplete, isTyping, typingSpeed])

  const generateSimpleHash = (str: string): string => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString(16)
  }

  const handleGenerateCode = async (force = false) => {
    // If already typing, stop it
    if (isTyping && typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
      setIsTyping(false)
    }

    setIsGenerating(true)
    setError(null)
    setIsCodeComplete(false)

    try {
      console.log("Sending request to generate Next.js code...")

      const response = await fetch("/api/generate-nextjs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          title,
          seoSettings,
          ensureComplete: true, // Signal to API that we need complete code
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Error response:", data)
        throw new Error(data.error || "Failed to generate Next.js code")
      }

      // Validate if code appears complete
      const codeToCheck = data.generatedCode
      if (!isCodeComplete && !codeToCheck.includes("export default")) {
        console.warn("Generated code may be incomplete, requesting again...")
        throw new Error("Generated code appears incomplete. Please try again.")
      }

      console.log("Successfully generated Next.js code")
      setGeneratedCode(codeToCheck)

      // Save the generated code with the content hash
      localStorage.setItem(`generated_code_${contentHash}`, codeToCheck)
    } catch (err) {
      console.error("Error in AI code generation:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setDisplayedCode("") // Clear any partial code
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    // Always copy the full generated code, not just what's displayed
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const skipAnimation = () => {
    if (isTyping && typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
      setIsTyping(false)
    }
    if (generatedCode) {
      setDisplayedCode(generatedCode)
      setIsCodeComplete(true)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <FileCode className="h-5 w-5 mr-2 text-orange-600" />
            AI-Generated Next.js Code
            {isTyping && <span className="ml-2 text-sm text-orange-600 animate-pulse">Typing...</span>}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          {!generatedCode && !isGenerating && !error && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-600 mb-4 text-center max-w-md">
                Generate optimized Next.js code for your article using Azure OpenAI
              </p>
              <button
                onClick={() => handleGenerateCode()}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Generate Next.js Code
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-10 w-10 text-orange-600 animate-spin mb-4" />
              <p className="text-gray-600">Generating optimized Next.js code...</p>
              <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-start max-w-md">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error generating code</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={() => handleGenerateCode()}
                className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Try Again
              </button>
            </div>
          )}

          {generatedCode && (
            <div className="h-full flex flex-col">
              <div className="flex justify-between mb-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleGenerateCode(true)}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-1.5 text-sm"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </button>

                  {isTyping && (
                    <button
                      onClick={skipAnimation}
                      className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-1.5 text-sm"
                    >
                      <Code className="h-4 w-4" />
                      Skip Animation
                    </button>
                  )}
                </div>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-1.5 text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>

              <div className="relative flex-1">
                <pre className="bg-white p-4 rounded-md shadow-sm overflow-auto h-full text-sm font-mono">
                  {displayedCode}
                  {isTyping && <span className="inline-block w-2 h-4 bg-orange-500 ml-1 animate-pulse"></span>}
                </pre>

                {isTyping && (
                  <div className="absolute bottom-4 right-4 bg-orange-100 text-orange-800 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm">
                    Typing code... {Math.round((displayedCode.length / (generatedCode?.length || 1)) * 100)}%
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AiCodeGeneratorModal

