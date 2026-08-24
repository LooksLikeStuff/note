import Modal from './Modal';

type Props = {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    danger?: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function ConfirmModal({
    open,
    title,
    message,
    confirmLabel = 'Подтвердить',
    danger = false,
    onClose,
    onConfirm,
}: Props) {
    return (
        <Modal
            open={open}
            title={title}
            onClose={onClose}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="note-btn-bubble rounded-full px-5 py-2.5 text-base"
                        style={{
                            background: 'var(--theme-chip)',
                            color: 'var(--theme-chip-text)',
                        }}
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="note-btn-bubble rounded-full px-5 py-2.5 text-base"
                        style={
                            danger
                                ? {
                                      background: 'var(--theme-danger)',
                                      color: 'var(--theme-danger-text)',
                                      boxShadow: '0 8px 20px var(--theme-danger-soft)',
                                  }
                                : {
                                      background: 'var(--theme-btn)',
                                      color: 'var(--theme-btn-text)',
                                      boxShadow: '0 8px 20px var(--theme-shadow)',
                                  }
                        }
                    >
                        {confirmLabel}
                    </button>
                </>
            }
        >
            <p style={{ color: 'var(--theme-muted)' }}>{message}</p>
        </Modal>
    );
}
