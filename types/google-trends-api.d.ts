declare module 'google-trends-api' {
  interface DailyTrendsOptions {
    trendDate?: Date
    geo?: string
  }
  
  export function dailyTrends(options: DailyTrendsOptions): Promise<string>
}
