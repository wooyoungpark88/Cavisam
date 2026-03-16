import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout';
import { useAuth } from '../../hooks/useAuth';
import { getBehaviorStats } from '../../lib/api/events';

interface Stats {
  self_harm: number;
  harm_others: number;
  obsession: number;
  total: number;
  byDate: Map<string, number>;
}

export function BehaviorStats() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.organization_id) return;
    getBehaviorStats(profile.organization_id).then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, [profile?.organization_id]);

  const types = [
    { key: 'self_harm', label: '자해행동', color: 'bg-red-500', textColor: 'text-red-600' },
    { key: 'harm_others', label: '타해행동', color: 'bg-orange-500', textColor: 'text-orange-600' },
    { key: 'obsession', label: '집착행동', color: 'bg-blue-500', textColor: 'text-blue-600' },
  ] as const;

  const total = stats?.total ?? 0;
  const getPercent = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  // 최근 7일 날짜 배열
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const maxCount = Math.max(...last7Days.map((d) => stats?.byDate.get(d) ?? 0), 1);

  return (
    <MainLayout activeMenuItem="behavior-stats">
      <div className="h-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">도전적 행동 통계</h2>
          <p className="text-sm text-gray-500">최근 30일간의 행동 이벤트 통계입니다.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 총계 카드 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-500 mb-4">행동 유형별 발생 현황</h3>
              <div className="text-4xl font-bold text-gray-800 mb-6">{total}건</div>

              <div className="space-y-4">
                {types.map(({ key, label, color, textColor }) => {
                  const count = stats?.[key] ?? 0;
                  const pct = getPercent(count);
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{label}</span>
                        <span className={`font-bold ${textColor}`}>{count}건 ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 최근 7일 추이 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-500 mb-4">최근 7일 발생 추이</h3>
              <div className="flex items-end gap-2 h-40">
                {last7Days.map((d) => {
                  const count = stats?.byDate.get(d) ?? 0;
                  const heightPct = Math.round((count / maxCount) * 100);
                  const label = d.slice(5); // MM-DD
                  return (
                    <div key={d} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-500">{count}</span>
                      <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '120px' }}>
                        <div
                          className="absolute bottom-0 w-full bg-purple-500 rounded-t transition-all duration-500"
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 유형별 카드 */}
            {types.map(({ key, label, color, textColor }) => {
              const count = stats?.[key] ?? 0;
              return (
                <div key={key} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <h3 className="text-sm font-bold text-gray-500">{label}</h3>
                  </div>
                  <div className={`text-3xl font-bold ${textColor}`}>{count}건</div>
                  <p className="text-xs text-gray-400 mt-1">최근 30일</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
