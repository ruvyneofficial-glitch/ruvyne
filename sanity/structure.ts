import type { StructureResolver } from "sanity/structure";

export const SINGLETON_TYPES = ["siteSettings"] as const;

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("article").title("Articles"),
      S.documentTypeListItem("author").title("Authors"),
      S.documentTypeListItem("podcast").title("Podcast episodes"),
      S.documentTypeListItem("newsItem").title("News ticker"),
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
