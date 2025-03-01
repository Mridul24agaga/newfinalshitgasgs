"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utitls/supabase/client"

interface IdeaEntry {
  id: string
  topic: string
  description: string
  tags: string[]
  youtube_videos: string[]
  reddit_links: string[]
  quora_links: string[]
  document_links: string[]
  source_type: string
}

export default function IdeasDatabasePage() {
  const [ideas, setIdeas] = useState<IdeaEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newIdea, setNewIdea] = useState<Partial<IdeaEntry>>({
    topic: "",
    description: "",
    tags: [],
    youtube_videos: [],
    reddit_links: [],
    quora_links: [],
    document_links: [],
    source_type: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    try {
      setLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Please sign in to access ideas database")
      }

      const { data, error } = await supabase
        .from("ideas_database")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setIdeas(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addIdea = async () => {
    try {
      setError(null)

      if (!newIdea.topic) {
        throw new Error("Topic is required")
      }

      const { data, error } = await supabase.from("ideas_database").insert([newIdea]).select()

      if (error) throw error

      setIdeas([...(data || []), ...ideas])
      setNewIdea({
        topic: "",
        description: "",
        tags: [],
        youtube_videos: [],
        reddit_links: [],
        quora_links: [],
        document_links: [],
        source_type: "",
      })
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deleteIdea = async (id: string) => {
    try {
      setError(null)

      const { error } = await supabase.from("ideas_database").delete().eq("id", id)

      if (error) throw error

      setIdeas(ideas.filter((idea) => idea.id !== id))
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="ml-2 text-lg">Loading ideas database...</span>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10 px-4">
      <h1 className="mb-8 text-4xl font-bold">Ideas Database</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="mb-8 space-y-6 rounded-lg border p-6">
        <h2 className="text-2xl font-semibold">Add New Idea</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Topic</label>
            <input
              type="text"
              value={newIdea.topic}
              onChange={(e) => setNewIdea((prev) => ({ ...prev, topic: e.target.value }))}
              placeholder="Enter topic"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={newIdea.description}
              onChange={(e) => setNewIdea((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Source Type</label>
            <select
              value={newIdea.source_type}
              onChange={(e) => setNewIdea((prev) => ({ ...prev, source_type: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select source type</option>
              <option value="youtube">YouTube</option>
              <option value="reddit">Reddit</option>
              <option value="quora">Quora</option>
              <option value="document">Document</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">YouTube Videos (one per line)</label>
            <textarea
              value={newIdea.youtube_videos?.join("\n")}
              onChange={(e) =>
                setNewIdea((prev) => ({
                  ...prev,
                  youtube_videos: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="Enter YouTube video URLs"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Reddit Links (one per line)</label>
            <textarea
              value={newIdea.reddit_links?.join("\n")}
              onChange={(e) =>
                setNewIdea((prev) => ({
                  ...prev,
                  reddit_links: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="Enter Reddit post URLs"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Quora Links (one per line)</label>
            <textarea
              value={newIdea.quora_links?.join("\n")}
              onChange={(e) =>
                setNewIdea((prev) => ({
                  ...prev,
                  quora_links: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="Enter Quora question URLs"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Document Links (one per line)</label>
            <textarea
              value={newIdea.document_links?.join("\n")}
              onChange={(e) =>
                setNewIdea((prev) => ({
                  ...prev,
                  document_links: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="Enter document URLs"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Tags (comma-separated)</label>
            <input
              type="text"
              value={newIdea.tags?.join(", ")}
              onChange={(e) =>
                setNewIdea((prev) => ({
                  ...prev,
                  tags: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="Enter tags"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={addIdea}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Idea
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Existing Ideas</h2>

        {ideas.length === 0 ? (
          <p className="text-gray-500">No ideas added yet.</p>
        ) : (
          ideas.map((idea) => (
            <div key={idea.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{idea.topic}</h3>
                  <p className="text-gray-600">{idea.description}</p>

                  {idea.tags && idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {idea.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {idea.youtube_videos && idea.youtube_videos.length > 0 && (
                    <div className="mt-2">
                      <strong>YouTube Videos:</strong>
                      <ul className="ml-4 list-disc">
                        {idea.youtube_videos.map((url, index) => (
                          <li key={index}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {idea.reddit_links && idea.reddit_links.length > 0 && (
                    <div className="mt-2">
                      <strong>Reddit Links:</strong>
                      <ul className="ml-4 list-disc">
                        {idea.reddit_links.map((url, index) => (
                          <li key={index}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {idea.quora_links && idea.quora_links.length > 0 && (
                    <div className="mt-2">
                      <strong>Quora Links:</strong>
                      <ul className="ml-4 list-disc">
                        {idea.quora_links.map((url, index) => (
                          <li key={index}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {idea.document_links && idea.document_links.length > 0 && (
                    <div className="mt-2">
                      <strong>Document Links:</strong>
                      <ul className="ml-4 list-disc">
                        {idea.document_links.map((url, index) => (
                          <li key={index}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button onClick={() => deleteIdea(idea.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

