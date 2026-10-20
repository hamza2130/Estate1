import { redirect } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';
import { getSession } from '@/lib/auth';

export const metadata = { title: 'Admin Login' };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await getSession()) redirect('/admin');
  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="logo" style={{ marginBottom: 24 }}>
          <span className="logo-mark">AI</span>
          <span className="logo-text"><strong>Autostack AI</strong><span>Admin Panel</span></span>
        </div>
        <h1 style={{ fontSize: '1.6rem' }}>Welcome back</h1>
        <p className="muted">Sign in to manage listings, enquiries and website content.</p>
        <LoginForm />
      </div>
    </div>
  );
}
