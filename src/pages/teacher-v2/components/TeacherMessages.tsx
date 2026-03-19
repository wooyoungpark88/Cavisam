import { useState, useEffect } from "react";
import MessageStudentList from "./MessageStudentList";
import MessageChatPanel from "./MessageChatPanel";
import { useTeacherData } from "../../../contexts/TeacherDataContext";
import { useAuth } from "../../../hooks/useAuth";
import { supabase } from "../../../lib/supabase";
import type { ChatMessage, StudentConversation } from "../../../types/messages";

const AVATAR_COLORS = ["#026eff","#10b981","#f59e0b","#8b5cf6","#ef4444","#06b6d4","#e879f9"];

type MobileView = "list" | "chat";

// 주간 통계 계산 유틸
function computeWeeklyStats(
  records: { student_id: string; date: string; sleep: string; condition: string; meal: string }[],
  studentId: string,
) {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  thisMonday.setHours(0, 0, 0, 0);
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);

  const thisWeekStr = thisMonday.toISOString().slice(0, 10);
  const lastWeekStr = lastMonday.toISOString().slice(0, 10);

  const mine = records.filter((r) => r.student_id === studentId);
  const thisWeek = mine.filter((r) => r.date >= thisWeekStr);
  const lastWeek = mine.filter((r) => r.date >= lastWeekStr && r.date < thisWeekStr);

  const COND_SCORE: Record<string, number> = { good: 3, normal: 2, bad: 1, very_bad: 0 };
  const MEAL_SCORE: Record<string, number> = { good: 3, normal: 2, none: 0 };

  function avg(arr: number[]) { return arr.length === 0 ? null : arr.reduce((a, b) => a + b, 0) / arr.length; }
  function parseSleep(s: string) {
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  }

  const twSleep = avg(thisWeek.map((r) => parseSleep(r.sleep)).filter((v): v is number => v !== null));
  const lwSleep = avg(lastWeek.map((r) => parseSleep(r.sleep)).filter((v): v is number => v !== null));
  const twCond = avg(thisWeek.map((r) => COND_SCORE[r.condition] ?? 2));
  const lwCond = avg(lastWeek.map((r) => COND_SCORE[r.condition] ?? 2));
  const twMeal = avg(thisWeek.map((r) => MEAL_SCORE[r.meal] ?? 2));
  const lwMeal = avg(lastWeek.map((r) => MEAL_SCORE[r.meal] ?? 2));

  function changeStr(curr: number | null, prev: number | null): { val: string; change: string; positive: boolean } {
    if (curr === null) return { val: "-", change: "→", positive: true };
    const val = curr.toFixed(1);
    if (prev === null) return { val, change: "→", positive: true };
    const diff = curr - prev;
    if (Math.abs(diff) < 0.05) return { val, change: "→", positive: true };
    return { val, change: diff > 0 ? "↑" : "↓", positive: diff > 0 };
  }

  const s = changeStr(twSleep, lwSleep);
  const c = changeStr(twCond, lwCond);
  const m = changeStr(twMeal, lwMeal);

  return {
    sleep: twSleep !== null ? `${twSleep.toFixed(1)}h` : "-",
    sleepChange: s.change,
    sleepPositive: s.positive,
    condition: twCond !== null ? ["매우나쁨", "나쁨", "보통", "좋음"][Math.round(twCond)] ?? "보통" : "-",
    conditionChange: c.change,
    conditionPositive: c.positive,
    meal: twMeal !== null ? ["안먹음", "조금", "보통", "잘먹음"][Math.round(twMeal)] ?? "보통" : "-",
    mealChange: m.change,
    mealPositive: m.positive,
  };
}

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

    // 2주치 daily_records + parent_messages 병렬 조회
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const sinceDate = twoWeeksAgo.toISOString().slice(0, 10);
    const studentIds = students.map((s) => s.id);

    Promise.all([
      supabase
        .from("parent_messages")
        .select("*, sender:profiles!sender_id(name, avatar_url), receiver:profiles!receiver_id(name, avatar_url)")
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
        .order("created_at", { ascending: true }),
      supabase
        .from("daily_records")
        .select("student_id, date, sleep, condition, meal")
        .in("student_id", studentIds)
        .gte("date", sinceDate),
    ]).then(([{ data: msgData }, { data: recData }]) => {
        const messagesByStudent = new Map<string, any[]>();
        if (msgData) {
          for (const msg of msgData) {
            const sid = msg.student_id as string;
            if (!sid) continue;
            if (!messagesByStudent.has(sid)) messagesByStudent.set(sid, []);
            messagesByStudent.get(sid)!.push(msg);
          }
        }

        const records = (recData ?? []) as { student_id: string; date: string; sleep: string; condition: string; meal: string }[];

        const convs: StudentConversation[] = students.map((student, index) => {
          const msgs = messagesByStudent.get(student.id) ?? [];
          const lastMsg = msgs[msgs.length - 1];

          const parentMsg = msgs.find((m: any) => m.sender_id !== profile.id);
          const parentName = parentMsg?.sender?.name ?? "보호자";
          const parentId: string = parentMsg?.sender_id ?? student.parent_id ?? "";

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
            _parentId: parentId,
            unreadCount: msgs.filter((m: any) => !m.is_read && m.receiver_id === profile.id).length,
            lastMessage: lastMsg?.content ?? "",
            lastTime: lastMsg
              ? new Date(lastMsg.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
              : "",
            weeklyStats: computeWeeklyStats(records, student.id),
            messages: chatMessages,
          };
        });

        setConversations(convs);
        if (convs.length > 0 && !selectedId) {
          setSelectedId(convs[0].studentId);
        }
        setLoading(false);
      });

    // Realtime 구독: 새 메시지 수신 시 대화 목록 갱신
    const channel = supabase
      .channel("teacher-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "parent_messages",
        },
        (payload) => {
          const msg = payload.new as any;
          // 내가 보낸 메시지이거나 내가 받는 메시지일 때만 처리
          if (msg.sender_id !== profile.id && msg.receiver_id !== profile.id) return;

          const studentId = msg.student_id as string;
          const isFromMe = msg.sender_id === profile.id;

          const newChatMsg: ChatMessage = {
            id: msg.id,
            sender: isFromMe ? "teacher" : "parent",
            senderName: isFromMe ? (profile.name || "선생님") : "보호자",
            text: msg.content,
            time: new Date(msg.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
            type: msg.message_type === "daily_report" ? "daily-report" : "text",
          };

          setConversations((prev) =>
            prev.map((conv) => {
              if (conv.studentId !== studentId) return conv;
              // 이미 같은 id의 메시지가 있으면 중복 방지
              if (conv.messages.some((m) => m.id === msg.id)) return conv;
              return {
                ...conv,
                messages: [...conv.messages, newChatMsg],
                lastMessage: msg.content,
                lastTime: newChatMsg.time,
                unreadCount: isFromMe ? conv.unreadCount : conv.unreadCount + 1,
              };
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
