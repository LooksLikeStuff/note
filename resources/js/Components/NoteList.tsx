import KindBadge from './KindBadge';
import type { KindFilter, Note } from '@/types/note';

type Props = {
    notes: Note[];
    selectedId: string | null;
    filter: KindFilter;
    onFilterChange: (filter: KindFilter) => void;
    onSelect: (id: string) => void;
    onCreate: () => void;
    onContextMenu: (note: Note, position: { x: number; y: number }) => void;
};

const filters: { id: KindFilter; label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'important', label: 'Важные' },
    { id: 'regular', label: 'Мусор' },
    { id: 'trash', label: 'Корзина' },
];

function formatTime(value: string | null): string {
    if (!value) {
        return '';
    }

    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

export default function NoteList({
    notes,
    selectedId,
    filter,
    onFilterChange,
    onSelect,
    onCreate,
    onContextMenu,
}: Props) {
    return (
        <aside
            className="flex h-full min-h-0 w-full flex-col self-stretch border-r md:w-[360px] md:shrink-0"
            style={{
                background: 'var(--theme-sidebar)',
                borderColor: 'var(--theme-border)',
            }}
        >
            <div
                className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3.5"
                style={{ borderColor: 'var(--theme-border)' }}
            >
                <h2
                    className="text-sm font-semibold tracking-wide uppercase"
                    style={{ color: 'var(--theme-ink)' }}
                >
                    Заметки
                </h2>
                <button
                    type="button"
                    onClick={onCreate}
                    className="note-btn-bubble flex h-11 w-11 items-center justify-center shadow-lg"
                    style={{
                        background: 'var(--theme-btn)',
                        color: 'var(--theme-btn-text)',
                        boxShadow: '0 10px 24px var(--theme-shadow)',
                    }}
                    title="Новая заметка"
                    aria-label="Новая заметка"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                            d="M12 5v14M5 12h14"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </div>

            <div className="flex shrink-0 gap-2 overflow-x-auto px-4 py-3">
                {filters.map((item) => {
                    const active = filter === item.id;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onFilterChange(item.id)}
                            className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200"
                            style={
                                active
                                    ? {
                                          background: 'var(--theme-chip-active)',
                                          color: 'var(--theme-chip-active-text)',
                                          boxShadow: '0 6px 14px var(--theme-shadow)',
                                      }
                                    : {
                                          background: 'var(--theme-chip)',
                                          color: 'var(--theme-chip-text)',
                                      }
                            }
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
                {notes.length === 0 ? (
                    <p
                        className="animate-in px-2 py-10 text-center text-base font-medium"
                        style={{ color: 'var(--theme-muted)' }}
                    >
                        Пока пусто
                    </p>
                ) : (
                    <ul className="note-stagger space-y-2.5">
                        {notes.map((note) => {
                            const active = note.id === selectedId;
                            const preview = (note.body || '').trim().slice(0, 80);

                            return (
                                <li key={note.id}>
                                    <button
                                        type="button"
                                        onClick={() => onSelect(note.id)}
                                        onContextMenu={(event) => {
                                            event.preventDefault();
                                            onSelect(note.id);
                                            onContextMenu(note, {
                                                x: event.clientX,
                                                y: event.clientY,
                                            });
                                        }}
                                        data-active={active ? 'true' : 'false'}
                                        className="note-card w-full rounded-2xl px-4 py-3.5 text-left"
                                    >
                                        <div className="mb-1.5 flex items-center justify-between gap-2">
                                            <span className="truncate text-base font-semibold">
                                                {note.title?.trim() || 'Без названия'}
                                            </span>
                                            {!active && <KindBadge kind={note.kind} />}
                                        </div>
                                        <p
                                            className="line-clamp-2 text-sm font-medium"
                                            style={{
                                                opacity: active ? 0.85 : 0.6,
                                            }}
                                        >
                                            {preview || 'Пустая заметка'}
                                        </p>
                                        <p
                                            className="mt-2 text-xs font-medium"
                                            style={{ opacity: active ? 0.7 : 0.45 }}
                                        >
                                            {formatTime(note.updated_at)}
                                        </p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </aside>
    );
}
