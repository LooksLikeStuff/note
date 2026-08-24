import { useMemo } from 'react';
import { themeAt, themeIndexForTab } from '@/lib/themes';
import type { AppTheme } from '@/types/theme';
import type { Tab } from '@/types/note';

/**
 * Resolves the UI theme from the active tab’s position in the tab list.
 * Index maps 1:1 onto THEMES (cycles if more tabs than themes).
 */
export function useActiveTheme(tabs: Tab[], activeTabId: string | null): AppTheme {
    return useMemo(() => {
        const index = themeIndexForTab(tabs, activeTabId);
        return themeAt(index);
    }, [tabs, activeTabId]);
}
