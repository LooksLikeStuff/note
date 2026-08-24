import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export type ContextMenuItem = {
    id: string;
    label: string;
    danger?: boolean;
    onSelect: () => void;
};

type Props = {
    x: number;
    y: number;
    items: ContextMenuItem[];
    onClose: () => void;
};

export default function ContextMenu({ x, y, items, onClose }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ left: x, top: y });

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) {
            return;
        }

        const rect = el.getBoundingClientRect();
        const pad = 8;
        setPos({
            left: Math.min(x, window.innerWidth - rect.width - pad),
            top: Math.min(y, window.innerHeight - rect.height - pad),
        });
    }, [x, y]);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        const onPointer = (event: MouseEvent) => {
            if (!ref.current?.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onPointer);
        window.addEventListener('resize', onClose);
        window.addEventListener('scroll', onClose, true);

        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onPointer);
            window.removeEventListener('resize', onClose);
            window.removeEventListener('scroll', onClose, true);
        };
    }, [onClose]);

    return (
        <div
            ref={ref}
            role="menu"
            className="note-menu fixed z-[90] min-w-[200px] rounded-2xl p-2"
            style={{ left: pos.left, top: pos.top }}
        >
            {items.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    data-danger={item.danger ? 'true' : 'false'}
                    className="note-menu-item"
                    onClick={() => {
                        item.onSelect();
                        onClose();
                    }}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
