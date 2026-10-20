import InquiryForm from '@/components/InquiryForm';
import { FaqList, PageHero } from '@/components/Sections';
import { Icon } from '@/components/Icons';
import { getFaqs } from '@/lib/content';

export const metadata = { title: 'The Easy Option' };

const STEPS = [
  ['Share your brief', 'Tell us your budget, preferred locations and timeline in a short call.'],
  ['We research & shortlist', 'Your consultant studies the market and shortlists only verified options.'],
  ['Virtual or in-person visits', 'Live video walkthroughs for overseas clients, or guided site visits.'],
  ['Negotiation & paperwork', 'We negotiate the price and handle every document until transfer is complete.'],
];

export default async function EasyOptionPage() {
  const faqs = await getFaqs();
  return (
    <>
      <PageHero title="The Easy Option" subtitle="Our concierge service for busy professionals and overseas Pakistanis. You decide, we handle everything else." />
      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">How it works</span>
            <h2>Delegate the entire workload to a senior consultant</h2>
            <p className="muted">Buying property in Pakistan from abroad, or with a demanding job, is stressful. With the Easy Option one dedicated consultant does the legwork and keeps you updated on WhatsApp at every step.</p>
            <div style={{ display: 'grid', gap: 18, marginTop: 26 }}>
              {STEPS.map(([t, d], i) => (
                <div key={t} style={{ display: 'flex', gap: 16 }}>
                  <span className="avatar" style={{ width: 40, height: 40 }}>{i + 1}</span>
                  <div><b style={{ color: 'var(--navy)' }}>{t}</b><div className="muted">{d}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel" style={{ margin: 0 }}>
            <h3>Request the Easy Option</h3>
            <p className="muted">Leave your details and we will set up a free consultation call.</p>
            <InquiryForm kind="easy_option" submitLabel="Request a Consultation" defaultMessage={"Budget: \nPreferred location: \nTimeline: "} />
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <div className="grid-3">
            {[
              [Icon.globe, 'Built for overseas clients', 'Time-zone friendly updates, video visits and power-of-attorney coordination.'],
              [Icon.shield, 'Legal risk caught early', 'Our legal team flags problem files before you commit a single rupee.'],
              [Icon.tag, 'Better purchase prices', 'Experienced negotiators often save more than the concierge fee.'],
            ].map(([I, t, d]) => (
              <div className="service-card" key={t}>
                <div className="service-icon"><I /></div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head"><span className="eyebrow">FAQ</span><h2>Questions about the Easy Option</h2></div>
          <FaqList faqs={faqs} />
        </div>
      </section>
    </>
  );
}
