import { useState } from "react";
import { motion } from "framer-motion";
import { Banknote, CreditCard, Download, FileHeart, Printer, ShieldCheck } from "lucide-react";
import { useCurrentPatient } from "@/store/useCurrentUser";
import { useAppStore } from "@/store/useAppStore";
import { useToastStore } from "@/store/useToastStore";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StatTile } from "@/components/ui/StatTile";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@/types";

const STATUS_VARIANT: Record<InvoiceStatus, "good" | "warning" | "critical" | "info"> = {
  paid: "good",
  outstanding: "warning",
  overdue: "critical",
  processing: "info",
};

function PayModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const payInvoice = useAppStore((s) => s.payInvoice);
  const showToast = useToastStore((s) => s.show);
  const [method, setMethod] = useState<"card" | "medicare">("card");
  const [paying, setPaying] = useState(false);

  function pay() {
    setPaying(true);
    setTimeout(() => {
      payInvoice(invoice.id, method === "card" ? "Visa •••• 4471" : "Medicare EasyClaim");
      showToast({ variant: "success", title: "Payment successful", description: formatCurrency(invoice.gapPayment) + " paid" });
      setPaying(false);
      onClose();
    }, 900);
  }

  return (
    <Modal open onClose={onClose} title="Pay invoice" description={`${formatDate(invoice.issuedAt)} · ${invoice.items[0]?.description}`}>
      <p className="text-[13px] text-ink-500">Amount due</p>
      <p className="text-3xl font-semibold text-ink-900 tabular-nums">{formatCurrency(invoice.gapPayment)}</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => setMethod("card")}
          className={cn("flex flex-col items-center gap-2 rounded-xl border p-4", method === "card" ? "border-teal-700 bg-teal-50" : "border-ink-900/10")}
        >
          <CreditCard size={20} className="text-teal-700" />
          <span className="text-[12.5px] font-medium text-ink-700">Card ending 4471</span>
        </button>
        <button
          onClick={() => setMethod("medicare")}
          className={cn("flex flex-col items-center gap-2 rounded-xl border p-4", method === "medicare" ? "border-teal-700 bg-teal-50" : "border-ink-900/10")}
        >
          <Banknote size={20} className="text-teal-700" />
          <span className="text-[12.5px] font-medium text-ink-700">Medicare EasyClaim</span>
        </button>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={pay} loading={paying}>Pay {formatCurrency(invoice.gapPayment)}</Button>
      </div>
    </Modal>
  );
}

function ReceiptModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const patient = useCurrentPatient()!;
  return (
    <Modal open onClose={onClose} size="sm" title="Receipt">
      <div id="receipt-print" className="rounded-xl border border-dashed border-ink-300 p-5">
        <p className="text-[13px] font-semibold text-ink-900">{CLINIC_INFO.name}</p>
        <p className="text-[11.5px] text-ink-400">{CLINIC_INFO.address}</p>
        <div className="my-4 border-t border-dashed border-ink-300" />
        <p className="text-[12px] text-ink-500">Billed to</p>
        <p className="text-[13px] font-medium text-ink-800">{patient.firstName} {patient.lastName}</p>
        <p className="mt-3 text-[12px] text-ink-500">Date</p>
        <p className="text-[13px] font-medium text-ink-800">{formatDate(invoice.issuedAt)}</p>
        <div className="my-4 border-t border-dashed border-ink-300" />
        {invoice.items.map((it, i) => (
          <div key={i} className="flex justify-between text-[13px] text-ink-700">
            <span>{it.description}</span>
            <span className="tabular-nums">{formatCurrency(it.amount)}</span>
          </div>
        ))}
        <div className="my-4 border-t border-dashed border-ink-300" />
        <div className="flex justify-between text-[12.5px] text-ink-500">
          <span>Medicare rebate</span>
          <span className="tabular-nums">{formatCurrency(invoice.medicareRebate)}</span>
        </div>
        <div className="mt-1 flex justify-between text-[14px] font-semibold text-ink-900">
          <span>{invoice.status === "paid" ? "Paid" : "Amount due"}</span>
          <span className="tabular-nums">{formatCurrency(invoice.status === "paid" ? invoice.totalAmount : invoice.gapPayment)}</span>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <Button variant="secondary" onClick={() => window.print()}><Printer size={15} /> Print</Button>
        <Button onClick={onClose}>Done</Button>
      </div>
    </Modal>
  );
}

