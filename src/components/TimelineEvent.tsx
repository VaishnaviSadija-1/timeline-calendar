import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { X } from 'lucide-react';
import { Event } from '../types';

interface TimelineEventProps {
  event: Event;
  onDelete: () => void;
}

export default function TimelineEvent({ event, onDelete }: TimelineEventProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${event.color} p-2 rounded-md mb-1 cursor-move group relative`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{event.title}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-full transition-opacity"
        >
          <X className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}