import './globals.css';

export const viewport = {
  themeColor: '#050505',
};

export const metadata = {
  applicationName: 'Jimenez Family AI',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }, { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: { capable: true, title: 'Jimenez AI', statusBarStyle: 'black' },
  title: 'Jimenez Family AI — Image & Video Studio',
  description: 'The Jimenez family AI studio: generate images, videos, lip sync and cinematic shots with models like Flux, Kling, Veo and Seedance.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
