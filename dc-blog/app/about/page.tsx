import { getPage, updatePage } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function AboutPage() {
  const page = await getPage('about');
  
  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-medium text-gray-900 mb-8">
          {page.title}
        </h1>
        <div 
          className="text-gray-700 leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, '<br/>') }}
        />
      </article>
    </div>
  );
}
