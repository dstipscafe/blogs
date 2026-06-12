'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { BASE_PATH } from '@/lib/site';

interface SearchDoc {
  title: string;
  description: string;
  slug: string;
  date: string;
  tags: string[];
  categories: string[];
  body: string;
}

export default function SearchClient() {
  const [docs, setDocs] = useState<SearchDoc[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch(`${BASE_PATH}/search-index.json`)
      .then((res) => res.json())
      .then(setDocs)
      .catch(() => setDocs([]));
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(docs, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'description', weight: 2 },
          { name: 'tags', weight: 2 },
          { name: 'categories', weight: 1 },
          { name: 'body', weight: 1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [docs]
  );

  const results = query.trim() ? fuse.search(query.trim()).slice(0, 20) : [];

  return (
    <div>
      <input
        className="search-input"
        type="search"
        placeholder="輸入關鍵字搜尋文章…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <div style={{ marginTop: 24 }}>
        {query.trim() && results.length === 0 && <p>找不到符合「{query}」的文章。</p>}
        {results.map(({ item }) => (
          <article key={item.slug} className="post-card">
            <div className="card-body">
              <h2>
                <Link href={`/p/${item.slug}/`}>{item.title}</Link>
              </h2>
              <p className="description">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
