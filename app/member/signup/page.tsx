'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function MemberSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: 'member' } },
    });

    if (error) { setError(error.message); setLoading(false); }
    else setDone(true);
  };

  if (done) return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center font-sans px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-12 h-12 bg-[#111111] flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-xl font-black">✓</span>
        </div>
        <h2 className="text-xl font-black text-[#111111] mb-2 tracking-tight">가입 신청 완료</h2>
        <p className="text-sm text-[#666666] leading-relaxed mb-6">
          입력하신 이메일로 인증 메일이 발송되었습니다.<br />
          인증 완료 후 로그인해 주세요.
        </p>
        <Link href="/member/login" prefetch={false}
          className="inline-block bg-[#111111] hover:bg-black text-white font-bold px-8 py-3 text-sm uppercase tracking-widest transition-colors">
          로그인하기
        </Link>
      </div>
    </div>
  );

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
              <span className="text-xs font-bold text-[#111111] uppercase tracking-[0.2em]">회원가입</span>
            </div>
            <h1 className="text-2xl font-black text-[#111111] tracking-tight">계정 만들기</h1>
            <p className="text-sm text-[#888888] mt-1">진단 결과를 저장하고 상담 이력을 관리하세요.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {[
              { label: '이름', value: name, setter: setName, type: 'text', placeholder: '홍길동' },
              { label: '이메일', value: email, setter: setEmail, type: 'email', placeholder: 'example@email.com' },
              { label: '비밀번호', value: password, setter: setPassword, type: 'password', placeholder: '6자 이상' },
              { label: '비밀번호 확인', value: confirm, setter: setConfirm, type: 'password', placeholder: '비밀번호 재입력' },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-[10px] font-bold text-[#444444] uppercase tracking-widest mb-2">{field.label}</label>
                <input
                  type={field.type}
                  required
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full border border-black/20 bg-white px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#BBBBBB]"
                />
              </div>
            ))}

            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-[#111111] hover:bg-black disabled:opacity-40 text-white font-bold py-3.5 text-sm uppercase tracking-widest transition-colors">
              {loading ? '처리 중...' : '가입하기'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#AAAAAA]">
            이미 계정이 있으신가요?{' '}
            <Link href="/member/login" prefetch={false} className="text-[#111111] font-bold underline underline-offset-2">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
