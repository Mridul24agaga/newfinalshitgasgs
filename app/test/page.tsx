// app/page.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

interface Blog {
  id: string;
  blog_post: string;
}

interface ApiResponse {
  blogs?: Blog[];
  api_key?: string;
  error?: string;
  message?: string;
  details?: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-url.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"
);

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(`Login failed: ${error.message}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }, [email, password]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setApiKey("");
    setBlogs([]);
  }, []);

  const generateApiKey = useCallback(async () => {
    if (!user) {
      setError("Please log in to generate an API key");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("No valid session");

      const response = await fetch("http://localhost:3000/api/generate-api-key", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(`${result.error || "Failed to generate API key"}: ${result.details || ""}`);
      }

      setApiKey(result.api_key || "");
      alert(`New API key: ${result.api_key}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchBlogs = useCallback(async () => {
    if (!apiKey.trim()) {
      setError("Please enter a valid API key");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/fetch-blogs", {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
        },
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(`${result.error || "Failed to fetch blogs"}: ${result.details || ""}`);
      }

      setBlogs(result.blogs || []);
      if (!result.blogs || result.blogs.length === 0) {
        setError(result.message || "No blogs found for this API key");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong!");
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  return (
    <div className="container">
      <h1>Blog Fetcher</h1>

      {!user ? (
        <section>
          <h2>Log In</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            placeholder="Email"
            disabled={isLoading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isLoading}
          />
          <button onClick={handleLogin} disabled={isLoading || !email || !password}>
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </section>
      ) : (
        <section>
          <h2>Welcome, {user.email}</h2>
          <button onClick={generateApiKey} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate API Key"}
          </button>
          <button onClick={handleLogout} disabled={isLoading}>
            Log Out
          </button>
        </section>
      )}

      <section>
        <h2>Fetch Blogs</h2>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value.trim())}
          placeholder="Enter API key"
          disabled={isLoading}
        />
        <button onClick={fetchBlogs} disabled={isLoading || !apiKey.trim()}>
          {isLoading ? "Fetching..." : "Fetch Blogs"}
        </button>
      </section>

      {error && <div className="error">{error}</div>}

      {blogs.length > 0 ? (
        <section>
          <h2>Blogs</h2>
          <ul>
            {blogs.map((blog) => (
              <li key={blog.id}>{blog.blog_post}</li>
            ))}
          </ul>
        </section>
      ) : (
        !isLoading && <p>No blogs found.</p>
      )}

      {isLoading && <p>Loading...</p>}

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        h1, h2 {
          text-align: center;
        }
        section {
          margin-bottom: 20px;
        }
        input, button {
          display: block;
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        button {
          background-color: #0070f3;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        button:hover:not(:disabled) {
          background-color: #005bb5;
        }
        .error {
          color: red;
          text-align: center;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }
      `}</style>
    </div>
  );
}