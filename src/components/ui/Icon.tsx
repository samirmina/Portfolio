'use client';

import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export type IconName =
  | 'home'
  | 'activity'
  | 'insights'
  | 'repositories'
  | 'about'
  | 'contact'
  | 'github'
  | 'linkedin'
  | 'search'
  | 'video'
  | 'calendar'
  | 'star'
  | 'tag'
  | 'external'
  | 'mail'
  | 'location'
  | 'language'
  | 'endeavor';
// Central registry of inline SVG icons. Keeping them inline avoids an external
// dependency, keeps bundle size small, and guarantees every platform/page has a
// distinct identifying mark server-side renderable without hydration concerns.
const ICONS: Record<string, (props: React.SVGProps<SVGSVGElement>) => JSX.Element> = {
  home: (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  activity: (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  insights: (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 006 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.482 7.225 7.031 4.5 12 4.5c4.983 0 8.532 2.725 9.548 7.5"
      />
    </svg>
  ),
  repositories: (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 8.068 9.246 9.5 8 10.5a1 1 0 01-2 0c-1.254-.966-2.832-2.432-2-3.513C3.77 6.521 5.504 6.5 8.515 6.5h1.297c1.014 0 1.848-.021 2.184-.51v7.258c-.365.489-.866.94-1.587 1.134m5.962-1.135L16.388 6.5c1.011 0 1.744.021 2.086.51C20.618 8.069 22.194 9.535 21.938 10.5c-.217.847-.676 1.722-1.186 2.315m-7.129-2.315a1 1 0 01-2 0C7.468 9.501 5.832 8.037 4.465 6.531 3.401 6.053 2 5.557 2 5c0-.444 1.326-.5 2.64-.5h1.297c1.014 0 1.848-.021 2.184-.51v7.258c-.365.489-.866.94-1.587 1.134m5.962-1.135L16.388 6.5c1.011 0 1.744.021 2.086.51C20.618 8.069 22.194 9.535 21.938 10.5c-.217.847-.676 1.722-1.186 2.315m-7.129-2.315a1 1 0 01-2 0C7.468 9.501 5.832 8.037 4.465 6.531 3.401 6.053 2 5.557 2 5c0-.444 1.326-.5 2.64-.5"
      />
    </svg>
  ),
  about: (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 008 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  contact: (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  github: (props) => (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.724 1.205-.084 1.838 1.231 1.838 1.231 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.93 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.153 1.652.242 2.873.117 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.572C20.565 22.092 24 17.592 24 12.296c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  linkedin: (props) => (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 012.062-2.06c1.122 0 2.062.925 2.062 2.06 0 1.138-.94 2.06-2.062 2.06-1.124 0-2.062-.922-2.062-2.06zM2.527 20.452h-3.554v-5.569c0-1.328.027-3.037 1.852-3.037 1.853 0 2.136-1.445 2.136-2.939v-5.667h6.591v11.017z" />
    </svg>
  ),
  search: (props) => (
    <svg
      {...props}
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
  ),
  video: (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  calendar: (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  star: (props) => (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.91c.97 0 1.398 1.247.824 1.818l-4.204 4.177a1 1 0 00-.162 1.169l2.358 6.79a1 1 0 001.468.6l-4.852-3.624a1 1 0 00-1.323-.335L9.663 17.74a1 1 0 01-1.32-.335l-4.852 3.624a1 1 0 01-1.468-.6l2.358-6.79a1 1 0 00-.162-1.169L2.348 8.467c-.576-.571-.146-1.818.824-1.818h4.91a1 1 0 00.95-.69l1.519-4.674z"
      />
    </svg>
  ),
  tag: (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 7h.01M7 3h5c.5 0 .853.476.954 1.023l.73 3.651a.5.5 0 01-.477.558l-3.65.73a.5.5 0 01-.558-.477L5.029 7.953C4.478 7.926 4 7.354 4 6.853V3z"
      />
    </svg>
  ),
  external: (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-4l-4.586 4.586a2 2 0 11-2.828-2.828L14.586 9M14 5l5 5m0 0l-4.586 4.586a2 2 0 11-2.828-2.828L19 5"
      />
    </svg>
  ),
  mail: (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  location: (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  language: (props) => (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M3 5a2 2 0 012-2h3.24c.487 0 .932.16 1.308.443l1.067.71a1 1 0 011.374-.018l1.09-.608a1 1 0 011.375-.016l.917-.613a2 2 0 012.83.608l.619 1.237a1 1 0 01-.288 1.122l-1.194.604a1 1 0 01-1.373-.017l-1.09-.609a1 1 0 01-1.375.017l-.782.52a2 2 0 01-2.835 0l-.78-.52a2 2 0 01-1.44-1.441zM7.5 6.5a.5.5 0 000 1h2a.5.5 0 000-1z"
      />
    </svg>
  ),
  endeavor: (props) => (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002-2h2a2 2 0 002 2v6a2 2 0 012-2h2a2 2 0 012-2v-4.343c.61-.61 1.84-.888 2.79-.545a3 3 0 012.629 3.588 3 3 0 002.629 3.587 3 3 0 012.629-3.587c.95-.347 2.179-.065 2.79.545V22a2 2 0 01-2 2h-6a2 2 0 01-2-2v-4.343c.61-.61 1.84-.888 2.79-.545a3 3 0 012.629-3.588 3 3 0 002.629-3.587c-.95-.347-2.179-.065-2.79.545V22a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
};

type IconProps = PropsWithChildren<{
  name: IconName;
  className?: string;
  size?: number;
  color?: string;
}>;

export function Icon({ name, className, size, color, ...rest }: IconProps) {
  const Comp = ICONS[name];
  if (!Comp) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center shrink-0',
        className,
        size ? `h-${size} w-${size}` : 'h-5 w-5'
      )}
    >
      <Comp
        {...rest}
        className={cn(
          color ? `text-${color}` : 'currentColor',
          size ? `h-${size} w-${size}` : 'h-5 w-5'
        )}
      />
    </span>
  );
}