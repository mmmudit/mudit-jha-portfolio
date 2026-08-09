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
  year,
  description,
  "image": image.asset->url,
  gradient,
  href,
  actionText
}`;

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && (slug.current == $slug || _id == $slug)][0]{
  _id,
  title,
  "slug": slug.current,
  year,
  description,
  "image": image.asset->url,
  gradient,
  href,
  actionText
}`;

export function defineQuery(query: string) {
  return query;
}
