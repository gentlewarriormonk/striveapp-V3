Technical Decisions – Module: 00 Core Setup & Authentication
Version: 1.0
Date: March 29, 2025
Status: Draft

1. Core Technologies Used (Confirmation)
Framework: Next.js 14+ (App Router) with TypeScript.

Authentication Provider: Supabase Auth.

Database: Supabase Postgres.

UI Components: shadcn/ui (will be installed and used for forms/buttons).

Styling: Tailwind CSS.

Deployment: Vercel.

2. Key Libraries/Services Introduced or Heavily Used
@supabase/supabase-js: The core JavaScript library for interacting with Supabase (DB, Auth, etc.).

@supabase/ssr: The primary package for server-side auth integration with Next.js (App Router), managing sessions (via cookies), and protecting routes using middleware and server clients. Replaces the previous `@supabase/auth-helpers-nextjs`.

@supabase/auth-ui-react: (Removed) Pre-built React components for login/signup forms. Decision: Due to migration to `@supabase/ssr` and desire for full control over the UI/UX, we will build auth forms manually using `shadcn/ui` components, `react-hook-form` for state management, and `zod` for validation.

zod: (Required) For robust form validation for manually built auth forms.

react-hook-form: (Required) For managing form state, validation, and submission logic for manually built auth forms.

shadcn/ui: (Required) UI component library used to build the auth forms and other UI elements.

3. Database Schema Changes/Additions
3.1 profiles Table
A new table is required to store public user profile information linked to the authenticated user in auth.users. This table separates public/app-specific data from the secure auth.users table managed by Supabase Auth.

-- Table: profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Matches auth.users id
  updated_at TIMESTAMPTZ,
  display_name TEXT, -- User's chosen display name (can be updated)
  email TEXT UNIQUE, -- Copied from auth.users for potential easier querying/display (ensure kept in sync or read from auth user directly)
  current_xp INTEGER DEFAULT 0 NOT NULL,
  tier_level INTEGER DEFAULT 1 NOT NULL, -- Corresponds to TierSystem definition
  -- Add other profile-specific fields later (e.g., avatar_url)

  CONSTRAINT display_name_length CHECK (char_length(display_name) >= 3) -- Example constraint
);

-- Index for potential lookups
CREATE INDEX idx_profiles_display_name ON public.profiles(display_name);

-- Function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)); -- Use full_name from OAuth or fallback to email
  RETURN NEW;
END;
$$;

-- Trigger to call the function after a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
Use code with caution.
SQL
<!--
**Rationale:**
- Using the `auth.users.id` as the primary key (`id`) directly links the profile to the auth user and ensures referential integrity. `ON DELETE CASCADE` automatically removes the profile if the auth user is deleted.
- Storing `display_name` allows users to potentially change it later without affecting their login email.
- Storing `email` might simplify some queries but needs careful consideration regarding synchronization if the user changes their auth email (Supabase might handle this via triggers or events, or we read email directly from the session user). Let's start by storing it and re-evaluate.
- `current_xp` and `tier_level` are added here based on `MASTER_PRD.md` to establish the user's gamification state early.
- The `handle_new_user` function and trigger automate profile creation on sign-up, simplifying application logic. It attempts to use `full_name` if provided by OAuth (like Google) or defaults to the email address.
-->
3.2 Row Level Security (RLS) Policies for profiles
RLS must be enabled for the profiles table.

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Allow individual user read access"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile (specific columns)
CREATE POLICY "Allow individual user update access"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id); -- Ensures user doesn't change the ID

-- Policy: Allow authenticated users to view basic info of others (Optional - for Groups later)
-- Initially, restrict viewing others. We'll add group policies later.
-- Example (Deferred): Allow users to see display_name, tier, xp of others in the same group.

-- Policy: Allow profile creation (implicitly handled by the trigger's SECURITY DEFINER context)
-- No explicit INSERT policy needed for users if the trigger handles creation.
Use code with caution.
SQL
<!--
**Rationale:**
- These policies ensure that users can only see and modify their own profile data by default, leveraging Supabase's built-in `auth.uid()` function.
- Updating the policy (`FOR UPDATE`) prevents users from modifying other users' profiles or changing their own `id`.
- Read access for other users is initially restricted; group-based visibility will be added in the `05_groups` module.
-->
4. Supabase Auth Configuration (via Supabase Dashboard)
Email Provider: Enabled. Consider enabling "Confirm email" setting for security (requires handling the confirmation flow).

Google OAuth Provider: Needs to be enabled. Requires creating OAuth credentials in Google Cloud Console and adding the Client ID and Secret to the Supabase Auth settings. Redirect URLs need to be configured correctly (e.g., http://localhost:3000/auth/callback for local dev, production URL for deployment).

JWT Expiry: Review default settings (e.g., 1 hour access token, 7 days refresh token).

Redirect URLs: Configure allowed URLs for redirection after login/signup/OAuth callbacks in Supabase Auth settings (include localhost for development and production URL).

5. Key Implementation Notes/Rationale
Session Management: Rely heavily on @supabase/ssr utilities to manage user sessions via server-side cookies. This involves creating Supabase client instances correctly for Server Components, Server Actions, Client Components, and Route Handlers/Middleware using functions provided by `@supabase/ssr`.

Protected Routes: Use Next.js Middleware combined with helpers from @supabase/ssr (like `createServerClient`) to check session state and manage redirects for unauthenticated users trying to access protected paths.

UI Implementation: Build authentication forms (login, signup) manually using shadcn/ui components (e.g., Input, Button, Label). Use react-hook-form for form state management and zod for validation. Do not use `@supabase/auth-ui-react` or `ThemeSupa`. Place these custom forms on dedicated /login and /signup pages.

Profile Data Access: After login, fetch the user's profile data from the profiles table using the session user's ID via a Supabase client instance created with `@supabase/ssr` helpers.

Environment Variables: Supabase URL and Anon Key must be stored securely in environment variables (.env.local for Next.js). Keys needed client-side require the `NEXT_PUBLIC_` prefix (only the Anon key typically). The Service Role Key (if used for server-side admin tasks, although `@supabase/ssr` primarily uses the Anon key with cookie-based auth) should *not* have the public prefix. Ensure .env.local is added to .gitignore.

6. API Endpoints Created/Modified
No custom backend API endpoints are expected for basic auth functionality if relying solely on the Supabase client library and `@supabase/ssr`.

Next.js will require specific routes to handle the OAuth callback (e.g., /auth/callback), which will be implemented using Route Handlers and helpers from @supabase/ssr to exchange the code for a session.