import { Card, Avatar } from '../common';
import { EventThumbnail } from './EventThumbnail';
import type { EventCardData } from '../../types';

interface EventCardProps {
  event: EventCardData;
}

const behaviorLabels = {
  self_harm: '자해행동',
  harm_others: '타해행동',
  obsession: '집착행동',
};

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="w-[489px]">
      <div className="flex items-center gap-3 mb-4">
        <Avatar size="lg" />
        <div>
          <p className="font-bold text-sm text-gray-800">{event.subjectName}</p>
          <p className="text-xs text-gray-600">({event.subjectPhone})</p>
        </div>
      </div>

      {event.behaviors.map((behavior) => (
        <div key={behavior.id} className="mb-4">
          <p className="text-xs font-bold text-gray-800 mb-2">
            {behaviorLabels[behavior.type]}
          </p>
          <div className="flex gap-2 flex-wrap">
            {behavior.thumbnails.map((thumb) => (
              <EventThumbnail
                key={thumb.id}
                time={thumb.time}
                imageUrl={thumb.imageUrl}
                label={thumb.label}
              />
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
}
