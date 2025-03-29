import type React from "react"
import ReactMarkdown from "react-markdown"

type ContentFormat = "html" | "markdown" | "auto"

interface ContentRendererProps {
  content: string
  format?: ContentFormat
  className?: string
}

// Function to detect if content is likely HTML
const isLikelyHtml = (content: string): boolean => {
  // Simple check for HTML tags
  return /<[a-z][\s\S]*>/i.test(content)
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ content, format = "auto", className = "" }) => {
  // Determine the format if set to auto
  const contentFormat = format === "auto" ? (isLikelyHtml(content) ? "html" : "markdown") : format

  if (contentFormat === "html") {
    return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
  } else {
    return <ReactMarkdown className={className}>{content}</ReactMarkdown>
  }
}

// Export a simple function version for use in components
export const renderContent = (content: string, format: ContentFormat = "auto", className = "") => {
  return <ContentRenderer content={content} format={format} className={className} />
}

