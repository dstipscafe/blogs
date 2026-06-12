import { getAllPosts } from '@/lib/posts';
import { site } from '@/lib/site';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import HomeWidgets from '@/components/HomeWidgets';

export default function HomePage() {
  const posts = getAllPosts();
  const pagePosts = posts.slice(0, site.postsPerPage);
  const totalPages = Math.ceil(posts.length / site.postsPerPage);

  return (
    <div className="with-widgets">
      <div>
        {pagePosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
        <Pagination current={1} total={totalPages} />
      </div>
      <HomeWidgets />
    </div>
  );
}
