'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface SearchHint {
  /** Section or page the hint describes, e.g. "Activity Logs". */
  label: string;
  /** The explanatory text that currently sits beside/below the section. */
  text: string;
}

export interface SearchFieldProps {
  className?: string;
  hints: SearchHint[];
  placeholder?: string;
  ariaLabel?: string;
  /** Optional callback invoked on Enter / live changes. */
  onSearch?: (query: string) => void;
}

/**
 * Search field for the Home page.
 *
 * The explanatory text for each section (Activity Logs, Professional
 * Insights, GitHub Repositories) is embedded *inside* the field rather than
 * rendered as separate text alongside it, so the field is self-contained.
 */
export function SearchField({
  className,
  hints,
  placeholder = 'Search activity, insights, repositories...',
  ariaLabel = 'Search',
  onSearch,
}: SearchFieldProps) {
  const [query, setQuery] = useState('');

  const commit = useCallback(
    (value: string) => {
      setQuery(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSearch?.(query);
      }
    },
    [query, onSearch]
  );

  return (
    <div
      className={cn(
        'rounded-xl border border-[#30363d] bg-[#161b22] p-6 space-y-4 shadow-lg',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <svg
          className="w-5 h-5 text-[#58a6ff] shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <label htmlFor="portfolio-search" className="sr-only">
          {ariaLabel}
        </label>
        <input
          id="portfolio-search"
          type="text"
          role="searchbox"
          value={query}
          onChange={(e) => commit(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[#c9d1d9] placeholder-[#484f58] focus:outline-none text-lg"
        />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#8b949e]">
        {hints.map((hint) => (
          <div key={hint.label} className="flex items-start gap-2">
            <span className="text-[#58a6ff] font-medium shrink-0">
              {hint.label}:
            </span>
            <span>{hint.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}