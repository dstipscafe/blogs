import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTags } from '@/lib/posts';

export const metadata: Metadata = { title: 'Tags' };

export default function TagsPage() {
  return (
    <div>
      <h1 className="page-title">Tags</h1>
      <div className="tag-cloud">
        {getAllTags().map((t) => (
          <Link key={t.slug} href={`/tags/${t.slug}/`}>
            {t.name} ({t.posts.length})
          </Link>
        ))}
      </div>
    </div>
  );
}
