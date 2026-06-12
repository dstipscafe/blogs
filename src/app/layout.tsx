import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import Sidebar from '@/components/Sidebar';
import { site } from '@/lib/site';
import 'highlight.js/styles/atom-one-dark.css';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s | ${site.shortTitle}`,
  },
  description: site.subtitle,
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <div className="site-container">
            <Sidebar />
            <main className="main-content">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
