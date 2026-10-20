import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { PageHero } from '@/components/Sections';
import { CITIES, PROPERTY_TYPES, SOCIETIES } from '@/lib/format';
import { listProperties } from '@/lib/properties';

export const metadata = { title: 'Properties' };

const FILTER_KEYS = ['q', 'purpose', 'type', 'city', 'society', 'minPrice', 'maxPrice', 'beds', 'sort'];

export default async function PropertiesPage({ searchParams }) {
  const sp = await searchParams;
  const filters = Object.fromEntries(FILTER_KEYS.map((k) => [k, typeof sp[k] === 'string' ? sp[k] : '']));
  const result = await listProperties({ ...filters, page: sp.page, limit: 9 });

  const pageHref = (page) => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    params.set('page', page);
    return `/properties?${params}`;
  };

  const heading = filters.purpose === 'rent' ? 'Properties for Rent' : filters.purpose === 'sale' ? 'Properties for Sale' : 'All Properties';

  return (
    <>
      <PageHero title={heading} crumb="Properties" subtitle="Every listing is legally verified by our team before it is published." />
      <section className="section">
        <div className="container listing-layout">
          <form className="filter-card" method="get" action="/properties">
            <h3>Refine Search</h3>
            <div className="field">
              <label htmlFor="f-q">Keyword</label>
              <input id="f-q" className="input" name="q" defaultValue={filters.q} placeholder="Sector, phase, feature" />
            </div>
            <div className="field">
              <label htmlFor="f-purpose">Purpose</label>
              <select id="f-purpose" className="select" name="purpose" defaultValue={filters.purpose}>
                <option value="">Buy or Rent</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-type">Type</label>
              <select id="f-type" className="select" name="type" defaultValue={filters.type}>
                <option value="">All types</option>
                {Object.entries(PROPERTY_TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-city">City</label>
              <select id="f-city" className="select" name="city" defaultValue={filters.city}>
                <option value="">All cities</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-society">Society</label>
              <select id="f-society" className="select" name="society" defaultValue={filters.society}>
                <option value="">All societies</option>
                {SOCIETIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="f-min">Min PKR</label>
                <input id="f-min" className="input" name="minPrice" type="number" min="0" defaultValue={filters.minPrice} placeholder="0" />
              </div>
              <div className="field">
                <label htmlFor="f-max">Max PKR</label>
                <input id="f-max" className="input" name="maxPrice" type="number" min="0" defaultValue={filters.maxPrice} placeholder="Any" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="f-beds">Bedrooms</label>
              <select id="f-beds" className="select" name="beds" defaultValue={filters.beds}>
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-sort">Sort by</label>
              <select id="f-sort" className="select" name="sort" defaultValue={filters.sort}>
                <option value="">Featured first</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
            </div>
            <button className="btn btn-navy">Apply Filters</button>
            <Link href="/properties" className="btn btn-outline">Reset</Link>
          </form>

          <div>
            <div className="listing-toolbar">
              <p>Showing <b>{result.items.length}</b> of <b>{result.total}</b> properties</p>
            </div>
            {result.items.length ? (
              <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {result.items.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            ) : (
              <div className="empty">
                <h3>No properties match your search</h3>
                <p>Try widening your filters, or tell us what you need and we will find it for you.</p>
                <Link href="/contact" className="btn btn-gold">Request a Property</Link>
              </div>
            )}
            {result.pages > 1 && (
              <nav className="pagination" aria-label="Pagination">
                {Array.from({ length: result.pages }, (_, i) => i + 1).map((n) =>
                  n === result.page ? <span key={n} className="current">{n}</span> : <Link key={n} href={pageHref(n)}>{n}</Link>
                )}
              </nav>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
