import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCategories } from '@/lib/posts';
import PostCard from '@/components/PostCard';

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getAllCategories().find((c) => c.slug === slug);
  return { title: entry ? `Category: ${entry.name}` : 'Category' };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getAllCategories().find((c) => c.slug === slug);
  if (!entry) notFound();

  return (
    <div>
      <h1 className="page-title">
        Category: {entry.name} <small style={{ color: 'var(--text-secondary)' }}>({entry.posts.length})</small>
      </h1>
      {entry.posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
