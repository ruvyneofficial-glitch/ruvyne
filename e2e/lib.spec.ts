import { expect, test } from "@playwright/test";
import { THEME_PRESETS, contrast, hexToHslChannels, resolveTheme } from "../lib/theme";
import { formatDate, parseDate, toIsoDate } from "../lib/dates";
import { toEmbed } from "../lib/embed";
import { imageFocus, imageSize } from "../lib/image";
import { legacyToBlocks } from "../lib/legacyBody";
import { slugify } from "../lib/site";

test.describe("lib/theme", () => {
  test("converts hex to the hsl channels Tailwind reads", () => {
    expect(hexToHslChannels("#ffffff")).toBe("0 0% 100%");
    expect(hexToHslChannels("#000000")).toBe("0 0% 0%");
    expect(hexToHslChannels("#ff0000")).toBe("0 100% 50%");
    expect(hexToHslChannels("#57553f")).toBe("55 16% 29.4%");
  });

  test("every preset keeps text readable (WCAG AA)", () => {
    for (const { colors: c } of Object.values(THEME_PRESETS)) {
      const pairs = [
        [c.text, c.background],
        [c.mutedText, c.background],
        [c.accent, c.background],
        [c.text, c.surface],
        [c.mutedText, c.surface],
        [c.accent, c.surface],
        [c.footerText, c.footer],
      ];
      for (const [fg, bg] of pairs) expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("editor colours apply only when they are valid hex", () => {
    const theme = resolveTheme("classic", { text: "#123456", background: "red" });
    expect(theme.text).toBe("#123456");
    expect(theme.background).toBe(THEME_PRESETS.classic.colors.background);
    expect(resolveTheme("missing").brand).toBe(THEME_PRESETS.ruvyne.colors.brand);
  });
});

test.describe("lib/dates", () => {
  test("reads date picker and older text dates alike", () => {
    expect(toIsoDate("4 November 2026")).toBe("2026-11-04");
    expect(toIsoDate("4 Nov 2026")).toBe("2026-11-04");
    expect(toIsoDate("2026-11-04")).toBe("2026-11-04");
    expect(formatDate("2026-08-12")).toBe("12 August 2026");
    expect(formatDate("Spring 2026")).toBe("Spring 2026");
    expect(parseDate("31 Smarch 2026")).toBeNull();
  });

  test("sorts by date, not alphabetically", () => {
    const dates = ["9 September 2026", "4 November 2026", "2026-08-12"];
    const newest = [...dates].sort(
      (a, b) => parseDate(b)!.getTime() - parseDate(a)!.getTime()
    );
    expect(newest).toEqual(["4 November 2026", "9 September 2026", "2026-08-12"]);
  });
});

test.describe("lib/site", () => {
  test("slugifies category names the way the migration does", () => {
    expect(slugify("Home Decor")).toBe("home-decor");
    expect(slugify("  Café & Wellness! ")).toBe("cafe-wellness");
  });
});

test.describe("lib/embed", () => {
  test("turns share links into player addresses", () => {
    expect(toEmbed("https://www.youtube.com/watch?v=abc123")?.src).toBe(
      "https://www.youtube-nocookie.com/embed/abc123"
    );
    expect(toEmbed("https://youtu.be/abc123")?.src).toBe("https://www.youtube-nocookie.com/embed/abc123");
    expect(toEmbed("https://vimeo.com/76979871")).toEqual({
      src: "https://player.vimeo.com/video/76979871",
      kind: "video",
    });
    expect(toEmbed("https://open.spotify.com/intl-de/track/4uLU6hMCjMI75M1A2tKUQC")?.src).toBe(
      "https://open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC"
    );
    expect(toEmbed("https://www.instagram.com/p/C1abc/")?.src).toBe(
      "https://www.instagram.com/p/C1abc/embed"
    );
    expect(toEmbed("https://www.tiktok.com/@ruvyne/video/7300000000000000000")?.kind).toBe("post");
    expect(toEmbed("https://example.com/video")).toBeNull();
    expect(toEmbed("not a link")).toBeNull();
  });
});

test.describe("lib/legacyBody", () => {
  test("keeps the old five fields in order as rich text", () => {
    const blocks = legacyToBlocks({
      summary: "Intro.",
      section1: "One.\n\nTwo.",
      quoteText: "A quote",
      quoteAttribution: "Someone",
      summary2: "Bridge.",
      section2: "Three.",
    });
    expect(blocks.map((b) => (b._type === "block" ? b.style : b._type))).toEqual([
      "lead",
      "normal",
      "normal",
      "pullQuote",
      "lead",
      "normal",
    ]);
    expect(new Set(blocks.map((b) => b._key)).size).toBe(blocks.length);
    expect(legacyToBlocks({})).toEqual([]);
  });
});

test.describe("lib/image", () => {
  test("re-bases the focal point onto the crop", () => {
    expect(imageFocus({ hotspot: { x: 0.5, y: 0.25 } })).toBe("50% 25%");
    expect(
      imageFocus({ hotspot: { x: 0.5, y: 0.5 }, crop: { top: 0, bottom: 0, left: 0.5, right: 0 } })
    ).toBe("0% 50%");
    expect(imageFocus({})).toBeUndefined();
    expect(
      imageSize({ asset: { _ref: "image-abc-1000x800-jpg" }, crop: { top: 0.1, bottom: 0.1, left: 0, right: 0.5 } })
    ).toEqual({ width: 500, height: 640 });
  });
});
