import type { AppProps } from 'next/app';
import { Layout } from '@/components/layout/Layout';
import '../src/app/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <div className="pt-20">{/* Offset for fixed navbar */}
        <Component {...pageProps} />
      </div>
    </Layout>
  );
}
