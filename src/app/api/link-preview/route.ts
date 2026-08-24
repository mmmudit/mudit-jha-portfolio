import { NextRequest, NextResponse } from "next/server";

export interface LinkPreviewData {
  title: string;
  description?: string;
  image?: string;
  domain: string;
  favicon: string;
}

export type LinkMetadata = LinkPreviewData;

// In-memory cache for ultra-fast response times
const cache = new Map<string, { data: LinkPreviewData; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Check in-memory cache
  const cached = cache.get(targetUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  }

  // Handle direct mailto links
  if (targetUrl.startsWith("mailto:") || targetUrl.includes("hello@muditjha.me")) {
    const emailData: LinkPreviewData = {
      title: "Mudit Jha",
      description: "Design Engineer • B.S. CS + UX & Psychology @ University of Minnesota.",
      domain: "muditjha.me",
      favicon: "https://www.google.com/s2/favicons?domain=muditjha.me&sz=64",
      image: "/assets/avatar.png",
    };
    cache.set(targetUrl, { data: emailData, timestamp: Date.now() });
    return NextResponse.json(emailData, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  }

  // Parse and normalize URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const rawHostname = parsedUrl.hostname.toLowerCase();
  const domain = rawHostname.replace(/^www\./, "");
  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  const pathname = parsedUrl.pathname.replace(/^\/+/, "");

  // Minimal fallback object on failure
  const minimalFallback: LinkPreviewData = {
    title: domain,
    description: undefined,
    image: undefined,
    domain,
    favicon,
  };

  // Special handler: Twitter / X with live fxtwitter API
  if (rawHostname.includes("x.com") || rawHostname.includes("twitter.com")) {
    const username = pathname.split("/")[0] || "MuditJ1";
    try {
      const fxRes = await fetch(`https://api.fxtwitter.com/${username}`, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)" },
        signal: AbortSignal.timeout(6000),
      });

      if (fxRes.ok) {
        const fxData = await fxRes.json();
        const user = fxData?.user;
        if (user) {
          const xData: LinkPreviewData = {
            title: `${user.name} (@${user.screen_name})`,
            description: user.description || `Follow @${user.screen_name} on X`,
            domain: "x.com",
            favicon: "https://www.google.com/s2/favicons?domain=x.com&sz=64",
            image: user.banner_url || user.avatar_url?.replace("_normal", "_400x400") || user.avatar_url,
          };
          cache.set(targetUrl, { data: xData, timestamp: Date.now() });
          return NextResponse.json(xData, {
            headers: {
              "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
            },
          });
        }
      }
    } catch {
      // Fall through to general scraper
    }
  }

  // Special handler: GitHub with live user profile API
  if (rawHostname.includes("github.com") && pathname) {
    const username = pathname.split("/")[0];
    if (username && !username.includes("/")) {
      try {
        const ghUserRes = await fetch(`https://api.github.com/users/${username}`, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)" },
          signal: AbortSignal.timeout(6000),
        });

        if (ghUserRes.ok) {
          const ghUser = await ghUserRes.json();
          const ghData: LinkPreviewData = {
            title: `${(ghUser.name as string)?.trim() || username} (${username})`,
            description:
              (ghUser.bio as string) ||
              `${ghUser.public_repos ?? 20} public repositories · ${(ghUser.followers as number)?.toLocaleString() ?? 0} followers`,
            domain: "github.com",
            favicon: "https://www.google.com/s2/favicons?domain=github.com&sz=64",
            image: (ghUser.avatar_url as string) || `https://github.com/${username}.png`,
          };
          cache.set(targetUrl, { data: ghData, timestamp: Date.now() });
          return NextResponse.json(ghData, {
            headers: {
              "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
            },
          });
        }
      } catch {
        // Fall through
      }
    }
  }

  // General server-side fetch with 6s timeout and realistic User-Agent
  try {
    const res = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(6000),
      redirect: "follow",
    });

    if (!res.ok) {
      cache.set(targetUrl, { data: minimalFallback, timestamp: Date.now() });
      return NextResponse.json(minimalFallback, {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
        },
      });
    }

    const html = await res.text();

    const getMeta = (propertyOrName: string): string | undefined => {
      // 1. <meta property="og:..." content="...">
      const propMatch = html.match(
        new RegExp(`<meta[^>]+(?:property|name)=["'](?:og:|twitter:)?${propertyOrName}["'][^>]+content=["']([^"']+)["']`, "i")
      );
      if (propMatch && propMatch[1]) return propMatch[1].trim();

      // 2. <meta content="..." property="og:...">
      const revMatch = html.match(
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:|twitter:)?${propertyOrName}["']`, "i")
      );
      if (revMatch && revMatch[1]) return revMatch[1].trim();

      return undefined;
    };

    // Extract Title: og:title -> twitter:title -> <title>
    const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = getMeta("title") || (titleTagMatch ? titleTagMatch[1].trim() : domain);

    // Extract Description: og:description -> twitter:description -> name="description"
    const description = getMeta("description") || getMeta("summary");

    // Extract Image: og:image -> twitter:image:src -> twitter:image
    let image = getMeta("image") || getMeta("image:src");
    if (image && !image.startsWith("http")) {
      try {
        image = new URL(image, parsedUrl.origin).toString();
      } catch {
        image = undefined;
      }
    }

    const result: LinkPreviewData = {
      title,
      description,
      image,
      domain,
      favicon,
    };

    cache.set(targetUrl, { data: result, timestamp: Date.now() });
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch {
    // Graceful fallback on network timeout or parse failure
    cache.set(targetUrl, { data: minimalFallback, timestamp: Date.now() });
    return NextResponse.json(minimalFallback, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  }
}
