import Link from 'next/link';

export default function Logo({ settings, href = '/' }) {
  return (
    <Link href={href} className="logo" aria-label={`${settings.site_name} home`}>
      <span className="logo-mark">AI</span>
      <span className="logo-text">
        <strong>{settings.site_name}</strong>
        <span>{settings.site_tagline}</span>
      </span>
    </Link>
  );
}
