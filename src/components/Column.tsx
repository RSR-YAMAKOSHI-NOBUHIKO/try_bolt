import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Column as ColumnType, Id, Task as TaskType, useBoardStore } from '../store/board-store';
import { Task } from './Task';

interface Props {
  column: ColumnType;
}

export function Column({ column }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  
  const tasks = useBoardStore((state) => 
    state.tasks.filter((task) => task.columnId === column.id)
  );
  const addTask = useBoardStore((state) => state.addTask);
  const deleteColumn = useBoardStore((state) => state.deleteColumn);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleAddTask = () => {
    if (!newTaskContent.trim()) return;
    addTask(column.id, newTaskContent.trim());
    setNewTaskContent('');
    setEditMode(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div className="bg-gray-200 text-sm p-3 font-semibold flex items-center justify-between">
        <div className="flex gap-2">
          <div {...attributes} {...listeners}>
            <GripVertical className="cursor-grab" />
          </div>
          {column.title}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="stroke-gray-500 hover:stroke-red-500 hover:bg-red-100 rounded p-1"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-2 p-2 overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>

      {editMode ? (
        <div className="p-2">
          <textarea
            className="w-full border border-gray-300 rounded p-2 text-sm"
            autoFocus
            placeholder="Enter task content..."
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddTask();
              }
            }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddTask}
              className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
            >
              Add
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setNewTaskContent('');
              }}
              className="bg-gray-300 px-3 py-1 text-sm rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="flex gap-2 items-center p-4 hover:bg-gray-200"
        >
          <Plus size={16} />
          Add task
        </button>
      )}
    </div>
  );
}