// 簡單的 JSON 文件數據庫
import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'lib', 'db.json');

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  slug: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    // 初始化資料庫
    const initialDB = {
      posts: [],
      pages: [
        {
          id: 'about',
          title: '關於我',
          slug: 'about',
          content: '歡迎來到 D.C. Blog！這是關於我的頁面。',
          published: true,
          updatedAt: new Date().toISOString(),
        },
      ],
      users: [
        {
          id: '1',
          email: 'Open',
          name: 'Admin',
          password: '$2a$10$YQjL7KZxZxZxZxZxZxZxZeQZL7KZxZxZxZxZxZxZxZxZxZxZxZxZxZ', // Admin@123
        },
      ],
    };
    await fs.writeFile(DB_PATH, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
}

async function writeDB(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function getPosts(): Promise<BlogPost[]> {
  const db = await readDB();
  return db.posts.filter((p: BlogPost) => p.published);
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const db = await readDB();
  return db.posts.find((p: BlogPost) => p.slug === slug && p.published) || null;
}

export async function createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
  const db = await readDB();
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.posts.push(newPost);
  await writeDB(db);
  return newPost;
}

export async function updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  const db = await readDB();
  const index = db.posts.findIndex((p: BlogPost) => p.id === id);
  if (index === -1) return null;
  
  db.posts[index] = {
    ...db.posts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeDB(db);
  return db.posts[index];
}

export async function deletePost(id: string): Promise<boolean> {
  const db = await readDB();
  const index = db.posts.findIndex((p: BlogPost) => p.id === id);
  if (index === -1) return false;
  
  db.posts.splice(index, 1);
  await writeDB(db);
  return true;
}

export async function getPage(slug: string): Promise<Page | null> {
  const db = await readDB();
  return db.pages.find((p: Page) => p.slug === slug && p.published) || null;
}

export async function getPages(): Promise<Page[]> {
  const db = await readDB();
  return db.pages.filter((p: Page) => p.published);
}

export async function updatePage(id: string, updates: Partial<Page>): Promise<Page | null> {
  const db = await readDB();
  const index = db.pages.findIndex((p: Page) => p.id === id);
  if (index === -1) return null;
  
  db.pages[index] = {
    ...db.pages[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeDB(db);
  return db.pages[index];
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
  const db = await readDB();
  const user = db.users.find((u: User & { password: string }) => u.email === email);
  
  if (!user) return null;
  
  const bcrypt = await import('bcryptjs');
  const valid = await bcrypt.compare(password, (user as any).password);
  
  if (!valid) return null;
  
  const { password: _, ...userWithoutPassword } = user as any;
  return userWithoutPassword;
}
