import { supabase } from '../supabase';
import type { AiCareReport, CareLevel } from '../../types/ai-care';

interface AiCareReportDB {
  id: string;
  student_id: string;
  report_date: string;
  care_level: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

const CARE_LEVEL_MAP: Record<string, CareLevel> = {
  low: '우수',
  medium: '양호',
  high: '주의',
  critical: '위험',
};

const CARE_SCORE_MAP: Record<string, number> = {
  low: 90,
  medium: 70,
  high: 45,
  critical: 20,
};

function toAiCareReport(row: AiCareReportDB): AiCareReport {
  const d = (row.details ?? {}) as Record<string, unknown>;

  return {
    studentId: row.student_id,
    generatedAt: new Date(row.created_at).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
    }),
    careLevel: CARE_LEVEL_MAP[row.care_level] ?? '양호',
    careLevelScore: (d.careLevelScore as number) ?? CARE_SCORE_MAP[row.care_level] ?? 70,
    summary: row.summary,
    patterns: Array.isArray(d.patterns) ? d.patterns : [],
    insights: Array.isArray(d.insights) ? d.insights : [],
    recommendations: Array.isArray(d.recommendations) ? d.recommendations : [],
    weeklyBehavior: Array.isArray(d.weeklyBehavior) ? d.weeklyBehavior : [
      { day: '월', count: 0 }, { day: '화', count: 0 }, { day: '수', count: 0 },
      { day: '목', count: 0 }, { day: '금', count: 0 },
    ],
    riskAlerts: Array.isArray(d.riskAlerts) ? d.riskAlerts : [],
    positiveHighlights: Array.isArray(d.positiveHighlights) ? d.positiveHighlights : [],
  };
}

/** 특정 학생의 최신 AI 케어 리포트 조회 */
export async function getLatestAiCareReport(studentId: string): Promise<AiCareReport | null> {
  const { data } = await supabase
    .from('ai_care_reports')
    .select('*')
    .eq('student_id', studentId)
    .order('report_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  return toAiCareReport(data as AiCareReportDB);
}

/** 여러 학생의 최신 AI 케어 리포트를 한꺼번에 조회 */
export async function getAiCareReportsForStudents(
  studentIds: string[],
): Promise<Map<string, AiCareReport>> {
  if (studentIds.length === 0) return new Map();

  const { data } = await supabase
    .from('ai_care_reports')
    .select('*')
    .in('student_id', studentIds)
    .order('report_date', { ascending: false });

  const map = new Map<string, AiCareReport>();
  if (!data) return map;

  for (const row of data as AiCareReportDB[]) {
    // 학생별 첫 번째(=최신) 항목만 저장
    if (!map.has(row.student_id)) {
      map.set(row.student_id, toAiCareReport(row));
    }
  }

  return map;
}
