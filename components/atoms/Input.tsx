"use client";

interface InputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function Input({ value, onChange }: InputProps) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="border px-2 py-1 rounded"
    />
  );
}
