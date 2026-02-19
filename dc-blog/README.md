# D.C. Blog - 純靜態部落格網站

一個使用純 HTML/CSS/JavaScript 建立的靜態部落格系統，不需要任何後端伺服器。

## 功能特色

- ✅ 純靜態網站，可直接部署到任何靜態主機
- ✅ Google 風格現代化 UI 設計
- ✅ 前台：首頁、關於我頁面
- ✅ 後台：登入系統、儀表板、頁面管理
- ✅ 使用 localStorage 儲存數據
- ✅ 響應式設計，支援手機瀏覽

## 登入資訊

- **帳號：** `Open`
- **密碼：** `Admin@123`

## 本地預覽

使用任何靜態伺服器即可預覽：

```bash
# 使用 Python
cd dc-blog
python3 -m http.server 8000

# 或使用 Node.js 的 serve
npx serve .

# 或直接開啟 index.html 檔案
```

## 檔案結構

```
dc-blog/
├── index.html          # 前台首頁
├── about.html          # 關於我頁面
├── css/
│   └── style.css       # 樣式表
├── js/
│   └── app.js          # JavaScript 邏輯
└── admin/
    ├── login.html      # 後台登入
    ├── dashboard.html  # 儀表板
    ├── pages.html      # 頁面管理
    ├── posts.html      # 文章管理
    └── edit-about.html # 編輯關於我
```

## 部署

可部署到任何靜態主機服務：
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

## 技術棧

- HTML5
- CSS3 (自訂變數、Flexbox、Grid)
- Vanilla JavaScript (ES6+)
- localStorage (數據儲存)
