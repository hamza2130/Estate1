import Link from 'next/link';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { formatArea, formatPrice, typeLabel } from '@/lib/format';
import { listProperties } from '@/lib/properties';
import { deletePropertyAction, togglePropertyFlagAction } from '../../actions';

export default async function AdminProperties({ searchParams }) {
  const sp = await searchParams;
  const result = await listProperties({ q: sp.q, status: sp.status, purpose: sp.purpose, page: sp.page, limit: 20, sort: 'newest' }, { includeAll: true });

  return (
    <>
      <div className="admin-top">
        <h1>Properties</h1>
        <Link href="/admin/properties/new" className="btn btn-gold">+ Add Property</Link>
      </div>
      {sp.saved && <div className="alert alert-success">Property saved. <Link href={`/admin/properties/${sp.saved}`}>Edit again</Link></div>}
      <div className="admin-card">
        <form method="get" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          <input name="q" className="input" placeholder="Search title, society, location" defaultValue={sp.q} style={{ flex: '1 1 240px', width: 'auto' }} />
          <select name="purpose" className="select" defaultValue={sp.purpose || ''} style={{ width: 'auto' }}>
            <option value="">All purposes</option><option value="sale">For Sale</option><option value="rent">For Rent</option>
          </select>
          <select name="status" className="select" defaultValue={sp.status || ''} style={{ width: 'auto' }}>
            <option value="">All statuses</option><option value="available">Available</option><option value="sold">Sold</option><option value="rented">Rented</option><option value="draft">Draft</option>
          </select>
          <button className="btn btn-navy">Filter</button>
        </form>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th></th><th>Property</th><th>Price</th><th>Area</th><th>Status</th><th>Featured</th><th></th></tr>
            </thead>
            <tbody>
              {result.items.map((p) => (
                <tr key={p.id}>
                  <td><img className="thumb" src={p.cover || '/demo/villa-1.svg'} alt="" /></td>
                  <td>
                    <Link href={`/admin/properties/${p.id}`}><b>{p.title}</b></Link>
                    <div className="hint">{typeLabel(p.property_type)} · {p.society} · {p.image_count} photos</div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatPrice(p.price)}<div className="hint">{p.purpose === 'rent' ? 'per month' : 'sale'}</div></td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatArea(p.area_value, p.area_unit)}</td>
                  <td>
                    <form action={togglePropertyFlagAction} style={{ display: 'flex', gap: 6 }}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="field" value="status" />
                      <select name="status" defaultValue={p.status} className="select" style={{ padding: '6px 8px', width: 'auto' }}>
                        <option value="available">Available</option><option value="sold">Sold</option><option value="rented">Rented</option><option value="draft">Draft</option>
                      </select>
                      <button className="btn btn-outline btn-sm">Set</button>
                    </form>
                  </td>
                  <td>
                    <form action={togglePropertyFlagAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="field" value="featured" />
                      <button className={`btn btn-sm ${p.featured ? 'btn-gold' : 'btn-outline'}`}>{p.featured ? '★ Yes' : '☆ No'}</button>
                    </form>
                  </td>
                  <td>
                    <div className="actions">
                      <Link href={`/properties/${p.slug}`} target="_blank" className="btn btn-outline btn-sm">View</Link>
                      <Link href={`/admin/properties/${p.id}`} className="btn btn-navy btn-sm">Edit</Link>
                      <form action={deletePropertyAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmButton message={`Delete "${p.title}"? This cannot be undone.`}>Delete</ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!result.items.length && <p className="muted center" style={{ padding: 30 }}>No properties found.</p>}
        </div>
        {result.pages > 1 && (
          <nav className="pagination">
            {Array.from({ length: result.pages }, (_, i) => i + 1).map((n) => {
              const params = new URLSearchParams({ ...sp, page: n });
              params.delete('saved');
              return n === result.page ? <span key={n} className="current">{n}</span> : <Link key={n} href={`/admin/properties?${params}`}>{n}</Link>;
            })}
          </nav>
        )}
      </div>
    </>
  );
}
