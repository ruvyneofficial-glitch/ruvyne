import type { StructureResolver } from "sanity/structure";
import { apiVersion } from "../lib/sanity.client";

export const SINGLETON_TYPES = ["siteSettings"] as const;

const newestFirst = [{ field: "date", direction: "desc" as const }];

// The sort menu in each list offers the orderings defined on the schema; these
// lists open in the most useful one.
export const structure: StructureResolver = (S, context) => {
  // Built from the article type list rather than S.documentList() so the
  // filtered lists keep its sort and layout menu.
  const articles = (title: string, filter: string, params: Record<string, string> = {}) =>
    S.documentTypeList("article")
      .id(title.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
      .title(title)
      .apiVersion(apiVersion)
      .filter(filter)
      .params(params)
      .defaultOrdering(newestFirst);

  return S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Articles")
        .schemaType("article")
        .child(async () => {
          // One list per category, so a category added in the Studio gets its own list.
          const categories: Array<{ _id: string; title?: string }> = await context
            .getClient({ apiVersion })
            .fetch(
              `*[_type == "category" && !(_id in path("drafts.**"))] | order(coalesce(order, 10) asc, title asc){_id, title}`
            );

          return S.list()
            .title("Articles")
            .items([
              S.listItem()
                .title("All articles")
                .schemaType("article")
                .child(articles("All articles", '_type == "article"')),
              S.divider(),
              ...categories.map((category) =>
                S.listItem()
                  .id(category._id)
                  .title(category.title ?? "Untitled category")
                  .schemaType("article")
                  .child(
                    articles(category.title ?? "Category", '_type == "article" && category._ref == $categoryId', {
                      categoryId: category._id,
                    })
                  )
              ),
              S.divider(),
              S.listItem()
                .title("By author")
                .child(
                  S.documentTypeList("author")
                    .title("Pick an author")
                    .defaultOrdering([{ field: "name", direction: "asc" }])
                    .child((authorId) =>
                      articles("Their articles", '_type == "article" && author._ref == $authorId', {
                        authorId,
                      })
                    )
                ),
            ]);
        }),
      S.listItem()
        .title("Categories")
        .schemaType("category")
        .child(
          S.documentTypeList("category")
            .title("Categories")
            .defaultOrdering([
              { field: "order", direction: "asc" },
              { field: "title", direction: "asc" },
            ])
        ),
      S.listItem()
        .title("Authors")
        .schemaType("author")
        .child(
          S.documentTypeList("author")
            .title("Authors")
            .defaultOrdering([{ field: "name", direction: "asc" }])
        ),
      // Podcasts are switched off.
      // S.listItem()
      //   .title("Podcast episodes")
      //   .schemaType("podcast")
      //   .child(
      //     S.documentTypeList("podcast")
      //       .title("Podcast episodes")
      //       .defaultOrdering([{ field: "order", direction: "desc" }])
      //   ),
      S.listItem()
        .title("Pages")
        .schemaType("page")
        .child(
          S.documentTypeList("page")
            .title("Pages")
            .defaultOrdering([{ field: "title", direction: "asc" }])
        ),
      S.listItem()
        .title("News ticker")
        .schemaType("newsItem")
        .child(
          S.documentTypeList("newsItem")
            .title("News ticker")
            .defaultOrdering([{ field: "order", direction: "asc" }])
        ),
      S.divider(),
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site settings")
        ),
    ]);
};
