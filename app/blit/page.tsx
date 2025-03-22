"use client"

import { useEffect, useState } from "react";

type Blog = {
  id: string;
  title: string;
  content: string;
};

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const apiKey = "568feb6f19a409d73c11de7e3ce5cd702aca55a4590f5ccd9c4f89e92ec1c6a9"; // Replace with actual API key

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
