const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "mr1ttplh";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2024-01-01";

export const client = {
  async fetch<T>(query: string, params: Record<string, any> = {}, options: any = {}): Promise<T> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const paramPairs = Object.entries(params).map(
        ([key, val]) => `$${key}=${encodeURIComponent(JSON.stringify(val))}`
      );
      const paramQuery = paramPairs.length > 0 ? `&${paramPairs.join("&")}` : "";
      const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodedQuery}${paramQuery}`;

      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store",
        },
      });

      if (!res.ok) {
        throw new Error(`Sanity fetch failed: ${res.statusText}`);
      }

      const json = await res.json();
      return json.result as T;
    } catch (error) {
      console.warn("Sanity fetch error:", error);
      throw error;
    }
  },
};
