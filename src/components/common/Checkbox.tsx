import type { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({ label, onChange, className = '', ...props }: CheckboxProps) {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        className="w-4 h-4 border-2 border-gray-300 rounded text-black focus:ring-gray-400"
        onChange={(e) => onChange?.(e.target.checked)}
        {...props}
      />
      {label && <span className="text-sm text-gray-800">{label}</span>}
    </label>
  );
}
