import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import type { ThemeTabChip } from '@/types/theme';
import type { Tab } from '@/types/note';

type Props = {
    tab: Tab;
    isActive: boolean;
    chip: ThemeTabChip;
    onSelect: (id: string) => void;
    onRename: (id: string, title: string) => void;
    onClose: (id: string) => void;
    setNodeRef?: (node: HTMLElement | null) => void;
    style?: CSSProperties;
    dragAttributes?: DraggableAttributes;
    dragListeners?: DraggableSyntheticListeners;
    isDragging?: boolean;
    isOverlay?: boolean;
};

export default function TabItem({
    tab,
    isActive,
    chip,
    onSelect,
    onRename,
    onClose,
    setNodeRef,
    style,
    dragAttributes,
    dragListeners,
    isDragging = false,
    isOverlay = false,
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

    const className = [
        'note-tab group relative flex min-w-[148px] max-w-[240px] shrink-0 items-center gap-2.5 rounded-t-2xl px-4 py-2.5 text-base',
        isOverlay ? 'note-tab--overlay' : '',
        isDragging ? 'note-tab--dragging' : '',
        isActive
            ? `z-10 -mb-px ${chip.bgActive} ${chip.textActive} shadow-lg ${chip.shadow} ring-2 ring-white/70 ring-inset`
            : `${chip.bg} ${chip.text} opacity-85 hover:-translate-y-0.5 hover:opacity-100`,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            ref={setNodeRef}
            role="tab"
            aria-selected={isActive}
            aria-grabbed={isDragging || isOverlay}
            className={className}
            style={style}
            onClick={() => {
                if (!isOverlay && !isDragging) {
                    onSelect(tab.id);
                }
            }}
            onDoubleClick={(e) => {
                if (isOverlay || isDragging) {
                    return;
                }
                e.stopPropagation();
                setEditing(true);
            }}
            {...(editing ? {} : dragAttributes)}
            {...(editing ? {} : dragListeners)}
        >
            <span className="note-tab__lift pointer-events-none absolute inset-0 rounded-t-xl" aria-hidden />

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
                    onPointerDown={(e) => e.stopPropagation()}
                    className="relative z-[1] w-full min-w-0 bg-transparent font-medium outline-none"
                />
            ) : (
                <span className="relative z-[1] truncate font-medium tracking-tight">{tab.title}</span>
            )}

            {!isOverlay && (
                <button
                    type="button"
                    aria-label="Закрыть вкладку"
                    className={[
                        'relative z-[1] ml-auto flex h-6 w-6 items-center justify-center rounded-md text-base leading-none text-current/70 opacity-0 transition group-hover:opacity-100',
                        chip.closeHover,
                    ].join(' ')}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose(tab.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    ×
                </button>
            )}
        </div>
    );
}
