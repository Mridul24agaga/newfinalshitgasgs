import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import GenerateBlogContent from "./generate-blog-content"

export default function GenerateBlogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <GenerateBlogContent />
    </Suspense>
  )
}

