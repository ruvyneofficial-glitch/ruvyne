// Articles written before the rich text editor have five fixed text fields.
// The site (until the rich-text migration has run, and for json/) and the
// migration itself turn them into the same rich text blocks.

export type LegacyArticle = {
  summary?: string | null;
  section1?: string | null;
  quoteText?: string | null;
  quoteAttribution?: string | null;
  summary2?: string | null;
  section2?: string | null;
};

export type RichTextBlock = { _type: string; _key: string; [field: string]: unknown };

export function legacyToBlocks(article: LegacyArticle): RichTextBlock[] {
  const blocks: RichTextBlock[] = [];

  const paragraphs = (text: string | null | undefined, style: "normal" | "lead") => {
    for (const paragraph of (text ?? "").split(/\n\s*\n/)) {
      const value = paragraph.trim();
      if (!value) continue;
      const key = `legacy${blocks.length}`;
      blocks.push({
        _type: "block",
        _key: key,
        style,
        markDefs: [],
        children: [{ _type: "span", _key: `${key}s`, text: value, marks: [] }],
      });
    }
  };

  paragraphs(article.summary, "lead");
  paragraphs(article.section1, "normal");
  if (article.quoteText?.trim()) {
    blocks.push({
      _type: "pullQuote",
      _key: `legacy${blocks.length}`,
      text: article.quoteText.trim(),
      ...(article.quoteAttribution ? { attribution: article.quoteAttribution } : {}),
    });
  }
  paragraphs(article.summary2, "lead");
  paragraphs(article.section2, "normal");

  return blocks;
}
