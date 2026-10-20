import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Icon } from '@/components/Icons';
import { getSettings } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }) {
  const settings = await getSettings();
  return (
    <>
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
      <a className="wa-float" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <Icon.whatsapp />
      </a>
    </>
  );
}
