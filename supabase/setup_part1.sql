-- ============================================================
-- CareVia 전체 셋업 Part 1: 기본 테이블 + RLS
-- Supabase Dashboard → SQL Editor에서 실행
-- ============================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ORGANIZATIONS
create table if not exists public.organizations (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  created_at timestamptz not null default now()
);

-- 3. PROFILES (status 컬럼 포함)
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  name            text not null default '',
  role            text not null check (role in ('teacher', 'parent', 'admin')) default 'teacher',
  status          text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  organization_id uuid references public.organizations(id) on delete set null,
  avatar_url      text,
  created_at      timestamptz not null default now()
);

-- 4. STUDENTS
create table if not exists public.students (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  phone           text not null default '',
  organization_id uuid not null references public.organizations(id) on delete cascade,
  parent_id       uuid references public.profiles(id) on delete set null,
  avatar_url      text,
  created_at      timestamptz not null default now()
);

-- 5. DAILY_RECORDS
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

-- 6. EVENT_GROUPS
create table if not exists public.event_groups (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null default '',
  organization_id uuid not null references public.organizations(id) on delete cascade,
  period          text not null default 'today',
  channel         text not null default '',
  auto_approve    boolean not null default false,
  created_at      timestamptz not null default now()
);

-- 7. BEHAVIOR_EVENTS
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

-- 8. PARENT_MESSAGES
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

-- 9. INVITATION_CODES
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

-- 10. MORNING_REPORTS
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

-- 11. CARE_TEAM
create table if not exists public.care_team (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid not null references public.students(id) on delete cascade,
  member_id   uuid not null references public.profiles(id) on delete cascade,
  role        text not null check (role in ('lead', 'support', 'observer')),
  created_at  timestamptz not null default now(),
  unique (student_id, member_id)
);

-- 12. AI_CARE_REPORTS
create table if not exists public.ai_care_reports (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid not null references public.students(id) on delete cascade,
  report_date date not null default current_date,
  care_level  text not null check (care_level in ('low', 'medium', 'high', 'critical')),
  summary     text not null,
  details     jsonb,
  created_at  timestamptz not null default now()
);

-- 13. NOTIFICATIONS
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

-- ✅ Part 1 완료 — 테이블 확인
select table_name from information_schema.tables
where table_schema = 'public' order by table_name;
