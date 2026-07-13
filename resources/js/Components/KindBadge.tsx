import type { NoteKind } from '@/types/note';

const labels: Record<NoteKind, string> = {
    regular: 'Мусор',
    important: 'Важно',
    trash: 'Корзина',
};

const styles: Record<NoteKind, string> = {
    regular: 'bg-sky-100 text-sky-800',
    important: 'bg-amber-200 text-amber-900',
    trash: 'bg-slate-200 text-slate-600',
};

type Props = {
    kind: NoteKind;
};

export default function KindBadge({ kind }: Props) {
    return (
        <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${styles[kind]}`}
        >
            {labels[kind]}
        </span>
    );
}
