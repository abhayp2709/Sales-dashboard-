"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DarkModeContext, LIGHT, DARK } from "./DarkModeContext";

const navItems = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        href: "/dashboard/reports",
        label: "Reports",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
    },
    {
        href: "/dashboard/settings",
        label: "Settings",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
            </svg>
        ),
    },
];

// Sun icon
const SunIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

// Moon icon
const MoonIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const theme = isDark ? DARK : LIGHT;

    // Persist dark mode preference
    useEffect(() => {
        const saved = localStorage.getItem("salesiq_dark_mode");
        if (saved === "true") setIsDark(true);
    }, []);

    const toggleDark = () => {
        setIsDark((prev) => {
            localStorage.setItem("salesiq_dark_mode", String(!prev));
            return !prev;
        });
    };

    const pageTitle = navItems.find((n) => n.href === pathname)?.label ?? "Dashboard";

    // Edge lighting colors  
    const edgeColor = isDark ? "rgba(99,160,220,1)" : "rgba(79,124,172,0.9)";
    const glowColor = isDark ? "rgba(99,160,220,0.5)" : "rgba(79,124,172,0.35)";
    const cornerColor = isDark ? "rgba(99,160,220,0.28)" : "rgba(79,124,172,0.18)";

    return (
        <DarkModeContext.Provider value={{ theme, toggle: toggleDark }}>
            {/* ── Edge Lighting ── fixed frame around entire viewport ── */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
                {/* Top edge strip */}
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(to right, transparent 0%, ${edgeColor} 20%, ${edgeColor} 80%, transparent 100%)`,
                    boxShadow: `0 0 14px 3px ${glowColor}, 0 0 30px 6px ${cornerColor}`,
                }} />
                {/* Bottom edge strip */}
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(to right, transparent 0%, ${edgeColor} 20%, ${edgeColor} 80%, transparent 100%)`,
                    boxShadow: `0 0 14px 3px ${glowColor}, 0 0 30px 6px ${cornerColor}`,
                }} />
                {/* Left edge strip */}
                <div style={{
                    position: "absolute", top: 0, bottom: 0, left: 0, width: 3,
                    background: `linear-gradient(to bottom, transparent 0%, ${edgeColor} 20%, ${edgeColor} 80%, transparent 100%)`,
                    boxShadow: `0 0 14px 3px ${glowColor}, 0 0 30px 6px ${cornerColor}`,
                }} />
                {/* Right edge strip */}
                <div style={{
                    position: "absolute", top: 0, bottom: 0, right: 0, width: 3,
                    background: `linear-gradient(to bottom, transparent 0%, ${edgeColor} 20%, ${edgeColor} 80%, transparent 100%)`,
                    boxShadow: `0 0 14px 3px ${glowColor}, 0 0 30px 6px ${cornerColor}`,
                }} />
                {/* Corner glows */}
                <div style={{ position: "absolute", top: 0, left: 0, width: 220, height: 220, background: `radial-gradient(ellipse at top left, ${cornerColor} 0%, transparent 70%)` }} />
                <div style={{ position: "absolute", top: 0, right: 0, width: 220, height: 220, background: `radial-gradient(ellipse at top right, ${cornerColor} 0%, transparent 70%)` }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: 220, height: 220, background: `radial-gradient(ellipse at bottom left, ${cornerColor} 0%, transparent 70%)` }} />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 220, height: 220, background: `radial-gradient(ellipse at bottom right, ${cornerColor} 0%, transparent 70%)` }} />
            </div>

            <div style={{ display: "flex", minHeight: "100vh", background: theme.bg, transition: "background 0.3s" }}>

                {/* ── Sidebar ── */}
                {sidebarOpen && (
                    <aside style={{
                        width: 220,
                        background: theme.sidebarBg,
                        display: "flex",
                        flexDirection: "column",
                        flexShrink: 0,
                        position: "sticky",
                        top: 0,
                        height: "100vh",
                        zIndex: 50,
                        transition: "background 0.3s",
                        borderRight: isDark ? "1px solid rgba(99,160,220,0.12)" : "none",
                        boxShadow: isDark ? "2px 0 20px rgba(0,0,0,0.4)" : "none",
                    }}>
                        {/* Logo */}
                        <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.07)"}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                    width: 34, height: 34, borderRadius: 8,
                                    background: "rgba(79,124,172,0.35)",
                                    border: "1px solid rgba(79,124,172,0.4)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                </div>
                                <div>
                                    <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>SalesIQ</div>
                                    <div style={{ color: "#64748b", fontSize: 11 }}>Analytics</div>
                                </div>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav style={{ padding: "16px 12px", flex: 1 }}>
                            <div style={{ color: "#475569", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 8, padding: "0 4px" }}>MAIN</div>
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="nav-item"
                                        style={{
                                            background: isActive ? "rgba(79,124,172,0.25)" : "transparent",
                                            color: isActive ? "#93c5fd" : "#94a3b8",
                                        }}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User */}
                        <div style={{ padding: "16px 20px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.07)"}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: "50%",
                                    background: "rgba(79,124,172,0.3)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#93c5fd", fontSize: 14, fontWeight: 600,
                                }}>A</div>
                                <div>
                                    <div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600 }}>Admin</div>
                                    <div style={{ color: "#64748b", fontSize: 11 }}>Sales Manager</div>
                                </div>
                            </div>
                        </div>
                    </aside>
                )}

                {/* ── Main Content ── */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

                    {/* Top bar */}
                    <header style={{
                        background: theme.headerBg,
                        borderBottom: `1px solid ${theme.border}`,
                        padding: "0 24px",
                        height: 60,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        position: "sticky",
                        top: 0,
                        zIndex: 30,
                        boxShadow: isDark ? "0 1px 0 rgba(99,160,220,0.1), 0 2px 8px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.04)",
                        transition: "background 0.3s, border-color 0.3s",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            {/* Hamburger */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                                style={{
                                    border: "none", background: "none", cursor: "pointer",
                                    padding: "6px 8px", borderRadius: 6,
                                    color: sidebarOpen ? "#4f7cac" : theme.textSub,
                                    display: "flex", alignItems: "center",
                                    transition: "color 0.15s",
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            </button>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, lineHeight: 1.2, transition: "color 0.3s" }}>
                                    Sales Dashboard
                                </div>
                                <div style={{ fontSize: 11, color: theme.textMuted }}>{pageTitle}</div>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {/* Live badge */}
                            <span style={{ padding: "4px 10px", background: "#ecfdf5", color: "#059669", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                                ● Live
                            </span>

                            {/* Dark / Light Mode Toggle */}
                            <button
                                onClick={toggleDark}
                                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "6px 12px",
                                    borderRadius: 20,
                                    border: `1.5px solid ${theme.border}`,
                                    background: isDark ? "#1c2331" : "#f8fafc",
                                    color: isDark ? "#93c5fd" : "#64748b",
                                    cursor: "pointer",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    fontFamily: "inherit",
                                    transition: "all 0.2s",
                                }}
                            >
                                {isDark ? <SunIcon /> : <MoonIcon />}
                                {isDark ? "Light" : "Dark"}
                            </button>

                            {/* Avatar */}
                            <div style={{
                                width: 32, height: 32, borderRadius: "50%",
                                background: isDark ? "rgba(79,124,172,0.25)" : "#e8f0f9",
                                color: "#4f7cac",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 13, fontWeight: 700, cursor: "pointer",
                                border: isDark ? "1px solid rgba(79,124,172,0.3)" : "none",
                            }}>A</div>
                        </div>
                    </header>

                    {/* Page content */}
                    <main style={{ flex: 1, padding: "24px", transition: "background 0.3s" }} className="animate-fade-up">
                        {children}
                    </main>
                </div>
            </div>
        </DarkModeContext.Provider>
    );
}
