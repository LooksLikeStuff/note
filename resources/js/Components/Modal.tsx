import { useEffect, type ReactNode } from 'react';

type Props = {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
};

export default function Modal({ open, title, onClose, children, footer }: Props) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <button
                type="button"
                className="note-overlay absolute inset-0 cursor-default border-0"
                aria-label="Закрыть"
                onClick={onClose}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="note-modal relative z-10 w-full max-w-md rounded-3xl p-6"
            >
                <div className="mb-4 flex items-start justify-between gap-3">
                    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="note-btn-bubble flex h-9 w-9 items-center justify-center text-xl leading-none"
                        style={{
                            background: 'var(--theme-chip)',
                            color: 'var(--theme-ink)',
                        }}
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>
                <div className="text-base">{children}</div>
                {footer && <div className="mt-5 flex flex-wrap justify-end gap-2">{footer}</div>}
            </div>
        </div>
    );
}
