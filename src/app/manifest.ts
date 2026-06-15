import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gellamille gyártási rendszer',
    short_name: 'Gellamille',
    description: 'LOT, készlet, partner és szállítmánykezelő rendszer',
    start_url: '/lots/new',
    display: 'standalone',
    background_color: '#f2f0ea',
    theme_color: '#5f6d58',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
