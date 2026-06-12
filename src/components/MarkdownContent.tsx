import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';

export default function MarkdownContent({ source }: { source: string }) {
  return (
    <div className="article-content">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            format: 'md',
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeRaw, rehypeSlug, rehypeHighlight],
          },
        }}
      />
    </div>
  );
}
