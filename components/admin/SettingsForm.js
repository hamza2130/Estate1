'use client';

import { useFormAction } from '@/components/useFormAction';
import { changePasswordAction, saveSettingsAction } from '@/app/admin/actions';

const GROUPS = [
  ['Brand', [['site_name', 'Company name'], ['site_tagline', 'Tagline']]],
  ['Contact details', [['phone', 'Phone'], ['whatsapp', 'WhatsApp number (digits only, with country code)'], ['email', 'Email'], ['office_hours', 'Office hours'], ['address', 'Office address', true]]],
  ['Homepage', [['hero_title', 'Hero title (text after " in " is highlighted)', true], ['hero_subtitle', 'Hero subtitle', true]]],
  ['About & numbers', [['about_intro', 'About intro', true], ['ceo_name', 'CEO name'], ['years_experience', 'Years of experience'], ['happy_clients', 'Happy clients'], ['deals_closed', 'Deals closed'], ['ceo_message', 'CEO message', true]]],
  ['Social links', [['facebook', 'Facebook URL'], ['instagram', 'Instagram URL'], ['youtube', 'YouTube URL']]],
];

export default function SettingsForm({ settings }) {
  const [state, action, pending] = useFormAction(saveSettingsAction);
  const [pw, pwAction, pwPending] = useFormAction(changePasswordAction);
  return (
    <>
      <form onSubmit={action}>
        {state?.ok && <div className="alert alert-success">Website content updated.</div>}
        {GROUPS.map(([title, fields]) => (
          <div className="admin-card" key={title}>
            <h2>{title}</h2>
            <div className="form-grid">
              {fields.map(([key, label, wide]) => (
                <div className={`field ${wide ? 'full' : ''}`} key={key}>
                  <label htmlFor={key}>{label}</label>
                  {wide && settings[key].length > 80
                    ? <textarea id={key} name={key} className="textarea" defaultValue={settings[key]} />
                    : <input id={key} name={key} className="input" defaultValue={settings[key]} />}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="btn btn-gold" disabled={pending}>{pending ? 'Saving...' : 'Save Content'}</button>
      </form>

      <form onSubmit={pwAction} className="admin-card" style={{ marginTop: 30, maxWidth: 520 }}>
        <h2>Change admin password</h2>
        {pw?.error && <div className="alert alert-error">{pw.error}</div>}
        {pw?.ok && <div className="alert alert-success">Password changed.</div>}
        <div className="inline-form">
          <input name="current" type="password" className="input" placeholder="Current password" required />
          <input name="next" type="password" className="input" placeholder="New password (8+ characters)" required />
          <button className="btn btn-navy" disabled={pwPending}>Update Password</button>
        </div>
      </form>
    </>
  );
}
