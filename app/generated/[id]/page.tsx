"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CustomEditor from "@/app/components/CustomEditor";
import { createClient } from "@/utitls/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function GeneratedBlogPage() {
  const params = useParams();
  const [blogPost, setBlogPost] = useState<string>("");
  const [citations, setCitations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [posting, setPosting] = useState<boolean>(false);
  const [wordpressPostId, setWordpressPostId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
          setError("Authentication required");
          setBlogPost("<p>Please log in to continue.</p>");
          setCitations([]);
          router.push("/auth");
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("blogs")
          .select("blog_post, citations, title, reveal_date, wordpress_post_id")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single();

        if (fetchError || !data) {
          setError("Blog not found");
          setBlogPost("<p>This blog post could not be found.</p>");
          setCitations([]);
        } else {
          console.log("Raw data fetched:", data);
          console.log("Raw citations:", data.citations, "Type:", typeof data.citations);

          setBlogPost(data.blog_post);
          setWordpressPostId(data.wordpress_post_id || null);

          let parsedCitations: string[] = [];
          if (typeof data.citations === "string") {
            try {
              parsedCitations = JSON.parse(data.citations);
              if (!Array.isArray(parsedCitations)) {
                parsedCitations = [data.citations];
              }
            } catch (parseError) {
              console.warn("Citations parsing failed, treating as plain string:", parseError);
              parsedCitations = data.citations.split(",").map((item: string) => item.trim());
            }
          } else if (Array.isArray(data.citations)) {
            parsedCitations = data.citations;
          } else {
            console.warn("Unexpected citations format:", data.citations);
            parsedCitations = [];
          }

          setCitations(parsedCitations);
        }
      } catch (err: unknown) {
        console.error(`Error fetching blog: ${err instanceof Error ? err.message : String(err)}`);
        setError("Failed to load blog");
        setBlogPost("<p>An error occurred while loading the blog.</p>");
        setCitations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id, router, supabase]);

  const handleContentChange = async (newContent: string) => {
    setBlogPost(newContent);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from("blogs")
          .update({ blog_post: newContent })
          .eq("id", params.id)
          .eq("user_id", user.id);

        if (error) {
          console.error(`Failed to update blog: ${error.message}`);
        }
      }
    } catch (err: unknown) {
      console.error(`Error saving blog: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleGenerateMore = async () => {
    console.log("Generate More clicked");
  };

  const handlePostToWordpress = async () => {
    setPosting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Authentication required");
        return;
      }

      const { data: blogData } = await supabase
        .from("blogs")
        .select("id, user_id, blog_post, citations, created_at, title, timestamp, reveal_date, url")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single();

      if (!blogData) {
        setError("Blog not found for posting");
        return;
      }

      const results = await postBlogsToWordpress([blogData]);
      const result = results[0];

      if (result.wpPostId) {
        setWordpressPostId(result.wpPostId);
        setError(null);
        console.log(`Posted to WordPress! Post ID: ${result.wpPostId}`);
      } else {
        setError("Failed to post to WordPress");
      }
    } catch (err: unknown) {
      console.error(`Error posting to WordPress: ${err instanceof Error ? err.message : String(err)}`);
      setError("Failed to post to WordPress");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <p className="text-gray-600">Please try again later.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
          <div className="space-x-2">
            {wordpressPostId ? (
              <span className="text-green-600 text-sm">Posted to WordPress (ID: {wordpressPostId})</span>
            ) : (
              <button
                onClick={handlePostToWordpress}
                disabled={posting}
                className={`px-4 py-2 text-sm rounded-lg ${
                  posting
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {posting ? "Posting..." : "Post to WordPress"}
              </button>
            )}
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        <CustomEditor
          initialValue={blogPost}
          onChange={handleContentChange}
          images={[]}
          onGenerateMore={handleGenerateMore}
          citations={citations}
        />
      </div>
    </div>
  );
}