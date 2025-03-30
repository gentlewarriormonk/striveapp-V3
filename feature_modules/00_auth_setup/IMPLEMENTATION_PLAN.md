# 🛠 Implementation Plan – Module: 00 Core Setup & Authentication

**Version:** 1.0
**Date:** March 29, 2025
**Status:** Not Started

**Goal:** Implement the features defined in `MINI_PRD.md` according to `TECH_DECISIONS.md`, setting up the Next.js project and core Supabase authentication.

**Workflow Reminder:**
1.  Use Gemini Agent in Cursor, referencing `@MINI_PRD.md` and `@TECH_DECISIONS.md` to clarify steps if needed.
2.  Use Gemini Agent in Cursor (or CLI) to create file/folder structure based on plan.
3.  Use Gemini Agent in Cursor to generate and implement code directly into local files, referencing plans/requirements.
4.  Commit frequently with clear messages. Update `PROGRESS.md` as tasks are completed.

*(Note: Steps assume you are starting with an empty folder structure besides the planning docs. If using `create-next-app`, some steps involve modifying existing files.)*

## Phase 1: Project Initialization & Supabase Setup

-   [ ] **Task 1.1:** Initialize Next.js Project.
    *   Action: Run `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*"` in the terminal at the project root (`striveapp` folder). Select 'Yes' for `use app router`. (The `.` installs in the current folder).
    *   Confirm: Basic Next.js structure (`src/app`, `package.json`, etc.) is created.
-   [ ] **Task 1.2:** Install Core Dependencies.
    *   Action: Run `npm install @supabase/supabase-js @supabase/ssr react-hook-form zod` in the terminal. Also install necessary `shadcn/ui` components (like button, input, label, form - follow `shadcn/ui` docs). (Note: `@supabase/auth-helpers-nextjs`, `@supabase/auth-ui-react`, `@supabase/auth-ui-shared` are no longer needed).
    *   Confirm: Dependencies are added to `package.json`.
-   [ ] **Task 1.3:** Configure Supabase Environment Variables.
    *   Action: Create `.env.local` file in the project root. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` variables, obtaining values from your Supabase project settings.
    *   Action: Create `.gitignore` (if not present from `create-next-app`) or ensure `.env.local` is added to it. (Prompt AI: "Generate a standard .gitignore file for a Next.js project and ensure .env.local is included.")
    *   Confirm: Variables are set and `.env.local` is ignored by Git.
-   [ ] **Task 1.4:** Create Supabase Client Helper.
    *   Action: Create `src/lib/supabase/client.ts` (or similar path). Implement function to create Supabase client using `createBrowserClient` from `@supabase/ssr`, reading keys from environment variables. (Prompt AI: "Create a Supabase client helper function in `src/lib/supabase/client.ts` using `createBrowserClient` from `@supabase/ssr` for use in client components.")
    *   Action: Create `src/lib/supabase/server.ts` (or similar). Implement function(s) to create Supabase client suitable for Server Components/Actions/Route Handlers, potentially using `createServerClient` from `@supabase/ssr` with cookie management. Note: The exact implementation might differ based on context (Server Component, Action, Route Handler, Middleware). (Prompt AI: "Create Supabase server client helper functions/utilities in `src/lib/supabase/server.ts` using `@supabase/ssr` suitable for various server-side contexts like Server Components, Server Actions, and Route Handlers, ensuring correct cookie handling.")
    *   Action: Create `src/lib/supabase/middleware.ts` (or similar). Implement function to create Supabase client specifically for use within Next.js Middleware using `createServerClient` from `@supabase/ssr` and the request/response objects. (Prompt AI: "Create a Supabase middleware client helper function in `src/lib/supabase/middleware.ts` using `createServerClient` from `@supabase/ssr` adapted for Next.js Middleware.")
    *   Confirm: Helper functions are created and export Supabase client instances suitable for different contexts.
-   [ ] **Task 1.5:** Apply Database Schema & RLS.
    *   Action: Navigate to the Supabase Dashboard > SQL Editor. Paste and run the SQL commands from `TECH_DECISIONS.md` (Section 3) to create the `profiles` table, the `handle_new_user` function, the trigger, enable RLS, and create the RLS policies.
    *   Confirm: `profiles` table exists, trigger is active, RLS is enabled, and policies are listed in Supabase dashboard.
-   [ ] **Task 1.6:** Configure Supabase Auth Providers.
    *   Action: In Supabase Dashboard > Authentication > Providers, ensure Email provider is enabled (decide on "Confirm email" setting).
    *   Action: Enable Google provider. Follow Supabase docs to create Google Cloud OAuth credentials, add Client ID/Secret to Supabase settings, and configure redirect URIs (`http://localhost:3000/auth/callback` and production URL).
    *   Action: In Supabase Dashboard > Authentication > URL Configuration, set the Site URL (e.g., `http://localhost:3000` for dev) and Additional Redirect URLs (include production URL).
    *   Confirm: Providers are enabled and configured in Supabase dashboard.

## Phase 2: Authentication UI & Logic

-   [ ] **Task 2.1:** Create Authentication Layout/Wrapper (Optional but Recommended).
    *   Action: Modify the root layout (`src/app/layout.tsx`) or create a dedicated auth layout component to potentially provide common styling or context for auth pages.
    *   Confirm: Layout structure is in place.
