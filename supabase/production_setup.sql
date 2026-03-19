-- ============================================================
-- CareVia 프로덕션 설정 SQL
-- Supabase SQL Editor에서 한 번에 실행하세요
-- ============================================================

-- ========== 1. 누락 테이블 생성 (IF NOT EXISTS) ==========

-- team_meetings (돌봄팀 미팅)
create table if not exists public.team_meetings (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title           text not null,
  meeting_type    text not null check (meeting_type in ('regular', 'case', 'parent', 'external')) default 'regular',
  meeting_date    date not null,
  meeting_time    text not null default '',
  location        text not null default '',
  agenda          jsonb not null default '[]'::jsonb,
  notes           text,
  created_by      uuid references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now()
);

alter table public.team_meetings enable row level security;

-- team_meetings 정책 (이미 존재하면 무시)
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'team_meetings' and policyname = 'team_meetings_select') then
    create policy "team_meetings_select" on public.team_meetings
      for select using (
        organization_id = public.get_my_org()
        or public.get_my_role() = 'admin'
      );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'team_meetings' and policyname = 'team_meetings_manage') then
    create policy "team_meetings_manage" on public.team_meetings
      for all using (public.get_my_role() in ('teacher', 'admin'));
  end if;
end $$;

-- team_meeting_participants (미팅 참석자)
create table if not exists public.team_meeting_participants (
  id         uuid primary key default uuid_generate_v4(),
  meeting_id uuid not null references public.team_meetings(id) on delete cascade,
  member_id  uuid not null references public.profiles(id) on delete cascade,
  unique (meeting_id, member_id)
);

alter table public.team_meeting_participants enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'team_meeting_participants' and policyname = 'team_meeting_participants_select') then
    create policy "team_meeting_participants_select" on public.team_meeting_participants
      for select using (
        exists (
          select 1 from public.team_meetings m
          where m.id = team_meeting_participants.meeting_id
          and (m.organization_id = public.get_my_org() or public.get_my_role() = 'admin')
        )
      );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'team_meeting_participants' and policyname = 'team_meeting_participants_manage') then
    create policy "team_meeting_participants_manage" on public.team_meeting_participants
      for all using (public.get_my_role() in ('teacher', 'admin'));
  end if;
end $$;

-- team_activities (돌봄팀 활동 기록)
create table if not exists public.team_activities (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  member_id       uuid not null references public.profiles(id) on delete cascade,
  activity_type   text not null check (activity_type in ('note', 'report', 'meeting', 'alert', 'update')) default 'note',
  action          text not null,
  target          text not null default '',
  created_at      timestamptz not null default now()
);

alter table public.team_activities enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'team_activities' and policyname = 'team_activities_select') then
    create policy "team_activities_select" on public.team_activities
      for select using (
        organization_id = public.get_my_org()
        or public.get_my_role() = 'admin'
      );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'team_activities' and policyname = 'team_activities_manage') then
    create policy "team_activities_manage" on public.team_activities
      for all using (public.get_my_role() in ('teacher', 'admin'));
  end if;
end $$;

-- Realtime 구독 (이미 있으면 무시)
do $$ begin
  alter publication supabase_realtime add table public.team_meetings;
exception when others then null;
end $$;


-- ========== 2. INSERT RLS 정책 추가 (누락 3건) ==========

-- behavior_events: SELECT/UPDATE만 있고 INSERT 없음
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'behavior_events' and policyname = 'behavior_events_insert') then
    create policy "behavior_events_insert" on public.behavior_events
      for insert with check (public.get_my_role() in ('teacher', 'admin'));
  end if;
end $$;

-- ai_care_reports: SELECT만 있고 INSERT 없음
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'ai_care_reports' and policyname = 'ai_care_reports_insert') then
    create policy "ai_care_reports_insert" on public.ai_care_reports
      for insert with check (public.get_my_role() in ('teacher', 'admin'));
  end if;
end $$;

-- notifications: SELECT/UPDATE만 있고 INSERT 없음
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'notifications' and policyname = 'notifications_insert') then
    create policy "notifications_insert" on public.notifications
      for insert with check (public.get_my_role() in ('teacher', 'admin'));
  end if;
end $$;


-- ========== 3. DB 인덱스 추가 ==========

create index if not exists idx_daily_records_student_date
  on daily_records(student_id, date);

create index if not exists idx_behavior_events_student_date
  on behavior_events(student_id, occurred_at);

create index if not exists idx_parent_messages_student
  on parent_messages(student_id, created_at);


-- ========== 완료 ==========
-- 아래 쿼리로 결과 확인:
select tablename from pg_tables where schemaname = 'public' order by tablename;
