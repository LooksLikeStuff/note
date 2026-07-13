import { useEffect, useState } from 'react';
import KindBadge from './KindBadge';
import type { Note, NoteKind } from '@/types/note';

type Props = {
    note: Note | null;
    onChange: (payload: {
        title?: string | null;
        body?: string | null;
        kind?: NoteKind;
    }) => void;
    onDelete: () => void;
};

const kinds: NoteKind[] = ['regular', 'important', 'trash'];

export default function NoteEditor({ note, onChange, onDelete }: Props) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        setTitle(note?.title ?? '');
        setBody(note?.body ?? '');
    }, [note?.id, note?.title, note?.body]);

    if (!note) {
        return (
            <div className="flex h-full flex-1 items-center justify-center bg-white/40 px-6 text-center">
                <div>
                    <p className="font-display text-2xl font-semibold text-slate-800">
                        Выбери заметку
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                        Или создай новую — сюда можно скидывать и мусор, и важное.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className="flex h-full min-h-0 flex-1 flex-col bg-white/70 backdrop-blur transition-opacity duration-200">
            <div className="flex flex-wrap items-center gap-2 border-b border-sky-100/80 px-5 py-3">
                <KindBadge kind={note.kind} />
                <div className="ml-auto flex flex-wrap gap-1">
                    {kinds.map((kind) => (
                        <button
                            key={kind}
                            type="button"
                            onClick={() => onChange({ kind })}
                            className={[
                                'rounded-md px-2.5 py-1 text-xs font-medium transition',
                                note.kind === kind
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-white text-slate-600 hover:bg-sky-50',
                            ].join(' ')}
                        >
                            {kind === 'regular'
                                ? 'Мусор'
                                : kind === 'important'
                                  ? 'Важно'
                                  : 'Корзина'}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={onDelete}
                        className="rounded-md bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                    >
                        Удалить
                    </button>
                </div>
            </div>

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                    if (title !== (note.title ?? '')) {
                        onChange({ title });
                    }
                }}
                placeholder="Заголовок"
                className="font-display border-b border-sky-100/80 bg-transparent px-5 py-4 text-2xl font-semibold text-slate-900 outline-none placeholder:text-slate-300"
            />

            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onBlur={() => {
                    if (body !== (note.body ?? '')) {
                        onChange({ body });
                    }
                }}
                placeholder="Пиши сюда всё подряд…"
                className="min-h-0 flex-1 resize-none bg-transparent px-5 py-4 text-base leading-relaxed text-slate-700 outline-none placeholder:text-slate-300"
            />
        </section>
    );
}
