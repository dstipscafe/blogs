import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import CategoryBar from '@/components/CategoryBar';

export const metadata: Metadata = { title: 'Categories' };

export default function CategoriesPage() {
  return (
    <div>
      <h1 className="page-title">Categories</h1>
      <CategoryBar />
      {getAllPosts().map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
