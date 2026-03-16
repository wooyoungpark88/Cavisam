import { useState } from 'react';
import { Card, Checkbox } from '../common';
import { EventThumbnail } from './EventThumbnail';
import type { UnconfirmedEvent } from '../../types';

interface UnconfirmedPanelProps {
  events: UnconfirmedEvent[];
  count: number;
  onMultiSelectChange?: (checked: boolean) => void;
  onExclude?: (eventId: string) => void;
}

export function UnconfirmedPanel({ events, count, onMultiSelectChange, onExclude }: UnconfirmedPanelProps) {
  const [multiSelect, setMultiSelect] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleMultiSelectChange = (checked: boolean) => {
    setMultiSelect(checked);
    if (!checked) setSelected(new Set());
    onMultiSelectChange?.(checked);
  };

  const handleThumbnailClick = (eventId: string) => {
    if (!multiSelect) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  const handleExcludeSelected = () => {
    selected.forEach((id) => onExclude?.(id));
    setSelected(new Set());
  };

  return (
    <Card className="w-[382px] h-[690px] overflow-hidden flex flex-col shrink-0">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-sm">미확인 이벤트 ({count}건)</span>
        <Checkbox label="다중선택" onChange={handleMultiSelectChange} />
      </div>

      {multiSelect && selected.size > 0 && (
        <div className="flex gap-2 mb-3">
          <button
            onClick={handleExcludeSelected}
            className="flex-1 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
          >
            선택 항목 제외 ({selected.size})
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-2">
          {events.map((event) => (
            <div
              key={event.id}
              className={`relative cursor-pointer ${
                multiSelect && selected.has(event.id) ? 'ring-2 ring-purple-500 rounded' : ''
              }`}
              onClick={() => handleThumbnailClick(event.id)}
            >
              <EventThumbnail
                time={event.thumbnail.time}
                imageUrl={event.thumbnail.imageUrl}
                label={event.thumbnail.label}
                onClick={multiSelect ? undefined : () => onExclude?.(event.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
