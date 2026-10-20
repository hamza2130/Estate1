import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import { requireAdmin } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import { logoutAction } from '../actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin' };

export default async function AdminLayout({ children }) {
  const session = await requireAdmin();
  const { count } = await queryOne(`SELECT count(*)::int AS count FROM inquiries WHERE status = 'new'`);
  return (
    <div className="admin">
      <aside className="admin-side">
        <Link href="/admin" className="logo">
          <span className="logo-mark">AI</span>
          <span className="logo-text"><strong>Autostack AI</strong><span>Admin</span></span>
        </Link>
        <AdminNav newCount={count} />
        <div className="spacer" />
        <Link href="/" target="_blank">View Website ↗</Link>
        <div style={{ padding: '8px 12px', fontSize: '0.8rem', color: '#8796ad' }}>{session.email}</div>
        <form action={logoutAction}><button className="link">Sign Out</button></form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
