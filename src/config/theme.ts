// Theme definitions with RGB triplet values for flexible alpha transparency: rgb(var(--primary-rgb) / 0.15)
export interface ThemeConfig {
    name: string;
    primaryRgb: string;       // e.g. "99 102 241"
    accentRgb: string;        // e.g. "34 211 238"
    secondaryRgb: string;     // e.g. "168 85 247"
    bgRgb: string;            // e.g. "2 6 23"
    surfaceRgb: string;       // e.g. "15 23 42"
    surfaceHoverRgb: string;  // e.g. "30 41 59"
    borderRgb: string;        // e.g. "148 163 184"
    textRgb: string;          // e.g. "248 250 252"
    textMutedRgb: string;     // e.g. "148 163 184"
    gradientText: string;     // CSS gradient
    heroGlow1: string;        // Primary aura
    heroGlow2: string;        // Secondary aura
}

export type ThemePreset = 'midnight' | 'emerald' | 'cyberpunk' | 'violet' | 'ocean';

export const THEMES: Record<ThemePreset, ThemeConfig> = {
    midnight: {
        name: 'Midnight Indigo',
        primaryRgb: '99 102 241',       // #6366f1
        accentRgb: '34 211 238',        // #22d3ee
        secondaryRgb: '168 85 247',     // #a855f7
        bgRgb: '2 6 23',                // #020617
        surfaceRgb: '15 23 42',         // #0f172a
        surfaceHoverRgb: '30 41 59',    // #1e293b
        borderRgb: '148 163 184',
        textRgb: '248 250 252',
        textMutedRgb: '148 163 184',
        gradientText: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #22d3ee 100%)',
        heroGlow1: 'rgba(99, 102, 241, 0.22)',
        heroGlow2: 'rgba(34, 211, 238, 0.18)',
    },
    emerald: {
        name: 'Emerald Tech',
        primaryRgb: '16 185 129',       // #10b981
        accentRgb: '52 211 153',        // #34d399
        secondaryRgb: '6 182 212',      // #06b6d4
        bgRgb: '3 20 16',
        surfaceRgb: '6 38 29',
        surfaceHoverRgb: '15 62 48',
        borderRgb: '52 211 153',
        textRgb: '240 253 244',
        textMutedRgb: '110 231 183',
        gradientText: 'linear-gradient(135deg, #ffffff 0%, #6ee7b7 50%, #34d399 100%)',
        heroGlow1: 'rgba(16, 185, 129, 0.25)',
        heroGlow2: 'rgba(6, 182, 212, 0.18)',
    },
    cyberpunk: {
        name: 'Cyber Gold',
        primaryRgb: '245 158 11',       // #f59e0b
        accentRgb: '234 179 8',         // #eab308
        secondaryRgb: '236 72 153',     // #ec4899
        bgRgb: '15 10 5',
        surfaceRgb: '34 20 8',
        surfaceHoverRgb: '58 35 15',
        borderRgb: '245 158 11',
        textRgb: '254 252 232',
        textMutedRgb: '217 119 6',
        gradientText: 'linear-gradient(135deg, #ffffff 0%, #fde047 50%, #f59e0b 100%)',
        heroGlow1: 'rgba(245, 158, 11, 0.22)',
        heroGlow2: 'rgba(236, 72, 153, 0.16)',
    },
    violet: {
        name: 'Royal Violet',
        primaryRgb: '139 92 246',       // #8b5cf6
        accentRgb: '236 72 153',        // #ec4899
        secondaryRgb: '99 102 241',     // #6366f1
        bgRgb: '10 5 22',
        surfaceRgb: '24 13 46',
        surfaceHoverRgb: '45 25 80',
        borderRgb: '167 139 250',
        textRgb: '250 245 255',
        textMutedRgb: '192 132 252',
        gradientText: 'linear-gradient(135deg, #ffffff 0%, #d8b4fe 50%, #ec4899 100%)',
        heroGlow1: 'rgba(139, 92, 246, 0.25)',
        heroGlow2: 'rgba(236, 72, 153, 0.18)',
    },
    ocean: {
        name: 'Deep Ocean',
        primaryRgb: '14 165 233',       // #0ea5e9
        accentRgb: '56 189 248',        // #38bdf8
        secondaryRgb: '59 130 246',     // #3b82f6
        bgRgb: '2 12 27',
        surfaceRgb: '7 26 53',
        surfaceHoverRgb: '13 46 89',
        borderRgb: '56 189 248',
        textRgb: '240 249 255',
        textMutedRgb: '125 211 252',
        gradientText: 'linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #38bdf8 100%)',
        heroGlow1: 'rgba(14, 165, 233, 0.24)',
        heroGlow2: 'rgba(59, 130, 246, 0.18)',
    },
};

export const DEFAULT_THEME: ThemePreset = 'midnight';

/**
 * Apply theme CSS variables directly to the root element.
 * Enables instant one-line brand theming across the entire application.
 */
export function applyTheme(themeKey: ThemePreset = DEFAULT_THEME) {
    const config = THEMES[themeKey] || THEMES.midnight;
    const root = document.documentElement;

    root.style.setProperty('--primary-rgb', config.primaryRgb);
    root.style.setProperty('--accent-rgb', config.accentRgb);
    root.style.setProperty('--secondary-rgb', config.secondaryRgb);
    root.style.setProperty('--bg-rgb', config.bgRgb);
    root.style.setProperty('--surface-rgb', config.surfaceRgb);
    root.style.setProperty('--surface-hover-rgb', config.surfaceHoverRgb);
    root.style.setProperty('--border-rgb', config.borderRgb);
    root.style.setProperty('--text-rgb', config.textRgb);
    root.style.setProperty('--text-muted-rgb', config.textMutedRgb);
    root.style.setProperty('--gradient-text', config.gradientText);
    root.style.setProperty('--hero-glow-1', config.heroGlow1);
    root.style.setProperty('--hero-glow-2', config.heroGlow2);

    root.setAttribute('data-theme', themeKey);
}
