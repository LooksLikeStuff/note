import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Tab } from '@/types/note';

export function fetchTabs(): Promise<Tab[]> {
    return apiGet<Tab[]>('/api/tabs');
}

export function createTab(title?: string): Promise<Tab> {
    return apiPost<Tab>('/api/tabs', title ? { title } : {});
}

export function updateTab(
    id: string,
    payload: { title?: string; position?: number },
): Promise<Tab> {
    return apiPatch<Tab>(`/api/tabs/${id}`, payload);
}

export function deleteTab(id: string): Promise<void> {
    return apiDelete(`/api/tabs/${id}`);
}

export function reorderTabs(ids: string[]): Promise<Tab[]> {
    return apiPatch<Tab[]>('/api/tabs/reorder', { ids });
}
