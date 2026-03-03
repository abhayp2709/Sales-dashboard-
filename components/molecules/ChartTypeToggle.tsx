// components/molecules/ChartTypeToggle.tsx
"use client";

interface ChartTypeToggleProps {
    type: "bar" | "line" | "pie";
    setType: (type: "bar" | "line" | "pie") => void;
}

export default function ChartTypeToggle({ type, setType }: ChartTypeToggleProps) {
    return (
        <div>
            <label className="block mb-1 font-medium">Chart Type:</label>
            <select
                className="border border-gray-300 rounded px-3 py-2"
                value={type}
                onChange={(e) => setType(e.target.value as "bar" | "line" | "pie")}
            >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
            </select>
        </div>
    );
}
