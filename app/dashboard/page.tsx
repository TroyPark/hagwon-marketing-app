'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase, Lead, LeadStatus } from '@/lib/supabase';
import {
  LogOut, Search, RefreshCw, ChevronRight, Phone, Mail,
  Calendar, TrendingUp, Users, CheckCircle2, Clock, X, Save,
} from 'lucide-react';

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; dot: string }> = {
  new:        { label: '신규',   color: 'bg-blue-50 text-blue-700 border-blue-200',    dot: 'bg-blue-500' },
  contacted:  { label: '연락완료', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  consulting: { label: '상담중',  color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  contracted: { label: '계약완료', color: 'bg-green-50 text-green-700 border-green-200',  dot: 'bg-green-500' },
  hold:       { label: '보류',   color: 'bg-gray-100 text-gray-600 border-gray-200',    dot: 'bg-gray-400' },
};

function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function formatKRW(n: number | null) {
  if (!n) return '-';
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`;
  return `${n.toLocaleString()}원`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtered, setFiltered] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [editNotes, setEditNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
        return;
      }
      setUser({
        email: session.user.email || '',
        name: session.user.user_metadata?.name || session.user.email || '',
      });
    });
  }, [router]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setLeads(data as Lead[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) fetchLeads();
  }, [user, fetchLeads]);

  // Filter
  useEffect(() => {
    let list = leads;
    if (statusFilter !== 'all') list = list.filter(l => l.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(l =>
        l.hagwon_name.toLowerCase().includes(q) ||
        l.contact_name.toLowerCase().includes(q) ||
        l.phone.includes(q)
      );
    }
    setFiltered(list);
  }, [leads, search, statusFilter]);

  // Select lead
  const selectLead = (lead: Lead) => {
    setSelected(lead);
    setEditNotes(lead.notes || '');
  };

  // Update status
  const updateStatus = async (id: string, status: LeadStatus) => {
    setUpdatingStatus(true);
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      const updated = data as Lead;
      setLeads(prev => prev.map(l => l.id === id ? updated : l));
      setSelected(updated);
    }
    setUpdatingStatus(false);
  };

  // Save notes
  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    const { data, error } = await supabase
      .from('leads')
      .update({ notes: editNotes })
      .eq('id', selected.id)
      .select()
      .single();
    if (!error && data) {
      const updated = data as Lead;
      setLeads(prev => prev.map(l => l.id === selected.id ? updated : l));
      setSelected(updated);
    }
    setSavingNotes(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    consulting: leads.filter(l => l.status === 'consulting').length,
    contracted: leads.filter(l => l.status === 'contracted').length,
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col font-sans">
      {/* Top nav */}
      <header className="bg-[#111111] px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" prefetch={false} className="hover:opacity-60 transition-opacity">
          <Image src="/bi_v1.png" alt="STRAIGHT LAB" width={110} height={32} className="h-7 w-auto brightness-0 invert" unoptimized />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/50 uppercase tracking-widest hidden md:block">CRM</span>
          <div className="h-4 w-px bg-white/20" />
          <span className="text-xs text-white/70">{user.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors uppercase tracking-wider"
          >
            <LogOut className="w-3.5 h-3.5" />
            로그아웃
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 52px)' }}>
        {/* Left panel */}
        <div className={`flex flex-col bg-white border-r border-black/10 ${selected ? 'hidden md:flex md:w-[420px]' : 'flex w-full md:w-[420px]'} flex-shrink-0`}>
          {/* Stats bar */}
          <div className="grid grid-cols-4 border-b border-black/10">
            {[
              { label: '전체', value: stats.total, icon: <Users className="w-3.5 h-3.5" /> },
              { label: '신규', value: stats.new, icon: <Clock className="w-3.5 h-3.5" /> },
              { label: '상담중', value: stats.consulting, icon: <TrendingUp className="w-3.5 h-3.5" /> },
              { label: '계약', value: stats.contracted, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            ].map((s, i) => (
              <div key={i} className="px-4 py-3 text-center border-r border-black/5 last:border-0">
                <div className="text-xl font-black text-[#111111]">{s.value}</div>
                <div className="text-[10px] text-[#888888] uppercase tracking-widest mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search & filter */}
          <div className="p-4 border-b border-black/10 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#AAAAAA]" />
              <input
                type="text"
                placeholder="학원명, 담당자, 연락처 검색"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs border border-black/20 focus:outline-none focus:border-[#111111] transition-colors text-[#111111] placeholder:text-[#BBBBBB]"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'new', 'contacted', 'consulting', 'contracted', 'hold'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-[10px] font-bold px-2.5 py-1 border uppercase tracking-wider transition-colors ${
                    statusFilter === s
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#888888] border-black/20 hover:border-[#111111] hover:text-[#111111]'
                  }`}
                >
                  {s === 'all' ? '전체' : STATUS_CONFIG[s].label}
                </button>
              ))}
              <button onClick={fetchLeads} className="ml-auto text-[#AAAAAA] hover:text-[#111111] transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Lead list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-[#AAAAAA]">
                <p className="text-sm font-medium">리드가 없습니다</p>
              </div>
            ) : (
              filtered.map(lead => (
                <button
                  key={lead.id}
                  onClick={() => selectLead(lead)}
                  className={`w-full text-left px-4 py-4 border-b border-black/5 hover:bg-[#F5F5F5] transition-colors ${
                    selected?.id === lead.id ? 'bg-[#F0F0F0] border-l-2 border-l-[#111111]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-black text-[#111111] text-sm leading-tight">{lead.hagwon_name}</div>
                      <div className="text-xs text-[#888888] mt-0.5">{lead.contact_name} · {lead.phone}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#CCCCCC] flex-shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={lead.status} />
                    <span className="text-[10px] text-[#AAAAAA]">{formatDate(lead.created_at)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right panel - Detail */}
        {selected ? (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto py-6 px-6">
              {/* Detail header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-px w-6 bg-[#111111]" />
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-[0.2em]">Lead Detail</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#111111] tracking-tight">{selected.hagwon_name}</h2>
                  <p className="text-xs text-[#888888] mt-1">등록일: {formatDate(selected.created_at)}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="md:hidden p-2 text-[#888888] hover:text-[#111111]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact info */}
              <div className="bg-white border border-black/10 p-5 mb-4">
                <h3 className="text-xs font-black text-[#111111] uppercase tracking-widest mb-4">담당자 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-[#AAAAAA] uppercase tracking-wider mb-1">담당자</div>
                    <div className="font-bold text-[#111111] text-sm">{selected.contact_name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#AAAAAA] uppercase tracking-wider mb-1">연락처</div>
                    <div className="font-bold text-[#111111] text-sm flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#888888]" />
                      {selected.phone}
                    </div>
                  </div>
                  {selected.email && (
                    <div className="col-span-2">
                      <div className="text-[10px] text-[#AAAAAA] uppercase tracking-wider mb-1">이메일</div>
                      <div className="font-bold text-[#111111] text-sm flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-[#888888]" />
                        {selected.email}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="bg-white border border-black/10 p-5 mb-4">
                <h3 className="text-xs font-black text-[#111111] uppercase tracking-widest mb-4">상태 관리</h3>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      disabled={updatingStatus}
                      className={`text-xs font-bold px-3 py-2 border transition-colors disabled:opacity-50 ${
                        selected.status === s
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-white text-[#888888] border-black/20 hover:border-[#111111] hover:text-[#111111]'
                      }`}
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diagnosis summary */}
              <div className="bg-white border border-black/10 p-5 mb-4">
                <h3 className="text-xs font-black text-[#111111] uppercase tracking-widest mb-4">진단 결과 요약</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#F5F5F5] p-3 text-center">
                    <div className="text-[10px] text-[#AAAAAA] uppercase tracking-wider mb-1">예산 등급</div>
                    <div className="font-black text-[#111111] text-sm">{selected.budget_tier || '-'}</div>
                  </div>
                  <div className="bg-[#F5F5F5] p-3 text-center">
                    <div className="text-[10px] text-[#AAAAAA] uppercase tracking-wider mb-1">월 예상 비용</div>
                    <div className="font-black text-[#111111] text-sm">{formatKRW(selected.monthly_total)}</div>
                  </div>
                  <div className="bg-[#F5F5F5] p-3 text-center">
                    <div className="text-[10px] text-[#AAAAAA] uppercase tracking-wider mb-1">추천 채널</div>
                    <div className="font-black text-[#111111] text-sm">{selected.recommended_channels?.length || 0}개</div>
                  </div>
                </div>
                {selected.recommended_channels && selected.recommended_channels.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selected.recommended_channels.map((ch, i) => (
                      <span key={i} className="text-[10px] bg-[#F5F5F5] border border-black/10 px-2 py-1 text-[#555555] font-medium">
                        {ch}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="bg-white border border-black/10 p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-[#111111] uppercase tracking-widest">메모</h3>
                  <button
                    onClick={saveNotes}
                    disabled={savingNotes}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#111111] hover:bg-black disabled:opacity-40 px-3 py-1.5 transition-colors uppercase tracking-wider"
                  >
                    <Save className="w-3 h-3" />
                    {savingNotes ? '저장 중...' : '저장'}
                  </button>
                </div>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="상담 이력, 특이사항 등을 기록하세요..."
                  rows={5}
                  className="w-full border border-black/20 p-3 text-sm text-[#333333] focus:outline-none focus:border-[#111111] resize-none transition-colors placeholder:text-[#CCCCCC]"
                />
              </div>

              {/* Timeline */}
              <div className="bg-white border border-black/10 p-5">
                <h3 className="text-xs font-black text-[#111111] uppercase tracking-widest mb-4">타임라인</h3>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-[#111111] flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#111111] text-xs">진단 완료 · 상담 신청</div>
                    <div className="text-[10px] text-[#AAAAAA]">{formatDate(selected.created_at)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center text-[#CCCCCC]">
            <div className="text-center">
              <div className="text-4xl mb-3">←</div>
              <p className="text-sm font-medium">리드를 선택하세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
