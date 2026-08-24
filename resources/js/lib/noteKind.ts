import type { NoteKind } from '@/types/note';

export const NOTE_KINDS: NoteKind[] = ['regular', 'important', 'trash'];

export const NOTE_KIND_LABELS: Record<NoteKind, string> = {
    regular: 'Мусор',
    important: 'Важно',
    trash: 'Корзина',
};
