// Lets browsers install the site as a desktop/phone app ("Install app").
export default function manifest() {
  return {
    name: 'Jimenez Family AI',
    short_name: 'Jimenez AI',
    description: 'The Jimenez family AI studio for images, videos, lip sync and cinematic shots.',
    start_url: '/studio?tab=image',
    scope: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
