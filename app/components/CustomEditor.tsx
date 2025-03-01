"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
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

  // Convert Markdown to HTML on mount or value change
  useEffect(() => {
    const htmlContent = convertMarkdownToHtml(value)
    if (editorRef.current) {
      editorRef.current.innerHTML = htmlContent
      setEditorContent(htmlContent)
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      setEditorContent(newContent)
      onChange(newContent) // Pass HTML back to parent
    }
  }

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value)
    handleInput()
  }

  // Simplified Markdown to HTML converter
  const convertMarkdownToHtml = (markdown: string) => {
    return markdown
      .split("\n")
      .map((line) => {
        if (line.startsWith("# ")) {
          return `<h1 class="text-4xl font-bold mt-8 mb-4">${line.slice(2)}</h1>`
        } else if (line.startsWith("## ")) {
          return `<h2 class="text-3xl font-bold mt-6 mb-3">${line.slice(3)}</h2>`
        } else if (line.startsWith("### ")) {
          return `<h3 class="text-2xl font-bold mt-5 mb-2">${line.slice(4)}</h3>`
        } else if (line.match(/^\s*[-*+]\s/)) {
          return `<ul class="ml-6 mb-4"><li class="mb-2">${line.replace(/^\s*[-*+]\s/, "")}</li></ul>`
        } else if (line.trim()) {
          return `<p class="text-base leading-relaxed mb-4">${line}</p>`
        } else {
          return "<br>"
        }
      })
      .join("")
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-md">
      <div className="bg-gray-50 border-b border-gray-200 p-3 flex flex-wrap gap-2">
        <button
          onClick={() => execCommand("bold")}
          className="p-2 hover:bg-gray-200 rounded-md text-gray-700 hover:text-gray-900 transition-colors"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => execCommand("italic")}
          className="p-2 hover:bg-gray-200 rounded-md text-gray-700 hover:text-gray-900 transition-colors"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => execCommand("underline")}
          className="p-2 hover:bg-gray-200 rounded-md text-gray-700 hover:text-gray-900 transition-colors"
          title="Underline"
        >
          <u>U</u>
        </button>
        <button
          onClick={() => execCommand("insertOrderedList")}
          className="p-2 hover:bg-gray-200 rounded-md text-gray-700 hover:text-gray-900 transition-colors"
          title="Ordered List"
        >
          OL
        </button>
        <button
          onClick={() => execCommand("insertUnorderedList")}
          className="p-2 hover:bg-gray-200 rounded-md text-gray-700 hover:text-gray-900 transition-colors"
          title="Unordered List"
        >
          UL
        </button>
        <button
          onClick={() => {
            const url = prompt("Enter URL:")
            if (url) execCommand("createLink", url)
          }}
          className="p-2 hover:bg-gray-200 rounded-md text-gray-700 hover:text-gray-900 transition-colors"
          title="Insert Link"
        >
          Link
        </button>
        <select
          onChange={(e) => execCommand("formatBlock", e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={`p-6 min-h-[700px] focus:outline-none text-gray-800 prose max-w-none ${className}`}
      />
    </div>
  )
}

export default function CustomEditor({ initialValue, onChange, images, onGenerateMore, citations }: CustomEditorProps) {
  const [content, setContent] = useState(initialValue) // Expect Markdown from server
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([])
  const router = useRouter()

  useEffect(() => {
    setContent(initialValue)
    generateTableOfContents(initialValue)
  }, [initialValue])

  const handleContentChange = (value: string) => {
    setContent(value) // Store HTML as edited
    onChange(value) // Pass HTML back to parent
    generateTableOfContents(value)
  }

  const generateTableOfContents = (htmlContent: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, "text/html")
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const tocItems = Array.from(headings).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent || "",
      level: Number(heading.tagName[1]),
    }))
    setToc(tocItems)
  }

  const wordCount = useMemo(() => {
    const plainText = content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
    return plainText.split(/\s+/).filter(Boolean).length
  }, [content])

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Content Editor</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm border border-gray-300 rounded-md flex items-center space-x-2 hover:bg-gray-50 text-gray-700 transition-colors">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Publish
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <CustomRichEditor value={content} onChange={handleContentChange} />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
              <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                <List className="h-5 w-5 mr-2 text-blue-500" />
                Table of Contents
              </h2>
              <div className="max-h-[250px] overflow-y-auto pr-2">
                <nav>
                  <ul className="space-y-2">
                    {toc.length > 0 ? (
                      toc.map((item) => (
                        <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 16}px` }} className="text-sm">
                          <a
                            href={`#${item.id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            {item.text}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500 italic">No headings yet</li>
                    )}
                  </ul>
                </nav>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Content Score</h2>
              <div className="flex items-center justify-between mb-2">
                <div className="text-4xl font-bold text-blue-600">74</div>
                <div className="text-sm text-gray-400 font-medium">/100</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "74%" }}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
              <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
                Metrics
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Words</span>
                  <span className="text-sm font-semibold text-gray-800">{wordCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Headings</span>
                  <span className="text-sm font-semibold text-gray-800">{toc.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Paragraphs</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {(content.match(/<p[^>]*>/g) || []).length}
                  </span>
                </div>
              </div>
            </div>

            {citations.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
                <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                  Citations
                </h2>
                <div className="max-h-[200px] overflow-y-auto pr-2">
                  <ul className="space-y-3 text-sm text-gray-600">
                    {citations.map((citation, index) => (
                      <li key={index} className="line-clamp-2 hover:text-blue-600 transition-colors">
                        <a href={citation} target="_blank" rel="noopener noreferrer">
                          {citation}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <button
              onClick={onGenerateMore}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg py-3 px-4 flex items-center justify-center shadow-md transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Generate More
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

