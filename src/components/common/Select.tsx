import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function Select({
  options,
  placeholder,
  onChange,
  className = '',
  ...props
}: SelectProps) {
  return (
    <select
      className={`px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 ${className}`}
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
