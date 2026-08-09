import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FieldWrapProps {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function FieldWrap({ label, htmlFor, hint, error, required, className, children }: FieldWrapProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-ink-700">
          {label} {required && <span className="text-terracotta-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1.5 text-[12px] text-ink-400">{hint}</p>}
      {error && <p className="mt-1.5 text-[12px] font-medium text-terracotta-700">{error}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, icon, error, ...props }, ref) => (
  <div className="relative">
    {icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>}
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border bg-white px-3.5 text-[14.5px] text-ink-900 placeholder:text-ink-300 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600",
        error ? "border-terracotta-400" : "border-ink-900/12",
        icon && "pl-10",
        className
      )}
      {...props}
    />
  </div>
));
Input.displayName = "Input";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-11 w-full rounded-xl border border-ink-900/12 bg-white px-3.5 text-[14.5px] text-ink-900 transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export function Checkbox({ label, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-2.5 text-[13.5px] text-ink-600", className)}>
      <input type="checkbox" className="h-4 w-4 rounded border-ink-300 text-teal-700 focus:ring-teal-500/40" {...props} />
      {label}
    </label>
  );
}
