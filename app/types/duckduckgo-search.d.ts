declare module "duckduckgo-search" {
    export interface SearchOptions {
      safeSearch?: "Moderate" | "Off" | "Strict"
      time?: "y" | "m" | "w" | "d"
      maxResults?: number
    }
  
    export interface SearchResult {
      title: string
      link: string
      snippet: string
      url: string
    }
  
    export function duckDuckGoSearch(query: string, options?: SearchOptions): Promise<SearchResult[]>
  }
  
  