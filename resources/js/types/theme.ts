/** Stable theme ids — one per saturated accent from the tab palette. */
export type ThemeId =
    | 'yellow'
    | 'violet'
    | 'green'
    | 'orange'
    | 'sky'
    | 'pink'
    | 'lime'
    | 'fuchsia'
    | 'cyan'
    | 'red';

/** Tab chip styles (Tailwind utilities) for that theme’s accent. */
export type ThemeTabChip = {
    bg: string;
    bgActive: string;
    text: string;
    textActive: string;
    shadow: string;
    closeHover: string;
};

/**
 * Runtime CSS custom properties applied on the shell when the theme is active.
 * Components consume these via var(--theme-*) — no hard-coded accent colors.
 */
export type ThemeCssVars = {
    '--theme-primary': string;
    '--theme-primary-soft': string;
    '--theme-accent': string;
    '--theme-ink': string;
    '--theme-muted': string;
    '--theme-border': string;
    '--theme-panel': string;
    '--theme-sidebar': string;
    '--theme-editor': string;
    '--theme-card': string;
    '--theme-card-hover': string;
    '--theme-card-active': string;
    '--theme-card-active-text': string;
    '--theme-btn': string;
    '--theme-btn-text': string;
    '--theme-chip': string;
    '--theme-chip-text': string;
    '--theme-chip-active': string;
    '--theme-chip-active-text': string;
    '--theme-shadow': string;
    '--theme-shell-from': string;
    '--theme-shell-via': string;
    '--theme-shell-to': string;
    '--theme-orb-1': string;
    '--theme-orb-2': string;
    '--theme-orb-3': string;
    '--theme-overlay': string;
    '--theme-modal': string;
    '--theme-menu': string;
    '--theme-menu-hover': string;
    '--theme-danger': string;
    '--theme-danger-text': string;
    '--theme-danger-soft': string;
};

export type AppTheme = {
    id: ThemeId;
    name: string;
    tab: ThemeTabChip;
    vars: ThemeCssVars;
};
