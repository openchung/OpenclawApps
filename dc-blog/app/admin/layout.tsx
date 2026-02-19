import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="text-lg font-medium text-gray-900 hover:text-blue-600">
                管理後台
              </Link>
              <nav className="flex gap-4">
                <Link href="/admin/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                  儀表板
                </Link>
                <Link href="/admin/pages" className="text-sm text-gray-600 hover:text-gray-900">
                  頁面管理
                </Link>
                <Link href="/admin/posts" className="text-sm text-gray-600 hover:text-gray-900">
                  文章管理
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{session.user?.name}</span>
              <form action="/api/auth/signout" method="POST">
                <button type="submit" className="text-sm text-red-600 hover:text-red-700">
                  登出
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
