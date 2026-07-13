import { useEffect, useRef, useState } from 'react';
import type { Tab } from '@/types/note';

type Props = {
    tab: Tab;
    isActive: boolean;
    onSelect: (id: string) => void;
    onRename: (id: string, title: string) => void;
    onClose: (id: string) => void;
};

export default function TabItem({
    tab,
    isActive,
    onSelect,
    onRename,
    onClose,
}: Props) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(tab.title);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setDraft(tab.title);
    }, [tab.title]);

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [editing]);

    const commit = () => {
        const next = draft.trim() || tab.title;
        setDraft(next);
        setEditing(false);
        if (next !== tab.title) {
            onRename(tab.id, next);
        }
    };

    return (
        <div
            role="tab"
            aria-selected={isActive}
            className={[
                'group relative flex min-w-[140px] max-w-[220px] shrink-0 items-center gap-2 rounded-t-xl px-3 py-2 text-sm transition-all duration-200',
                isActive
                    ? 'z-10 bg-white text-slate-900 shadow-[0_-2px_12px_rgba(14,165,233,0.18)]'
                    : 'bg-white/45 text-slate-600 hover:bg-white/70 hover:text-slate-800',
            ].join(' ')}
            onClick={() => onSelect(tab.id)}
            onDoubleClick={(e) => {
                e.stopPropagation();
                setEditing(true);
            }}
        >
            {editing ? (
                <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={commit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            commit();
                        }
                        if (e.key === 'Escape') {
                            setDraft(tab.title);
                            setEditing(false);
                        }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full min-w-0 bg-transparent outline-none"
                />
            ) : (
                <span className="truncate font-medium">{tab.title}</span>
            )}

            <button
                type="button"
                aria-label="Закрыть вкладку"
                className="ml-auto rounded-md px-1 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose(tab.id);
                }}
            >
                ×
            </button>
        </div>
    );
}
