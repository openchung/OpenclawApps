import { getPosts, getPages } from '@/lib/db';
import Link from 'next/link';

export default async function HomePage() {
  const posts = await getPosts();
  const pages = await getPages();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="text-4xl md:text-5xl font-medium text-gray-900 mb-4">
          歡迎來到 D.C. Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          分享想法、技術與生活的點滴
        </p>
      </section>

      {/* Latest Posts */}
      <section className="mb-16">
        <h2 className="text-2xl font-medium text-gray-900 mb-8">最新文章</h2>
        
        {posts.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">暫無文章，敬請期待！</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <article 
                key={post.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('zh-TW')}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Pages Section */}
      {pages.length > 0 && (
        <section>
          <h2 className="text-2xl font-medium text-gray-900 mb-6">頁面</h2>
          <div className="flex flex-wrap gap-3">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/${page.slug}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {page.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
