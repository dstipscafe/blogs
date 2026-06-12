'use client';

import { useEffect, useRef } from 'react';
import { site } from '@/lib/site';

declare global {
  interface Window {
    DISQUS?: { reset: (opts: object) => void };
    disqus_config?: () => void;
  }
}

export default function Disqus({ url, identifier }: { url: string; identifier: string }) {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    window.disqus_config = function (this: { page: { url: string; identifier: string } }) {
      this.page = { url, identifier };
    } as unknown as () => void;

    const script = document.createElement('script');
    script.src = `https://${site.disqusShortname}.disqus.com/embed.js`;
    script.setAttribute('data-timestamp', String(Date.now()));
    document.body.appendChild(script);
  }, [url, identifier]);

  return <div id="disqus_thread" style={{ marginTop: 40 }} />;
}
