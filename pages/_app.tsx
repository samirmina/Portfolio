import type { AppProps } from 'next/app';
import { Layout } from '@/components/layout/Layout';
import '../src/app/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <div className="min-h-screen">
        <Component {...pageProps} />
      </div>
    </Layout>
  );
}
