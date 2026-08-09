// Headline practice KPIs — intentionally fixed to match the figures quoted in
// the ABC Partners proposal deck ("Staff Portal" & "AI Engineering" slides) so
// the live prototype and the pitch deck tell the same story. These represent
// the Q1 2026 quarter the proposal was built from; day-to-day records
// elsewhere in the app (appointments, audit log) run off the real clock so
// the demo always looks current whenever it's recorded.

export const QUARTER_LABEL = "Q1 2026";

export const practiceKpis = {
  appointmentsQuarter: 1177,
  attendanceRate: 83,
  noShowRate: 11.7,
  revenueAtRisk: 3782,
  claimsRejectedCount: 75,
  claimsLodgedCount: 977,
};

export const noShowByProvider = [
  { providerId: "prov-simmons", appointments: 380, noShowRate: 9.8 },
  { providerId: "prov-chen", appointments: 340, noShowRate: 12.4 },
  { providerId: "prov-ho", appointments: 330, noShowRate: 10.9 },
  { providerId: "prov-kim", appointments: 127, noShowRate: 16.7 },
];

export const claimsBreakdown = {
  paid: 860,
  pending: 42,
  rejected: 75,
};

export const reminderEffectiveness = {
  withoutReminder: 19.7,
  withReminder: 7.1,
  multiplier: 2.8,
};

// 12-week attendance / booking trend feeding the Reports page trend line —
// indexed against the same quarter, engineered so the average lands on the
// headline attendance rate.
export const weeklyAttendanceTrend = [
  { week: "W1", appointments: 88, attendanceRate: 78 },
  { week: "W2", appointments: 91, attendanceRate: 79 },
  { week: "W3", appointments: 89, attendanceRate: 80 },
  { week: "W4", appointments: 94, attendanceRate: 81 },
  { week: "W5", appointments: 96, attendanceRate: 82 },
  { week: "W6", appointments: 93, attendanceRate: 82 },
  { week: "W7", appointments: 98, attendanceRate: 83 },
  { week: "W8", appointments: 101, attendanceRate: 84 },
  { week: "W9", appointments: 97, attendanceRate: 85 },
  { week: "W10", appointments: 103, attendanceRate: 86 },
  { week: "W11", appointments: 105, attendanceRate: 87 },
  { week: "W12", appointments: 42, attendanceRate: 87 },
];

export const bookingChannelSplit = [
  { channel: "Online / App", value: 54 },
  { channel: "Phone · Reception", value: 34 },
  { channel: "AI Assistant", value: 12 },
];

export const revenueAtRiskTrend = [
  { month: "Jan", amount: 1180 },
  { month: "Feb", amount: 1340 },
  { month: "Mar", amount: 1262 },
];
