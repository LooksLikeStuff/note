import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import * as notesApi from '@/api/notes';
import * as tabsApi from '@/api/tabs';
import ConfirmModal from '@/Components/ConfirmModal';
import ContextMenu from '@/Components/ContextMenu';
import FullscreenToggle from '@/Components/FullscreenToggle';
import NoteEditModal from '@/Components/NoteEditModal';
import NoteEditor from '@/Components/NoteEditor';
import NoteList from '@/Components/NoteList';
import TabBar from '@/Components/TabBar';
import { useActiveTheme } from '@/hooks/useActiveTheme';
import { useDiscardBlankNote } from '@/hooks/useDiscardBlankNote';
import { useFullscreen } from '@/hooks/useFullscreen';
import { isNoteBlank } from '@/lib/isNoteBlank';
import type { KindFilter, Note, NoteKind, Tab } from '@/types/note';

const ACTIVE_TAB_KEY = 'note.activeTabId';

type NoteMenuState = {
    noteId: string;
    x: number;
    y: number;
};

export default function Index() {
    const shellRef = useRef<HTMLDivElement>(null);
    const { isFullscreen, toggle } = useFullscreen(shellRef);

    useEffect(() => {
        document.title = 'Заметки · Note';
    }, []);

    const [tabs, setTabs] = useState<Tab[]>([]);
    const [activeTabId, setActiveTabId] = useState<string | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [filter, setFilter] = useState<KindFilter>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [noteMenu, setNoteMenu] = useState<NoteMenuState | null>(null);
    const [editNoteId, setEditNoteId] = useState<string | null>(null);
    const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

    const theme = useActiveTheme(tabs, activeTabId);
    const { handleDraftChange, flushOrDiscardSelectedNote } = useDiscardBlankNote({
        notes,
        selectedNoteId,
        activeTabId,
        setNotes,
        setTabs,
    });

    const selectedNote = useMemo(
        () => notes.find((note) => note.id === selectedNoteId) ?? null,
        [notes, selectedNoteId],
    );

    const editNote = useMemo(
        () => notes.find((note) => note.id === editNoteId) ?? null,
        [notes, editNoteId],
    );

    const deleteNote = useMemo(
        () => notes.find((note) => note.id === deleteNoteId) ?? null,
        [notes, deleteNoteId],
    );

    const persistActiveTab = (id: string | null) => {
        setActiveTabId(id);
        if (id) {
            localStorage.setItem(ACTIVE_TAB_KEY, id);
        } else {
            localStorage.removeItem(ACTIVE_TAB_KEY);
        }
    };

    const loadTabs = useCallback(async (preferredId?: string | null) => {
        const list = await tabsApi.fetchTabs();
        setTabs(list);

        const stored = preferredId ?? localStorage.getItem(ACTIVE_TAB_KEY);
        const nextId =
            (stored && list.some((tab) => tab.id === stored) && stored) ||
            list[0]?.id ||
            null;

        persistActiveTab(nextId);
        return nextId;
    }, []);

    const loadNotes = useCallback(async (tabId: string, kindFilter: KindFilter) => {
        const kind = kindFilter === 'all' ? undefined : kindFilter;
        const list = await notesApi.fetchNotes(tabId, kind);
        setNotes(list);
        setSelectedNoteId((current) =>
            current && list.some((note) => note.id === current)
                ? current
                : (list[0]?.id ?? null),
        );
    }, []);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                const tabId = await loadTabs();
                if (!cancelled && tabId) {
                    await loadNotes(tabId, 'all');
                }
            } catch {
                if (!cancelled) {
                    setError('Не удалось загрузить данные');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [loadNotes, loadTabs]);

    useEffect(() => {
        if (!activeTabId) {
            setNotes([]);
            setSelectedNoteId(null);
            return;
        }

        loadNotes(activeTabId, filter).catch(() => {
            setError('Не удалось загрузить заметки');
        });
    }, [activeTabId, filter, loadNotes]);

    const handleSelectTab = async (id: string) => {
        if (id === activeTabId) {
            return;
        }

        await flushOrDiscardSelectedNote();
        persistActiveTab(id);
    };

    const handleSelectNote = async (id: string) => {
        if (id === selectedNoteId) {
            return;
        }

        await flushOrDiscardSelectedNote();
        setSelectedNoteId(id);
    };

    const handleFilterChange = async (next: KindFilter) => {
        if (next === filter) {
            return;
        }

        await flushOrDiscardSelectedNote();
        setSelectedNoteId(null);
        setFilter(next);
    };

    const handleCreateTab = async () => {
        await flushOrDiscardSelectedNote();
        const tab = await tabsApi.createTab();
        const list = await loadTabs(tab.id);
        if (list) {
            setFilter('all');
            setSelectedNoteId(null);
        }
    };

    const handleRenameTab = async (id: string, title: string) => {
        const updated = await tabsApi.updateTab(id, { title });
        setTabs((prev) => prev.map((tab) => (tab.id === id ? updated : tab)));
    };

    const handleCloseTab = async (id: string) => {
        const tab = tabs.find((item) => item.id === id);
        if (tab && (tab.notes_count ?? 0) > 0) {
            const confirmed = window.confirm(
                `Удалить вкладку «${tab.title}» вместе с заметками?`,
            );
            if (!confirmed) {
                return;
            }
        }

        if (id === activeTabId) {
            await flushOrDiscardSelectedNote();
        }

        await tabsApi.deleteTab(id);
        const remaining = tabs.filter((item) => item.id !== id);
        setTabs(remaining);

        if (activeTabId === id) {
            const next = remaining[0]?.id ?? null;
            persistActiveTab(next);
        }
    };

    const handleReorderTabs = async (ids: string[]) => {
        const previous = tabs;
        const byId = new Map(tabs.map((tab) => [tab.id, tab]));
        const optimistic = ids
            .map((id, index) => {
                const tab = byId.get(id);
                return tab ? { ...tab, position: index } : null;
            })
            .filter((tab): tab is Tab => tab !== null);

        setTabs(optimistic);

        try {
            const list = await tabsApi.reorderTabs(ids);
            setTabs(list);
        } catch {
            setTabs(previous);
            setError('Не удалось изменить порядок вкладок');
        }
    };

    const handleCreateNote = async () => {
        if (!activeTabId) {
            return;
        }

        await flushOrDiscardSelectedNote();

        const note = await notesApi.createNote(activeTabId, {
            title: '',
            body: '',
            kind: 'regular',
        });

        setFilter('all');
        await loadTabs(activeTabId);
        await loadNotes(activeTabId, 'all');
        setSelectedNoteId(note.id);
    };

    const handleUpdateNote = async (
        noteId: string,
        payload: {
            title?: string | null;
            body?: string | null;
            kind?: NoteKind;
        },
    ) => {
        const updated = await notesApi.updateNote(noteId, payload);
        setNotes((prev) =>
            prev
                .map((note) => (note.id === updated.id ? updated : note))
                .filter((note) => filter === 'all' || note.kind === filter)
                .sort((a, b) => {
                    const aTime = a.updated_at ? Date.parse(a.updated_at) : 0;
                    const bTime = b.updated_at ? Date.parse(b.updated_at) : 0;
                    return bTime - aTime;
                }),
        );

        if (activeTabId) {
            await loadTabs(activeTabId);
        }

        if (payload.kind && filter !== 'all' && payload.kind !== filter) {
            setSelectedNoteId((current) => (current === noteId ? null : current));
        }
    };

    const handleDeleteNote = async (note: Note) => {
        if (!activeTabId) {
            return;
        }

        await notesApi.deleteNote(note.id);
        await loadTabs(activeTabId);
        await loadNotes(activeTabId, filter);
    };

    return (
        <div
            ref={shellRef}
            className="note-shell relative flex flex-col overflow-hidden"
            data-theme={theme.id}
            style={theme.vars as CSSProperties}
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <div className="note-orb note-orb--1" />
                <div className="note-orb note-orb--2" />
                <div className="note-orb note-orb--3" />
            </div>

            <div className="relative z-10 flex min-h-0 flex-1 flex-col px-2 pt-2 pb-3 md:px-4 md:pb-4">
                <TabBar
                    tabs={tabs}
                    activeTabId={activeTabId}
                    onSelect={(id) => {
                        handleSelectTab(id).catch(() =>
                            setError('Не удалось переключить вкладку'),
                        );
                    }}
                    onCreate={() => {
                        handleCreateTab().catch(() => setError('Не удалось создать вкладку'));
                    }}
                    onRename={(id, title) => {
                        handleRenameTab(id, title).catch(() =>
                            setError('Не удалось переименовать вкладку'),
                        );
                    }}
                    onClose={(id) => {
                        handleCloseTab(id).catch(() => setError('Не удалось удалить вкладку'));
                    }}
                    onReorder={(ids) => {
                        void handleReorderTabs(ids);
                    }}
                    trailing={
                        <FullscreenToggle isFullscreen={isFullscreen} onToggle={toggle} />
                    }
                />

                <div className="note-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl md:flex-row">
                    {loading ? (
                        <div className="flex flex-1 items-center justify-center">
                            <p
                                className="animate-in text-base font-medium"
                                style={{ color: 'var(--theme-muted)' }}
                            >
                                Загрузка…
                            </p>
                        </div>
                    ) : !activeTabId ? (
                        <div className="animate-in flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                            <p className="text-lg font-medium" style={{ color: 'var(--theme-ink)' }}>
                                Нет вкладок
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    handleCreateTab().catch(() =>
                                        setError('Не удалось создать вкладку'),
                                    );
                                }}
                                className="note-btn-bubble px-5 py-2.5 text-base shadow-md"
                                style={{
                                    background: 'var(--theme-btn)',
                                    color: 'var(--theme-btn-text)',
                                    boxShadow: '0 8px 20px var(--theme-shadow)',
                                }}
                            >
                                Создать
                            </button>
                        </div>
                    ) : (
                        <>
                            <NoteList
                                notes={notes}
                                selectedId={selectedNoteId}
                                filter={filter}
                                onFilterChange={(next) => {
                                    handleFilterChange(next).catch(() =>
                                        setError('Не удалось сменить фильтр'),
                                    );
                                }}
                                onSelect={(id) => {
                                    handleSelectNote(id).catch(() =>
                                        setError('Не удалось открыть заметку'),
                                    );
                                }}
                                onCreate={() => {
                                    handleCreateNote().catch(() =>
                                        setError('Не удалось создать заметку'),
                                    );
                                }}
                                onContextMenu={(note, position) => {
                                    setNoteMenu({
                                        noteId: note.id,
                                        x: position.x,
                                        y: position.y,
                                    });
                                }}
                            />
                            <NoteEditor
                                note={selectedNote}
                                onDraftChange={handleDraftChange}
                                onChange={(payload) => {
                                    if (!selectedNote) {
                                        return;
                                    }
                                    handleUpdateNote(selectedNote.id, payload).catch(() =>
                                        setError('Не удалось сохранить заметку'),
                                    );
                                }}
                            />
                        </>
                    )}
                </div>
            </div>

            {noteMenu && (
                <ContextMenu
                    x={noteMenu.x}
                    y={noteMenu.y}
                    onClose={() => setNoteMenu(null)}
                    items={[
                        {
                            id: 'edit',
                            label: 'Редактировать',
                            onSelect: () => setEditNoteId(noteMenu.noteId),
                        },
                        {
                            id: 'delete',
                            label: 'Удалить',
                            danger: true,
                            onSelect: () => setDeleteNoteId(noteMenu.noteId),
                        },
                    ]}
                />
            )}

            <NoteEditModal
                note={editNote}
                open={editNoteId !== null}
                onClose={() => setEditNoteId(null)}
                onSave={(kind) => {
                    if (!editNoteId) {
                        return;
                    }
                    const id = editNoteId;
                    setEditNoteId(null);
                    handleUpdateNote(id, { kind }).catch(() =>
                        setError('Не удалось сохранить заметку'),
                    );
                }}
            />

            <ConfirmModal
                open={deleteNoteId !== null && deleteNote !== null}
                title="Удалить заметку"
                message={
                    deleteNote?.kind === 'trash' ||
                    isNoteBlank(deleteNote?.title, deleteNote?.body)
                        ? 'Удалить заметку окончательно?'
                        : 'Переместить заметку в корзину?'
                }
                confirmLabel="Удалить"
                danger
                onClose={() => setDeleteNoteId(null)}
                onConfirm={() => {
                    if (!deleteNote) {
                        return;
                    }
                    const note = deleteNote;
                    setDeleteNoteId(null);
                    handleDeleteNote(note).catch(() =>
                        setError('Не удалось удалить заметку'),
                    );
                }}
            />

            {error && (
                <div className="note-toast fixed right-4 bottom-4 z-50 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-3 text-base font-semibold text-white">
                    <div className="flex items-center gap-3">
                        <span>{error}</span>
                        <button
                            type="button"
                            className="rounded-full bg-white/20 px-2.5 py-1 text-sm font-bold transition hover:bg-white/30"
                            onClick={() => setError(null)}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
