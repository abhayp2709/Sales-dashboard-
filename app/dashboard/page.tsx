"use client";

import { useEffect, useState, useCallback } from "react";
import SalesChart from "@/components/organisms/SalesChart";
import { loadSettings, formatCurrency } from "@/lib/settingsStore";
import { useTheme } from "@/app/dashboard/DarkModeContext";

const years = ["2022", "2023", "2024"];
const chartTypes = [
    { value: "Bar", label: "Bar" },
    { value: "Line", label: "Line" },
    { value: "Pie", label: "Pie" },
];

interface SalesItem { month: string; sales: number; }
const DEFAULT_YEAR = "2024";
const DEFAULT_CHART = "Bar";
const DEFAULT_MIN = 0;

export default function DashboardPage() {
    const { theme } = useTheme();
    const [year, setYear] = useState(DEFAULT_YEAR);
    const [chartType, setChartType] = useState(DEFAULT_CHART);
    const [minSales, setMinSales] = useState(DEFAULT_MIN);
    const [totalSales, setTotalSales] = useState(0);
    const [avgSales, setAvgSales] = useState(0);
    const [peakMonth, setPeakMonth] = useState("");
    const [peakSales, setPeakSales] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    // Growth vs previous year
    const [totalGrowth, setTotalGrowth] = useState<number | null>(null);
    const [avgGrowth, setAvgGrowth] = useState<number | null>(null);
    const [peakGrowth, setPeakGrowth] = useState<number | null>(null);
    const [currency, setCurrency] = useState(() => loadSettings().currency);
    const [compact, setCompact] = useState(() => loadSettings().compactNumbers);

    useEffect(() => {
        const onSettingsChange = () => {
            const s = loadSettings();
            setCurrency(s.currency);
            setCompact(s.compactNumbers);
        };
        window.addEventListener("salesiq_settings_change", onSettingsChange);
        return () => window.removeEventListener("salesiq_settings_change", onSettingsChange);
    }, []);

    const calcStats = (data: SalesItem[]) => {
        const total = data.reduce((s, i) => s + i.sales, 0);
        const avg = Math.round(total / (data.length || 1));
        const peak = data.reduce((b, i) => (i.sales > b.sales ? i : b), data[0] || { month: "-", sales: 0 });
        return { total, avg, peak };
    };

    const calcGrowth = (cur: number, prev: number) =>
        prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null;

    const fetchSales = useCallback((y: string) => {
        setIsLoading(true);
        const prevYear = String(Number(y) - 1);
        const years_list = [y];
        // Only fetch previous year if it exists in our data (2022+)
        const fetchCurrent = fetch(`/api/sales?year=${y}`).then(r => r.json());
        const fetchPrev = Number(y) > 2022
            ? fetch(`/api/sales?year=${prevYear}`).then(r => r.json())
            : Promise.resolve(null);

        Promise.all([fetchCurrent, fetchPrev])
            .then(([curData, prevData]: [SalesItem[], SalesItem[] | null]) => {
                const cur = calcStats(curData);
                const prev = prevData ? calcStats(prevData) : null;
                setTotalSales(cur.total);
                setAvgSales(cur.avg);
                setPeakMonth(cur.peak?.month || "-");
                setPeakSales(cur.peak?.sales || 0);
                setTotalGrowth(prev ? calcGrowth(cur.total, prev.total) : null);
                setAvgGrowth(prev ? calcGrowth(cur.avg, prev.avg) : null);
                setPeakGrowth(prev ? calcGrowth(cur.peak.sales, prev.peak.sales) : null);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));

        void years_list; // suppress unused warning
    }, []);

    useEffect(() => { fetchSales(year); }, [year, fetchSales]);

    const handleReset = () => {
        setYear(DEFAULT_YEAR);
        setChartType(DEFAULT_CHART);
        setMinSales(DEFAULT_MIN);
    };

    const fmt = (n: number) => formatCurrency(n, currency, compact);
    const sym = { USD: "$", EUR: "€", GBP: "£", INR: "₹", JPY: "¥" }[currency] ?? "$";

    const statCards = [
        {
            label: "Total Sales", value: fmt(totalSales), sub: `${year} full year`, growth: totalGrowth,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            color: "#4f7cac", bg: theme.isDark ? "rgba(79,124,172,0.2)" : "#e8f0f9",
        },
        {
            label: "Monthly Average", value: fmt(avgSales), sub: "per month", growth: avgGrowth,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
            ),
            color: theme.isDark ? "#94a3b8" : "#6b7280",
            bg: theme.isDark ? "rgba(148,163,184,0.15)" : "#f3f4f6",
        },
        {
            label: "Peak Month", value: peakMonth, sub: fmt(peakSales), growth: peakGrowth,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ),
            color: "#7c6d52", bg: theme.isDark ? "rgba(124,109,82,0.2)" : "#faf5eb",
        },
    ];

    return (
        <>
            {/* ── Stat Cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
                {statCards.map((card) => (
                    <div key={card.label} style={{
                        background: theme.card, borderRadius: 12, padding: "20px 24px",
                        boxShadow: theme.isDark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.05)",
                        border: `1px solid ${theme.border}`,
                        transition: "background 0.3s, border-color 0.3s",
                    }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: card.bg, color: card.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {card.icon}
                            </div>
                            {/* Real YoY growth badge */}
                            {card.growth !== null && card.growth !== undefined ? (
                                <span style={{
                                    display: "inline-flex", alignItems: "center", gap: 2,
                                    padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                                    background: card.growth >= 0 ? "#ecfdf5" : "#fef2f2",
                                    color: card.growth >= 0 ? "#059669" : "#dc2626",
                                }}>
                                    {card.growth >= 0 ? "▲" : "▼"} {Math.abs(card.growth)}%
                                </span>
                            ) : (
                                <span style={{ fontSize: 10, color: theme.textMuted, padding: "3px 6px" }}>—</span>
                            )}
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, letterSpacing: "-0.02em", transition: "color 0.3s" }}>
                            {isLoading ? <span style={{ fontSize: 14, color: theme.textMuted }}>Loading…</span> : card.value}
                        </div>
                        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 3 }}>{card.label}</div>
                        <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2, opacity: 0.7 }}>{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* ── Chart Card ── */}
            <div style={{
                background: theme.card, borderRadius: 12, padding: 24,
                boxShadow: theme.isDark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.05)",
                border: `1px solid ${theme.border}`,
                transition: "background 0.3s, border-color 0.3s",
            }}>
                {/* Header */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${theme.border}` }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 2, transition: "color 0.3s" }}>
                            Monthly Sales Overview
                        </h2>
                        <p style={{ fontSize: 12, color: theme.textMuted }}>
                            Filtered data · min sales ≥ {sym}{minSales.toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={handleReset}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
                            borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                            border: `1.5px solid ${theme.border}`,
                            background: theme.isDark ? theme.inputBg : "#fff",
                            color: theme.textSub,
                            transition: "all 0.15s ease", fontFamily: "inherit",
                        }}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.36" />
                        </svg>
                        Reset Filters
                    </button>
                </div>

                {/* Filters */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
                    {/* Year */}
                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: theme.textSub, marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                            Select Year
                        </label>
                        <div style={{ position: "relative" }}>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                style={{
                                    width: "100%", padding: "8px 32px 8px 12px", border: `1.5px solid ${theme.border}`,
                                    borderRadius: 8, background: theme.inputBg, color: theme.text,
                                    fontSize: 13, fontFamily: "inherit", outline: "none", appearance: "none" as const,
                                    transition: "background 0.3s, color 0.3s",
                                }}
                            >
                                {years.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: theme.textMuted }}
                                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </div>

                    {/* Min Sales */}
                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: theme.textSub, marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                            Min Sales ({sym})
                        </label>
                        <input
                            type="number"
                            value={minSales} min={0} step={1000}
                            onChange={(e) => setMinSales(Number(e.target.value))}
                            placeholder="e.g. 10000"
                            style={{
                                width: "100%", padding: "8px 12px", border: `1.5px solid ${theme.border}`,
                                borderRadius: 8, background: theme.inputBg, color: theme.text,
                                fontSize: 13, fontFamily: "inherit", outline: "none",
                                transition: "background 0.3s, color 0.3s",
                            }}
                        />
                    </div>

                    {/* Chart Type */}
                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: theme.textSub, marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                            Chart Type
                        </label>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {chartTypes.map((ct) => (
                                <button
                                    key={ct.value}
                                    onClick={() => setChartType(ct.value)}
                                    style={{
                                        display: "inline-flex", alignItems: "center",
                                        padding: "6px 14px", borderRadius: 20,
                                        fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                                        border: `1.5px solid ${chartType === ct.value ? "#4f7cac" : theme.border}`,
                                        background: chartType === ct.value ? "#4f7cac" : (theme.isDark ? theme.inputBg : "#fff"),
                                        color: chartType === ct.value ? "#fff" : theme.textSub,
                                        boxShadow: chartType === ct.value ? "0 2px 6px rgba(79,124,172,0.3)" : "none",
                                        transition: "all 0.15s",
                                    }}
                                >{ct.label}</button>
                            ))}
                        </div>
                    </div>
                </div>

                <SalesChart year={year} chartType={chartType} minSales={minSales} />
            </div>
        </>
    );
}
