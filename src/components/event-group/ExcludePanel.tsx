import { Card } from '../common';
import { EventThumbnail } from './EventThumbnail';
import type { UnconfirmedEvent } from '../../types';

interface ExcludePanelProps {
  events: UnconfirmedEvent[];
}

export function ExcludePanel({ events }: ExcludePanelProps) {
  return (
    <Card className="w-[157px] h-[690px] overflow-hidden flex flex-col">
      <div className="mb-4">
        <span className="font-bold text-sm">대상자 아님</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {events.map((event) => (
            <EventThumbnail
              key={event.id}
              time={event.thumbnail.time}
              imageUrl={event.thumbnail.imageUrl}
              label={event.thumbnail.label}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
