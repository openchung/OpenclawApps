import { getPosts, getPages } from '@/lib/db';
import Link from 'next/link';

export default async function DashboardPage() {
  const posts = await getPosts();
  const pages = await getPages();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-medium text-gray-900">儀表板</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">已發布文章</h2>
          <p className="text-4xl font-medium text-blue-600">{posts.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">頁面數量</h2>
          <p className="text-4xl font-medium text-green-600">{pages.length}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">快速操作</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/pages/edit/about"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            編輯「關於我」
          </Link>
          <Link
            href="/admin/pages"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
          >
            管理頁面
          </Link>
          <Link
            href="/admin/posts"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
          >
            管理文章
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">最近文章</h2>
        {posts.length === 0 ? (
          <p className="text-gray-600 text-sm">暫無文章</p>
        ) : (
          <div className="space-y-3">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-900">{post.title}</span>
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString('zh-TW')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
