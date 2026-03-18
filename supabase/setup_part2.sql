-- ============================================================
-- CareVia 전체 셋업 Part 2: RLS 정책 + 트리거 + 시드 데이터
-- Part 1 실행 후 이어서 실행하세요
-- ============================================================

-- ────────────────────────────────────────
-- RLS 활성화
-- ────────────────────────────────────────
alter table public.organizations    enable row level security;
alter table public.profiles         enable row level security;
alter table public.students         enable row level security;
alter table public.daily_records    enable row level security;
alter table public.event_groups     enable row level security;
alter table public.behavior_events  enable row level security;
alter table public.parent_messages  enable row level security;
alter table public.invitation_codes enable row level security;
alter table public.morning_reports  enable row level security;
alter table public.care_team        enable row level security;
alter table public.ai_care_reports  enable row level security;
alter table public.notifications    enable row level security;

-- ────────────────────────────────────────
-- Helper 함수
-- ────────────────────────────────────────
create or replace function public.get_my_role()
returns text language sql security definer stable as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.get_my_org()
returns uuid language sql security definer stable as $$
  select organization_id from public.profiles where id = auth.uid();
$$;

-- ────────────────────────────────────────
-- organizations 정책
-- ────────────────────────────────────────
drop policy if exists "organizations_select" on public.organizations;
create policy "organizations_select" on public.organizations
  for select using (
    id = public.get_my_org()
    or public.get_my_role() = 'admin'
  );

-- ────────────────────────────────────────
-- profiles 정책
-- ────────────────────────────────────────
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (
    id = auth.uid()
    or organization_id = public.get_my_org()
    or public.get_my_role() = 'admin'
  );

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles
  for insert with check (id = auth.uid());

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update using (id = auth.uid() or public.get_my_role() = 'admin');

-- ────────────────────────────────────────
-- students 정책
-- ────────────────────────────────────────
drop policy if exists "students_select" on public.students;
create policy "students_select" on public.students
  for select using (
    organization_id = public.get_my_org()
    or parent_id = auth.uid()
    or public.get_my_role() = 'admin'
  );

drop policy if exists "students_insert" on public.students;
create policy "students_insert" on public.students
  for insert with check (public.get_my_role() in ('teacher', 'admin'));

drop policy if exists "students_update" on public.students;
create policy "students_update" on public.students
  for update using (
    organization_id = public.get_my_org()
    or public.get_my_role() = 'admin'
  );

drop policy if exists "students_delete" on public.students;
create policy "students_delete" on public.students
  for delete using (public.get_my_role() = 'admin');

-- ────────────────────────────────────────
-- daily_records 정책
-- ────────────────────────────────────────
drop policy if exists "daily_records_select" on public.daily_records;
create policy "daily_records_select" on public.daily_records
  for select using (
    exists (
      select 1 from public.students s
      where s.id = daily_records.student_id
      and (s.organization_id = public.get_my_org() or s.parent_id = auth.uid())
    )
    or public.get_my_role() = 'admin'
  );

drop policy if exists "daily_records_insert" on public.daily_records;
create policy "daily_records_insert" on public.daily_records
  for insert with check (public.get_my_role() in ('teacher', 'admin'));

drop policy if exists "daily_records_update" on public.daily_records;
create policy "daily_records_update" on public.daily_records
  for update using (public.get_my_role() in ('teacher', 'admin'));

-- ────────────────────────────────────────
-- event_groups 정책
-- ────────────────────────────────────────
drop policy if exists "event_groups_select" on public.event_groups;
create policy "event_groups_select" on public.event_groups
  for select using (
    organization_id = public.get_my_org()
    or public.get_my_role() = 'admin'
  );

drop policy if exists "event_groups_all" on public.event_groups;
create policy "event_groups_all" on public.event_groups
  for all using (public.get_my_role() in ('teacher', 'admin'));

-- ────────────────────────────────────────
-- behavior_events 정책
-- ────────────────────────────────────────
drop policy if exists "behavior_events_select" on public.behavior_events;
create policy "behavior_events_select" on public.behavior_events
  for select using (
    exists (
      select 1 from public.students s
      where s.id = behavior_events.student_id
      and s.organization_id = public.get_my_org()
    )
    or public.get_my_role() = 'admin'
  );

drop policy if exists "behavior_events_update" on public.behavior_events;
create policy "behavior_events_update" on public.behavior_events
  for update using (public.get_my_role() in ('teacher', 'admin'));

