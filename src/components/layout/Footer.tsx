export function Footer() {
  return (
    <footer className="border-t border-[#30363d] bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[#8b949e]">
          <div className="flex items-center gap-2">
            <span>Portfolio © {new Date().getFullYear()} Mina Samir Anis Aziz</span>
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/samirmina"
              className="hover:text-[#58a6ff] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/mina-anees-2969b413b"
              className="hover:text-[#58a6ff] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
