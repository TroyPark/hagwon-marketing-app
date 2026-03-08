import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '학원 마케팅 무료 견적 진단 | 5분 설문',
  description: '학원 운영자를 위한 맞춤 온라인 마케팅 전략과 견적서를 5분 만에 받아보세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
