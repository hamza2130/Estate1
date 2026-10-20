'use client';

import { useFormAction } from '@/components/useFormAction';
import { loginAction } from '@/app/admin/actions';

export default function LoginForm() {
  const [state, action, pending] = useFormAction(loginAction);
  return (
    <form onSubmit={action} className="inline-form">
      {state?.error && <div className="alert alert-error">{state.error}</div>}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="input" required autoComplete="username" />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className="input" required autoComplete="current-password" />
      </div>
      <button className="btn btn-navy btn-block" disabled={pending}>{pending ? 'Signing in...' : 'Sign In'}</button>
    </form>
  );
}
