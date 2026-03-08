'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SURVEY_SECTIONS, TOTAL_QUESTIONS } from '@/lib/survey-data';
import { useSurveyStore } from '@/store/survey-store';
import { SurveyQuestion } from '@/types';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
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
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0F3460] transition-all duration-500 rounded-full"
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
          className="w-full border border-gray-200 rounded-lg p-4 text-sm text-gray-800 focus:outline-none focus:border-[#0F3460] resize-none transition-colors"
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
                className={`text-left px-4 py-3 rounded-lg border transition-all text-sm min-h-[48px] flex items-center gap-3 ${
                  isSelected
                    ? 'border-[#0F3460] bg-[#0F3460] text-white shadow-md shadow-blue-900/15'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-[#0F3460]/40 hover:bg-gray-50'
                }`}
              >
                {question.type === 'multiple_choice' && (
                  <span className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border ${isSelected ? 'border-white bg-white' : 'border-gray-300'}`}>
                    {isSelected && <span className="text-[#0F3460] text-xs font-black">✓</span>}
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
        useSurveyStore.getState().setResult({ budgetTier, recommendedChannels, quote, expectedKPI, insights, actionPlan });
        setCompleted(true);
        router.push('/result');
      } catch {
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
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 no-print">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
            <div className="w-6 h-6 bg-[#0F3460] rounded-sm" />
            <span className="font-bold text-[#0F3460] tracking-tight">EduMarketing</span>
          </Link>
          <span className="text-gray-300 mx-2">|</span>
          <span className="text-sm text-gray-500">마케팅 진단 설문</span>
        </div>
      </header>

      <ProgressBar current={answeredBefore + section.questions.length} total={TOTAL_QUESTIONS} sectionIndex={currentSection} />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Section title */}
          <div className="mb-8 animate-fade-in-up">
            <p className="text-xs font-bold text-[#0F3460] uppercase tracking-widest mb-2">
              섹션 {currentSection + 1}
            </p>
            <h1 className="text-2xl font-black text-gray-900">{section.title}</h1>
            {section.description && <p className="text-gray-400 text-sm mt-1">{section.description}</p>}
          </div>

          {/* Questions */}
          <div className="space-y-5">
            {section.questions.map((q) => (
              <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="text-xs font-bold text-gray-300 mb-3 uppercase tracking-widest">Q{q.id.replace('Q', '')}</div>
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
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium px-4 py-3 rounded-lg hover:bg-gray-100 transition-all text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              이전
            </button>
            <button
              onClick={handleNext}
              disabled={submitting}
              className="flex items-center gap-2 bg-[#0F3460] hover:bg-[#0a2744] disabled:opacity-50 text-white font-bold px-7 py-3 rounded-lg transition-all shadow-lg shadow-blue-900/20 text-sm"
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
