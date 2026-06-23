import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://www.aivaenterprises.com/assets/images/og-image.webp',
  twitterCard = 'summary_large_image',
  jsonLd = [],
}) {
  const siteName = 'AIVA Enterprises';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const url = canonicalUrl ? `https://www.aivaenterprises.com${canonicalUrl}` : 'https://www.aivaenterprises.com/';

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
