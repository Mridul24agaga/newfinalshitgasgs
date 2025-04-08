"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreditCard, Lock, ArrowUp, Calendar, LinkIcon, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utitls/supabase/client";
import PaymentPage from "@/app/components/payment-page";

const DODO_URL = "https://test.checkout.dodopayments.com/buy";
const ACTIVE_PLANS = ["growth", "basic", "pro"];

type BlogPost = {
  id: string;
  user_id: string;
  blog_post: string;
  citations: { url: string; title: string }[];
  created_at: string;
  title: string;
  timestamp: string;
  reveal_date: string;
  url: string;
  is_blurred: boolean;
};

type BlogContent = {
  visibleContent: string;
  blurredContent: string;
  hasBlurredContent: boolean;
};

type UserSignedUp = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

type Subscription = {
  id: string;
  user_id: string;
  plan_id: string;
  credits: number;
  status: string;
  billing_cycle: string;
  subscription_type: string;
  current_period_end?: string;
  last_updated?: string;
};

type Plan = {
  id: string;
  name: string;
  dodoProductId: string;
  numericPrice: number;
};

export default function BlogPostPage() {
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [user, setUser] = useState<UserSignedUp | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [subscriptionCredits, setSubscriptionCredits] = useState<number | null>(null);
  const [subscriptionLastUpdated, setSubscriptionLastUpdated] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [splitContentResult, setSplitContentResult] = useState<BlogContent>({
    visibleContent: "",
    blurredContent: "",
    hasBlurredContent: false,
  });

  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const topRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  const addLog = (message: string) => {
    console.log(message);
    setDebugInfo((prev) => `${prev}\n${new Date().toISOString()}: ${message}`);
  };

  useEffect(() => {
    const checkUserAndSubscription = async () => {
      try {
        addLog("Checking user authentication...");
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          addLog(`Auth error: ${authError.message}`);
          setUser(null);
          return;
        }

        if (!authUser) {
          addLog("No authenticated user found");
          setUser(null);
          return;
        }

        addLog(`Authenticated user found: ${authUser.id}`);
        const { data: signupUser, error: signupError } = await supabase
          .from("userssignuped")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (signupError) {
          addLog(`Error fetching user from userssignuped: ${signupError.message}`);
          if (signupError.code === "PGRST116") {
            addLog("User not in userssignuped, creating entry...");
            const { data: newUser, error: insertError } = await supabase
              .from("userssignuped")
              .insert({ id: authUser.id, email: authUser.email })
              .select()
              .single();

            if (insertError) {
              addLog(`Failed to create user record: ${insertError.message}`);
              setUser(null);
            } else {
              addLog(`Created new user record: ${newUser.id}`);
              setUser(newUser);
              setUserId(authUser.id);
              await checkSubscription(authUser.id);
            }
          } else {
            setUser(null);
          }
        } else {
          addLog(`User found in userssignuped: ${signupUser.id}`);
          setUser(signupUser);
          setUserId(signupUser.id);
          await checkSubscription(authUser.id);
        }
      } catch (err) {
        addLog(`User check error: ${err instanceof Error ? err.message : String(err)}`);
        setUser(null);
      }
    };

    checkUserAndSubscription();
  }, []);

  const checkSubscription = async (userId: string) => {
    try {
      addLog(`Checking subscription for user: ${userId}`);
      const { data: subscriptions, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId);

      if (subError) {
        addLog(`Error fetching subscriptions: ${subError.message}`);
        setHasActiveSubscription(false);
        setSubscriptionCredits(null);
        setSubscriptionLastUpdated(null);
        return;
      }

      addLog(`Found ${subscriptions?.length || 0} subscriptions`);
      if (subscriptions && subscriptions.length > 0) {
        const activeSubscription = subscriptions.find((sub) => ACTIVE_PLANS.includes(sub.plan_id));
        if (activeSubscription) {
          addLog(`Active subscription detected: ${activeSubscription.plan_id}`);
          setHasActiveSubscription(true);
          setSubscriptionPlan(activeSubscription.plan_id);
          setSubscriptionCredits(activeSubscription.credits);
          setSubscriptionLastUpdated(activeSubscription.last_updated || null);
        } else {
          addLog("No active subscription found among subscriptions");
          setHasActiveSubscription(false);
          setSubscriptionCredits(subscriptions[0].credits);
          setSubscriptionLastUpdated(subscriptions[0].last_updated || null);
        }
      } else {
        addLog("No subscriptions exist for this user");
        setHasActiveSubscription(false);
        setSubscriptionCredits(null);
        setSubscriptionLastUpdated(null);
      }
    } catch (err) {
      addLog(`Subscription check error: ${err instanceof Error ? err.message : String(err)}`);
      setHasActiveSubscription(false);
      setSubscriptionCredits(null);
      setSubscriptionLastUpdated(null);
    }
  };

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) {
        addLog("No blog post ID provided");
        setLoading(false);
        return;
      }
      try {
        addLog(`Fetching blog post with ID: ${id}`);
        const { data: blog, error } = await supabase.from("blogs").select("*").eq("id", id).single();
        if (error || !blog) {
          addLog(`Error fetching blog post: ${error?.message || "No data returned"}`);
          setBlogPost(null);
        } else {
          addLog(`Blog post fetched: ${blog.title}, is_blurred: ${blog.is_blurred}`);
          setBlogPost({
            ...blog,
            is_blurred: blog.is_blurred ?? false, // Ensure default false if null
          });
        }
      } catch (err) {
        addLog(`Blog fetch error: ${err instanceof Error ? err.message : String(err)}`);
        setBlogPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPost();
  }, [id]);

  useEffect(() => {
    if (!blogPost || typeof document === "undefined") {
      addLog("No blog post or document not available yet");
      return;
    }

    try {
      addLog(`Processing content split - is_blurred: ${blogPost.is_blurred}, hasActiveSubscription: ${hasActiveSubscription}`);

      if (!blogPost.is_blurred || hasActiveSubscription) {
        addLog("Content should be fully visible (not blurred or user has subscription)");
        setSplitContentResult({
          visibleContent: blogPost.blog_post,
          blurredContent: "",
          hasBlurredContent: false,
        });
      } else {
        addLog("Applying blur effect for free plan user without active subscription");
        const fullContent = blogPost.blog_post || "";
        const splitIndex = Math.floor(fullContent.length * 0.2); // Show 20% as teaser

        setSplitContentResult({
          visibleContent: fullContent.slice(0, splitIndex),
          blurredContent: fullContent.slice(splitIndex),
          hasBlurredContent: fullContent.length > splitIndex,
        });
        addLog(`Content split - Visible: ${splitIndex} chars, Blurred: ${fullContent.length - splitIndex} chars`);
      }
    } catch (err) {
      addLog(`Content split error: ${err instanceof Error ? err.message : String(err)}`);
      setSplitContentResult({
        visibleContent: blogPost.blog_post || "",
        blurredContent: "",
        hasBlurredContent: false,
      });
    }
  }, [blogPost, hasActiveSubscription]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      addLog("Initiating login...");
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        addLog(`Login failed: ${authError.message}`);
        throw new Error(`Authentication failed: ${authError.message}`);
      }
      if (!authUser) {
        addLog("No user returned from login");
        throw new Error("Authentication failed: No user returned");
      }
      addLog(`Logged in user: ${authUser.id}`);
      const { data: signupUser, error: signupError } = await supabase
        .from("userssignuped")
        .select("*")
        .eq("id", authUser.id)
        .single();
      if (signupError) {
        if (signupError.code === "PGRST116") {
          addLog("User not in userssignuped, creating...");
          const { data: newUser, error: insertError } = await supabase
            .from("userssignuped")
            .insert({ id: authUser.id, email: authUser.email })
            .select()
            .single();
          if (insertError) {
            addLog(`Failed to insert new user: ${insertError.message}`);
            throw new Error(`Failed to create user record: ${insertError.message}`);
          }
          setUser(newUser);
          setUserId(authUser.id);
          setShowLoginForm(false);
          await checkSubscription(authUser.id);
          return;
        }
        addLog(`User fetch error post-login: ${signupError.message}`);
        throw new Error(`Failed to check user record: ${signupError.message}`);
      }
      addLog("User exists in userssignuped");
      setUser(signupUser);
      setUserId(signupUser.id);
      setShowLoginForm(false);
      await checkSubscription(authUser.id);
    } catch (err) {
      addLog(`Login error: ${err instanceof Error ? err.message : "Unknown error"}`);
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const handlePayNow = () => {
    addLog("Pay Now clicked");
    setShowPricing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToPreview = () => {
    setShowPricing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
    setError(null);
  };

  const getCheckoutUrl = (plan: Plan) => {
    if (!user || !user.id) {
      addLog("No user for checkout URL");
      return "#";
    }
    addLog(`Generating checkout URL for plan: ${plan.name}`);
    const redirectUrl = encodeURIComponent(
      `${window.location.origin}/payment-success?` +
        `user_id=${user.id}&plan_id=${plan.id}&plan_name=${plan.name}&` +
        `price=${plan.numericPrice}¤cy=USD&billing_cycle=${billingCycle}`,
    );
    return `${DODO_URL}/${plan.dodoProductId}?quantity=1&redirect_url=${redirectUrl}`;
  };

  const { visibleContent, blurredContent, hasBlurredContent } = splitContentResult;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#294fd6] mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-xl shadow-md border border-gray-200"
        >
          <div className="text-center p-8">
            <div className="h-12 w-12 text-gray-400 mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog post not found</h2>
            <p className="text-gray-600">The blog post you're looking for doesn't exist or has been removed.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={topRef} className="min-h-screen bg-white py-12 px-4 sm:px-6">
      <AnimatePresence mode="wait">
        {!showPricing ? (
          <motion.div
            key="blog-post"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
          >
            <div className="p-6 sm:p-8">
              {hasActiveSubscription && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-green-800 font-medium">Premium Content Unlocked</p>
                    <p className="text-green-600 text-sm">
                      You're viewing 100% of this content with your{" "}
                      {subscriptionPlan
                        ? subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)
                        : "Premium"}{" "}
                      plan
                    </p>
                  </div>
                </div>
              )}

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800"
              >
                {blogPost.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500"
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(blogPost.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>5 min read</span>
                </div>
                {blogPost.url && (
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    <a
                      href={blogPost.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#294fd6] hover:text-[#1e3eb8] hover:underline transition-colors duration-200"
                    >
                      Source
                    </a>
                  </div>
                )}
              </motion.div>

              <motion.hr
                initial={{ opacity: 0, width: "0%" }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="my-6 border-gray-200"
              />

              {/* Visible Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="prose prose-gray prose-headings:text-gray-800 prose-a:text-[#294fd6] prose-table:table prose-table:w-full prose-table:border-collapse prose-table:bg-white prose-table:text-gray-800 max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: visibleContent }}
              />

              {/* Blurred Content Section */}
              {hasBlurredContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="relative mt-8 rounded-xl overflow-hidden border border-gray-200 shadow-md"
                >
                  <div className="relative">
                    <div
                      className="prose prose-gray prose-table:table prose-table:w-full prose-table:border-collapse prose-table:bg-white prose-table:text-gray-800 max-w-none blur-md pointer-events-none p-6 opacity-70 select-none"
                      dangerouslySetInnerHTML={{ __html: blurredContent }}
                    />
                    <div className="absolute top-0 right-0 bg-[#294fd6] text-white text-xs font-bold px-2 py-1 rounded-bl-md">
                      PREMIUM
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white flex flex-col items-center justify-center p-8">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="text-center max-w-md"
                    >
                      <div className="bg-blue-100 text-[#294fd6] p-3 rounded-full inline-flex items-center justify-center mb-4 shadow-md">
                        <Lock className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">Unlock Full Article</h3>
                      <p className="text-gray-600 mb-6">
                        This content is exclusive to subscribers. Upgrade now to read the full post and access our premium library!
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePayNow}
                        className="bg-[#294fd6] hover:bg-[#1e3eb8] text-white px-8 py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center mx-auto font-medium"
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        Subscribe to Unlock
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Citations */}
              {blogPost.citations && blogPost.citations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mt-8 pt-6 border-t border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Citations</h3>
                  <ul className="space-y-2">
                    {blogPost.citations.map((citation, index) => (
                      <li key={index} className="text-gray-600">
                        <span className="text-gray-400">[{index + 1}]</span>{" "}
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#294fd6] hover:text-[#1e3eb8] hover:underline transition-colors duration-200"
                        >
                          {citation.title || citation.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Debug Information */}
              <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Information</h4>
                <div className="text-xs font-mono text-gray-600">
                  <p>User ID: {userId || "Not logged in"}</p>
                  <p>Has Active Subscription: {hasActiveSubscription ? "Yes" : "No"}</p>
                  <p>Subscription Plan: {subscriptionPlan || "None"}</p>
                  <p>Credits: {subscriptionCredits !== null ? subscriptionCredits : "N/A"}</p>
                  <p>Subscription Last Updated: {subscriptionLastUpdated || "N/A"}</p>
                  <p>Blog Post ID: {blogPost.id}</p>
                  <p>Is Blurred: {blogPost.is_blurred ? "Yes" : "No"}</p>
                  <p>Has Blurred Content: {hasBlurredContent ? "Yes" : "No"}</p>
                  <details>
                    <summary>Detailed Logs</summary>
                    <pre className="whitespace-pre-wrap mt-2 text-xs">{debugInfo}</pre>
                  </details>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div className="text-center mb-8">
            <button
              onClick={handleBackToPreview}
              className="text-[#294fd6] hover:text-[#1e3eb8] font-medium transition-colors duration-200 underline mb-8"
            >
              Back to article preview
            </button>
            <PaymentPage />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-[#294fd6] text-white p-3 rounded-full shadow-lg hover:bg-[#1e3eb8] transition-all duration-300 z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}