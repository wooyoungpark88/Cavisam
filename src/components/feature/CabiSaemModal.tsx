import { useState, useRef, useEffect } from "react";

interface AiMessage {
  id: number;
  sender: "user" | "ai";
  text: string;
  time: string;
  loading?: boolean;
}

const TEACHER_STARTERS = [
  "자해 행동 발생 시 즉각 대응법",
  "강화제 선정 체크리스트 알려줘",
  "행동 지원 계획(BIP) 작성 팁",
  "DTT와 PRT 차이점이 뭔가요?",
];

const PARENT_STARTERS = [
  "집에서 ABA 강화 연습 방법",
  "자해 행동 집에서 대처법",
  "강화제가 뭔지 쉽게 설명해줘요",
  "등교 거부 어떻게 해야 하나요?",
];

const AI_RESPONSES: Record<string, string> = {
  "자해 행동 발생 시 즉각 대응법":
    "자해 행동 발생 시 즉각 대응 순서예요:\n\n1. 안전 확보 — 주변 위험물 제거 및 신체 보호\n2. 최소 언어 반응 — \"괜찮아\"처럼 짧고 차분하게. 지나친 관심은 행동을 강화해요\n3. 촉발 요인 파악 — 과제 난이도, 전환 스트레스, 감각 자극 여부 확인\n4. 대체 행동 유도 — 주먹 쥐기, 스트레스 볼 등 안전한 감각 대안 제공\n5. 즉각 기록 — 시각, 지속시간, 강도, 전후 상황을 ABC 서식에 기록\n\n반복 발생 시 BIP(행동지원계획) 재검토를 행동지원 전문가와 논의해보세요.",
  "강화제 선정 체크리스트 알려줘":
    "강화제 선정 체크리스트예요:\n\n1차 강화제\n☑ 선호 음식·음료 확인\n☑ 감각 자극 (촉감, 소리, 진동)\n\n2차 강화제\n☑ 선호 활동 (영상, 게임, 산책)\n☑ 물건 강화 (스티커, 장난감)\n☑ 사회적 강화 (칭찬, 하이파이브)\n\n강화제 효과 평가\n☑ 제공 시 목표 행동 빈도가 높아지는가?\n☑ 포만 없이 지속 효과가 유지되는가?\n☑ 다양한 강화제를 교차 사용하고 있는가?\n\n주기적으로 선호도 평가(Preference Assessment)를 실시해 목록을 업데이트하세요.",
  "행동 지원 계획(BIP) 작성 팁":
    "BIP(행동지원계획) 작성 핵심 요소예요:\n\n1. 기능행동평가(FBA) 선행\n   - 행동의 기능 파악: 주의, 회피, 감각, 유형물\n   - ABC 데이터 최소 2주 수집 권장\n\n2. 목표 행동 정의\n   - 조작적 정의 필수: 관찰·측정 가능하게 기술\n   - 예: \"수업 중 10분 이상 자리 이탈\" ← 명확\n\n3. 선행 조건 수정 전략\n   - 환경 수정, 일과 예고, 과제 수준 조정\n\n4. 대체 기술 교수\n   - 동일 기능을 충족하는 적절한 행동 가르치기\n\n5. 결과 전략\n   - 문제행동 무강화, 대체행동 강화\n\n6. 위기 대응 계획\n   - 안전 보장 절차 명시\n\n작성 후 보호자, 관련 전문가와 공유해 가정-기관 일관성을 유지하세요.",
  "DTT와 PRT 차이점이 뭔가요?":
    "DTT와 PRT는 모두 ABA 기반이지만 접근 방식이 달라요:\n\nDTT (Discrete Trial Training)\n· 구조화된 1:1 환경\n· 교사 주도, 명확한 자극-반응-결과 구조\n· 새로운 기술을 세분화해 반복 교수할 때 효과적\n· 예: 그림카드 5회 반복 식별 훈련\n\nPRT (Pivotal Response Training)\n· 자연스러운 환경에서 진행\n· 아동 주도 + 아동이 선택한 자극 활용\n· 동기, 자기 주도, 다중 자극 반응 등 핵심 기술 향상에 초점\n· 예: 블록 놀이 중 \"주세요\" 말하기 유도\n\n실제로는 두 방법을 병행하는 경우가 많아요. 새 기술 습득 초기에는 DTT, 일반화 단계에서는 PRT가 효과적이에요.",
};

