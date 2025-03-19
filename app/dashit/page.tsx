"use client"

import { useEffect, useState } from "react";

type Blog = {
  id: string;
  title: string;
  content: string;
};

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]); // Ensuring it's an array

  useEffect(() => {
    fetch("http://localhost:3000/api/user-blogs")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Data:", data); // 🔍 Debugging API Response

        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setBlogs(data);
        } else {
          console.error("API did not return an array:", data);
          setBlogs([]); // Prevents map() error
        }
      })
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  return (
    <div>
      <h1>Your Blogs</h1>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog.id}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
          </div>
        ))
      )}
    </div>
  );
}
