-- ============================================================
-- Cavisam (CareVia) Database Schema
-- Supabase SQL Editor에서 순서대로 실행하세요
-- ============================================================

-- --------------------------------------------------------
-- 1. EXTENSIONS
-- --------------------------------------------------------
create extension if not exists "uuid-ossp";

-- --------------------------------------------------------
-- 2. ORGANIZATIONS (기관/센터)
-- --------------------------------------------------------
create table if not exists public.organizations (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------
-- 3. PROFILES (사용자 프로필 - auth.users 확장)
-- --------------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  name            text not null default '',
  role            text not null check (role in ('teacher', 'parent', 'admin')) default 'teacher',
  organization_id uuid references public.organizations(id) on delete set null,
  avatar_url      text,
  created_at      timestamptz not null default now()
);

-- --------------------------------------------------------
-- 4. STUDENTS (대상 학생)
-- --------------------------------------------------------
create table if not exists public.students (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  phone           text not null default '',
  organization_id uuid not null references public.organizations(id) on delete cascade,
  parent_id       uuid references public.profiles(id) on delete set null,
  avatar_url      text,
  created_at      timestamptz not null default now()
);

-- --------------------------------------------------------
-- 5. DAILY_RECORDS (일일 컨디션 기록)
-- --------------------------------------------------------
create table if not exists public.daily_records (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid not null references public.students(id) on delete cascade,
  date        date not null default current_date,
  sleep       text not null default '',
  condition   text not null check (condition in ('good', 'normal', 'bad', 'very_bad')) default 'normal',
  meal        text not null check (meal in ('good', 'normal', 'none')) default 'normal',
  bowel       text not null check (bowel in ('normal', 'none')) default 'normal',
  note        text not null default '',
  medication  text not null default '',
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now(),
  unique (student_id, date)
);

-- --------------------------------------------------------
-- 6. EVENT_GROUPS (이벤트 그룹 설정)
-- --------------------------------------------------------
create table if not exists public.event_groups (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null default '',
  organization_id uuid not null references public.organizations(id) on delete cascade,
  period          text not null default 'today',
  channel         text not null default '',
  auto_approve    boolean not null default false,
  created_at      timestamptz not null default now()
);

-- --------------------------------------------------------
-- 7. BEHAVIOR_EVENTS (행동 이벤트)
-- --------------------------------------------------------
create table if not exists public.behavior_events (
  id             uuid primary key default uuid_generate_v4(),
  student_id     uuid references public.students(id) on delete set null,
  type           text not null check (type in ('self_harm', 'harm_others', 'obsession')),
  occurred_at    timestamptz not null default now(),
  thumbnail_url  text,
  label          text not null default '',
  confirmed      boolean not null default false,
  excluded       boolean not null default false,
  event_group_id uuid references public.event_groups(id) on delete set null,
  created_at     timestamptz not null default now()
);

-- --------------------------------------------------------
-- 8. PARENT_MESSAGES (보호자 소통방 메시지)
-- --------------------------------------------------------
create table if not exists public.parent_messages (
  id           uuid primary key default uuid_generate_v4(),
  student_id   uuid not null references public.students(id) on delete cascade,
  sender_id    uuid not null references public.profiles(id) on delete cascade,
  receiver_id  uuid not null references public.profiles(id) on delete cascade,
  content      text not null,
  message_type text not null check (message_type in ('text', 'daily_report')) default 'text',
  is_read      boolean not null default false,
  created_at   timestamptz not null default now()
);

-- --------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS)
-- --------------------------------------------------------
alter table public.organizations    enable row level security;
alter table public.profiles         enable row level security;
alter table public.students         enable row level security;
alter table public.daily_records    enable row level security;
alter table public.event_groups     enable row level security;
alter table public.behavior_events  enable row level security;
alter table public.parent_messages  enable row level security;

-- Helper function: 현재 사용자의 role 반환
create or replace function public.get_my_role()
returns text language sql security definer stable as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Helper function: 현재 사용자의 organization_id 반환
create or replace function public.get_my_org()
returns uuid language sql security definer stable as $$
  select organization_id from public.profiles where id = auth.uid();
$$;

-- organizations: 같은 기관 구성원 또는 admin
create policy "organizations_select" on public.organizations
  for select using (
    id = public.get_my_org()
    or public.get_my_role() = 'admin'
  );

