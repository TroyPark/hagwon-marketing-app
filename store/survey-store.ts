import { create } from 'zustand';
import { SurveyAnswers, RecommendationResult } from '@/types';

interface SurveyStore {
  answers: SurveyAnswers;
  currentSection: number;
  currentQuestion: number;
  isCompleted: boolean;
  result: RecommendationResult | null;
  setAnswer: (questionId: string, value: string | string[]) => void;
  nextSection: () => void;
  prevSection: () => void;
  setCompleted: (completed: boolean) => void;
  setResult: (result: RecommendationResult) => void;
  reset: () => void;
}

export const useSurveyStore = create<SurveyStore>()((set) => ({
  answers: {},
  currentSection: 0,
  currentQuestion: 0,
  isCompleted: false,
  result: null,
  setAnswer: (questionId, value) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: value },
    })),
  nextSection: () =>
    set((state) => ({ currentSection: state.currentSection + 1 })),
  prevSection: () =>
    set((state) => ({ currentSection: Math.max(0, state.currentSection - 1) })),
  setCompleted: (completed) => set({ isCompleted: completed }),
  setResult: (result) => set({ result }),
  reset: () =>
    set({ answers: {}, currentSection: 0, currentQuestion: 0, isCompleted: false, result: null }),
}));
