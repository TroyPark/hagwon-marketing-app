import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-[#0F3460] text-white py-4 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl">🎓</span>
          <span className="font-bold text-lg">학원 마케팅 진단</span>
        </Link>
        <Link
          href="/survey"
          className="bg-[#E94560] hover:bg-[#c73550] text-white text-sm font-bold px-4 py-2 rounded-lg transition-all"
        >
          무료 진단 시작
        </Link>
      </div>
    </header>
  );
}
