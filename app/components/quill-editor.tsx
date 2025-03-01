"use client"

import type React from "react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
})

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  modules?: any
  formats?: string[]
  className?: string
}

export const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange, modules, formats, className }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <ReactQuill value={value} onChange={onChange} modules={modules} formats={formats} className={className} />
      <style jsx global>{`
        .ql-container {
          min-height: 600px;
        }
      `}</style>
    </>
  )
}

