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
  const apiKey = "080778d0c9454382a95d49ddb371cb09ee8902b22830d082ee87e2f62eaeb44d";

  // Function to properly format blog content with HTML tags
  const formatBlogContent = (content: string) => {
    if (!content) return "";

    console.log("Raw blog content:", content.slice(0, 500)); // Log first 500 chars for debugging

    // Step 1: Replace Runware image blocks
    content = content.replace(
      /<!-- IMAGE_BLOCK_START -->\n?<img\s+([^>]+)>\n?<!-- IMAGE_BLOCK_END -->/g,
      (match, imgAttributes) => {
        const srcMatch = imgAttributes.match(/src="([^"]*)"/);
        const altMatch = imgAttributes.match(/alt="([^"]*)"/);
        const src = srcMatch ? srcMatch[1] : "";
        const alt = altMatch ? altMatch[1] : "Blog image";
        console.log("Found Runware image block: src =", src, "alt =", alt);

        return `<div class="blog-image-container">
          <div class="relative w-full h-[400px] my-8">
            ${src ? `<img 
              src="${src}"
              alt="${alt}"
              class="rounded-lg object-cover w-full h-full"
            />` : ""}
          </div>
        </div>`;
      }
    );

    // Remove any unprocessed or malformed image blocks
    content = content.replace(
      /<!-- IMAGE_BLOCK_START -->[\s\S]*?<!-- IMAGE_BLOCK_END -->/g,
      (match) => {
        console.log("Removed unprocessed image block:", match.slice(0, 100));
        return "";
      }
    );

    // Format headings
    content = content.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
      if (p1.includes("How to Boost Your Backlink Strategy in Just 30 Days")) {
        return `<h1 class="text-3xl font-bold my-6 font-saira text-gray-800">${p1}</h1>`;
      }
      if (
        p1.startsWith("1.") ||
        p1.startsWith("2.") ||
        p1.startsWith("3.") ||
        p1.startsWith("4.") ||
        p1.startsWith("5.") ||
        p1.startsWith("6.") ||
        p1.startsWith("Conclusion") ||
        p1.startsWith("FAQ")
      ) {
        return `<h2 class="text-2xl font-bold my-5 font-saira text-gray-800">${p1}</h2>`;
      }
      return `<strong class="font-saira text-gray-800">${p1}</strong>`;
    });

    // Format lists
    content = content.replace(/- \*\*(.*?)\*\*: ([\s\S]*?)(?=(?:- \*\*|$))/g, (match, title, description) => {
      return `<div class="my-3">
        <strong class="block mb-1 font-saira text-gray-800">${title}:</strong>
        <p class="font-saira text-gray-700 leading-relaxed">${description.trim()}</p>
      </div>`;
    });

    // Format bullet points
    content = content.replace(/- (.*?)(?=(?:\n|$))/g, '<li class="ml-6 list-disc my-2 font-saira text-gray-700 leading-relaxed">$1</li>');

    // Wrap lists in ul tags
    content = content.replace(
      /<li class="ml-6 list-disc my-2 font-saira text-gray-700 leading-relaxed">(.*?)<\/li>\n<li class="ml-6 list-disc my-2 font-saira text-gray-700 leading-relaxed">/g,
      '<ul class="my-4 list-disc pl-6 space-y-1">\n<li class="ml-6 list-disc my-2 font-saira text-gray-700 leading-relaxed">$1</li>\n<li class="ml-6 list-disc my-2 font-saira text-gray-700 leading-relaxed">',
    );
    content = content.replace(
      /<li class="ml-6 list-disc my-2 font-saira text-gray-700 leading-relaxed">(.*?)<\/li>\n(?!<li)/g,
      '<li class="ml-6 list-disc my-2 font-saira text-gray-700 leading-relaxed">$1</li>\n</ul>\n',
    );

    // Format paragraphs
    const lines = content.split("\n");
    let formattedContent = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (
        line &&
        !line.startsWith("<h") &&
        !line.startsWith("<ul") &&
        !line.startsWith("<li") &&
        !line.startsWith("<div") &&
        !line.startsWith("<p") &&
        !line.startsWith("</")
      ) {
        formattedContent += `<p class="my-4 font-saira text-gray-700 leading-relaxed">${line}</p>\n`;
      } else {
        formattedContent += line + "\n";
      }
    }

    // Format Q&A in FAQ section
    formattedContent = formattedContent.replace(
      /\*\*Q\d+: (.*?)\*\*/g,
      '<h3 class="text-xl font-semibold mt-6 mb-2 font-saira text-gray-800">$1</h3>',
    );

    console.log("Formatted content preview:", formattedContent.slice(0, 500));
    return formattedContent;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user-data", {
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
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem", color: "#333" }}>
        Your Blogs
      </h1>
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

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
            <h2
              style={{
                fontSize: "1.25rem",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#333",
                fontFamily: "'Saira', sans-serif",
              }}
            >
              {b.title}
            </h2>
            <div
              className={`
                prose prose-gray max-w-none
                prose-headings:font-saira prose-headings:text-gray-800
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:font-saira
                prose-a:text-orange-600 prose-a:underline prose-a:hover:text-orange-700 prose-a:transition-colors prose-a:duration-200
                prose-strong:font-bold prose-strong:text-gray-800 prose-strong:font-saira
                prose-img:w-full prose-img:rounded-lg prose-img:max-w-full prose-img:h-[400px]
                prose-figure:my-6 prose-figure:mx-auto prose-figure:max-w-full
                prose-figcaption:text-sm prose-figcaption:text-center prose-figcaption:text-gray-500 prose-figcaption:mt-2 prose-figcaption:font-saira
                prose-iframe:w-full prose-iframe:rounded-lg
                prose-ul:pl-6 prose-ul:my-6 prose-ul:space-y-1
                prose-li:flex prose-li:items-start prose-li:mb-4 prose-li:text-gray-700 prose-li:leading-relaxed prose-li:font-saira
                prose-table:table prose-table:w-full prose-table:border-collapse prose-table:bg-white prose-table:text-gray-800
                prose-th:border prose-th:border-gray-200 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:bg-gray-100 prose-th:font-saira
                prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-2 prose-td:font-saira
              `}
              dangerouslySetInnerHTML={{ __html: formatBlogContent(b.blog_post) }}
            />
          </div>
        ))}
      </div>

      <h1
        style={{
          marginTop: "3rem",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "2rem",
          color: "#333",
        }}
      >
        Headlines
      </h1>
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
            <h3
              style={{
                fontSize: "1.1rem",
                marginBottom: "0.5rem",
                fontWeight: "bold",
                color: "#333",
                fontFamily: "'Saira', sans-serif",
              }}
            >
              {h.headline}
            </h3>
            <div
              className={`
                prose prose-gray max-w-none
                prose-headings:font-saira prose-headings:text-gray-800
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:font-saira
                prose-a:text-orange-600 prose-a:underline prose-a:hover:text-orange-700 prose-a:transition-colors prose-a:duration-200
                prose-strong:font-bold prose-strong:text-gray-800 prose-strong:font-saira
                prose-img:w-full prose-img:rounded-lg prose-img:max-w-full prose-img:h-[400px]
                prose-figure:my-6 prose-figure:mx-auto prose-figure:max-w-full
                prose-figcaption:text-sm prose-figcaption:text-center prose-figcaption:text-gray-500 prose-figcaption:mt-2 prose-figcaption:font-saira
                prose-iframe:w-full prose-iframe:rounded-lg
                prose-ul:pl-6 prose-ul:my-6 prose-ul:space-y-1
                prose-li:flex prose-li:items-start prose-li:mb-4 prose-li:text-gray-700 prose-li:leading-relaxed prose-li:font-saira
                prose-table:table prose-table:w-full prose-table:border-collapse prose-table:bg-white prose-table:text-gray-800
                prose-th:border prose-th:border-gray-200 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:bg-gray-100 prose-th:font-saira
                prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-2 prose-td:font-saira
              `}
              dangerouslySetInnerHTML={{ __html: formatBlogContent(h.blog_text) }}
            />
          </div>
        ))}
      </div>

      {/* Inline CSS for additional styling */}
      <style jsx>{`
        .blog-image-container {
          display: block !important;
          visibility: visible !important;
          margin: 2rem 0;
        }
        .blog-image {
          display: block !important;
          visibility: visible !important;
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}