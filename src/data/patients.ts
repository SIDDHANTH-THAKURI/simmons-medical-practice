import type { PatientUser } from "@/types";
import { Rng } from "./rng";

export type PatientFlavor =
  | "none"
  | "diabetes"
  | "hypertension"
  | "asthma"
  | "antenatal"
  | "immunisation"
  | "skin-check"
  | "mental-health-plan"
  | "cervical-screening"
  | "cardiac";

interface PatientSeed {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  flavor: PatientFlavor;
  providerId: string;
}

// Hand-curated roster (ages, conditions and provider mix chosen deliberately
// for range) — everything else (contact details, Medicare numbers, notify
// prefs) is deterministically generated below.
export const patientSeeds: PatientSeed[] = [
  { id: "pat-taylor-o", firstName: "Olivia", lastName: "Taylor", dob: "1989-04-12", flavor: "mental-health-plan", providerId: "prov-chen" },
  { id: "pat-brown-n", firstName: "Noah", lastName: "Brown", dob: "2016-09-02", flavor: "immunisation", providerId: "prov-ho" },
  { id: "pat-wilson-c", firstName: "Charlotte", lastName: "Wilson", dob: "1975-11-23", flavor: "diabetes", providerId: "prov-simmons" },
  { id: "pat-thompson-j", firstName: "Jack", lastName: "Thompson", dob: "1962-02-08", flavor: "hypertension", providerId: "prov-chen" },
  { id: "pat-nguyen-a", firstName: "Amelia", lastName: "Nguyen", dob: "1994-06-30", flavor: "antenatal", providerId: "prov-ho" },
  { id: "pat-anderson-w", firstName: "William", lastName: "Anderson", dob: "1958-12-15", flavor: "skin-check", providerId: "prov-simmons" },
  { id: "pat-martin-i", firstName: "Isla", lastName: "Martin", dob: "2019-03-01", flavor: "immunisation", providerId: "prov-ho" },
  { id: "pat-robinson-l", firstName: "Lucas", lastName: "Robinson", dob: "1985-07-19", flavor: "none", providerId: "prov-chen" },
  { id: "pat-patel-m", firstName: "Mia", lastName: "Patel", dob: "2001-10-05", flavor: "asthma", providerId: "prov-simmons" },
  { id: "pat-walker-h", firstName: "Henry", lastName: "Walker", dob: "1949-01-27", flavor: "cardiac", providerId: "prov-chen" },
  { id: "pat-turner-i", firstName: "Ivy", lastName: "Turner", dob: "1970-05-14", flavor: "cervical-screening", providerId: "prov-ho" },
  { id: "pat-campbell-r", firstName: "Ruby", lastName: "Campbell", dob: "1992-08-22", flavor: "mental-health-plan", providerId: "prov-simmons" },
  { id: "pat-clarke-e", firstName: "Ethan", lastName: "Clarke", dob: "1980-03-09", flavor: "diabetes", providerId: "prov-chen" },
  { id: "pat-mitchell-z", firstName: "Zoe", lastName: "Mitchell", dob: "2014-12-11", flavor: "immunisation", providerId: "prov-ho" },
  { id: "pat-harris-j", firstName: "James", lastName: "Harris", dob: "1955-09-17", flavor: "skin-check", providerId: "prov-simmons" },
  { id: "pat-cooper-a", firstName: "Ava", lastName: "Cooper", dob: "1998-02-25", flavor: "none", providerId: "prov-chen" },
  { id: "pat-white-o", firstName: "Oliver", lastName: "White", dob: "1967-06-06", flavor: "hypertension", providerId: "prov-ho" },
  { id: "pat-baker-c", firstName: "Chloe", lastName: "Baker", dob: "1990-11-30", flavor: "mental-health-plan", providerId: "prov-simmons" },
  { id: "pat-reid-t", firstName: "Thomas", lastName: "Reid", dob: "1943-04-04", flavor: "cardiac", providerId: "prov-chen" },
  { id: "pat-bell-s", firstName: "Sophia", lastName: "Bell", dob: "2008-07-21", flavor: "asthma", providerId: "prov-ho" },
  { id: "pat-scott-d", firstName: "Daniel", lastName: "Scott", dob: "1977-01-13", flavor: "skin-check", providerId: "prov-simmons" },
  { id: "pat-adams-l", firstName: "Lily", lastName: "Adams", dob: "1996-05-08", flavor: "none", providerId: "prov-chen" },
  { id: "pat-turner-s", firstName: "Samuel", lastName: "Turner", dob: "1963-10-29", flavor: "diabetes", providerId: "prov-ho" },
  { id: "pat-morgan-e", firstName: "Ella", lastName: "Morgan", dob: "1986-09-16", flavor: "antenatal", providerId: "prov-simmons" },
  { id: "pat-ward-b", firstName: "Benjamin", lastName: "Ward", dob: "1952-03-22", flavor: "hypertension", providerId: "prov-chen" },
  { id: "pat-fisher-h", firstName: "Hannah", lastName: "Fisher", dob: "2011-08-19", flavor: "immunisation", providerId: "prov-ho" },
  { id: "pat-simmons-l", firstName: "Leo", lastName: "Simmons", dob: "2017-02-14", flavor: "immunisation", providerId: "prov-simmons" },
  { id: "pat-collins-f", firstName: "Freya", lastName: "Collins", dob: "1983-12-03", flavor: "cervical-screening", providerId: "prov-chen" },
];

