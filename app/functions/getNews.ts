import newsData from "@/json/news.json";
import { sanityFetch } from "@/lib/sanity.client";

const QUERY = /* groq */ `*[_type == "newsItem"] | order(order asc).text`;

export async function getNews(): Promise<string[]> {
  const data = await sanityFetch<string[]>(QUERY);

  if (data && data.length > 0) return data;

  return newsData as string[];
}
