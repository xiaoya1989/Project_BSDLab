import { getLocalizedPost, parsePostFile, sortPosts } from "./post-format";

const postFiles = import.meta.glob("../../content/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export const allPosts = sortPosts(
  Object.entries(postFiles).map(([path, raw]) => parsePostFile(raw, path)),
);

export function getPostsForLanguage(lang = "en") {
  return allPosts.map((post) => getLocalizedPost(post, lang));
}

export function getPostBySlug(slug, lang = "en") {
  const match = allPosts.find((post) => post.slug === slug);
  return match ? getLocalizedPost(match, lang) : null;
}
