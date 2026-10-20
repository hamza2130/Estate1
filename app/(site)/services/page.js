import Link from 'next/link';
import InquiryForm from '@/components/InquiryForm';
import { CtaBanner, PageHero, ServicesGrid, VerificationSteps } from '@/components/Sections';
import { getSettings } from '@/lib/content';

export const metadata = { title: 'Services' };

const CONSTRUCTION = [
  ['Grey Structure', 'Foundation to roof with certified materials, weekly site photos and fixed per-square-foot pricing.'],
  ['Turnkey Homes', 'Complete finishing: electrical, plumbing, woodwork, tiling and paint, handed over ready to move in.'],
  ['Renovation', 'Kitchen, bathroom and elevation upgrades that raise both comfort and resale value.'],
];

export default async function ServicesPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHero title="Our Services" subtitle="Purchase, sale, rentals and construction under one roof." />
      <section className="section">
        <div className="container">
          <ServicesGrid />
        </div>
      </section>

      <section className="section section-soft">
        <div className="container split">
          <div className="split-media"><img src="/demo/villa-3.svg" alt="Home built by our construction team" /></div>
          <div>
            <span className="eyebrow">Construction</span>
            <h2>We build the home, not just sell the plot</h2>
            <p className="muted">Our in-house construction team has delivered homes across DHA, Bahria Town and CDA sectors. You get one point of contact from design approval to handover.</p>
            <div style={{ display: 'grid', gap: 16, margin: '24px 0' }}>
              {CONSTRUCTION.map(([t, d]) => (
                <div key={t} style={{ display: 'flex', gap: 14 }}>
                  <span className="check">✓</span>
                  <div><b style={{ color: 'var(--navy)' }}>{t}</b><div className="muted">{d}</div></div>
                </div>
              ))}
            </div>
            <Link href="/contact?type=construction" className="btn btn-navy">Get a Construction Quote</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our process</span>
            <h2>Every Deal Starts with Verification</h2>
          </div>
          <VerificationSteps />
        </div>
      </section>

      <section className="section section-soft">
        <div className="container split">
          <div>
            <span className="eyebrow">Get started</span>
            <h2>Tell us what you need</h2>
            <p className="muted">Share a few details and a consultant will call you back with options that match.</p>
          </div>
          <div className="panel" style={{ margin: 0 }}>
            <InquiryForm showKind kind="property" />
          </div>
        </div>
      </section>
      <CtaBanner settings={settings} />
    </>
  );
}
