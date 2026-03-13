'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LogOut, ArrowRight, FileText, Phone } from 'lucide-react';

export default function MemberDashboardPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [leads, setLeads] = useState<{ id: string; created_at: string; hagwon_name: string; status: string; monthly_total: number | null }[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        window.location.href = '/member/login';
        return;
      }
      setUser({
        email: session.user.email || '',
        name: session.user.user_metadata?.name || session.user.email || '',
      });

      // 본인이 신청한 상담 목록
      const { data } = await supabase
        .from('customer')
        .select('id, created_at, hagwon_name, status, monthly_total')
        .eq('email', session.user.email)
        .order('created_at', { ascending: false });
      if (data) setLeads(data);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/member/login';
  };

  const STATUS_LABEL: Record<string, string> = {
    new: '접수완료', contacted: '연락완료', consulting: '상담중', contracted: '계약완료', hold: '보류',
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-black/10 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" prefetch={false} className="hover:opacity-60 transition-opacity">
            <Image src="/bi_v1.png" alt="STRAIGHT LAB" width={120} height={34} className="h-8 w-auto" unoptimized />
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-[#888888] hover:text-[#111111] transition-colors uppercase tracking-wider">
            <LogOut className="w-3.5 h-3.5" />
            로그아웃
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto w-full px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-[#DC2626]" />
            <span className="text-[10px] font-bold text-[#888888] uppercase tracking-[0.2em]">마이페이지</span>
          </div>
          <h1 className="text-2xl font-black text-[#111111] tracking-tight">
            안녕하세요, {user.name}님
          </h1>
          <p className="text-sm text-[#888888] mt-1">{user.email}</p>
        </div>

        {/* CTA - Start diagnosis */}
        <div className="bg-[#DC2626] p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-white font-black text-lg mb-1">마케팅 진단 시작하기</h2>
              <p className="text-white/50 text-sm">5분 설문으로 맞춤 전략과 견적서를 즉시 받아보세요.</p>
            </div>
            <Link href="/survey" prefetch={false}
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white hover:bg-[#F0F0F0] text-[#111111] font-bold px-5 py-3 text-sm uppercase tracking-widest transition-colors">
              진단 시작
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Consultation history */}
        <div className="bg-white border border-black/10">
          <div className="px-6 py-4 border-b border-black/10 flex items-center gap-3">
            <FileText className="w-4 h-4 text-[#888888]" />
            <h3 className="text-xs font-black text-[#111111] uppercase tracking-widest">상담 신청 내역</h3>
          </div>

          {leads.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-[#AAAAAA] mb-4">아직 상담 신청 내역이 없습니다.</p>
              <p className="text-xs text-[#CCCCCC]">진단 결과 페이지에서 무료 상담을 신청해 보세요.</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {leads.map((lead) => (
                <div key={lead.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#111111] text-sm">{lead.hagwon_name}</div>
                    <div className="text-xs text-[#AAAAAA] mt-0.5">
                      {new Date(lead.created_at).toLocaleDateString('ko-KR')}
                      {lead.monthly_total ? ` · 월 ${(lead.monthly_total / 10000).toFixed(0)}만원` : ''}
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-[#F5F5F5] border border-black/10 px-2.5 py-1 text-[#555555]">
                    {STATUS_LABEL[lead.status] || lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="mt-4 border border-black/10 bg-white px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-[#111111] uppercase tracking-widest mb-1">추가 문의</p>
            <p className="text-xs text-[#888888]">상담 진행 상황이나 추가 문의사항이 있으시면 연락주세요.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
            <Phone className="w-3.5 h-3.5" />
            문의하기
          </div>
        </div>
      </div>
    </div>
  );
}
