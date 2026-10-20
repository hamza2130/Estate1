import Link from 'next/link';
import Logo from './Logo';
import { Icon } from './Icons';

export default function Footer({ settings }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo settings={settings} />
            <p style={{ marginTop: 18 }}>{settings.about_intro}</p>
            <div className="socials">
              <a href={settings.facebook} aria-label="Facebook">f</a>
              <a href={settings.instagram} aria-label="Instagram">ig</a>
              <a href={settings.youtube} aria-label="YouTube">yt</a>
            </div>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/properties?purpose=sale">Properties for Sale</Link></li>
              <li><Link href="/properties?purpose=rent">Properties for Rent</Link></li>
              <li><Link href="/properties?type=plot">Plots</Link></li>
              <li><Link href="/properties?type=commercial">Commercial</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/easy-option">The Easy Option</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Head Office</h4>
            <ul>
              <li style={{ display: 'flex', gap: 8 }}><Icon.pin style={{ marginTop: 4 }} /> {settings.address}</li>
              <li style={{ display: 'flex', gap: 8 }}><Icon.phone style={{ marginTop: 4 }} /> <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a></li>
              <li style={{ display: 'flex', gap: 8 }}><Icon.mail style={{ marginTop: 4 }} /> <a href={`mailto:${settings.email}`}>{settings.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {settings.site_name} {settings.site_tagline}. All rights reserved.</span>
          <span>Demo website built by Autostack AI</span>
        </div>
      </div>
    </footer>
  );
}
