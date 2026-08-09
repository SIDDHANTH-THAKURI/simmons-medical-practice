# Demo Video Script — Simmons Medical Practice Portal
### ABC Partners pitch prototype walkthrough (~6–7 min)

Each block = [ON SCREEN action] + VOICEOVER line. Pause ~1s between lines for pacing when recording clicks.

---

## 1. Cold open — the problem (20s)

**[ON SCREEN]** Landing page, hero section, slow scroll start.

**VOICEOVER:**
"Simmons Medical Practice runs on an ageing network, disconnected accounting software, and a patient system that can't even send a reminder text. Dr Simmons is the only person holding it together. This is what ABC Partners built to fix that — a single portal for patients and staff, live in the browser right now."

---

## 2. Landing page tour (45s)

**[ON SCREEN]** Scroll through hero → trust stats → "Problems We Solve" cards.

**VOICEOVER:**
"This is the patient and staff portal for Simmons Medical Practice. Every recommendation here traces back to a problem the practice actually raised — not a generic feature list."

**[ON SCREEN]** Hover/click through the four problem cards one at a time.

**VOICEOVER:**
"Ageing network — fixed with a segmented, redundant design. Disconnected accounting — fixed with one data model that syncs straight into Xero. No automated reminders — fixed with automated SMS, email, and an AI assistant. And no proactive advice — fixed with a live analytics dashboard for the owner. We'll show all four."

**[ON SCREEN]** Scroll to the interactive "Try it — pick a role" widget on the landing page. Click through 2–3 roles (Owner, Reception).

**VOICEOVER:**
"Even here on the marketing page, this access matrix is real — it's the exact permission model running inside the app."

---

## 3. Patient portal (90s)

**[ON SCREEN]** Click "Access Your Portal" → "I'm a Patient" → click the "Olivia Taylor" demo account.

**VOICEOVER:**
"Let's sign in as a patient. No password gymnastics for the demo — but a real sign-up flow exists too and creates an actual account."

**[ON SCREEN]** Patient home page: upcoming appointment card, overdue recall card, notifications bell.

**VOICEOVER:**
"Home shows what matters immediately — next appointment, anything overdue like a care plan review, and live notifications."

**[ON SCREEN]** Click "Book Appointment." Walk through all 4 steps: pick a reason chip, pick a provider, pick a real day and time slot, confirm.

**VOICEOVER:**
"Booking is four steps and fully live — this is checking real availability against the practice's actual schedule, not a mockup. No double-booking possible."

**[ON SCREEN]** Go to Billing & Medicare — show invoice history, Medicare card, receipt modal.

**VOICEOVER:**
"Billing shows the Medicare rebate and any gap payment side by side, with full history and downloadable receipts."

---

## 4. The AI assistant — solving reminder problem (75s)

**[ON SCREEN]** Click the floating chat bubble.

**VOICEOVER:**
"This is the fix for problem four — no automated reminders. It's not a scripted chatbot demo; it's checking live data."

**[ON SCREEN]** Click "Book me an appointment" → click the personalized reason chip → pick a provider → pick a day → pick a time → confirm.

**VOICEOVER:**
"Watch — it already knows Olivia has an overdue care plan review, so it suggests that first. I pick a provider, and it pulls their real next available slots. Confirm — and it's booked."

**[ON SCREEN]** Click "View my appointments" inside the chat, showing the new booking listed.

**VOICEOVER:**
"That booking is already in her appointments list. No phone call, no reception hold time — and this same assistant answers billing questions, reschedules, cancels, and hands off anything clinical straight to staff."

---

## 5. Staff portal — role-based access (2 min)

**[ON SCREEN]** Log out, go to "I'm Practice Staff," show the six role cards for a beat before clicking Reception (Sophie Nguyen).

**VOICEOVER:**
"Now the staff side. Six roles, each seeing only what they need — enforced by the data layer, not just a hidden button."

**[ON SCREEN]** Reception dashboard — point out greyed-out nav items (Claims, Reports, Security, Users).

**VOICEOVER:**
"Reception gets today's front-desk queue and read-only patient lookup. Everything else — claims, reports, security — is locked. Not hidden with CSS. Actually blocked."

**[ON SCREEN]** Try typing the URL directly to `/staff/app/security` — show the "restricted" screen.

**VOICEOVER:**
"Even typing the URL directly doesn't get her in. The access check happens at the data level."

**[ON SCREEN]** Use "Demo: switch role" dropdown → switch to Paul Simmons (Owner).

**VOICEOVER:**
"Switching to Dr Simmons, the owner — same portal, completely different view."

**[ON SCREEN]** Owner Dashboard: KPI tiles, no-show-by-provider chart, reminders-work dumbbell chart, claims breakdown.

**VOICEOVER:**
"This is the fix for problem four — a live view instead of ad-hoc advice. One thousand, one hundred seventy-seven appointments this quarter, eighty-three percent attendance, and — this is the number that matters — sending a reminder cuts no-shows from nineteen point seven percent to seven point one. Almost three times fewer missed appointments."

**[ON SCREEN]** Click into Claims & Billing, show the Xero sync widget.

**VOICEOVER:**
"And this is problem three, disconnected accounting — claims reconciled with Xero automatically, status visible in real time instead of a monthly guessing game."

**[ON SCREEN]** Click Users & Access, click into Sophie Nguyen, click one permission cell to change it live, show the toast.

**VOICEOVER:**
"The owner can also change anyone's access on the fly — this updates instantly across the whole portal."

**[ON SCREEN]** Click Security & System, scroll the live audit log.

**VOICEOVER:**
"And every single view, by every person, is logged automatically — not just who has access, but who actually looked, and when."

---

## 6. System architecture — how it's built (75s)

**[ON SCREEN]** Navigate to "System & Architecture" from the footer or nav.

**VOICEOVER:**
"For anyone technical in the room, here's how it actually works, visually."

**[ON SCREEN]** Network tab — toggle between Network Diagram and Physical Layout.

**VOICEOVER:**
"The network — segmented VLANs for clinical, admin, and guest traffic, with redundant failover. This solves problem one, the ageing network that used to drop bulk-billing claims mid-consult."

**[ON SCREEN]** Integration tab.

**VOICEOVER:**
"The integration layer — one data model feeding the practice system, HotDoc, and Xero, so nothing is ever entered twice."

**[ON SCREEN]** Database tab — hover a couple of entities to show relationship highlighting.

**VOICEOVER:**
"The actual database design — including a new feature for shared equipment costs between GPs, straight from the practice's original brief."

**[ON SCREEN]** Security tab — click through 2 role scenarios in the interactive flow.

**VOICEOVER:**
"And the access model we just saw in action, shown as a flow — a locked module means the query never returns the data at all."

---

## 7. Close (20s)

**[ON SCREEN]** Return to landing page, final CTA section.

**VOICEOVER:**
"One portal. Every problem Simmons Medical Practice raised, solved and running — not mocked up, not slides. This is ABC Partners' proposal, live."

**[END]**

---

### Notes for recording
- Reset demo data (button in patient sidebar / staff header) right before recording so numbers/state are clean.
- Record on a weekday if possible — Sunday shows an empty front-desk queue since the clinic isn't open (accurate, but less lively for the reception scene).
- Total runtime target: ~6.5 minutes. Trim section 5 or 6 first if you need to cut time.
