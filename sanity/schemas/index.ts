import author from "./author";
import article from "./article";
import category from "./category";
import page from "./page";
// Podcasts are switched off. The 5 episodes stay in Sanity, just hidden here.
// import podcast from "./podcast";
import newsItem from "./newsItem";
import siteSettings from "./siteSettings";
import richText from "./richText";
import seo from "./seo";
import socialLink from "./socialLink";

export const schemaTypes = [
  author,
  article,
  category,
  page,
  /* podcast, */
  newsItem,
  siteSettings,
  richText,
  seo,
  socialLink,
];

export default schemaTypes;
