# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and technical leads hiring for **apprenticeships (alternance)** in two adjacent fields: cybersecurity and web development. They evaluate in a short window, usually on a laptop, often comparing several candidates in one sitting. Their first questions are factual: what is this person studying, are they available, and is there anything real behind the claims.

A secondary audience is the engineer who follows the GitHub links to read the actual code.

## Product Purpose

A personal portfolio for Maximilien Ilic. Success is a single, measurable event: a recruiter initiates contact about an apprenticeship. Everything on the site either moves toward that or is decoration.

## Positioning

Maximilien builds the application **and its defenses in the same gesture** — he ships the feature and the proof that it holds.

This is not a claim to be asserted; it is already present in the work. The Formula 1 CRUD project was built with input validation, authentication, and explicit protection against SQL injection, XSS, and CSRF. The amusement-park booking project carries authentication, roles, and an admin surface. The competing profiles a recruiter sees are usually one or the other: a developer who does not think about attack surface, or a security student who has never shipped a working application.

The site must make the hybrid read as a single competence, not as a student hedging between two fields.

## Operating Context

- Evaluation happens fast and often in a comparison set; the surface has seconds to establish what this is.
- Recruiters verify by leaving: GitHub links are followed, and the code has to survive that visit.
- Availability and diploma are the facts screened for first, before any project is read.
- The projects are demonstrated by short screen-capture videos already recorded and stored in `public/videos/`.

## Capabilities and Constraints

- Next.js 16 / React 19 / TypeScript. **No UI or animation dependencies at all** — no Tailwind, no CSS framework, no animation library, no 3D library. Components are CSS Modules; every drawn thing is hand-built SVG on an integer pixel grid (`lib/pixel.ts`, `lib/sprites.ts`). This is a deliberate constraint, not an omission: keep it.
- **Deployment: AWS.** The specific service is not confirmed. It matters only if a server-side capability is ever reintroduced; the site is currently fully static (`npm run build` prerenders every route), so an object-storage/CDN deployment is sufficient today. **Undecided — confirm before adding anything server-side.**
- **There is no contact form.** The contact path is a `mailto:` link plus GitHub and LinkedIn. The previous Resend API route was removed. Reintroducing a form would require confirming the AWS service first.
- Site content is **English only**.
- Project demos are four MP4 screen recordings totalling ~52 MB, the largest at 26 MB. They are loaded with `preload="metadata"` and played only while in view, so they do not block first paint — but the source files are unoptimized and each still costs a large download once it enters the viewport. Re-encoding is an open improvement.

## Brand Commitments

- Name: **Maximilien Ilic**. Real and binding contact points: GitHub `@maximilien-ilic`, `maximilien.ilic@gmail.com`, LinkedIn `/in/maximilien-ilic`.
- **The visual world is "The Great Sea", and it is binding.** Its rules live in `DESIGN.md` and are not up for reinvention: the page crosses the horizon once, flat colour steps, hard ink edges, no gradients, no blur, one wind direction left to right, every drawn thing on an integer pixel grid.
- Pinned references, confirmed by the user: **Zelda: The Wind Waker** and **Pokémon Black/White on Nintendo DS** — pixel art, a blue world that is nonetheless colourful. New work extends this world; it does not replace it.
- No logo or wordmark exists.

## Evidence on Hand

**Confirmed and usable:**
- Four real projects, each with a public GitHub repository and a recorded video demonstration:
  - `Crud-security-formula1` — PHP/MySQL/PDO, secure CRUD (SQLi, XSS, CSRF hardening)
  - `theme-enfant-Miyazaki-PSG` — WordPress child theme, PHP/CSS
  - `Themed Button Navigator for Blender` — Python addon, 200+ operators by keyboard, accessibility-oriented
  - `MVC amusement park booking` — PHP/MVC/PDO, accounts, reservations, admin dashboard (team project)

**Confirmed by the CV (`MaximilienIlic-CV.pdf`, supplied by the user) — usable, and currently ABSENT from the site:**

- **Formation:** IIM Digital School — Bachelor Chef de Projet Digital, 09/2024 – 06/2027, specialising in Web Development, Cybersecurity & Data Management. Before that, Lycée Paul Lapie, Baccalauréat Scientifique (Maths + NSI), 09/2021 – 06/2023.
- **Professional experience:**
  - *Full Stack Developer, internship at Holinea* (05/2025 – 08/2025) — patient/therapist matching platform: React/Next.js SPA, NestJS API, FastAPI microservice, Prisma, PostgreSQL, Supabase Auth, Stripe, n8n automation, plus a full security audit.
  - *Web freelance, ACAAE* (01/2025 – 04/2025) — WordPress rebuild, SEO, UX.
  - *Web freelance, Cour Rolland* (10/2024 – 12/2024) — WordPress rebuild, content architecture, SEO.
- **Projects not yet on the site:** a CI/CD pipeline that security-analyses every GitHub commit through the Claude API via n8n and posts reports into pull requests; EDS Mineralogical Mapping (Python/NumPy — 11 element maps classified into 9 mineral phases); Data Football (Python/SQL analysis pipeline).
- **Skills:** TypeScript, JavaScript, Python, PHP, SQL; NestJS, React, Next.js, FastAPI, Symfony, Vue.js; PostgreSQL, Prisma, MySQL; Git, Docker, Linux, CI/CD, n8n; XSS/CSRF/SQLi hardening, GDPR, security audit.
- **Languages:** French native, English B2, Spanish A1.
- **Also on the CV, not on the site:** phone +33 6 29 55 02 36, location Courbevoie, own domain `maximilien-ilic.fr`.

**Positioning conflict to resolve:** the CV leads with **"Développeur Full Stack — alternance recherchée"**. The site leads with "Web Developer | Cybersecurity Student". These are different claims to different readers, and the CV's is the stronger one because it is backed by shipped production work. The site currently shows four student projects and no employment history at all.

**Explicitly absent — must not be invented:**
- No certifications or platform rankings (TryHackMe, HackTheBox, Root-Me, CompTIA) appear on the CV; none must be shown.
- No testimonials, client quotes, or performance metrics beyond what the CV states.

## Product Principles

1. **The hybrid is the position, not a compromise.** Never present security and development as two separate halves of a split profile.
2. **Prove, do not assert.** Every claim resolves to something a visitor can open: a repository, a running demo, a video.
3. **Never fabricate evidence.** Absent facts stay absent or ship as clearly marked placeholders on the user's list.
4. **The contact path is the purpose of the page**, and it must actually work in the deployed environment.
5. **The craft of the site is itself evidence.** A portfolio arguing for rigor that fails keyboard navigation or ships 52 MB of video contradicts its own claim.

## Accessibility & Inclusion

No externally imposed standard was established. However, principle 5 makes accessibility product-relevant rather than optional: the current build has no keyboard path to project cards, no visible focus styles, and no `prefers-reduced-motion` handling despite a permanently animated WebGL background and four looping videos. Baseline WCAG AA (4.5:1 contrast, full keyboard operability, honored motion preference) is treated as a product requirement.
