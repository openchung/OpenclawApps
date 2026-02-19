import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('authjs.session-token');
  
  // 如果不是登入頁面且沒有 session，redirect 到登入頁
  if (!request.nextUrl.pathname.startsWith('/admin/login') && !session) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // 如果在登入頁面且有 session，redirect 到儀表板
  if (request.nextUrl.pathname.startsWith('/admin/login') && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
