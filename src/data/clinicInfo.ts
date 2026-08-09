export const CLINIC_INFO = {
  name: "Simmons Medical Practice",
  address: "24 Grafton Street, Toowong QLD 4066",
  phone: "(07) 3870 4422",
  fax: "(07) 3870 4423",
  email: "reception@simmonsmedical.com.au",
  hours: [
    { day: "Monday – Friday", time: "8:00 AM – 5:30 PM" },
    { day: "Saturday", time: "9:00 AM – 12:00 PM (Dr Simmons only)" },
    { day: "Sunday & Public Holidays", time: "Closed" },
  ],
  bulkBillingNote:
    "Simmons Medical Practice bulk-bills all standard consultations for Medicare card holders — no out-of-pocket cost. Some procedures, like skin excisions, may involve a small gap payment, and we'll always tell you beforehand.",
  parkingNote:
    "Free on-site patient parking is available off Grafton Street, plus 2-hour street parking on nearby streets.",
  telehealthNote:
    "Phone and video consultations are available for eligible follow-ups and repeat scripts — ask reception or your GP if your visit qualifies.",
  newPatientNote:
    "Bring photo ID, your Medicare card, and a list of current medications. If you're transferring care, we can request your records from your previous practice on your behalf.",
} as const;

export const ABC_PARTNERS_INFO = {
  name: "ABC Partners",
  slogan: "Managed IT & Financial Partnership",
  address: "Level 3, 88 Eagle Street, Brisbane QLD 4000",
  phone: "(07) 3000 1122",
  email: "partners@abcpartners.com.au",
} as const;
