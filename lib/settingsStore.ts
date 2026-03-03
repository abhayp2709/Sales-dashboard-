// lib/settingsStore.ts
// Shared settings persisted to localStorage

export interface DashboardSettings {
    defaultYear: string;
    defaultChart: "Bar" | "Line" | "Pie";
    defaultMinSales: number;
    theme: "light" | "system";
    showBadges: boolean;
    showGridLines: boolean;
    animateCharts: boolean;
    currency: string;
    compactNumbers: boolean;
}

export const DEFAULT_SETTINGS: DashboardSettings = {
    defaultYear: "2024",
    defaultChart: "Bar",
    defaultMinSales: 0,
    theme: "light",
    showBadges: true,
    showGridLines: true,
    animateCharts: true,
    currency: "USD",
    compactNumbers: true,
};

const KEY = "salesiq_settings";

export function loadSettings(): DashboardSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return DEFAULT_SETTINGS;
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export function saveSettings(s: DashboardSettings): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(s));
    // Emit a custom event so other mounted components re-read settings
    window.dispatchEvent(new Event("salesiq_settings_change"));
}

// ── Currency helpers ──────────────────────────────────────────────

const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    JPY: "¥",
};

const CURRENCY_LOCALES: Record<string, string> = {
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    INR: "en-IN",
    JPY: "ja-JP",
};

export function formatCurrency(
    amount: number,
    currency: string,
    compact = true
): string {
    const sym = CURRENCY_SYMBOLS[currency] ?? "$";
    const locale = CURRENCY_LOCALES[currency] ?? "en-US";

    if (compact && Math.abs(amount) >= 1000) {
        // e.g. ₹184.0k
        return `${sym}${(amount / 1000).toFixed(1)}k`;
    }

    // Full number with locale formatting  e.g. ₹1,84,000
    return `${sym}${amount.toLocaleString(locale)}`;
}
