"use client";

import { useEffect, useState } from "react";
import { loadSettings, formatCurrency } from "@/lib/settingsStore";
import { useTheme } from "@/app/dashboard/DarkModeContext";

interface SalesItem { month: string; sales: number; }
interface YearData { year: string; data: SalesItem[]; total: number; avg: number; peak: SalesItem; }
const years = ["2022", "2023", "2024"];
const trendColor = (v: number) => (v >= 0 ? "#059669" : "#dc2626");
const trendBg = (v: number) => (v >= 0 ? "#ecfdf5" : "#fef2f2");
const trendSign = (v: number) => (v >= 0 ? "▲" : "▼");
function calcGrowth(cur: number, prev: number) { return !prev ? 0 : Math.round(((cur - prev) / prev) * 100); }

export default function ReportsPage() {
    const { theme } = useTheme();
    const [allData, setAllData] = useState<YearData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [currency, setCurrency] = useState(() => loadSettings().currency);
    const [compact, setCompact] = useState(() => loadSettings().compactNumbers);

    useEffect(() => {
        const onSettingsChange = () => { const s = loadSettings(); setCurrency(s.currency); setCompact(s.compactNumbers); };
        window.addEventListener("salesiq_settings_change", onSettingsChange);
        return () => window.removeEventListener("salesiq_settings_change", onSettingsChange);
    }, []);

    const fmt = (n: number) => formatCurrency(n, currency, compact);

    useEffect(() => {
        Promise.all(years.map((y) =>
            fetch(`/api/sales?year=${y}`).then((r) => r.json()).then((data: SalesItem[]) => {
                const total = data.reduce((s, i) => s + i.sales, 0);
                const avg = Math.round(total / (data.length || 1));
                const peak = data.reduce((b, i) => (i.sales > b.sales ? i : b), data[0]);
                return { year: y, data, total, avg, peak };
            })
        )).then((results) => { setAllData(results); setLoading(false); });
    }, []);

    const detail = allData.find((d) => d.year === selectedYear);

    if (loading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: theme.textMuted, fontSize: 14 }}>
            Loading reports…
        </div>
    );

    return (
        <>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: theme.text, marginBottom: 4, transition: "color 0.3s" }}>Sales Reports</h1>
                <p style={{ fontSize: 13, color: theme.textMuted }}>Year-over-year comparison of all sales data.</p>
            </div>

            {/* ── Year Summary Cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
                {allData.map((yd, idx) => {
                    const prev = allData[idx - 1];
                    const growth = prev ? calcGrowth(yd.total, prev.total) : null;
                    const isSelected = selectedYear === yd.year;
                    return (
                        <button
                            key={yd.year}
                            onClick={() => setSelectedYear(isSelected ? null : yd.year)}
                            style={{
                                background: isSelected ? (theme.isDark ? "#1a2c45" : "#1e2a3a") : theme.card,
                                border: isSelected ? "2px solid #4f7cac" : `1.5px solid ${theme.border}`,
                                borderRadius: 12, padding: "20px 22px", textAlign: "left",
                                cursor: "pointer", transition: "all 0.15s",
                                boxShadow: isSelected ? "0 4px 16px rgba(79,124,172,0.25)" : (theme.isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.04)"),
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: isSelected ? "#93c5fd" : "#4f7cac" }}>{yd.year}</span>
                                {growth !== null && (
                                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: trendBg(growth), color: trendColor(growth) }}>
                                        {trendSign(growth)} {Math.abs(growth)}%
                                    </span>
                                )}
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: isSelected ? "#f1f5f9" : theme.text, letterSpacing: "-0.02em", marginBottom: 6, transition: "color 0.3s" }}>{fmt(yd.total)}</div>
                            <div style={{ fontSize: 11, color: isSelected ? "#64748b" : theme.textMuted }}>Total Revenue</div>
                            <div style={{ marginTop: 14, display: "flex", gap: 16 }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "#cbd5e1" : theme.textSub }}>{fmt(yd.avg)}</div>
                                    <div style={{ fontSize: 11, color: isSelected ? "#64748b" : theme.textMuted }}>Avg/month</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "#cbd5e1" : theme.textSub }}>{yd.peak?.month}</div>
                                    <div style={{ fontSize: 11, color: isSelected ? "#64748b" : theme.textMuted }}>Peak month</div>
                                </div>
                            </div>
                            <div style={{ marginTop: 10, fontSize: 11, color: isSelected ? "#4f7cac" : theme.textMuted }}>
                                {isSelected ? "↑ Click to collapse" : "↓ Click to see details"}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* ── Monthly Detail Table ── */}
            {detail && (
                <div style={{
                    background: theme.card, borderRadius: 12, padding: 24,
                    boxShadow: theme.isDark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.05)",
                    border: `1px solid ${theme.border}`, transition: "background 0.3s",
                }}>
                    <div style={{ marginBottom: 18 }}>
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>{detail.year} — Monthly Breakdown</h2>
                        <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 3 }}>{detail.data.length} months · Total: {fmt(detail.total)}</p>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
                                    {["Month", "Sales Revenue", "vs Monthly Avg", "Share of Total", "Status"].map((h) => (
                                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: theme.textMuted, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {detail.data.map((row, i) => {
                                    const vsAvg = calcGrowth(row.sales, detail.avg);
                                    const share = ((row.sales / detail.total) * 100).toFixed(1);
                                    const isPeak = row.sales === detail.peak?.sales;
                                    return (
                                        <tr key={row.month}
                                            style={{ borderBottom: `1px solid ${theme.border}`, background: i % 2 === 0 ? theme.card : theme.tableAlt, transition: "background 0.1s" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = theme.tableHover)}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? theme.card : theme.tableAlt)}
                                        >
                                            <td style={{ padding: "12px 14px", fontWeight: 600, color: theme.text }}>{row.month}</td>
                                            <td style={{ padding: "12px 14px", fontWeight: 700, color: theme.text }}>{fmt(row.sales)}</td>
                                            <td style={{ padding: "12px 14px" }}>
                                                <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: trendBg(vsAvg), color: trendColor(vsAvg) }}>
                                                    {trendSign(vsAvg)} {Math.abs(vsAvg)}%
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px 14px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <div style={{ flex: 1, height: 6, background: theme.border, borderRadius: 3, minWidth: 60 }}>
                                                        <div style={{ width: `${share}%`, height: "100%", background: "#4f7cac", borderRadius: 3 }} />
                                                    </div>
                                                    <span style={{ fontSize: 11, color: theme.textSub, whiteSpace: "nowrap" as const }}>{share}%</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: "12px 14px" }}>
                                                {isPeak
                                                    ? <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#faf5eb", color: "#92400e" }}>★ Peak</span>
                                                    : <span style={{ color: theme.textMuted, fontSize: 11 }}>—</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr style={{ borderTop: `2px solid ${theme.border}`, background: theme.infoBg }}>
                                    <td style={{ padding: "12px 14px", fontWeight: 700, color: theme.text }}>Total</td>
                                    <td style={{ padding: "12px 14px", fontWeight: 700, color: theme.text }}>{fmt(detail.total)}</td>
                                    <td colSpan={3} style={{ padding: "12px 14px", fontSize: 12, color: theme.textMuted }}>{detail.data.length} months · Average {fmt(detail.avg)}/month</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
