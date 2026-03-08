'use client';

interface TextInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function TextInput({ value, onChange, placeholder, rows = 4 }: TextInputProps) {
  return (
    <textarea
      className="w-full border-2 rounded-xl p-4 text-gray-800 focus:outline-none focus:border-[#0F3460] resize-none"
      rows={rows}
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
