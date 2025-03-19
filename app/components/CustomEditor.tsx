"use client"

import type React from "react"
import type { ReactNode } from "react"
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import {
  ArrowLeft,
  Share2,
  List,
  BookOpen,
  BarChart2,
  Plus,
  ImageIcon,
  X,
  Loader2,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  Link,
  ListOrdered,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Code,
  Undo,
  Redo,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Formatting utility (optimized)
const formatUtils = {
  convertMarkdownToHtml: (markdown: string): string => {
    let html = markdown
      .replace(/^###### (.*$)/gim, '<h6 class="text-lg font-semibold mt-6 mb-3">$1</h6>')
      .replace(/^##### (.*$)/gim, '<h5 class="text-xl font-semibold mt-6 mb-3">$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-2xl font-semibold mt-8 mb-4">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="text-3xl font-bold mt-10 mb-5 text-gray-800">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-4xl font-bold mt-12 mb-6 text-gray-900">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-5xl font-bold mt-14 mb-8 text-gray-900 border-b pb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/^- (.*)$/gim, '<li class="ml-6 mb-4 list-disc text-gray-700 font-normal">$1</li>')
      .replace(/^[*] (.*)$/gim, '<li class="ml-6 mb-4 list-disc text-gray-700 font-normal">$1</li>')
      .replace(/(<li.*?>.*<\/li>)/gim, '<ul class="my-6">$1</ul>')
      .replace(/\n{2,}/g, '</p><p class="mt-6 mb-6 text-gray-700 leading-relaxed font-normal">')
      .replace(/\[([^\]]+)\]$$([^)]+)$$/gim, '<a href="$2" class="text-orange-600 hover:underline font-normal">$1</a>')
      .replace(
        /^>\s+(.*)$/gim,
        '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6 font-normal">$1</blockquote>',
      )

    html = `<p class="mt-6 mb-6 text-gray-700 leading-relaxed font-normal">${html}</p>`
    return html
  },

  sanitizeHtml: (html: string): string => {
    if (!html) return ""

    if (html.includes("<script") || html.includes("javascript:") || html.includes("onerror=")) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      doc.querySelectorAll("p, li, a, blockquote").forEach((el) => {
        el.classList.remove("font-bold")
        el.classList.add("font-normal")
      })
      doc.querySelectorAll("p").forEach((p) => {
        p.classList.add("mt-6", "mb-6", "text-gray-700", "leading-relaxed")
      })
      doc.querySelectorAll("ul").forEach((ul) => {
        ul.classList.add("my-6")
      })
      doc.querySelectorAll("li").forEach((li) => {
        li.classList.add("ml-6", "mb-4", "list-disc", "text-gray-700", "font-normal")
      })
      doc.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((h) => {
        h.classList.remove("font-bold")
        if (h.tagName === "H1") h.classList.add("font-bold")
        if (h.tagName === "H2") h.classList.add("font-bold")
        if (h.tagName === "H3") h.classList.add("font-bold")
      })

      return doc.body.innerHTML
    }

    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/onerror=/gi, "")
  },

  generateToc: (htmlContent: string): Array<{ id: string; text: string; level: number }> => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, "text/html")
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6")
    return Array.from(headings).map((h, i) => {
      h.id = `heading-${i}`
      return {
        id: `heading-${i}`,
        text: h.textContent?.trim() || "",
        level: Number(h.tagName[1]),
      }
    })
  },
}

interface CustomEditorProps {
  initialValue: string
  onChange: (newContent: string) => void
  images: string[]
  onGenerateMore: () => void
  citations: string[]
}

interface ToolbarButton {
  cmd: string
  label: ReactNode
  title: string
}

