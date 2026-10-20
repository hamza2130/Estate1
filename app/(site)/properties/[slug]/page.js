import Link from 'next/link';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import InquiryForm from '@/components/InquiryForm';
import PropertyCard from '@/components/PropertyCard';
import { Icon } from '@/components/Icons';
import { getSettings } from '@/lib/content';
import { formatArea, formatDate, formatPrice, formatPriceFull, purposeLabel, typeLabel } from '@/lib/format';
import { getPropertyBySlug, getSimilar } from '@/lib/properties';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getPropertyBySlug(slug);
  return p ? { title: p.title, description: p.description.slice(0, 160) } : { title: 'Property not found' };
}

function youtubeEmbed(url) {
  const m = String(url).match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export default async function PropertyPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();
  const [settings, similar] = await Promise.all([getSettings(), getSimilar(property)]);
  const closed = property.status === 'sold' || property.status === 'rented';
  const video = youtubeEmbed(property.video_url);
  const waText = encodeURIComponent(`Hi, I'm interested in "${property.title}" (${formatPrice(property.price)}).`);

  return (
    <>
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container">
          <div className="breadcrumb" style={{ color: 'var(--muted)', marginBottom: 18 }}>
            <Link href="/">Home</Link> / <Link href="/properties">Properties</Link> / <Link href={`/properties?society=${encodeURIComponent(property.society)}`}>{property.society}</Link> / {property.title}
          </div>
          <div className="detail-layout">
            <div>
              <Gallery images={property.images} title={property.title} />
              <div className="detail-head">
                <div>
                  <div className="prop-tags" style={{ position: 'static', marginBottom: 10 }}>
                    <span className={`tag ${property.purpose === 'rent' ? 'tag-rent' : 'tag-sale'}`}>{purposeLabel(property.purpose)}</span>
                    <span className="tag tag-muted">{typeLabel(property.property_type)}</span>
                    {closed && <span className="tag tag-sold">{property.status}</span>}
                  </div>
                  <h1>{property.title}</h1>
                  <div className="prop-loc"><Icon.pin /> {[property.location || property.society, property.location.includes(property.city) ? null : property.city].filter(Boolean).join(', ')}</div>
                </div>
                <div className="detail-price">
                  {formatPrice(property.price)}
                  <small>{formatPriceFull(property.price)}{property.purpose === 'rent' ? ' per month' : ''}</small>
                </div>
              </div>

              <div className="facts">
                <div className="fact"><small>Area</small><b>{formatArea(property.area_value, property.area_unit)}</b></div>
                <div className="fact"><small>Bedrooms</small><b>{property.bedrooms || '-'}</b></div>
                <div className="fact"><small>Bathrooms</small><b>{property.bathrooms || '-'}</b></div>
                <div className="fact"><small>Listed</small><b>{formatDate(property.created_at)}</b></div>
              </div>

              <div className="panel">
                <h2>Description</h2>
                {property.description.split(/\n+/).map((para, i) => <p key={i} className="muted">{para}</p>)}
              </div>

              {property.features.length > 0 && (
                <div className="panel">
                  <h2>Features & Amenities</h2>
                  <ul className="feature-list">
                    {property.features.map((f) => <li key={f}><span className="check">✓</span> {f}</li>)}
                  </ul>
                </div>
              )}

              {video && (
                <div className="panel">
                  <h2>Video Tour</h2>
                  <div style={{ aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden' }}>
                    <iframe src={video} title="Video tour" style={{ width: '100%', height: '100%', border: 0 }} allowFullScreen />
                  </div>
                </div>
              )}

              <div className="panel">
                <h2>Property Details</h2>
                <div className="facts" style={{ marginBottom: 0 }}>
                  <div className="fact"><small>Reference</small><b>AS-{String(property.id).padStart(4, '0')}</b></div>
                  <div className="fact"><small>Purpose</small><b>{purposeLabel(property.purpose)}</b></div>
                  <div className="fact"><small>Society</small><b>{property.society}</b></div>
                  <div className="fact"><small>City</small><b>{property.city}</b></div>
                </div>
              </div>
            </div>

            <aside className="sticky-side">
              <div className="panel">
                <div className="agent-box">
                  <span className="avatar">AI</span>
                  <div>
                    <b style={{ color: 'var(--navy)' }}>{settings.site_name} Sales Desk</b>
                    <div className="muted" style={{ fontSize: '0.9rem' }}>Senior property consultant</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
                  <a className="btn btn-navy" href={`tel:${settings.phone.replace(/\s/g, '')}`}><Icon.phone /> Call {settings.phone}</a>
                  <a className="btn btn-whatsapp" href={`https://wa.me/${settings.whatsapp}?text=${waText}`} target="_blank" rel="noreferrer"><Icon.whatsapp style={{ width: 18, height: 18 }} /> WhatsApp</a>
                </div>
                <h3 style={{ fontSize: '1.1rem' }}>Request details or a visit</h3>
                <InquiryForm kind="property" propertyId={property.id} compact submitLabel="Send Enquiry" defaultMessage={`I am interested in "${property.title}". Please share more details.`} />
              </div>
              {property.verified && (
                <div className="verify-box">
                  <b>✓ Legally verified listing.</b> This property passed our 3-step check: ownership, dues and physical inspection.
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="section section-soft">
          <div className="container">
            <div className="row-between"><h2>Similar Properties</h2></div>
            <div className="grid-3">{similar.map((p) => <PropertyCard key={p.id} property={p} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
