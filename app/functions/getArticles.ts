import articlesData from "@/json/articles.json";

export type ArticleType = {
  id: number;
  author: string;
  job: string;
  city: string;
  avatar: string;
  imgAlt: string;
  slug: string;
  biography: {
    summary: string;
    body: string;
  };
  articles: Array<{
    title: string;
    popular: boolean;
    popularity: number;
    description: string;
    date: string;
    read: string;
    label: string;
    img: string;
    imgAlt: string;
    slug: string;
    content: Array<{
      img: string;
      summary: string;
      section1: string;
      quote: Array<string>;
      summary2: string;
      section2: string;
    }>;
  }>;
};

/**
 * `content` is a fixed 5-slot positional array in the data
 * ([0] img + summary, [1] section1, [2] quote, [3] summary2, [4] section2),
 * so the cast goes through `unknown` to keep the shape the pages already expect.
 */
export async function getArticles(): Promise<ArticleType[]> {
  return articlesData as unknown as ArticleType[];
}
