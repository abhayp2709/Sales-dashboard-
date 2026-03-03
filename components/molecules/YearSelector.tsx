// components/molecules/YearSelector.tsx
"use client";

interface YearSelectorProps {
    year: number;
    setYear: (year: number) => void;
}

export default function YearSelector({ year, setYear }: YearSelectorProps) {
    return (
        <div>
            <label className="block mb-1 font-medium">Select Year:</label>
            <select
                className="border border-gray-300 rounded px-3 py-2"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
            >
                <option value={2022}>2022</option>
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
            </select>
        </div>
    );
}
