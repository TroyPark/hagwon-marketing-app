'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function HomeNav() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });
  }, []);

  return (
    <nav className="border-b border-black/10 px-6 py-5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" prefetch={false} className="flex items-center hover:opacity-60 transition-opacity">
          <Image src="/bi_v1.png" alt="STRAIGHT LAB" width={148} height={42} className="h-9 w-auto" unoptimized />
        </Link>

        <div className="flex items-center gap-3">
          {loggedIn === null ? null : loggedIn ? (
            <Link
              href="/member/dashboard"
              prefetch={false}
              className="text-xs font-bold text-[#111111] border border-[#111111] px-4 py-2.5 hover:bg-[#111111] hover:text-white transition-colors uppercase tracking-widest"
            >
              마이페이지
            </Link>
          ) : (
            <>
              <Link
                href="/member/signup"
                prefetch={false}
                className="text-xs font-bold text-[#888888] hover:text-[#111111] transition-colors uppercase tracking-widest"
              >
                회원가입
              </Link>
              <Link
                href="/member/login"
                prefetch={false}
                className="text-xs font-bold text-[#111111] border border-[#111111] px-4 py-2.5 hover:bg-[#111111] hover:text-white transition-colors uppercase tracking-widest"
              >
                로그인
              </Link>
            </>
          )}
          <Link
            href="/survey"
            prefetch={false}
            className="text-sm font-bold text-white bg-[#111111] px-5 py-2.5 hover:bg-black transition-colors tracking-wide"
          >
            무료 진단 시작 →
          </Link>
        </div>
      </div>
    </nav>
  );
}
