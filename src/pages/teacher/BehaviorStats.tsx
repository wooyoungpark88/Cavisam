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
  const counts = [12, 3, 4, 2, 5, 10, 1];
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  last7.forEach((d, i) => byDate.set(d, counts[i]));
  return { self_harm: 12, harm_others: 7, obsession: 5, total: 24, byDate };
}

// 데모 컨디션 데이터
function getDemoConditions(): { day: string; condition: 'good' | 'normal' | 'bad'; count: number }[] {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const conditions: ('good' | 'normal' | 'bad')[] = ['normal', 'bad', 'normal', 'good', 'good', 'good', 'bad'];
  const counts = [5, 6, 4, 7, 6, 3, 2];
  return days.map((day, i) => ({ day, condition: conditions[i], count: counts[i] }));
}

const CARD = 'bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]';

export function BehaviorStats() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.organization_id) return;
    getBehaviorStats(profile.organization_id).then((data) => {
      if (data.total === 0) {
        setStats(getDemoStats());
      } else {
        setStats(data);
      }
      setLoading(false);
    });
  }, [profile?.organization_id]);

  const types = [
    { key: 'self_harm', label: '자해행동', color: 'bg-red-500' },
    { key: 'harm_others', label: '타해행동', color: 'bg-orange-400' },
    { key: 'obsession', label: '집착행동', color: 'bg-blue-500' },
  ] as const;

  const total = stats?.total ?? 0;
  const getPercent = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  // 최근 7일
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
  const getBarColor = (count: number) => {
    if (count >= 3) return 'bg-red-500';
    if (count >= 2) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  // 컨디션
  const conditions = getDemoConditions();
  const conditionIcon = (c: 'good' | 'normal' | 'bad') =>
    c === 'good' ? '☀️' : c === 'normal' ? '⛅' : '⚠️';
  const conditionBarColor = (c: 'good' | 'normal' | 'bad') =>
    c === 'good' ? 'bg-green-400' : c === 'normal' ? 'bg-blue-400' : 'bg-orange-400';
  const maxCondCount = Math.max(...conditions.map((c) => c.count), 1);

  // Y축 눈금
  const yTicks = [0, 3, 6, 9, 12];

  return (
    <div className="h-full max-w-5xl mx-auto space-y-5">
      {/* 헤더 */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">행동 추이</h1>
        <p className="text-sm text-gray-400 mt-0.5">최근 30일간의 행동 이벤트 통계</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* ═══ 상단: 총 건수 + 유형별 현황 ═══ */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
            {/* 총 건수 */}
            <div className={`${CARD} p-6 flex flex-col items-center justify-center`}>
              <span className="text-4xl font-extrabold text-gray-900">{total}건</span>
              <span className="text-sm text-gray-400 mt-1">전체 행동 발생</span>
            </div>

            {/* 유형별 수평 바 */}
            <div className={`${CARD} p-5`}>
              <h3 className="text-sm font-bold text-gray-900 mb-4">행동 유형별 발생 현황</h3>
              <div className="space-y-3">
                {types.map(({ key, label, color }) => {
                  const count = stats?.[key] ?? 0;
                  const pct = getPercent(count);
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-16 shrink-0">{label}</span>
                      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700 w-20 text-right shrink-0">
                        {count}건 ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ═══ 중단: 7일 발생 추이 + 주간 컨디션 (2열) ═══ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 최근 7일 발생 추이 */}
            <div className={`${CARD} p-5`}>
              <h3 className="text-sm font-bold text-gray-900 mb-4">최근 7일 발생 추이</h3>

              <div className="flex gap-1" style={{ height: '180px' }}>
                {/* Y축 */}
                <div className="flex flex-col justify-between items-end pr-2 text-xs text-gray-400 py-1" style={{ height: '150px' }}>
                  {[...yTicks].reverse().map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>

                {/* 바 차트 */}
                <div className="flex-1 flex items-end gap-1.5">
                  {last7Days.map((d) => {
                    const count = stats?.byDate.get(d) ?? 0;
                    const heightPct = Math.max(Math.round((count / 12) * 100), 3);
                    const dayOfWeek = dayLabels[new Date(d).getDay()];
                    return (
                      <div key={d} className="flex-1 flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-600 mb-1">{count}</span>
                        <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
                          <div
                            className={`w-full max-w-[36px] ${getBarColor(count)} rounded-t-md transition-all duration-500`}
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-500 mt-1.5">{dayOfWeek}</span>
                        <span className="text-xs text-gray-400">{d.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 범례 */}
              <div className="flex items-center justify-center gap-5 mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-500">3건 이상</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="text-xs text-gray-500">2건</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-500">1건 이하</span>
                </div>
              </div>
            </div>

            {/* 주간 컨디션 추이 */}
            <div className={`${CARD} p-5`}>
              <h3 className="text-sm font-bold text-gray-900 mb-4">주간 컨디션 추이</h3>

              <div className="flex items-end gap-1.5" style={{ height: '180px' }}>
                {conditions.map((item, i) => {
                  const heightPct = Math.max(Math.round((item.count / maxCondCount) * 100), 5);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <span className="text-lg mb-1">{conditionIcon(item.condition)}</span>
                      <div className="w-full flex items-end justify-center" style={{ height: '110px' }}>
                        <div
                          className={`w-full max-w-[32px] ${conditionBarColor(item.condition)} rounded-t-md transition-all duration-500`}
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-600 mt-2">{item.day}</span>
                    </div>
                  );
                })}
              </div>

              {/* 범례 */}
              <div className="flex items-center justify-center gap-5 mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs text-gray-500">좋음</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                  <span className="text-xs text-gray-500">보통</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-orange-400" />
                  <span className="text-xs text-gray-500">주의</span>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ 하단: AI 인사이트 배너 ═══ */}
          <div className="bg-gradient-to-r from-[#eef3ff] to-[#e8edff] rounded-2xl border border-blue-200/60 px-6 py-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-2xl">🤖</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 mb-0.5">AI 행동 분석 인사이트</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                주 후반 도전행동 감소 추세. 오후 일정 조정이 효과적이었을 수 있어요.
              </p>
            </div>
            <button className="shrink-0 bg-[#026eff] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#0254cc] transition-colors">
              자세히 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
