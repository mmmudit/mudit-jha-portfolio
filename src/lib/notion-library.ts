// src/lib/notion-library.ts
const NOTION_VERSION = '2022-06-28';
const BASE_URL = 'https://api.notion.com/v1';

export interface LibraryEntry {
  id?: string;
  title: string;
  author?: string;
  status?: string;
  rating?: number;
  finishedDate?: string;
  year?: string;
  category?: string;
  imageUrl?: string;
  link?: string;
  notes?: string;
}

function extractText(prop: any): string {
  if (!prop) return '';
  if (prop.title && Array.isArray(prop.title)) {
    return prop.title.map((t: any) => t.plain_text || t.text?.content || '').join('');
  }
  if (prop.rich_text && Array.isArray(prop.rich_text)) {
    return prop.rich_text.map((t: any) => t.plain_text || t.text?.content || '').join('');
  }
  if (prop.select && prop.select.name) {
    return prop.select.name;
  }
  if (prop.multi_select && Array.isArray(prop.multi_select)) {
    return prop.multi_select.map((m: any) => m.name).join(', ');
  }
  return '';
}

async function notionFetch(path: string, body?: object) {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(14000), // 14s timeout pattern
    });
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (err) {
    console.warn(`Notion fetch error for ${path}:`, err);
    return null;
  }
}

export async function getLibraryEntries(): Promise<LibraryEntry[]> {
  const dbId = process.env.NOTION_LIBRARY_DB_ID?.replace(/-/g, '');
  let results: any[] = [];
  let cursor: string | undefined;

  // 1. Try querying database directly
  if (dbId) {
    do {
      const data = await notionFetch(`/databases/${dbId}/query`, {
        start_cursor: cursor,
        page_size: 100,
      });
      if (data && Array.isArray(data.results)) {
        results.push(...data.results);
        cursor = data.has_more ? data.next_cursor : undefined;
      } else {
        break;
      }
    } while (cursor);
  }

  // 2. If database query returned no results, fallback to search across shared pages
  if (results.length === 0) {
    const searchData = await notionFetch('/search', {
      filter: { value: 'page', property: 'object' },
      page_size: 100,
    });
    if (searchData && Array.isArray(searchData.results)) {
      results = searchData.results;
    }
  }

  // For each page, fetch its block children to find the embedded cover image
  const entries: LibraryEntry[] = await Promise.all(
    results.map(async (page: any) => {
      const props = page.properties || {};

      const blocks = await notionFetch(`/blocks/${page.id}/children`);
      const imageBlock = blocks?.results?.find((b: any) => b.type === 'image');
      const imageUrl =
        imageBlock?.image?.file?.url ??
        imageBlock?.image?.external?.url ??
        page.cover?.file?.url ??
        page.cover?.external?.url ??
        props.Cover?.files?.[0]?.file?.url ??
        props.Cover?.files?.[0]?.external?.url ??
        props.cover?.files?.[0]?.file?.url ??
        props.cover?.files?.[0]?.external?.url;

      const title =
        extractText(props.Title) ||
        extractText(props.title) ||
        extractText(props.Name) ||
        extractText(props.name) ||
        extractText(props.Book) ||
        extractText(props.book) ||
        'Untitled';

      const author =
        extractText(props.Author) ||
        extractText(props.author) ||
        extractText(props.Writer) ||
        extractText(props.writer) ||
        '';

      const status =
        props.Status?.select?.name ||
        props.status?.select?.name ||
        extractText(props.Status);

      const rating =
        typeof props.Rating?.number === 'number'
          ? props.Rating.number
          : typeof props.rating?.number === 'number'
          ? props.rating.number
          : 5;

      const finishedDate =
        props['Finished Date']?.date?.start ||
        props['Finished date']?.date?.start ||
        props['Finish Date']?.date?.start ||
        props['Finish date']?.date?.start ||
        props['Date Finished']?.date?.start ||
        props['Date finished']?.date?.start ||
        props['Finished']?.date?.start ||
        props['finished']?.date?.start ||
        props['Completed Date']?.date?.start ||
        props['Completed date']?.date?.start ||
        props['End Date']?.date?.start ||
        props['End date']?.date?.start ||
        props.Date?.date?.start ||
        props.date?.date?.start ||
        extractText(props['Finished Date']) ||
        extractText(props['Finish Date']) ||
        undefined;

      const year = finishedDate && finishedDate.length >= 4 ? finishedDate.slice(0, 4) : undefined;

      const notesProp =
        extractText(props.Notes) ||
        extractText(props.notes) ||
        extractText(props.Quote) ||
        extractText(props.quote) ||
        extractText(props.Quotes) ||
        extractText(props.Summary) ||
        extractText(props.summary) ||
        extractText(props.Thoughts) ||
        extractText(props.thoughts) ||
        extractText(props.Review) ||
        extractText(props.review) ||
        extractText(props.Takeaways) ||
        extractText(props.takeaways);

      const quoteBlock = blocks?.results?.find(
        (b: any) => b.type === 'quote' || b.type === 'paragraph' || b.type === 'callout'
      );
      const blockNote =
        quoteBlock?.quote?.rich_text?.[0]?.plain_text ||
        quoteBlock?.paragraph?.rich_text?.[0]?.plain_text ||
        quoteBlock?.callout?.rich_text?.[0]?.plain_text ||
        '';

      const notes = notesProp || blockNote || '';

      const category =
        props.Category?.select?.name ||
        props.category?.select?.name ||
        (props.Category?.multi_select?.[0]?.name) ||
        (props.category?.multi_select?.[0]?.name) ||
        extractText(props.Category) ||
        extractText(props.category) ||
        '';

      return {
        id: page.id,
        title,
        author,
        status,
        rating,
        finishedDate,
        year,
        category,
        imageUrl,
        notes,
        link:
          props.Link?.url ||
          props.link?.url ||
          `https://www.google.com/search?q=${encodeURIComponent(`${title} ${author}`)}`,
      };
    })
  );

  return entries;
}
