import React from 'react';

// Title/description/canonical/OG/Twitter tags are owned by each route's
// `metadata`/`generateMetadata` export (see src/app/**/page.jsx) — the only
// mechanism Next.js bakes into the static-exported HTML per route.
// Organization/LocalBusiness schema is emitted once, globally, in src/app/layout.jsx.
// This component only handles page-specific JSON-LD (BreadcrumbList, Product, ItemList, etc).
export default function SEO({ jsonLd = [] }) {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}
