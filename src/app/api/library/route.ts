import { getLibraryEntries } from '@/lib/notion-library';
import { NextRequest } from 'next/server';

let cache: { data: any; timestamp: number } | null = null;
const TTL = 5 * 60 * 1000; // 5 min cache for Notion's expiring signed URLs

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';
  const forceFresh = req.nextUrl.searchParams.get('fresh') === 'true';

  if (!isDev && !forceFresh && cache && Date.now() - cache.timestamp < TTL) {
    return Response.json(cache.data);
  }

  try {
    const data = await getLibraryEntries();
    cache = { data, timestamp: Date.now() };
    return Response.json(data);
  } catch (err) {
    if (cache) return Response.json(cache.data); // stale fallback
    return Response.json({ error: 'Failed to fetch library' }, { status: 500 });
  }
}
