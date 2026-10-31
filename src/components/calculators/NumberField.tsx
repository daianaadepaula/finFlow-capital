import type { ChangeEvent } from "react";

type NumberFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  prefix?: string;
};

export default function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  prefix,
}: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="flex items-center overflow-hidden rounded-xl border border-slate-300 bg-white transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/30">
        {prefix && <span className="pl-4 text-sm font-medium text-slate-500">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
          className="w-full bg-transparent px-4 py-3 text-base text-slate-900 focus:outline-none"
        />
        {suffix && <span className="pr-4 text-sm font-medium text-slate-500">{suffix}</span>}
      </div>
    </div>
  );
}
