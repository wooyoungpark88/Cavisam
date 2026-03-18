-- ============================================================
-- CareVia Phase 1 마이그레이션: 클로즈베타 인증 기반
-- Supabase Dashboard → SQL Editor에서 실행하세요
-- ============================================================

-- --------------------------------------------------------
-- 1. profiles 테이블에 status 컬럼 추가
-- --------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'status'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN status text NOT NULL DEFAULT 'approved';
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_status_check CHECK (status IN ('pending', 'approved', 'rejected'));
    RAISE NOTICE '✅ profiles.status 컬럼 추가 완료';
  ELSE
    RAISE NOTICE '⏭️ profiles.status 이미 존재';
  END IF;
END $$;

-- 기존 사용자는 approved 상태 유지 (위에서 DEFAULT 'approved'로 설정됨)

-- --------------------------------------------------------
-- 2. invitation_codes (초대코드)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invitation_codes (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            text NOT NULL UNIQUE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  max_uses        int NOT NULL DEFAULT 10,
  used_count      int NOT NULL DEFAULT 0,
  expires_at      timestamptz,
  created_by      uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invitation_codes ENABLE ROW LEVEL SECURITY;

-- 누구나 코드 검증용 조회 가능
CREATE POLICY "invitation_codes_select" ON public.invitation_codes
  FOR SELECT USING (true);

-- admin만 생성/수정/삭제
CREATE POLICY "invitation_codes_admin" ON public.invitation_codes
  FOR ALL USING (public.get_my_role() = 'admin');

-- --------------------------------------------------------
-- 3. morning_reports (등원 전 한마디)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.morning_reports (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  parent_id   uuid NOT NULL REFERENCES public.profiles(id),
  date        date NOT NULL DEFAULT current_date,
  sleep_time  text,
  condition   text CHECK (condition IN ('good', 'normal', 'bad', 'very_bad')),
  meal        text CHECK (meal IN ('good', 'normal', 'none')),
  bowel       text CHECK (bowel IN ('normal', 'none')),
  medication  text,
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, date)
);

ALTER TABLE public.morning_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "morning_reports_select" ON public.morning_reports
  FOR SELECT USING (
    parent_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = morning_reports.student_id
        AND s.organization_id = public.get_my_org()
    )
    OR public.get_my_role() = 'admin'
  );

CREATE POLICY "morning_reports_insert" ON public.morning_reports
  FOR INSERT WITH CHECK (parent_id = auth.uid());

CREATE POLICY "morning_reports_update" ON public.morning_reports
  FOR UPDATE USING (parent_id = auth.uid());

-- --------------------------------------------------------
-- 4. care_team (케어팀)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.care_team (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  member_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        text NOT NULL CHECK (role IN ('lead', 'support', 'observer')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, member_id)
);

ALTER TABLE public.care_team ENABLE ROW LEVEL SECURITY;

CREATE POLICY "care_team_select" ON public.care_team
  FOR SELECT USING (
    member_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = care_team.student_id
        AND (s.organization_id = public.get_my_org() OR s.parent_id = auth.uid())
    )
    OR public.get_my_role() = 'admin'
  );

CREATE POLICY "care_team_manage" ON public.care_team
  FOR ALL USING (public.get_my_role() IN ('teacher', 'admin'));

-- --------------------------------------------------------
-- 5. ai_care_reports (AI 케어 분석 리포트)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_care_reports (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  report_date date NOT NULL DEFAULT current_date,
  care_level  text NOT NULL CHECK (care_level IN ('low', 'medium', 'high', 'critical')),
  summary     text NOT NULL,
  details     jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_care_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_care_reports_select" ON public.ai_care_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = ai_care_reports.student_id
        AND (s.organization_id = public.get_my_org() OR s.parent_id = auth.uid())
    )
    OR public.get_my_role() = 'admin'
  );

-- --------------------------------------------------------
-- 6. notifications (알림)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        text NOT NULL,
  title       text NOT NULL,
  body        text,
  is_read     boolean NOT NULL DEFAULT false,
  metadata    jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- --------------------------------------------------------
-- 7. Realtime 구독 추가 (기존 3개는 이미 있으므로 신규만)
-- --------------------------------------------------------
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.morning_reports;
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE '⏭️ morning_reports 이미 realtime 등록됨';
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE '⏭️ notifications 이미 realtime 등록됨';
END $$;

-- --------------------------------------------------------
-- 8. 테스트용 초대코드 생성
-- --------------------------------------------------------
INSERT INTO public.invitation_codes (code, organization_id, max_uses)
SELECT 'CAREVIA-BETA-001', id, 50
FROM public.organizations
LIMIT 1
ON CONFLICT (code) DO NOTHING;

-- --------------------------------------------------------
-- 완료 확인
-- --------------------------------------------------------
SELECT '✅ Phase 1 마이그레이션 완료' AS result;
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
