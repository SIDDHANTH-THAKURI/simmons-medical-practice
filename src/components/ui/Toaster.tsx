import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { cn } from "@/lib/utils";

const icons = {
  success: <CheckCircle2 size={18} className="text-[#0ca30c]" />,
  error: <TriangleAlert size={18} className="text-[#d03b3b]" />,
  info: <Info size={18} className="text-[#2a78d6]" />,
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, transition: { duration: 0.15 } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border border-ink-900/8 bg-white p-4 shadow-[var(--shadow-lifted)]"
            )}
          >
            {icons[t.variant]}
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-semibold text-ink-900">{t.title}</p>
              {t.description && <p className="mt-0.5 text-[13px] text-ink-500">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-ink-300 hover:text-ink-600">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
