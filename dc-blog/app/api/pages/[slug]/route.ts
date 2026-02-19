import { NextRequest, NextResponse } from 'next/server';
import { updatePage, getPage } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const page = await getPage(slug);
  
  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }
  
  return NextResponse.json(page);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();
  const { title, content, published } = body;
  
  const page = await getPage(slug);
  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }
  
  const updated = await updatePage(page.id, {
    title: title || page.title,
    content: content !== undefined ? content : page.content,
    published: published !== undefined ? published : page.published,
  });
  
  return NextResponse.json(updated);
}
