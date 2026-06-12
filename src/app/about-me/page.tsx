import type { Metadata } from 'next';
import { getPage } from '@/lib/pages';
import MarkdownContent from '@/components/MarkdownContent';

export const metadata: Metadata = { title: 'About me' };

export default function AboutPage() {
  const { content } = getPage('about_me');
  return (
    <div className="article-page">
      <div className="article-inner">
        <h1 className="page-title">About me</h1>
        {content.trim() ? <MarkdownContent source={content} /> : <p>敬請期待。</p>}
      </div>
    </div>
  );
}
