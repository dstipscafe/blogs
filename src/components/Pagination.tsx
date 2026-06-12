import Link from 'next/link';

export default function Pagination({ current, total }: { current: number; total: number }) {
  if (total <= 1) return null;
  const pageHref = (n: number) => (n === 1 ? '/' : `/page/${n}/`);
  return (
    <nav className="pagination">
      {current > 1 && <Link href={pageHref(current - 1)}>←</Link>}
      {Array.from({ length: total }, (_, i) => i + 1).map((n) =>
        n === current ? (
          <span key={n} className="current">
            {n}
          </span>
        ) : (
          <Link key={n} href={pageHref(n)}>
            {n}
          </Link>
        )
      )}
      {current < total && <Link href={pageHref(current + 1)}>→</Link>}
    </nav>
  );
}
