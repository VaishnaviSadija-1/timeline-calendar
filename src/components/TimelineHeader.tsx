import React from 'react';
import { format } from 'date-fns';

interface TimelineHeaderProps {
  days: Date[];
}

export default function TimelineHeader({ days }: TimelineHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white">
      <div className="flex">
        <div className="w-48 border-r border-b bg-gray-50 p-4">
          <span className="font-semibold">Resources</span>
        </div>
        <div className="flex flex-1">
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className="flex-1 min-w-[120px] border-r border-b bg-gray-50 p-4 text-center"
            >
              <div className="font-semibold">{format(day, 'd')}</div>
              <div className="text-sm text-gray-500">{format(day, 'EEE')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}