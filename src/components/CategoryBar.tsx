import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { getAllCategories, getAllPosts } from '@/lib/posts';
import { BASE_PATH } from '@/lib/site';

function categoryImage(name: string): string | null {
  const file = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.png`;
  if (fs.existsSync(path.join(process.cwd(), 'public', 'img', file))) {
    return `${BASE_PATH}/img/${file}`;
  }
  return null;
}

export default function CategoryBar({ activeSlug }: { activeSlug?: string }) {
  const categories = getAllCategories();

  return (
    <div className="category-bar">
      <Link href="/categories/" className={`category-card no-image${activeSlug ? '' : ' active'}`}>
        <div className="category-card-body">
          <div className="category-name">全部</div>
          <div className="category-count">{getAllPosts().length} 篇文章</div>
        </div>
      </Link>
      {categories.map((c) => {
        const img = categoryImage(c.name);
        return (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}/`}
            className={`category-card${img ? '' : ' no-image'}${activeSlug === c.slug ? ' active' : ''}`}
            style={img ? { backgroundImage: `url(${img})` } : undefined}
          >
            <div className="category-card-body">
              <div className="category-name">{c.name}</div>
              <div className="category-count">{c.posts.length} 篇文章</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
