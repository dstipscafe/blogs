import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllTags } from '@/lib/posts';
import PostCard from '@/components/PostCard';

export function generateStaticParams() {
  return getAllTags().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getAllTags().find((t) => t.slug === slug);
  return { title: entry ? `Tag: ${entry.name}` : 'Tag' };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getAllTags().find((t) => t.slug === slug);
  if (!entry) notFound();

  return (
    <div>
      <h1 className="page-title">
        Tag: {entry.name} <small style={{ color: 'var(--text-secondary)' }}>({entry.posts.length})</small>
      </h1>
      {entry.posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
