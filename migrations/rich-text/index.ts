import { at, defineMigration, set, unset } from "sanity/migrate";
import { legacyToBlocks, type LegacyArticle } from "../../lib/legacyBody";

const LEGACY_FIELDS = ["summary", "section1", "quoteText", "quoteAttribution", "summary2", "section2"];

// One-off. Moves the five fixed text fields of older articles into the rich
// text Body, in the same order the article page showed them. Articles that
// already have a Body are left alone. Safe to run twice.
//
//   npx sanity migration run rich-text                # dry run, changes nothing
//   npx sanity migration run rich-text --no-dry-run   # apply
export default defineMigration({
  title: "Move the fixed article fields into the rich text Body",
  documentTypes: ["article"],
  migrate: {
    document(doc) {
      if (Array.isArray(doc.body) && doc.body.length) return;
      const present = LEGACY_FIELDS.filter((field) => doc[field] != null);
      if (!present.length) return;

      return [
        at("body", set(legacyToBlocks(doc as LegacyArticle))),
        ...present.map((field) => at(field, unset())),
      ];
    },
  },
});
