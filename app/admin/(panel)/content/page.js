import SettingsForm from '@/components/admin/SettingsForm';
import { getSettings } from '@/lib/content';

export default async function ContentPage() {
  const settings = await getSettings();
  return (
    <>
      <div className="admin-top"><h1>Site Content</h1></div>
      <SettingsForm settings={settings} />
    </>
  );
}
