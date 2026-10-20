'use client';

import { useState } from 'react';
import { RepositoryCard } from './RepositoryCard';

interface Repo {
  title: string;
  repoName: string;
  description: string;
  url: string;
  stargazers: number;
  commitCount: number;
  lastCommitAt: string | null;
  language: string | null;
}

export function RepositoryCarousel({ repositories }: { repositories: Repo[] }) {
  const [index, setIndex] = useState(0);

  if (repositories.length === 0) {
    return <p className="text-[#8b949e] py-8">No repositories found.</p>;
  }

  const current = repositories[index];
  const prev = () => setIndex((i) => (i === 0 ? repositories.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === repositories.length - 1 ? 0 : i + 1));

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-[#8b949e]">
          {index + 1} / {repositories.length}
        </span>
        <div className="flex gap-3">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-md border border-[#30363d] bg-[#161b22] text-[#c9d1d9] hover:bg-[#21262d] flex items-center justify-center transition-colors"
            aria-label="Previous repository"
          >
            ←
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-md border border-[#30363d] bg-[#161b22] text-[#c9d1d9] hover:bg-[#21262d] flex items-center justify-center transition-colors"
            aria-label="Next repository"
          >
            →
          </button>
        </div>
      </div>
      <div className="pb-4">
        <RepositoryCard {...current} />
      </div>
    </div>
  );
}
