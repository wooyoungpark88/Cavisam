export type CareLevel = "우수" | "양호" | "주의" | "위험";

export interface AiInsight {
  icon: string;
  color: string;
  title: string;
  desc: string;
}

export interface AiRecommendation {
  priority: "high" | "medium" | "low";
  icon: string;
  title: string;
  detail: string;
}

export interface AiPatternItem {
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  good: boolean;
}

export interface AiWeeklyBehaviorBar {
  day: string;
  count: number;
}

export interface AiCareReport {
  studentId: number;
  generatedAt: string;
  careLevel: CareLevel;
  careLevelScore: number;
  summary: string;
  patterns: AiPatternItem[];
  insights: AiInsight[];
  recommendations: AiRecommendation[];
  weeklyBehavior: AiWeeklyBehaviorBar[];
  riskAlerts: string[];
  positiveHighlights: string[];
}

export const mockAiCareReports: AiCareReport[] = [
  {
    studentId: 1,
    generatedAt: "2026. 3. 18 오후 2:45",
    careLevel: "양호",
    careLevelScore: 78,
    summary:
      "김민조 이용인은 최근 2주간 전반적으로 안정적인 상태를 유지하고 있습니다. 미술·음악 활동에서 두드러진 집중력을 보이며 긍정 행동 빈도가 증가했습니다. 수면과 식사 패턴이 규칙적으로 유지되고 있어 신체 컨디션도 양호합니다.",
    patterns: [
      { label: "이번 주 문제행동", value: "8회", trend: "down", good: true },
      { label: "지난 주 대비", value: "-33%", trend: "down", good: true },
      { label: "긍정행동 발생", value: "주 5회", trend: "up", good: true },
      { label: "평균 수면", value: "7.8시간", trend: "stable", good: true },
    ],
    insights: [
      {
        icon: "ri-palette-line",
        color: "#06b6d4",
        title: "미술 활동 집중력 향상",
        desc: "지난 4주간 미술 활동 집중 시간이 평균 20분 → 40분으로 2배 증가했습니다.",
      },
      {
        icon: "ri-moon-line",
        color: "#8b5cf6",
        title: "규칙적 수면 패턴",
        desc: "지난 2주간 수면 시간 7~9시간 유지. 수면 부족이 관찰된 날은 단 1일입니다.",
      },
      {
        icon: "ri-medicine-bottle-line",
        color: "#10b981",
        title: "약복용 순응도 높음",
        desc: "최근 14일간 리스페리돈 복용 누락 없이 100% 이행됐습니다.",
      },
    ],
    recommendations: [
      {
        priority: "medium",
        icon: "ri-paint-brush-line",
        title: "미술 활동 시간 점진적 연장",
        detail:
          "현재 40분 집중이 가능하므로, 다음 단계로 50분 집중 목표를 설정하고 중간 강화물(칭찬 스티커)을 활용해 보세요.",
      },
      {
        priority: "low",
        icon: "ri-group-line",
        title: "소집단 협력 활동 도입",
        detail:
          "1:1 상호작용이 안정됐으니 2~3인 소집단 활동을 통해 사회성 발달 기회를 늘려보세요.",
      },
    ],
    weeklyBehavior: [
      { day: "월", count: 2 },
      { day: "화", count: 1 },
      { day: "수", count: 3 },
      { day: "목", count: 0 },
      { day: "금", count: 1 },
      { day: "토", count: 0 },
      { day: "일", count: 1 },
    ],
    riskAlerts: [],
    positiveHighlights: [
      "이번 주 긍정 행동 비율 전체 1위",
      "미술 활동 집중 시간 역대 최장 달성",
      "자발적 언어 표현 이번 주 3회 관찰",
    ],
  },
  {
    studentId: 2,
    generatedAt: "2026. 3. 18 오후 2:45",
    careLevel: "주의",
    careLevelScore: 52,
    summary:
      "이서연 이용인은 이번 주 수면 부족(5시간)이 지속되며 컨디션 저하가 관찰됩니다. 수면 부족 발생일에 집착행동 빈도가 평균 2.3배 증가하는 패턴이 확인됩니다. 보호자와 수면 환경 개선에 대한 협력이 필요합니다.",
    patterns: [
      { label: "이번 주 문제행동", value: "9회", trend: "down", good: true },
      { label: "지난 주 대비", value: "-18%", trend: "down", good: true },
      { label: "수면 부족 발생일", value: "주 3일", trend: "up", good: false },
      { label: "평균 수면", value: "5.6시간", trend: "down", good: false },
    ],
    insights: [
      {
        icon: "ri-moon-cloudy-line",
        color: "#ef4444",
        title: "수면 부족 → 행동 증가 연관",
        desc: "수면 6시간 미만인 날, 자리 이탈·집착행동이 평균 2.3배 높습니다. 수면 개선이 행동 감소에 직결됩니다.",
      },
      {
        icon: "ri-time-line",
        color: "#f59e0b",
        title: "오전 10~11시 이탈행동 집중",
        desc: "지난 2주간 오전 10~11시 사이 이탈행동이 전체의 62%를 차지합니다. 해당 시간대 환경 조정이 필요합니다.",
      },
      {
        icon: "ri-heart-pulse-line",
        color: "#06b6d4",
        title: "점심 식사 후 안정화 패턴",
        desc: "점심 식사 이후 행동 빈도가 오전 대비 평균 40% 감소합니다. 오후 활동 배치 최적화가 유효합니다.",
      },
    ],
    recommendations: [
      {
        priority: "high",
        icon: "ri-moon-line",
        title: "보호자와 수면 루틴 공유",
        detail:
          "취침 시간을 오후 9시 이전으로 설정하고, 취침 전 1시간 스크린 차단 루틴을 보호자와 협력하여 시행해 보세요.",
      },
      {
        priority: "high",
        icon: "ri-time-line",
        title: "오전 10~11시 활동 재편성",
        detail:
          "고집중 활동 대신 감각통합 활동이나 신체 이완 활동으로 해당 시간대 프로그램을 변경해 보세요.",
      },
      {
        priority: "medium",
        icon: "ri-chat-smile-3-line",
        title: "아침 등원 시 환영 루틴 도입",
        detail:
          "등원 직후 선호 활동(퍼즐 등) 10분을 보장하면 오전 적응 시간을 단축할 수 있습니다.",
      },
    ],
    weeklyBehavior: [
      { day: "월", count: 3 },
      { day: "화", count: 2 },
      { day: "수", count: 1 },
      { day: "목", count: 2 },
      { day: "금", count: 0 },
      { day: "토", count: 1 },
      { day: "일", count: 0 },
    ],
    riskAlerts: ["수면 부족이 3일 이상 지속됨 — 보호자 상담 권고"],
    positiveHighlights: ["이번 주 금요일 문제행동 0회 달성"],
  },
  {
    studentId: 3,
    generatedAt: "2026. 3. 18 오후 2:45",
    careLevel: "양호",
    careLevelScore: 72,
    summary:
      "박지호 이용인은 이번 주 문제행동이 전주 대비 37.5% 감소하며 꾸준한 개선세를 보입니다. 주된 이탈행동도 점차 감소 추세이며 식사와 수면 상태가 안정적입니다. 현재의 긍정적 흐름을 유지하는 지원 전략이 효과적입니다.",
    patterns: [
      { label: "이번 주 문제행동", value: "5회", trend: "down", good: true },
      { label: "지난 주 대비", value: "-37.5%", trend: "down", good: true },
      { label: "평균 수면", value: "7.3시간", trend: "stable", good: true },
      { label: "식사 수준", value: "평소처럼", trend: "stable", good: true },
    ],
    insights: [
      {
        icon: "ri-walk-line",
        color: "#8b5cf6",
        title: "이탈행동 감소 추세",
        desc: "이탈행동이 4주 전 주 12회 → 현재 5회로 꾸준히 감소 중입니다. 현재 전략이 효과적입니다.",
      },
      {
        icon: "ri-sun-line",
        color: "#f59e0b",
        title: "오후 활동 참여도 향상",
        desc: "오후 집단 활동 참여율이 지난달 60%에서 이번 달 85%로 증가했습니다.",
      },
    ],
    recommendations: [
      {
        priority: "medium",
        icon: "ri-trophy-line",
        title: "자기관리 기술 훈련 도입",
        detail:
          "안정된 컨디션을 활용해 '스스로 활동 준비하기' 등 자기관리 기술 훈련을 점진적으로 도입해 보세요.",
      },
      {
        priority: "low",
        icon: "ri-user-heart-line",
        title: "또래 상호작용 기회 확대",
        detail:
          "행동이 안정된 지금이 또래 협력 활동을 늘리기 좋은 시점입니다.",
      },
    ],
    weeklyBehavior: [
      { day: "월", count: 1 },
      { day: "화", count: 0 },
      { day: "수", count: 2 },
      { day: "목", count: 1 },
      { day: "금", count: 0 },
      { day: "토", count: 0 },
      { day: "일", count: 1 },
    ],
    riskAlerts: [],
    positiveHighlights: [
      "4주 연속 문제행동 감소 달성",
      "오후 집단 활동 참여율 85%로 역대 최고",
    ],
  },
  {
    studentId: 4,
    generatedAt: "2026. 3. 18 오후 2:45",
    careLevel: "우수",
    careLevelScore: 91,
    summary:
      "최수아 이용인은 이번 주 문제행동이 단 1회로 전주 대비 80% 급감했습니다. 지난 한 달간 지속적인 개선이 두드러지며, 또래와의 자발적 상호작용이 관찰되기 시작했습니다. 현재 지원 방식이 매우 효과적으로 작용하고 있습니다.",
    patterns: [
      { label: "이번 주 문제행동", value: "1회", trend: "down", good: true },
      { label: "지난 주 대비", value: "-80%", trend: "down", good: true },
      { label: "자발적 상호작용", value: "주 4회", trend: "up", good: true },
      { label: "활동 참여율", value: "95%", trend: "up", good: true },
    ],
    insights: [
      {
        icon: "ri-user-smile-line",
        color: "#10b981",
        title: "또래 상호작용 자발적 증가",
        desc: "지난 달 또래 상호작용 주 0~1회 → 이번 주 4회로 급증. 사회성 발달 전환점으로 판단됩니다.",
      },
      {
        icon: "ri-star-line",
        color: "#f59e0b",
        title: "전체 활동 참여율 최상위",
        desc: "이번 주 전체 활동 참여율 95%로 이용인 중 가장 높습니다.",
      },
    ],
    recommendations: [
      {
        priority: "low",
        icon: "ri-group-line",
        title: "소집단 리더 역할 부여 시도",
        detail:
          "현재 안정된 상태를 활용해 소집단 활동에서 간단한 리더 역할(재료 나눠주기 등)을 부여해 자기효능감을 높여보세요.",
      },
    ],
    weeklyBehavior: [
      { day: "월", count: 0 },
      { day: "화", count: 1 },
      { day: "수", count: 0 },
      { day: "목", count: 0 },
      { day: "금", count: 0 },
      { day: "토", count: 0 },
      { day: "일", count: 0 },
    ],
    riskAlerts: [],
    positiveHighlights: [
      "이번 주 문제행동 1회로 전체 이용인 중 최저",
      "사회성 지표 급격한 향상 — 전환점 관찰",
      "한 달 연속 꾸준한 개선세 유지",
    ],
  },
  {
    studentId: 5,
    generatedAt: "2026. 3. 18 오후 2:45",
    careLevel: "위험",
    careLevelScore: 28,
    summary:
      "정도현 이용인은 이번 주 자해행동이 21회로 전주 대비 16.7% 증가했습니다. 수면(4시간)과 식사(아침 거부) 상태가 모두 악화돼 즉각적인 개입이 필요합니다. 행동지원 전문가 및 보호자와 긴급 협의를 권고합니다.",
    patterns: [
      { label: "이번 주 문제행동", value: "21회", trend: "up", good: false },
      { label: "지난 주 대비", value: "+16.7%", trend: "up", good: false },
      { label: "오늘 수면", value: "4시간", trend: "down", good: false },
      { label: "오늘 식사", value: "거부", trend: "down", good: false },
    ],
    insights: [
      {
        icon: "ri-alert-line",
        color: "#ef4444",
        title: "자해행동 3주 연속 증가",
        desc: "3주 전 14회 → 2주 전 18회 → 이번 주 21회로 지속 증가 중입니다. 즉각적인 원인 분석이 필요합니다.",
      },
      {
        icon: "ri-restaurant-line",
        color: "#ef4444",
        title: "식사 거부 패턴 출현",
        desc: "지난 1주간 아침 식사 거부가 3일 발생했습니다. 신체적 불편감 또는 환경적 스트레스 가능성이 있습니다.",
      },
      {
        icon: "ri-fire-line",
        color: "#f59e0b",
        title: "오전 집중 고위험 시간대",
        desc: "오전 10~12시 자해행동이 전체의 71%를 차지합니다. 이 시간대 집중 모니터링과 선행자극 제거가 필요합니다.",
      },
    ],
    recommendations: [
      {
        priority: "high",
        icon: "ri-phone-line",
        title: "긴급 보호자 상담 즉시 진행",
        detail:
          "행동 급증 원인 파악을 위해 오늘 중으로 보호자와 통화하고 가정 내 변화(건강, 수면, 스트레스 요인) 확인이 필요합니다.",
      },
      {
        priority: "high",
        icon: "ri-shield-user-line",
        title: "행동지원 전문가 협의 요청",
        detail:
          "현재 수준의 자해행동은 개별 지원 계획(BSP) 긴급 검토가 필요합니다. 기관 내 행동지원 전문가에게 즉시 의뢰해 주세요.",
      },
      {
        priority: "high",
        icon: "ri-hospital-line",
        title: "신체적 불편감 의학적 확인",
        detail:
          "식사 거부 + 수면 감소 + 자해 증가 패턴은 소화기 불편 또는 통증 가능성을 시사합니다. 의료진 검진을 권고합니다.",
      },
    ],
    weeklyBehavior: [
      { day: "월", count: 4 },
      { day: "화", count: 5 },
      { day: "수", count: 3 },
      { day: "목", count: 4 },
      { day: "금", count: 2 },
      { day: "토", count: 1 },
      { day: "일", count: 2 },
    ],
    riskAlerts: [
      "자해행동 3주 연속 증가 — 즉각 개입 필요",
      "수면 4시간 미만 — 신체 피로 누적 위험",
      "아침 식사 거부 — 의료적 확인 권고",
    ],
    positiveHighlights: [],
  },
  {
    studentId: 6,
    generatedAt: "2026. 3. 18 오후 2:45",
    careLevel: "양호",
    careLevelScore: 68,
    summary:
      "한유진 이용인은 이번 주 문제행동이 전주 대비 28.6% 감소하며 개선 중입니다. 오늘 점심 후 복통 제스처가 관찰됐으며, 최근 배변 상태가 무른 편으로 소화기 모니터링이 필요합니다. 메틸페니데이트 복용 시간과 식사 패턴을 함께 확인하는 것이 권장됩니다.",
    patterns: [
      { label: "이번 주 문제행동", value: "5회", trend: "down", good: true },
      { label: "지난 주 대비", value: "-28.6%", trend: "down", good: true },
      { label: "배변 상태", value: "무른편", trend: "down", good: false },
      { label: "약복용 이행률", value: "100%", trend: "stable", good: true },
    ],
    insights: [
      {
        icon: "ri-heart-pulse-line",
        color: "#f59e0b",
        title: "소화기 불편 징후",
        desc: "이번 주 배변 무른 상태 3회 + 오늘 복통 제스처 관찰. 메틸페니데이트 복용 후 식사 타이밍 확인이 필요합니다.",
      },
      {
        icon: "ri-medicine-bottle-line",
        color: "#10b981",
        title: "약복용 이행률 100%",
        desc: "최근 4주간 메틸페니데이트 복용 누락 0회, 이행률 100%입니다.",
      },
    ],
    recommendations: [
      {
        priority: "high",
        icon: "ri-stethoscope-line",
        title: "소화기 불편 원인 확인",
        detail:
          "메틸페니데이트는 복용 후 소화기 부작용이 있을 수 있습니다. 약 복용 후 식사 또는 공복 복용 여부를 담당 의사에게 확인해 주세요.",
      },
      {
        priority: "medium",
        icon: "ri-user-voice-line",
        title: "보호자에게 소화기 관찰 요청",
        detail:
          "가정에서도 배변 및 복통 관련 증상을 관찰하도록 보호자에게 등원 전 한마디에 배변 항목 세밀히 기록 요청을 해보세요.",
      },
    ],
    weeklyBehavior: [
      { day: "월", count: 1 },
      { day: "화", count: 0 },
      { day: "수", count: 2 },
      { day: "목", count: 1 },
      { day: "금", count: 0 },
      { day: "토", count: 0 },
      { day: "일", count: 1 },
    ],
    riskAlerts: ["소화기 불편 징후 지속 — 의료 확인 권장"],
    positiveHighlights: [
      "약복용 이행률 4주 연속 100%",
      "문제행동 전주 대비 28.6% 감소",
    ],
  },
  {
    studentId: 7,
    generatedAt: "2026. 3. 18 오후 2:45",
    careLevel: "주의",
    careLevelScore: 48,
    summary:
      "오태민 이용인은 등원 시 울음 반응이 지난 2주간 지속되고 있으며, 이탈행동이 오전에 집중되는 패턴이 관찰됩니다. 수면(6시간)이 부족하고 식사량도 감소하는 추세입니다. 등원 불안 완화를 위한 전환 루틴 개선이 시급합니다.",
    patterns: [
      { label: "이번 주 문제행동", value: "10회", trend: "down", good: true },
      { label: "지난 주 대비", value: "-28.6%", trend: "down", good: true },
      { label: "등원 울음 발생", value: "주 4일", trend: "up", good: false },
      { label: "평균 수면", value: "6.1시간", trend: "down", good: false },
    ],
    insights: [
      {
        icon: "ri-emotion-sad-line",
        color: "#ef4444",
        title: "등원 불안 패턴 지속",
        desc: "지난 2주간 등원 울음 반응이 매주 3~5일 발생합니다. 전환 루틴의 예측 가능성을 높이는 접근이 필요합니다.",
      },
      {
        icon: "ri-walk-line",
        color: "#8b5cf6",
        title: "이탈행동 오전 집중",
        desc: "이탈행동의 78%가 등원 후 2시간(오전 9~11시)에 집중됩니다. 해당 시간대 집중 지원이 필요합니다.",
      },
      {
        icon: "ri-restaurant-2-line",
        color: "#f59e0b",
        title: "식사량 점진적 감소",
        desc: "3주 전 '평소처럼'이었던 식사량이 최근 '조금'으로 감소. 스트레스 반응 가능성을 모니터링 해주세요.",
      },
    ],
    recommendations: [
      {
        priority: "high",
        icon: "ri-home-heart-line",
        title: "등원 전환 루틴 시각화",
        detail:
          "등원 시 '가방 걸기 → 인사하기 → 선호 활동 시작' 순서를 시각적 일정표로 제시하면 불안이 완화될 수 있습니다.",
      },
      {
        priority: "medium",
        icon: "ri-emotion-happy-line",
        title: "등원 첫 10분 환영 루틴 강화",
        detail:
          "등원 직후 선호하는 활동(또는 선호 음악)을 보장하면 전환 스트레스가 줄어드는 효과가 있습니다.",
      },
      {
        priority: "medium",
        icon: "ri-moon-line",
        title: "수면 시간 확보 보호자 협력",
        detail:
          "취침 루틴을 보호자와 공유하고 목표 수면 시간 8시간 달성을 위한 구체적 계획을 함께 세워 보세요.",
      },
    ],
    weeklyBehavior: [
      { day: "월", count: 2 },
      { day: "화", count: 3 },
      { day: "수", count: 1 },
      { day: "목", count: 2 },
      { day: "금", count: 1 },
      { day: "토", count: 0 },
      { day: "일", count: 1 },
    ],
    riskAlerts: [
      "등원 불안 2주 이상 지속 — 전환 지원 강화 필요",
      "식사량 점진 감소 — 스트레스 원인 파악 권고",
    ],
    positiveHighlights: ["이번 주 문제행동 전주 대비 28.6% 개선"],
  },
];
