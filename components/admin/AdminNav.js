'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  ['/admin', 'Dashboard'],
  ['/admin/properties', 'Properties'],
  ['/admin/inquiries', 'Enquiries'],
  ['/admin/content', 'Site Content'],
  ['/admin/faqs', 'FAQs'],
  ['/admin/testimonials', 'Testimonials'],
  ['/admin/team', 'Team'],
];

export default function AdminNav({ newCount }) {
  const pathname = usePathname();
  return LINKS.map(([href, label]) => {
    const active = href === '/admin' ? pathname === href : pathname.startsWith(href);
    return (
      <Link key={href} href={href} className={active ? 'active' : ''}>
        {label}
        {href === '/admin/inquiries' && newCount > 0 && <span className="status status-new" style={{ marginLeft: 'auto' }}>{newCount}</span>}
      </Link>
    );
  });
}
