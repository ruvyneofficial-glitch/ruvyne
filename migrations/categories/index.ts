import { at, createIfNotExists, defineMigration, patch, set, unset } from "sanity/migrate";
import { slugify } from "../../lib/site";

// One-off. Articles written before categories became documents hold their
// category as text ("Home Decor"). This creates a Category document for each
// one and points every article at it, so categories can be renamed or added
// in the Studio. Safe to run twice.
//
//   npx sanity migration run categories                # dry run, changes nothing
//   npx sanity migration run categories --no-dry-run   # apply
export default defineMigration({
  title: "Turn article category text into Category documents",
  documentTypes: ["article"],
  migrate: {
    document(doc) {
      const label = typeof doc.label === "string" ? doc.label.trim() : "";
      if (!label) return;
      if (doc.category) return at("label", unset());

      const slug = slugify(label);
      const categoryId = `category-${slug}`;
      return [
        createIfNotExists({
          _id: categoryId,
          _type: "category",
          title: label,
          slug: { _type: "slug", current: slug },
          showOnHomepage: true,
        }),
        patch(doc._id, [
          at("category", set({ _type: "reference", _ref: categoryId })),
          at("label", unset()),
        ]),
      ];
    },
  },
});
