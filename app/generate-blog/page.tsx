"use client";

import { useState, useEffect } from "react";
import BlogGenerator from "./generate-blog-content";
import { createClient } from "@/utitls/supabase/client"; // Fixed typo in import path
import { generateBlog } from "@/app/actions";
import { GenerateBlogResult } from "@/app/actions";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const supabase = createClient();

  // Check if user has an active subscription
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setIsCheckingSubscription(true);

        // Get the current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.log("No authenticated user found");
          setHasActiveSubscription(false);
          return;
        }

        // Check the subscriptions table for an active subscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        if (subscriptionError && subscriptionError.code !== "PGRST116") {
          console.error("Error checking subscription:", subscriptionError);
        }

        // Set subscription status based on whether we found an active subscription
        setHasActiveSubscription(!!subscriptionData);
        console.log("Active subscription:", !!subscriptionData);
      } catch (error) {
        console.error("Error checking subscription status:", error);
        setHasActiveSubscription(false);
      } finally {
        setIsCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [supabase]);

  const handleGenerateBlog = async (url: string, humanizeLevel: "normal" | "hardcore") => {
    try {
      setLoading(true);
      setSubscriptionError(false);

      console.log(`Generating blog for ${url} with humanize level: ${humanizeLevel}`);

      // Call the backend generateBlog function
      // Note: humanizeLevel is not used by the backend, so we ignore it here
      const data: GenerateBlogResult = await generateBlog(url);

      // Check for subscription-related errors
      if (
        data.message &&
        (data.message.includes("subscription") ||
          data.message.includes("credits") ||
          data.message.includes("free blog post"))
      ) {
        setSubscriptionError(true);
      }

      return data;
    } catch (error: any) {
      console.error("Error generating blog:", error);
      const errorMessage = error.message || "Failed to generate blog";
      if (
        errorMessage.includes("subscription") ||
        errorMessage.includes("credits") ||
        errorMessage.includes("free blog post")
      ) {
        setSubscriptionError(true);
      }
      return { blogPosts: [], message: errorMessage } as GenerateBlogResult;
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="ml-3 text-gray-700">Checking subscription status...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <BlogGenerator
          onGenerate={handleGenerateBlog}
          loading={loading}
          subscriptionError={subscriptionError}
          hasActiveSubscription={hasActiveSubscription}
        />
      </div>
    </main>
  );
}