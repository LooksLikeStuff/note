import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as notesApi from '@/api/notes';
import * as tabsApi from '@/api/tabs';
import FullscreenToggle from '@/Components/FullscreenToggle';
import NoteEditor from '@/Components/NoteEditor';
import NoteList from '@/Components/NoteList';
import TabBar from '@/Components/TabBar';
import { useFullscreen } from '@/hooks/useFullscreen';
import type { KindFilter, Note, NoteKind, Tab } from '@/types/note';

const ACTIVE_TAB_KEY = 'note.activeTabId';

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

    const selectedNote = useMemo(
        () => notes.find((note) => note.id === selectedNoteId) ?? null,
        [notes, selectedNoteId],
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

    const handleCreateTab = async () => {
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

        await tabsApi.deleteTab(id);
        const remaining = tabs.filter((item) => item.id !== id);
        setTabs(remaining);

        if (activeTabId === id) {
            const next = remaining[0]?.id ?? null;
            persistActiveTab(next);
        }
    };

    const handleCreateNote = async () => {
        if (!activeTabId) {
            return;
        }

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

    const handleUpdateNote = async (payload: {
        title?: string | null;
        body?: string | null;
        kind?: NoteKind;
    }) => {
        if (!selectedNote) {
            return;
        }

        const updated = await notesApi.updateNote(selectedNote.id, payload);
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
            setSelectedNoteId(null);
        }
    };

    const handleDeleteNote = async () => {
        if (!selectedNote || !activeTabId) {
            return;
        }

        const message =
            selectedNote.kind === 'trash'
                ? 'Удалить заметку окончательно?'
                : 'Переместить заметку в корзину?';

        if (!window.confirm(message)) {
            return;
        }

        await notesApi.deleteNote(selectedNote.id);
        await loadTabs(activeTabId);
        await loadNotes(activeTabId, filter);
    };

    return (
            <div
                ref={shellRef}
                className="note-shell relative flex min-h-screen flex-col overflow-hidden"
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.35),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(251,191,36,0.28),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(52,211,153,0.25),_transparent_45%)]" />

                <header className="relative z-10 flex items-center justify-between gap-3 px-4 pt-4 md:px-6">
                    <div>
                        <p className="font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                            Note
                        </p>
                        <p className="text-sm text-slate-600">
                            Быстрые заметки: мусор и важное в одном месте
                        </p>
                    </div>
                    <FullscreenToggle isFullscreen={isFullscreen} onToggle={toggle} />
                </header>

                <div className="relative z-10 mt-3 flex min-h-0 flex-1 flex-col px-2 pb-2 md:px-4 md:pb-4">
                    <TabBar
                        tabs={tabs}
                        activeTabId={activeTabId}
                        onSelect={persistActiveTab}
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
                    />

                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/35 shadow-[0_20px_60px_rgba(14,165,233,0.12)] backdrop-blur-md transition duration-300 md:flex-row">
                        {loading ? (
                            <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
                                Загрузка…
                            </div>
                        ) : !activeTabId ? (
                            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                                <p className="font-display text-xl font-semibold text-slate-800">
                                    Нет вкладок
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleCreateTab().catch(() =>
                                            setError('Не удалось создать вкладку'),
                                        );
                                    }}
                                    className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
                                >
                                    Создать первую вкладку
                                </button>
                            </div>
                        ) : (
                            <>
                                <NoteList
                                    notes={notes}
                                    selectedId={selectedNoteId}
                                    filter={filter}
                                    onFilterChange={setFilter}
                                    onSelect={setSelectedNoteId}
                                    onCreate={() => {
                                        handleCreateNote().catch(() =>
                                            setError('Не удалось создать заметку'),
                                        );
                                    }}
                                />
                                <NoteEditor
                                    note={selectedNote}
                                    onChange={(payload) => {
                                        handleUpdateNote(payload).catch(() =>
                                            setError('Не удалось сохранить заметку'),
                                        );
                                    }}
                                    onDelete={() => {
                                        handleDeleteNote().catch(() =>
                                            setError('Не удалось удалить заметку'),
                                        );
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="fixed right-4 bottom-4 z-50 rounded-xl bg-rose-600 px-4 py-2 text-sm text-white shadow-lg">
                        <div className="flex items-center gap-3">
                            <span>{error}</span>
                            <button
                                type="button"
                                className="font-semibold underline"
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
