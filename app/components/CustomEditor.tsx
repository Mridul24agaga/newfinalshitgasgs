"use client"

// Formatting utility
const formatUtils = {
  convertMarkdownToHtml: (markdown: string) => {
    let html = markdown
      // Headers with consistent, non-bold styling where appropriate
      .replace(/^###### (.*$)/gim, '<h6 class="text-lg font-semibold mt-6 mb-3">$1</h6>')
      .replace(/^##### (.*$)/gim, '<h5 class="text-xl font-semibold mt-6 mb-3">$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-2xl font-semibold mt-8 mb-4">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="text-3xl font-bold mt-10 mb-5 text-gray-800">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-4xl font-bold mt-12 mb-6 text-gray-900">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-5xl font-bold mt-14 mb-8 text-gray-900 border-b pb-4">$1</h1>')
      // Text formatting (use normal weight, not bold, unless explicitly strong)
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      // Lists (now handling bullet points for bold button, with line gaps)
      .replace(/^- (.*)$/gim, '<li class="ml-6 mb-4 list-disc text-gray-700 font-normal">$1</li>')
      .replace(/^[*] (.*)$/gim, '<li class="ml-6 mb-4 list-disc text-gray-700 font-normal">$1</li>')
      .replace(/(<li.*?>.*<\/li>)/gim, '<ul class="my-6">$1</ul>')
      // Paragraphs (normal font, not bold, with line gaps)
      .replace(/\n{2,}/g, '</p><p class="mt-6 mb-6 text-gray-700 leading-relaxed font-normal">')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:underline font-normal">$1</a>')
      // Blockquotes
      .replace(/^>\s+(.*)$/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6 font-normal">$1</blockquote>')
    
    // Wrap loose text in paragraphs with line gaps
    html = `<p class="mt-6 mb-6 text-gray-700 leading-relaxed font-normal">${html}</p>`
    return html
  },

  sanitizeHtml: (html: string) => {
    // Ensure consistent styling, remove bold where not intended
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    
    doc.querySelectorAll('p, li, a, blockquote').forEach(el => {
      el.classList.remove('font-bold') // Remove any unwanted bold
      el.classList.add('font-normal') // Ensure normal font weight
    })
    doc.querySelectorAll('p').forEach(p => {
      p.classList.add('mt-6', 'mb-6', 'text-gray-700', 'leading-relaxed') // Line gaps
    })
    doc.querySelectorAll('ul').forEach(ul => {
      ul.classList.add('my-6') // Line gaps
    })
    doc.querySelectorAll('li').forEach(li => {
      li.classList.add('ml-6', 'mb-4', 'list-disc', 'text-gray-700', 'font-normal') // Line gaps
    })
    doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
      h.classList.remove('font-bold') // Remove bold from headers unless explicitly needed
      if (h.tagName === 'H1') h.classList.add('font-bold')
      if (h.tagName === 'H2') h.classList.add('font-bold') // Keep H2 as font-bold
      if (h.tagName === 'H3') h.classList.add('font-bold') // Keep H3 as font-bold
    })
    
    return doc.body.innerHTML
  },

  generateToc: (htmlContent: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, "text/html")
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6")
    return Array.from(headings).map((h, i) => {
      h.id = `heading-${i}`
      return {
        id: `heading-${i}`,
        text: h.textContent || "",
        level: Number(h.tagName[1]),
      }
    })
  }
}

