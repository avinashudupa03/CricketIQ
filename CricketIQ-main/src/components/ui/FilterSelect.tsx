interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export default function FilterSelect({ value, onChange, options, placeholder = 'All' }: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-pitch-500/50 focus:ring-1 focus:ring-pitch-500/25 transition-all duration-200 appearance-none cursor-pointer min-w-[140px]"
    >
      <option value="" className="bg-slate-900">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-900">
          {opt.label}
        </option>
      ))}
    </select>
  );
}