// Context Menu Component
const ContextMenu: React.FC<{
  visible: boolean
  position: { x: number; y: number }
  onClose: () => void
  onDelete: () => void
}> = ({ visible, position, onClose, onDelete }) => {
  if (!visible) return null

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!e.target) return
      const target = e.target as Node
      const menu = document.querySelector(".fixed.z-50")
      if (menu && !menu.contains(target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        minWidth: "160px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-1">
        <button
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
            onClose()
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Delete Image
        </button>
      </div>
    </div>
  )
}

// FloatingToolbar (improved)
const FloatingToolbar: React.FC<{
  visible: boolean
  position: { x: number; y: number }
  onCommand: (command: string, value?: string) => void
}> = ({ visible, position, onCommand }) => {
  if (!visible) return null

  return (
    <div
      className="absolute z-50 bg-gray-900 text-white rounded-lg shadow-lg flex items-center p-1.5 gap-1"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: "translate(-50%, -120%)",
        transition: "opacity 0.2s ease-in-out, transform 0.2s ease-in-out",
        opacity: visible ? 1 : 0,
      }}
    >
      <button
        onClick={() => onCommand("generateImage")}
        className="p-1.5 hover:bg-gray-700 rounded-md flex items-center gap-1 text-xs"
        title="Generate Image"
        aria-label="Generate Image"
      >
        <ImageIcon className="h-4 w-4" />
      </button>

      <div className="h-5 border-r border-gray-700 mx-1"></div>

      <button
        onClick={() => onCommand("bold")}
        className="p-1.5 hover:bg-gray-700 rounded-md"
        title="Bold"
        aria-label="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>

      <button
        onClick={() => onCommand("italic")}
        className="p-1.5 hover:bg-gray-700 rounded-md"
        title="Italic"
        aria-label="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>

      <button
        onClick={() => onCommand("underline")}
        className="p-1.5 hover:bg-gray-700 rounded-md"
        title="Underline"
        aria-label="Underline"
      >
        <Underline className="h-4 w-4" />
      </button>

      <button
        onClick={() => {
          const url = prompt("Enter URL:", "https://")
          if (url && url.trim()) onCommand("createLink", url.trim())
        }}
        className="p-1.5 hover:bg-gray-700 rounded-md"
        title="Insert Link"
        aria-label="Insert Link"
      >
        <Link className="h-4 w-4" />
      </button>

      <button
        onClick={() => onCommand("removeFormat")}
        className="p-1.5 hover:bg-gray-700 rounded-md"
        title="Clear Formatting"
        aria-label="Clear Formatting"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// ImageGenerationModal (improved)
const ImageGenerationModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onInsertImage: (imageUrl: string) => void
  blogContent: string
}> = ({ isOpen, onClose, onInsertImage, blogContent }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState<string>("16:9")

  const determineImageCount = (content: string): number => {
    const words = content
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length
    return words > 1000 ? 5 : words > 500 ? 4 : 3
  }

  // Update the generatePromptsFromContent function to create much more specific, contextually relevant prompts
  const generatePromptsFromContent = (content: string, count: number): string[] => {
    // Extract headings to understand the structure and main topics
    const headingMatches = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi) || []
    const headings = headingMatches.map((h) => h.replace(/<\/?[^>]+(>|$)/g, "").trim())

    // Extract paragraphs for content analysis
    const paragraphs = content.split("</p>").filter((p) => p.trim().length > 0)
    const prompts: string[] = []

    // Function to extract key concepts from text
    const extractKeyTopics = (text: string): string => {
      // Remove HTML tags and get plain text
      const plainText = text.replace(/<[^>]+>/g, "").trim()

      // Get the first 100-150 characters for context
      const contextText = plainText.slice(0, Math.min(plainText.length, 150))

      // Extract what seems to be the main subject
      const mainSubject = contextText.split(/[,.;:]/).filter((s) => s.trim().length > 15)[0] || contextText

      return mainSubject.trim()
    }

    // Try to match paragraphs with nearby headings for better context
    for (let i = 0; i < count && i < paragraphs.length; i++) {
      // Find a good paragraph with enough content
      let paragraphIndex = i
      while (paragraphIndex < paragraphs.length) {
        const paragraph = paragraphs[paragraphIndex].replace(/<[^>]+>/g, "").trim()
        if (paragraph.length >= 50) break
        paragraphIndex++
      }

      if (paragraphIndex >= paragraphs.length) paragraphIndex = i // Fallback

      const paragraph = paragraphs[paragraphIndex].replace(/<[^>]+>/g, "").trim()

      // Find the nearest heading above this paragraph
      let nearestHeading = ""
      for (let j = 0; j < headingMatches.length; j++) {
        const headingPos = content.indexOf(headingMatches[j])
        const paragraphPos = content.indexOf(paragraphs[paragraphIndex])
        if (headingPos < paragraphPos) {
          nearestHeading = headings[j]
        } else {
          break
        }
      }

      // Extract key topics from this paragraph
      const keyTopic = extractKeyTopics(paragraph)

      // Create a very specific prompt combining heading context and paragraph content
      if (paragraph) {
        let specificPrompt = `Create a professional 16:9 photograph that precisely illustrates "${keyTopic}"`

        if (nearestHeading) {
          specificPrompt += ` in the context of "${nearestHeading}"`
        }

        // Add specific details from the paragraph
        specificPrompt += `. The image should show ${paragraph.slice(0, 100)}...`

        // Add style guidance
        specificPrompt += ` Style: high-quality, realistic photography with natural lighting, not AI-generated looking, no text overlay, professional composition.`

        prompts.push(specificPrompt)
      }
    }

    // If we couldn't get enough specific prompts, create some from headings
    while (prompts.length < count) {
      if (headings.length > 0) {
        const headingIndex = prompts.length % headings.length
        prompts.push(
          `Create a professional 16:9 photograph that precisely illustrates "${headings[headingIndex]}". Style: high-quality, realistic photography with natural lighting, not AI-generated looking, no text overlay, professional composition.`,
        )
      } else {
        // Last resort fallback
        prompts.push(
          `Create a professional 16:9 photograph related to ${content
            .replace(/<[^>]+>/g, "")
            .split(" ")
            .slice(0, 10)
            .join(
              " ",
            )}... Style: high-quality, realistic photography with natural lighting, not AI-generated looking, no text overlay, professional composition.`,
        )
      }
    }

    return prompts.slice(0, count)
  }

  const handleGenerate = async () => {
    if (!blogContent.trim()) {
      setError("No blog content available to generate images.")
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedImages([])
    setSelectedImage(null)

    try {
      const imageCount = determineImageCount(blogContent)
      const prompts = generatePromptsFromContent(blogContent, imageCount)
      console.log("Generating images with prompts:", prompts)

      const imagePromises = prompts.map((prompt) =>
        fetch("/api/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt, aspect_ratio: aspectRatio }),
        }),
      )

      const responses = await Promise.all(imagePromises)

      const images: string[] = []
      for (const response of responses) {
        if (!response.ok) {
          const text = await response.text()
          throw new Error(`Server error: ${response.status} - ${text}`)
        }

        const data = await response.json()
        if (data.images && data.images.length > 0) {
          images.push(data.images[0])
        } else {
          throw new Error(data.error || "No images were generated")
        }
      }

      if (images.length === 0) {
        throw new Error("No images were successfully generated.")
      }

      setGeneratedImages(images)
      setSelectedImage(images[0])
    } catch (err) {
      console.error("Error generating images:", err)
      setError(err instanceof Error ? err.message : "Failed to generate images. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleInsert = () => {
    if (selectedImage) {
      onInsertImage(selectedImage)
      onClose()
      setGeneratedImages([])
      setSelectedImage(null)
      setError(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <ImageIcon className="h-5 w-5 mr-2 text-orange-600" />
            Generate Images with Clipdrop
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-auto">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              Generating {determineImageCount(blogContent)} images based on your blog post content.
            </p>

            <div className="mb-4">
              <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-700 mb-1">
                Aspect Ratio
              </label>
              <div className="relative">
                <select
                  id="aspect-ratio"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 appearance-none bg-white"
                  aria-label="Select aspect ratio"
                  disabled
                >
                  <option value="16:9">Landscape - Best for blog posts (16:9)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full mt-4 px-4 py-2.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              aria-label={isGenerating ? "Generating images..." : "Generate Images"}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Images
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {isGenerating && (
            <div className="mt-6 flex flex-col items-center justify-center py-8">
              <Loader2 className="h-10 w-10 text-orange-600 animate-spin mb-4" />
              <p className="text-gray-600">Generating high-quality images with Clipdrop...</p>
              <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
            </div>
          )}

          {generatedImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Generated Images</h3>
              <p className="text-sm text-gray-500 mb-3">Select an image to insert into your content</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {generatedImages.map((img, index) => (
                  <div
                    key={index}
                    className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedImage === img
                        ? "border-orange-500 ring-2 ring-orange-200"
                        : "border-transparent hover:border-orange-300"
                    }`}
                    onClick={() => setSelectedImage(img)}
                    aria-label={`Select image ${index + 1}`}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Generated image ${index + 1}`}
                      className="w-full aspect-square object-cover"
                      onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!selectedImage}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            aria-label="Insert Image"
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  )
}

// Updated CustomRichEditor with improved UI and performance
const CustomRichEditor: React.FC<{
  value: string
  onChange: (value: string) => void
  className?: string
}> = ({ value, onChange, className }) => {
  const [editorContent, setEditorContent] = useState(value)
  const editorRef = useRef<HTMLDivElement>(null)
  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  const selectionTimeout = useRef<NodeJS.Timeout | null>(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const lastSelectionRef = useRef<Range | null>(null)
  const draggedImageRef = useRef<HTMLImageElement | null>(null)
  const dropPlaceholderRef = useRef<HTMLDivElement | null>(null)
  const inputTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Context menu state
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const contextMenuTarget = useRef<HTMLImageElement | null>(null)

  const [isSettingUpImageInteractions, setIsSettingUpImageInteractions] = useState(false)
  const [formattedHtml, setFormattedHtml] = useState(
    value.startsWith("<") ? formatUtils.sanitizeHtml(value) : formatUtils.convertMarkdownToHtml(value),
  )

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleDragStart = useCallback((e: React.DragEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement
    if (!img.closest(".image-wrapper")) return
    draggedImageRef.current = img
    e.dataTransfer.setData("text/html", img.outerHTML)
    e.dataTransfer.effectAllowed = "move"
    img.style.opacity = "0.5"

    if (!dropPlaceholderRef.current) {
      const placeholder = document.createElement("div")
      placeholder.className = "drop-placeholder h-2 bg-orange-300 opacity-50 my-2 rounded-full"
      dropPlaceholderRef.current = placeholder
    }
  }, [])

  const handleDragEnd = useCallback((e: React.DragEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement
    img.style.opacity = "1"
    if (dropPlaceholderRef.current?.parentNode) {
      dropPlaceholderRef.current.parentNode.removeChild(dropPlaceholderRef.current)
    }
    draggedImageRef.current = null
  }, [])

  const setupImageInteractions = useCallback(() => {
    if (!editorRef.current || isSettingUpImageInteractions) return

    setIsSettingUpImageInteractions(true)
    try {
      const images = editorRef.current.querySelectorAll("img")
      images.forEach((img) => {
        img.setAttribute("draggable", "true")
        img.addEventListener("dragstart", (e: DragEvent) => handleDragStart(e as any))
        img.addEventListener("dragend", (e: DragEvent) => handleDragEnd(e as any))
      })
    } finally {
      setIsSettingUpImageInteractions(false)
    }
  }, [handleDragStart, handleDragEnd, isSettingUpImageInteractions])

  useEffect(() => {
    setFormattedHtml(value.startsWith("<") ? formatUtils.sanitizeHtml(value) : formatUtils.convertMarkdownToHtml(value))
  }, [value])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = formattedHtml
      setEditorContent(formattedHtml)
    }
  }, [formattedHtml])

  useEffect(() => {
    if (!isMounted) return
    setupImageInteractions()
  }, [editorContent, setupImageInteractions, isMounted])

  const handleInput = useCallback(() => {
    if (inputTimeoutRef.current) {
      clearTimeout(inputTimeoutRef.current)
    }

    inputTimeoutRef.current = setTimeout(() => {
      if (editorRef.current) {
        const selection = window.getSelection()
        const range = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null
        const scrollTop = editorRef.current.scrollTop

        const newContent = formatUtils.sanitizeHtml(editorRef.current.innerHTML)
        editorRef.current.innerHTML = newContent
        setEditorContent(newContent)
        onChange(newContent)

        editorRef.current.scrollTop = scrollTop

        if (range && editorRef.current) {
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      }
    }, 150)
  }, [onChange])

  const execCommand = useCallback(
    (command: string, value?: string) => {
      console.log(`Executing command: ${command}, value: ${value}`)
      if (command === "generateImage") {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          lastSelectionRef.current = selection.getRangeAt(0).cloneRange()
        }
        setShowImageModal(true)
        return
      }

      if (editorRef.current) {
        document.execCommand(command, false, value || undefined)
        handleInput()
      }
    },
    [handleInput],
  )

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection()

    if (selectionTimeout.current) {
      clearTimeout(selectionTimeout.current)
    }

    if (
      selection &&
      !selection.isCollapsed &&
      selection.rangeCount > 0 &&
      editorRef.current?.contains(selection.anchorNode)
    ) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      if (rect.width > 0 && editorRef.current) {
        setToolbarPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10 + window.scrollY,
        })
        setShowToolbar(true)
      } else {
        selectionTimeout.current = setTimeout(() => setShowToolbar(false), 300)
      }
    } else {
      selectionTimeout.current = setTimeout(() => setShowToolbar(false), 300)
    }
  }, [])

  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      if (!editorRef.current) return

      const target = e.target as HTMLElement
      if (target.tagName === "IMG" && editorRef.current.contains(target)) {
        e.preventDefault()
        setContextMenuPosition({ x: e.clientX, y: e.clientY })
        contextMenuTarget.current = target as HTMLImageElement
        setShowContextMenu(true)
      } else if (showContextMenu) {
        setShowContextMenu(false)
      }
    },
    [showContextMenu],
  )

  const handleDeleteImage = useCallback(() => {
    if (contextMenuTarget.current && editorRef.current) {
      const elementToRemove = contextMenuTarget.current.closest(".image-wrapper") || contextMenuTarget.current
      if (elementToRemove) {
        elementToRemove.remove()
        const newContent = formatUtils.sanitizeHtml(editorRef.current.innerHTML)
        const scrollTop = editorRef.current.scrollTop
        const selection = window.getSelection()
        const range = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null

        editorRef.current.innerHTML = newContent
        setEditorContent(newContent)
        onChange(newContent)

        editorRef.current.scrollTop = scrollTop

        if (range && editorRef.current) {
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      }
      contextMenuTarget.current = null
      setShowContextMenu(false)
    }
  }, [onChange])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    if (!editorRef.current || !dropPlaceholderRef.current) return

    const rect = editorRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top + editorRef.current.scrollTop
    const children = Array.from(editorRef.current.childNodes) as HTMLElement[]

    let insertBeforeElement: HTMLElement | null = null
    for (const child of children) {
      if (child.className === "drop-placeholder") continue
      const childRect = child.getBoundingClientRect()
      const childTop = childRect.top - rect.top + editorRef.current.scrollTop
      const childBottom = childTop + childRect.height

      if (y < childTop + childRect.height / 2) {
        insertBeforeElement = child
        break
      }
    }

    if (insertBeforeElement && editorRef.current) {
      editorRef.current.insertBefore(dropPlaceholderRef.current, insertBeforeElement)
    } else if (editorRef.current) {
      editorRef.current.appendChild(dropPlaceholderRef.current)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (!draggedImageRef.current || !editorRef.current || !dropPlaceholderRef.current) return

      const originalWrapper = draggedImageRef.current.closest(".image-wrapper")
      if (originalWrapper) {
        originalWrapper.remove()
      } else if (draggedImageRef.current.parentNode) {
        draggedImageRef.current.parentNode.removeChild(draggedImageRef.current)
      }

      const newImageWrapper = document.createElement("div")
      newImageWrapper.className = "image-wrapper my-4"
      const newImage = draggedImageRef.current.cloneNode(true) as HTMLImageElement
      newImage.style.opacity = "1"
      newImageWrapper.appendChild(newImage)

      const scrollTop = editorRef.current.scrollTop
      const selection = window.getSelection()
      const range = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null

      if (dropPlaceholderRef.current.parentNode && editorRef.current) {
        dropPlaceholderRef.current.parentNode.insertBefore(newImageWrapper, dropPlaceholderRef.current)
        dropPlaceholderRef.current.parentNode.removeChild(dropPlaceholderRef.current)
      }

      handleInput()
      draggedImageRef.current = null
      setupImageInteractions()

      if (editorRef.current) {
        editorRef.current.scrollTop = scrollTop
        if (range && editorRef.current) {
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      }
    },
    [handleInput, setupImageInteractions],
  )

  const handleInsertImage = useCallback(
    (imageUrl: string) => {
      if (lastSelectionRef.current && editorRef.current) {
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(lastSelectionRef.current)

          const imgWrapper = document.createElement("div")
          imgWrapper.className = "image-wrapper my-4"
          const img = document.createElement("img")
          img.src = imageUrl
          img.alt = "Generated image"
          img.className = "rounded-lg w-full h-auto shadow-md aspect-video object-cover"
          img.draggable = true
          imgWrapper.appendChild(img)

          const range = lastSelectionRef.current
          const scrollTop = editorRef.current.scrollTop

          range.deleteContents()
          range.insertNode(imgWrapper)
          handleInput()

          setupImageInteractions()
          setShowImageModal(false)

          if (editorRef.current) {
            editorRef.current.scrollTop = scrollTop
            selection.removeAllRanges()
            selection.addRange(range)
          }
        }
      }
    },
    [handleInput, setupImageInteractions],
  )

  useEffect(() => {
    if (!isMounted) return

    if (!editorRef.current) return

    const handleSelectionChangeBound = () => handleSelectionChange()
    document.addEventListener("selectionchange", handleSelectionChangeBound)

    editorRef.current.addEventListener("contextmenu", handleContextMenu)

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          setupImageInteractions()
        }
      })
    })

    observer.observe(editorRef.current, { childList: true, subtree: true })

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChangeBound)
      if (selectionTimeout.current) clearTimeout(selectionTimeout.current)
      if (inputTimeoutRef.current) clearTimeout(inputTimeoutRef.current)
      if (editorRef.current) {
        editorRef.current.removeEventListener("contextmenu", handleContextMenu)
      }
      observer.disconnect()
    }
  }, [handleSelectionChange, handleContextMenu, setupImageInteractions, isMounted])

  return (
    <div className="relative bg-white">
      <FloatingToolbar visible={showToolbar} position={toolbarPosition} onCommand={execCommand} />
      <ImageGenerationModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onInsertImage={handleInsertImage}
        blogContent={value}
      />

      <ContextMenu
        visible={showContextMenu}
        position={contextMenuPosition}
        onClose={() => setShowContextMenu(false)}
        onDelete={handleDeleteImage}
      />

      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2 p-2 sm:p-3">
          <select
            onChange={(e) => execCommand("formatBlock", e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-md bg-white text-sm min-w-[100px] focus:ring-orange-500 focus:outline-none"
            aria-label="Select heading level"
          >
            <option value="p">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
          </select>

          <div className="flex items-center gap-1">
            <button
              onClick={() => execCommand("bold")}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Bold"
              aria-label="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCommand("italic")}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Italic"
              aria-label="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCommand("underline")}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Underline"
              aria-label="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => execCommand("insertOrderedList")}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Ordered List"
              aria-label="Ordered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCommand("insertUnorderedList")}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Unordered List"
              aria-label="Unordered List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => execCommand("generateImage")}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Insert Image"
            aria-label="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const url = prompt("Enter URL:", "https://")
              if (url && url.trim()) execCommand("createLink", url.trim())
            }}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Insert Link"
            aria-label="Insert Link"
          >
            <Link className="w-4 h-4" />
          </button>

          <button
            onClick={() => execCommand("code")}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Code Block"
            aria-label="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => execCommand("undo")}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Undo"
              aria-label="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => execCommand("redo")}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Redo"
              aria-label="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onPaste={(e) => {
          e.preventDefault()
          const text = e.clipboardData?.getData("text/plain") || ""
          document.execCommand("insertText", false, text)
          handleInput()
        }}
        className={`p-4 sm:p-6 md:p-8 min-h-[500px] sm:min-h-[600px] md:min-h-[800px] focus:outline-none prose prose-lg max-w-none ${className}`}
        style={{
          backgroundColor: "white",
          outline: "none",
        }}
        aria-label="Rich text editor"
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        [contenteditable] {
          -webkit-user-modify: read-write-plaintext-only;
          overflow-wrap: break-word;
          -webkit-line-break: after-white-space;
          -webkit-user-select: text;
          cursor: text;
          outline: none !important;
        }
        .image-wrapper {
          display: block;
          margin: 1rem 0;
        }
        .drop-placeholder {
          transition: opacity 0.2s ease-in-out;
        }
        @media (max-width: 768px) {
          .prose {
            font-size: 16px;
            line-height: 1.6;
          }
          .prose h1 {
            font-size: 2rem;
          }
          .prose h2 {
            font-size: 1.75rem;
          }
          .prose h3 {
            font-size: 1.5rem;
          }
        }
        .prose img {
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          aspect-ratio: 16/9;
          object-fit: cover;
          width: 100%;
        }
      `}</style>
    </div>
  )
}

export default function CustomEditor({ initialValue, onChange, images, onGenerateMore, citations }: CustomEditorProps) {
  const [content, setContent] = useState(initialValue)
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const formattedContent = initialValue.startsWith("<")
      ? formatUtils.sanitizeHtml(initialValue)
      : formatUtils.convertMarkdownToHtml(initialValue)
    setContent(formattedContent)
    setToc(formatUtils.generateToc(formattedContent))
  }, [initialValue])

  const handleContentChange = useCallback(
    (value: string) => {
      const sanitizedContent = formatUtils.sanitizeHtml(value)
      setContent(sanitizedContent)
      onChange(sanitizedContent)
      setToc(formatUtils.generateToc(sanitizedContent))
    },
    [onChange],
  )

  const metrics = useMemo(
    () => ({
      words: content
        .replace(/<[^>]+>/g, " ")
        .split(/\s+/)
        .filter(Boolean).length,
      headings: toc.length,
      paragraphs: (content.match(/<p[^>]*>/g) || []).length,
      readingTime: Math.ceil(
        content
          .replace(/<[^>]+>/g, " ")
          .split(/\s+/)
          .filter(Boolean).length / 200,
      ),
      images: (content.match(/<img[^>]+>/g) || []).length,
    }),
    [content, toc],
  )

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Go back">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <span>Content Editor</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">Intermittent fasting</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md flex items-center gap-2"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700" aria-label="Publish">
              Publish
            </button>
            <button
              className="sm:hidden p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <BarChart2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-screen-2xl mx-auto flex flex-col md:flex-row">
        {/* Editor Area */}
        <div className="flex-1">
          <CustomRichEditor value={content} onChange={handleContentChange} className="w-full h-full" />
        </div>

        {/* Metrics Sidebar */}
        <div
          className={`md:w-80 flex-shrink-0 border-l border-gray-200 ${isSidebarOpen ? "block" : "hidden md:block"}`}
        >
          <div className="h-full overflow-auto">
            {/* Content Stats */}
            <div className="p-4">
              <h3 className="font-medium mb-3">Content Brief</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Words</span>
                    <span className="text-sm font-medium">
                      {metrics.words} {metrics.words >= 2000 && metrics.words <= 2404 ? "✓" : ""}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">2,000-2,404</div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Headings</span>
                    <span className="text-sm font-medium">
                      {metrics.headings} {metrics.headings >= 5 && metrics.headings <= 36 ? "✓" : ""}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">5-36</div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Paragraphs</span>
                    <span className="text-sm font-medium">
                      {metrics.paragraphs} {metrics.paragraphs >= 65 && metrics.paragraphs <= 117 ? "✓" : ""}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">65-117</div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Images</span>
                    <span className="text-sm font-medium">
                      {metrics.images} {metrics.images >= 3 && metrics.images <= 29 ? "✓" : ""}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">3-29</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Table of Contents */}
            <div className="p-4">
              <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                <List className="h-4 w-4 mr-2 text-orange-600" />
                Table of Contents
              </h2>
              <div className="max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                {toc.length > 0 ? (
                  <ul className="space-y-1.5">
                    {toc.map((item) => (
                      <li key={item.id} className={`text-sm ${item.level > 1 ? `ml-${(item.level - 1) * 3}` : ""}`}>
                        <a
                          href={`#${item.id}`}
                          className="text-orange-600 hover:text-orange-800 hover:underline transition-colors block truncate py-1"
                          aria-label={`Jump to ${item.text}`}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No headings found</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Citations */}
            {citations.length > 0 && (
              <>
                <div className="p-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-orange-600" />
                    References
                  </h2>
                  <div className="max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                    <ul className="space-y-2">
                      {citations.map((citation, index) => (
                        <li key={index} className="text-sm">
                          <a
                            href={citation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-800 hover:underline line-clamp-2 flex items-center gap-1"
                            aria-label={`Open reference ${index + 1}`}
                          >
                            <span>{citation}</span>
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-200"></div>
              </>
            )}

            {/* Images */}
            {images.length > 0 && (
              <>
                <div className="p-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">Images</h2>
                  <div className="max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-3">
                      {images.map((src, index) => (
                        <img
                          key={index}
                          src={src || "/placeholder.svg"}
                          alt={`Image ${index + 1}`}
                          className="w-full rounded-md shadow-sm border border-gray-200"
                          onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200"></div>
              </>
            )}

            {/* Generate More Button */}
            <div className="p-4">
              <button
                onClick={onGenerateMore}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-3 flex items-center justify-center transition-colors"
                aria-label="Generate More Content"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate More Content
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .prose h1 {
          font-size: 2.5rem;
          margin-top: 3rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }
        .prose h2 {
          font-size: 2rem;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
        }
        .prose h3 {
          font-size: 1.75rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose p {
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          line-height: 1.75;
        }
        .prose ul {
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .prose li {
          margin-bottom: 0.75rem;
        }
        .prose a {
          color: #2563eb;
          text-decoration: underline;
          transition: color 0.2s;
        }
        .prose a:hover {
          color: #1e40af;
        }
        .prose img {
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        @media (max-width: 768px) {
          .prose h1 {
            font-size: 2rem;
          }
          .prose h2 {
            font-size: 1.75rem;
          }
          .prose h3 {
            font-size: 1.5rem;
          }
          .prose p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

