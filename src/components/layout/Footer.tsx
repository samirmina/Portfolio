// Captured once at module/build time so the copyright year is identical
// between the server-rendered HTML and the client hydration pass. Calling
// new Date().getFullYear() during render can differ between server and
// client clocks and triggers a hydration mismatch.
const CURRENT_YEAR = new Date().getFullYear();

import { Icon } from '@/components/ui/Icon';

export function Footer() {
  return (
    <footer className="border-t border-[#30363d] bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[#8b949e]">
          <div className="flex items-center gap-2">
            <span>Portfolio © {CURRENT_YEAR} Mina Samir Anis Aziz</span>
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/samirmina"
              className="flex items-center gap-1 hover:text-[#58a6ff] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="github" className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/mina-anees-2969b413b"
              className="flex items-center gap-1 hover:text-[#58a6ff] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="linkedin" className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
