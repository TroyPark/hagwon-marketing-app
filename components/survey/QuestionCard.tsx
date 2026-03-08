'use client';

import { ReactNode } from 'react';

interface QuestionCardProps {
  questionNumber: string;
  children: ReactNode;
}

export default function QuestionCard({ questionNumber, children }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="text-xs font-bold text-gray-400 mb-2">Q{questionNumber}</div>
      {children}
    </div>
  );
}
