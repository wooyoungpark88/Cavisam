-- ============================================================
-- CareVia 클로즈베타 시드 데이터
-- 기관, 학생, 일일기록, 행동이벤트, 메시지, 등원전한마디, 케어팀
-- ============================================================

-- 기관 (이미 존재하면 무시)
INSERT INTO public.organizations (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', '해오름 발달장애인복지관')
ON CONFLICT (id) DO NOTHING;

-- ── 교사 프로필 (Supabase Auth 없이 직접 삽입 — 테스트용) ──
-- 실제 auth.users에 없으므로 profiles FK를 우회하기 위해 auth.users에도 삽입
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at, instance_id, aud, role)
VALUES
  ('00000000-0000-0000-0000-000000000010', 'teacher@carevia.test',
   '{"full_name":"김수진"}', now(), now(),
   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, name, role, status, organization_id)
VALUES ('00000000-0000-0000-0000-000000000010', '김수진', 'teacher', 'approved', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO UPDATE SET role = 'teacher', status = 'approved', organization_id = '00000000-0000-0000-0000-000000000001';

-- 현재 로그인한 보호자(우영박)도 기관 연결 확인
UPDATE public.profiles
SET organization_id = '00000000-0000-0000-0000-000000000001',
    status = 'approved'
WHERE name = '우영박' AND organization_id IS NOT NULL;

-- ── 학생 7명 ──
INSERT INTO public.students (id, name, phone, organization_id, parent_id) VALUES
  ('00000000-0000-0000-0001-000000000001', '김민조', '010-1234-5678', '00000000-0000-0000-0000-000000000001', NULL),
  ('00000000-0000-0000-0001-000000000002', '이서연', '010-2345-6789', '00000000-0000-0000-0000-000000000001', NULL),
  ('00000000-0000-0000-0001-000000000003', '박지호', '010-3456-7890', '00000000-0000-0000-0000-000000000001', NULL),
  ('00000000-0000-0000-0001-000000000004', '최수아', '010-4567-8901', '00000000-0000-0000-0000-000000000001', NULL),
  ('00000000-0000-0000-0001-000000000005', '정도현', '010-5678-9012', '00000000-0000-0000-0000-000000000001', NULL),
  ('00000000-0000-0000-0001-000000000006', '한유진', '010-6789-0123', '00000000-0000-0000-0000-000000000001', NULL),
  ('00000000-0000-0000-0001-000000000007', '오태민', '010-7890-1234', '00000000-0000-0000-0000-000000000001', NULL)
ON CONFLICT (id) DO NOTHING;

-- 보호자(우영박)에게 김민조를 자녀로 연결
UPDATE public.students
SET parent_id = (SELECT id FROM public.profiles WHERE name = '우영박' LIMIT 1)
WHERE id = '00000000-0000-0000-0001-000000000001';

-- ── 오늘 일일 기록 7건 ──
INSERT INTO public.daily_records (student_id, date, sleep, condition, meal, bowel, note, medication, created_by) VALUES
  ('00000000-0000-0000-0001-000000000001', current_date, '8시간', 'good', 'good', 'normal', '미술 시간에 집중력이 좋았음', '리스페리돈 0.5mg', '00000000-0000-0000-0000-000000000010'),
  ('00000000-0000-0000-0001-000000000002', current_date, '5시간', 'bad', 'normal', 'normal', '어제 잠을 잘 못 잤다고 함, 오전에 짜증 잦음', '아리피프라졸 5mg', '00000000-0000-0000-0000-000000000010'),
  ('00000000-0000-0000-0001-000000000003', current_date, '7시간', 'normal', 'good', 'normal', '', '', '00000000-0000-0000-0000-000000000010'),
  ('00000000-0000-0000-0001-000000000004', current_date, '9시간', 'good', 'good', 'normal', '오늘 활발하고 기분 좋은 모습', '', '00000000-0000-0000-0000-000000000010'),
  ('00000000-0000-0000-0001-000000000005', current_date, '4시간', 'very_bad', 'none', 'none', '자해 행동 2회 관찰, 긴급 개입 필요', '클로나제팜 0.25mg', '00000000-0000-0000-0000-000000000010'),
  ('00000000-0000-0000-0001-000000000006', current_date, '8시간', 'good', 'good', 'normal', '점심 후 배가 아프다는 제스처 있었음', '메틸페니데이트 10mg', '00000000-0000-0000-0000-000000000010'),
  ('00000000-0000-0000-0001-000000000007', current_date, '6시간', 'bad', 'normal', 'normal', '등원 시 울음 반응, 안정화 10분 소요', '발프로산 250mg', '00000000-0000-0000-0000-000000000010')
ON CONFLICT (student_id, date) DO NOTHING;

-- ── 행동 이벤트 (최근 30일, 다양한 학생) ──
INSERT INTO public.behavior_events (student_id, type, occurred_at, label, confirmed) VALUES
  -- 김민조 - 오늘
  ('00000000-0000-0000-0001-000000000001', 'self_harm', now() - interval '2 hours', '손 깨물기', true),
  -- 정도현 - 오늘
  ('00000000-0000-0000-0001-000000000005', 'self_harm', now() - interval '3 hours', '머리 박기', true),
  ('00000000-0000-0000-0001-000000000005', 'self_harm', now() - interval '5 hours', '손 깨물기', true),
  -- 이서연 - 오늘
  ('00000000-0000-0000-0001-000000000002', 'harm_others', now() - interval '4 hours', '친구 밀기', true),
  -- 오태민 - 오늘
  ('00000000-0000-0000-0001-000000000007', 'obsession', now() - interval '1 hour', '물건 정렬 집착', true),
  -- 어제
  ('00000000-0000-0000-0001-000000000001', 'self_harm', now() - interval '1 day 2 hours', '손 깨물기', true),
  ('00000000-0000-0000-0001-000000000005', 'harm_others', now() - interval '1 day 3 hours', '친구 때리기', true),
  ('00000000-0000-0000-0001-000000000002', 'obsession', now() - interval '1 day 5 hours', '특정 물건 집착', true),
  -- 2일 전
  ('00000000-0000-0000-0001-000000000001', 'self_harm', now() - interval '2 days 3 hours', '손 깨물기', true),
  ('00000000-0000-0000-0001-000000000003', 'harm_others', now() - interval '2 days 4 hours', '친구 밀기', true),
  ('00000000-0000-0000-0001-000000000005', 'self_harm', now() - interval '2 days 2 hours', '머리 박기', true),
  ('00000000-0000-0000-0001-000000000005', 'obsession', now() - interval '2 days 6 hours', '반복 행동', true),
  -- 3~7일 전
  ('00000000-0000-0000-0001-000000000001', 'self_harm', now() - interval '3 days 3 hours', '손 깨물기', true),
  ('00000000-0000-0000-0001-000000000002', 'harm_others', now() - interval '4 days 2 hours', '물건 던지기', true),
  ('00000000-0000-0000-0001-000000000005', 'self_harm', now() - interval '5 days 4 hours', '머리 박기', true),
  ('00000000-0000-0000-0001-000000000005', 'self_harm', now() - interval '5 days 6 hours', '손 깨물기', true),
  ('00000000-0000-0000-0001-000000000007', 'obsession', now() - interval '6 days 3 hours', '물건 정렬 집착', true),
  ('00000000-0000-0000-0001-000000000004', 'obsession', now() - interval '7 days 2 hours', '반복 질문', true),
  -- 8~14일 전
  ('00000000-0000-0000-0001-000000000001', 'self_harm', now() - interval '8 days 3 hours', '손 깨물기', true),
  ('00000000-0000-0000-0001-000000000005', 'self_harm', now() - interval '9 days 4 hours', '머리 박기', true),
  ('00000000-0000-0000-0001-000000000002', 'harm_others', now() - interval '10 days 2 hours', '친구 밀기', true),
  ('00000000-0000-0000-0001-000000000003', 'obsession', now() - interval '11 days 5 hours', '특정 물건 집착', true),
  ('00000000-0000-0000-0001-000000000005', 'harm_others', now() - interval '12 days 3 hours', '물건 던지기', true),
  ('00000000-0000-0000-0001-000000000007', 'self_harm', now() - interval '13 days 4 hours', '손 깨물기', true),
  ('00000000-0000-0000-0001-000000000001', 'obsession', now() - interval '14 days 2 hours', '반복 행동', true),
  -- 15~30일 전
  ('00000000-0000-0000-0001-000000000005', 'self_harm', now() - interval '15 days 3 hours', '머리 박기', true),
  ('00000000-0000-0000-0001-000000000001', 'self_harm', now() - interval '18 days 4 hours', '손 깨물기', true),
  ('00000000-0000-0000-0001-000000000002', 'harm_others', now() - interval '20 days 2 hours', '친구 때리기', true),
  ('00000000-0000-0000-0001-000000000005', 'obsession', now() - interval '22 days 5 hours', '반복 행동', true),
  ('00000000-0000-0000-0001-000000000003', 'self_harm', now() - interval '25 days 3 hours', '손 깨물기', true),
  ('00000000-0000-0000-0001-000000000007', 'harm_others', now() - interval '28 days 4 hours', '물건 던지기', true);

-- ── 보호자 소통 메시지 (김민조 관련) ──
INSERT INTO public.parent_messages (student_id, sender_id, receiver_id, content, message_type, is_read, created_at) VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000010',
   (SELECT id FROM public.profiles WHERE name = '우영박' LIMIT 1),
   '안녕하세요! 민조 어머님, 소통방이 개설되었습니다. 궁금한 점이나 전달사항이 있으시면 편하게 남겨주세요 😊', 'text', true, now() - interval '3 days'),

  ('00000000-0000-0000-0001-000000000001',
   (SELECT id FROM public.profiles WHERE name = '우영박' LIMIT 1),
   '00000000-0000-0000-0000-000000000010',
   '안녕하세요 선생님! 잘 부탁드립니다. 민조가 요즘 아침에 학교 가기 싫다고 해서 걱정이 됐는데요.', 'text', true, now() - interval '3 days' + interval '30 minutes'),

  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000010',
   (SELECT id FROM public.profiles WHERE name = '우영박' LIMIT 1),
   '네 어머님! 오늘 등원 때 잠깐 주저했지만, 아침 루틴 시작하고 나서 금세 적응했어요. 지금은 친구들과 블록 활동 중이에요 😊', 'text', true, now() - interval '2 days'),

  ('00000000-0000-0000-0001-000000000001',
   (SELECT id FROM public.profiles WHERE name = '우영박' LIMIT 1),
   '00000000-0000-0000-0000-000000000010',
   '다행이에요 감사합니다! 어제 밤에 늦게 잤거든요. 수면이 부족하면 더 예민해지는 것 같아서요.', 'text', true, now() - interval '2 days' + interval '20 minutes'),

  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000010',
   (SELECT id FROM public.profiles WHERE name = '우영박' LIMIT 1),
   '오늘 민조가 미술 시간에 집중력이 정말 좋았어요! 점토로 동물을 만들었는데 완성도가 높아서 놀랐습니다. 집에서도 칭찬 한번 부탁드려요 💪', 'text', false, now() - interval '2 hours');

