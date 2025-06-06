# ✅ Progress Tracker – Module: 00 Core Setup & Authentication

**Status:** Not Started

**Key:** `[ ]` = To Do, `[x]` = Done

## Phase 1: Project Initialization & Supabase Setup

-   [x] Task 1.1: Initialize Next.js Project.
-   [x] Task 1.2: Install Core Dependencies.
-   [x] Task 1.3: Configure Supabase Environment Variables.
-   [x] Task 1.4: Create Supabase Client Helper.
-   [x] Task 1.5: Apply Database Schema & RLS.
-   [x] Task 1.6: Configure Supabase Auth Providers.

## Phase 2: Authentication UI & Logic

-   [x] Task 2.1: Create Authentication Layout/Wrapper (Optional but Recommended).
-   [x] Task 2.2: Create Log In Page.
-   [x] Task 2.3: Create Sign Up Page.
-   [x] Task 2.4: Implement Auth Callback Route.
-   [x] Task 2.5: Implement Log Out Functionality.

## Phase 3: Route Protection & Profile Handling

-   [ ] Task 3.1: Implement Protected Routes.
-   [ ] Task 3.2: Create Basic Dashboard Page (Placeholder).
-   [ ] Task 3.3: Verify Profile Creation Trigger.
-   [ ] Task 3.4: Display Basic User Info (Optional Test).

## Phase 4: Testing & Polish

-   [ ] Task 4.1: Manual Testing - Sign Up (Email).
-   [ ] Task 4.2: Manual Testing - Sign Up (Google).
-   [ ] Task 4.3: Manual Testing - Log In (Email).
-   [ ] Task 4.4: Manual Testing - Log In (Google).
-   [ ] Task 4.5: Manual Testing - Log Out.
-   [ ] Task 4.6: Manual Testing - Protected Route Access (Logged In / Logged Out).
-   [ ] Task 4.7: Manual Testing - Profile Creation on Sign Up.
-   [ ] Task 4.8: Check Console for Errors.
-   [ ] Task 4.9: Basic UI Polish & Responsiveness Check on Auth Pages.

## Phase 5: Documentation & Final Review

-   [ ] Task 5.1: Add comments to complex code sections if needed.
-   [ ] Task 5.2: Update module `README.md` with setup notes if necessary (e.g., environment variable setup).
-   [ ] Task 5.3: Code review using AI Agent (Prompt Agent: "Critique the authentication setup in `middleware.ts`, auth helper files, and auth pages.").
-   [ ] Task 5.4: Final commit & push. Mark module `00_auth_setup` as 'In Progress' or 'Testing' in `PROJECT_PLAN.md`. Update this module's `PROGRESS.md`.

---

## 🧹 Polish Items (Module 00)

*   [ ] Adjust logo size on Login page (and Sign Up page later) if needed.
*   [ ] Add Google icon to the "Log In with Google" button (and Sign Up later).
*   [ ] Ensure Dark Mode is the default theme (likely involves root layout changes).
*   [ ] Refactor Sign Up/Login links (`<a>` tags) on auth pages to use Next.js `<Link>` component for optimized client-side navigation.
*   [ ] Investigate/resolve noisy "cookies() should be awaited" console errors in `layout.tsx` (possibly related to Next.js/Supabase SSR interaction).
---