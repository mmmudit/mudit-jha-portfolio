export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  year: string;
  coverImage?: string;
  link: string;
}

// Add or update yearly Spotify playlist links here:
export const YEARLY_SPOTIFY_PLAYLISTS: Record<string, string> = {
  "2026": "https://open.spotify.com/playlist/37i9dQZF1FwMoSIy0nla74?si=iP3nH7nJSk-URxzk5eU9mw",
  "2025": "https://open.spotify.com/playlist/37i9dQZF1FwJt0rUtZYi78?si=B6jUbK9BTSCp8Q6PfVrx6w",
  "2024": "https://open.spotify.com/playlist/37i9dQZF1Fx3ftslsMMFqT?si=dteLJOJNTJOfOXyhW1pORw",
};

export function extractPlaylistId(urlOrId: string): string {
  if (!urlOrId) return "1ZBq1V7QCXFb7XCm6pB9xI";
  if (urlOrId.includes("playlist/")) {
    const after = urlOrId.split("playlist/")[1];
    return after.split("?")[0].split("/")[0];
  }
  return urlOrId.split("?")[0];
}

export async function fetchSpotifyPlaylist(
  playlistUrlOrId: string = YEARLY_SPOTIFY_PLAYLISTS["2026"]
): Promise<SpotifyTrack[]> {
  try {
    const cleanId = extractPlaylistId(playlistUrlOrId);

    const embedRes = await fetch(`https://open.spotify.com/embed/playlist/${cleanId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 },
    });

    if (!embedRes.ok) {
      console.warn(`Spotify embed fetch failed (${embedRes.status}) for ${cleanId}`);
      return [];
    }

    const html = await embedRes.text();
    const nextDataMatch = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/
    );

    if (!nextDataMatch) {
      console.warn("Could not find __NEXT_DATA__ in Spotify embed page");
      return [];
    }

    const nextData = JSON.parse(nextDataMatch[1]);
    const rawTracks = nextData.props?.pageProps?.state?.data?.entity?.trackList || [];

    // Reverse tracks so most recently added songs appear first
    const orderedTracks = [...rawTracks].reverse();

    // Fetch oEmbed in parallel for all tracks to get official high-res album cover images
    const tracks: SpotifyTrack[] = await Promise.all(
      orderedTracks.map(async (t: any) => {
        const trackId = (t.uri || "").replace("spotify:track:", "");
        let coverImage: string | undefined = undefined;

        try {
          const oembedRes = await fetch(
            `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${trackId}`
          );
          if (oembedRes.ok) {
            const oembed = await oembedRes.json();
            coverImage = oembed.thumbnail_url;
          }
        } catch {
          // Ignore oEmbed individual failure
        }

        // Clean subtitle/artist formatting (replace non-breaking spaces)
        const cleanArtist = (t.subtitle || "").replace(/\u00a0/g, " ");

        return {
          id: trackId || t.uid || Math.random().toString(),
          title: t.title || "Untitled Track",
          artist: cleanArtist || "Unknown Artist",
          year: "2026",
          coverImage,
          link: `https://open.spotify.com/track/${trackId}`,
        };
      })
    );

    return tracks;
  } catch (err) {
    console.error("Failed to sync Spotify playlist:", err);
    return [];
  }
}
