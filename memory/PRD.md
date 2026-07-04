# Aatreya Infotech Systems LLP — Corporate Website

## Problem Statement
Premium corporate website for Aatreya Infotech Systems LLP — a Government-registered Indian startup delivering enterprise-grade digital solutions for temples, religious institutions, and public sector projects. Tagline: "Technology with Devotion. Innovation with Integrity." Style reference: TCS/Infosys/Accenture, adapted with Indian spiritual accents (dark navy + saffron/gold).

## Architecture
- **Frontend**: React 19 + React Router 7 + Tailwind + shadcn/ui + sonner + lucide-react. Fonts: Cormorant Garamond (headings), Outfit (body), JetBrains Mono (labels).
- **Backend**: FastAPI + Motor (async MongoDB) + Resend SDK.
- **Data**: MongoDB collection `contact_submissions`.
- **Email**: Resend API (sender `onboarding@resend.dev`, delivery to verified `sriaatreyainfotechsystems@gmail.com` — testing mode).

## User Personas
- Temple administrators / trust officials evaluating digital vendors.
- Government officers reviewing project credentials.
- Journalists / press looking for company info.
- Job seekers exploring careers at Aatreya.
- Existing clients seeking support / re-engagement.

## Core Requirements
1. 9-page corporate site: Home, About, Services, Projects, Products, Technology, Media, Careers, Contact.
2. Content: services (9), major projects (6 temples inc. PM visit), tech stack, vision, achievements.
3. Contact form storing submissions in MongoDB and emailing team via Resend.
4. Premium editorial dark theme (#060A14 base, #D4AF37 gold, #FF9933 saffron).
5. Fully responsive; mobile nav; data-testids on all interactive elements.

## Implemented (2026-07-04)
- Router with 9 routes, sticky glassmorphic navbar, editorial footer.
- Home: cinematic hero (temple image, dark overlay), about snippet, bento services grid, projects showcase (4), why choose, vision, stats, testimonial.
- About, Services (with ecosystem pills), Projects (all 6), Products (6 flagship products), Technology (stack by family + architecture principles), Media (timeline), Careers (culture + 4 open roles), Contact (form + info).
- Backend: `/api/health`, `POST /api/contact`, `GET /api/contact` — Resend email + Mongo persistence.
- Testing: 100% backend + 100% frontend pass (testing_agent_v3 iteration 1).

## Prioritized Backlog
### P1
- Verify a real domain (e.g. `aatreya.co.in`) in Resend so contact emails deliver to `info@aatreya.co.in` (currently locked to Resend account's verified test address).
- Auth-protect `GET /api/contact` (currently open) — add simple admin key or JWT before production.
- Migrate `@app.on_event("shutdown")` to FastAPI lifespan context manager.

### P2
- Admin dashboard page to view contact submissions.
- SEO: meta tags per page, sitemap, favicon set, Open Graph images.
- Add a Live Dashboards / product screenshots section with real UI mockups.
- Multi-language support (Telugu / Hindi).
- Blog / Press Releases full CMS (currently a static timeline).
- Case study detail pages per project.

### P3
- Devotee-facing pilot demo (interactive QR scan mock).
- Cookie consent + Privacy Policy / Terms pages.
- Analytics (Plausible / GA4).

## Test Credentials
Not applicable — no auth in v1.
