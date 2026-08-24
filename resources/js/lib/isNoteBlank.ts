export function isNoteBlank(
    title?: string | null,
    body?: string | null,
): boolean {
    return (title ?? '').trim() === '' && (body ?? '').trim() === '';
}