-- ── 등원 전 한마디 (최근 7일) ──
INSERT INTO public.morning_reports (student_id, parent_id, date, sleep_time, condition, meal, bowel, medication, note) VALUES
  ('00000000-0000-0000-0001-000000000001', (SELECT id FROM public.profiles WHERE name = '우영박' LIMIT 1),
   current_date, '22:00 ~ 06:30', 'normal', 'good', 'normal', '리스페리돈 0.5mg 복용 완료', ''),
  ('00000000-0000-0000-0001-000000000001', (SELECT id FROM public.profiles WHERE name = '우영박' LIMIT 1),
   current_date - 1, '21:30 ~ 07:00', 'good', 'good', 'normal', '복용 완료', '주말에 많이 쉬었어요.'),
  ('00000000-0000-0000-0001-000000000001', (SELECT id FROM public.profiles WHERE name = '우영박' LIMIT 1),
   current_date - 2, '23:00 ~ 05:30', 'bad', 'normal', 'none', '기관 요청', '열이 조금 있어요. 확인 부탁드려요.'),
  ('00000000-0000-0000-0001-000000000001', (SELECT id FROM public.profiles WHERE name = '우영박' LIMIT 1),
   current_date - 3, '22:00 ~ 07:00', 'good', 'good', 'normal', '복용 완료', ''),
  ('00000000-0000-0000-0001-000000000001', (SELECT id FROM public.profiles WHERE name = '우영박' LIMIT 1),
   current_date - 4, '21:00 ~ 06:00', 'normal', 'good', 'normal', '복용 완료', '어제 늦게 잠들었어요.'),
  ('00000000-0000-0000-0001-000000000001', (SELECT id FROM public.profiles WHERE name = '우영박' LIMIT 1),
   current_date - 5, '22:30 ~ 07:30', 'good', 'good', 'normal', '복용 완료', ''),
  ('00000000-0000-0000-0001-000000000001', (SELECT id FROM public.profiles WHERE name = '우영박' LIMIT 1),
   current_date - 6, '00:30 ~ 06:00', 'bad', 'none', 'none', '', '밤에 많이 울었어요.')
ON CONFLICT (student_id, date) DO NOTHING;

-- ── 케어팀 ──
INSERT INTO public.care_team (student_id, member_id, role) VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000010', 'lead')
ON CONFLICT (student_id, member_id) DO NOTHING;

-- ✅ 시드 완료 확인
SELECT 'students' AS table_name, count(*) AS cnt FROM public.students
UNION ALL SELECT 'daily_records', count(*) FROM public.daily_records
UNION ALL SELECT 'behavior_events', count(*) FROM public.behavior_events
UNION ALL SELECT 'parent_messages', count(*) FROM public.parent_messages
UNION ALL SELECT 'morning_reports', count(*) FROM public.morning_reports
UNION ALL SELECT 'care_team', count(*) FROM public.care_team
UNION ALL SELECT 'profiles', count(*) FROM public.profiles;
