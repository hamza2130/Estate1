import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24 }}>
      <div>
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="muted">The page or property you are looking for may have been sold or moved.</p>
        <Link href="/properties" className="btn btn-navy">Browse Properties</Link>
      </div>
    </div>
  );
}
