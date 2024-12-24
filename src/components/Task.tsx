import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Task as TaskType, useBoardStore } from '../store/board-store';

interface Props {
  task: TaskType;
}

export function Task({ task }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const updateTask = useBoardStore((state) => state.updateTask);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleSave = () => {
    if (editedContent.trim()) {
      updateTask(task.id, editedContent);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border border-gray-200 hover:ring-2 hover:ring-inset hover:ring-blue-500 cursor-grab relative task"
      >
        <textarea
          className="h-full w-full resize-none border-none rounded bg-transparent text-sm focus:outline-none"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          autoFocus
        />
        <button
          onClick={handleSave}
          className="absolute bottom-2 right-2 p-1 hover:bg-gray-100 rounded"
        >
          <Pencil size={16} className="text-gray-500" />
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="absolute bottom-2 right-8 p-1 hover:bg-gray-100 rounded"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border border-gray-200 hover:ring-2 hover:ring-inset hover:ring-blue-500 cursor-grab relative task"
    >
      <GripVertical className="flex-shrink-0 text-gray-500" />
      <div className="flex-grow text-sm ml-2">{task.content}</div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="stroke-gray-500 hover:stroke-blue-500 hover:bg-blue-100 rounded p-1"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-gray-500 hover:stroke-red-500 hover:bg-red-100 rounded p-1"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}