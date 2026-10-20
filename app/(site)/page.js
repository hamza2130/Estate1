import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import SearchBox from '@/components/SearchBox';
import { CtaBanner, FaqList, ServicesGrid, Testimonials, VerificationSteps } from '@/components/Sections';
import { getFaqs, getSettings, getTestimonials } from '@/lib/content';
import { getSocietyCounts, listProperties } from '@/lib/properties';

const AREA_IMAGES = ['villa-1', 'villa-2', 'apartment-1', 'plot-1', 'commercial-1', 'farmhouse-1'];

export default async function HomePage() {
  const [settings, featured, latestRent, societies, faqs, testimonials] = await Promise.all([
    getSettings(),
    listProperties({ featured: true, status: 'available', limit: 6 }),
    listProperties({ purpose: 'rent', status: 'available', limit: 3 }),
    getSocietyCounts(),
    getFaqs(),
    getTestimonials(),
  ]);

  const [first, ...rest] = settings.hero_title.split(' in ');

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">{settings.site_name} {settings.site_tagline}</span>
          <h1>{rest.length ? <>{first} in <em>{rest.join(' in ')}</em></> : settings.hero_title}</h1>
          <p className="lead">{settings.hero_subtitle}</p>
          <div className="hero-badges">
            <span className="badge-pill"><b>✓</b> 3-Step Legal Verification</span>
            <span className="badge-pill"><b>{settings.years_experience}</b> Years Experience</span>
            <span className="badge-pill"><b>100%</b> Scam-Free Deals</span>
          </div>
        </div>
      </section>

      <div className="container search-box">
        <SearchBox />
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What we do</span>
            <h2>Complete Real Estate Solutions</h2>
            <p>From your first site visit to the final transfer, and from an empty plot to the keys of a finished home.</p>
          </div>
          <ServicesGrid />
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="row-between">
            <div>
              <span className="eyebrow">Available options</span>
              <h2>Featured Properties</h2>
            </div>
            <Link href="/properties" className="btn btn-outline">View All Properties</Link>
          </div>
          <div className="grid-3">
            {featured.items.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container easy">
          <div>
            <span className="eyebrow">Concierge service</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)' }}>The Easy Option: we do the work, you make the decision</h2>
            <p>Designed for busy professionals and overseas Pakistanis. Delegate the entire process to a dedicated senior consultant.</p>
            <ul className="easy-list">
              {['Market research and a shortlist that fits your budget', 'Video walkthroughs and on-site inspections', 'Price negotiation on your behalf', 'Complete legal paperwork and transfer'].map((t) => (
                <li key={t}><span className="check">✓</span> {t}</li>
              ))}
            </ul>
            <Link href="/easy-option" className="btn btn-gold">Learn About the Easy Option</Link>
          </div>
          <div className="easy-panel">
            <h3>Why clients choose us</h3>
            <p style={{ color: '#b9c3d3' }}>Numbers that speak for our track record.</p>
            <div className="stats" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="stat"><b>{settings.years_experience}</b><span>Years in the market</span></div>
              <div className="stat"><b>{settings.happy_clients}</b><span>Happy clients</span></div>
              <div className="stat"><b>{settings.deals_closed}</b><span>Deals closed</span></div>
              <div className="stat"><b>100%</b><span>Verified listings</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Explore</span>
            <h2>Popular Locations</h2>
            <p>We specialise in Islamabad and Rawalpindi&apos;s most trusted housing societies.</p>
          </div>
          <div className="grid-3">
            {societies.map((s, i) => (
              <Link key={s.society} href={`/properties?society=${encodeURIComponent(s.society)}`} className="area-card" style={{ backgroundImage: `url(/demo/${AREA_IMAGES[i % AREA_IMAGES.length]}.svg)` }}>
                <div>
                  <h3>{s.society}</h3>
                  <span>{s.count} {s.count === 1 ? 'property' : 'properties'} available</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Peace of mind</span>
            <h2>Our 3-Step Legal Verification</h2>
            <p>Every listing in our portfolio passes these checks before it reaches you.</p>
          </div>
          <VerificationSteps />
        </div>
      </section>

      {latestRent.items.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="row-between">
              <div>
                <span className="eyebrow">Ready to move in</span>
                <h2>Latest Rentals</h2>
              </div>
              <Link href="/properties?purpose=rent" className="btn btn-outline">All Rentals</Link>
            </div>
            <div className="grid-3">
              {latestRent.items.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Testimonials</span>
            <h2>What Our Clients Say</h2>
          </div>
          <Testimonials items={testimonials} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <FaqList faqs={faqs} />
        </div>
      </section>

      <CtaBanner settings={settings} />
    </>
  );
}
