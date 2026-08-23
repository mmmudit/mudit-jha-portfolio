import { NextRequest, NextResponse } from "next/server";
import { fetchSpotifyPlaylist, YEARLY_SPOTIFY_PLAYLISTS, extractPlaylistId, type SpotifyTrack } from "@/lib/spotify";

const cacheMap = new Map<string, { data: SpotifyTrack[]; timestamp: number }>();
const TTL = 10 * 60 * 1000; // 10 minutes cache

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");
  const yearParam = req.nextUrl.searchParams.get("year");
  const playlistParam = req.nextUrl.searchParams.get("playlist");
  const forceFresh = req.nextUrl.searchParams.get("fresh") === "true";

  // Resolve target playlist URL or ID
  let target = urlParam || playlistParam;
  if (!target && yearParam && YEARLY_SPOTIFY_PLAYLISTS[yearParam]) {
    target = YEARLY_SPOTIFY_PLAYLISTS[yearParam];
  }
  if (!target) {
    target = YEARLY_SPOTIFY_PLAYLISTS["2026"] || "1ZBq1V7QCXFb7XCm6pB9xI";
  }

  const cacheKey = extractPlaylistId(target);
  const cached = cacheMap.get(cacheKey);

  if (!forceFresh && cached && Date.now() - cached.timestamp < TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const data = await fetchSpotifyPlaylist(target);
    if (data.length > 0) {
      cacheMap.set(cacheKey, { data, timestamp: Date.now() });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/spotify:", error);
    if (cached) return NextResponse.json(cached.data);
    return NextResponse.json({ error: "Failed to fetch Spotify playlist" }, { status: 500 });
  }
}
