import type { Metadata } from 'next';
import { getPage } from '@/lib/pages';
import MarkdownContent from '@/components/MarkdownContent';

export const metadata: Metadata = { title: 'Links' };

interface LinkEntry {
  title: string;
  description?: string;
  website: string;
  image?: string;
}

export default function LinksPage() {
  const { data, content } = getPage('links');
  const links = (data.links ?? []) as LinkEntry[];

  return (
    <div>
      <h1 className="page-title">Links</h1>
      {content.trim() && <MarkdownContent source={content} />}
      <div className="links-grid" style={{ marginTop: 24 }}>
        {links.map((link) => (
          <a
            key={link.website}
            className="link-card"
            href={link.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.image && <img src={link.image} alt={link.title} />}
            <div>
              <div className="link-title">{link.title}</div>
              {link.description && <div className="link-desc">{link.description}</div>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
