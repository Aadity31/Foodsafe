/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://foodsafe.apsgroupco.com/',
  generateRobotsTxt: true,
  outDir: './public',
  generateIndexSitemap: false,
  // Pages to exclude from sitemap (private/protected pages)
  exclude: [
    '/admin/*',
    '/dashboard/*',
    '/auth/signout',
    '/verification-pending',
    '/api/*',
  ],
  // Additional pages to include
  additionalPaths: async (config) => {
    const result = [
      {
        loc: '/',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 1,
      },
      {
        loc: '/about',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8,
      },
      {
        loc: '/contact',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8,
      },
      {
        loc: '/how-it-works',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.9,
      },
      {
        loc: '/impact',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: '/privacy',
        lastmod: new Date().toISOString(),
        changefreq: 'yearly',
        priority: 0.3,
      },
      {
        loc: '/terms',
        lastmod: new Date().toISOString(),
        changefreq: 'yearly',
        priority: 0.3,
      },
      {
        loc: '/auth/login',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.7,
      },
      {
        loc: '/auth/register',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.7,
      },
    ];
    return result;
  },
}
