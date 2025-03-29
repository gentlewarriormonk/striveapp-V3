# 📄 Product Requirements Document (PRD) – Module: 00 Core Setup & Authentication

## 🎯 Goals for this Module
- [ ] Initialize the Next.js project structure.
- [ ] Configure Supabase integration (Database connection & Auth).
- [ ] Implement core user authentication flows: Sign Up, Log In, Log Out.
- [ ] Support both Email/Password and Google OAuth providers.
- [ ] Create a basic mechanism to store and retrieve minimal user profile data linked to the authenticated user.
- [ ] Ensure basic security practices for authentication are followed.

## 👤 User Personas Involved
-   Any potential user (Individual, Student, Professional, Group Member) needing to create an account or log in.

## 🧶 Core User Stories (Module Specific)
-   As a new user, I want to sign up for an account using my email and password so that I can start using Strive.
-   As a new user, I want to sign up for an account using my Google account so that I can start using Strive quickly.
-   As an existing user, I want to log in using my email and password so that I can access my data.
-   As an existing user, I want to log in using my Google account so that I can access my data quickly.
-   As a logged-in user, I want to log out of my account so that my session is ended securely.
-   As a logged-in user, the application needs to identify who I am so that it can load and save my specific tasks and habits (implicitly required for future modules).
-   As a user who forgot my password, I want a way to reset it securely (Stretch Goal for this module, could be deferred).

## ✳️ Key Features (Module Specific)
-   Next.js project initialization and basic setup.
-   Supabase Project setup and configuration within the Next.js app (environment variables).
-   Supabase Auth integration using the Supabase client library.
-   Sign Up page/component with Email/Password fields.
-   Sign Up with Google button/flow.
-   Log In page/component with Email/Password fields.
-   Log In with Google button/flow.
-   Log Out functionality (e.g., a button in the header/menu).
-   Protected Routes/Pages: Mechanism to ensure only logged-in users can access core application areas (like Dashboard, Tasks, Habits). Unauthenticated users should be redirected to Log In.
-   Basic User Profile Creation: Upon first sign-up, create a corresponding record in a `profiles` (or `users`) table in the Supabase database, linking it to the `auth.users` record via ID, storing at least a `user_id` and potentially a `display_name`.

## 🚫 Non-Functional Requirements (If applicable to this module)
-   Secure handling of authentication credentials and session tokens (Leveraging Supabase Auth capabilities).
-   Basic responsive design for Auth forms/pages.
-   Clear error handling and user feedback during sign-up/login failures.

## ✅ Success Criteria (Module Specific)
-   A new user can successfully create an account via Email/Password.
-   A new user can successfully create an account via Google OAuth.
-   An existing user can successfully log in via Email/Password.
-   An existing user can successfully log in via Google OAuth.
-   A logged-in user can successfully log out.
-   Accessing protected application pages redirects unauthenticated users to the login page.
-   A new record is created in the `profiles` table upon successful user sign-up.
-   Core authentication environment variables are securely managed.

---