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

@supabase/auth-helpers-nextjs: Provides convenience functions and hooks specifically for integrating Supabase Auth with Next.js (App Router), managing sessions, and protecting routes.

@supabase/auth-ui-react: (Optional but Recommended) Pre-built React components for login/signup forms that integrate easily with Supabase Auth. Can be customized with Tailwind CSS. Using this can significantly speed up UI development for auth. If not used, forms will be built manually using shadcn/ui. Decision: Use @supabase/auth-ui-react initially for speed, customized to match the Strive theme.

zod: (Recommended) For form validation if building forms manually or adding extra validation.

react-hook-form: (Recommended) If building forms manually for better state management and validation integration.

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
Session Management: Rely heavily on @supabase/auth-helpers-nextjs to manage user sessions via server-side cookies. This includes creating the Supabase client instance for both server components/actions and client components.

Protected Routes: Use Next.js Middleware or wrap layouts/pages with logic provided by @supabase/auth-helpers-nextjs (e.g., checking session state) to redirect unauthenticated users.

UI Implementation: Use @supabase/auth-ui-react components (<Auth />) configured with Supabase client and desired providers (Email, Google). Apply Tailwind CSS theme overrides to match the Strive aesthetic. Place these components on dedicated /login and /signup pages.

Profile Data Access: After login, fetch the user's profile data from the profiles table using the session user's ID via the Supabase client library.

Environment Variables: Supabase URL and Anon Key must be stored securely in environment variables (.env.local for Next.js), prefixed with NEXT_PUBLIC_ for client-side access as required by the Supabase client library. Ensure .env.local is added to .gitignore.

6. API Endpoints Created/Modified
No custom backend API endpoints are expected for this module if relying solely on the Supabase client library for Auth and DB interactions.

Next.js will require specific routes to handle the OAuth callback (e.g., /auth/callback), typically handled by @supabase/auth-helpers-nextjs.