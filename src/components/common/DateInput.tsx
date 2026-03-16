import type { InputHTMLAttributes } from 'react';

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onChange?: (value: string) => void;
}

export function DateInput({ onChange, className = '', ...props }: DateInputProps) {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <span className="absolute left-3 text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </span>
      <input
        type="date"
        className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
    </div>
  );
}
