'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-medium text-gray-900 hover:text-blue-600 transition-colors">
            D.C. Blog
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm transition-colors ${pathname === '/' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              首頁
            </Link>
            <Link 
              href="/about" 
              className={`text-sm transition-colors ${pathname === '/about' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              關於我
            </Link>
            {!isAdmin && (
              <Link 
                href="/admin" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                後台管理
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
