// GitHub API 整合
const GITHUB_CONFIG = {
  owner: 'openchung',
  repo: 'OpenclawApps',
  path: 'dc-blog/posts'
};

// 從環境或配置獲取 token（實際部署時需要替換）
let githubToken = '';

// 設置 Token
function setGithubToken(token) {
  githubToken = token;
  localStorage.setItem('github_token', token);
}

// 獲取 Token
function getGithubToken() {
  return githubToken || localStorage.getItem('github_token') || '';
}

// GitHub API 請求
async function githubAPI(endpoint, method = 'GET', data = null) {
  const token = getGithubToken();
  
  const options = {
    method,
    headers: {
      'Authorization': token ? `token ${token}` : '',
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(`https://api.github.com${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `GitHub API Error: ${response.status}`);
  }
  
  return response.json();
}

// 獲取所有文章檔案
async function fetchPostsFromGithub() {
  try {
    const data = await githubAPI(`/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`);
    
    const mdFiles = data.filter(file => file.name.endsWith('.md'));
    
    const posts = await Promise.all(
      mdFiles.map(async file => {
        const content = await githubAPI(file.url);
        return {
          sha: content.sha,
          filename: file.name,
          slug: file.name.replace('.md', ''),
          content: atob(content.content),
          downloadedAt: new Date().toISOString()
        };
      })
    );
    
    return posts;
  } catch (error) {
    console.error('Failed to fetch posts from GitHub:', error);
    return [];
  }
}

// 儲存文章到本地（不發佈）
async function savePostToLocal(slug, content, frontmatter) {
  const db = getDB();
  
  const post = {
    slug,
    title: frontmatter.title,
    content,
    frontmatter,
    excerpt: frontmatter.excerpt || content.substring(0, 200) + '...',
    author: frontmatter.author || 'Admin',
    date: frontmatter.date || new Date().toISOString(),
    published: false,
    savedAt: new Date().toISOString()
  };
  
  // 檢查是否已存在
  const existingIndex = db.posts.findIndex(p => p.slug === slug);
  
  if (existingIndex >= 0) {
    db.posts[existingIndex] = { ...db.posts[existingIndex], ...post };
  } else {
    db.posts.push(post);
  }
  
  saveDB(db);
  return post;
}

// 發佈文章到 GitHub
async function publishPostToGithub(slug, content, frontmatter) {
  const token = getGithubToken();
  
  if (!token) {
    throw new Error('請先設置 GitHub Token');
  }
  
  const filename = `${slug}.md`;
  const path = `${GITHUB_CONFIG.path}/${filename}`;
  
  // 构建完整的 Markdown 內容（包含 frontmatter）
  const fullContent = `---
title: ${frontmatter.title}
date: ${frontmatter.date}
author: ${frontmatter.author || 'Admin'}
excerpt: ${frontmatter.excerpt || content.substring(0, 200).replace(/\n/g, ' ')}
published: true
---

${content}`;

  try {
    // 檢查檔案是否存在
    let sha = null;
    try {
      const existing = await githubAPI(`/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`);
      sha = existing.sha;
    } catch (e) {
      // 檔案不存在，這是新增
    }
    
    const data = {
      message: `feat: ${sha ? '更新' : '新增'}文章 - ${frontmatter.title}`,
      content: btoa(unescape(encodeURIComponent(fullContent))),
      ...(sha ? { sha } : {})
    };
    
    await githubAPI(`/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`, 'PUT', data);
    
    // 更新本地數據庫
    const db = getDB();
    const existingIndex = db.posts.findIndex(p => p.slug === slug);
    
    const post = {
      slug,
      title: frontmatter.title,
      content,
      frontmatter,
      excerpt: frontmatter.excerpt || content.substring(0, 200) + '...',
      author: frontmatter.author || 'Admin',
      date: frontmatter.date,
      published: true,
      publishedAt: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      db.posts[existingIndex] = { ...db.posts[existingIndex], ...post };
    } else {
      db.posts.push(post);
    }
    
    saveDB(db);
    
    return { success: true, post };
  } catch (error) {
    console.error('Failed to publish to GitHub:', error);
    throw error;
  }
}

// 從 GitHub 刪除文章
async function deletePostFromGithub(slug) {
  const token = getGithubToken();
  
  if (!token) {
    throw new Error('請先設置 GitHub Token');
  }
  
  const filename = `${slug}.md`;
  const path = `${GITHUB_CONFIG.path}/${filename}`;
  
  try {
    // 獲取檔案的 sha
    const file = await githubAPI(`/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`);
    
    // 刪除檔案
    await githubAPI(
      `/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`,
      'DELETE',
      {
        message: `feat: 刪除文章 - ${slug}`,
        sha: file.sha
      }
    );
    
    // 更新本地數據庫
    const db = getDB();
    db.posts = db.posts.filter(p => p.slug !== slug);
    saveDB(db);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete from GitHub:', error);
    throw error;
  }
}

// 從 GitHub 獲取單篇文章
async function fetchPostFromGithub(slug) {
  try {
    const filename = `${slug}.md`;
    const path = `${GITHUB_CONFIG.path}/${filename}`;
    const file = await githubAPI(`/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`);
    
    const content = atob(file.content);
    
    // 解析 frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (!frontmatterMatch) {
      return {
        slug,
        content,
        frontmatter: {}
      };
    }
    
    const frontmatterText = frontmatterMatch[1];
    const bodyContent = frontmatterMatch[2];
    
    // 簡單的 frontmatter 解析
    const frontmatter = {};
    frontmatterText.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        frontmatter[key.trim()] = valueParts.join(':').trim();
      }
    });
    
    return {
      slug,
      content: bodyContent,
      frontmatter,
      sha: file.sha
    };
  } catch (error) {
    console.error('Failed to fetch post from GitHub:', error);
    return null;
  }
}

// 同步 GitHub 文章到本地
async function syncPostsFromGithub() {
  const posts = await fetchPostsFromGithub();
  const db = getDB();
  
  posts.forEach(remotePost => {
    const localIndex = db.posts.findIndex(p => p.slug === remotePost.slug);
    
    const post = {
      slug: remotePost.slug,
      content: remotePost.content,
      frontmatter: {},
      title: remotePost.slug,
      published: true,
      syncedAt: new Date().toISOString()
    };
    
    // 解析 frontmatter
    const frontmatterMatch = remotePost.content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (frontmatterMatch) {
      const frontmatterText = frontmatterMatch[1];
      const bodyContent = frontmatterMatch[2];
      
      frontmatterText.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
          post.frontmatter[key.trim()] = valueParts.join(':').trim();
        }
      });
      
      post.title = post.frontmatter.title || remotePost.slug;
      post.content = bodyContent;
      post.excerpt = post.frontmatter.excerpt || bodyContent.substring(0, 200) + '...';
      post.author = post.frontmatter.author || 'Admin';
      post.date = post.frontmatter.date || new Date().toISOString();
    }
    
    if (localIndex >= 0) {
      db.posts[localIndex] = { ...db.posts[localIndex], ...post };
    } else {
      db.posts.push(post);
    }
  });
  
  saveDB(db);
  return posts.length;
}
