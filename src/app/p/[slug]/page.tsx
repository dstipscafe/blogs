import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, taxonomySlug } from '@/lib/posts';
import { site } from '@/lib/site';
import { formatDate } from '@/lib/format';
import MarkdownContent from '@/components/MarkdownContent';
import Disqus from '@/components/Disqus';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const pageUrl = `${site.url}/p/${post.slug}/`;

  return (
    <div className="with-widgets">
      <article className="article-page">
        {post.image && <img className="cover" src={post.image} alt={post.title} />}
        <div className="article-inner">
          <div className="post-meta" style={{ marginBottom: 8 }}>
            {post.categories.map((c) => (
              <Link key={c} className="category" href={`/categories/${taxonomySlug(c)}/`}>
                {c}
              </Link>
            ))}
          </div>
          <h1 className="article-title">{post.title}</h1>
          <div className="post-meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.readingTime} 分鐘閱讀</span>
          </div>
          <MarkdownContent source={post.content} />
          {post.tags.length > 0 && (
            <div className="tag-cloud" style={{ marginTop: 32 }}>
              {post.tags.map((t) => (
                <Link key={t} href={`/tags/${taxonomySlug(t)}/`}>
                  {t}
                </Link>
              ))}
            </div>
          )}
          <div className="license-box">
            <strong>{post.title}</strong>
            <br />
            本文著作權：{site.license}
          </div>
          <Disqus url={pageUrl} identifier={`/p/${post.slug}/`} />
        </div>
      </article>
      <div>
        {post.toc.length > 0 && (
          <div className="widget toc-widget" style={{ position: 'sticky', top: 24 }}>
            <h3>Table of contents</h3>
            <ul>
              {post.toc.map((item) => (
                <li key={item.id} className={`depth-${item.depth}`}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
