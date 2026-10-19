'use client';

import { useState, useRef, useCallback } from 'react';

type MediaFacadeProps = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

export function MediaFacade({
  src,
  alt = 'Embedded media',
  width = 560,
  height = 315,
  className,
}: MediaFacadeProps) {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleActivate = useCallback(() => {
    setLoaded(true);
  }, []);

  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  const embedSrc = isYouTube ? `${src}&autoplay=1` : src;

  return (
    <div
      ref={containerRef}
      className={
        `relative aspect-video rounded-lg border border-slate-700 bg-slate-900 overflow-hidden ${className ?? ''}`
      }
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleActivate();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={alt}
      aria-expanded={loaded}
      aria-haspopup="dialog"
    >
      {!loaded ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-slate-400 hover:text-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900">
          <svg
            className="w-12 h-12 mb-4 text-teal-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1.13 1.13 0 0010 9.87v4.263a1.13 1.13 0 001.555.832l3.197-2.132a1.13 1.13 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm font-medium">Click to load {alt}</p>
          <p className="text-xs mt-2 opacity-70">
            Heavy iframe loads only on interaction
          </p>
        </div>
      ) : null}
      {loaded && (
        <iframe
          className="absolute inset-0 w-full h-full border-0"
          src={embedSrc}
          title={alt}
          width={width}
          height={height}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  );
}
