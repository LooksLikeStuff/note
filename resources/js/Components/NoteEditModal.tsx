import { useEffect, useState } from 'react';
import Modal from './Modal';
import { NOTE_KIND_LABELS, NOTE_KINDS } from '@/lib/noteKind';
import type { Note, NoteKind } from '@/types/note';

type Props = {
    note: Note | null;
    open: boolean;
    onClose: () => void;
    onSave: (kind: NoteKind) => void;
};

export default function NoteEditModal({ note, open, onClose, onSave }: Props) {
    const [kind, setKind] = useState<NoteKind>('regular');

    useEffect(() => {
        if (note) {
            setKind(note.kind);
        }
    }, [note?.id, note?.kind, open]);

    if (!note) {
        return null;
    }

    const dirty = kind !== note.kind;

    return (
        <Modal
            open={open}
            title="Редактировать"
            onClose={onClose}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="note-btn-bubble rounded-full px-5 py-2.5 text-base"
                        style={{
                            background: 'var(--theme-chip)',
                            color: 'var(--theme-chip-text)',
                        }}
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        disabled={!dirty}
                        onClick={() => onSave(kind)}
                        className="note-btn-bubble rounded-full px-5 py-2.5 text-base disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                            background: 'var(--theme-btn)',
                            color: 'var(--theme-btn-text)',
                            boxShadow: '0 8px 20px var(--theme-shadow)',
                        }}
                    >
                        Сохранить
                    </button>
                </>
            }
        >
            <p className="mb-4 text-sm" style={{ color: 'var(--theme-muted)' }}>
                Изменить тип
            </p>
            <div className="flex flex-wrap gap-2">
                {NOTE_KINDS.map((item) => {
                    const active = kind === item;

                    return (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setKind(item)}
                            className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200"
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
                            {NOTE_KIND_LABELS[item]}
                        </button>
                    );
                })}
            </div>
        </Modal>
    );
}
