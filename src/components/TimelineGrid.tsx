import React from 'react';
import { isSameDay } from 'date-fns';
import { Resource, Event } from '../types';
import TimelineEvent from './TimelineEvent';

interface TimelineGridProps {
  days: Date[];
  resources: Resource[];
  events: Event[];
  onAddEvent: (date: Date, resourceId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export default function TimelineGrid({
  days,
  resources,
  events,
  onAddEvent,
  onDeleteEvent,
}: TimelineGridProps) {
  return (
    <div className="relative">
      {resources.map((resource) => (
        <div key={resource.id} className="flex">
          <div className="w-48 border-r border-b p-4 sticky left-0 bg-white">
            <span className="font-medium">{resource.name}</span>
          </div>
          <div className="flex flex-1">
            {days.map((day) => (
              <div
                key={`${resource.id}-${day.toISOString()}`}
                className="flex-1 min-w-[120px] border-r border-b p-2 relative"
                onClick={() => onAddEvent(day, resource.id)}
              >
                {events
                  .filter(
                    (event) =>
                      event.resourceId === resource.id && isSameDay(event.start, day)
                  )
                  .map((event) => (
                    <TimelineEvent
                      key={event.id}
                      event={event}
                      onDelete={() => onDeleteEvent(event.id)}
                    />
                  ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}