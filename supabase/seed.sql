-- ============================================================
-- Cavisam Seed Data (테스트용)
-- schema.sql 실행 후에 실행하세요
-- ============================================================

-- 1. 기관 추가
insert into public.organizations (id, name) values
  ('00000000-0000-0000-0000-000000000001', '해오름 발달장애인복지관')
on conflict (id) do nothing;

-- 2. 학생 추가 (교사 계정 생성 후 organization_id 확인 후 실행)
-- 실제 교사 계정 로그인 후 아래 쿼리에서 organization_id를 수정하세요
insert into public.students (id, name, phone, organization_id) values
  ('00000000-0000-0000-0001-000000000001', '김민준', '010-1234-5678', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0001-000000000002', '이서연', '010-2345-6789', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0001-000000000003', '박지호', '010-3456-7890', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0001-000000000004', '최수아', '010-4567-8901', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0001-000000000005', '정도현', '010-5678-9012', '00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

-- 3. 오늘 일일 기록 추가
insert into public.daily_records (student_id, date, sleep, condition, meal, bowel, note, medication) values
  ('00000000-0000-0000-0001-000000000001', current_date, '8시간', 'good', 'good', 'normal', '기분이 좋은 편', '리스페리돈 0.5mg'),
  ('00000000-0000-0000-0001-000000000002', current_date, '6시간', 'normal', 'normal', 'normal', '', ''),
  ('00000000-0000-0000-0001-000000000003', current_date, '5시간', 'bad', 'none', 'none', '어제 잠을 잘 못 잔 것 같음', '아리피프라졸 5mg'),
  ('00000000-0000-0000-0001-000000000004', current_date, '9시간', 'good', 'good', 'normal', '활발한 모습', ''),
  ('00000000-0000-0000-0001-000000000005', current_date, '7시간', 'very_bad', 'normal', 'normal', '자해 행동 2회 관찰', '클로나제팜 0.25mg')
on conflict (student_id, date) do nothing;

-- 4. 이벤트 그룹 추가
insert into public.event_groups (id, name, organization_id, period, channel, auto_approve) values
  ('00000000-0000-0000-0002-000000000001', '기본 그룹', '00000000-0000-0000-0000-000000000001', 'today', 'CH01', false)
on conflict (id) do nothing;

-- 5. 행동 이벤트 샘플
insert into public.behavior_events (student_id, type, occurred_at, label, confirmed, excluded, event_group_id) values
  ('00000000-0000-0000-0001-000000000005', 'self_harm', now() - interval '2 hours', '자해행동', false, false, '00000000-0000-0000-0002-000000000001'),
  ('00000000-0000-0000-0001-000000000005', 'self_harm', now() - interval '1 hour', '자해행동', false, false, '00000000-0000-0000-0002-000000000001'),
  ('00000000-0000-0000-0001-000000000003', 'harm_others', now() - interval '3 hours', '타해행동', false, false, '00000000-0000-0000-0002-000000000001'),
  ('00000000-0000-0000-0001-000000000001', 'obsession', now() - interval '4 hours', '집착행동', true, false, '00000000-0000-0000-0002-000000000001')
on conflict do nothing;
