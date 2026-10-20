import { at, defineMigration, set } from "sanity/migrate";
import { toIsoDate } from "../../lib/dates";

// One-off. Articles and episodes written before the date picker hold dates as
// text ("12 August 2026"), which sort alphabetically. This rewrites them as
// 2026-08-12, the format the date picker saves.
//
//   npx sanity migration run iso-dates                # dry run, changes nothing
//   npx sanity migration run iso-dates --no-dry-run   # apply
export default defineMigration({
  title: "Store article and episode dates as YYYY-MM-DD",
  documentTypes: ["article", "podcast"],
  migrate: {
    document(doc) {
      if (typeof doc.date !== "string") return;
      const iso = toIsoDate(doc.date);
      if (iso && iso !== doc.date) return at("date", set(iso));
    },
  },
});
