import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "./sanity.client";

// An image field as Sanity stores it, including the crop and focal point the
// editor sets with the crop tool.
export type SanityImage =
  | {
      asset?: { _ref?: string } | null;
      crop?: { top: number; bottom: number; left: number; right: number } | null;
      hotspot?: { x: number; y: number } | null;
      alt?: string;
    }
  | null
  | undefined;

const builder = projectId ? imageUrlBuilder({ projectId, dataset }) : null;

// The editor's crop is part of the URL; next/image does the resizing.
export function imageUrl(image: SanityImage, maxWidth = 2000) {
  if (!builder || !image?.asset?._ref) return "";
  return builder
    .image(image as SanityImageSource)
    .width(maxWidth)
    .fit("max")
    .url();
}

// 1200 x 630 around the editor's focal point, the size link previews use.
export function shareImageUrl(image: SanityImage) {
  if (!builder || !image?.asset?._ref) return "";
  return builder.image(image as SanityImageSource).width(1200).height(630).url();
}

// The editor's focal point as CSS object-position, so object-cover keeps the
// subject in frame at any aspect ratio. Hotspots are relative to the whole
// photo, so they are re-based onto the cropped area first.
export function imageFocus(image: SanityImage) {
  const hotspot = image?.hotspot;
  if (!hotspot) return undefined;
  const crop = image?.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const within = (point: number, start: number, end: number) =>
    Math.min(1, Math.max(0, (point - start) / (1 - start - end)));
  const pct = (value: number) => `${Math.round(value * 1000) / 10}%`;
  return `${pct(within(hotspot.x, crop.left, crop.right))} ${pct(
    within(hotspot.y, crop.top, crop.bottom)
  )}`;
}

// Width and height after the crop, read from the asset id
// ("image-<hash>-1500x2250-jpg"), for images shown at their natural shape.
export function imageSize(image: SanityImage) {
  const match = /-(\d+)x(\d+)-/.exec(image?.asset?._ref ?? "");
  if (!match) return { width: 1600, height: 1067 };
  const crop = image?.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  return {
    width: Math.round(+match[1] * (1 - crop.left - crop.right)),
    height: Math.round(+match[2] * (1 - crop.top - crop.bottom)),
  };
}
