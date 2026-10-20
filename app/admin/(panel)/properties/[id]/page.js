import Link from 'next/link';
import { notFound } from 'next/navigation';
import PropertyForm from '@/components/admin/PropertyForm';
import { getPropertyById } from '@/lib/properties';

export default async function EditProperty({ params }) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();
  return (
    <>
      <div className="admin-top">
        <h1>Edit Property</h1>
        <Link href={`/properties/${property.slug}`} target="_blank" className="btn btn-outline">View on website ↗</Link>
      </div>
      <PropertyForm property={JSON.parse(JSON.stringify(property))} />
    </>
  );
}
