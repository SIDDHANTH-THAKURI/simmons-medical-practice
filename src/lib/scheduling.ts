import type { Appointment } from "@/types";
import { providers } from "@/data/providers";

const CLINIC_OPEN = { h: 8, m: 30 };
const CLINIC_CLOSE = { h: 17, m: 0 };
const LUNCH_START = { h: 12, m: 30 };
const LUNCH_END = { h: 13, m: 15 };
const ACTIVE_STATUSES = new Set(["confirmed", "pending", "completed"]);

export function slotTemplate(stepMins = 15): { h: number; m: number }[] {
  const slots: { h: number; m: number }[] = [];
  let h = CLINIC_OPEN.h;
  let m = CLINIC_OPEN.m;
  while (h < CLINIC_CLOSE.h || (h === CLINIC_CLOSE.h && m < CLINIC_CLOSE.m)) {
    const inLunch =
      (h > LUNCH_START.h || (h === LUNCH_START.h && m >= LUNCH_START.m)) &&
      (h < LUNCH_END.h || (h === LUNCH_END.h && m < LUNCH_END.m));
    if (!inLunch) slots.push({ h, m });
    m += stepMins;
    if (m >= 60) {
      m -= 60;
      h += 1;
    }
  }
  return slots;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isClinicDay(providerId: string, date: Date): boolean {
  const provider = providers.find((p) => p.id === providerId);
  return !!provider && provider.availableDays.includes(date.getDay());
}

export function getOpenSlotsForDate(
  providerId: string,
  date: Date,
  appointments: Appointment[]
): Date[] {
  if (!isClinicDay(providerId, date)) return [];

  const booked = new Set(
    appointments
      .filter(
        (a) =>
          a.providerId === providerId &&
          ACTIVE_STATUSES.has(a.status) &&
          sameDay(new Date(a.scheduledAt), date)
      )
      .map((a) => {
        const d = new Date(a.scheduledAt);
        return `${d.getHours()}:${d.getMinutes()}`;
      })
  );

  const now = new Date();
  const isToday = sameDay(date, now);

  return slotTemplate()
    .filter((s) => !booked.has(`${s.h}:${s.m}`))
    .map((s) => {
      const d = new Date(date);
      d.setHours(s.h, s.m, 0, 0);
      return d;
    })
    .filter((d) => !isToday || d.getTime() > now.getTime() + 30 * 60000);
}

export function getNextAvailableSlots(
  providerId: string,
  appointments: Appointment[],
  count = 4,
  daysAhead = 21
): Date[] {
  const results: Date[] = [];
  const today = new Date();
  for (let i = 0; i <= daysAhead && results.length < count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const open = getOpenSlotsForDate(providerId, d, appointments);
    for (const slot of open) {
      results.push(slot);
      if (results.length >= count) break;
    }
  }
  return results;
}

export function getNextAvailableDays(
  providerId: string,
  appointments: Appointment[],
  count = 6,
  daysAhead = 30
): Date[] {
  const results: Date[] = [];
  const today = new Date();
  for (let i = 0; i <= daysAhead && results.length < count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    if (getOpenSlotsForDate(providerId, d, appointments).length > 0) {
      results.push(d);
    }
  }
  return results;
}
