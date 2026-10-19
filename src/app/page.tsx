export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 gap-12 sm:p-20 sm:gap-16 font-sans">
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
        Portfolio
      </h1>
      <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl text-center">
        Professional ecosystem built on Next.js 14, Notion, and Upstash.
      </p>
      <div className="flex gap-4 sm:gap-6">
        <a
          href="/api/feedback"
          className="px-6 py-3 rounded-md bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2"
        >
          Get in Touch
        </a>
      </div>
    </main>
  );
}
