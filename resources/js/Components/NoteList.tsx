import KindBadge from './KindBadge';
import type { KindFilter, Note } from '@/types/note';

type Props = {
    notes: Note[];
    selectedId: string | null;
    filter: KindFilter;
    onFilterChange: (filter: KindFilter) => void;
    onSelect: (id: string) => void;
    onCreate: () => void;
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
}: Props) {
    return (
        <aside className="flex h-full min-h-0 w-full flex-col border-r border-sky-100/80 bg-white/55 backdrop-blur md:w-[320px]">
            <div className="flex items-center justify-between gap-2 border-b border-sky-100/80 px-4 py-3">
                <h2 className="font-display text-sm font-semibold tracking-wide text-slate-700 uppercase">
                    Заметки
                </h2>
                <button
                    type="button"
                    onClick={onCreate}
                    className="rounded-lg bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-950 transition hover:bg-amber-300 active:scale-95"
                >
                    Новая
                </button>
            </div>

            <div className="flex gap-1 overflow-x-auto px-3 py-2">
                {filters.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onFilterChange(item.id)}
                        className={[
                            'shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition',
                            filter === item.id
                                ? 'bg-slate-900 text-white'
                                : 'bg-white/70 text-slate-600 hover:bg-white',
                        ].join(' ')}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
                {notes.length === 0 ? (
                    <p className="px-2 py-8 text-center text-sm text-slate-500">
                        Пока пусто — нажми «Новая»
                    </p>
                ) : (
                    <ul className="space-y-1">
                        {notes.map((note) => {
                            const active = note.id === selectedId;
                            const preview = (note.body || '').trim().slice(0, 80);

                            return (
                                <li key={note.id}>
                                    <button
                                        type="button"
                                        onClick={() => onSelect(note.id)}
                                        className={[
                                            'w-full rounded-xl px-3 py-2.5 text-left transition duration-200',
                                            active
                                                ? 'bg-sky-500 text-white shadow-md shadow-sky-200'
                                                : 'hover:bg-white/90',
                                            'animate-in fade-in slide-in-from-left-1',
                                        ].join(' ')}
                                    >
                                        <div className="mb-1 flex items-center justify-between gap-2">
                                            <span
                                                className={[
                                                    'truncate text-sm font-semibold',
                                                    active ? 'text-white' : 'text-slate-800',
                                                ].join(' ')}
                                            >
                                                {note.title?.trim() || 'Без названия'}
                                            </span>
                                            {!active && <KindBadge kind={note.kind} />}
                                        </div>
                                        <p
                                            className={[
                                                'line-clamp-2 text-xs',
                                                active ? 'text-sky-50' : 'text-slate-500',
                                            ].join(' ')}
                                        >
                                            {preview || 'Пустая заметка'}
                                        </p>
                                        <p
                                            className={[
                                                'mt-1 text-[11px]',
                                                active ? 'text-sky-100' : 'text-slate-400',
                                            ].join(' ')}
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
