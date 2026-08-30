import newsData from "@/json/news.json";

export async function getNews(): Promise<string[]> {
  return newsData as string[];
}
