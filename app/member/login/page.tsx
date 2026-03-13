'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function MemberLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !data.user) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      setLoading(false);
      return;
    }

    window.location.href = '/member/dashboard';
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col font-sans">
      <header className="bg-white border-b border-black/10 px-6 py-4">
        <Link href="/" prefetch={false} className="inline-flex hover:opacity-60 transition-opacity">
          <Image src="/bi_v1.png" alt="STRAIGHT LAB" width={130} height={36} className="h-8 w-auto" unoptimized />
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-[#111111]" />
              <span className="text-xs font-bold text-[#111111] uppercase tracking-[0.2em]">회원 로그인</span>
            </div>
            <h1 className="text-2xl font-black text-[#111111] tracking-tight">안녕하세요</h1>
            <p className="text-sm text-[#888888] mt-1">로그인하고 진단 결과를 저장하세요.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#444444] uppercase tracking-widest mb-2">이메일</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full border border-black/20 bg-white px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#BBBBBB]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#444444] uppercase tracking-widest mb-2">비밀번호</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-black/20 bg-white px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#BBBBBB]"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] hover:bg-black disabled:opacity-40 text-white font-bold py-3.5 text-sm uppercase tracking-widest transition-colors"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#AAAAAA]">
            계정이 없으신가요?{' '}
            <Link href="/member/signup" prefetch={false} className="text-[#111111] font-bold underline underline-offset-2">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
