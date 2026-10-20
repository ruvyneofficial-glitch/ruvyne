import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Sanity uploads are resized on the image CDN; bundled files are served as is.
export function logoSrc(logo: { url: string }, height: number) {
  return logo.url.startsWith("https://cdn.sanity.io/")
    ? `${logo.url}?h=${height}&fit=max&auto=format`
    : logo.url;
}
