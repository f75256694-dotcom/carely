# Carely

A premium two-sided marketplace connecting families and seniors with verified everyday helpers (Alltagshilfe).

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS with custom Sage Green design system
- **State:** Zustand with localStorage persistence
- **Animations:** Framer Motion + GSAP ScrollTrigger
- **Icons:** Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page with scroll storytelling
│   ├── care-seeker/page.tsx  # Senior view (large typography, bottom nav)
│   ├── family/page.tsx       # Family dashboard (live ticker, moments, schedule)
│   └── caregiver/page.tsx    # Helper dashboard (bookings, earnings)
├── components/
│   ├── landing/              # Hero, scroll story, features, trust sections
│   ├── dashboard/            # Shared dashboard shell with sidebar
│   └── layout/               # Navigation with role switcher, footer
├── store/
│   └── app-store.ts          # Zustand store (role persistence)
└── lib/
    ├── utils.ts              # Role config, cn helper
    └── gsap.ts               # GSAP ScrollTrigger setup
```

## Three Role Views

Use the **role switcher** in the top navigation to toggle between:

1. **Senior** — Maximum simplicity, huge typography, easy-to-tap buttons
2. **Family** — Live activity ticker, care schedule, photo moments feed
3. **Helper** — Bookings, client management, earnings overview

## Design System

- Primary accent: Sage Green (`#4A7C6F`)
- Backgrounds: Off-white (`#FAFAF8`) and soft gray
- Components: `rounded-2xl`, glassmorphism navigation, high whitespace
- Strictly typographic heroes — no generic vector illustrations

## Next Steps

- [ ] Caregiver KYC onboarding flow (ID upload, liveness, background check)
- [ ] GSAP ScrollTrigger enhancements on landing page
- [ ] Authentication and real data integration
