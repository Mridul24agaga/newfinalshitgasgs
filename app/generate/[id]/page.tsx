"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/utitls/supabase/client"

interface BlogPost {
  id: string
  user_id: string
  blog_post: string
  citations: string[]
  created_at: string
  title: string
  timestamp: string
  reveal_date: string
  url: string | null
}

export default function GeneratedBlogPost() {
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (id) {
      fetchPost(id as string)
    }
  }, [id])

  const fetchPost = async (postId: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("Please log in to view this post.")
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("headlinetoblog")
        .select("*")
        .eq("id", postId)
        .eq("user_id", user.id)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      if (!data) {
        throw new Error("Post not found or you don’t have access to it.")
      }

      setPost(data)
    } catch (err: any) {
      console.error("Error fetching post:", err.message)
      setError(`Failed to load post: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-saira">
        <p className="text-gray-700 text-lg">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-saira">
        <div className="bg-red-100 text-red-700 p-6 rounded-md max-w-lg text-center">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-saira">
        <p className="text-gray-700 text-lg">No post found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 font-saira">
      <header className="bg-gray-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="mt-2 text-gray-300">Generated Blog Post</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white p-6 rounded-lg shadow-md">
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.blog_post }}
          />
          {post.url && (
            <p className="mt-6 text-gray-600">
              Source Website:{" "}
              <a href={post.url} className="text-orange-600 underline hover:text-orange-700">
                {post.url}
              </a>
            </p>
          )}
          <div className="mt-6 text-gray-500 text-sm space-y-2">
            <p>Created on: {new Date(post.created_at).toLocaleString()}</p>
            <p>Reveal Date: {new Date(post.reveal_date).toLocaleString()}</p>
            {post.citations.length > 0 && (
              <div>
                <p className="font-semibold">Citations:</p>
                <ul className="list-disc pl-6">
                  {post.citations.map((citation, index) => (
                    <li key={index}>
                      <a href={citation} className="text-orange-600 underline hover:text-orange-700">
                        {citation}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>

        <div className="mt-6">
          <a
            href="/headlinetoblog"
            className="inline-block bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors duration-200"
          >
            Back to Generator
          </a>
        </div>
      </main>
    </div>
  )
}