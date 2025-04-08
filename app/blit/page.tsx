"use client";

import { useEffect, useState } from "react";

type Blog = {
  id: string;
  title: string;
  blog_post: string;
};

type HeadlineToBlog = {
  id: string;
  headline: string;
  blog_text: string;
};

export default function BlogFetcher() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [headlines, setHeadlines] = useState<HeadlineToBlog[]>([]);
  const [error, setError] = useState("");
  const apiKey = "YOUR_ABOVE_GENERATED_API_KEY";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/user-data", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          setError(errData?.error || "Something went wrong.");
          return;
        }

        const data = await res.json();
        setBlogs(data.blogs || []);
        setHeadlines(data.headlinetoblog || []);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Unexpected error occurred.");
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Your Blogs</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {blogs.map((b) => (
          <div
            key={b.id}
            style={{
              backgroundColor: "#f9f9f9",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{b.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: b.blog_post }} />
          </div>
        ))}
      </div>

      <h1 style={{ marginTop: "3rem" }}>Headlines</h1>
      <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {headlines.map((h) => (
          <div
            key={h.id}
            style={{
              backgroundColor: "#e6f0ff",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{h.headline}</h3>
            <div dangerouslySetInnerHTML={{ __html: h.blog_text }} />
          </div>
        ))}
      </div>
    </div>
  );
}
