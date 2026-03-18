import { useState, useEffect } from "react";
import MessageStudentList from "./MessageStudentList";
import MessageChatPanel from "./MessageChatPanel";
import { useTeacherData } from "../../../contexts/TeacherDataContext";
import { useAuth } from "../../../hooks/useAuth";
import { supabase } from "../../../lib/supabase";
import type { ChatMessage, StudentConversation } from "../../../types/messages";

const AVATAR_COLORS = ["#026eff","#10b981","#f59e0b","#8b5cf6","#ef4444","#06b6d4","#e879f9"];

type MobileView = "list" | "chat";

export default function TeacherMessages() {
  const { students } = useTeacherData();
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<StudentConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | number>("");
  const [mobileView, setMobileView] = useState<MobileView>("list");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id || students.length === 0) {
      setLoading(false);
      return;
    }

    supabase
      .from("parent_messages")
      .select("*, sender:profiles!sender_id(name, avatar_url), receiver:profiles!receiver_id(name, avatar_url)")
      .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        const messagesByStudent = new Map<string, any[]>();
        if (data) {
          for (const msg of data) {
            const sid = msg.student_id as string;
            if (!sid) continue;
            if (!messagesByStudent.has(sid)) messagesByStudent.set(sid, []);
            messagesByStudent.get(sid)!.push(msg);
          }
        }

        const convs: StudentConversation[] = students.map((student, index) => {
          const msgs = messagesByStudent.get(student.id) ?? [];
          const lastMsg = msgs[msgs.length - 1];

          const parentMsg = msgs.find((m: any) => m.sender_id !== profile.id);
          const parentName = parentMsg?.sender?.name ?? "보호자";

          const chatMessages: ChatMessage[] = msgs.map((m: any) => ({
            id: m.id,
            sender: m.sender_id === profile.id ? "teacher" as const : "parent" as const,
            senderName: m.sender?.name ?? "알 수 없음",
            text: m.content,
            time: new Date(m.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
            type: m.message_type === "daily_report" ? "daily-report" as const : "text" as const,
          }));

          return {
            studentId: student.id,
            studentName: student.name,
            initial: student.name.charAt(0),
            avatarColor: AVATAR_COLORS[index % 7],
            parentName,
            unreadCount: msgs.filter((m: any) => !m.is_read && m.receiver_id === profile.id).length,
            lastMessage: lastMsg?.content ?? "",
            lastTime: lastMsg
              ? new Date(lastMsg.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
              : "",
            weeklyStats: {
              sleep: "-", sleepChange: "→", sleepPositive: true,
              condition: "-", conditionChange: "→", conditionPositive: true,
              meal: "-", mealChange: "→", mealPositive: true,
            },
            messages: chatMessages,
          };
        });

        setConversations(convs);
        if (convs.length > 0 && !selectedId) {
          setSelectedId(convs[0].studentId);
        }
        setLoading(false);
      });
  }, [profile?.id, students]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white">
        <p className="text-sm text-gray-400">메시지를 불러오는 중...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="text-center">
          <i className="ri-chat-3-line text-3xl text-gray-300 mb-2" />
          <p className="text-sm text-gray-400">등록된 이용인이 없습니다</p>
        </div>
      </div>
    );
  }

  const selectedConv = conversations.find((c) => c.studentId === selectedId) ?? conversations[0];

  const handleSelect = (id: string | number) => {
    setSelectedId(id);
    setMobileView("chat");
  };

  const handleBack = () => {
    setMobileView("list");
  };

  return (
    <div className="flex flex-1 min-h-0 bg-white overflow-hidden">

      {/* ── Panel 1: Student list ── */}
      <div
        className={[
          "flex-col min-h-0 border-r border-gray-100 w-full md:w-auto",
          mobileView === "list" ? "flex" : "hidden",
          "md:flex md:flex-shrink-0",
        ].join(" ")}
      >
        <MessageStudentList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </div>

      {/* ── Panel 2: Chat (takes remaining width) ── */}
      <div
        className={[
          "flex-1 flex-col overflow-hidden min-w-0 min-h-0",
          mobileView === "chat" ? "flex" : "hidden",
          "md:flex",
        ].join(" ")}
      >
        <MessageChatPanel
          key={String(selectedConv.studentId)}
          conversation={selectedConv}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}
