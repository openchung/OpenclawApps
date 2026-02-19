'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium text-gray-900">儀表板</h1>
        <button onClick={handleSignOut} className="text-sm text-red-600 hover:text-red-700 font-medium">
          登出
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/pages/edit/about" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-2">編輯「關於我」</h2>
          <p className="text-gray-600">修改關於頁面內容</p>
        </Link>
      </div>
    </div>
  );
}
