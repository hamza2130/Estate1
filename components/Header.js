'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { Icon } from './Icons';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/services', label: 'Services' },
  { href: '/easy-option', label: 'Easy Option' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Header({ settings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <div className="topbar">
        <div className="container">
          <div className="topbar-items">
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`}><Icon.phone style={{ verticalAlign: '-3px' }} /> {settings.phone}</a>
            <a href={`mailto:${settings.email}`} className="topbar-hide-sm"><Icon.mail style={{ verticalAlign: '-3px' }} /> {settings.email}</a>
          </div>
          <div className="topbar-items topbar-hide-sm">
            <span><Icon.clock style={{ verticalAlign: '-3px' }} /> {settings.office_hours}</span>
          </div>
        </div>
      </div>
      <header className="header">
        <div className="container">
          <Logo settings={settings} />
          <button className="nav-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
          <nav className={`nav ${open ? 'open' : ''}`}>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={isActive(l.href) ? 'active' : ''}>{l.label}</Link>
            ))}
            <Link href="/contact?type=sell" className="btn btn-gold btn-sm">List Your Property</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
