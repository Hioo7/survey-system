import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Staff Portal',
    short_name: 'Staff Portal',
    description: 'Build surveys, manage your team, and collect responses.',
    start_url: '/',
    display: 'standalone',
    background_color: '#3B2416',
    theme_color: '#3B2416',
    orientation: 'portrait',
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
