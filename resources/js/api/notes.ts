import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Note, NoteKind } from '@/types/note';

export function fetchNotes(tabId: string, kind?: NoteKind): Promise<Note[]> {
    const query = kind ? `?kind=${kind}` : '';
    return apiGet<Note[]>(`/api/tabs/${tabId}/notes${query}`);
}

export function createNote(
    tabId: string,
    payload: { title?: string; body?: string; kind?: NoteKind } = {},
): Promise<Note> {
    return apiPost<Note>(`/api/tabs/${tabId}/notes`, payload);
}

export function updateNote(
    id: string,
    payload: { title?: string | null; body?: string | null; kind?: NoteKind },
): Promise<Note> {
    return apiPatch<Note>(`/api/notes/${id}`, payload);
}

export function deleteNote(id: string): Promise<void> {
    return apiDelete(`/api/notes/${id}`);
}
