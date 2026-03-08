'use client';

import { SurveyOption } from '@/types';

interface MultipleChoiceProps {
  options: SurveyOption[];
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

export default function MultipleChoice({ options, value, onChange }: MultipleChoiceProps) {
  const selected = value || [];

  const handleToggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => handleToggle(opt.value)}
            className={`text-left px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm min-h-[48px] flex items-center gap-2 ${
              isSelected
                ? 'border-[#0F3460] bg-[#0F3460] text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-[#0F3460] hover:bg-blue-50'
            }`}
          >
            <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-gray-400'}`}>
              {isSelected && <span className="text-[#0F3460] text-xs font-bold">✓</span>}
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
