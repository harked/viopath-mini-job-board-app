# VioPath: Mini Job Board (Next.js + Supabase)

<img width="1365" height="1245" alt="image" src="https://github.com/user-attachments/assets/6d06d589-2fcb-4d6e-91c3-8b3e482ebacf" />

A simple job board where users can sign up, post jobs, and browse active listings. Built with Next.js App Router, Tailwind CSS, and Supabase for auth and data.

## Features

- Email/password auth with Supabase.
- Public job listings with search and filters (type, location, salary).
- Auth‑gated job posting and personal dashboard.
- Per‑user management of job posts (activate/deactivate, delete).
- User profiles with basic details.

## Tech Stack

- Next.js 14 (App Router) + React 18
- Supabase (Auth, Postgres, RLS)
- Tailwind CSS v4 + Geist fonts
- Radix UI primitives with shadcn‑style components

---

## Getting Started

### Prerequisites

- Node.js 18.17+ and pnpm (or npm/yarn)
- A Supabase project

### 1) Clone and install

```bash
pnpm install
# or: npm install / yarn install
```

### 2) Configure environment

Create `.env.local` in the project root with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: local redirect after auth (defaults to /dashboard)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
```

You can find these in Supabase Settings → API.

### 3) Set up the database

Run the SQL scripts (in order) in the Supabase SQL Editor or via CLI to create tables and RLS policies:

- `scripts/001_create_jobs_table.sql`
- `scripts/002_create_profiles_table.sql`
- `scripts/003_create_profile_trigger.sql`

These create:

- `public.jobs`: job posts with RLS policies so only owners can insert/update/delete, and the public can read active jobs.
- `public.profiles`: basic profile table with a trigger to auto‑create a profile on signup.

### 4) Run the app

```bash
pnpm dev
# visit http://localhost:3000
```

### 5) Build and start (production)

```bash
pnpm build
pnpm start
```

---

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon public key.
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (optional): Local redirect URL after email auth.

No server‑side keys are required for current features; all DB access is scoped via Supabase RLS and authenticated sessions.

---

## Project Structure

Key folders and files:

- `app/page.tsx`: Landing page.
- `app/jobs/page.tsx`: Job list with filters; fetches from `public.jobs` on the server.
- `app/jobs/[id]/page.tsx`: Job detail page.
- `app/post-job/page.tsx`: Auth‑gated page to publish a new job.
- `app/dashboard/page.tsx`: User dashboard with stats and job management.
- `app/dashboard/profile/page.tsx`: Profile settings page.
- `app/auth/*`: Login, sign‑up, success, and error pages.
- `app/actions/*`: Server Actions for database writes (create/delete/toggle job, update profile).
- `lib/supabase/*`: Client and server Supabase helpers and middleware.
- `components/*`: UI components (cards, forms, headers, filters, lists).
- `scripts/*.sql`: Database schema and security policies.

---

## Architecture Overview

### App Router & Rendering

- Server Components fetch data securely using a Supabase server client (`lib/supabase/server.ts`).
- Client Components manage forms and user interactions, calling Server Actions to mutate data.
- Next.js Middleware (`middleware.ts`) integrates with Supabase to refresh sessions and redirect unauthenticated users from protected routes (`/dashboard`, `/post-job`).

### Auth & Sessions

- Auth uses Supabase email/password via the browser client (`lib/supabase/client.ts`).
- Protected pages also verify the user on the server and redirect if unauthenticated.

### Data Model

- `public.jobs`: title, company, location, job_type, salary range, description, optional requirements/benefits, application email/URL, owner `user_id`, timestamps, and `is_active` flag.
- `public.profiles`: per‑user profile (auto‑created at signup via trigger) with name, company, bio, website.
- Row Level Security policies ensure:
  - Anyone can read active jobs.
  - Users can read all of their own jobs (active or not).
  - Users can insert/update/delete only the rows they own.

### Server Actions

- `app/actions/job-actions.ts`:
  - `createJobPost(formData, userId)` validates input and inserts a job, then revalidates `/jobs` and `/dashboard`.
  - `deleteJob(jobId, userId)` and `toggleJobStatus(jobId, userId, isActive)` enforce ownership and revalidate pages.
- `app/actions/profile-actions.ts`:
  - `updateProfile(formData, userId)` upserts profile data and revalidates dashboard pages.

### UI & Styling

- Tailwind CSS v4 with a small design system (buttons/cards/inputs/selects etc.).
- Geist Sans/Mono fonts and Radix primitives.

---

## Development Notes & Approach

- Security is handled primarily via Supabase RLS. The app never needs a service‑role key for current features.
- Reads happen on the server for better security and performance; writes go through Server Actions.
- Middleware keeps Supabase cookies in sync and gates protected routes.
- After mutations, `revalidatePath` is used to keep server rendered pages fresh.

---

## Deployment

Any Node hosting that supports Next.js 14 works (e.g., Vercel). Set the same environment variables on your hosting platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (optional)

Run the SQL scripts against your production Supabase database before first deploy.

---

## Troubleshooting

- Auth redirects to login unexpectedly:
  - Ensure cookies are allowed and env vars are set.
  - Confirm middleware is running and Supabase URL/key are correct.
- No jobs visible publicly:
  - Check `is_active` flag and that the public RLS select policy exists.
- Writes failing with RLS errors:
  - Ensure you are authenticated and `user_id` matches `auth.uid()` in insert/update/delete.

---

## License

This project is provided as‑is for demonstration purposes. Add a license of your choice if you plan to distribute.
