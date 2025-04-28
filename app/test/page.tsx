"use client"

import { useState } from 'react';

const TestFetchBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    const apiKey = '1b4551b3-ea52-44ff-97fd-92f1958c7410'; // Use the API key you generated
    
    try {
      const response = await fetch('/api/fetch-blogs', {
        method: 'GET',
        headers: {
          'x-api-key': apiKey, // Send API key in headers
        },
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setBlogs(result.blogs); // Set blogs if successful
        setError(null); // Clear error if successful
      } else {
        setBlogs([]); // Clear blogs if error occurred
        setError(result.error || 'Failed to fetch blogs'); // Show the error message
      }
    } catch (error) {
      setError('Something went wrong!');
      setBlogs([]); // Clear any existing blogs
    }
  };

  return (
    <div>
      <button onClick={fetchBlogs}>Fetch Blogs</button>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {blogs.length > 0 ? (
        <ul>
          {blogs.map((blog: { id: string; blog_post: string }) => (
            <li key={blog.id}>{blog.blog_post}</li>
          ))}
        </ul>
      ) : (
        <p>No blogs found or an error occurred.</p>
      )}
    </div>
  );
};

export default TestFetchBlogs;
