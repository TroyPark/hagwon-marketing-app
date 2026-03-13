'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
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
      setError('이메일 또는 비밀번호가 올바르지 않습니다. 이메일 인증을 완료하셨나요?');
      setLoading(false);
      return;
    }

    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col font-sans">
      {/* Header */}
      <header className="px-6 py-5 border-b border-white/5">
        <Link href="/" prefetch={false} className="inline-flex hover:opacity-60 transition-opacity">
          <Image src="/bi_v1.png" alt="STRAIGHT LAB" width={130} height={36} className="h-8 w-auto brightness-0 invert opacity-70" unoptimized />
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-white/30" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Admin Only</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">관리자 로그인</h1>
            <p className="text-sm text-white/30 mt-1">CRM 접속 전용 페이지입니다.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">이메일</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@straightlab.kr"
                className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">비밀번호</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-[#F0F0F0] disabled:opacity-40 text-[#111111] font-black py-3.5 text-sm uppercase tracking-widest transition-colors"
            >
              {loading ? '확인 중...' : 'CRM 접속'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-white/20">
              일반 회원이신가요?{' '}
              <Link href="/member/login" prefetch={false} className="text-white/40 hover:text-white/70 transition-colors underline underline-offset-2">
                회원 로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
