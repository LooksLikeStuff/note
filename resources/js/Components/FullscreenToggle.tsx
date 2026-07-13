type Props = {
    isFullscreen: boolean;
    onToggle: () => void;
};

export default function FullscreenToggle({ isFullscreen, onToggle }: Props) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="rounded-lg bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-900"
            title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полный экран'}
        >
            {isFullscreen ? 'Свернуть' : 'Полный экран'}
        </button>
    );
}
