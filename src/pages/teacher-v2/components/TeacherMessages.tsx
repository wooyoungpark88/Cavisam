import { useState } from "react";
import MessageStudentList from "./MessageStudentList";
import MessageChatPanel from "./MessageChatPanel";
import { mockConversations } from "../../../mocks/teacherMessages";

type MobileView = "list" | "chat";

export default function TeacherMessages() {
  const [selectedId, setSelectedId] = useState(mockConversations[0].studentId);
  const [mobileView, setMobileView] = useState<MobileView>("list");

  const selectedConv = mockConversations.find((c) => c.studentId === selectedId)!;

  const handleSelect = (id: number) => {
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
          conversations={mockConversations}
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
          key={selectedId}
          conversation={selectedConv}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}
