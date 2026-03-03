"use client";

interface SelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function Select({ value, options, onChange }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border px-2 py-1 rounded"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
