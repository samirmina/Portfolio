export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-teal-500 font-bold text-lg tracking-tight">
            <span>▲</span> Portfolio
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a
              href="https://github.com/samirmina"
              className="hover:text-teal-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/samirmina"
              className="hover:text-teal-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <span className="text-slate-600">© {new Date().getFullYear()} Samir Mena</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
