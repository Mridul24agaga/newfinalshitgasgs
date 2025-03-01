"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utitls/supabase/client";

export default function CompanyDatabasePage() {
  const router = useRouter();
  const supabase = createClient();

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px", fontWeight: "bold", color: "#333" }}>
        Brand & Blog Setup
      </h1>
      <p style={{ marginBottom: "20px" }}>
        Add your brand, blog preferences, and content ideas to generate blogs, tied to your account!
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <button
          onClick={() => router.push("/company-database/brand")}
          style={{
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Go to Brand Profile
        </button>
        <button
          onClick={() => router.push("/company-database/blog")}
          style={{
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Go to Blog Preferences
        </button>
        <button
          onClick={() => router.push("/company-database/ideas")}
          style={{
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Go to Content Ideas
        </button>
      </div>
    </div>
  );
}