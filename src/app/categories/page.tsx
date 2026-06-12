import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCategories } from '@/lib/posts';

export const metadata: Metadata = { title: 'Categories' };

export default function CategoriesPage() {
  return (
    <div>
      <h1 className="page-title">Categories</h1>
      <div className="tag-cloud">
        {getAllCategories().map((c) => (
          <Link key={c.slug} href={`/categories/${c.slug}/`}>
            {c.name} ({c.posts.length})
          </Link>
        ))}
      </div>
    </div>
  );
}
