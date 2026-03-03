"use client";

import { useEffect, useState } from "react";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { loadSettings, formatCurrency } from "@/lib/settingsStore";
import { useTheme } from "@/app/dashboard/DarkModeContext";

interface Props { year: string; chartType: string; minSales: number; }
interface SalesItem { month: string; sales: number;[key: string]: string | number; }

const PIE_COLORS = ["#4f7cac", "#6c9cb8", "#8ab4c4", "#a8cbd0", "#c5dedd", "#a5b4c8"];
const BAR_COLOR = "#4f7cac";
const LINE_COLOR = "#4f7cac";

// ── Tooltip ──────────────────────────────────────────────────────
function CustomTooltip({
    active, payload, label, currency, compact, theme,
}: {
    active?: boolean; payload?: { value: number }[]; label?: string;
    currency: string; compact: boolean;
    theme: { card: string; border: string; text: string; };
}) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: theme.card, border: `1px solid ${theme.border}`,
            borderRadius: 8, padding: "10px 14px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontSize: 12, fontFamily: "Inter, sans-serif",
        }}>
            <div style={{ fontWeight: 600, color: theme.text, marginBottom: 4 }}>{label}</div>
            <div style={{ color: "#4f7cac", fontWeight: 700, fontSize: 14 }}>
                {formatCurrency(payload[0].value, currency, compact)}
            </div>
        </div>
    );
}

// ── Pie label ─────────────────────────────────────────────────────
function makePieLabel(currency: string, axisColor: string) {
    return function PL({ cx, cy, midAngle, outerRadius, name, value }: {
        cx: number; cy: number; midAngle: number; outerRadius: number; name: string; value: number;
    }) {
        const r = outerRadius + 30;
        const rad = Math.PI / 180;
        const x = cx + r * Math.cos(-midAngle * rad);
        const y = cy + r * Math.sin(-midAngle * rad);
        const sym = { USD: "$", EUR: "€", GBP: "£", INR: "₹", JPY: "¥" }[currency] ?? "$";
        return (
            <text x={x} y={y} fill={axisColor} textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central" fontSize={11} fontFamily="Inter, sans-serif">
                {name}: {sym}{(value / 1000).toFixed(0)}k
            </text>
        );
    };
}

// ── Main ──────────────────────────────────────────────────────────
export default function SalesChart({ year, chartType, minSales }: Props) {
    const { theme } = useTheme();
    const [rawData, setRawData] = useState<SalesItem[]>([]);
    const [filteredData, setFilteredData] = useState<SalesItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currency, setCurrency] = useState(() => loadSettings().currency);
    const [compact, setCompact] = useState(() => loadSettings().compactNumbers);

    useEffect(() => {
        const onSettingsChange = () => { const s = loadSettings(); setCurrency(s.currency); setCompact(s.compactNumbers); };
        window.addEventListener("salesiq_settings_change", onSettingsChange);
        return () => window.removeEventListener("salesiq_settings_change", onSettingsChange);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/sales?year=${year}`)
            .then((r) => r.json())
            .then((data) => { setRawData(data); setIsLoading(false); })
            .catch(() => setIsLoading(false));
    }, [year]);

    useEffect(() => {
        setFilteredData(rawData.filter((item) => item.sales >= minSales));
    }, [rawData, minSales]);

    const axisStyle = { fontSize: 11, fill: theme.axisColor, fontFamily: "Inter, sans-serif" };
    const sym = { USD: "$", EUR: "€", GBP: "£", INR: "₹", JPY: "¥" }[currency] ?? "$";
    const yTickFmt = (v: number) => `${sym}${v / 1000}k`;

    const PieLabel = makePieLabel(currency, theme.axisColor);
    const pieTipFmt = (v: number | undefined): [string, string] =>
        [formatCurrency(v ?? 0, currency, compact), "Sales"];

    if (isLoading) return (
        <div style={{ height: 360, display: "flex", alignItems: "center", justifyContent: "center", color: theme.axisColor, fontSize: 13 }}>
            <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: 8, fontSize: 22, opacity: 0.3 }}>◐</div>
                Loading chart data…
            </div>
        </div>
    );

    if (filteredData.length === 0) return (
        <div style={{ height: 360, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: theme.axisColor, fontSize: 13, gap: 8 }}>
            <div style={{ fontSize: 28, opacity: 0.25 }}>🔍</div>
            <div>No data matches your current filters.</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Try lowering the minimum sales threshold.</div>
        </div>
    );

    const sharedProps = { fontFamily: "Inter, sans-serif" };

    return (
        <div style={{ width: "100%", height: 360 }}>
            <ResponsiveContainer width="100%" height="100%">
                {chartType === "Bar" ? (
                    <BarChart data={filteredData} margin={{ top: 8, right: 16, left: 8, bottom: 4 }} barCategoryGap="35%">
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.gridStroke} />
                        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={yTickFmt} tick={axisStyle} axisLine={false} tickLine={false} width={52} />
                        <Tooltip content={<CustomTooltip currency={currency} compact={compact} theme={theme} />} cursor={{ fill: "rgba(100,116,139,0.13)" }} />
                        <Bar dataKey="sales" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
                    </BarChart>
                ) : chartType === "Line" ? (
                    <LineChart data={filteredData} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.gridStroke} />
                        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={yTickFmt} tick={axisStyle} axisLine={false} tickLine={false} width={52} />
                        <Tooltip content={<CustomTooltip currency={currency} compact={compact} theme={theme} />} />
                        <Line type="monotone" dataKey="sales" stroke={LINE_COLOR} strokeWidth={2.5}
                            dot={{ fill: LINE_COLOR, r: 4, strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: LINE_COLOR, stroke: theme.card, strokeWidth: 2 }} />
                    </LineChart>
                ) : (
                    <PieChart>
                        <Tooltip formatter={pieTipFmt} contentStyle={{ borderRadius: 8, border: `1px solid ${theme.border}`, fontSize: 12, ...sharedProps, background: theme.isDark ? "#253348" : "#ffffff", color: theme.text }} />
                        <Legend formatter={(v) => <span style={{ fontSize: 11, color: theme.axisColor, fontFamily: "Inter, sans-serif" }}>{v}</span>} />
                        <Pie data={filteredData} dataKey="sales" nameKey="month"
                            outerRadius="65%" innerRadius="35%" paddingAngle={2}
                            labelLine={false} label={PieLabel as never}>
                            {filteredData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />)}
                        </Pie>
                    </PieChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
