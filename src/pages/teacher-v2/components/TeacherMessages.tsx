import { useState } from "react";
import MessageStudentList from "./MessageStudentList";
import MessageStudentStats from "./MessageStudentStats";
import MessageChatPanel from "./MessageChatPanel";
import { mockConversations } from "../../../mocks/teacherMessages";

export default function TeacherMessages() {
  const [selectedId, setSelectedId] = useState(mockConversations[0].studentId);

  const selectedConv = mockConversations.find((c) => c.studentId === selectedId)!;

  return (
    <div className="flex h-full bg-white overflow-hidden">
      {/* Panel 1: Student list */}
      <MessageStudentList
        conversations={mockConversations}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {/* Panel 2: Student stats */}
      <MessageStudentStats conversation={selectedConv} />

      {/* Panel 3: Chat */}
      <MessageChatPanel key={selectedId} conversation={selectedConv} />
    </div>
  );
}
