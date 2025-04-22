"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogGenerator from "./blog-content";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  citations: string[];
}

export default function Home() {
  const [generatedBlogs, setGeneratedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async (url: string, humanizeLevel: "normal" | "hardcore") => {
    setLoading(true);
    setError(null);
    setGeneratedBlogs([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, humanizeLevel }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate blog");
      }

      setGeneratedBlogs(data.blogPosts);

      const firstBlogId = data.blogPosts[0]?.id;
      if (firstBlogId) {
        router.push(`/generated/${firstBlogId}`);
      } else {
        throw new Error("No blog ID found in response");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <BlogGenerator />
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {generatedBlogs.length > 0 && !loading && (
        <div className="mt-8 w-full max-w-7xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Generated Blogs</h2>
          {generatedBlogs.map((blog) => (
            <div key={blog.id} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
              <div
                className="prose text-gray-700"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
              <p className="text-sm text-gray-500 mt-2">
                Generated on: {new Date(blog.timestamp).toLocaleString()}
              </p>
              {blog.citations.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold">Citations:</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {blog.citations.map((cite: string, idx: number) => (
                      <li key={idx}>{cite}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}