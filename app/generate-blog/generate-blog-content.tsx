"use client";

import { useState } from "react";

interface BlogGeneratorProps {
  onGenerate: (url: string, humanizeLevel: "normal" | "hardcore") => void;
  loading: boolean;
}

const BlogGenerator: React.FC<BlogGeneratorProps> = ({ onGenerate, loading }) => {
  const [url, setUrl] = useState("");
  const [humanizeLevel, setHumanizeLevel] = useState<"normal" | "hardcore">("normal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      alert("Please enter a valid URL");
      return;
    }
    onGenerate(url, humanizeLevel);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="url" className="block text-gray-700 font-semibold mb-2">
          Website URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Humanization Level</label>
        <select
          value={humanizeLevel}
          onChange={(e) => setHumanizeLevel(e.target.value as "normal" | "hardcore")}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="normal">Normal</option>
          <option value="hardcore">Hardcore</option>
        </select>
      </div>
      <button
        type="submit"
        className={`w-full py-2 px-4 text-white font-semibold rounded ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Blog"}
      </button>
    </form>
  );
};

export default BlogGenerator;