import Link from 'next/link';
import { ArrowRight, CheckCircle, BarChart2, FileText, TrendingUp, Shield, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Top nav bar */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0F3460] rounded-sm" />
            <span className="font-bold text-[#0F3460] text-lg tracking-tight">EduMarketing</span>
          </div>
          <Link
            href="/survey"
            className="text-sm font-semibold text-[#0F3460] border border-[#0F3460] px-4 py-2 rounded-md hover:bg-[#0F3460] hover:text-white transition-all"
          >
            무료 진단 시작
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-24 bg-[#F8F9FC]">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            학원 전용 마케팅 진단 플랫폼
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight mb-6">
            학원 맞춤 마케팅 전략,<br />
            <span className="text-[#0F3460]">5분 안에 설계합니다.</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
            업종·규모·예산을 분석해 최적의 광고 채널과 상세 견적서를 즉시 제공합니다.
            수백 개 학원 데이터를 기반으로 한 데이터 기반 마케팅 진단입니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link
              href="/survey"
              className="inline-flex items-center gap-2 bg-[#0F3460] hover:bg-[#0a2744] text-white font-bold text-base px-7 py-4 rounded-lg transition-all shadow-lg shadow-blue-900/20"
            >
              무료 마케팅 진단 받기
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-sm text-gray-400 self-center">무료 · 5분 소요 · 즉시 결과 확인</span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 px-6 py-8 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '1,200+', label: '진단 완료 학원' },
            { number: '98%', label: '원장님 만족도' },
            { number: '평균 +35%', label: '신규 원생 증가' },
            { number: '10년+', label: '교육 마케팅 경력' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black text-[#0F3460] mb-1">{stat.number}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold text-[#0F3460] uppercase tracking-widest mb-3">서비스 특징</p>
            <h2 className="text-3xl font-black text-gray-900">데이터 기반의 정확한 마케팅 진단</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <CheckCircle className="w-6 h-6 text-[#0F3460]" />,
                title: '맞춤형 채널 진단',
                desc: '학원 업종, 위치, 규모, 목표를 종합 분석하여 ROI가 가장 높은 마케팅 채널 조합을 도출합니다.',
              },
              {
                icon: <FileText className="w-6 h-6 text-[#0F3460]" />,
                title: '즉시 견적서 발급',
                desc: '관리비·광고비·초기 세팅비를 항목별로 정리한 상세 견적서를 PDF로 즉시 다운로드할 수 있습니다.',
              },
              {
                icon: <BarChart2 className="w-6 h-6 text-[#0F3460]" />,
                title: '성과 예측 리포트',
                desc: '채널별 예상 클릭수, 상담 문의, 신규 등록 수까지 30일 실행 로드맵과 함께 제공합니다.',
              },
            ].map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-6 hover:border-[#0F3460]/30 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-[#0F3460]/5 rounded-lg flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-6 py-20 bg-[#F8F9FC]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold text-[#0F3460] uppercase tracking-widest mb-3">진단 프로세스</p>
            <h2 className="text-3xl font-black text-gray-900">3단계로 완성되는 마케팅 전략</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: '설문 응답',
                desc: '학원 기본 정보, 현재 마케팅 현황, 목표 예산 등 16개 문항에 답변합니다.',
                time: '약 5분',
              },
              {
                step: '02',
                title: '자동 분석',
                desc: '수집된 데이터를 기반으로 채널별 적합도 점수를 산출하고 최적 조합을 계산합니다.',
                time: '즉시',
              },
              {
                step: '03',
                title: '결과 확인',
                desc: '추천 솔루션, 상세 견적서, KPI 예측, 실행 플랜을 한 번에 확인합니다.',
                time: '즉시',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-black text-gray-100 leading-none mb-3 select-none">{item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{item.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs text-[#0F3460] font-semibold bg-[#0F3460]/5 px-2 py-1 rounded">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold text-[#0F3460] uppercase tracking-widest mb-3">고객 후기</p>
            <h2 className="text-3xl font-black text-gray-900">실제 학원장님의 경험</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: '김○○ 원장',
                school: '수원 수학학원',
                since: '2024년 3월 도입',
                text: '5분 설문으로 이렇게 상세한 견적서가 나올 줄 몰랐습니다. 네이버 플레이스 광고 추천을 받고 실제로 집행했더니 한 달 만에 상담 문의가 3배 증가했습니다.',
                result: '상담 문의 +200%',
              },
              {
                name: '박○○ 원장',
                school: '강남 영어학원',
                since: '2024년 6월 도입',
                text: '마케팅 방향을 잡지 못해 예산을 낭비하다가 이 진단을 받았습니다. 메타 광고와 블로그 조합 추천이 우리 학원에 정확히 맞아 현재 만족스럽게 운영 중입니다.',
                result: '신규 등록 +45%',
              },
            ].map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.school} · {item.since}</div>
                  </div>
                  <span className="text-xs font-bold bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-full">
                    {item.result}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why trust us */}
      <section className="px-6 py-16 bg-[#F8F9FC]">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-5 h-5 text-[#0F3460]" />, title: '100% 무료', desc: '진단 및 견적서 발급까지 모든 과정이 무료입니다.' },
              { icon: <TrendingUp className="w-5 h-5 text-[#0F3460]" />, title: '데이터 기반', desc: '업종별·규모별 실제 광고 성과 데이터를 기반으로 분석합니다.' },
              { icon: <Clock className="w-5 h-5 text-[#0F3460]" />, title: '즉시 결과', desc: '설문 완료 즉시 결과를 확인하고 PDF로 저장할 수 있습니다.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-9 h-9 bg-white border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm mb-1">{item.title}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 bg-[#0F3460]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">
            지금 바로 우리 학원의<br />마케팅 현황을 진단해 보세요
          </h2>
          <p className="text-blue-200 mb-8 text-base">설문 완료 즉시 맞춤 견적서와 실행 전략을 받아보실 수 있습니다.</p>
          <Link
            href="/survey"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#0F3460] font-bold text-base px-8 py-4 rounded-lg transition-all shadow-xl"
          >
            무료 진단 시작하기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-600 rounded-sm" />
            <span className="font-bold text-gray-400 text-sm">EduMarketing</span>
          </div>
          <p className="text-gray-600 text-xs text-center">
            본 서비스는 참고용 견적 제공을 목적으로 하며, 실제 견적은 상담을 통해 확정됩니다. © 2025 All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
