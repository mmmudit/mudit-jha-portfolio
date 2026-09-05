export const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc, _createdAt desc){
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage
}`;

export const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  body
}`;

export const PROJECTS_QUERY = `*[_type == "project"] | order(order asc, _createdAt desc){
  _id,
  title,
  "slug": slug.current,
  tagline,
  year,
  description,
  projectType,
  event,
  role,
  team,
  skills,
  "image": coalesce(image.asset->url, cardThumbnail.asset->url),
  "navIcon": coalesce(navIcon.asset->url, icon.asset->url),
  "cardThumbnail": cardThumbnail.asset->url,
  "cardDemo": cardDemo.asset->url,
  "muxVideo": muxVideo.asset->{
    playbackId,
    assetId,
    filename,
    thumbTime,
    status,
    data {
      aspect_ratio,
      duration
    }
  },
  "muxPlaybackId": coalesce(muxVideo.asset->playbackId, video.asset->playbackId),
  "muxThumbTime": coalesce(muxVideo.asset->thumbTime, video.asset->thumbTime),
  heroMedia {
    mediaType,
    "image": image.asset->url,
    video,
    "muxVideo": muxVideo.asset->{
      playbackId,
      assetId,
      filename,
      thumbTime,
      status,
      data {
        aspect_ratio,
        duration
      }
    },
    "muxPlaybackId": coalesce(muxVideo.asset->playbackId, video.asset->playbackId),
    "muxThumbTime": coalesce(muxVideo.asset->thumbTime, video.asset->thumbTime),
    alt,
    caption,
    placeholderTitle,
    borderless
  },
  gradient,
  href,
  externalLinkLabel,
  actionText,
  cursorLabel,
  order,
  snapshot {
    role,
    team,
    challenge,
    concept
  },
  introParagraphs,
  metadata[]{
    _key,
    label,
    value,
    href,
    items[]{
      _key,
      text,
      href
    }
  },
  content[]{
    _key,
    _type,
    id,
    eyebrow,
    heading,
    body,
    subheading,
    largeQuestion,
    number,
    context,
    decision,
    why,
    tradeoff,
    decisionPoints[]{_key, title, body},
    variant,
    mediaType,
    "image": image.asset->url,
    video,
    "muxVideo": muxVideo.asset->{playbackId, assetId, filename, thumbTime, status, data {aspect_ratio, duration}},
    "muxPlaybackId": muxVideo.asset->playbackId,
    "muxThumbTime": muxVideo.asset->thumbTime,
    alt,
    caption,
    borderless,
    images[]{_key, "image": asset->url, alt, caption},
    steps[]{_key, title, body, "image": image.asset->url, alt},
    "beforeImage": beforeImage.asset->url,
    beforeLabel,
    "afterImage": afterImage.asset->url,
    afterLabel,
    items[]{_key, value, label, detail, number, heading, body}
  },
  caseStudy[]{
    _type,
    _key,
    id,
    eyebrow,
    heading,
    title,
    body,
    subheading,
    largeQuestion,
    context,
    decision,
    why,
    tradeoff,
    pipeline,
    conclusion,
    decisionPoints[]{
      title,
      body
    },
    cards[]{
      _key,
      title,
      body
    },
    mediaType,
    figmaUrl,
    aspectRatio,
    size,
    borderless,
    alt,
    caption,
    placeholderTitle,
    beforeLabel,
    afterLabel,
    "image": image.asset->url,
    "video": video,
    "muxVideo": muxVideo.asset->{
      playbackId,
      assetId,
      filename,
      thumbTime,
      status,
      data {
        aspect_ratio,
        duration
      }
    },
    "muxPlaybackId": coalesce(muxVideo.asset->playbackId, video.asset->playbackId),
    "muxThumbTime": coalesce(muxVideo.asset->thumbTime, video.asset->thumbTime),
    "beforeMedia": beforeMedia.asset->url,
    "afterMedia": afterMedia.asset->url,
    annotation {
      text,
      type,
      position
    },
    features[]{
      _key,
      number,
      title,
      body,
      mediaType,
      caption,
      placeholderTitle,
      "image": image.asset->url,
      "video": video,
      "muxVideo": muxVideo.asset->{
        playbackId,
        assetId,
        filename,
        thumbTime,
        status,
        data {
          aspect_ratio,
          duration
        }
      },
      "muxPlaybackId": coalesce(muxVideo.asset->playbackId, video.asset->playbackId),
      "muxThumbTime": coalesce(muxVideo.asset->thumbTime, video.asset->thumbTime)
    },
    subsections[]{
      _key,
      title,
      body,
      placeholderTitle,
      "media": media.asset->url
    },
    items[]{
      _key,
      number,
      heading,
      body
    }
  }
}`;

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && (slug.current == $slug || _id == $slug)][0]{
  _id,
  title,
  "slug": slug.current,
  tagline,
  year,
  description,
  projectType,
  event,
  role,
  team,
  skills,
  "image": coalesce(image.asset->url, cardThumbnail.asset->url),
  "navIcon": coalesce(navIcon.asset->url, icon.asset->url),
  "cardThumbnail": cardThumbnail.asset->url,
  "cardDemo": cardDemo.asset->url,
  "muxVideo": muxVideo.asset->{
    playbackId,
    assetId,
    filename,
    thumbTime,
    status,
    data {
      aspect_ratio,
      duration
    }
  },
  "muxPlaybackId": coalesce(muxVideo.asset->playbackId, video.asset->playbackId),
  "muxThumbTime": coalesce(muxVideo.asset->thumbTime, video.asset->thumbTime),
  heroMedia {
    mediaType,
    "image": image.asset->url,
    video,
    "muxVideo": muxVideo.asset->{
      playbackId,
      assetId,
      filename,
      thumbTime,
      status,
      data {
        aspect_ratio,
        duration
      }
    },
    "muxPlaybackId": coalesce(muxVideo.asset->playbackId, video.asset->playbackId),
    "muxThumbTime": coalesce(muxVideo.asset->thumbTime, video.asset->thumbTime),
    alt,
    caption,
    placeholderTitle,
    borderless
  },
  gradient,
  href,
  externalLinkLabel,
  actionText,
  cursorLabel,
  order,
  snapshot {
    role,
    team,
    challenge,
    concept
  },
  introParagraphs,
  metadata[]{
    _key,
    label,
    value,
    href,
    items[]{
      _key,
      text,
      href
    }
  },
  content[]{
    _key,
    _type,
    id,
    eyebrow,
    heading,
    body,
    subheading,
    largeQuestion,
    number,
    context,
    decision,
    why,
    tradeoff,
    decisionPoints[]{_key, title, body},
    variant,
    mediaType,
    "image": image.asset->url,
    video,
    "muxVideo": muxVideo.asset->{playbackId, assetId, filename, thumbTime, status, data {aspect_ratio, duration}},
    "muxPlaybackId": muxVideo.asset->playbackId,
    "muxThumbTime": muxVideo.asset->thumbTime,
    alt,
    caption,
    borderless,
    images[]{_key, "image": asset->url, alt, caption},
    steps[]{_key, title, body, "image": image.asset->url, alt},
    "beforeImage": beforeImage.asset->url,
    beforeLabel,
    "afterImage": afterImage.asset->url,
    afterLabel,
    items[]{_key, value, label, detail, number, heading, body}
  },
  caseStudy[]{
    _type,
    _key,
    id,
    eyebrow,
    heading,
    title,
    body,
    subheading,
    largeQuestion,
    context,
    decision,
    why,
    tradeoff,
    pipeline,
    conclusion,
    decisionPoints[]{
      title,
      body
    },
    cards[]{
      _key,
      title,
      body
    },
    mediaType,
    figmaUrl,
    aspectRatio,
    size,
    borderless,
    alt,
    caption,
    placeholderTitle,
    beforeLabel,
    afterLabel,
    "image": image.asset->url,
    "video": video,
    "muxVideo": muxVideo.asset->{
      playbackId,
      assetId,
      filename,
      thumbTime,
      status,
      data {
        aspect_ratio,
        duration
      }
    },
    "muxPlaybackId": coalesce(muxVideo.asset->playbackId, video.asset->playbackId),
    "muxThumbTime": coalesce(muxVideo.asset->thumbTime, video.asset->thumbTime),
    "beforeMedia": beforeMedia.asset->url,
    "afterMedia": afterMedia.asset->url,
    annotation {
      text,
      type,
      position
    },
    features[]{
      _key,
      number,
      title,
      body,
      mediaType,
      caption,
      placeholderTitle,
      "image": image.asset->url,
      "video": video,
      "muxVideo": muxVideo.asset->{
        playbackId,
        assetId,
        filename,
        thumbTime,
        status,
        data {
          aspect_ratio,
          duration
        }
      },
      "muxPlaybackId": coalesce(muxVideo.asset->playbackId, video.asset->playbackId),
      "muxThumbTime": coalesce(muxVideo.asset->thumbTime, video.asset->thumbTime)
    },
    subsections[]{
      _key,
      title,
      body,
      placeholderTitle,
      "media": media.asset->url
    },
    items[]{
      _key,
      number,
      heading,
      body
    }
  }
}`;

export const BOOKS_QUERY = `*[_type == "book"] | order(order asc, _createdAt desc){
  _id,
  title,
  author,
  authorInitials,
  spineColor,
  spineTextColor,
  "coverImage": coverImage.asset->url,
  link,
  order
}`;

export const TUNES_QUERY = `*[_type == "tune"] | order(order asc, _createdAt desc){
  _id,
  title,
  artist,
  album,
  "coverImage": coverImage.asset->url,
  gradient,
  link,
  audioPreviewUrl,
  order
}`;

export const PLAY_ITEMS_QUERY = `*[_type == "playItem" && !(_id in path("drafts.**"))] | order(order asc, _createdAt desc){
  _id,
  "id": _id,
  title,
  category,
  tag,
  year,
  description,
  badge,
  href,
  link,
  x,
  y,
  width,
  size,
  rotation,
  "image": image.asset->url,
  "video": video.asset->url,
  mediaUrl,
  "src": coalesce(mediaUrl, video.asset->url, image.asset->url),
  gradient,
  type,
  itemCount,
  accentColor,
  tags,
  details,
  order
}`;

export function defineQuery(query: string) {
  return query;
}
