import type { Metadata, Viewport } from 'next';
import { Inter, Cairo } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AttendanceApp - نظام الحضور والانصراف',
  description: 'تطبيق شامل لإدارة الحضور والانصراف والإجازات والأوفر تايم',
  keywords: ['الحضور', 'الانصراف', 'الإجازات', 'الأوفر تايم', 'تقارير', 'إدارة الموظفين'],
  authors: [{ name: 'AttendanceApp' }],
  creator: 'AttendanceApp',
  publisher: 'AttendanceApp',
  robots: 'index, follow',
  openGraph: {
    title: 'AttendanceApp - نظام الحضور والانصراف',
    description: 'تطبيق شامل لإدارة الحضور والانصراف والإجازات والأوفر تايم',
    type: 'website',
    locale: 'ar_EG',
    siteName: 'AttendanceApp',
  },
};

export const viewport: Viewport = {
  themeColor: '#2E7D32',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${cairo.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-background font-arabic antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}