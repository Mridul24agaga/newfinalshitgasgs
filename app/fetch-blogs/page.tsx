'use client';

import { useEffect, useState } from 'react';

type Blog = {
  id: string;
  user_id: string;
  blog_post: string;
};

export default function FetchBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [headlineBlogs, setHeadlineBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const apiKey = 'your-api-key'; // Replace this with your API Key

      if (!apiKey) {
        console.error('API Key missing');
        return;
      }

      const response = await fetch('http://localhost:3000/api/fetch-blogs', {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
        },
      });

      const json = await response.json();
      if (response.ok) {
        setBlogs(json.blogs || []);
        setHeadlineBlogs(json.headlineBlogs || []);
      } else {
        console.error(json.error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      <h2>Blogs</h2>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>{blog.blog_post}</li>
        ))}
      </ul>

      <h2>Headline Blogs</h2>
      <ul>
        {headlineBlogs.map((headline) => (
          <li key={headline.id}>{headline.blog_post}</li>
        ))}
      </ul>
    </div>
  );
}
