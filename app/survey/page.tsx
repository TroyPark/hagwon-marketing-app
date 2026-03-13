'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SURVEY_SECTIONS, TOTAL_QUESTIONS } from '@/lib/survey-data';
import { useSurveyStore } from '@/store/survey-store';
import { SurveyQuestion } from '@/types';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getBudgetTier, calculateChannelPriority, generateInsights, predictKPI, generateActionPlan } from '@/lib/recommendation-engine';
import { calculateQuote } from '@/lib/quote-calculator';

function ProgressBar({ current, total, sectionIndex }: { current: number; total: number; sectionIndex: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4 no-print">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
          <span className="uppercase tracking-widest">
            섹션 {sectionIndex + 1} / {SURVEY_SECTIONS.length} &nbsp;·&nbsp; {SURVEY_SECTIONS[sectionIndex]?.title}
          </span>
          <span>{pct}% 완료</span>
        </div>
        <div className="h-0.5 bg-[#E5E5E5] overflow-hidden">
          <div
            className="h-full bg-[#111111] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function QuestionBlock({
  question,
  answer,
  onAnswer,
  showError,
}: {
  question: SurveyQuestion;
  answer: string | string[] | undefined;
  onAnswer: (value: string | string[]) => void;
  showError: boolean;
}) {
  const handleSingle = (val: string) => onAnswer(val);

  const handleMultiple = (val: string) => {
    const current = (answer as string[]) || [];
    if (current.includes(val)) {
      onAnswer(current.filter(v => v !== val));
    } else {
      onAnswer([...current, val]);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-base font-bold text-gray-900 mb-1 leading-snug">{question.question}</h2>
      {question.required && <p className="text-xs text-gray-400 mb-4 font-medium">* 필수 항목</p>}

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
            const isSelected =
              question.type === 'multiple_choice'
                ? ((answer as string[]) || []).includes(opt.value)
                : answer === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() =>
                  question.type === 'multiple_choice'
                    ? handleMultiple(opt.value)
                    : handleSingle(opt.value)
                }
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
                  <span className={`w-4 h-4 rounded-full flex-shrink-0 border-2 flex items-center justify-center ${isSelected ? 'border-white' : 'border-gray-300'}`}>
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

export default function SurveyPage() {
  const router = useRouter();
  const { answers, currentSection, setAnswer, nextSection, prevSection, setCompleted } = useSurveyStore();
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const section = SURVEY_SECTIONS[currentSection];
  if (!section) return null;

  const answeredBefore = SURVEY_SECTIONS.slice(0, currentSection).reduce((acc, s) => acc + s.questions.length, 0);

  const isValid = () => {
    return section.questions.every(q => {
      if (!q.required) return true;
      const ans = answers[q.id as keyof typeof answers];
      if (q.type === 'multiple_choice') return Array.isArray(ans) && ans.length > 0;
      return !!ans;
    });
  };

  const handleNext = async () => {
    if (!isValid()) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);

    if (currentSection < SURVEY_SECTIONS.length - 1) {
      nextSection();
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    } else {
      // Submit (client-side, no API call needed)
      setSubmitting(true);
      try {
        const budgetTier = getBudgetTier(answers.Q11 || '50_100');
        const recommendedChannels = calculateChannelPriority(answers);
        const quote = calculateQuote(recommendedChannels, budgetTier);
        const expectedKPI = predictKPI(recommendedChannels, quote.totalAdBudget);
        const insights = generateInsights(answers, recommendedChannels);
        const actionPlan = generateActionPlan(recommendedChannels);
        const resultData = { budgetTier, recommendedChannels, quote, expectedKPI, insights, actionPlan };
        useSurveyStore.getState().setResult(resultData);
        sessionStorage.setItem('survey-result', JSON.stringify(resultData));
        setCompleted(true);
        window.location.href = (process.env.NODE_ENV === 'production' ? '/hagwon-marketing-app' : '') + '/result';
      } catch (e) {
        console.error('결과 생성 오류:', e);
        alert('결과 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      prevSection();
      setShowErrors(false);
    } else {
      router.push('/');
    }
  };

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

      <ProgressBar current={answeredBefore + section.questions.length} total={TOTAL_QUESTIONS} sectionIndex={currentSection} />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Section title */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-6 bg-[#111111]" />
              <p className="text-xs font-bold text-[#111111] uppercase tracking-[0.2em]">
                섹션 {currentSection + 1} / {SURVEY_SECTIONS.length}
              </p>
            </div>
            <h1 className="text-2xl font-black text-[#111111] tracking-tight">{section.title}</h1>
            {section.description && <p className="text-[#888888] text-sm mt-1">{section.description}</p>}
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {section.questions.map((q) => (
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
              disabled={submitting}
              className="flex items-center gap-2 bg-[#111111] hover:bg-black disabled:opacity-40 text-white font-bold px-7 py-3 transition-all text-sm uppercase tracking-widest"
            >
              {submitting ? (
                <>분석 중...</>
              ) : currentSection < SURVEY_SECTIONS.length - 1 ? (
                <>다음 단계 <ChevronRight className="w-4 h-4" /></>
              ) : (
                <>결과 확인 <CheckCircle className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
