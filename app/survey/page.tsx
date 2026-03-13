'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SURVEY_SECTIONS, TOTAL_QUESTIONS } from '@/lib/survey-data';
import { useSurveyStore } from '@/store/survey-store';
import { SurveyQuestion } from '@/types';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getBudgetTier, calculateChannelPriority, generateInsights, predictKPI, generateActionPlan } from '@/lib/recommendation-engine';
import { calculateQuote } from '@/lib/quote-calculator';
import { supabase } from '@/lib/supabase';

function ProgressBar({ current, total, sectionIndex, isContactStep }: {
  current: number; total: number; sectionIndex: number; isContactStep?: boolean;
}) {
  const pct = isContactStep ? 100 : Math.round((current / total) * 100);
  const label = isContactStep ? '연락처 입력' : SURVEY_SECTIONS[sectionIndex]?.title;
  return (
    <div className="bg-white border-b border-black/10 px-6 py-4 no-print">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between text-xs text-[#888888] mb-2 font-medium">
          <span className="uppercase tracking-widest">
            {isContactStep
              ? `섹션 4 / 4 · ${label}`
              : `섹션 ${sectionIndex + 1} / ${SURVEY_SECTIONS.length + 1} · ${label}`}
          </span>
          <span>{pct}% 완료</span>
        </div>
        <div className="h-0.5 bg-[#E5E5E5] overflow-hidden">
          <div className="h-full bg-[#111111] transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function QuestionBlock({
  question, answer, onAnswer, showError,
}: {
  question: SurveyQuestion;
  answer: string | string[] | undefined;
  onAnswer: (value: string | string[]) => void;
  showError: boolean;
}) {
  const handleSingle = (val: string) => onAnswer(val);
  const handleMultiple = (val: string) => {
    const current = (answer as string[]) || [];
    if (current.includes(val)) onAnswer(current.filter(v => v !== val));
    else onAnswer([...current, val]);
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-base font-bold text-[#111111] mb-1 leading-snug">{question.question}</h2>
      {question.required && <p className="text-xs text-[#AAAAAA] mb-4 font-medium">* 필수 항목</p>}
      {question.type === 'text' ? (
        <textarea
          className="w-full border border-[#E5E5E5] p-4 text-sm text-[#333333] focus:outline-none focus:border-[#111111] resize-none transition-colors bg-white"
          rows={4}
          placeholder={question.placeholder}
          value={(answer as string) || ''}
          onChange={(e) => onAnswer(e.target.value)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {question.options?.map((opt) => {
            const isSelected = question.type === 'multiple_choice'
              ? ((answer as string[]) || []).includes(opt.value)
              : answer === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => question.type === 'multiple_choice' ? handleMultiple(opt.value) : handleSingle(opt.value)}
                className={`text-left px-4 py-3 border transition-all text-sm min-h-[48px] flex items-center gap-3 ${
                  isSelected
                    ? 'border-[#111111] bg-[#111111] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#444444] hover:border-[#111111]/40 hover:bg-[#F5F5F5]'
                }`}
              >
                {question.type === 'multiple_choice' && (
                  <span className={`w-4 h-4 flex-shrink-0 flex items-center justify-center border ${isSelected ? 'border-white bg-white' : 'border-[#CCCCCC]'}`}>
                    {isSelected && <span className="text-[#111111] text-xs font-black">✓</span>}
                  </span>
                )}
                {question.type === 'single_choice' && (
                  <span className={`w-4 h-4 rounded-full flex-shrink-0 border-2 flex items-center justify-center ${isSelected ? 'border-white' : 'border-[#CCCCCC]'}`}>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white block" />}
                  </span>
                )}
                <span className="font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
      {showError && question.required && !answer && (
        <p className="mt-3 text-red-500 text-xs font-medium">필수 항목입니다. 선택 후 다음 단계로 진행해 주세요.</p>
      )}
    </div>
  );
}

// ── 연락처 입력 스텝 ──────────────────────────────
function ContactStep({
  onSubmit,
  onPrev,
  submitting,
}: {
  onSubmit: (data: { hagwon_name: string; contact_name: string; phone: string; email: string }) => void;
  onPrev: () => void;
  submitting: boolean;
}) {
  const [form, setForm] = useState({ hagwon_name: '', contact_name: '', phone: '', email: '' });
  const [formError, setFormError] = useState('');

  const formatPhone = (val: string) => {
    const num = val.replace(/\D/g, '');
    if (num.length <= 3) return num;
    if (num.length <= 7) return `${num.slice(0, 3)}-${num.slice(3)}`;
    return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.hagwon_name.trim()) { setFormError('학원명을 입력해 주세요.'); return; }
    if (!form.contact_name.trim()) { setFormError('담당자명을 입력해 주세요.'); return; }
    if (!form.phone.trim()) { setFormError('연락처를 입력해 주세요.'); return; }
    setFormError('');
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in-up">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-6 bg-[#111111]" />
          <p className="text-xs font-bold text-[#111111] uppercase tracking-[0.2em]">연락처 입력</p>
        </div>
        <h1 className="text-2xl font-black text-[#111111] tracking-tight">거의 다 됐습니다!</h1>
        <p className="text-[#888888] text-sm mt-1">맞춤 견적서 발송을 위해 연락처를 입력해 주세요.</p>
      </div>

      <div className="space-y-4">
        {/* 학원명 */}
        <div className="bg-white border border-black/10 p-6">
          <label className="block text-[10px] font-black text-[#111111] uppercase tracking-widest mb-3">학원명 *</label>
          <input
            type="text" required value={form.hagwon_name}
            onChange={e => setForm(p => ({ ...p, hagwon_name: e.target.value }))}
            placeholder="예: OO수학학원"
            className="w-full border border-[#E5E5E5] px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#CCCCCC]"
          />
        </div>

        {/* 담당자명 */}
        <div className="bg-white border border-black/10 p-6">
          <label className="block text-[10px] font-black text-[#111111] uppercase tracking-widest mb-3">담당자명 *</label>
          <input
            type="text" required value={form.contact_name}
            onChange={e => setForm(p => ({ ...p, contact_name: e.target.value }))}
            placeholder="예: 홍길동 원장"
            className="w-full border border-[#E5E5E5] px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#CCCCCC]"
          />
        </div>

        {/* 연락처 */}
        <div className="bg-white border border-black/10 p-6">
          <label className="block text-[10px] font-black text-[#111111] uppercase tracking-widest mb-3">휴대폰 번호 *</label>
          <input
            type="tel" value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: formatPhone(e.target.value) }))}
            placeholder="010-0000-0000" maxLength={13}
            className="w-full border border-[#E5E5E5] px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#CCCCCC]"
          />
        </div>

        {/* 이메일 (선택) */}
        <div className="bg-white border border-black/10 p-6">
          <label className="block text-[10px] font-black text-[#111111] uppercase tracking-widest mb-3">
            이메일 <span className="text-[#AAAAAA] normal-case tracking-normal font-normal">(선택)</span>
          </label>
          <input
            type="email" value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            placeholder="example@email.com"
            className="w-full border border-[#E5E5E5] px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#CCCCCC]"
          />
        </div>

        <div className="bg-[#F0F0F0] border border-black/10 px-4 py-3">
          <p className="text-[10px] text-[#888888] leading-relaxed">
            입력하신 정보는 마케팅 진단 결과 전달 및 상담 목적으로만 활용됩니다.
          </p>
        </div>
      </div>

      {formError && <p className="mt-4 text-sm text-red-500 font-medium">{formError}</p>}

      <div className="flex justify-between items-center mt-8 pb-10">
        <button
          type="button" onClick={onPrev}
          className="flex items-center gap-2 text-[#888888] hover:text-[#111111] font-medium px-4 py-3 hover:bg-[#EEEEEE] transition-all text-sm uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4" />
          이전
        </button>
        <button
          type="submit" disabled={submitting}
          className="flex items-center gap-2 bg-[#111111] hover:bg-black disabled:opacity-40 text-white font-bold px-7 py-3 transition-all text-sm uppercase tracking-widest"
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> 분석 중...</>
          ) : (
            <>결과 확인 <CheckCircle className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </form>
  );
}

// ── 메인 페이지 ──────────────────────────────────
export default function SurveyPage() {
  const router = useRouter();
  const { answers, currentSection, setAnswer, nextSection, prevSection, setCompleted } = useSurveyStore();
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showContactStep, setShowContactStep] = useState(false);

  const section = SURVEY_SECTIONS[currentSection];

  const answeredBefore = SURVEY_SECTIONS.slice(0, currentSection).reduce((acc, s) => acc + s.questions.length, 0);

  const isValid = () => {
    if (!section) return true;
    return section.questions.every(q => {
      if (!q.required) return true;
      const ans = answers[q.id as keyof typeof answers];
      if (q.type === 'multiple_choice') return Array.isArray(ans) && ans.length > 0;
      return !!ans;
    });
  };

  const handleNext = () => {
    if (!isValid()) { setShowErrors(true); return; }
    setShowErrors(false);
    if (currentSection < SURVEY_SECTIONS.length - 1) {
      nextSection();
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    } else {
      // 마지막 섹션 → 연락처 스텝으로
      setShowContactStep(true);
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    }
  };

  const handleContactSubmit = async (contactData: {
    hagwon_name: string; contact_name: string; phone: string; email: string;
  }) => {
    setSubmitting(true);
    try {
      // 1. 결과 계산
      const budgetTier = getBudgetTier(answers.Q11 || '50_100');
      const recommendedChannels = calculateChannelPriority(answers);
      const quote = calculateQuote(recommendedChannels, budgetTier);
      const expectedKPI = predictKPI(recommendedChannels, quote.totalAdBudget);
      const insights = generateInsights(answers, recommendedChannels);
      const actionPlan = generateActionPlan(recommendedChannels);
      const resultData = { budgetTier, recommendedChannels, quote, expectedKPI, insights, actionPlan };

      // 2. Supabase customer 테이블에 저장
      const { error: insertError } = await supabase.from('customer').insert({
        hagwon_name: contactData.hagwon_name,
        contact_name: contactData.contact_name,
        phone: contactData.phone,
        email: contactData.email || null,
        status: 'new',
        budget_tier: budgetTier.label,
        recommended_channels: recommendedChannels.slice(0, 5).map(ch => ch.channel),
        monthly_total: quote.monthlyTotal,
        diagnosis_result: resultData,
      });
      if (insertError) console.error('[CRM insert error]', insertError);

      // 3. 결과 저장 후 이동
      useSurveyStore.getState().setResult(resultData);
      sessionStorage.setItem('survey-result', JSON.stringify(resultData));
      setCompleted(true);
      window.location.href = '/result';
    } catch (e) {
      console.error('결과 생성 오류:', e);
      alert('결과 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrev = () => {
    if (showContactStep) {
      setShowContactStep(false);
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    } else if (currentSection > 0) {
      prevSection();
      setShowErrors(false);
    } else {
      router.push('/');
    }
  };

  if (!section && !showContactStep) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-black/10 py-4 px-6 no-print">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" prefetch={false} className="flex items-center hover:opacity-60 transition-opacity">
            <Image src="/bi_v1.png" alt="STRAIGHT LAB" width={120} height={34} className="h-8 w-auto" unoptimized />
          </Link>
          <span className="text-[#DDDDDD]">|</span>
          <span className="text-xs text-[#888888] uppercase tracking-widest font-medium">마케팅 진단 설문</span>
        </div>
      </header>

      <ProgressBar
        current={answeredBefore + (section?.questions.length || 0)}
        total={TOTAL_QUESTIONS}
        sectionIndex={currentSection}
        isContactStep={showContactStep}
      />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-2xl mx-auto">
          {showContactStep ? (
            <ContactStep
              onSubmit={handleContactSubmit}
              onPrev={handlePrev}
              submitting={submitting}
            />
          ) : (
            <>
              {/* Section title */}
              <div className="mb-8 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px w-6 bg-[#111111]" />
                  <p className="text-xs font-bold text-[#111111] uppercase tracking-[0.2em]">
                    섹션 {currentSection + 1} / {SURVEY_SECTIONS.length + 1}
                  </p>
                </div>
                <h1 className="text-2xl font-black text-[#111111] tracking-tight">{section!.title}</h1>
                {section!.description && <p className="text-[#888888] text-sm mt-1">{section!.description}</p>}
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {section!.questions.map((q) => (
                  <div key={q.id} className="bg-white border border-black/10 p-6">
                    <div className="text-xs font-bold text-[#BBBBBB] mb-3 uppercase tracking-widest">Q{q.id.replace('Q', '')}</div>
                    <QuestionBlock
                      question={q}
                      answer={answers[q.id as keyof typeof answers] as string | string[] | undefined}
                      onAnswer={(val) => setAnswer(q.id, val)}
                      showError={showErrors}
                    />
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pb-10">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-2 text-[#888888] hover:text-[#111111] font-medium px-4 py-3 hover:bg-[#EEEEEE] transition-all text-sm uppercase tracking-wider"
                >
                  <ChevronLeft className="w-4 h-4" />
                  이전
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-[#111111] hover:bg-black text-white font-bold px-7 py-3 transition-all text-sm uppercase tracking-widest"
                >
                  {currentSection < SURVEY_SECTIONS.length - 1
                    ? <>다음 단계 <ChevronRight className="w-4 h-4" /></>
                    : <>연락처 입력 <ChevronRight className="w-4 h-4" /></>}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
