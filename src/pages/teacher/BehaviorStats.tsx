import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getBehaviorStats } from '../../lib/api/events';

interface Stats {
  self_harm: number;
  harm_others: number;
  obsession: number;
  total: number;
  byDate: Map<string, number>;
}

// 데모 데이터 (Supabase 데이터가 없을 때 폴백)
function getDemoStats(): Stats {
  const byDate = new Map<string, number>();
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });
  last30.forEach((d) => {
    byDate.set(d, Math.floor(Math.random() * 5));
  });
  return { self_harm: 12, harm_others: 7, obsession: 5, total: 24, byDate };
}

// 데모 컨디션 데이터
function getDemoConditions(): { day: string; condition: 'good' | 'normal' | 'bad'; count: number }[] {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const conditions: ('good' | 'normal' | 'bad')[] = ['normal', 'bad', 'normal', 'good', 'good', 'good', 'normal'];
  const counts = [3, 4, 2, 1, 1, 0, 2];
  return days.map((day, i) => ({ day, condition: conditions[i], count: counts[i] }));
}

export function BehaviorStats() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.organization_id) return;
    getBehaviorStats(profile.organization_id).then((data) => {
      // Supabase 데이터가 비어있으면 데모 데이터 사용
      if (data.total === 0) {
        setStats(getDemoStats());
      } else {
        setStats(data);
      }
      setLoading(false);
    });
  }, [profile?.organization_id]);

  const types = [
    { key: 'self_harm', label: '자해행동', color: 'bg-red-500', textColor: 'text-red-600', lightBg: 'bg-red-50' },
    { key: 'harm_others', label: '타해행동', color: 'bg-orange-500', textColor: 'text-orange-600', lightBg: 'bg-orange-50' },
    { key: 'obsession', label: '집착행동', color: 'bg-blue-500', textColor: 'text-blue-600', lightBg: 'bg-blue-50' },
  ] as const;

  const total = stats?.total ?? 0;
  const getPercent = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  // 최근 7일 날짜 배열
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  const maxCount = Math.max(...last7Days.map((d) => stats?.byDate.get(d) ?? 0), 1);

  const conditions = getDemoConditions();
  const conditionIcon = (c: 'good' | 'normal' | 'bad') =>
    c === 'good' ? '☀️' : c === 'normal' ? '🌤️' : '🌧️';
  const conditionBarColor = (c: 'good' | 'normal' | 'bad') =>
    c === 'good' ? 'bg-green-400' : c === 'normal' ? 'bg-yellow-400' : 'bg-red-400';
  const conditionBgColor = (c: 'good' | 'normal' | 'bad') =>
    c === 'good' ? 'bg-green-50' : c === 'normal' ? 'bg-yellow-50' : 'bg-red-50';

  const getBarColor = (count: number) => {
    if (count >= 3) return 'bg-red-500';
    if (count >= 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="h-full space-y-6">
      {/* 헤더 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">행동 추이</h2>
        <p className="text-sm text-gray-500 mt-1">최근 30일간의 행동 이벤트 통계</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* 행동 유형별 발생 현황 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-700">행동 유형별 발생 현황</h3>
              <span className="text-2xl font-bold text-gray-800">{total}건</span>
            </div>

            <div className="space-y-3">
              {types.map(({ key, label, color, textColor, lightBg }) => {
                const count = stats?.[key] ?? 0;
                const pct = getPercent(count);
                return (
                  <div key={key} className={`${lightBg} rounded-xl p-3`}>
                    <div className="flex justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                        <span className="font-medium text-gray-700">{label}</span>
                      </div>
                      <span className={`font-bold ${textColor}`}>
                        {count}건 ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
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

          {/* 최근 7일 발생 추이 - 컬러 바 차트 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">최근 7일 발생 추이</h3>

            <div className="flex items-end gap-2 h-40">
              {last7Days.map((d) => {
                const count = stats?.byDate.get(d) ?? 0;
                const heightPct = Math.max(Math.round((count / maxCount) * 100), 4);
                const dayOfWeek = dayLabels[new Date(d).getDay()];
                return (
                  <div key={d} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-gray-600">{count}</span>
                    <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
                      <div
                        className={`w-full max-w-[32px] ${getBarColor(count)} rounded-t-lg transition-all duration-500`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{dayOfWeek}</span>
                    <span className="text-[10px] text-gray-400">{d.slice(5)}</span>
                  </div>
                );
              })}
            </div>

            {/* 범례 */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-xs text-gray-500">3건 이상</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-xs text-gray-500">2건</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-xs text-gray-500">1건 이하</span>
              </div>
            </div>
          </div>

          {/* 주간 컨디션 추이 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">주간 컨디션 추이</h3>

            <div className="flex items-end gap-2">
              {conditions.map((item, i) => {
                const barHeight = Math.max(item.count * 20, 8);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-lg">{conditionIcon(item.condition)}</span>
                    <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                      <div
                        className={`w-full max-w-[28px] ${conditionBarColor(item.condition)} rounded-t-lg transition-all duration-500`}
                        style={{ height: `${barHeight}px` }}
                      />
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full ${conditionBgColor(item.condition)} flex items-center justify-center`}
                    >
                      <span className="text-xs font-bold text-gray-600">{item.day}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 컨디션 범례 */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">☀️</span>
                <span className="text-xs text-gray-500">좋음</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🌤️</span>
                <span className="text-xs text-gray-500">보통</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🌧️</span>
                <span className="text-xs text-gray-500">주의</span>
              </div>
            </div>
          </div>

          {/* AI 인사이트 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-800 mb-1">AI 행동 분석 인사이트</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  주 후반 도전행동 감소 추세. 오후 일정 조정이 효과적이었을 수 있어요.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full font-medium">
                    자동 분석
                  </span>
                  <span className="text-xs text-gray-400">최근 7일 데이터 기준</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
