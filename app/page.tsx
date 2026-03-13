import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, BarChart2, FileText, TrendingUp, Shield, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white font-sans">

      {/* Nav */}
      <nav className="border-b border-black/10 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" prefetch={false} className="flex items-center hover:opacity-60 transition-opacity">
            <Image src="/bi_v1.png" alt="STRAIGHT LAB" width={148} height={42} className="h-9 w-auto" unoptimized />
          </Link>
          <Link
            href="/survey"
            prefetch={false}
            className="text-sm font-bold text-white bg-[#111111] px-5 py-2.5 hover:bg-black transition-colors tracking-wide"
          >
            무료 진단 시작 →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-24 pb-28 bg-white border-b border-black/10">
        <div className="max-w-5xl mx-auto">
          {/* Label */}
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-10 bg-[#111111]" />
            <span className="text-xs font-bold text-[#111111] uppercase tracking-[0.2em]">학원 마케팅 전문 기업</span>
          </div>
          <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black text-[#111111] leading-[1.0] tracking-tight mb-8">
            학원 마케팅,<br />
            <span className="text-[#111111]">데이터로</span><br />
            <span className="text-[#111111]">설계합니다.</span>
          </h1>
          <div className="flex items-start gap-px mb-10">
            <div className="w-1 h-16 bg-[#111111]" />
            <p className="text-lg text-[#555555] pl-5 max-w-xl leading-relaxed">
              업종·규모·예산을 분석해 최적의 광고 채널과 상세 견적서를 즉시 제공합니다.
              수백 개 학원 데이터 기반의 정밀한 마케팅 진단입니다.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link
              href="/survey"
              prefetch={false}
              className="inline-flex items-center gap-3 bg-[#111111] hover:bg-black text-white font-bold text-sm px-8 py-4 transition-colors tracking-widest uppercase"
            >
              무료 진단 받기
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-[#999999] self-center tracking-wider uppercase">Free · 5min · Instant Result</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12 bg-[#111111]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
          {[
            { number: '1,200+', label: '진단 완료 학원' },
            { number: '98%', label: '원장님 만족도' },
            { number: '+35%', label: '평균 신규 원생 증가' },
            { number: '10Y+', label: '교육 마케팅 경력' },
          ].map((stat, i) => (
            <div key={i} className="text-center px-6 py-4">
              <div className="text-3xl font-black text-white mb-1 tracking-tight">{stat.number}</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="px-6 py-24 bg-white border-b border-black/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-14">
            <div className="h-px w-10 bg-[#111111]" />
            <span className="text-xs font-bold text-[#111111] uppercase tracking-[0.2em]">서비스 특징</span>
          </div>
          <h2 className="text-4xl font-black text-[#111111] mb-14 leading-tight">
            진단부터 실행까지,<br />스트레이트랩이 설계합니다.
          </h2>
          <div className="grid md:grid-cols-3 gap-0 border border-black/10">
            {[
              {
                icon: <CheckCircle className="w-5 h-5" />,
                title: '맞춤형 채널 진단',
                desc: '학원 업종, 위치, 규모, 목표를 종합 분석하여 ROI가 가장 높은 마케팅 채널 조합을 도출합니다.',
              },
              {
                icon: <FileText className="w-5 h-5" />,
                title: '즉시 견적서 발급',
                desc: '관리비·광고비·초기 세팅비를 항목별로 정리한 상세 견적서를 PDF로 즉시 다운로드합니다.',
              },
              {
                icon: <BarChart2 className="w-5 h-5" />,
                title: '성과 예측 리포트',
                desc: '채널별 예상 클릭수, 상담 문의, 신규 등록 수까지 30일 실행 로드맵과 함께 제공합니다.',
              },
            ].map((item, i) => (
              <div key={i} className={`p-8 ${i < 2 ? 'border-r border-black/10' : ''}`}>
                <div className="w-8 h-8 bg-[#111111] text-white flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-base font-black text-[#111111] mb-3 tracking-tight">{item.title}</h3>
                <p className="text-sm text-[#666666] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-6 py-24 bg-[#F5F5F5] border-b border-black/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-14">
            <div className="h-px w-10 bg-[#111111]" />
            <span className="text-xs font-bold text-[#111111] uppercase tracking-[0.2em]">진단 프로세스</span>
          </div>
          <h2 className="text-4xl font-black text-[#111111] mb-14 leading-tight">
            3단계로 완성되는<br />마케팅 전략
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
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
                <div className="text-7xl font-black text-[#111111]/8 leading-none mb-4 select-none">{item.step}</div>
                <div className="h-px w-12 bg-[#111111] mb-4" />
                <h3 className="text-lg font-black text-[#111111] mb-2 tracking-tight">{item.title}</h3>
                <p className="text-sm text-[#666666] leading-relaxed mb-4">{item.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs text-[#111111] font-bold uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-24 bg-white border-b border-black/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-14">
            <div className="h-px w-10 bg-[#111111]" />
            <span className="text-xs font-bold text-[#111111] uppercase tracking-[0.2em]">고객 후기</span>
          </div>
          <h2 className="text-4xl font-black text-[#111111] mb-14 leading-tight">
            실제 원장님의 경험
          </h2>
          <div className="grid md:grid-cols-2 gap-0 border border-black/10">
            {[
              {
                name: '김○○ 원장',
                school: '수원 수학학원',
                since: '2024년 3월',
                text: '5분 설문으로 이렇게 상세한 견적서가 나올 줄 몰랐습니다. 네이버 플레이스 광고 추천을 받고 실제로 집행했더니 한 달 만에 상담 문의가 3배 증가했습니다.',
                result: '+200%',
                resultLabel: '상담 문의',
              },
              {
                name: '박○○ 원장',
                school: '강남 영어학원',
                since: '2024년 6월',
                text: '마케팅 방향을 잡지 못해 예산을 낭비하다가 스트레이트랩 진단을 받았습니다. 메타 광고와 블로그 조합 추천이 정확히 맞아 현재 만족스럽게 운영 중입니다.',
                result: '+45%',
                resultLabel: '신규 등록',
              },
            ].map((item, i) => (
              <div key={i} className={`p-8 ${i < 1 ? 'border-r border-black/10' : ''}`}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="font-black text-[#111111] text-sm">{item.name}</div>
                    <div className="text-xs text-[#888888] mt-0.5">{item.school} · {item.since}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#111111]">{item.result}</div>
                    <div className="text-xs text-[#888888]">{item.resultLabel}</div>
                  </div>
                </div>
                <div className="h-px w-full bg-black/10 mb-6" />
                <p className="text-sm text-[#555555] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="px-6 py-16 bg-[#F5F5F5] border-b border-black/10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-0 divide-x divide-black/10">
            {[
              { icon: <Shield className="w-4 h-4" />, title: '100% 무료', desc: '진단 및 견적서 발급까지 모든 과정이 무료입니다.' },
              { icon: <TrendingUp className="w-4 h-4" />, title: '데이터 기반', desc: '업종별·규모별 실제 광고 성과 데이터를 기반으로 분석합니다.' },
              { icon: <Clock className="w-4 h-4" />, title: '즉시 결과', desc: '설문 완료 즉시 결과를 확인하고 PDF로 저장할 수 있습니다.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 px-8 py-6">
                <div className="w-8 h-8 bg-[#111111] text-white flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="font-black text-[#111111] text-sm mb-1 tracking-tight">{item.title}</div>
                  <div className="text-xs text-[#666666] leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-28 bg-[#111111]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-10 bg-white/40" />
            <span className="text-xs font-bold text-white/50 uppercase tracking-[0.2em]">STRAIGHT LAB</span>
          </div>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black text-white mb-6 leading-[1.05] tracking-tight">
            지금 바로 우리 학원의<br />마케팅을 진단하세요.
          </h2>
          <p className="text-white/50 mb-12 text-base max-w-md leading-relaxed">
            설문 완료 즉시 맞춤 견적서와 실행 전략을 받아보실 수 있습니다.
          </p>
          <Link
            href="/survey"
            prefetch={false}
            className="inline-flex items-center gap-3 bg-white hover:bg-[#F0F0F0] text-[#111111] font-black text-sm px-8 py-4 transition-colors tracking-widest uppercase"
          >
            무료 진단 시작하기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Image src="/bi_v1.png" alt="STRAIGHT LAB" width={120} height={34} className="h-8 w-auto brightness-0 invert opacity-40" unoptimized />
          <p className="text-[#555555] text-xs leading-relaxed max-w-md">
            본 서비스는 참고용 견적 제공을 목적으로 하며, 실제 견적은 상담을 통해 확정됩니다.<br />
            © 2025 STRAIGHT LAB. All rights reserved.
          </p>
          <Link
            href="/login"
            prefetch={false}
            className="text-[#333333] hover:text-white text-xs transition-colors uppercase tracking-widest"
          >
            관리자 로그인
          </Link>
        </div>
      </footer>
    </main>
  );
}
