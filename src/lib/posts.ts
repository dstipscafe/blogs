import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';
import { BASE_PATH } from './site';

const POSTS_DIR = path.join(process.cwd(), 'content', 'post');

export interface TocItem {
  depth: number;
  text: string;
  id: string;
}

export interface PostMeta {
  title: string;
  description: string;
  slug: string;
  date: string;
  image: string | null;
  categories: string[];
  tags: string[];
  readingTime: number;
}

export interface Post extends PostMeta {
  content: string;
  toc: TocItem[];
}

function findPostFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPostFiles(full));
    } else if (entry.name === 'index.md') {
      results.push(full);
    }
  }
  return results;
}

function parseDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  const s = String(value ?? '').trim();
  // Hugo style: 2024-08-30 16:00:00+0800
  const normalized = s.replace(' ', 'T').replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString();
}

function stripCodeBlocks(md: string): string {
  return md.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}

function computeReadingTime(md: string): number {
  const text = stripCodeBlocks(md);
  const cjk = (text.match(/[一-鿿㐀-䶿]/g) ?? []).length;
  const words = (text.replace(/[一-鿿㐀-䶿]/g, ' ').match(/[a-zA-Z0-9]+/g) ?? []).length;
  return Math.max(1, Math.ceil(cjk / 500 + words / 200));
}

function extractToc(md: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  for (const line of stripCodeBlocks(md).split('\n')) {
    const m = line.match(/^(#{2,4})\s+(.+?)\s*$/);
    if (!m) continue;
    const text = m[2].replace(/[*_`]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1');
    items.push({ depth: m[1].length, text, id: slugger.slug(text) });
  }
  return items;
}

const NOTICE_LABELS: Record<string, string> = {
  info: 'Info',
  note: 'Note',
  tip: 'Tip',
  tips: 'Tip',
  warning: 'Warning',
};

function convertShortcodes(md: string): string {
  return md
    .replace(/\{\{[<%]\s*notice\s+(\w+)\s*[>%]\}\}/g, (_, rawType: string) => {
      const type = rawType.toLowerCase();
      const label = NOTICE_LABELS[type] ?? rawType;
      const variant = type === 'tips' ? 'tip' : type;
      return `<div class="notice notice-${variant}"><div class="notice-title">${label}</div><div class="notice-content">\n`;
    })
    .replace(/\{\{[<%]\s*\/notice\s*[>%]\}\}/g, '\n</div></div>');
}

function rewriteRelativeImages(md: string, slug: string): string {
  const prefix = `${BASE_PATH}/post-assets/${slug}/`;
  return md.replace(/(!\[[^\]]*\]\()([^)\s]+)(\))/g, (whole, open, url, close) => {
    if (/^(https?:)?\/\//.test(url) || url.startsWith('/') || url.startsWith('data:')) return whole;
    return `${open}${prefix}${url}${close}`;
  });
}

function resolveCover(image: unknown, slug: string): string | null {
  if (!image) return null;
  const s = String(image);
  if (/^(https?:)?\/\//.test(s) || s.startsWith('/')) return s;
  return `${BASE_PATH}/post-assets/${slug}/${s}`;
}

function loadPost(filePath: string): Post {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const slug = String(data.slug ?? path.basename(path.dirname(filePath)));
  const processed = rewriteRelativeImages(convertShortcodes(content), slug);
  return {
    title: String(data.title ?? slug),
    description: String(data.description ?? ''),
    slug,
    date: parseDate(data.date),
    image: resolveCover(data.image, slug),
    categories: (data.categories ?? []).map(String),
    tags: (data.tags ?? []).map(String),
    readingTime: computeReadingTime(content),
    content: processed,
    toc: extractToc(content),
  };
}

let cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (!cache) {
    cache = findPostFiles(POSTS_DIR)
      .map(loadPost)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }
  return cache;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function taxonomySlug(name: string): string {
  const slugger = new GithubSlugger();
  return slugger.slug(name);
}

export interface TaxonomyEntry {
  name: string;
  slug: string;
  posts: Post[];
}

function collectTaxonomy(key: 'categories' | 'tags'): TaxonomyEntry[] {
  const map = new Map<string, TaxonomyEntry>();
  for (const post of getAllPosts()) {
    for (const name of post[key]) {
      const slug = taxonomySlug(name);
      const entry = map.get(slug) ?? { name, slug, posts: [] };
      entry.posts.push(post);
      map.set(slug, entry);
    }
  }
  return [...map.values()].sort((a, b) => b.posts.length - a.posts.length);
}

export function getAllCategories(): TaxonomyEntry[] {
  return collectTaxonomy('categories');
}

export function getAllTags(): TaxonomyEntry[] {
  return collectTaxonomy('tags');
}
