import { motion } from "framer-motion";

export function Dumbbell({
  lowLabel,
  highLabel,
  lowValue,
  highValue,
  max,
  suffix = "%",
  lowColor = "var(--color-ink-300)",
  highColor = "var(--color-teal-600)",
}: {
  lowLabel: string;
  highLabel: string;
  lowValue: number;
  highValue: number;
  max: number;
  suffix?: string;
  lowColor?: string;
  highColor?: string;
}) {
  const a = Math.min((lowValue / max) * 100, 100);
  const b = Math.min((highValue / max) * 100, 100);
  const left = Math.min(a, b);
  const width = Math.abs(a - b);

  return (
    <div className="pt-2">
      <div className="relative h-1.5 rounded-full bg-cream-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 h-1.5 rounded-full bg-ink-200"
          style={{ left: `${left}%` }}
        />
        <motion.div
          initial={{ left: 0, opacity: 0 }}
          animate={{ left: `${a}%`, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 flex -translate-y-1/2 -translate-x-1/2 flex-col items-center"
        >
          <span className="mb-1.5 whitespace-nowrap rounded-md bg-white px-1.5 py-0.5 text-[11px] font-semibold text-ink-700 shadow-sm">
            {lowValue}{suffix}
          </span>
          <span className="h-3.5 w-3.5 rounded-full ring-2 ring-white" style={{ backgroundColor: lowColor }} />
        </motion.div>
        <motion.div
          initial={{ left: 0, opacity: 0 }}
          animate={{ left: `${b}%`, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 flex -translate-y-1/2 -translate-x-1/2 flex-col items-center"
        >
          <span className="mb-1.5 whitespace-nowrap rounded-md bg-teal-800 px-1.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
            {highValue}{suffix}
          </span>
          <span className="h-3.5 w-3.5 rounded-full ring-2 ring-white" style={{ backgroundColor: highColor }} />
        </motion.div>
      </div>
      <div className="mt-6 flex items-center gap-5 text-[12.5px] text-ink-500">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: lowColor }} /> {lowLabel}</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: highColor }} /> {highLabel}</span>
      </div>
    </div>
  );
}
