import type { Metadata, Viewport } from 'next';
import './globals.css';
import { OfflineBanner } from '@/components/offline-banner';
import { PwaRegister } from '@/components/pwa-register';

export const metadata: Metadata = {
  title: { default: 'Gellamille rendszer', template: '%s · Gellamille' },
  description: 'LOT, készlet, partner és szállítmánykezelő rendszer',
  applicationName: 'Gellamille',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#5f6d58',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu">
      <body>
        <OfflineBanner />
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
