// components/templates/DashboardLayout.tsx
"use client";
import { useState } from "react";
import SalesChart from "@/components/organisms/SalesChart";
import SalesFilter from "@/components/molecules/SalesFilter";
import YearSelector from "@/components/molecules/YearSelector";
import ChartTypeToggle from "@/components/molecules/ChartTypeToggle";

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
    const [year, setYear] = useState("2024");
    const [chartType, setChartType] = useState("Bar");
    const [minSales, setMinSales] = useState(0);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            </header>

            <section className="flex flex-col md:flex-row gap-4 mb-6">
                <YearSelector year={parseInt(year)} setYear={(y) => setYear(y.toString())} />
                <ChartTypeToggle type={chartType.toLowerCase() as "bar" | "line" | "pie"} setType={(t) => setChartType(t.charAt(0).toUpperCase() + t.slice(1))} />
                <SalesFilter minSales={minSales} setMinSales={setMinSales} />
            </section>

            <section className="bg-white p-6 rounded-lg shadow">
                {children}
                <SalesChart year={year} chartType={chartType} minSales={minSales} />
            </section>
        </div>
    );
}
