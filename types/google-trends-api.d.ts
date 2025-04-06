// Custom type definitions for google-trends-api
declare module "google-trends-api" {
    export interface TrendsOptions {
      keyword: string | string[]
      startTime?: Date
      endTime?: Date
      geo?: string
      hl?: string
      timezone?: number
      category?: number
      property?: string
    }
  
    export function interestOverTime(options: TrendsOptions): Promise<string>
    export function interestByRegion(options: TrendsOptions): Promise<string>
    export function relatedTopics(options: TrendsOptions): Promise<string>
    export function relatedQueries(options: TrendsOptions): Promise<string>
    export function dailyTrends(options: Omit<TrendsOptions, "keyword">): Promise<string>
    export function realTimeTrends(options: Omit<TrendsOptions, "keyword"> & { category: number }): Promise<string>
  }
  
  