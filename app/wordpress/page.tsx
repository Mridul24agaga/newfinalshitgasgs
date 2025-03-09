"use client"; // Marks this as a Client Component

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const createPost = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Send POST request to our API route
      const response = await axios.post("/api/create-post", {
        title: "My Next.js Post",
        content: "Posted from my Next.js app with WordPress REST API, man!",
      });

      setMessage(`Success! Post created: ${response.data.link}`);
    } catch (error: any) {
      setMessage(
        `Error: ${error.response?.data?.error || error.message || "Something went wrong"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-blue-800">
        WordPress Post Creator
      </h1>
      <button
        onClick={createPost}
        disabled={loading}
        className={`px-6 py-3 rounded-lg text-white font-semibold ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        } transition-colors`}
      >
        {loading ? "Creating..." : "Create Post"}
      </button>
      {message && (
        <p className="mt-6 text-lg text-center max-w-lg text-gray-700">
          {message}
        </p>
      )}
    </main>
  );
}