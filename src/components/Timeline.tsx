import React, { useState, useCallback } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { Resource, Event } from '../types';
import TimelineHeader from './TimelineHeader';
import TimelineGrid from './TimelineGrid';
import TimelineEvent from './TimelineEvent';
import AddResourceModal from './AddResourceModal';

const INITIAL_RESOURCES: Resource[] = [
  { id: 'resource-a', name: 'Resource A' },
  { id: 'resource-b', name: 'Resource B' },
  { id: 'resource-c', name: 'Resource C' },
  { id: 'resource-d', name: 'Resource D' },
  { id: 'resource-e', name: 'Resource E' },
];

const COLORS = [
  'bg-blue-200',
  'bg-pink-200',
  'bg-green-200',
  'bg-yellow-200',
  'bg-purple-200',
];

export default function Timeline() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const eventId = active.id as string;
    const [newDate, resourceId] = (over.id as string).split('-');

    setEvents(events.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          start: new Date(newDate),
          resourceId,
        };
      }
      return evt;
    }));
  };

  const handleAddResource = (name: string) => {
    const newResource: Resource = {
      id: `resource-${resources.length + 1}`,
      name,
    };
    setResources([...resources, newResource]);
    setIsAddResourceModalOpen(false);
  };

  const handleAddEvent = useCallback((date: Date, resourceId: string) => {
    const newEvent: Event = {
      id: `event-${events.length + 1}`,
      title: `Event ${events.length + 1}`,
      start: date,
      end: date,
      resourceId,
      color: COLORS[events.length % COLORS.length],
    };
    setEvents([...events, newEvent]);
  }, [events]);

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(evt => evt.id !== eventId));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-blue-600">
            {format(currentDate, 'MMMM yyyy')}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsAddResourceModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="inline-block min-w-full">
            <TimelineHeader days={days} />
            <TimelineGrid
              days={days}
              resources={resources}
              events={events}
              onAddEvent={handleAddEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>
        </DndContext>
      </div>

      <AddResourceModal
        isOpen={isAddResourceModalOpen}
        onClose={() => setIsAddResourceModalOpen(false)}
        onAdd={handleAddResource}
      />
    </div>
  );
}