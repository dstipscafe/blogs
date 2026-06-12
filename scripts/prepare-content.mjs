import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'content', 'post');
const ASSETS_OUT = path.join(ROOT, 'public', 'post-assets');
const SEARCH_INDEX_OUT = path.join(ROOT, 'public', 'search-index.json');

function findPostFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findPostFiles(full));
    else if (entry.name === 'index.md') results.push(full);
  }
  return results;
}

function plainText(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\{\{[<%][\s\S]*?[>%]\}\}/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_`>|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

fs.rmSync(ASSETS_OUT, { recursive: true, force: true });
fs.mkdirSync(ASSETS_OUT, { recursive: true });

const index = [];

for (const file of findPostFiles(POSTS_DIR)) {
  const dir = path.dirname(file);
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const slug = String(data.slug ?? path.basename(dir));

  const destDir = path.join(ASSETS_OUT, slug);
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name !== 'index.md' && !entry.name.startsWith('.')) {
      fs.copyFileSync(path.join(dir, entry.name), path.join(destDir, entry.name));
    }
  }

  index.push({
    title: String(data.title ?? slug),
    description: String(data.description ?? ''),
    slug,
    date: String(data.date ?? ''),
    tags: (data.tags ?? []).map(String),
    categories: (data.categories ?? []).map(String),
    body: plainText(content),
  });
}

fs.writeFileSync(SEARCH_INDEX_OUT, JSON.stringify(index));
console.log(`prepared ${index.length} posts -> assets + search index`);
