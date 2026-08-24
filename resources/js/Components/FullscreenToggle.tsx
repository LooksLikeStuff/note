type Props = {
    isFullscreen: boolean;
    onToggle: () => void;
};

export default function FullscreenToggle({ isFullscreen, onToggle }: Props) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="note-btn-bubble mb-1 flex h-10 w-10 shrink-0 items-center justify-center border bg-white/70 shadow-sm backdrop-blur hover:bg-white"
            style={{
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-ink)',
            }}
            title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полный экран'}
            aria-label={isFullscreen ? 'Свернуть' : 'Полный экран'}
        >
            {isFullscreen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                        d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                        d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            )}
        </button>
    );
}
