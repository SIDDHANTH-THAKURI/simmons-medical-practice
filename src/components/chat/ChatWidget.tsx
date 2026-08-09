import { AnimatePresence, motion } from "framer-motion";
import { Bot, Minus, Sparkles } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { ChatPanel } from "./ChatPanel";

export function ChatWidget() {
  const isOpen = useChatStore((s) => s.isOpen);
  const toggle = useChatStore((s) => s.toggle);
  const close = useChatStore((s) => s.close);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-5 z-40 flex h-[560px] w-[380px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-[var(--shadow-lifted)]"
          >
            <div className="flex items-center justify-between border-b border-ink-900/8 bg-teal-900 px-4 py-3.5 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta-500">
                  <Bot size={16} />
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold leading-tight">Practice Assistant</p>
                  <p className="flex items-center gap-1 text-[11px] text-teal-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3ddc74]" /> Online now
                  </p>
                </div>
              </div>
              <button onClick={close} className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Minimise">
                <Minus size={18} />
              </button>
            </div>
            <ChatPanel />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggle}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-500 text-white shadow-[var(--shadow-lifted)]"
        aria-label="Open assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span key="minus" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <Minus size={22} />
            </motion.span>
          ) : (
            <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative">
              <Bot size={22} />
              <Sparkles size={11} className="absolute -right-1 -top-1 text-amber-300" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
