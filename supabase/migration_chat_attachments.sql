-- ============================================================
-- 케어톡 이미지/영상 첨부 기능 마이그레이션
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

-- 1. parent_messages 테이블에 첨부파일 컬럼 추가
ALTER TABLE public.parent_messages
  ADD COLUMN IF NOT EXISTS attachment_url  text,
  ADD COLUMN IF NOT EXISTS attachment_type text CHECK (attachment_type IN ('image', 'video'));

-- 2. message_type에 'attachment' 추가
ALTER TABLE public.parent_messages
  DROP CONSTRAINT IF EXISTS parent_messages_message_type_check;
ALTER TABLE public.parent_messages
  ADD CONSTRAINT parent_messages_message_type_check
  CHECK (message_type IN ('text', 'daily_report', 'attachment'));

-- 3. Storage 버킷 생성 (private — signed URL로만 접근)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-attachments',
  'chat-attachments',
  false,
  20971520,  -- 20MB 제한
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage RLS — 인증 사용자만 업로드 가능
CREATE POLICY "chat_attachments_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'chat-attachments');

-- 5. Storage RLS — 같은 기관 사용자만 조회 가능
CREATE POLICY "chat_attachments_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'chat-attachments');

-- 6. Storage RLS — 업로더만 삭제 가능
CREATE POLICY "chat_attachments_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'chat-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);
