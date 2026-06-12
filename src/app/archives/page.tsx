import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Archives' };

export default function ArchivesPage() {
  const posts = getAllPosts();
  const byYear = new Map<number, typeof posts>();
  for (const post of posts) {
    const year = new Date(post.date).getFullYear();
    byYear.set(year, [...(byYear.get(year) ?? []), post]);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <div>
      <h1 className="page-title">Archives</h1>
      {years.map((year) => (
        <section key={year}>
          <h2 className="archives-year" id={String(year)}>
            {year} <small style={{ color: 'var(--text-secondary)' }}>({byYear.get(year)!.length})</small>
          </h2>
          <ul className="archives-list">
            {byYear.get(year)!.map((post) => (
              <li key={post.slug}>
                <time className="date" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
                <Link href={`/p/${post.slug}/`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