const PARENT_AI_RESPONSES: Record<string, string> = {
  "집에서 ABA 강화 연습 방법":
    "집에서 ABA 강화 연습의 핵심은 자연스러운 일상 속 연습이에요!\n\n기본 원칙\n1. 일상 루틴에 녹여서 연습 (씻기, 식사, 정리)\n2. 아이가 원하는 상황을 요청 기회로 활용\n3. 성공하면 즉각 칭찬+선호 활동 제공\n\n구체적인 예시\n· 과자를 원할 때: 손 내밀기 대신 말하거나 그림 카드 사용 유도\n· 장난감 요청 시: 1~2초 기다려 의사 표현 유도 후 강화\n· 옷 입기: 단계별 스티커 차트 활용\n\n선생님이 알려준 목표 기술을 중심으로 하루 5~10분씩 자연스럽게 연습해 보세요!",
  "자해 행동 집에서 대처법":
    "집에서 자해 행동 발생 시 대처 방법이에요:\n\n즉각 대응\n1. 차분하게 반응 — 과도한 반응은 행동을 강화할 수 있어요\n2. 안전 확보 — 위험한 물건 치우기\n3. 짧게 \"괜찮아, 잠깐 쉬자\" 정도로만 말하기\n\n행동 후 대응\n· 행동 전 상황 메모 (무엇을 하다가, 어떤 요청이 있었는지)\n· 선생님이나 행동지원 전문가에게 공유\n\n예방\n· 어려운 상황 전 미리 예고하기 (\"10분 후 마쳐요\")\n· 대체 행동 (손 꾹 쥐기, 쿠션 누르기) 연습\n· 충분한 수면과 규칙적인 일과 유지\n\n지속적으로 나타난다면 기관의 행동지원 전문가와 상담해 가정-기관 연계 계획을 세워보세요.",
  "강화제가 뭔지 쉽게 설명해줘요":
    "강화제는 어떤 행동 뒤에 제공했을 때 그 행동이 더 자주 일어나게 만드는 것이에요!\n\n쉬운 예시\n· 아이가 \"주세요\"라고 말했을 때 과자를 줬더니 다음에도 말로 요청 → 과자가 강화제!\n· 숙제를 다 마친 후 게임 30분 → 게임이 강화제!\n\n종류\n· 음식 강화: 좋아하는 간식, 음료\n· 활동 강화: 좋아하는 게임, 영상, 산책\n· 물건 강화: 스티커, 장난감, 모래시계\n· 사회적 강화: 칭찬, 포옹, 엄지손가락\n\n중요한 점은 아이마다 강화제가 달라요. 아이가 좋아하는 것이 진짜 강화제예요. 선생님과 함께 아이의 선호 강화제 목록을 공유하면 가정-기관 일관성이 높아져요!",
  "등교 거부 어떻게 해야 하나요?":
    "등교 거부는 많은 가정이 겪는 어려움이에요. 주요 원인과 대처법이에요:\n\n원인 파악 먼저\n· 전환의 어려움 (집→기관 환경 변화)\n· 기관에서의 불편한 자극 (소음, 특정 활동)\n· 집에서의 강화제가 너무 많을 때\n\n집에서 할 수 있는 것\n1. 등원 루틴 시각화 — 그림 일정표로 예측 가능성 높이기\n2. 등원 전 미리 예고 — \"30분 후 유치원 가요\" 반복 안내\n3. 등원 후 보상 — 좋아하는 활동을 기관 도착 후 연결\n4. 작별 인사 루틴 정착 — 짧고 일관된 헤어짐 의식\n\n주의사항\n· 울어도 등교는 가능하다면 지속 — 회피로 강화되면 더 심해져요\n· 선생님에게 아이가 좋아하는 활동을 알려주어 등원 후 즉각 연결하게 해주세요\n\n지속된다면 행동지원 전문가와 협력해 체계적인 등교 프로그램을 만들어보세요.",
};

interface CabiSaemModalProps {
  mode: "teacher" | "parent";
  onClose: () => void;
}

