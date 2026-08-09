import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, SendHorizontal, User } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-ink-300"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export function ChatPanel({ compact = false }: { compact?: boolean }) {
  const messages = useChatStore((s) => s.messages);
  const isTyping = useChatStore((s) => s.isTyping);
  const sendUserMessage = useChatStore((s) => s.sendUserMessage);
  const open = useChatStore((s) => s.open);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  function submit(value: string) {
    const v = value.trim();
    if (!v) return;
    sendUserMessage(v);
    setText("");
  }

  const lastAssistantIdx = [...messages].reverse().findIndex((m) => m.role === "assistant");
  const lastIdx = lastAssistantIdx === -1 ? -1 : messages.length - 1 - lastAssistantIdx;

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex-1 space-y-4 overflow-y-auto px-4 py-4", compact ? "" : "px-5 py-5")}>
        {messages.map((m, i) => (
          <div key={m.id}>
            <div className={cn("flex items-end gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
              {m.role === "assistant" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-800 text-white">
                  <Bot size={14} />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed",
                  m.role === "user"
                    ? "rounded-br-sm bg-teal-700 text-white"
                    : "rounded-bl-sm bg-cream-100 text-ink-800"
                )}
              >
                {m.text}
              </div>
              {m.role === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-800 text-white">
                  <User size={13} />
                </div>
              )}
            </div>
            <p className={cn("mt-1 text-[10.5px] text-ink-300", m.role === "user" ? "text-right mr-9" : "ml-9")}>
              {formatTime(m.timestamp)}
            </p>

            {i === lastIdx && m.quickReplies && m.quickReplies.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="ml-9 mt-2 flex flex-wrap gap-2">
                {m.quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => submit(q)}
                    className="rounded-full border border-teal-700/25 bg-white px-3 py-1.5 text-[12.5px] font-medium text-teal-800 hover:bg-teal-50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-800 text-white">
              <Bot size={14} />
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-cream-100 px-3 py-2">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(text);
        }}
        className="flex items-center gap-2 border-t border-ink-900/8 bg-cream-25 p-3"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask about bookings, billing, anything…"
          className="h-10 flex-1 rounded-full border border-ink-900/10 bg-white px-4 text-[13.5px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
        />
        <button
          type="submit"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-800 text-white hover:bg-teal-900 disabled:opacity-40"
          disabled={!text.trim()}
          aria-label="Send"
        >
          <SendHorizontal size={16} />
        </button>
      </form>
    </div>
  );
}
