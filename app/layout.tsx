import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '학원 마케팅 무료 견적 진단 | STRAIGHT LAB',
  description: '스트레이트랩이 제공하는 학원 전용 마케팅 진단 서비스. 5분 설문으로 맞춤 전략과 상세 견적서를 즉시 받아보세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
