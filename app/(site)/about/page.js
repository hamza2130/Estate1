import { CtaBanner, PageHero, Testimonials, VerificationSteps, initials } from '@/components/Sections';
import { getSettings, getTeam, getTestimonials } from '@/lib/content';

export const metadata = { title: 'About Us' };

export default async function AboutPage() {
  const [settings, team, testimonials] = await Promise.all([getSettings(), getTeam(), getTestimonials()]);
  return (
    <>
      <PageHero title="About Us" subtitle={`${settings.site_name} ${settings.site_tagline}: real estate done honestly.`} />
      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">Who we are</span>
            <h2>A trusted name in Islamabad real estate</h2>
            <p className="muted">{settings.about_intro}</p>
            <p className="muted">We focus on DHA, Bahria Town and Islamabad&apos;s CDA sectors, serving local buyers and overseas Pakistanis alike. Our team consists of senior agents with a minimum of {settings.years_experience} years of local experience, and every listing in our portfolio undergoes a rigorous three-step legal verification.</p>
            <div className="stats" style={{ marginTop: 28 }}>
              <div className="stat"><b>{settings.years_experience}</b><span>Years</span></div>
              <div className="stat"><b>{settings.happy_clients}</b><span>Clients</span></div>
              <div className="stat"><b>{settings.deals_closed}</b><span>Deals</span></div>
              <div className="stat"><b>100%</b><span>Verified</span></div>
            </div>
          </div>
          <div className="split-media"><img src="/demo/commercial-1.svg" alt="Our head office" /></div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container split">
          <div className="split-media"><img src="/demo/interior-1.svg" alt="Client lounge" /></div>
          <div>
            <span className="eyebrow">Message from the CEO</span>
            <h2>{settings.ceo_name}</h2>
            <p style={{ color: 'var(--gold)', fontWeight: 600, marginTop: -8 }}>CEO & Founder</p>
            <div className="quote-card">“{settings.ceo_message}”</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><span className="eyebrow">Our people</span><h2>Meet the Team</h2></div>
          <div className="grid-4">
            {team.map((m) => (
              <div className="card team-card" key={m.id}>
                <span className="avatar">{initials(m.name)}</span>
                <h3>{m.name}</h3>
                <div className="role">{m.role}</div>
                <p>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head"><span className="eyebrow">Our promise</span><h2>3-Step Legal Verification</h2></div>
          <VerificationSteps />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><span className="eyebrow">Testimonials</span><h2>Trusted by Hundreds of Families</h2></div>
          <Testimonials items={testimonials} />
        </div>
      </section>
      <CtaBanner settings={settings} />
    </>
  );
}