-- profiles: 자신의 프로필 + 같은 기관 구성원
create policy "profiles_select" on public.profiles
  for select using (
    id = auth.uid()
    or organization_id = public.get_my_org()
    or public.get_my_role() = 'admin'
  );

create policy "profiles_insert" on public.profiles
  for insert with check (id = auth.uid());

create policy "profiles_update" on public.profiles
  for update using (id = auth.uid() or public.get_my_role() = 'admin');

-- students: 교사(같은 기관), 보호자(자신의 자녀), admin
create policy "students_select" on public.students
  for select using (
    organization_id = public.get_my_org()
    or parent_id = auth.uid()
    or public.get_my_role() = 'admin'
  );

create policy "students_insert" on public.students
  for insert with check (
    public.get_my_role() in ('teacher', 'admin')
  );

create policy "students_update" on public.students
  for update using (
    organization_id = public.get_my_org()
    or public.get_my_role() = 'admin'
  );

create policy "students_delete" on public.students
  for delete using (public.get_my_role() = 'admin');

-- daily_records: 같은 기관 교사 + 해당 학생 보호자
create policy "daily_records_select" on public.daily_records
  for select using (
    exists (
      select 1 from public.students s
      where s.id = daily_records.student_id
      and (s.organization_id = public.get_my_org() or s.parent_id = auth.uid())
    )
    or public.get_my_role() = 'admin'
  );

create policy "daily_records_insert" on public.daily_records
  for insert with check (
    public.get_my_role() in ('teacher', 'admin')
  );

create policy "daily_records_update" on public.daily_records
  for update using (
    public.get_my_role() in ('teacher', 'admin')
  );

-- event_groups: 같은 기관
create policy "event_groups_select" on public.event_groups
  for select using (
    organization_id = public.get_my_org()
    or public.get_my_role() = 'admin'
  );

create policy "event_groups_all" on public.event_groups
  for all using (public.get_my_role() in ('teacher', 'admin'));

-- behavior_events: 같은 기관 교사/admin
create policy "behavior_events_select" on public.behavior_events
  for select using (
    exists (
      select 1 from public.students s
      where s.id = behavior_events.student_id
      and s.organization_id = public.get_my_org()
    )
    or public.get_my_role() = 'admin'
  );

create policy "behavior_events_update" on public.behavior_events
  for update using (
    public.get_my_role() in ('teacher', 'admin')
  );

-- parent_messages: 발신자 또는 수신자
create policy "parent_messages_select" on public.parent_messages
  for select using (
    sender_id = auth.uid()
    or receiver_id = auth.uid()
    or public.get_my_role() = 'admin'
  );

create policy "parent_messages_insert" on public.parent_messages
  for insert with check (sender_id = auth.uid());

create policy "parent_messages_update" on public.parent_messages
  for update using (receiver_id = auth.uid());

-- --------------------------------------------------------
-- 10. TRIGGER: 신규 가입 시 profiles 자동 생성
-- --------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email, ''),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------------------------
-- 11. PROFILES 확장: 승인 상태
-- --------------------------------------------------------
alter table public.profiles
  add column if not exists status text not null default 'pending'
  check (status in ('pending', 'approved', 'rejected'));

-- --------------------------------------------------------
-- 12. INVITATION_CODES (초대코드)
-- --------------------------------------------------------
create table if not exists public.invitation_codes (
  id              uuid primary key default uuid_generate_v4(),
  code            text not null unique,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  max_uses        int not null default 10,
  used_count      int not null default 0,
  expires_at      timestamptz,
  created_by      uuid references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now()
);

alter table public.invitation_codes enable row level security;

-- admin만 초대코드 관리, 일반 사용자는 코드 검증용 조회만
create policy "invitation_codes_select" on public.invitation_codes
  for select using (true);

create policy "invitation_codes_admin" on public.invitation_codes
  for all using (public.get_my_role() = 'admin');

-- --------------------------------------------------------
-- 13. MORNING_REPORTS (등원 전 한마디)
-- --------------------------------------------------------
create table if not exists public.morning_reports (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid not null references public.students(id) on delete cascade,
  parent_id   uuid not null references public.profiles(id),
  date        date not null default current_date,
  sleep_time  text,
  condition   text check (condition in ('good', 'normal', 'bad', 'very_bad')),
  meal        text check (meal in ('good', 'normal', 'none')),
  bowel       text check (bowel in ('normal', 'none')),
  medication  text,
  note        text,
  created_at  timestamptz not null default now(),
  unique (student_id, date)
);

