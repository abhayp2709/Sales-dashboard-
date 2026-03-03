// components/molecules/SalesFilter.tsx
"use client";

interface SalesFilterProps {
    minSales: number;
    setMinSales: (minSales: number) => void;
}

export default function SalesFilter({ minSales, setMinSales }: SalesFilterProps) {
    return (
        <div>
            <label className="block mb-1 font-medium">Min Sales Filter:</label>
            <input
                type="number"
                className="border border-gray-300 rounded px-3 py-2"
                value={minSales}
                onChange={(e) => setMinSales(Number(e.target.value))}
            />
        </div>
    );
}
