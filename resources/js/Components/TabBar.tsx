import TabItem from './TabItem';
import type { Tab } from '@/types/note';

type Props = {
    tabs: Tab[];
    activeTabId: string | null;
    onSelect: (id: string) => void;
    onCreate: () => void;
    onRename: (id: string, title: string) => void;
    onClose: (id: string) => void;
};

export default function TabBar({
    tabs,
    activeTabId,
    onSelect,
    onCreate,
    onRename,
    onClose,
}: Props) {
    return (
        <div className="flex items-end gap-1 overflow-x-auto px-3 pt-3">
            <div className="flex min-w-0 flex-1 items-end gap-1" role="tablist">
                {tabs.map((tab) => (
                    <TabItem
                        key={tab.id}
                        tab={tab}
                        isActive={tab.id === activeTabId}
                        onSelect={onSelect}
                        onRename={onRename}
                        onClose={onClose}
                    />
                ))}
            </div>
            <button
                type="button"
                onClick={onCreate}
                className="mb-1 shrink-0 rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-400 active:scale-95"
                title="Новая вкладка"
            >
                +
            </button>
        </div>
    );
}
