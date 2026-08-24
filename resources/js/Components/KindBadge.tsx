import { NOTE_KIND_LABELS } from '@/lib/noteKind';
import type { NoteKind } from '@/types/note';

type Props = {
    kind: NoteKind;
};

export default function KindBadge({ kind }: Props) {
    const style =
        kind === 'important'
            ? {
                  background: 'linear-gradient(90deg, #fde68a, #fecdd3)',
                  color: '#9f1239',
              }
            : kind === 'trash'
              ? {
                    background: 'color-mix(in srgb, var(--theme-primary-soft) 70%, white)',
                    color: 'var(--theme-muted)',
                }
              : {
                    background: 'var(--theme-primary-soft)',
                    color: 'var(--theme-ink)',
                };

    return (
        <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ring-1 ring-black/5"
            style={style}
        >
            {NOTE_KIND_LABELS[kind]}
        </span>
    );
}