export default function CabiSaemModal({ mode, onClose }: CabiSaemModalProps) {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 1,
      sender: "ai",
      text:
        mode === "teacher"
          ? "안녕하세요! 저는 캐비쌤이에요.\nABA(응용행동분석) 기반 행동 지원 전략, 강화 계획, 데이터 수집, 행동 개입 방법에 대해 도움을 드릴게요.\n\n아래 자주 묻는 질문을 선택하거나 직접 질문해 보세요!"
          : "안녕하세요! 저는 캐비쌤이에요.\n자녀를 위한 ABA 기반 가정 지원 방법, 행동 대처법, 강화 전략에 대해 쉽게 설명해 드릴게요.\n\n궁금한 점을 편하게 물어보세요!",
      time: "방금",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const starters = mode === "teacher" ? TEACHER_STARTERS : PARENT_STARTERS;
  const responseMap = mode === "teacher" ? AI_RESPONSES : PARENT_AI_RESPONSES;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: AiMessage = {
      id: Date.now(),
      sender: "user",
      text: text.trim(),
      time: "방금",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(
      () => {
        const aiText =
          responseMap[text.trim()] ??
          `"${text.trim()}"에 대해 분석할게요.\n\nABA 원칙상 이 상황에서는 행동의 기능(주의 요구·회피·감각 자극·유형물 요구)을 먼저 파악하는 것이 중요해요. 더 구체적인 상황(어떤 환경에서, 어떤 행동이, 어떤 결과로 이어지는지)을 알려주시면 맞춤 전략을 제안해 드릴게요!`;
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "ai", text: aiText, time: "방금" },
        ]);
      },
      800 + Math.random() * 400
    );
  };

  const showStarters = messages.length <= 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full sm:w-[480px] h-[85vh] sm:h-[620px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className="flex-shrink-0 px-5 py-4 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}
        >
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <i className="ri-sparkling-2-fill text-white text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-white text-sm font-bold">캐비쌤</p>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-white/20 text-white whitespace-nowrap">
                ABA 컨설팅 AI
              </span>
            </div>
            <p className="text-white/70 text-[10px] mt-0.5">
              {mode === "teacher"
                ? "행동 분석·강화 전략·BIP 작성을 도와드려요"
                : "가정 지원·행동 대처·강화 전략을 쉽게 알려드려요"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 cursor-pointer transition-colors flex-shrink-0"
          >
            <i className="ri-close-line text-white text-base" />
          </button>
        </div>

        {/* Disclaimer */}
        <div
          className="flex-shrink-0 px-4 py-2 flex items-start gap-2"
          style={{ background: "#fffbeb", borderBottom: "1px solid #fde68a" }}
        >
          <i className="ri-information-line text-amber-500 text-xs flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700 leading-relaxed">
            캐비쌤은 참고용 AI예요. 의료·법적 조언을 대체하지 않으며 중요한 결정은 전문가와 상의하세요.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "ai" ? "flex-row" : "flex-row-reverse"} items-end gap-2`}
              >
                {msg.sender === "ai" && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 self-end"
                    style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                  >
                    <i className="ri-sparkling-2-fill text-white text-[10px]" />
                  </div>
                )}
                <div
                  className={`flex flex-col ${msg.sender === "ai" ? "items-start" : "items-end"} max-w-[82%]`}
                >
                  <div
                    className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                    style={
                      msg.sender === "ai"
                        ? { background: "#f3f4f6", color: "#1f2937", borderBottomLeftRadius: 6 }
                        : {
                            background: "linear-gradient(135deg, #f59e0b, #d97706)",
                            color: "white",
                            borderBottomRightRadius: 6,
                          }
                    }
                  >
                    {msg.text}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex flex-row items-end gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
                >
                  <i className="ri-sparkling-2-fill text-white text-[10px]" />
                </div>
                <div
                  className="px-4 py-3 rounded-2xl flex items-center gap-1"
                  style={{ background: "#f3f4f6", borderBottomLeftRadius: 6 }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Quick starters */}
        {showStarters && (
          <div className="flex-shrink-0 px-4 pb-2 flex gap-2 overflow-x-auto">
            {starters.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium border cursor-pointer whitespace-nowrap transition-colors hover:bg-amber-50"
                style={{ borderColor: "#f59e0b", color: "#d97706", background: "white" }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              type="text"
              placeholder="ABA 관련 궁금한 점을 물어보세요..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-white cursor-pointer whitespace-nowrap transition-all disabled:opacity-30 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
            >
              <i className="ri-send-plane-fill text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