-- ────────────────────────────────────────
-- parent_messages 정책
-- ────────────────────────────────────────
drop policy if exists "parent_messages_select" on public.parent_messages;
create policy "parent_messages_select" on public.parent_messages
  for select using (
    sender_id = auth.uid()
    or receiver_id = auth.uid()
    or public.get_my_role() = 'admin'
  );

drop policy if exists "parent_messages_insert" on public.parent_messages;
create policy "parent_messages_insert" on public.parent_messages
  for insert with check (sender_id = auth.uid());

drop policy if exists "parent_messages_update" on public.parent_messages;
create policy "parent_messages_update" on public.parent_messages
  for update using (receiver_id = auth.uid());

-- ────────────────────────────────────────
-- invitation_codes 정책
-- ────────────────────────────────────────
drop policy if exists "invitation_codes_select" on public.invitation_codes;
create policy "invitation_codes_select" on public.invitation_codes
  for select using (true);

drop policy if exists "invitation_codes_admin" on public.invitation_codes;
create policy "invitation_codes_admin" on public.invitation_codes
  for all using (public.get_my_role() = 'admin');

-- ────────────────────────────────────────
-- morning_reports 정책
-- ────────────────────────────────────────
drop policy if exists "morning_reports_select" on public.morning_reports;
create policy "morning_reports_select" on public.morning_reports
  for select using (
    parent_id = auth.uid()
    or exists (
      select 1 from public.students s
      where s.id = morning_reports.student_id
        and s.organization_id = public.get_my_org()
    )
    or public.get_my_role() = 'admin'
  );

drop policy if exists "morning_reports_insert" on public.morning_reports;
create policy "morning_reports_insert" on public.morning_reports
  for insert with check (parent_id = auth.uid());

drop policy if exists "morning_reports_update" on public.morning_reports;
create policy "morning_reports_update" on public.morning_reports
  for update using (parent_id = auth.uid());

-- ────────────────────────────────────────
-- care_team 정책
-- ────────────────────────────────────────
drop policy if exists "care_team_select" on public.care_team;
create policy "care_team_select" on public.care_team
  for select using (
    member_id = auth.uid()
    or exists (
      select 1 from public.students s
      where s.id = care_team.student_id
        and (s.organization_id = public.get_my_org() or s.parent_id = auth.uid())
    )
    or public.get_my_role() = 'admin'
  );

drop policy if exists "care_team_manage" on public.care_team;
create policy "care_team_manage" on public.care_team
  for all using (public.get_my_role() in ('teacher', 'admin'));

-- ────────────────────────────────────────
-- ai_care_reports 정책
-- ────────────────────────────────────────
drop policy if exists "ai_care_reports_select" on public.ai_care_reports;
create policy "ai_care_reports_select" on public.ai_care_reports
  for select using (
    exists (
      select 1 from public.students s
      where s.id = ai_care_reports.student_id
        and (s.organization_id = public.get_my_org() or s.parent_id = auth.uid())
    )
    or public.get_my_role() = 'admin'
  );

-- ────────────────────────────────────────
-- notifications 정책
-- ────────────────────────────────────────
drop policy if exists "notifications_select" on public.notifications;
create policy "notifications_select" on public.notifications
  for select using (user_id = auth.uid());

drop policy if exists "notifications_update" on public.notifications;
create policy "notifications_update" on public.notifications
  for update using (user_id = auth.uid());

-- ────────────────────────────────────────
-- 트리거: 신규 가입 시 profiles 자동 생성
-- ────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, avatar_url, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email, ''),
    new.raw_user_meta_data->>'avatar_url',
    'pending'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ────────────────────────────────────────
-- Realtime 구독
-- ────────────────────────────────────────
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.behavior_events;  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.parent_messages;  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_records;    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.morning_reports;  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ────────────────────────────────────────
-- 시드 데이터: 기관 + 초대코드
-- ────────────────────────────────────────
INSERT INTO public.organizations (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', '해오름 발달장애인복지관')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.invitation_codes (code, organization_id, max_uses)
VALUES ('CAREVIA-BETA-001', '00000000-0000-0000-0000-000000000001', 50)
ON CONFLICT (code) DO NOTHING;

-- ✅ 전체 셋업 완료
SELECT '✅ 셋업 완료!' AS result;
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;
