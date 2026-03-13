'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSurveyStore } from '@/store/survey-store';
import { RecommendationResult } from '@/types';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  Download, Phone, RotateCcw, ArrowRight,
  TrendingUp, MousePointerClick, Eye, MessageSquare, UserCheck,
  CheckCircle2, AlertTriangle,
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const CHART_COLORS = ['#111111', '#555555', '#888888', '#AAAAAA', '#333333', '#777777'];

const CHANNEL_NAMES: Record<string, string> = {
  naver_search_ad: '네이버 검색광고',
  naver_place_ad: '네이버 플레이스',
  meta_ad: '메타 광고',
  google_search: '구글 검색광고',
  google_display: '구글 디스플레이',
  naver_blog_mgmt: '네이버 블로그',
  naver_blog: '네이버 블로그',
  sns_mgmt: 'SNS 운영 대행',
  homepage: '랜딩페이지 제작',
  kakao_ad: '카카오 광고',
  consulting: '마케팅 컨설팅',
};

const CHANNEL_CATEGORY_COLOR: Record<string, string> = {
  naver_search_ad: 'bg-green-50 text-green-700 border-green-100',
  naver_place_ad: 'bg-green-50 text-green-700 border-green-100',
  meta_ad: 'bg-blue-50 text-blue-700 border-blue-100',
  google_search: 'bg-orange-50 text-orange-700 border-orange-100',
  google_display: 'bg-orange-50 text-orange-700 border-orange-100',
  naver_blog_mgmt: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  naver_blog: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  sns_mgmt: 'bg-pink-50 text-pink-700 border-pink-100',
  homepage: 'bg-purple-50 text-purple-700 border-purple-100',
  kakao_ad: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  consulting: 'bg-[#F5F5F5] text-gray-700 border-gray-200',
};

