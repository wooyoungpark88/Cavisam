-- ============================================================
-- 프로필 이름에서 "선생님" 호칭 제거
-- UI에서 역할 기반으로 자동 표시하므로 이름에 호칭이 포함되면 중복됨
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

-- profiles.name에서 " 선생님" 접미사 제거
UPDATE public.profiles
SET name = TRIM(REPLACE(name, ' 선생님', ''))
WHERE role = 'teacher' AND name LIKE '% 선생님';

-- auth.users.raw_user_meta_data에서도 동일하게 제거
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{full_name}',
  to_jsonb(TRIM(REPLACE(raw_user_meta_data->>'full_name', ' 선생님', '')))
)
WHERE raw_user_meta_data->>'full_name' LIKE '% 선생님';
