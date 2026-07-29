import { Inter, Fraunces } from 'next/font/google';
import '../styles/lenis.css';
import '../styles/styles.css';
import '../styles/products.css';
import '../index.css';
import ClientLayout from './ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata = {
  title: 'AIVA Enterprises - Premium Food Sourcing',
  description: 'AIVA Enterprises is a global sourcing and supply company delivering premium aseptic fruit pulps, concentrates, and IQF fruits.',
  openGraph: {
    title: 'AIVA Enterprises - Premium Food Sourcing',
    description: 'AIVA Enterprises is a global sourcing and supply company delivering premium aseptic fruit pulps, concentrates, and IQF fruits.',
    images: ['/assets/images/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIVA Enterprises - Premium Food Sourcing',
    description: 'AIVA Enterprises is a global sourcing and supply company delivering premium aseptic fruit pulps, concentrates, and IQF fruits.',
    images: ['/assets/images/og-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <meta name="theme-color" content="#F5EAD8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="preconnect" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script src="https://unpkg.com/@phosphor-icons/web" defer></script>
      </head>
      <body className="loading dark-theme">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
