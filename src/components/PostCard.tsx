import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';
import { taxonomySlug } from '@/lib/posts';
import { formatDate } from '@/lib/format';

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="post-card">
      {post.image && (
        <Link href={`/p/${post.slug}/`}>
          <img className="cover" src={post.image} alt={post.title} />
        </Link>
      )}
      <div className="card-body">
        <div className="post-meta" style={{ marginBottom: 8 }}>
          {post.categories.map((c) => (
            <Link key={c} className="category" href={`/categories/${taxonomySlug(c)}/`}>
              {c}
            </Link>
          ))}
        </div>
        <h2>
          <Link href={`/p/${post.slug}/`}>{post.title}</Link>
        </h2>
        <p className="description">{post.description}</p>
        <div className="post-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readingTime} 分鐘閱讀</span>
        </div>
      </div>
    </article>
  );
}
