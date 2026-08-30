import { getNews } from "@/app/functions/getNews";
import NewsTicker from "./NewsTicker";

export default async function NewsTickerSection() {
  const items = await getNews();

  return <NewsTicker items={items} />;
}
