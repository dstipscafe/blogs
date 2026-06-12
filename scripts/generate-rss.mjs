import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';

const SITE_URL = 'https://dstipscafe.github.io/blogs';
const SITE_TITLE = '資料科學咖啡館&小秘訣分享 | Data Science Cafe & Tips';
const SITE_DESC = '在一杯咖啡的時間內，帶您瀏覽資料科學領域中的各種技巧以及概念';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'content', 'post');
const OUT_DIR = path.join(ROOT, 'out');

function findPostFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findPostFiles(full));
    else if (entry.name === 'index.md') results.push(full);
  }
  return results;
}

function parseDate(value) {
  if (value instanceof Date) return value;
  const s = String(value ?? '').trim();
  const normalized = s.replace(' ', 'T').replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

function convertShortcodes(md) {
  return md
    .replace(/\{\{[<%]\s*notice\s+(\w+)\s*[>%]\}\}/g, '<div class="notice">\n')
    .replace(/\{\{[<%]\s*\/notice\s*[>%]\}\}/g, '\n</div>');
}

function rewriteRelativeImages(md, slug) {
  const prefix = `${SITE_URL}/post-assets/${slug}/`;
  return md.replace(/(!\[[^\]]*\]\()([^)\s]+)(\))/g, (whole, open, url, close) => {
    if (/^(https?:)?\/\//.test(url) || url.startsWith('/') || url.startsWith('data:')) return whole;
    return `${open}${prefix}${url}${close}`;
  });
}

const renderer = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify);

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const posts = findPostFiles(POSTS_DIR)
  .map((file) => {
    const { data, content } = matter(fs.readFileSync(file, 'utf8'));
    const slug = String(data.slug ?? path.basename(path.dirname(file)));
    return { data, content, slug, date: parseDate(data.date) };
  })
  .sort((a, b) => b.date - a.date);

const items = [];
for (const post of posts) {
  const md = rewriteRelativeImages(convertShortcodes(post.content), post.slug);
  const html = String(await renderer.process(md));
  const link = `${SITE_URL}/p/${post.slug}/`;
  items.push(`    <item>
      <title>${escapeXml(String(post.data.title ?? post.slug))}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <description>${escapeXml(String(post.data.description ?? ''))}</description>
      <content:encoded><![CDATA[${html}]]></content:encoded>
      ${(post.data.categories ?? []).map((c) => `<category>${escapeXml(String(c))}</category>`).join('\n      ')}
    </item>`);
}

const rss = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>zh-tw</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/index.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'index.xml'), rss);
console.log(`RSS written: out/index.xml (${posts.length} items)`);
