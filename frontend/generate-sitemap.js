// generate-sitemap.js
import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'node:fs';

// Base domain of your site
const sitemap = new SitemapStream({ hostname: 'https://yourdomain.com' });

// List of static routes
const urls = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  { url: '/category/plants', changefreq: 'weekly', priority: 0.9 },
  { url: '/category/seeds', changefreq: 'weekly', priority: 0.9 },
  // Add more as needed
];

// Pipe sitemap to a file
const writeStream = createWriteStream('./public/sitemap.xml');
sitemap.pipe(writeStream);

urls.forEach((url) => sitemap.write(url));
sitemap.end();

try {
  await streamToPromise(sitemap);
  console.log('✅ sitemap.xml generated successfully!');
} catch (err) {
  console.error('❌ Failed to generate sitemap:', err);
}
