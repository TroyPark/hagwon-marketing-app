'use client';

import { SurveyOption } from '@/types';

interface SingleChoiceProps {
  options: SurveyOption[];
  value: string | undefined;
  onChange: (value: string) => void;
}

export default function SingleChoice({ options, value, onChange }: SingleChoiceProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`text-left px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm min-h-[48px] flex items-center gap-2 ${
              isSelected
                ? 'border-[#0F3460] bg-[#0F3460] text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-[#0F3460] hover:bg-blue-50'
            }`}
          >
            <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${isSelected ? 'border-white bg-white' : 'border-gray-400'}`} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
