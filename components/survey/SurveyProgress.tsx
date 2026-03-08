'use client';

interface SurveyProgressProps {
  current: number;
  total: number;
  sectionIndex: number;
  sectionTitle: string;
  totalSections: number;
}

export default function SurveyProgress({ current, total, sectionIndex, sectionTitle, totalSections }: SurveyProgressProps) {
  const pct = Math.round((current / total) * 100);
  const sectionColors = ['bg-blue-500', 'bg-purple-500', 'bg-[#E94560]'];

  return (
    <div className="bg-white border-b px-4 py-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>섹션 {sectionIndex + 1} / {totalSections}: {sectionTitle}</span>
          <span>{current} / {total} 문항</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${sectionColors[sectionIndex] || 'bg-blue-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
