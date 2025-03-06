"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { generateBlog } from "../../actions";
import { createClient } from "@/utitls/supabase/client";
import { Link2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import ContentPlanner from "@/app/components/content-planner";

export default function URLForm() {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const planCreditsMap: { [key: string]: number } = {
    "trial": 2,
    "starter": 10,
    "pro": 30,
    "professional": 30,
  };

  useEffect(() => {
    checkExistingContentAndSubscription();

    const setupRealtimeSubscription = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Failed to get user for real-time subscription:", error);
        return;
      }

      const userId = user.id;

      const subscription = supabase
        .channel('subscriptions-changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Catch all changes
            schema: 'public',
            table: 'subscriptions',
            filter: `user_id=eq.${userId}`,
          },
          async (payload) => {
            console.log('Subscription change detected:', payload);
            const updatedSubscription = payload.new as { plan_id: string; credits: number };
            const planId = updatedSubscription.plan_id.toLowerCase();
            const maxPosts = planCreditsMap[planId] || 0;

            // If plan_id changed or credits don’t match maxPosts, reset credits
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              const shouldResetCredits = payload.eventType === 'INSERT' || 
                (payload.old && payload.old.plan_id !== updatedSubscription.plan_id) || 
                updatedSubscription.credits !== maxPosts;

              if (shouldResetCredits) {
                console.log(`Resetting credits to ${maxPosts} for plan ${planId}`);
                const { error: updateError } = await supabase
                  .from("subscriptions")
                  .update({ credits: maxPosts })
                  .eq("user_id", userId);
                if (updateError) {
                  console.error("Failed to reset credits:", updateError);
                } else {
                  setRemainingCredits(maxPosts);
                }
              }
            }

            setUserPlan(planId);
            setTotalPosts(maxPosts);
            setRemainingCredits(updatedSubscription.credits);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    };

    setupRealtimeSubscription();
  }, [supabase]);

  const checkExistingContentAndSubscription = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("No authenticated user found:", error);
        setError("Log in first, bro!");
        return;
      }

      const userId = user.id;

      const { data: blogs, error: blogError } = await supabase
        .from("blogs")
        .select("id")
        .eq("user_id", userId)
        .limit(1);
      if (blogError) throw blogError;
      if (blogs && blogs.length > 0) {
        setIsGenerated(true);
      }

      const { data: subscription, error: subError } = await supabase
        .from("subscriptions")
        .select("plan_id, credits")
        .eq("user_id", userId)
        .single();
      if (subError) {
        console.error("Subscription fetch error:", subError);
        throw subError;
      }
      if (subscription && subscription.plan_id) {
        const planId = subscription.plan_id.toLowerCase();
        const maxPosts = planCreditsMap[planId] || 0;

        // If credits don’t match maxPosts or are null, reset to maxPosts
        const shouldResetCredits = subscription.credits === null || 
          subscription.credits === undefined || 
          subscription.credits !== maxPosts;

        console.log(`Fetched subscription - Plan: ${planId}, Credits: ${subscription.credits}, Max: ${maxPosts}, Should reset: ${shouldResetCredits}`);

        if (shouldResetCredits) {
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({ credits: maxPosts })
            .eq("user_id", userId);
          if (updateError) {
            console.error("Failed to set initial credits:", updateError);
            throw updateError;
          } else {
            console.log(`Automatically set credits to ${maxPosts} for user ${userId} on plan ${planId}`);
            setRemainingCredits(maxPosts);
          }
        } else {
          setRemainingCredits(subscription.credits);
        }

        setUserPlan(planId);
        setTotalPosts(maxPosts);
        setTimeRemaining(maxPosts * 1.5 * 60);
      } else {
        console.error("No subscription found for user:", userId);
        setError("No subscription found. Contact support, bro!");
      }
    } catch (error) {
      console.error("Error checking content or subscription:", error);
      setError("Something went wrong loading your plan, man!");
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
        setGenerationProgress((prevProgress) => {
          const newProgress = prevProgress + 100 / (totalPosts * 1.5 * 60);
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLoading, timeRemaining, totalPosts]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }
    if (remainingCredits === null || remainingCredits <= 0) {
      setError("No credits remaining! Upgrade your plan or wait for a reset.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGenerationProgress(0);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("You need to log in first, bro!");
      }

      const { data: brandData, error: brandError } = await supabase
        .from("brand_profile")
        .select("id")
        .eq("user_id", user.id);
      if (brandError || !brandData || brandData.length === 0) {
        throw new Error("No brand data found—add it in /company-database/brand first");
      }

      const { data: blogPreferences, error: blogPreferencesError } = await supabase
        .from("blog_preferences")
        .select("id")
        .eq("user_id", user.id);
      if (blogPreferencesError || !blogPreferences || blogPreferences.length === 0) {
        throw new Error("No blog preferences found—add them in /company-database/blog first");
      }

      const { data: contentIdeas, error: contentIdeasError } = await supabase
        .from("content_ideas")
        .select("id")
        .eq("user_id", user.id);
      if (contentIdeasError || !contentIdeas || contentIdeas.length === 0) {
        throw new Error("No content ideas found—add them in /company-database/ideas first");
      }

      const result = await generateBlog(url);

      if (result && result.length > 0) {
        console.log(`Successfully generated ${result.length} blog posts`);
        setGenerationProgress(100);
        setIsGenerated(true);
      } else {
        throw new Error("No blog posts were generated");
      }
    } catch (error: any) {
      console.error(`Error generating content:`, error);
      setError(`Failed to generate content: ${error.message || "An unexpected error occurred"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isGenerated) {
    return <ContentPlanner key={Date.now()} />;
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl border border-orange-200 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-8 pt-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="url" className="block text-sm font-semibold text-orange-900">
                Website URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Link2 className="h-5 w-5 text-orange-500" />
                </div>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-orange-50 disabled:text-orange-400 transition-all duration-200 placeholder:text-orange-300"
                />
              </div>
            </div>

            {userPlan && !isLoading && (
              <div className="text-sm text-orange-700">
                Your plan: <span className="font-semibold capitalize">{userPlan}</span> (
                {remainingCredits !== null ? `${remainingCredits}/${totalPosts}` : `${totalPosts}`} credits remaining)
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-pulse">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Oops! Something went wrong</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Loader2 className="animate-spin h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-sm font-medium text-blue-800">
                      Generating {totalPosts} blog posts...{" "}
                      {generationProgress < 10 ? "First post" : `${Math.floor(generationProgress / (100 / totalPosts)) + 1}/${totalPosts}`}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-blue-800">Time remaining: {formatTime(timeRemaining)}</span>
                </div>
                <div className="mt-2 h-2 bg-blue-200 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`w-full px-6 py-3 rounded-xl text-white font-bold flex items-center justify-center transition-all duration-300 transform ${
                isLoading || remainingCredits === 0
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              }`}
              disabled={isLoading || remainingCredits === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-3 h-5 w-5 text-white" />
                  <span>Generating Blog Posts...</span>
                </>
              ) : (
                <>
                  <span>Generate Blog Posts</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}