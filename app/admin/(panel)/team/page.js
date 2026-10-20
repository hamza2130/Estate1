import ContentManager from '@/components/admin/ContentManager';
import { getTeam } from '@/lib/content';

export default async function TeamPage() {
  const rows = await getTeam();
  return (
    <>
      <div className="admin-top"><h1>Team Members</h1></div>
      <ContentManager table="team_members" itemLabel="Team Member" rows={rows} fields={[['name', 'Name'], ['role', 'Role'], ['phone', 'Phone'], ['sort', 'Order', 'number'], ['bio', 'Short bio', 'textarea']]} />
    </>
  );
}
