import { supabase } from '../supabase';

const BUCKET = 'chat-attachments';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
const SIGNED_URL_EXPIRY = 60 * 60;       // 1시간

export type AttachmentType = 'image' | 'video';

interface UploadResult {
  url: string;
  type: AttachmentType;
}

/**
 * 파일 타입 판별
 */
export function getAttachmentType(file: File): AttachmentType | null {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return null;
}

/**
 * 파일 크기 유효성 검사
 */
export function validateFile(file: File): string | null {
  const type = getAttachmentType(file);
  if (!type) return '이미지 또는 영상 파일만 업로드할 수 있습니다.';
  if (type === 'image' && file.size > MAX_IMAGE_SIZE) return '이미지는 5MB 이하만 가능합니다.';
  if (type === 'video' && file.size > MAX_VIDEO_SIZE) return '영상은 20MB 이하만 가능합니다.';
  return null;
}

/**
 * 이미지를 Canvas로 리사이즈 (최대 1920px, JPEG 0.8 품질)
 */
async function compressImage(file: File): Promise<File> {
  // GIF는 압축 스킵
  if (file.type === 'image/gif') return file;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1920;
      let { width, height } = img;

      // 이미 충분히 작으면 원본 반환
      if (width <= MAX && height <= MAX && file.size < 1024 * 1024) {
        resolve(file);
        return;
      }

      if (width > MAX || height > MAX) {
        const ratio = Math.min(MAX / width, MAX / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }));
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        0.8
      );
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Supabase Storage에 파일 업로드 후 signed URL 반환
 */
export async function uploadAttachment(file: File, senderId: string): Promise<UploadResult> {
  const type = getAttachmentType(file)!;

  // 이미지는 클라이언트에서 압축
  const processedFile = type === 'image' ? await compressImage(file) : file;

  // 경로: {senderId}/{timestamp}_{filename}
  const ext = processedFile.name.split('.').pop() ?? 'bin';
  const path = `${senderId}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, processedFile, {
      cacheControl: '3600',
      contentType: processedFile.type,
    });

  if (error) throw new Error(`업로드 실패: ${error.message}`);

  // signed URL 생성 (private 버킷)
  const { data: signedData, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRY);

  if (signError || !signedData?.signedUrl) {
    throw new Error('URL 생성 실패');
  }

  return { url: path, type };
}

/**
 * Storage 경로로부터 signed URL 생성 (메시지 조회 시 사용)
 */
export async function getSignedUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_EXPIRY);

  if (error || !data?.signedUrl) return '';
  return data.signedUrl;
}
