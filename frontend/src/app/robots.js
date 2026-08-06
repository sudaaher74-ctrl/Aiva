export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/chatbot',
    },
    sitemap: 'https://www.aivaenterprises.com/sitemap.xml',
  };
}
