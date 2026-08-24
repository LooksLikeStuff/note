export type NoteKind = 'regular' | 'important' | 'trash';

export type Tab = {
    id: string;
    title: string;
    position: number;
    last_note_at: string | null;
    notes_count?: number;
    created_at: string | null;
    updated_at: string | null;
};

export type Note = {
    id: string;
    tab_id: string;
    title: string | null;
    body: string | null;
    kind: NoteKind;
    created_at: string | null;
    updated_at: string | null;
};

export type KindFilter = 'all' | NoteKind;
