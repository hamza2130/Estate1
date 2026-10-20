import Link from 'next/link';
import { Icon } from './Icons';

export const SERVICES = [
  { icon: Icon.key, title: 'Property Purchase', text: 'Find the right home, plot or investment with shortlists matched to your budget and a senior agent at every viewing.' },
  { icon: Icon.tag, title: 'Property Sale', text: 'We value, market and sell your property to verified buyers at the best price, and handle the transfer paperwork.' },
  { icon: Icon.home, title: 'Rental Services', text: 'Tenant screening, rent agreements and property management for owners, and hassle-free homes for tenants.' },
  { icon: Icon.build, title: 'Construction', text: 'Grey structure and turnkey construction in DHA, Bahria Town and CDA sectors with transparent pricing.' },
];

export function PageHero({ title, crumb, subtitle }) {
  return (
    <section className="page-hero">
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p style={{ color: '#c8d1e0', maxWidth: 640 }}>{subtitle}</p>}
        <div className="breadcrumb"><Link href="/">Home</Link> / {crumb || title}</div>
      </div>
    </section>
  );
}

export function ServicesGrid() {
  return (
    <div className="grid-4">
      {SERVICES.map((s) => (
        <div className="service-card" key={s.title}>
          <div className="service-icon"><s.icon /></div>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </div>
      ))}
    </div>
  );
}

export function VerificationSteps() {
  return (
    <div className="steps">
      <div className="step">
        <h3>Ownership & File Check</h3>
        <p>We confirm title, file status and ownership history directly with the society or land authority.</p>
      </div>
      <div className="step">
        <h3>Dues & NOC Clearance</h3>
        <p>Outstanding dues, transfer fees and NOC requirements are confirmed so there are no surprises later.</p>
      </div>
      <div className="step">
        <h3>Physical Inspection</h3>
        <p>A senior agent inspects the site, verifies measurements and documents its condition with photos and video.</p>
      </div>
    </div>
  );
}

export function FaqList({ faqs }) {
  return (
    <div className="faq">
      {faqs.map((f, i) => (
        <details key={f.id} open={i === 0}>
          <summary>{f.question}</summary>
          <p>{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function Testimonials({ items }) {
  return (
    <div className="grid-4">
      {items.map((t) => (
        <div className="testimonial" key={t.id}>
          <div className="stars">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
          <blockquote>“{t.quote}”</blockquote>
          <div className="person">
            <span className="avatar">{initials(t.name)}</span>
            <div><b>{t.name}</b><small>{t.role}</small></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CtaBanner({ settings }) {
  return (
    <section className="section">
      <div className="container">
        <div className="cta">
          <div>
            <h2>Ready to buy, sell or build?</h2>
            <p>Talk to a senior consultant today. No obligation, just honest advice.</p>
          </div>
          <div className="cta-actions">
            <a className="btn btn-whatsapp" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"><Icon.whatsapp style={{ width: 18, height: 18 }} /> WhatsApp Us</a>
            <Link className="btn btn-gold" href="/contact">Book a Consultation</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function initials(name) {
  return name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}
