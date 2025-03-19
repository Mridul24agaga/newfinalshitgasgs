"use client"

import { useEffect, useState } from "react";

type Blog = {
  id: string;
  title: string;
  content: string;
};

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const apiKey = "4d5bc2d1afaf832f2f76b55495a0082bbb91c080256d8b50aea5b59dcf99501d"; // Replace with actual API key

  useEffect(() => {
    fetch("http://localhost:3000/api/user-blogs", {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
      .then((res) => res.json())
      .then((data: Blog[]) => setBlogs(data)); // Tell TypeScript this is an array of `Blog`
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
