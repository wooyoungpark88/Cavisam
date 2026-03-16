import { useState } from 'react';
import { MainLayout } from '../components/layout';
import { Button, Select, DateInput } from '../components/common';
import { UnconfirmedPanel, ExcludePanel, EventCard } from '../components/event-group';
import { useEvents } from '../hooks/useEvents';
import { excludeEvent, updateEventGroup } from '../lib/api/events';

export function EventGroupManagement() {
  const [period, setPeriod] = useState('today');
  const [channel, setChannel] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const { unconfirmed, confirmed, excluded, eventGroup, loading, reload } = useEvents();

  const autoApprove = eventGroup?.auto_approve ?? false;

  const handleAutoApproveToggle = async () => {
    if (!eventGroup) return;
    await updateEventGroup(eventGroup.id, { auto_approve: !autoApprove });
    await reload();
  };

  const handleExclude = async (eventId: string) => {
    await excludeEvent(eventId);
    await reload();
  };

  return (
    <MainLayout activeMenuItem="event-group">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">이벤트 그룹관리</h1>

          <div className="flex items-center gap-3">
            <Button
              variant={autoApprove ? 'primary' : 'secondary'}
              size="sm"
              onClick={handleAutoApproveToggle}
            >
              자동승인 {autoApprove ? 'ON' : 'OFF'}
            </Button>
            <Button variant="secondary" size="sm">이벤트 수동등록</Button>
            <Button variant="secondary" size="sm">그룹 추가</Button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Select
            options={[
              { value: 'all', label: '기간 전체' },
              { value: 'today', label: '오늘' },
              { value: 'week', label: '이번 주' },
              { value: 'month', label: '이번 달' },
            ]}
            value={period}
            onChange={setPeriod}
          />

          <DateInput value={date} onChange={setDate} />

          <Select
            options={[
              { value: '', label: '채널 선택' },
              { value: 'ch1', label: '채널 1' },
              { value: 'ch2', label: '채널 2' },
            ]}
            value={channel}
            onChange={setChannel}
          />

          <Button variant="secondary" size="sm" onClick={() => void reload()}>
            ↻
          </Button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex-1 flex gap-4 overflow-hidden">
            <UnconfirmedPanel
              events={unconfirmed}
              count={unconfirmed.length}
              onExclude={handleExclude}
            />

            <div className="flex-1 overflow-auto">
              {confirmed.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <p>확인된 이벤트가 없습니다.</p>
                  <p className="text-sm mt-1">미확인 이벤트를 확인하면 여기에 표시됩니다.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {confirmed.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>

            <ExcludePanel events={excluded} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
