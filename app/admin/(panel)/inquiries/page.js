import Link from 'next/link';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { query } from '@/lib/db';
import { formatDate } from '@/lib/format';
import { updateInquiryAction } from '../../actions';

const KIND_LABELS = { contact: 'General', property: 'Property', easy_option: 'Easy Option', sell: 'Sell / Rent out', construction: 'Construction' };

export default async function Inquiries({ searchParams }) {
  const sp = await searchParams;
  const status = ['new', 'contacted', 'closed'].includes(sp.status) ? sp.status : null;
  const rows = await query(
    `SELECT i.*, p.title AS property_title, p.slug AS property_slug
     FROM inquiries i LEFT JOIN properties p ON p.id = i.property_id
     WHERE ($1::text IS NULL OR i.status = $1) ORDER BY i.created_at DESC LIMIT 200`,
    [status]
  );

  return (
    <>
      <div className="admin-top">
        <h1>Enquiries</h1>
        <div className="actions">
          {[['', 'All'], ['new', 'New'], ['contacted', 'Contacted'], ['closed', 'Closed']].map(([v, l]) => (
            <Link key={l} href={v ? `/admin/inquiries?status=${v}` : '/admin/inquiries'} className={`btn btn-sm ${(status || '') === v ? 'btn-navy' : 'btn-outline'}`}>{l}</Link>
          ))}
        </div>
      </div>
      <div className="admin-card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Received</th><th>Contact</th><th>Type</th><th>Message</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {rows.map((i) => (
                <tr key={i.id}>
                  <td className="hint" style={{ whiteSpace: 'nowrap' }}>{formatDate(i.created_at)}</td>
                  <td>
                    <b>{i.name}</b>
                    {i.phone && <div><a href={`tel:${i.phone}`} className="hint">{i.phone}</a></div>}
                    {i.email && <div><a href={`mailto:${i.email}`} className="hint">{i.email}</a></div>}
                  </td>
                  <td>
                    {KIND_LABELS[i.kind] || i.kind}
                    {i.property_slug && <div><Link href={`/properties/${i.property_slug}`} target="_blank" className="hint">{i.property_title} ↗</Link></div>}
                  </td>
                  <td style={{ maxWidth: 360, whiteSpace: 'pre-wrap' }}>{i.message || <span className="hint">(no message)</span>}</td>
                  <td>
                    <form action={updateInquiryAction} style={{ display: 'flex', gap: 6 }}>
                      <input type="hidden" name="id" value={i.id} />
                      <select name="status" defaultValue={i.status} className="select" style={{ padding: '6px 8px', width: 'auto' }}>
                        <option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
                      </select>
                      <button className="btn btn-outline btn-sm">Set</button>
                    </form>
                  </td>
                  <td>
                    <div className="actions">
                      {i.phone && <a className="btn btn-whatsapp btn-sm" target="_blank" rel="noreferrer" href={`https://wa.me/${i.phone.replace(/\D/g, '')}`}>WhatsApp</a>}
                      <form action={updateInquiryAction}>
                        <input type="hidden" name="id" value={i.id} />
                        <input type="hidden" name="delete" value="1" />
                        <ConfirmButton message="Delete this enquiry?">Delete</ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <p className="muted center" style={{ padding: 30 }}>No enquiries yet.</p>}
        </div>
      </div>
    </>
  );
}
