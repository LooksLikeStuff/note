import { useState, type ReactNode } from 'react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TabItem from './TabItem';
import { themeAt } from '@/lib/themes';
import type { Tab } from '@/types/note';

type Props = {
    tabs: Tab[];
    activeTabId: string | null;
    onSelect: (id: string) => void;
    onCreate: () => void;
    onRename: (id: string, title: string) => void;
    onClose: (id: string) => void;
    onReorder: (ids: string[]) => void;
    trailing?: ReactNode;
};

type SortableProps = {
    tab: Tab;
    index: number;
    isActive: boolean;
    onSelect: (id: string) => void;
    onRename: (id: string, title: string) => void;
    onClose: (id: string) => void;
};

function SortableTabItem({ tab, index, isActive, onSelect, onRename, onClose }: SortableProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: tab.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition ?? 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: isDragging ? 20 : undefined,
    };

    return (
        <TabItem
            tab={tab}
            isActive={isActive}
            chip={themeAt(index).tab}
            onSelect={onSelect}
            onRename={onRename}
            onClose={onClose}
            setNodeRef={setNodeRef}
            style={style}
            dragAttributes={attributes}
            dragListeners={listeners}
            isDragging={isDragging}
        />
    );
}

export default function TabBar({
    tabs,
    activeTabId,
    onSelect,
    onCreate,
    onRename,
    onClose,
    onReorder,
    trailing,
}: Props) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
    );

    const activeIndex = activeId ? tabs.findIndex((tab) => tab.id === activeId) : -1;
    const activeTab = activeIndex >= 0 ? tabs[activeIndex] : null;

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(String(event.active.id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
        const newIndex = tabs.findIndex((tab) => tab.id === over.id);

        if (oldIndex < 0 || newIndex < 0) {
            return;
        }

        const next = arrayMove(tabs, oldIndex, newIndex);
        onReorder(next.map((tab) => tab.id));
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    return (
        <div className="flex shrink-0 items-end gap-2.5 overflow-x-auto px-2 pt-2.5 md:px-3">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToHorizontalAxis]}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <div className="flex min-w-0 flex-1 items-end gap-2" role="tablist">
                    <SortableContext
                        items={tabs.map((tab) => tab.id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        {tabs.map((tab, index) => (
                            <SortableTabItem
                                key={tab.id}
                                tab={tab}
                                index={index}
                                isActive={tab.id === activeTabId}
                                onSelect={onSelect}
                                onRename={onRename}
                                onClose={onClose}
                            />
                        ))}
                    </SortableContext>
                </div>

                <DragOverlay
                    dropAnimation={{
                        duration: 280,
                        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                >
                    {activeTab ? (
                        <div className="note-tab-overlay-wrap">
                            <TabItem
                                tab={activeTab}
                                isActive={activeTab.id === activeTabId}
                                chip={themeAt(activeIndex).tab}
                                onSelect={() => undefined}
                                onRename={() => undefined}
                                onClose={() => undefined}
                                isOverlay
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <button
                type="button"
                onClick={onCreate}
                className="note-btn-bubble mb-1 flex h-10 w-10 shrink-0 items-center justify-center text-xl leading-none shadow-md"
                style={{
                    background: 'var(--theme-btn)',
                    color: 'var(--theme-btn-text)',
                    boxShadow: '0 8px 20px var(--theme-shadow)',
                }}
                title="Новая вкладка"
                aria-label="Новая вкладка"
            >
                +
            </button>
            {trailing}
        </div>
    );
}