-   [ ] **Task 2.2:** Create Log In Page.
    *   Action: Create page file `src/app/login/page.tsx`.
    *   Action: Implement the login form UI manually using `shadcn/ui` components (e.g., `Input`, `Button`, `Label`, `Form` wrapper if using `react-hook-form`). Use `react-hook-form` for form state management and `zod` for validation (email/password presence). Include a button/link for Google OAuth. Logic should use the Supabase client (from `client.ts`) to call `signInWithPassword` or `signInWithOAuth`. (Prompt AI: "Implement the login page at `src/app/login/page.tsx`. Create a client component with a form built using `shadcn/ui` (Input, Button, Label) and `react-hook-form`. Add `zod` validation for email/password. Include buttons for email/password submission (calling Supabase `signInWithPassword`) and Google OAuth (calling `signInWithOAuth`).")
    *   Confirm: Login page renders with email/password fields, Google button, and uses `react-hook-form`.
-   [ ] **Task 2.3:** Create Sign Up Page.
    *   Action: Create page file `src/app/signup/page.tsx`.
    *   Action: Implement the sign-up form UI similar to Task 2.2, using `shadcn/ui`, `react-hook-form`, and `zod` (add password confirmation validation). Logic should call Supabase `signUp` function. Include Google OAuth option. (Prompt AI: "Implement the sign-up page at `src/app/signup/page.tsx` similar to the login page, using `shadcn/ui`, `react-hook-form`, and `zod`. Ensure validation includes password confirmation. Use Supabase `signUp` and `signInWithOAuth` methods.")
    *   Confirm: Sign-up page renders with necessary fields, Google button, and uses `react-hook-form`.
-   [ ] **Task 2.4:** Implement Auth Callback Route.
    *   Action: Create route handler file `src/app/auth/callback/route.ts`. Implement the GET handler to exchange the code from the OAuth provider for a session using a server client created with `@supabase/ssr` helpers (reading cookies from the request) and redirect the user (e.g., to `/dashboard`). (Prompt AI: "Implement the Supabase OAuth callback route handler at `src/app/auth/callback/route.ts` using `@supabase/ssr` helpers to exchange the code for a session and redirect the user.")
    *   Confirm: OAuth flow redirects correctly after Google authentication.
-   [ ] **Task 2.5:** Implement Log Out Functionality.
    *   Action: Create a simple client component (e.g., `src/components/auth/LogoutButton.tsx`) that uses the Supabase client (from `client.ts`) and calls the `signOut()` method on button click. Include logic to redirect the user (e.g., using `useRouter` from `next/navigation`) to `/login` after sign-out. (Prompt AI: "Create a `LogoutButton` client component that calls Supabase `signOut()` and redirects to `/login`.")
    *   Action: Place this button in the main layout (`src/app/layout.tsx`) or a header component (conditionally rendered only if user is logged in - checking session state will be part of route protection).
    *   Confirm: Clicking the logout button successfully ends the session and redirects.

## Phase 3: Route Protection & Profile Handling

-   [ ] **Task 3.1:** Implement Protected Routes.
    *   Action: Create `middleware.ts` at the project root (`striveapp/middleware.ts`). Use the Supabase middleware client helper (from `src/lib/supabase/middleware.ts` or directly using `@supabase/ssr`) to create a client, check the user's session, and refresh it if necessary. If no session exists for protected paths (e.g., `/dashboard`, `/tasks`, `/habits`), redirect to `/login`. Ensure the middleware correctly handles cookies for session management across requests. (Prompt AI: "Create Next.js middleware in `middleware.ts` using `@supabase/ssr` helpers. It should protect routes like `/dashboard`, redirect unauthenticated users to `/login`, and manage the user session using cookies.")
    *   Confirm: Attempting to access `/dashboard` (or another protected route) while logged out redirects to `/login`. Accessing `/login` or `/signup` works directly. Logged-in users can access protected routes.
-   [ ] **Task 3.2:** Create Basic Dashboard Page (Placeholder).
    *   Action: Create page file `src/app/dashboard/page.tsx`. Add minimal content indicating it's the dashboard for logged-in users. Ensure this route is covered by the middleware protection.
    *   Confirm: Logged-in users are redirected here (or can navigate here) successfully.
-   [ ] **Task 3.3:** Verify Profile Creation Trigger.
    *   Action: Sign up a new test user (either Email or Google).
    *   Action: Check the `profiles` table in the Supabase dashboard.
    *   Confirm: A new row exists in `profiles` corresponding to the new `auth.users` record, with the correct `id`, `email`, and default `display_name`.
-   [ ] **Task 3.4:** Display Basic User Info (Optional Test).
    *   Action: In the placeholder dashboard page (`src/app/dashboard/page.tsx`), make it a server component. Use a server client created with `@supabase/ssr` helpers (reading cookies implicitly via `cookies()` from `next/headers`) to get the current user session. Fetch the corresponding profile data from the `profiles` table using the user ID. Display the user's email or display name. (Prompt AI: "Modify `src/app/dashboard/page.tsx` to be a server component that fetches the logged-in user's session and profile data using `@supabase/ssr` server helpers and displays their email or display name.")
    *   Confirm: The dashboard page shows information specific to the logged-in user.

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
-   [ ] Task 5.3: Code review using AI Agent (Prompt Agent: "Critique the authentication setup using `@supabase/ssr` in `middleware.ts`, Supabase helper files, and auth pages `login/page.tsx`, `signup/page.tsx`, `auth/callback/route.ts`.").
-   [ ] Task 5.4: Final commit & push. Mark module `00_auth_setup` as 'In Progress' or 'Testing' in `PROJECT_PLAN.md`. Update this module's `PROGRESS.md`.