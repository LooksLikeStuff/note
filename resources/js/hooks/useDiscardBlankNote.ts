import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import * as notesApi from '@/api/notes';
import * as tabsApi from '@/api/tabs';
import { isNoteBlank } from '@/lib/isNoteBlank';
import type { Note, Tab } from '@/types/note';

type Draft = {
    noteId: string;
    title: string;
    body: string;
};

type Params = {
    notes: Note[];
    selectedNoteId: string | null;
    activeTabId: string | null;
    setNotes: Dispatch<SetStateAction<Note[]>>;
    setTabs: Dispatch<SetStateAction<Tab[]>>;
};

export function useDiscardBlankNote({
    notes,
    selectedNoteId,
    activeTabId,
    setNotes,
    setTabs,
}: Params) {
    const draftRef = useRef<Draft | null>(null);
    const notesRef = useRef(notes);
    const selectedNoteIdRef = useRef(selectedNoteId);
    const activeTabIdRef = useRef(activeTabId);

    useEffect(() => {
        notesRef.current = notes;
    }, [notes]);

    useEffect(() => {
        selectedNoteIdRef.current = selectedNoteId;
    }, [selectedNoteId]);

    useEffect(() => {
        activeTabIdRef.current = activeTabId;
    }, [activeTabId]);

    const handleDraftChange = useCallback((draft: { title: string; body: string }) => {
        const noteId = selectedNoteIdRef.current;
        if (!noteId) {
            return;
        }

        draftRef.current = { noteId, title: draft.title, body: draft.body };
    }, []);

    const flushOrDiscardSelectedNote = useCallback(async () => {
        const noteId = selectedNoteIdRef.current;
        if (!noteId) {
            return;
        }

        const note = notesRef.current.find((item) => item.id === noteId);
        if (!note) {
            return;
        }

        const draft = draftRef.current?.noteId === noteId ? draftRef.current : null;
        const title = draft?.title ?? note.title ?? '';
        const body = draft?.body ?? note.body ?? '';

        if (isNoteBlank(title, body)) {
            await notesApi.deleteNote(noteId);
            setNotes((prev) => prev.filter((item) => item.id !== noteId));
            draftRef.current = null;

            if (activeTabIdRef.current) {
                const tabs = await tabsApi.fetchTabs();
                setTabs(tabs);
            }

            return;
        }

        const savedTitle = note.title ?? '';
        const savedBody = note.body ?? '';

        if (title !== savedTitle || body !== savedBody) {
            const updated = await notesApi.updateNote(noteId, { title, body });
            setNotes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            draftRef.current = { noteId, title, body };
        }
    }, [setNotes, setTabs]);

    return {
        handleDraftChange,
        flushOrDiscardSelectedNote,
    };
}
