'use client';

import { useFormAction } from '@/components/useFormAction';
import { submitInquiry } from '@/app/actions';

const KIND_OPTIONS = [
  ['contact', 'General enquiry'],
  ['property', 'Buy or rent a property'],
  ['sell', 'Sell or rent out my property'],
  ['easy_option', 'The Easy Option (concierge)'],
  ['construction', 'Construction services'],
];

export default function InquiryForm({ kind = 'contact', propertyId, defaultMessage = '', showKind = false, compact = false, submitLabel = 'Send Message' }) {
  const [state, action, pending] = useFormAction(submitInquiry);

  if (state?.ok) {
    return (
      <div className="alert alert-success">
        <b>Thank you!</b> Your request has been received. A senior consultant will contact you shortly.
      </div>
    );
  }

  return (
    <form onSubmit={action} className={compact ? '' : 'form-grid'} style={compact ? { display: 'grid', gap: 12 } : undefined}>
      {state?.error && <div className="alert alert-error full">{state.error}</div>}
      {propertyId && <input type="hidden" name="property_id" value={propertyId} />}
      {!showKind && <input type="hidden" name="kind" value={kind} />}
      <div className="field">
        {!compact && <label htmlFor="inq-name">Full name</label>}
        <input id="inq-name" className="input" name="name" placeholder="Full name" required />
      </div>
      <div className="field">
        {!compact && <label htmlFor="inq-phone">Phone / WhatsApp</label>}
        <input id="inq-phone" className="input" name="phone" placeholder="+92 3xx xxxxxxx" />
      </div>
      <div className="field full">
        {!compact && <label htmlFor="inq-email">Email</label>}
        <input id="inq-email" className="input" type="email" name="email" placeholder="Email address" />
      </div>
      {showKind && (
        <div className="field full">
          <label htmlFor="inq-kind">I am interested in</label>
          <select id="inq-kind" name="kind" className="select" defaultValue={kind}>
            {KIND_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      )}
      <div className="field full">
        {!compact && <label htmlFor="inq-msg">Message</label>}
        <textarea id="inq-msg" className="textarea" name="message" placeholder="How can we help?" defaultValue={defaultMessage} />
      </div>
      <div className="full">
        <button className="btn btn-navy btn-block" disabled={pending}>{pending ? 'Sending...' : submitLabel}</button>
      </div>
    </form>
  );
}
