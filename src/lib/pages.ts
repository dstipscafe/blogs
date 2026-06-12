import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const PAGES_DIR = path.join(process.cwd(), 'content', 'page');

export function getPage(dir: string): { data: Record<string, unknown>; content: string } {
  const raw = fs.readFileSync(path.join(PAGES_DIR, dir, 'index.md'), 'utf8');
  const { data, content } = matter(raw);
  return { data, content };
}
