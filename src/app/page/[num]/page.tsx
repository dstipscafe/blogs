import { notFound } from 'next/navigation';
import { getAllPosts } from '@/lib/posts';
import { site } from '@/lib/site';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import HomeWidgets from '@/components/HomeWidgets';

export function generateStaticParams() {
  const totalPages = Math.ceil(getAllPosts().length / site.postsPerPage);
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
    num: String(i + 2),
  }));
}

export default async function PostListPage({ params }: { params: Promise<{ num: string }> }) {
  const { num } = await params;
  const current = Number(num);
  const posts = getAllPosts();
  const totalPages = Math.ceil(posts.length / site.postsPerPage);
  if (!Number.isInteger(current) || current < 2 || current > totalPages) notFound();

  const pagePosts = posts.slice((current - 1) * site.postsPerPage, current * site.postsPerPage);

  return (
    <div className="with-widgets">
      <div>
        {pagePosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
        <Pagination current={current} total={totalPages} />
      </div>
      <HomeWidgets />
    </div>
  );
}
