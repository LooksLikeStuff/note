import { useCallback, useEffect, useState } from 'react';

export function useFullscreen(targetRef: React.RefObject<HTMLElement | null>) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const onChange = () => {
            setIsFullscreen(document.fullscreenElement === targetRef.current);
        };

        document.addEventListener('fullscreenchange', onChange);
        return () => document.removeEventListener('fullscreenchange', onChange);
    }, [targetRef]);

    const toggle = useCallback(async () => {
        const el = targetRef.current;
        if (!el) {
            return;
        }

        if (document.fullscreenElement === el) {
            await document.exitFullscreen();
            return;
        }

        await el.requestFullscreen();
    }, [targetRef]);

    return { isFullscreen, toggle };
}
