"use client";
import { createContext, useContext } from "react";

export interface Theme {
    isDark: boolean;
    bg: string;
    card: string;
    cardHover: string;
    border: string;
    text: string;
    textSub: string;
    textMuted: string;
    inputBg: string;
    tableAlt: string;
    tableHover: string;
    infoBg: string;
    sidebarBg: string;
    headerBg: string;
    gridStroke: string;
    axisColor: string;
}

export const LIGHT: Theme = {
    isDark: false,
    bg: "#f0f4f8",
    card: "#ffffff",
    cardHover: "#f8fafc",
    border: "#e2e8f0",
    text: "#1a2332",
    textSub: "#64748b",
    textMuted: "#94a3b8",
    inputBg: "#ffffff",
    tableAlt: "#fafbfc",
    tableHover: "#f0f4f8",
    infoBg: "#f0f4f8",
    sidebarBg: "#1e2a3a",
    headerBg: "#ffffff",
    gridStroke: "#f1f5f9",
    axisColor: "#94a3b8",
};

export const DARK: Theme = {
    isDark: true,
    bg: "#0d1117",
    card: "#161b22",
    cardHover: "#1c2331",
    border: "#30363d",
    text: "#e6edf3",
    textSub: "#8b949e",
    textMuted: "#6e7681",
    inputBg: "#1c2331",
    tableAlt: "#1c2331",
    tableHover: "#21262d",
    infoBg: "#1c2331",
    sidebarBg: "#090d13",
    headerBg: "#13181f",
    gridStroke: "#21262d",
    axisColor: "#6e7681",
};

export const DarkModeContext = createContext<{
    theme: Theme;
    toggle: () => void;
}>({ theme: LIGHT, toggle: () => { } });

export const useTheme = () => useContext(DarkModeContext);
