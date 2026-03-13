import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 text-gray-900 py-4 px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" prefetch={false} className="flex items-center hover:opacity-75 transition-opacity">
          <Image src="/bi_v1.png" alt="STRAIGHT LAB" width={140} height={40} className="h-9 w-auto" unoptimized />
        </Link>
        <Link
          href="/survey"
          prefetch={false}
          className="bg-[#0F3460] hover:bg-[#0a2744] text-white text-sm font-bold px-4 py-2 rounded-lg transition-all"
        >
          무료 진단 시작
        </Link>
      </div>
    </header>
  );
}
