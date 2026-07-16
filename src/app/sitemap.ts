import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrls = ['https://vclub.sh', 'https://www.vclub.sh'];
  const paths = ['', '/login', '/register', '/restore'];
  
  const routes: MetadataRoute.Sitemap = [];

  for (const baseUrl of baseUrls) {
    for (const route of paths) {
      routes.push({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.8,
      });
    }
  }

  return routes;
}
