import Link from "next/link";

const BlogIndex: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center">Example Blogs</h1>
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold mb-2">
            How Expert-Led AI Rescued Our Traffic After Google’s 2025 HCU Update
          </h2>
          <p className="text-muted-foreground mb-4">
            A case study on recovering 317% organic traffic after a 72% drop due to the 2025 HCU.
          </p>
          <Link
            href="/example-blogs/how-experts-led-ai-rescued-our-traffic-after-google-2025-hcu-update-slashed-by-72%"
            className="text-blue-500 hover:underline"
          >
            Read More
          </Link>
        </div>
        {/* Add more blog post links here if needed */}
      </div>
    </div>
  );
};

export default BlogIndex;

// Metadata for the index page
export const metadata = {
  title: "Example Blogs",
  description: "A collection of insightful blog posts.",
};