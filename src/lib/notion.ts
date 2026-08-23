export interface NotionBook {
  id: string;
  title: string;
  author: string;
  year: string;
  finishedDate?: string;
  category?: string;
  coverImage?: string;
  rating?: number;
  status?: string;
  notes?: string;
  link?: string;
}

export const FALLBACK_BOOKS: NotionBook[] = [
  {
    id: "sisyphus",
    title: "The Myth of Sisyphus",
    author: "Albert Camus",
    year: "2026",
    status: "Reading",
    rating: 5,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
    link: "https://www.google.com/search?q=The+Myth+of+Sisyphus+Albert+Camus",
    notes: "One must imagine Sisyphus happy. The struggle itself toward the heights is enough to fill a man's heart.",
  },
  {
    id: "creative-act",
    title: "The Creative Act",
    author: "Rick Rubin",
    year: "2026",
    finishedDate: "2026-02-14",
    status: "Read",
    rating: 5,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400",
    link: "https://www.google.com/search?q=The+Creative+Act+Rick+Rubin",
    notes: "The universe is only as large as our perception of it. When we cultivate our awareness, we expand our world.",
  },
  {
    id: "grid-systems",
    title: "Grid Systems",
    author: "Josef Müller-Brockmann",
    year: "2026",
    finishedDate: "2026-01-20",
    status: "Read",
    rating: 5,
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400",
    link: "https://www.google.com/search?q=Grid+Systems+in+Graphic+Design",
    notes: "The grid system is an aid, not a guarantee. It permits a number of possible uses and each designer can look for a solution appropriate to his personal style.",
  },
  {
    id: "refactoring-ui",
    title: "Refactoring UI",
    author: "Adam Wathan & Steve Schoger",
    year: "2026",
    status: "Reading",
    rating: 5,
    coverImage: "https://images.unsplash.com/photo-1507842229450-7265a6e2d93e?auto=format&fit=crop&q=80&w=400",
    link: "https://refactoringui.com/",
    notes: "Design with hierarchy, not color. Let typography, spacing, and contrast do the heavy lifting.",
  },
  {
    id: "build",
    title: "Build",
    author: "Tony Fadell",
    year: "2025",
    finishedDate: "2025-11-10",
    status: "Read",
    rating: 5,
    coverImage: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&q=80&w=400",
    link: "https://www.google.com/search?q=Build+Tony+Fadell",
    notes: "Look around you. Everything you see was created by someone who is no smarter than you. You can build things too.",
  },
  {
    id: "make-something",
    title: "Make Something",
    author: "Steve Jobs Archive",
    year: "2025",
    finishedDate: "2025-08-04",
    status: "Read",
    rating: 5,
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400",
    link: "https://stevejobsarchive.com/book",
    notes: "One of the ways that I believe people express their appreciation to the rest of humanity is to make something wonderful and put it out there.",
  },
  {
    id: "steal-like-artist",
    title: "Steal Like An Artist",
    author: "Austin Kleon",
    year: "2024",
    finishedDate: "2024-04-12",
    status: "Read",
    rating: 5,
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400",
    link: "https://austinkleon.com/steal/",
    notes: "You don't need to be a genius, you just need to be yourself. That's the one thing you have that nobody else has.",
  },
];

function extractPlainText(property: any): string {
  if (!property) return "";
  if (property.type === "title" && Array.isArray(property.title)) {
    return property.title.map((t: any) => t.plain_text || t.text?.content || "").join("");
  }
  if (property.type === "rich_text" && Array.isArray(property.rich_text)) {
    return property.rich_text.map((t: any) => t.plain_text || t.text?.content || "").join("");
  }
  if (property.type === "select" && property.select) {
    return property.select.name || "";
  }
  if (property.type === "url") {
    return property.url || "";
  }
  if (property.type === "number") {
    return String(property.number ?? "");
  }
  return "";
}

function extractCover(page: any): string | undefined {
  if (page.cover?.external?.url) return page.cover.external.url;
  if (page.cover?.file?.url) return page.cover.file.url;
  if (page.properties?.Cover?.files?.[0]?.file?.url) {
    return page.properties.Cover.files[0].file.url;
  }
  if (page.properties?.Cover?.files?.[0]?.external?.url) {
    return page.properties.Cover.files[0].external.url;
  }
  if (page.properties?.["Cover URL"]?.url) {
    return page.properties["Cover URL"].url;
  }
  return undefined;
}

export async function fetchNotionBooks(): Promise<NotionBook[]> {
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_LIBRARY_DB_ID;

  if (!apiKey) {
    return FALLBACK_BOOKS;
  }

  let pages: any[] = [];

  // 1. Try direct database query if dbId is specified
  if (dbId) {
    try {
      const cleanDbId = dbId.replace(/-/g, "");
      const res = await fetch(`https://api.notion.com/v1/databases/${cleanDbId}/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results) && data.results.length > 0) {
          pages = data.results;
        }
      }
    } catch (err) {
      console.warn("Direct Notion DB query failed, falling back to search:", err);
    }
  }

  // 2. Fall back to search endpoint across all shared pages in Notion
  if (pages.length === 0) {
    try {
      const searchRes = await fetch("https://api.notion.com/v1/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: { value: "page", property: "object" },
          page_size: 100,
        }),
        cache: "no-store",
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (Array.isArray(searchData.results)) {
          pages = searchData.results.filter((p: any) => {
            const props = p.properties || {};
            return props.Title || props.Name || props.Author || props.Rating;
          });
        }
      }
    } catch (err) {
      console.warn("Notion search failed:", err);
    }
  }

  if (pages.length === 0) {
    return FALLBACK_BOOKS;
  }

  const parsedBooks: NotionBook[] = pages.map((page: any) => {
    const props = page.properties || {};

    const title =
      extractPlainText(props.Title) ||
      extractPlainText(props.Name) ||
      extractPlainText(props.Book) ||
      "Untitled Book";

    const author =
      extractPlainText(props.Author) ||
      extractPlainText(props.Writer) ||
      "Unknown Author";

    let year = "2026";
    if (props["Finished Date"]?.date?.start) {
      year = props["Finished Date"].date.start.slice(0, 4);
    } else if (props.Year?.number) {
      year = String(props.Year.number);
    } else if (props.Year?.select?.name) {
      year = props.Year.select.name;
    }

    const rating =
      typeof props.Rating?.number === "number"
        ? props.Rating.number
        : props.Rating?.select?.name
        ? parseInt(props.Rating.select.name, 10) || 5
        : 5;

    const status = extractPlainText(props.Status);
    const category =
      props.Category?.select?.name ||
      props.category?.select?.name ||
      props.Category?.multi_select?.[0]?.name ||
      props.category?.multi_select?.[0]?.name ||
      extractPlainText(props.Category) ||
      extractPlainText(props.category);
    const notes = extractPlainText(props.Notes);
    const coverImage = extractCover(page);
    const link =
      props.Link?.url ||
      `https://www.google.com/search?q=${encodeURIComponent(`${title} ${author}`)}`;

    return {
      id: page.id,
      title,
      author,
      year,
      category,
      coverImage,
      rating,
      status,
      notes,
      link,
    };
  });

  // Combine live books from Notion with fallback items so the carousel stays full and rich
  const combined = [...parsedBooks];
  for (const fb of FALLBACK_BOOKS) {
    if (!combined.some((b) => b.title.toLowerCase() === fb.title.toLowerCase())) {
      combined.push(fb);
    }
  }

  return combined;
}
