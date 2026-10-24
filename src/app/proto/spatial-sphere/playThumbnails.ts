import 'server-only';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { DragCanvasItem } from '@/components/DragCanvas';

function escape(value: string) {
  return value.replace(/[<>&"']/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character]!);
}

async function textThumbnail(item: DragCanvasItem) {
  const titleWords = item.title.split(/\s+/);
  const lines: string[] = [];
  for (const word of titleWords) {
    const last = lines.length - 1;
    if (last < 0 || lines[last].length + word.length > 23) lines.push(word);
    else lines[last] += ` ${word}`;
  }
  const textLayers = [
    { text: item.tag || item.type || '', font: 'sans 14', top: 40, color: '#5e6869' },
    { text: lines.slice(0, 5).join('\n'), font: 'sans 28', top: 100, color: '#303034' },
    { text: item.year || '', font: 'sans 14', top: 330, color: '#5e6869' },
  ].filter(layer => layer.text);

  // Render text directly: this path does not depend on an SVG decoder.
  return sharp({ create: { width: 512, height: 384, channels: 4, background: '#faf9f4' } })
    .composite(textLayers.map(layer => ({
      input: { text: { text: `<span foreground="${layer.color}">${escape(layer.text)}</span>`, font: layer.font, width: 432, rgba: true } },
      top: layer.top,
      left: 40,
    })))
    .webp({ quality: 80 })
    .toBuffer();
}

export async function playThumbnail(item: DragCanvasItem): Promise<string> {
  if (item.imageSrc?.startsWith('https://')) {
    const url = new URL(item.imageSrc);
    if (url.hostname === 'cdn.sanity.io' || url.hostname === 'images.unsplash.com') {
      url.searchParams.delete('auto');
      url.searchParams.set('w', '512');
      url.searchParams.set('h', '512');
      url.searchParams.set('fit', 'max');
      url.searchParams.set('fm', 'webp');
      return url.toString();
    }
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`Thumbnail fetch failed for ${item.id}: ${response.status}`);
    const thumbnail = await sharp(Buffer.from(await response.arrayBuffer())).resize(512, 512, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    return `data:image/webp;base64,${thumbnail.toString('base64')}`;
  }
  let thumbnail: Buffer;
  if (item.imageSrc?.startsWith('/')) {
    const publicRoot = path.resolve(process.cwd(), 'public');
    const file = path.resolve(publicRoot, `.${item.imageSrc}`);
    if (!file.startsWith(`${publicRoot}${path.sep}`)) throw new Error(`Invalid thumbnail path: ${item.id}`);
    thumbnail = await sharp(await readFile(file)).resize(512, 512, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  } else if (item.videoSrc === '/intro.mp4') {
    thumbnail = await readFile(path.join(process.cwd(), 'public/spatial-thumbnails/intro.webp'));
  } else {
    thumbnail = await textThumbnail(item);
  }
  return `data:image/webp;base64,${thumbnail.toString('base64')}`;
}
