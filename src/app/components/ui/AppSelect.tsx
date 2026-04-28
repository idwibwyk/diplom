import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

type AppSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export function AppSelect(props: {
  value: string;
  onChange: (value: string) => void;
  options: AppSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}) {
  const { value, onChange, options, placeholder = 'Выберите…', disabled, required, name, className, triggerClassName, contentClassName } = props;

  return (
    <div className={className}>
      {/* hidden input for native required validation */}
      {name ? (
        <input
          tabIndex={-1}
          aria-hidden="true"
          className="absolute h-px w-px opacity-0 pointer-events-none"
          value={value}
          required={required}
          name={name}
          onChange={() => undefined}
        />
      ) : null}

      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={
            triggerClassName ??
            'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-[#53C9CA] dark:border-gray-700 dark:bg-gray-900'
          }
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className={
            contentClassName ?? 'rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900'
          }
        >
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

