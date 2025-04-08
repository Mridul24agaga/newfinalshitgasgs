"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Link2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Sparkles,
  Zap,
  PenTool,
  BookOpen,
} from "lucide-react";
import { generateBlog } from "../actions"; // Adjust path to your generateBlog function

export default function GenerateBlogContent() {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [generatedBlogId, setGeneratedBlogId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  const generationSteps = [
    { icon: <Sparkles className="text-purple-500" size={24} />, text: "Analyzing website content..." },
    { icon: <PenTool className="text-emerald-500" size={24} />, text: "Crafting compelling headlines..." },
    { icon: <BookOpen className="text-amber-500" size={24} />, text: "Structuring blog sections..." },
    { icon: <Zap className="text-rose-500" size={24} />, text: "Adding AI magic to content..." },
  ];

  // Load URL from localStorage or query params on mount
  useEffect(() => {
    const storedUrl = localStorage.getItem("websiteSummaryUrl");
    const queryUrl = searchParams.get("url");
    if (storedUrl) setUrl(storedUrl);
    else if (queryUrl) setUrl(queryUrl);
  }, [searchParams]);

  // Simulate progress during loading
  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      setCurrentStep(0);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 1;
        });
      }, 300);

      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % generationSteps.length);
      }, 5000);

      return () => {
        clearInterval(progressInterval);
        clearInterval(stepInterval);
      };
    }
  }, [isLoading, generationSteps.length]);

  // Warn user if they try to leave during generation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLoading) {
        e.preventDefault();
        e.returnValue = "Blog generation in progress. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isLoading]);

  // Timeout wrapper using Promise.race
  const generateBlogWithTimeout = (url: string, mode?: "normal" | "hardcore", timeoutMs: number = 30000) => {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out. The server took too long to respond.")), timeoutMs)
    );
    return Promise.race([generateBlog(url, mode), timeoutPromise]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setGeneratedBlogId(null);

    try {
      console.log("Starting blog generation for URL:", url);
      // Assuming "normal" mode as default; adjust if "hardcore" is preferred
      const blogPosts = await generateBlogWithTimeout(url, "normal", 30000); // 30-second timeout
      console.log("Raw response from generateBlog:", blogPosts);

      // Robust response validation
      if (!blogPosts) {
        console.error("No response received from generateBlog");
        throw new Error("No response received from the server");
      }
      if (!Array.isArray(blogPosts)) {
        console.error("generateBlog did not return an array:", blogPosts);
        throw new Error("Invalid response format from blog generation");
      }
      if (blogPosts.length === 0) {
        console.error("generateBlog returned an empty array");
        throw new Error("No blog posts were generated");
      }

      const firstBlogPost = blogPosts[0];
      if (!firstBlogPost?.id) {
        console.warn("Generated blog post has no ID:", firstBlogPost);
        throw new Error("Generated blog post is missing an ID");
      }

      console.log(`Successfully generated blog post with ID: ${firstBlogPost.id}`, firstBlogPost);
      setGeneratedBlogId(firstBlogPost.id);
      localStorage.setItem("generatedBlogPosts", JSON.stringify(blogPosts));
      setSuccess(true);

      setTimeout(() => {
        console.log(`Redirecting to /generated/${firstBlogPost.id}`);
        router.push(`/generated/${firstBlogPost.id}`);
      }, 3000);
    } catch (error: any) {
      console.error("Error in handleSubmit:", error.message, error.stack);
      if (error.message.includes("timeout")) {
        setError("The server took too long to respond. Please try again later.");
      } else if (error.message.includes("Network Error")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(`Failed to generate content: ${error.message || "An unexpected error occurred"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4 sm:p-6 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push("/dashboard/blogs")}
            className="text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="text-lg font-semibold text-gray-700">Blog Post Generator</div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-4xl mx-auto animate-fadeIn">
          <div className="bg-white rounded-lg p-6 sm:p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FileText className="text-[#2563eb]" size={28} />
                Generate Blog Post
              </h1>
            </div>

            {success ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 border border-green-200">
                  <ArrowRight size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Post Generated!</h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  Successfully generated a blog post based on your website content. Redirecting you to your new blog
                  post...
                </p>
                <div className="w-16 h-1 bg-[#2563eb] animate-pulse rounded-full"></div>
              </div>
            ) : isLoading ? (
              <div className="py-10 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-md mx-auto mb-12">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse"></div>
                  <div className="relative bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="particle absolute w-2 h-2 rounded-full bg-blue-500 opacity-70"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`,
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center mb-6 relative">
                        <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 100 100">
                          <circle
                            className="text-gray-200"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="46"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-blue-600 transition-all duration-300"
                            strokeWidth="8"
                            strokeDasharray={46 * 2 * Math.PI}
                            strokeDashoffset={46 * 2 * Math.PI * (1 - progress / 100)}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="46"
                            cx="50"
                            cy="50"
                          />
                        </svg>
                        <div className="text-2xl font-bold text-gray-800">{progress}%</div>
                      </div>
                      <div className="flex items-center justify-center mb-4 animate-bounce">
                        {generationSteps[currentStep].icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2 animate-fadeIn">
                        {generationSteps[currentStep].text}
                      </h3>
                      <p className="text-gray-600 text-center max-w-xs animate-fadeIn">
                        Our AI is hard at work creating an amazing blog post for your website.
                      </p>
                      <div className="flex space-x-2 mt-8">
                        {generationSteps.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === currentStep ? "bg-blue-600 scale-125" : "bg-gray-300"
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md mx-auto animate-slideUp">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 text-amber-500 mr-2" />
                    Did you know?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Blogs with images get 94% more views than those without. Your AI-generated blog will include
                    suggestions for relevant imagery.
                  </p>
                </div>
                <div className="mt-8 text-center text-sm text-gray-500 max-w-md animate-fadeIn">
                  <p>Please don’t close this page. You’ll be automatically redirected when your blog is ready.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 mb-8">
                <div className="p-8 pt-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <label htmlFor="url" className="block text-sm font-semibold text-gray-700">
                        Website URL
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Link2 className="h-5 w-5 text-[#2563eb]" />
                        </div>
                        <input
                          type="url"
                          id="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://example.com"
                          disabled={isLoading}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] disabled:bg-gray-50 disabled:text-gray-400 transition-all duration-200 placeholder:text-gray-300"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-[#2563eb] mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">About Blog Generation</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Our AI will analyze your website and generate a blog post tailored to your audience. The
                            generated content will be based on your website’s topic, style, and target audience.
                          </p>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="text-sm font-medium text-red-800">Oops! Something went wrong</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className={`w-full px-6 py-3 rounded-lg text-white font-bold flex items-center justify-center transition-all duration-300 border ${
                        isLoading
                          ? "bg-blue-400 border-blue-500 cursor-not-allowed"
                          : "bg-[#2563eb] border-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin mr-3 h-5 w-5 text-white" />
                          <span>Generating Blog Post...</span>
                        </>
                      ) : (
                        <>
                          <span>Generate Blog Post</span>
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes moveParticle {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx, 100px), var(--ty, 100px));
            opacity: 0;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards-especially;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .particle {
          --tx: ${Math.random() * 200 - 100}px;
          --ty: ${Math.random() * 200 - 100}px;
          animation: moveParticle 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}