import Link from 'next/link';
import { Icon } from './Icons';
import { formatArea, formatPrice, typeLabel } from '@/lib/format';

export default function PropertyCard({ property: p }) {
  const closed = p.status === 'sold' || p.status === 'rented';
  return (
    <article className="card">
      <Link href={`/properties/${p.slug}`} className="prop-media">
        <img src={p.cover || '/demo/villa-1.svg'} alt={p.title} />
        <div className="prop-tags">
          <span className={`tag ${p.purpose === 'rent' ? 'tag-rent' : 'tag-sale'}`}>{p.purpose === 'rent' ? 'For Rent' : 'For Sale'}</span>
          {p.featured && !closed && <span className="tag tag-featured">Featured</span>}
          {closed && <span className="tag tag-sold">{p.status}</span>}
        </div>
        {p.verified && <span className="tag tag-verified">✓ Verified</span>}
      </Link>
      <div className="prop-body">
        <div className="prop-price">
          {formatPrice(p.price)} {p.purpose === 'rent' && <small>/ month</small>}
        </div>
        <h3 className="prop-title"><Link href={`/properties/${p.slug}`}>{p.title}</Link></h3>
        <div className="prop-loc"><Icon.pin /> {p.location || `${p.society}, ${p.city}`}</div>
        <div className="prop-meta">
          {p.bedrooms > 0 && <span><Icon.bed /> {p.bedrooms} Beds</span>}
          {p.bathrooms > 0 && <span><Icon.bath /> {p.bathrooms} Baths</span>}
          <span><Icon.area /> {formatArea(p.area_value, p.area_unit)}</span>
          {!p.bedrooms && <span>{typeLabel(p.property_type)}</span>}
        </div>
      </div>
    </article>
  );
}
