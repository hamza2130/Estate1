import Link from 'next/link';
import { query, queryOne } from '@/lib/db';
import { formatDate, formatPrice } from '@/lib/format';
import { getStats } from '@/lib/properties';

const KIND_LABELS = { contact: 'General', property: 'Property', easy_option: 'Easy Option', sell: 'Sell / Rent out', construction: 'Construction' };

export default async function Dashboard() {
  const [stats, inquiryStats, recentInquiries, recentProperties] = await Promise.all([
    getStats(),
    queryOne(`SELECT count(*)::int AS total, count(*) FILTER (WHERE status = 'new')::int AS new FROM inquiries`),
    query(`SELECT i.*, p.title AS property_title FROM inquiries i LEFT JOIN properties p ON p.id = i.property_id ORDER BY i.created_at DESC LIMIT 5`),
    query(`SELECT id, title, price, status, purpose, created_at FROM properties ORDER BY created_at DESC LIMIT 5`),
  ]);

  return (
    <>
      <div className="admin-top">
        <h1>Dashboard</h1>
        <Link href="/admin/properties/new" className="btn btn-gold">+ Add Property</Link>
      </div>
      <div className="kpis">
        <div className="kpi"><small>Total listings</small><b>{stats.total}</b></div>
        <div className="kpi"><small>Available</small><b>{stats.available}</b></div>
        <div className="kpi"><small>Sold / Rented</small><b>{stats.closed}</b></div>
        <div className="kpi"><small>New enquiries</small><b>{inquiryStats.new}</b></div>
      </div>
      <div className="grid-2">
        <div className="admin-card">
          <div className="admin-top" style={{ marginBottom: 10 }}>
            <h2 style={{ margin: 0 }}>Latest enquiries</h2>
            <Link href="/admin/inquiries" className="btn btn-outline btn-sm">View all</Link>
          </div>
          <div className="table-wrap">
            <table className="table">
              <tbody>
                {recentInquiries.map((i) => (
                  <tr key={i.id}>
                    <td><b>{i.name}</b><div className="hint">{KIND_LABELS[i.kind] || i.kind}{i.property_title ? `: ${i.property_title}` : ''}</div></td>
                    <td><span className={`status status-${i.status}`}>{i.status}</span></td>
                    <td className="hint">{formatDate(i.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-top" style={{ marginBottom: 10 }}>
            <h2 style={{ margin: 0 }}>Recently added</h2>
            <Link href="/admin/properties" className="btn btn-outline btn-sm">Manage</Link>
          </div>
          <div className="table-wrap">
            <table className="table">
              <tbody>
                {recentProperties.map((p) => (
                  <tr key={p.id}>
                    <td><Link href={`/admin/properties/${p.id}`}><b>{p.title}</b></Link><div className="hint">{formatPrice(p.price)}{p.purpose === 'rent' ? ' / month' : ''}</div></td>
                    <td><span className={`status status-${p.status}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="admin-card">
        <h2>Listing mix</h2>
        <p className="muted" style={{ margin: 0 }}>{stats.for_sale} for sale, {stats.for_rent} for rent, {stats.featured} featured on the homepage. {inquiryStats.total} enquiries received in total.</p>
      </div>
    </>
  );
}
