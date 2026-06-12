import type { Metadata } from 'next';
import SearchClient from './SearchClient';

export const metadata: Metadata = { title: 'Search' };

export default function SearchPage() {
  return (
    <div>
      <h1 className="page-title">Search</h1>
      <SearchClient />
    </div>
  );
}
