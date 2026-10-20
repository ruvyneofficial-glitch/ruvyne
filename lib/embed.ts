// Turns a pasted share link into the player address the service allows on
// other sites. Used by the Studio (to reject links it cannot embed) and by
// the article renderer.

export type Embed = {
  src: string;
  kind: "video" | "audio" | "post";
};

export function toEmbed(link: string): Embed | null {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m)\./, "");
  const parts = url.pathname.split("/").filter(Boolean);

  if (host === "youtu.be" && parts[0]) {
    return { src: `https://www.youtube-nocookie.com/embed/${parts[0]}`, kind: "video" };
  }
  if (host === "youtube.com") {
    const id =
      url.searchParams.get("v") ??
      (["shorts", "embed", "live"].includes(parts[0]) ? parts[1] : undefined);
    return id ? { src: `https://www.youtube-nocookie.com/embed/${id}`, kind: "video" } : null;
  }
  if (host === "vimeo.com" && /^\d+$/.test(parts[0] ?? "")) {
    return { src: `https://player.vimeo.com/video/${parts[0]}`, kind: "video" };
  }
  if (host === "open.spotify.com") {
    const [type, id] = parts.filter((p) => !p.startsWith("intl-"));
    return type && id ? { src: `https://open.spotify.com/embed/${type}/${id}`, kind: "audio" } : null;
  }
  if (host === "instagram.com" && ["p", "reel"].includes(parts[0]) && parts[1]) {
    return { src: `https://www.instagram.com/${parts[0]}/${parts[1]}/embed`, kind: "post" };
  }
  if (host === "tiktok.com") {
    const id = parts[parts.indexOf("video") + 1];
    return parts.includes("video") && id
      ? { src: `https://www.tiktok.com/embed/v2/${id}`, kind: "post" }
      : null;
  }
  return null;
}