import React, { useState, useEffect, useMemo, useRef } from "react"
import { ArrowLeft, Share2, List, BookOpen, BarChart2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface CustomEditorProps {
  initialValue: string
  onChange: (newContent: string) => void
  images: string[]
  onGenerateMore: () => void
  citations: string[]
}

const CustomRichEditor: React.FC<{
  value: string
  onChange: (value: string) => void
  className?: string
}> = ({ value, onChange, className }) => {
  const [editorContent, setEditorContent] = useState(value)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const formattedHtml = value.startsWith('<')
      ? formatUtils.sanitizeHtml(value)
      : formatUtils.convertMarkdownToHtml(value)
    if (editorRef.current) {
      editorRef.current.innerHTML = formattedHtml
      setEditorContent(formattedHtml)
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = formatUtils.sanitizeHtml(editorRef.current.innerHTML)
      setEditorContent(newContent)
      onChange(newContent)
    }
  }

  const execCommand = (command: string, value?: string) => {
    if (command === "bold") {
      // Custom behavior: Convert selected text to bullet points (Markdown - or *) with line gaps
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const selectedText = range.toString().trim()
        if (selectedText) {
          const markdownBullet = `- ${selectedText}\n\n` // Add line gap with \n\n
          const newContent = editorContent.replace(
            range.toString(),
            markdownBullet
          )
          setEditorContent(newContent)
          onChange(formatUtils.convertMarkdownToHtml(newContent))
          // Clear selection to prevent further modifications
          selection.removeAllRanges()
        }
      }
    } else {
      // Default behavior for other commands
      document.execCommand(command, false, value)
      handleInput()
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-3 flex flex-wrap gap-3">
        {[
          { cmd: "bold", label: <strong className="font-semibold">B</strong>, title: "Bullet Points" }, // Updated title
          { cmd: "italic", label: <em>I</em>, title: "Italic" },
          { cmd: "underline", label: <u>U</u>, title: "Underline" },
          { cmd: "insertOrderedList", label: "OL", title: "Ordered List" },
          { cmd: "insertUnorderedList", label: "UL", title: "Unordered List" },
        ].map((btn) => (
          <button
            key={btn.cmd}
            onClick={() => execCommand(btn.cmd)}
            className="px-3 py-1.5 hover:bg-gray-200 rounded-md text-gray-700 hover:text-gray-900 transition-all"
            title={btn.title}
          >
            {btn.label}
          </button>
        ))}
        <button
          onClick={() => {
            const url = prompt("Enter URL:")
            if (url) execCommand("createLink", url)
          }}
          className="px-3 py-1.5 hover:bg-gray-200 rounded-md text-gray-700 hover:text-gray-900 transition-all"
          title="Insert Link"
        >
          Link
        </button>
        <select
          onChange={(e) => execCommand("formatBlock", e.target.value)}
          className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="p">Paragraph</option>
          {["h1", "h2", "h3", "h4", "h5", "h6"].map((h) => (
            <option key={h} value={h}>{`Heading ${h[1]}`}</option>
          ))}
        </select>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={`p-8 min-h-[800px] focus:outline-none prose prose-lg max-w-none ${className}`}
      />
    </div>
  )
}

export default function CustomEditor({ initialValue, onChange, images, onGenerateMore, citations }: CustomEditorProps) {
  const [content, setContent] = useState(initialValue)
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([])
  const router = useRouter()

  useEffect(() => {
    const formattedContent = initialValue.startsWith('<')
      ? formatUtils.sanitizeHtml(initialValue)
      : formatUtils.convertMarkdownToHtml(initialValue)
    setContent(formattedContent)
    setToc(formatUtils.generateToc(formattedContent))
  }, [initialValue])

  const handleContentChange = (value: string) => {
    const sanitizedContent = formatUtils.sanitizeHtml(value)
    setContent(sanitizedContent)
    onChange(sanitizedContent)
    setToc(formatUtils.generateToc(sanitizedContent))
  }

  const metrics = useMemo(() => ({
    words: content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length,
    headings: toc.length,
    paragraphs: (content.match(/<p[^>]*>/g) || []).length,
    readingTime: Math.ceil(content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 200),
  }), [content, toc])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Content Editor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 text-gray-700 transition-all">
                <Share2 className="h-4 w-4" />
                <span>Share Draft</span>
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                Publish Post
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <CustomRichEditor value={content} onChange={handleContentChange} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <List className="h-5 w-5 mr-2 text-blue-600" />
                Table of Contents
              </h2>
              <nav className="max-h-[300px] overflow-y-auto">
                {toc.length > 0 ? (
                  <ul className="space-y-2">
                    {toc.map((item) => (
                      <li
                        key={item.id}
                        className={`text-sm ${item.level > 1 ? `ml-${(item.level - 1) * 4}` : ""}`}
                      >
                        <a
                          href={`#${item.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors block truncate"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No headings found</p>
                )}
              </nav>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-blue-600" />
                Content Metrics
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Word Count</span>
                  <span className="font-medium text-gray-900">{metrics.words}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Headings</span>
                  <span className="font-medium text-gray-900">{metrics.headings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paragraphs</span>
                  <span className="font-medium text-gray-900">{metrics.paragraphs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reading Time</span>
                  <span className="font-medium text-gray-900">{metrics.readingTime} min</span>
                </div>
              </div>
            </div>

            {citations.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  References
                </h2>
                <ul className="space-y-3 text-sm max-h-[200px] overflow-y-auto">
                  {citations.map((citation, index) => (
                    <li key={index}>
                      <a
                        href={citation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline line-clamp-2"
                      >
                        {citation}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {images.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
                <div className="space-y-4 max-h-[200px] overflow-y-auto">
                  {images.map((src, index) => (
                    <img key={index} src={src} alt={`Image ${index + 1}`} className="w-full rounded-md" />
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onGenerateMore}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 flex items-center justify-center shadow-md transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Generate More Content
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}