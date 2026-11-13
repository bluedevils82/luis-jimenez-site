import './globals.css';

export const metadata = {
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
