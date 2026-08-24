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
    onDraftChange?: (draft: { title: string; body: string }) => void;
};

export default function NoteEditor({ note, onChange, onDraftChange }: Props) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        setTitle(note?.title ?? '');
        setBody(note?.body ?? '');
    }, [note?.id, note?.title, note?.body]);

    useEffect(() => {
        if (!note) {
            return;
        }

        onDraftChange?.({ title, body });
    }, [note, title, body, onDraftChange]);

    if (!note) {
        return (
            <div
                className="flex h-full min-h-0 flex-1 items-center justify-center self-stretch px-6 text-center"
                style={{ background: 'var(--theme-editor)' }}
            >
                <p className="animate-in text-base font-medium" style={{ color: 'var(--theme-muted)' }}>
                    Выбери заметку или создай новую
                </p>
            </div>
        );
    }

    return (
        <section
            key={note.id}
            className="animate-in flex h-full min-h-0 flex-1 flex-col self-stretch backdrop-blur"
            style={{ background: 'var(--theme-editor)' }}
        >
            <div
                className="flex items-center gap-2 border-b px-6 py-3.5"
                style={{ borderColor: 'var(--theme-border)' }}
            >
                <KindBadge kind={note.kind} />
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
                className="border-b bg-transparent px-6 py-5 text-3xl font-semibold tracking-tight outline-none transition"
                style={{
                    borderColor: 'var(--theme-border)',
                    color: 'var(--theme-ink)',
                }}
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
                className="min-h-0 flex-1 resize-none bg-transparent px-6 py-5 text-lg leading-relaxed font-medium outline-none transition"
                style={{ color: 'var(--theme-ink)' }}
            />
        </section>
    );
}
