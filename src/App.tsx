import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Column } from './components/Column';
import { Task } from './components/Task';
import { Id, Task as TaskType, useBoardStore } from './store/board-store';

function App() {
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  
  const columns = useBoardStore((state) => state.columns);
  const tasks = useBoardStore((state) => state.tasks);
  const moveTask = useBoardStore((state) => state.moveTask);
  const addColumn = useBoardStore((state) => state.addColumn);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (isActiveATask) {
      if (isOverATask) {
        // Task over task - handle reordering if needed
      }

      // Move task to a different column
      const overColumnId = isOverATask
        ? tasks.find((t) => t.id === overId)?.columnId
        : overId;

      if (overColumnId) {
        moveTask(activeId as Id, overColumnId as Id);
      }
    }
  }

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    addColumn(newColumnTitle.trim());
    setNewColumnTitle('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-900 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Trello Clone Edit hand</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter column title..."
            className="px-3 py-2 rounded border border-gray-300"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddColumn();
              }
            }}
          />
          <button
            onClick={handleAddColumn}
            className="bg-white text-gray-800 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-100"
          >
            <Plus size={20} />
            Add Column
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex gap-4">
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <Column key={col.id} column={col} />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-3">
              <Task task={activeTask} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default App;