function formatKRW(n: number) {
  if (n === 0) return '—';
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`;
  return `${n.toLocaleString()}원`;
}

const RANK_STYLES = [
  'border-l-4 border-l-amber-400',
  'border-l-4 border-l-gray-400',
  'border-l-4 border-l-amber-700',
];

const RANK_BADGES = [
  { bg: 'bg-amber-400', label: '1st' },
  { bg: 'bg-gray-400', label: '2nd' },
  { bg: 'bg-amber-700', label: '3rd' },
];

export default function ResultPage() {
  const router = useRouter();
  const { result, reset } = useSurveyStore();
  const [activeTab, setActiveTab] = useState(0);
  const [adBudgetMultiplier, setAdBudgetMultiplier] = useState(1);
  const [showNameModal, setShowNameModal] = useState(false);
  const [hagwonName, setHagwonName] = useState('');
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultForm, setConsultForm] = useState({ hagwon_name: '', contact_name: '', phone: '', email: '' });
  const [consultLoading, setConsultLoading] = useState(false);
  const [consultDone, setConsultDone] = useState(false);
  const [consultError, setConsultError] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // sessionStorage에서 결과 복원 (full page reload 시 대비)
    if (!result) {
      const saved = sessionStorage.getItem('survey-result');
      if (saved) {
        try {
          useSurveyStore.getState().setResult(JSON.parse(saved));
        } catch {}
      }
    }
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (hasHydrated && !result) {
      window.location.href = (process.env.NODE_ENV === 'production' ? '/hagwon-marketing-app' : '') + '/survey';
    }
  }, [hasHydrated, result]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${hagwonName || '학원'}_마케팅_견적서`,
  });

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsultLoading(true);
    setConsultError('');
    const { error } = await supabase.from('customer').insert({
      hagwon_name: consultForm.hagwon_name,
      contact_name: consultForm.contact_name,
      phone: consultForm.phone,
      email: consultForm.email || null,
      status: 'new',
      budget_tier: result ? (result as RecommendationResult).budgetTier?.label : null,
      recommended_channels: result
        ? (result as RecommendationResult).recommendedChannels?.slice(0, 5).map(
            (ch: { channel: string }) => ch.channel
          )
        : null,
      monthly_total: result ? (result as RecommendationResult).quote?.monthlyTotal : null,
      diagnosis_result: result,
    });
    if (error) {
      setConsultError('오류가 발생했습니다. 다시 시도해 주세요.');
    } else {
      setConsultDone(true);
    }
    setConsultLoading(false);
  };

  if (!hasHydrated || !result) return null;

  const { budgetTier, recommendedChannels, quote, expectedKPI, insights, actionPlan } =
    result as RecommendationResult;

  const TABS = ['추천 솔루션', '맞춤 견적서', '기대 성과', '실행 플랜'];

  const pieData = quote.items
    .filter(item => item.managementFee + item.recommendedAdBudget * adBudgetMultiplier > 0)
    .map(item => ({
      name: CHANNEL_NAMES[item.id] || item.serviceName,
      value: item.managementFee + Math.round(item.recommendedAdBudget * adBudgetMultiplier),
    }));

  const trendData = [1, 2, 3].map(month => ({
    month: `${month}개월차`,
    클릭수: Math.round(expectedKPI.monthlyClicks * month * (0.7 + month * 0.1)),
    상담문의: Math.round(expectedKPI.monthlyConsultations * month * (0.6 + month * 0.15)),
    신규등록: Math.round(expectedKPI.monthlyNewStudents * month * (0.5 + month * 0.2)),
  }));

  const totalMonthly = quote.totalManagementFee + Math.round(quote.totalAdBudget * adBudgetMultiplier);

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-black/10 px-6 py-4 no-print sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" prefetch={false} className="flex items-center hover:opacity-75 transition-opacity">
              <Image src="/bi_v1.png" alt="STRAIGHT LAB" width={120} height={34} className="h-8 w-auto" unoptimized />
            </Link>
            <span className="text-gray-200">|</span>
            <span className="text-sm text-gray-500 font-medium">마케팅 진단 결과</span>
          </div>
          <button
            onClick={() => { reset(); router.push('/'); }}
            className="flex items-center gap-1.5 text-xs text-[#888888] hover:text-[#111111] transition-colors uppercase tracking-widest font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            다시 진단하기
          </button>
        </div>
      </header>

      <div ref={printRef} className="max-w-5xl mx-auto py-8 px-6">
        {/* Print header */}
        <div className="hidden print:block mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bi_v1.png" alt="STRAIGHT LAB" style={{ height: 36, width: 'auto' }} />
            <p className="text-gray-400 text-sm">발급일: {new Date().toLocaleDateString('ko-KR')}</p>
          </div>
          <h1 className="text-2xl font-black text-[#111111] mt-4">
            {hagwonName ? `${hagwonName} · ` : ''}마케팅 진단 견적서
          </h1>
          <p className="text-gray-400 text-sm mt-1">스트레이트랩 · 학원 마케팅 전문 기업</p>
        </div>

        {/* Diagnosis Summary */}
        <div className="bg-white rounded-sm border border-black/10 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#111111] uppercase tracking-widest mb-1">진단 완료</p>
              <h2 className="text-xl font-black text-gray-900">맞춤 마케팅 전략이 준비되었습니다</h2>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-center bg-[#F5F5F5] rounded-none px-4 py-2">
                <div className="text-xs text-gray-400 mb-0.5">예산 등급</div>
                <div className="font-bold text-[#111111] text-sm">{budgetTier.label}</div>
              </div>
              <div className="text-center bg-[#F5F5F5] rounded-none px-4 py-2">
                <div className="text-xs text-gray-400 mb-0.5">추천 채널</div>
                <div className="font-bold text-[#111111] text-sm">{quote.items.length}개</div>
              </div>
              <div className="text-center bg-[#111111] rounded-none px-4 py-2">
                <div className="text-xs text-blue-200 mb-0.5">월 예상 비용</div>
                <div className="font-bold text-white text-sm">{formatKRW(quote.monthlyTotal)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="no-print">
          <div className="flex gap-0 bg-white border border-black/10 overflow-hidden mb-6">
            {TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex-1 py-3.5 text-xs font-bold transition-all whitespace-nowrap uppercase tracking-widest ${
                  activeTab === i
                    ? 'bg-[#111111] text-white'
                    : 'text-[#888888] hover:bg-[#F5F5F5] hover:text-[#111111]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Tab 1: Recommendations ── */}
          {activeTab === 0 && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-gray-900">우선 추천 채널</h3>
                <span className="text-xs text-gray-400">점수 기반 상위 추천</span>
              </div>

              {recommendedChannels.slice(0, 3).map((ch, i) => {
                const quoteItem = quote.items.find(q => q.id === ch.channel);
                const maxScore = recommendedChannels[0]?.score || 1;
                const pct = Math.round((ch.score / maxScore) * 100);
                return (
                  <div key={ch.channel} className={`bg-white rounded-sm border border-black/10 p-6 ${RANK_STYLES[i]}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-none ${RANK_BADGES[i].bg} text-white flex items-center justify-center font-black text-xs flex-shrink-0`}>
                        {RANK_BADGES[i].label}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-base font-black text-gray-900">
                            {CHANNEL_NAMES[ch.channel] || ch.channel}
                          </h4>
                          <span className={`text-xs font-semibold border px-2 py-0.5 rounded-full ${CHANNEL_CATEGORY_COLOR[ch.channel] || 'bg-[#F5F5F5] text-gray-600 border-gray-200'}`}>
                            {quoteItem?.category || '광고'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed mb-4">
                          {insights[ch.channel] || '학원 특성에 최적화된 마케팅 채널입니다.'}
                        </p>

                        {/* Score bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>적합도 점수</span>
                            <span className="font-semibold text-[#111111]">{pct}%</span>
                          </div>
                          <div className="h-0.5 bg-[#E5E5E5]">
                            <div
                              className="h-full bg-[#111111] transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        {quoteItem && (
                          <div className="flex gap-6 text-sm border-t border-black/5 pt-3">
                            {quoteItem.managementFee > 0 && (
                              <div>
                                <span className="text-xs text-gray-400 block">월 관리비</span>
                                <span className="font-bold text-gray-800">{formatKRW(quoteItem.managementFee)}</span>
                              </div>
                            )}
                            {quoteItem.recommendedAdBudget > 0 && (
                              <div>
                                <span className="text-xs text-gray-400 block">추천 광고비</span>
                                <span className="font-bold text-gray-800">{formatKRW(quoteItem.recommendedAdBudget)}</span>
                              </div>
                            )}
                            {(quoteItem.setupFee || 0) > 0 && (
                              <div>
                                <span className="text-xs text-gray-400 block">초기 세팅비(1회)</span>
                                <span className="font-bold text-gray-800">{formatKRW(quoteItem.setupFee || 0)}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {recommendedChannels.length > 3 && (
                <>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-6 mb-3">추가 고려 채널</h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    {recommendedChannels.slice(3, 6).map(ch => (
                      <div key={ch.channel} className="bg-white rounded-none border border-black/10 p-4 flex items-center justify-between">
                        <span className="font-semibold text-gray-700 text-sm">{CHANNEL_NAMES[ch.channel] || ch.channel}</span>
                        <span className="text-xs text-gray-400 bg-[#F5F5F5] px-2 py-1 rounded">{ch.score}pt</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-6 pt-6 border-t border-black/10 flex justify-end">
                <button
                  onClick={() => setActiveTab(1)}
                  className="flex items-center gap-2 text-sm font-semibold text-[#111111] hover:text-black"
                >
                  견적서 확인하기 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Tab 2: Quote ── */}
          {activeTab === 1 && (
            <div className="animate-fade-in-up space-y-5">
              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: '월 관리비 합계', value: formatKRW(quote.totalManagementFee), sub: '대행 서비스 운영비' },
                  { label: '월 광고비 합계', value: formatKRW(Math.round(quote.totalAdBudget * adBudgetMultiplier)), sub: '매체 광고 집행비' },
                  { label: '초기 세팅비 (1회)', value: formatKRW(quote.totalSetupFee), sub: '계정 세팅 및 제작비' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-sm border border-black/10 p-4">
                    <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                    <div className="text-xl font-black text-gray-900 mb-1">{item.value}</div>
                    <div className="text-xs text-gray-400">{item.sub}</div>
                  </div>
                ))}
              </div>

              {/* Monthly total highlight */}
              <div className="bg-[#111111] rounded-sm p-5 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
                <div>
                  <div className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">월 예상 총 투자금액</div>
                  <div className="text-3xl font-black text-white">{formatKRW(totalMonthly)}</div>
                  <div className="text-blue-300 text-xs mt-1">관리비 + 광고비 기준 / 세팅비 제외</div>
                </div>
                <div className="md:text-right">
                  <div className="text-blue-200 text-xs mb-1">예산 등급</div>
                  <div className="text-white font-bold text-lg">{budgetTier.label}</div>
                  <div className="text-blue-300 text-xs">월 {budgetTier.min}~{budgetTier.max}만원 기준</div>
                </div>
              </div>

              {/* Budget slider */}
              <div className="bg-white rounded-sm border border-black/10 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900 text-sm">광고비 조절</h4>
                  <span className="text-xs text-[#111111] font-bold bg-[#111111]/8 px-2 py-1 rounded">
                    ×{adBudgetMultiplier.toFixed(1)} 배율 적용
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={adBudgetMultiplier}
                  onChange={(e) => setAdBudgetMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-[#0F3460] mb-2"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>최소 (×0.5)</span>
                  <span>기준 (×1.0)</span>
                  <span>최대 (×2.0)</span>
                </div>
              </div>

              {/* Quote table */}
              <div className="bg-white rounded-sm border border-black/10 overflow-hidden">
                <div className="px-5 py-4 border-b border-black/5">
                  <h4 className="font-bold text-gray-900 text-sm">서비스 항목별 견적</h4>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-[#F5F5F5] border-b border-black/10">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">서비스</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">관리비</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">광고비</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">세팅비</th>
                      <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">월 합계</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {quote.items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F5F5F5]/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-800">{item.serviceName}</div>
                          <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.description.substring(0, 45)}...</div>
                        </td>
                        <td className="text-right px-4 py-4 text-gray-700">{formatKRW(item.managementFee)}</td>
                        <td className="text-right px-4 py-4 text-gray-700">{formatKRW(Math.round(item.recommendedAdBudget * adBudgetMultiplier))}</td>
                        <td className="text-right px-4 py-4 text-gray-400 text-xs">{formatKRW(item.setupFee || 0)}</td>
                        <td className="text-right px-5 py-4 font-bold text-gray-900">
                          {formatKRW(item.managementFee + Math.round(item.recommendedAdBudget * adBudgetMultiplier))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#111111]">
                      <td className="px-5 py-4 text-white font-bold text-sm">합계</td>
                      <td className="text-right px-4 py-4 text-blue-200 text-sm">{formatKRW(quote.totalManagementFee)}</td>
                      <td className="text-right px-4 py-4 text-blue-200 text-sm">{formatKRW(Math.round(quote.totalAdBudget * adBudgetMultiplier))}</td>
                      <td className="text-right px-4 py-4 text-blue-200 text-xs">{formatKRW(quote.totalSetupFee)}</td>
                      <td className="text-right px-5 py-4 font-black text-white text-base">{formatKRW(totalMonthly)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Pie chart */}
              {pieData.length > 0 && (
                <div className="bg-white rounded-sm border border-black/10 p-5">
                  <h4 className="font-bold text-gray-900 text-sm mb-4">채널별 예산 배분</h4>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        dataKey="value"
                        paddingAngle={3}
                        label={({ name, percent }: { name: string; percent: number }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatKRW(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Download */}
              <button
                onClick={() => setShowNameModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white font-bold py-4 transition-all uppercase tracking-widest text-sm"
              >
                <Download className="w-4 h-4" />
                견적서 PDF 다운로드
              </button>
            </div>
          )}

          {/* ── Tab 3: KPI ── */}
          {activeTab === 2 && (
            <div className="animate-fade-in-up space-y-5">
              {/* KPI cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: '예상 월 클릭수', value: expectedKPI.monthlyClicks.toLocaleString(), unit: '회', icon: <MousePointerClick className="w-4 h-4" />, color: 'text-[#111111]' },
                  { label: '예상 월 노출수', value: expectedKPI.monthlyImpressions.toLocaleString(), unit: '회', icon: <Eye className="w-4 h-4" />, color: 'text-blue-500' },
                  { label: '예상 상담 문의', value: expectedKPI.monthlyConsultations.toString(), unit: '건', icon: <MessageSquare className="w-4 h-4" />, color: 'text-purple-600' },
                  { label: '예상 신규 등록', value: expectedKPI.monthlyNewStudents.toString(), unit: '명', icon: <UserCheck className="w-4 h-4" />, color: 'text-emerald-600' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-sm border border-black/10 p-4">
                    <div className={`flex items-center gap-1.5 mb-3 ${item.color}`}>
                      {item.icon}
                      <span className="text-xs font-semibold">{item.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-black ${item.color}`}>{item.value}</span>
                      <span className="text-xs text-gray-400">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Line chart */}
              <div className="bg-white rounded-sm border border-black/10 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-bold text-gray-900 text-sm">3개월 성과 예측 추이</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <TrendingUp className="w-3 h-3" />
                    누적 기준
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={trendData} margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line yAxisId="left" type="monotone" dataKey="클릭수" stroke="#111111" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="상담문의" stroke="#555555" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="신규등록" stroke="#999999" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* KPI table */}
              <div className="bg-white rounded-sm border border-black/10 overflow-hidden">
                <div className="px-5 py-4 border-b border-black/5">
                  <h4 className="font-bold text-gray-900 text-sm">채널별 KPI 벤치마크</h4>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-[#F5F5F5] border-b border-black/10">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">채널</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">클릭율(CTR)</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">클릭당단가(CPC)</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">전환율</th>
                      <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">예상 클릭</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {expectedKPI.channelKPIs.map((kpi) => (
                      <tr key={kpi.channel} className="hover:bg-[#F5F5F5]/50 transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-gray-800">{kpi.channelName}</td>
                        <td className="text-right px-4 py-3.5 text-gray-600">{kpi.ctr}</td>
                        <td className="text-right px-4 py-3.5 text-gray-600">{kpi.cpc}</td>
                        <td className="text-right px-4 py-3.5 text-gray-600">{kpi.conversionRate}</td>
                        <td className="text-right px-5 py-3.5 font-bold text-gray-900">{kpi.estimatedClicks.toLocaleString()}회</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-sm p-4">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  본 수치는 동종 업계 평균 벤치마크 기반 예측값입니다. 실제 성과는 학원 특성, 광고 품질,
                  지역 경쟁도, 랜딩페이지 품질에 따라 달라질 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* ── Tab 4: Action Plan ── */}
          {activeTab === 3 && (
            <div className="animate-fade-in-up space-y-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-gray-900">30일 실행 로드맵</h3>
                <span className="text-xs text-gray-400">단계별 마케팅 집행 계획</span>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                {actionPlan.map((plan, i) => (
                  <div key={i} className="bg-white rounded-sm border border-black/10 overflow-hidden">
                    <div className="flex items-center gap-4 px-5 py-4 border-b border-black/5">
                      <div className="w-8 h-8 bg-[#111111] text-white rounded-none flex items-center justify-center font-black text-xs flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#111111] uppercase tracking-widest">{plan.week}</div>
                        <div className="font-bold text-gray-900 text-sm">{plan.title}</div>
                      </div>
                    </div>
                    <ul className="px-5 py-4 space-y-2">
                      {plan.tasks.map((task, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-[#111111]/40 mt-0.5 flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Free actions */}
              <div className="bg-white rounded-sm border border-black/10 p-5">
                <h4 className="font-bold text-gray-900 text-sm mb-4">즉시 실행 가능한 무료 액션</h4>
                <div className="space-y-3">
                  {[
                    '네이버 플레이스 무료 등록 및 정보 최적화',
                    '구글 비즈니스 프로필 무료 등록',
                    '카카오톡 채널 무료 개설',
                    '인스타그램 비즈니스 계정 전환',
                    '네이버 스마트플레이스 리뷰 수집 시작',
                  ].map((action, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 accent-[#0F3460] rounded" />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{action}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* CTA banner */}
              <div className="bg-[#111111] p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-white font-black text-lg mb-1">전문가 무료 상담</h4>
                    <p className="text-white/50 text-sm">진단 결과를 바탕으로 더 정밀한 마케팅 전략을 제안드립니다.</p>
                  </div>
                  <button
                    onClick={() => setShowConsultModal(true)}
                    className="flex-shrink-0 inline-flex items-center gap-2 bg-white hover:bg-[#F0F0F0] text-[#111111] font-bold px-5 py-3 text-sm transition-all uppercase tracking-widest"
                  >
                    <Phone className="w-4 h-4" />
                    상담 신청하기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 인쇄 전용 견적서 ── */}
        <div className="hidden print:block mt-8">

          {/* 추천 채널 */}
          <h3 className="text-base font-black text-[#111111] mb-3 border-b pb-2">추천 마케팅 채널</h3>
          <table className="w-full text-sm mb-8 border-collapse">
            <thead>
              <tr className="bg-[#111111] text-white">
                <th className="text-left px-3 py-2">순위</th>
                <th className="text-left px-3 py-2">채널</th>
                <th className="text-left px-3 py-2">추천 이유</th>
              </tr>
            </thead>
            <tbody>
              {recommendedChannels.slice(0, 3).map((ch, i) => (
                <tr key={ch.channel} className={i % 2 === 0 ? 'bg-[#F5F5F5]' : 'bg-white'}>
                  <td className="px-3 py-2 font-bold">{i + 1}위</td>
                  <td className="px-3 py-2 font-semibold">{CHANNEL_NAMES[ch.channel] || ch.channel}</td>
                  <td className="px-3 py-2 text-gray-600 text-xs">{insights[ch.channel] || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 견적서 */}
          <h3 className="text-base font-black text-[#111111] mb-3 border-b pb-2">맞춤 견적서</h3>
          <table className="w-full text-sm mb-4 border-collapse">
            <thead>
              <tr className="bg-[#111111] text-white">
                <th className="text-left px-3 py-2">서비스</th>
                <th className="text-right px-3 py-2">월 관리비</th>
                <th className="text-right px-3 py-2">광고비(추천)</th>
                <th className="text-right px-3 py-2">세팅비(1회)</th>
                <th className="text-right px-3 py-2">월 합계</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, i) => (
                <tr key={item.id} className={i % 2 === 0 ? 'bg-[#F5F5F5]' : 'bg-white'}>
                  <td className="px-3 py-2">
                    <div className="font-semibold">{item.serviceName}</div>
                    <div className="text-xs text-gray-500">{item.description.substring(0, 50)}...</div>
                  </td>
                  <td className="text-right px-3 py-2">{formatKRW(item.managementFee)}</td>
                  <td className="text-right px-3 py-2">{formatKRW(item.recommendedAdBudget)}</td>
                  <td className="text-right px-3 py-2 text-gray-500">{formatKRW(item.setupFee || 0)}</td>
                  <td className="text-right px-3 py-2 font-bold">{formatKRW(item.managementFee + item.recommendedAdBudget)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#111111] text-white font-bold">
                <td className="px-3 py-2">합계</td>
                <td className="text-right px-3 py-2">{formatKRW(quote.totalManagementFee)}</td>
                <td className="text-right px-3 py-2">{formatKRW(quote.totalAdBudget)}</td>
                <td className="text-right px-3 py-2">{formatKRW(quote.totalSetupFee)}</td>
                <td className="text-right px-3 py-2 text-yellow-300">{formatKRW(quote.monthlyTotal)}</td>
              </tr>
            </tfoot>
          </table>

          {/* 기대 KPI */}
          <h3 className="text-base font-black text-[#111111] mb-3 border-b pb-2">기대 성과 (월 기준)</h3>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: '예상 클릭수', value: `${expectedKPI.monthlyClicks.toLocaleString()}회` },
              { label: '예상 노출수', value: `${expectedKPI.monthlyImpressions.toLocaleString()}회` },
              { label: '예상 상담 문의', value: `${expectedKPI.monthlyConsultations}건` },
              { label: '예상 신규 등록', value: `${expectedKPI.monthlyNewStudents}명` },
            ].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-none p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                <div className="text-lg font-black text-[#111111]">{item.value}</div>
              </div>
            ))}
          </div>

          {/* 채널별 예산 배분 파이 차트 */}
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">채널별 예산 배분</p>
            <div className="flex items-center gap-6">
              <PieChart width={200} height={180}>
                <Pie
                  data={pieData}
                  cx={100}
                  cy={90}
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                  paddingAngle={3}
                  label={false}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
              {/* 범례 직접 렌더링 */}
              <div className="flex flex-col gap-1.5">
                {pieData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span>{entry.name}</span>
                    <span className="text-gray-400 ml-1">{((entry.value / pieData.reduce((s, d) => s + d.value, 0)) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3개월 성과 예측 라인 차트 */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">3개월 성과 예측 추이</p>
            <LineChart width={560} height={200} data={trendData} margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="클릭수" stroke="#111111" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="상담문의" stroke="#555555" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="신규등록" stroke="#999999" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </div>

          <p className="text-xs text-gray-400 mt-4 border-t pt-3">
            ※ 본 견적서는 참고용이며 실제 성과는 학원 특성 및 시장 상황에 따라 달라질 수 있습니다. · STRAIGHT LAB (스트레이트랩)
          </p>
        </div>

      </div>

      {/* Consultation Modal */}
      {showConsultModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md border border-black/10">
            <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#111111]">무료 상담 신청</h3>
                <p className="text-xs text-[#888888] mt-0.5">담당자가 1영업일 내 연락드립니다.</p>
              </div>
              <button onClick={() => { setShowConsultModal(false); setConsultDone(false); setConsultError(''); }} className="text-[#AAAAAA] hover:text-[#111111]">✕</button>
            </div>

            {consultDone ? (
              <div className="px-6 py-10 text-center">
                <div className="w-10 h-10 bg-[#111111] flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-black text-lg">✓</span>
                </div>
                <h4 className="font-black text-[#111111] mb-2">신청 완료!</h4>
                <p className="text-sm text-[#666666]">빠른 시일 내에 연락드리겠습니다.</p>
                <button
                  onClick={() => { setShowConsultModal(false); setConsultDone(false); }}
                  className="mt-6 bg-[#111111] text-white font-bold px-6 py-2.5 text-sm uppercase tracking-widest hover:bg-black transition-colors"
                >
                  닫기
                </button>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#444444] uppercase tracking-widest mb-1.5">학원명 *</label>
                  <input required value={consultForm.hagwon_name} onChange={e => setConsultForm(p => ({ ...p, hagwon_name: e.target.value }))}
                    placeholder="OO수학학원"
                    className="w-full border border-black/20 px-3 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#CCCCCC]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#444444] uppercase tracking-widest mb-1.5">담당자명 *</label>
                  <input required value={consultForm.contact_name} onChange={e => setConsultForm(p => ({ ...p, contact_name: e.target.value }))}
                    placeholder="홍길동 원장"
                    className="w-full border border-black/20 px-3 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#CCCCCC]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#444444] uppercase tracking-widest mb-1.5">연락처 *</label>
                  <input required value={consultForm.phone} onChange={e => setConsultForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="010-0000-0000"
                    className="w-full border border-black/20 px-3 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#CCCCCC]" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#444444] uppercase tracking-widest mb-1.5">이메일 (선택)</label>
                  <input value={consultForm.email} onChange={e => setConsultForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="example@email.com" type="email"
                    className="w-full border border-black/20 px-3 py-2.5 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#CCCCCC]" />
                </div>
                {consultError && <p className="text-xs text-red-600 font-medium">{consultError}</p>}
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowConsultModal(false)}
                    className="flex-1 py-3 border border-black/20 text-sm font-bold text-[#666666] hover:bg-[#F5F5F5] transition-colors">
                    취소
                  </button>
                  <button type="submit" disabled={consultLoading}
                    className="flex-1 py-3 bg-[#111111] hover:bg-black disabled:opacity-40 text-white font-bold text-sm uppercase tracking-widest transition-colors">
                    {consultLoading ? '제출 중...' : '신청하기'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PDF Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-black/10">
            <h3 className="text-base font-black text-gray-900 mb-1">견적서 발급</h3>
            <p className="text-sm text-gray-500 mb-4">견적서에 표시할 학원명을 입력해 주세요.</p>
            <input
              type="text"
              placeholder="예: OO수학학원 (생략 가능)"
              value={hagwonName}
              onChange={(e) => setHagwonName(e.target.value)}
              className="w-full border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-[#0F3460] mb-4 transition-colors"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowNameModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-[#F5F5F5] transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => { setShowNameModal(false); handlePrint(); }}
                className="flex-1 py-3 bg-[#111111] text-white rounded-none text-sm font-bold hover:bg-black transition-colors"
              >
                PDF 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
