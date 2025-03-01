"use client"

import type React from "react"
import { Editor } from "@tinymce/tinymce-react"

interface TinyMCEEditorProps {
  initialValue: string
  onChange: (content: string) => void
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ initialValue, onChange }) => {
  return (
    <Editor
      apiKey="your-tinymce-api-key" // Replace with your actual TinyMCE API key
      initialValue={initialValue}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | " +
          "bold italic backcolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style: `
          body { font-family:Helvetica,Arial,sans-serif; font-size:14px }
          h1 { font-size: 24px; margin-bottom: 16px; }
          h2 { font-size: 20px; margin-top: 24px; margin-bottom: 16px; }
          p { margin-bottom: 16px; line-height: 1.6; }
          ul { margin-bottom: 16px; padding-left: 20px; }
          li { margin-bottom: 8px; }
        `,
        formats: {
          h1: { block: "h1", classes: "text-3xl font-bold mb-4" },
          h2: { block: "h2", classes: "text-2xl font-semibold mt-6 mb-4" },
          p: { block: "p", classes: "mb-4" },
          ul: { block: "ul", classes: "list-disc pl-5 mb-4" },
          li: { block: "li", classes: "mb-2" },
        },
      }}
      onEditorChange={onChange}
    />
  )
}

export default TinyMCEEditor

