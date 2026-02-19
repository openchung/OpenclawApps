export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © 2026 D.C. Blog. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-600">
            <a href="/" className="hover:text-gray-900 transition-colors">首頁</a>
            <a href="/about" className="hover:text-gray-900 transition-colors">關於我</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
