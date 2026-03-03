"use client";

import { useState } from "react";
import { loadSettings, saveSettings, DEFAULT_SETTINGS, type DashboardSettings } from "@/lib/settingsStore";
import { useTheme } from "@/app/dashboard/DarkModeContext";

type SettingState = DashboardSettings;

function Label({ children, theme }: { children: React.ReactNode; theme: ReturnType<typeof useTheme>["theme"] }) {
    return (
        <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSub, letterSpacing: "0.05em", textTransform: "uppercase" as const, marginBottom: 6 }}>
            {children}
        </div>
    );
}

function Toggle({ checked, onChange, theme }: { checked: boolean; onChange: () => void; theme: ReturnType<typeof useTheme>["theme"] }) {
    return (
        <button role="switch" aria-checked={checked} onClick={onChange}
            style={{
                width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                background: checked ? "#4f7cac" : (theme.isDark ? "#30363d" : "#cbd5e1"),
                position: "relative", transition: "background 0.2s", flexShrink: 0, outline: "none",
            }}>
            <span style={{
                position: "absolute", top: 2, left: checked ? 22 : 2,
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }} />
        </button>
    );
}

function SectionTitle({ icon, title, sub, theme }: { icon: React.ReactNode; title: string; sub: string; theme: ReturnType<typeof useTheme>["theme"] }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: theme.isDark ? "rgba(79,124,172,0.2)" : "#e8f0f9", color: "#4f7cac", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, transition: "color 0.3s" }}>{title}</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>{sub}</div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const { theme } = useTheme();
    const [settings, setSettings] = useState<SettingState>(loadSettings);
    const [saved, setSaved] = useState(false);

    const update = <K extends keyof SettingState>(key: K, val: SettingState[K]) => {
        setSettings((prev) => ({ ...prev, [key]: val }));
        setSaved(false);
    };

    const handleSave = () => { saveSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 2500); };
    const handleReset = () => { saveSettings(DEFAULT_SETTINGS); setSettings(DEFAULT_SETTINGS); setSaved(false); };

    const cardStyle = {
        background: theme.card,
        borderRadius: 12,
        padding: 24,
        boxShadow: theme.isDark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.05)",
        border: `1px solid ${theme.border}`,
        transition: "background 0.3s, border-color 0.3s",
    };

    const selectStyle = {
        width: "100%", padding: "8px 32px 8px 12px", border: `1.5px solid ${theme.border}`,
        borderRadius: 8, background: theme.inputBg, color: theme.text,
        fontSize: 13, fontFamily: "inherit", outline: "none", appearance: "none" as const,
        transition: "background 0.3s",
    };

    return (
        <>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: theme.text, marginBottom: 4, transition: "color 0.3s" }}>Settings</h1>
                <p style={{ fontSize: 13, color: theme.textMuted }}>Customise your dashboard experience and default preferences.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>

                {/* ── Default Filters ── */}
                <div style={cardStyle}>
                    <SectionTitle theme={theme} title="Default Filters" sub="Applied on every dashboard load"
                        icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <Label theme={theme}>Default Year</Label>
                            <div style={{ position: "relative" }}>
                                <select style={selectStyle} value={settings.defaultYear} onChange={(e) => update("defaultYear", e.target.value)}>
                                    {["2022", "2023", "2024"].map((y) => <option key={y}>{y}</option>)}
                                </select>
                                <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: theme.textMuted }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                            </div>
                        </div>
                        <div>
                            <Label theme={theme}>Default Chart Type</Label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {(["Bar", "Line", "Pie"] as const).map((t) => (
                                    <button key={t} onClick={() => update("defaultChart", t)}
                                        style={{
                                            padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                                            cursor: "pointer", fontFamily: "inherit",
                                            border: `1.5px solid ${settings.defaultChart === t ? "#4f7cac" : theme.border}`,
                                            background: settings.defaultChart === t ? "#4f7cac" : (theme.isDark ? theme.inputBg : "#fff"),
                                            color: settings.defaultChart === t ? "#fff" : theme.textSub,
                                            transition: "all 0.15s",
                                        }}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label theme={theme}>Default Min Sales ($)</Label>
                            <input type="number" style={{ ...selectStyle, paddingRight: 12 }}
                                value={settings.defaultMinSales} min={0} step={1000}
                                onChange={(e) => update("defaultMinSales", Number(e.target.value))} />
                        </div>
                    </div>
                </div>

                {/* ── Display Preferences ── */}
                <div style={cardStyle}>
                    <SectionTitle theme={theme} title="Display Preferences" sub="Control how data is shown"
                        icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="12" cy="12" r="3" /></svg>}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        {([
                            { key: "showBadges" as const, label: "Show growth badges (+12%)", sub: "Displays trend indicators on stat cards" },
                            { key: "showGridLines" as const, label: "Show chart grid lines", sub: "Horizontal guide lines inside charts" },
                            { key: "animateCharts" as const, label: "Animate charts on load", sub: "Smooth entrance animation for chart bars" },
                            { key: "compactNumbers" as const, label: "Compact number format", sub: "Show ₹184k instead of ₹1,84,000" },
                        ]).map(({ key, label, sub }) => (
                            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: theme.text, transition: "color 0.3s" }}>{label}</div>
                                    <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{sub}</div>
                                </div>
                                <Toggle theme={theme} checked={settings[key] as boolean} onChange={() => update(key, !settings[key])} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Regional ── */}
                <div style={cardStyle}>
                    <SectionTitle theme={theme} title="Regional" sub="Currency and number format"
                        icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <Label theme={theme}>Currency</Label>
                            <div style={{ position: "relative" }}>
                                <select style={selectStyle} value={settings.currency} onChange={(e) => update("currency", e.target.value)}>
                                    {["USD", "EUR", "GBP", "INR", "JPY"].map((c) => <option key={c}>{c}</option>)}
                                </select>
                                <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: theme.textMuted }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                            </div>
                        </div>
                        <div>
                            <Label theme={theme}>Theme</Label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {(["light", "system"] as const).map((t) => (
                                    <button key={t} onClick={() => update("theme", t)}
                                        style={{
                                            padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize",
                                            border: `1.5px solid ${settings.theme === t ? "#4f7cac" : theme.border}`,
                                            background: settings.theme === t ? "#4f7cac" : (theme.isDark ? theme.inputBg : "#fff"),
                                            color: settings.theme === t ? "#fff" : theme.textSub,
                                            transition: "all 0.15s",
                                        }}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ background: theme.infoBg, borderRadius: 8, padding: "12px 14px", marginTop: 4 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#4f7cac", marginBottom: 4 }}>ℹ About these settings</div>
                            <div style={{ fontSize: 11, color: theme.textSub, lineHeight: 1.6 }}>
                                Settings are saved locally in your browser. Currency formatting applies across all dashboard numbers.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Save / Reset Bar ── */}
            <div style={{
                marginTop: 28, padding: "16px 20px",
                background: theme.card, borderRadius: 12, border: `1px solid ${theme.border}`,
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
                boxShadow: theme.isDark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.04)",
                transition: "background 0.3s",
            }}>
                <div style={{ fontSize: 13, color: theme.textSub }}>
                    {saved
                        ? <span style={{ color: "#059669", fontWeight: 600 }}>✓ Preferences saved successfully</span>
                        : "You have unsaved changes"}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={handleReset}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
                            borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                            border: `1.5px solid ${theme.border}`, background: theme.isDark ? theme.inputBg : "#fff",
                            color: theme.textSub, transition: "all 0.15s", fontFamily: "inherit",
                        }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.36" /></svg>
                        Reset to Defaults
                    </button>
                    <button onClick={handleSave}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px",
                            borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                            border: "none", fontFamily: "inherit", background: "#4f7cac", color: "#fff",
                            boxShadow: "0 2px 6px rgba(79,124,172,0.3)", transition: "background 0.15s",
                        }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        Save Preferences
                    </button>
                </div>
            </div>
        </>
    );
}
