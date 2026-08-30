export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";

export const sanityConfigured = Boolean(projectId);

export async function sanityFetch<T>(
  query: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T | null> {
  if (!projectId) return null;

  const search = new URLSearchParams({ query });
  for (const [key, value] of Object.entries(params)) {
    search.set(`$${key}`, JSON.stringify(value));
  }

  const url =
    `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/` +
    `${dataset}?${search.toString()}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    } as RequestInit);

    if (!res.ok) {
      console.warn(`[sanity] query failed with HTTP ${res.status}`);
      return null;
    }

    const body = (await res.json()) as { result?: T };
    return body.result ?? null;
  } catch (error) {
    console.warn(
      `[sanity] query failed, falling back to local JSON: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return null;
  }
}
