import InquiryForm from '@/components/InquiryForm';
import { Icon } from '@/components/Icons';
import { PageHero } from '@/components/Sections';
import { getSettings } from '@/lib/content';

export const metadata = { title: 'Contact Us' };

const TYPES = { sell: 'sell', construction: 'construction', easy: 'easy_option' };

export default async function ContactPage({ searchParams }) {
  const sp = await searchParams;
  const settings = await getSettings();
  const kind = TYPES[sp.type] || 'contact';
  return (
    <>
      <PageHero title="Contact Us" subtitle="Visit our head office or send us a message. We usually reply within a few hours." />
      <section className="section">
        <div className="container contact-layout">
          <div>
            <span className="eyebrow">Get in touch</span>
            <h2>We&apos;d love to hear from you</h2>
            <div className="contact-item">
              <div className="service-icon"><Icon.pin /></div>
              <div><b>Head Office</b><span>{settings.address}</span></div>
            </div>
            <div className="contact-item">
              <div className="service-icon"><Icon.phone /></div>
              <div><b>Phone / WhatsApp</b><span><a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a></span></div>
            </div>
            <div className="contact-item">
              <div className="service-icon"><Icon.mail /></div>
              <div><b>Email</b><span><a href={`mailto:${settings.email}`}>{settings.email}</a></span></div>
            </div>
            <div className="contact-item">
              <div className="service-icon"><Icon.clock /></div>
              <div><b>Office Hours</b><span>{settings.office_hours}</span></div>
            </div>
          </div>
          <div className="panel" style={{ margin: 0 }}>
            <h3>Send us a message</h3>
            <InquiryForm showKind kind={kind} />
          </div>
        </div>
        <div className="container">
          <div className="map">
            <iframe title="Office location" loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent('DHA Phase 3 Islamabad')}&z=13&output=embed`} />
          </div>
        </div>
      </section>
    </>
  );
}
