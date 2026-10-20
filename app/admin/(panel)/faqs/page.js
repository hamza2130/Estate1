import ContentManager from '@/components/admin/ContentManager';
import { getFaqs } from '@/lib/content';

export default async function FaqsPage() {
  const rows = await getFaqs();
  return (
    <>
      <div className="admin-top"><h1>FAQs</h1></div>
      <ContentManager table="faqs" itemLabel="FAQ" rows={rows} fields={[['question', 'Question'], ['sort', 'Order', 'number'], ['answer', 'Answer', 'textarea']]} />
    </>
  );
}
