import '../index.css';
import '../styles/styles.css';
import ClientLayout from './ClientLayout';

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
    <html lang="en">
      <head>
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
