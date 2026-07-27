import React from 'react';

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

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AIVA Enterprises",
    "url": "https://aivaenterprises.com",
    "logo": "https://www.aivaenterprises.com/assets/images/logo.png",
    "description": "Your Global Sourcing Partner for premium aseptic fruit pulps, concentrates, and IQF products from India.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Immunity Group, 4th Floor, Lakhani Centrium, Sector 15",
      "addressLocality": "CBD Belapur, Navi Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "400614",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-88281-77533",
      "contactType": "customer service",
      "email": "enquire@aivaenterprises.com"
    }
  };

  const schemas = [organizationSchema, ...jsonLd];

  return (
    <>
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
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}
