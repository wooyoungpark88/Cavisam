import { useState, useRef, useEffect } from "react";
import { useParentData } from "../../../contexts/ParentDataContext";
import { useAuth } from "../../../hooks/useAuth";
import { sendMessage } from "../../../lib/api/messages";
import type { MessageDB } from "../../../lib/api/messages";
import { uploadAttachment, validateFile, getAttachmentType, getSignedUrl } from "../../../lib/api/attachments";

/** signed URL 캐시 (storage 경로 → signed URL) */
const urlCache = new Map<string, string>();

function AttachmentMedia({ msg }: { msg: MessageDB }) {
  const [url, setUrl] = useState('');
  const raw = msg.attachment_url;

  useEffect(() => {
    if (!raw) return;
    if (raw.startsWith('http') || raw.startsWith('blob:') || raw.startsWith('data:')) {
      setUrl(raw);
      return;
    }
    // 캐시 확인
    const cached = urlCache.get(raw);
    if (cached) { setUrl(cached); return; }

    getSignedUrl(raw).then((signed) => {
      if (signed) {
        urlCache.set(raw, signed);
        setUrl(signed);
      }
    });
  }, [raw]);

  if (!url) return null;

  if (msg.attachment_type === 'video') {
    return <video src={url} controls preload="metadata" className="rounded-xl max-w-[220px] max-h-[160px] object-cover" />;
  }
  return (
    <img
      src={url}
      alt="첨부 이미지"
      className="rounded-xl max-w-[220px] max-h-[220px] object-cover cursor-pointer"
      loading="lazy"
      onClick={() => window.open(url, '_blank')}
    />
  );
}

export default function MessagePanel() {
  const { profile } = useAuth();
  const { messages, activeChild, refresh } = useParentData();
  const [input, setInput] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 최근 메시지 5개만 표시
  const recentMessages = messages.slice(-5);

  // 교사 id 찾기 (receiver 중 본인이 아닌 사람)
  const teacherId = messages.find((m) => m.sender_id !== profile?.id)?.sender_id
    ?? messages.find((m) => m.receiver_id !== profile?.id)?.receiver_id
    ?? '';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const error = validateFile(file);
    if (error) { alert(error); return; }
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearPending = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl(null);
  };

  const handleSend = async () => {
    if ((!input.trim() && !pendingFile) || !profile || !activeChild) return;

    const text = input.trim();
    const file = pendingFile;
    const fileType = file ? getAttachmentType(file) : null;

    setInput("");
    clearPending();

    if (file && fileType) {
      setUploading(true);
      try {
        const { url: storagePath, type: attachType } = await uploadAttachment(file, profile.id);
        await sendMessage({
          student_id: activeChild.id,
          sender_id: profile.id,
          receiver_id: teacherId,
          content: text || (attachType === 'image' ? '사진' : '영상'),
          message_type: 'attachment',
          attachment_url: storagePath,
          attachment_type: attachType,
        });
        await refresh();
      } catch (e) {
        console.error('첨부파일 전송 실패:', e);
      } finally {
        setUploading(false);
      }
      return;
    }

    try {
      await sendMessage({
        student_id: activeChild.id,
        sender_id: profile.id,
        receiver_id: teacherId,
        content: text,
        message_type: 'text',
      });
      await refresh();
    } catch (e) {
      console.error('메시지 전송 실패:', e);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#10b981]/10">
            <i className="ri-chat-1-line text-[#10b981] text-sm" />
          </div>
          <h2 className="text-sm font-bold text-gray-900">선생님과 대화</h2>
        </div>
        <span className="text-[11px] text-gray-400">{messages.length > 0 ? `${messages.length}개 메시지` : "새 대화"}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 px-5 py-4 space-y-3 overflow-y-auto" style={{ maxHeight: 320 }}>
        {recentMessages.length === 0 && (
          <div className="text-center py-8">
            <i className="ri-chat-3-line text-3xl text-gray-200 mb-2" />
            <p className="text-xs text-gray-400">아직 메시지가 없습니다</p>
          </div>
        )}
        {recentMessages.map((msg) => {
          const isMe = msg.sender_id === profile?.id;
          const senderInitial = msg.sender?.name?.charAt(0) ?? "?";
          const time = new Date(msg.created_at).toLocaleString("ko-KR", {
            month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
          });

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}
            >
              {!isMe && (
                <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-[#026eff]/10 text-[#026eff] text-xs font-bold mt-0.5">
                  {senderInitial}
                </div>
              )}
              <div className={`max-w-[75%] ${isMe ? "items-end" : ""} flex flex-col gap-1`}>
                {/* 첨부파일 */}
                {msg.message_type === 'attachment' && msg.attachment_url && (
                  <AttachmentMedia msg={msg} />
                )}
                {/* 텍스트 (첨부파일 메시지의 경우 '사진'/'영상'은 숨김) */}
                {!(msg.message_type === 'attachment' && (msg.content === '사진' || msg.content === '영상')) && (
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "text-white rounded-tr-sm"
                        : "bg-gray-100 text-gray-800 rounded-tl-sm"
                    }`}
                    style={isMe ? { background: "linear-gradient(135deg, #026eff, #0258d4)" } : {}}
                  >
                    {msg.content}
                  </div>
                )}
                <span className="text-[10px] text-gray-300 px-1">{time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attachment preview */}
      {previewUrl && pendingFile && (
        <div className="px-5 pt-3 border-t border-gray-50 flex-shrink-0">
          <div className="relative inline-block">
            {getAttachmentType(pendingFile) === 'video' ? (
              <video src={previewUrl} className="h-20 rounded-xl object-cover" />
            ) : (
              <img src={previewUrl} alt="미리보기" className="h-20 rounded-xl object-cover" />
            )}
            <button
              onClick={clearPending}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] shadow cursor-pointer hover:bg-red-600"
            >
              <i className="ri-close-line" />
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-5 py-4 border-t border-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5">
          {/* 첨부 버튼 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#026eff] hover:bg-blue-50 cursor-pointer transition-colors flex-shrink-0 disabled:opacity-30"
          >
            <i className="ri-attachment-2 text-base" />
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            type="text"
            placeholder="선생님께 메시지 보내기..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !pendingFile) || uploading}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#026eff] text-white transition-opacity hover:opacity-80 cursor-pointer flex-shrink-0 disabled:opacity-30"
          >
            {uploading ? (
              <i className="ri-loader-4-line text-xs animate-spin" />
            ) : (
              <i className="ri-send-plane-fill text-xs" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
