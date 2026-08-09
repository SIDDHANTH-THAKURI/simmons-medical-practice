import { Bot, RotateCcw } from "lucide-react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { useChatStore } from "@/store/useChatStore";

export default function AssistantPage() {
  const resetConversation = useChatStore((s) => s.resetConversation);

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col overflow-hidden rounded-2xl border border-ink-900/8 bg-white shadow-[var(--shadow-card)] lg:h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between border-b border-ink-900/8 bg-teal-900 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-500">
            <Bot size={17} />
          </div>
          <div>
            <p className="text-[14.5px] font-semibold">Practice Assistant</p>
            <p className="flex items-center gap-1 text-[11.5px] text-teal-200">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3ddc74]" /> Online — books, reschedules &amp; answers questions
            </p>
          </div>
        </div>
        <button onClick={resetConversation} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-white/70 hover:bg-white/10 hover:text-white">
          <RotateCcw size={13} /> Restart
        </button>
      </div>
      <div className="min-h-0 flex-1">
        <ChatPanel />
      </div>
    </div>
  );
}