export default function Billing() {
  const patient = useCurrentPatient()!;
  const invoices = useAppStore((s) => s.invoices).filter((i) => i.patientId === patient.id).sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
  const [paying, setPaying] = useState<Invoice | null>(null);
  const [viewing, setViewing] = useState<Invoice | null>(null);

  const outstanding = invoices.filter((i) => i.status !== "paid");
  const outstandingTotal = outstanding.reduce((sum, i) => sum + i.gapPayment, 0);
  const paidYtd = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Billing &amp; Medicare</h1>
      <p className="mt-1.5 text-[14px] text-ink-500">Invoices, rebates and your Medicare &amp; insurance details.</p>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Outstanding balance" value={formatCurrency(outstandingTotal)} icon={<Banknote size={16} />} accent="var(--color-terracotta-500)" />
        <StatTile label="Total billed (this practice)" value={formatCurrency(paidYtd)} icon={<CreditCard size={16} />} accent="var(--color-teal-600)" />
        <StatTile label="Bulk billing status" value="Active" icon={<ShieldCheck size={16} />} accent="var(--color-chart-3)" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-400">Invoice history</p>
          <div className="space-y-3">
            {invoices.map((inv) => (
              <motion.div key={inv.id} layout className="flex flex-col gap-3 rounded-2xl border border-ink-900/8 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13.5px] font-semibold text-ink-900">{inv.items[0]?.description}</p>
                    <Badge variant={STATUS_VARIANT[inv.status]}>{inv.status}</Badge>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-500">{formatDate(inv.issuedAt)} · Rebate {formatCurrency(inv.medicareRebate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[15px] font-semibold tabular-nums text-ink-900">{formatCurrency(inv.status === "paid" ? inv.totalAmount : inv.gapPayment)}</p>
                  {inv.status !== "paid" ? (
                    <Button size="sm" onClick={() => setPaying(inv)}>Pay now</Button>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => setViewing(inv)}><Download size={14} /> Receipt</Button>
                  )}
                </div>
              </motion.div>
            ))}
            {invoices.length === 0 && <EmptyState title="No billing history yet" description="Invoices appear here after your first visit." />}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-ink-900/8 bg-white p-5">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-700"><FileHeart size={14} /> Medicare</p>
            <div className="mt-3 space-y-2 text-[13px]">
              <div className="flex justify-between"><span className="text-ink-400">Card number</span><span className="font-medium text-ink-800 tabular-nums">{patient.medicareNumber || "Not on file"}</span></div>
              <div className="flex justify-between"><span className="text-ink-400">Reference no.</span><span className="font-medium text-ink-800">{patient.medicareRefNo}</span></div>
              <div className="flex justify-between"><span className="text-ink-400">Expiry</span><span className="font-medium text-ink-800">{patient.medicareExpiry || "—"}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-ink-900/8 bg-white p-5">
            <p className="text-[13px] font-semibold text-ink-700">Private health insurance</p>
            {patient.privateHealthFund ? (
              <div className="mt-3 space-y-2 text-[13px]">
                <div className="flex justify-between"><span className="text-ink-400">Fund</span><span className="font-medium text-ink-800">{patient.privateHealthFund}</span></div>
                <div className="flex justify-between"><span className="text-ink-400">Member no.</span><span className="font-medium text-ink-800 tabular-nums">{patient.privateHealthMemberNo}</span></div>
              </div>
            ) : (
              <p className="mt-2 text-[12.5px] text-ink-400">No private health fund on file.</p>
            )}
          </div>

          <div className="rounded-2xl bg-teal-50 p-5">
            <p className="text-[12.5px] leading-relaxed text-teal-800">{CLINIC_INFO.bulkBillingNote}</p>
          </div>
        </div>
      </div>

      {paying && <PayModal invoice={paying} onClose={() => setPaying(null)} />}
      {viewing && <ReceiptModal invoice={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