alter table public.morning_reports enable row level security;

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

create policy "morning_reports_insert" on public.morning_reports
  for insert with check (parent_id = auth.uid());

create policy "morning_reports_update" on public.morning_reports
  for update using (parent_id = auth.uid());

-- --------------------------------------------------------
-- 14. CARE_TEAM (케어팀)
-- --------------------------------------------------------
create table if not exists public.care_team (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid not null references public.students(id) on delete cascade,
  member_id   uuid not null references public.profiles(id) on delete cascade,
  role        text not null check (role in ('lead', 'support', 'observer')),
  created_at  timestamptz not null default now(),
  unique (student_id, member_id)
);

alter table public.care_team enable row level security;

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

create policy "care_team_manage" on public.care_team
  for all using (public.get_my_role() in ('teacher', 'admin'));

-- --------------------------------------------------------
-- 15. AI_CARE_REPORTS (AI 케어 분석 리포트)
-- --------------------------------------------------------
create table if not exists public.ai_care_reports (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid not null references public.students(id) on delete cascade,
  report_date date not null default current_date,
  care_level  text not null check (care_level in ('low', 'medium', 'high', 'critical')),
  summary     text not null,
  details     jsonb,
  created_at  timestamptz not null default now()
);

alter table public.ai_care_reports enable row level security;

create policy "ai_care_reports_select" on public.ai_care_reports
  for select using (
    exists (
      select 1 from public.students s
      where s.id = ai_care_reports.student_id
      and (s.organization_id = public.get_my_org() or s.parent_id = auth.uid())
    )
    or public.get_my_role() = 'admin'
  );

-- --------------------------------------------------------
-- 16. NOTIFICATIONS (알림)
-- --------------------------------------------------------
create table if not exists public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null,
  title       text not null,
  body        text,
  is_read     boolean not null default false,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "notifications_select" on public.notifications
  for select using (user_id = auth.uid());

create policy "notifications_update" on public.notifications
  for update using (user_id = auth.uid());

-- --------------------------------------------------------
-- 17. TEAM_MEETINGS (돌봄팀 미팅)
-- --------------------------------------------------------
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

create policy "team_meetings_select" on public.team_meetings
  for select using (
    organization_id = public.get_my_org()
    or public.get_my_role() = 'admin'
  );

create policy "team_meetings_manage" on public.team_meetings
  for all using (public.get_my_role() in ('teacher', 'admin'));

-- 미팅 참석자
create table if not exists public.team_meeting_participants (
  id         uuid primary key default uuid_generate_v4(),
  meeting_id uuid not null references public.team_meetings(id) on delete cascade,
  member_id  uuid not null references public.profiles(id) on delete cascade,
  unique (meeting_id, member_id)
);

alter table public.team_meeting_participants enable row level security;

create policy "team_meeting_participants_select" on public.team_meeting_participants
  for select using (
    exists (
      select 1 from public.team_meetings m
      where m.id = team_meeting_participants.meeting_id
      and (m.organization_id = public.get_my_org() or public.get_my_role() = 'admin')
    )
  );

create policy "team_meeting_participants_manage" on public.team_meeting_participants
  for all using (public.get_my_role() in ('teacher', 'admin'));

-- --------------------------------------------------------
-- 18. TEAM_ACTIVITIES (돌봄팀 활동 기록)
-- --------------------------------------------------------
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

create policy "team_activities_select" on public.team_activities
  for select using (
    organization_id = public.get_my_org()
    or public.get_my_role() = 'admin'
  );

create policy "team_activities_manage" on public.team_activities
  for all using (public.get_my_role() in ('teacher', 'admin'));

-- --------------------------------------------------------
-- 19. REALTIME 구독 활성화
-- --------------------------------------------------------
alter publication supabase_realtime add table public.behavior_events;
alter publication supabase_realtime add table public.parent_messages;
alter publication supabase_realtime add table public.daily_records;
alter publication supabase_realtime add table public.morning_reports;
alter publication supabase_realtime add table public.notifications;
