import ContentManager from '@/components/admin/ContentManager';
import { getTestimonials } from '@/lib/content';

export default async function TestimonialsPage() {
  const rows = await getTestimonials();
  return (
    <>
      <div className="admin-top"><h1>Testimonials</h1></div>
      <ContentManager table="testimonials" itemLabel="Testimonial" rows={rows} fields={[['name', 'Client name'], ['role', 'Role / location'], ['rating', 'Rating (1-5)', 'number'], ['sort', 'Order', 'number'], ['quote', 'Quote', 'textarea']]} />
    </>
  );
}
