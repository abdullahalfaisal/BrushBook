# Painting Service Booking System — Requirements & Planning Document

**Prepared for:** Single-business painting service (Australia)
**Date:** June 19, 2026
**Status:** v1 (MVP) scope locked

---

## 1. Project Overview

A booking website for a single painting business operating in Australia. Customers browse available services, view price ranges, and submit a booking request. The business owner receives the request, contacts the customer directly to confirm details, and payment is handled offline (cash on completion).

This is a **lead-capture and booking-request system**, not a multi-vendor marketplace. There is one business/seller managing all bookings.

---

## 2. Confirmed Requirements

### Business Scope
- Single business, one owner/team (not a multi-painter marketplace)
- Services offered: **Interior painting** and **Exterior painting**
- Service area: **whole state** (specific state TBD)
- Branding: not ready yet — name, logo, and color scheme to be designed. Site will launch with a clean, generic template and swap branding in later without rebuild.

### Pricing
- Price shown as a **range** per service (e.g. $X–$Y), not a fixed price
- No online payment — **cash on completion**, confirmed manually by owner after contact

### Booking Flow
- Customer browses services → selects one → fills booking form
- Booking fields: name, phone, email, address, **preferred date (free text)**, notes
- No real-time calendar/slot-locking in v1 — owner manually avoids double-booking when confirming by phone
- On submit: confirmation message shown to customer; **email notification sent to owner**

### Notifications
- **Email only in v1** (via Resend or similar)
- SMS (Twilio) deferred to v1.1 — account setup/verification can take 1–2+ days and risks delaying the 3–4 day launch window

### Content Management
- Owner can edit **service details** (name, price range, description) via a simple admin form — this is included in v1, low extra cost since admin auth/DB already being built
- **Images**: full self-serve upload deferred to v1.1. In v1, service records have an `image_url` field; owner sends photos to developer, who uploads manually via Supabase Storage dashboard and pastes the URL into the admin form. No upload UI built yet.

### Admin Access
- Single admin login (owner only)
- v1 uses a simple password-protected admin page (not full multi-user auth system)
- Admin can: view booking list, update booking status, edit service details (name/price/description/image URL)

### Reviews/Testimonials
- Not a priority for v1 — deferred

### Language
- English only

---

## 3. Explicitly Out of Scope for v1 (Deferred to v1.1+)

| Feature | Reason for deferring |
|---|---|
| Image upload UI (drag/drop, resize, validate) | Time cost too high for 3–4 day window |
| SMS notifications (Twilio) | Account setup/approval time risk |
| Full CMS-style content editing | Simple service-edit form covers core need for now |
| Online payment (Stripe etc.) | Confirmed cash-on-completion model |
| Real-time calendar/slot locking | Owner confirms manually by phone/text |
| Multi-painter marketplace features (painter portal, profiles, payouts) | Confirmed single-business model |
| Reviews/testimonials | Not a priority |
| Visa/work-rights or background-check verification ("Home Affairs clearance") | **Still unresolved — see Open Items below** |

---

## 4. Open Items / Action Required

These items are **not yet resolved** and should be confirmed before or during build:

1. **"Home Affairs clearance" meaning** — unclear if this refers to visa work-rights verification (VEVO), a police/background check, or something else. Needs confirmation from the friend/client before any compliance-related feature is designed. Treated as out of scope for v1 until clarified.
2. **Domain name + email service account ownership** — not yet decided who will set this up (friend or developer). This is a hard dependency for go-live and should be actioned immediately, in parallel with development, to avoid blocking launch.
3. **Specific state of operation** — confirmed "whole state" but exact state not specified; needed for service-area copy and any future location-based logic.
4. **Branding assets** (logo, name, colors) — to be supplied later; site will launch with placeholder/generic design.

---

## 5. Tech Stack (v1)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js | Frontend + backend (API routes) in one app |
| Database + Auth + Storage | Supabase (Postgres) | Single service covers DB, admin login, and image storage — minimizes setup time |
| Email | Resend | Triggered on new booking submission |
| Hosting | Vercel | Fast deploy, good fit for Next.js |
| Spam protection | Cloudflare Turnstile (or similar) | Lightweight captcha on booking form |

No Redis, queue system, or microservices needed at this scale — a single Next.js app is sufficient for v1.

---

## 6. Database Schema (v1)

```
services
- id
- name
- type            (interior / exterior)
- price_min
- price_max
- description
- image_url        (nullable, set manually for v1)
- sort_order

bookings
- id
- customer_name
- phone
- email
- address
- service_id        (FK -> services.id)
- preferred_date     (text, free-form)
- notes
- status             (new / contacted / confirmed / done / cancelled)
- created_at
```

---

## 7. Architecture Summary

```
Next.js app (single deployable)
   ├── Public pages: home, services list, booking form
   ├── Admin pages: login, booking list, service edit (password-protected)
   ├── API routes: /api/book (save booking + trigger email), /api/admin/*
   ├── Supabase: Postgres DB, admin auth, image storage
   ├── Resend: email notification on new booking
   └── Hosted on Vercel
```

---

## 8. Build Timeline (3–4 Days)

| Day | Tasks |
|---|---|
| **Day 1** | Project scaffold (Next.js), Supabase setup (DB schema + admin auth), static services page |
| **Day 2** | Booking form, submit logic, DB save, Resend email trigger to owner, customer confirmation message |
| **Day 3** | Admin page: booking list + status update, service edit form (name/price/description/image URL), basic styling pass |
| **Day 4** | Deploy to Vercel, connect domain (once available), captcha/spam guard, full flow testing, buffer for fixes |

**Dependency note:** Day 4 domain connection depends on Open Item #2 (domain/email account setup) being resolved earlier in the timeline — ideally started Day 1, not Day 4.

---

## 9. Key Risks Flagged During Planning

- **Timeline risk:** 3–4 days is tight for a from-scratch build with no existing branding. Scope has been deliberately trimmed (no image upload, no SMS, no full CMS) to make this achievable. Any new feature requests during build will likely push the timeline.
- **Spam/fake bookings:** No online payment means no booking commitment. Captcha added as a low-cost guard; full fraud prevention not in scope for v1.
- **Manual double-booking risk:** Without slot-locking, two customers could request the same date. Owner must check existing bookings manually when confirming by phone.
- **Compliance uncertainty:** The "Home Affairs clearance" requirement is not yet understood well enough to build. No clearance/verification feature should be built until this is clarified — building the wrong thing here carries legal risk, not just rework cost.

---

## 10. Next Steps

1. Resolve Open Items (especially domain/email setup and clearance clarification)
2. Confirm specific state of operation
3. Begin Day 1 build tasks
