'use client';

interface SurveySectionProps {
  sectionNumber: number;
  title: string;
  description?: string;
}

export default function SurveySection({ sectionNumber, title, description }: SurveySectionProps) {
  return (
    <div className="mb-8 animate-fade-in-up">
      <div className="text-[#E94560] font-semibold text-sm mb-1">섹션 {sectionNumber}</div>
      <h1 className="text-2xl font-black text-[#0F3460]">{title}</h1>
      {description && <p className="text-gray-500 mt-1">{description}</p>}
    </div>
  );
}
