// 簡單的本地數據庫（使用 localStorage）
const DB_KEY = 'dcblog_data';

// 初始數據
const initialData = {
  posts: [],
  pages: {
    about: {
      title: '關於我',
      content: '歡迎來到 D.C. Blog！這是關於我的頁面。',
      published: true
    }
  },
  admin: {
    username: 'Open',
    password: 'Admin@123'
  }
};

// 初始化數據庫
function initDB() {
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify(initialData));
  }
}

// 獲取數據
function getDB() {
  return JSON.parse(localStorage.getItem(DB_KEY) || JSON.stringify(initialData));
}

// 保存數據
function saveDB(data) {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

// 載入文章
function loadPosts() {
  const db = getDB();
  const container = document.getElementById('posts-container');
  
  if (!container) return;
  
  if (db.posts.length === 0) {
    container.innerHTML = '<p style="color: #5f6368; text-align: center; padding: 40px;">暫無文章，敬請期待！</p>';
    return;
  }
  
  container.innerHTML = db.posts.map(post => `
    <article class="post-card">
      <h3>${escapeHtml(post.title)}</h3>
      <p class="excerpt">${escapeHtml(post.excerpt)}</p>
      <div class="meta">
        <span>${escapeHtml(post.author)}</span> • 
        <span>${new Date(post.date).toLocaleDateString('zh-TW')}</span>
      </div>
    </article>
  `).join('');
}

// 載入頁面
function loadPage(slug) {
  const db = getDB();
  const page = db.pages[slug];
  
  if (!page) {
    document.getElementById('page-content').innerHTML = '<p>頁面不存在</p>';
    return;
  }
  
  document.getElementById('page-title').textContent = page.title;
  document.getElementById('page-content').textContent = page.content;
}

// HTML 轉義
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 登入驗證
function login(username, password) {
  const db = getDB();
  return username === db.admin.username && password === db.admin.password;
}

// 檢查是否已登入
function isLoggedIn() {
  return localStorage.getItem('dcblog_admin_logged_in') === 'true';
}

// 登入
function setLoggedIn(status) {
  localStorage.setItem('dcblog_admin_logged_in', status);
}

// 登出
function logout() {
  localStorage.removeItem('dcblog_admin_logged_in');
}

// 更新頁面內容
function updatePage(slug, data) {
  const db = getDB();
  db.pages[slug] = { ...db.pages[slug], ...data };
  saveDB(db);
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
  initDB();
});
