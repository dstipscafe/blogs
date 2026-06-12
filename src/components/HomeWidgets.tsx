import Link from 'next/link';
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts';
import { formatDate } from '@/lib/format';

export default function HomeWidgets() {
  const posts = getAllPosts();
  const categories = getAllCategories().slice(0, 10);
  const tags = getAllTags().slice(0, 10);

  const years = new Map<number, number>();
  for (const p of posts) {
    const y = new Date(p.date).getFullYear();
    years.set(y, (years.get(y) ?? 0) + 1);
  }
  const yearEntries = [...years.entries()].sort((a, b) => b[0] - a[0]).slice(0, 5);

  return (
    <div>
      <div className="widget">
        <h3>Archives</h3>
        <ul>
          {yearEntries.map(([year, count]) => (
            <li key={year}>
              <Link href={`/archives/#${year}`}>{year}</Link>
              <span className="count">{count}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="widget">
        <h3>Categories</h3>
        <ul>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/categories/${c.slug}/`}>{c.name}</Link>
              <span className="count">{c.posts.length}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="widget">
        <h3>Tags</h3>
        <div className="tag-cloud">
          {tags.map((t) => (
            <Link key={t.slug} href={`/tags/${t.slug}/`}>
              {t.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