const suburbs = [
  "Toowong", "Auchenflower", "Milton", "St Lucia", "Indooroopilly",
  "Taringa", "Kenmore", "Chapel Hill", "Bardon", "Paddington",
  "Graceville", "Corinda", "Sherwood", "Rosalie",
];

const streets = [
  "Sylvan Road", "Jephson Street", "Miskin Street", "High Street", "Croydon Street",
  "Weller Road", "Kensington Terrace", "Macquarie Street", "Union Street", "Sherwood Road",
  "Honour Avenue", "Dixon Street", "Cribb Street", "Grove Street", "Laurel Avenue", "Fernberg Road",
];

const funds = ["Medibank", "Bupa", "HCF", "NIB", "HBF"];

export const avatarPalette = [
  "var(--color-teal-500)", "var(--color-terracotta-500)", "var(--color-amber-500)",
  "var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)",
  "var(--color-chart-5)", "var(--color-chart-7)", "var(--color-teal-700)",
];

function medicareNumber(rng: Rng): string {
  const n = Array.from({ length: 10 }, () => rng.int(0, 9)).join("");
  return `${n.slice(0, 4)} ${n.slice(4, 9)} ${n.slice(9)}`;
}

export function buildPatients(): PatientUser[] {
  const rng = new Rng(20260726);
  return patientSeeds.map((seed, i) => {
    const age = new Date().getFullYear() - new Date(seed.dob).getFullYear();
    const isMinor = age < 18;
    const isSenior = age >= 65;
    const suburb = rng.pick(suburbs);
    const street = `${rng.int(2, 188)} ${rng.pick(streets)}`;
    const hasPrivate = !isMinor && rng.bool(0.42);

    return {
      kind: "patient",
      id: seed.id,
      firstName: seed.firstName,
      lastName: seed.lastName,
      email: isMinor
        ? `${seed.firstName.toLowerCase()}.${seed.lastName.toLowerCase()}.guardian@example.com.au`
        : `${seed.firstName.toLowerCase()}.${seed.lastName.toLowerCase()}@example.com.au`,
      phone: `04${rng.int(10, 99)} ${rng.int(100, 999)} ${rng.int(100, 999)}`,
      dob: seed.dob,
      medicareNumber: medicareNumber(rng),
      medicareRefNo: String(rng.int(1, 9)),
      medicareExpiry: `${String(rng.int(1, 12)).padStart(2, "0")}/${rng.int(27, 30)}`,
      address: street,
      suburb: `${suburb} QLD 406${rng.int(6, 8)}`,
      avatarColor: avatarPalette[i % avatarPalette.length],
      registeredProviderId: seed.providerId,
      concessionCard: isSenior
        ? "Pensioner Concession Card"
        : rng.bool(0.12)
          ? "Health Care Card"
          : undefined,
      privateHealthFund: hasPrivate ? rng.pick(funds) : undefined,
      privateHealthMemberNo: hasPrivate ? String(rng.int(100000000, 999999999)) : undefined,
      notifyPrefs: {
        sms: rng.bool(0.88),
        email: rng.bool(0.7),
        reminderHoursBefore: rng.pick([24, 48, 72] as const),
      },
      emergencyContact: {
        name: isMinor ? "Parent / Guardian" : rng.pick(["Partner", "Sibling", "Adult child", "Friend"]),
        relationship: isMinor ? "Guardian" : rng.pick(["Spouse", "Sibling", "Child", "Friend"]),
        phone: `04${rng.int(10, 99)} ${rng.int(100, 999)} ${rng.int(100, 999)}`,
      },
      createdAt: new Date(Date.now() - rng.int(60, 900) * 86400000).toISOString(),
    };
  });
}

export const patientFlavorById: Record<string, PatientFlavor> = Object.fromEntries(
  patientSeeds.map((s) => [s.id, s.flavor])
);
