export interface Link {
  text: string
  url: string
  isExternal?: boolean
}

export interface Keyword {
  keyword: string
  difficulty: number
}

export interface Topic {
  title: string
  description: string
  type: "company" | "industry" | "niche" | "how-to" | "listicle"
}

export interface Analysis {
  fullBlogPost?: string
  headings?: string[]
  images?: string[]
  keywords: Keyword[]
  seoScore?: number
  topics?: Topic[]
  summary?: string
}

export interface AnalysisResult {
  id: string
  url: string
  summary: string
  keywords: { keyword: string; difficulty: number }[]
  topics: { title: string; description: string; type: string; keyPoints: string[] }[]
  blogOutline: string
  fullBlogPost: string
  seoScore: number
  internalLinks: string[]
  externalLinks: string[]
  youtubeLinks: string[]
  images: { url: string; alt: string }[]
  headings: string[]
  metaDescription: string
  researchSummary: string
  coverImage?: { url: string; alt: string }
}


export interface RequestInit extends globalThis.RequestInit {
  timeout?: number
}

export interface SummaryData {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export interface KeywordsData {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export interface BlogOutlineData {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export interface TopicsData {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export interface BlogPostData {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export interface FinalData {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export interface APIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export interface GeneratedImage {
  url: string
  alt: string
}

export interface UserAction {
  action_type: "website_analysis" | "content_generation" | "keyword_research"
  url?: string
  content?: string
  keywords?: string[]
}


export interface GeneratedImage {
  url: string
  alt: string
}

export interface Keyword {
  keyword: string
  difficulty: number
}

export interface Topic {
  title: string
  description: string
  type: "company" | "industry" | "niche" | "how-to" | "listicle"
}


export interface BlogSettings {
  targetAudience: string
  contentTone: string
  contentLength: string
}