# 🔁 App Flow – Module: 00 Core Setup & Authentication

## 🧠 High-Level User Journeys

### 1. New User Sign Up (Email/Password)
1.  User navigates to the application root or a protected page.
2.  User is redirected to the **Log In Page** (as they are unauthenticated).
3.  User clicks the "Sign Up" link/button.
4.  User is presented with the **Sign Up Page**.
5.  User enters their email address and desired password (potentially with confirmation field).
6.  User clicks the "Sign Up" button.
7.  **System:** Validates input, calls Supabase Auth `signUp` function.
8.  **On Success:**
    *   Supabase Auth sends a confirmation email (if email confirmation is enabled - Recommended!).
    *   User might see a "Please check your email to confirm your account" message OR (if email confirmation is off/auto-confirmed) is redirected to the main application **Dashboard Page** (or originally requested protected page).
    *   A corresponding profile record is created in the database.
9.  **On Failure:** User sees an appropriate error message on the Sign Up Page (e.g., "Email already exists", "Password too weak").

### 2. New User Sign Up (Google OAuth)
1.  User navigates to the application root or a protected page.
2.  User is redirected to the **Log In Page**.
3.  User clicks the "Sign Up with Google" button.
4.  **System:** Initiates Supabase Auth `signInWithOAuth` flow for Google.
5.  User is redirected to Google's authentication screen.
6.  User logs into Google and grants permission.
7.  User is redirected back to the application.
8.  **System:** Supabase Auth handles the callback, verifies the user, creates the Auth record (and potentially triggers profile creation).
9.  **On Success:** User is logged in and redirected to the main application **Dashboard Page**.
10. **On Failure:** User might be redirected back to the Log In/Sign Up page with an error message.

### 3. Existing User Log In (Email/Password)
1.  User navigates to the application root or a protected page.
2.  User is redirected to the **Log In Page**.
3.  User enters their email address and password.
4.  User clicks the "Log In" button.
5.  **System:** Calls Supabase Auth `signInWithPassword` function.
6.  **On Success:** User session is created, user is redirected to the **Dashboard Page** (or originally requested protected page).
7.  **On Failure:** User sees an appropriate error message on the Log In Page (e.g., "Invalid credentials").

### 4. Existing User Log In (Google OAuth)
1.  User navigates to the application root or a protected page.
2.  User is redirected to the **Log In Page**.
3.  User clicks the "Log In with Google" button.
4.  **System:** Initiates Supabase Auth `signInWithOAuth` flow for Google.
5.  User is redirected to Google's authentication screen (may be skipped if already logged into Google and previously authorized).
6.  User logs into Google / confirms authorization.
7.  User is redirected back to the application.
8.  **System:** Supabase Auth handles the callback, verifies the user, creates the session.
9.  **On Success:** User is logged in and redirected to the **Dashboard Page**.
10. **On Failure:** User might be redirected back to the Log In page with an error message.

### 5. Logged-In User Log Out
1.  User is logged into the application (e.g., viewing the Dashboard).
2.  User clicks the "Log Out" button (location TBD - e.g., Header, Settings Menu).
3.  **System:** Calls Supabase Auth `signOut` function.
4.  User session is terminated.
5.  User is redirected to the **Log In Page** (or a public landing page).

### 6. Accessing Protected Routes
1.  User (authenticated or not) attempts to access a page designated as protected (e.g., `/dashboard`, `/tasks`, `/habits`).
2.  **System:** Checks for a valid user session (using Supabase Auth client state).
3.  **If Authenticated:** User proceeds to the requested page.
4.  **If Not Authenticated:** User is redirected to the **Log In Page**.

## 🧭 Screens & Key Components (In this Module)

-   **Log In Page/View:**
    -   Email Input Field
    -   Password Input Field
    -   "Log In" Button (Email/Password)
    -   "Log In with Google" Button
    -   Link to Sign Up Page
    -   (Optional) Link to Forgot Password Page
-   **Sign Up Page/View:**
    -   Email Input Field
    -   Password Input Field
    -   (Optional) Password Confirmation Field
    -   "Sign Up" Button (Email/Password)
    -   "Sign Up with Google" Button
    -   Link to Log In Page
-   **Log Out Button/Mechanism:** (Component to be placed in main layout later)
-   **Protected Route Logic:** Higher-order component, middleware, or layout-based check to manage access control.
-   **(Optional) "Check Email" / Confirmation Pending Page**
-   **(Optional) Forgot Password Page**
-   **(Optional) Reset Password Page**

## 🌊 Flow Logic (Simplified Mermaid Diagram)

```mermaid
graph TD
    A[User Arrives] --> B{Authenticated?};
    B -- No --> C[Login Page];
    B -- Yes --> D[Requested Protected Page / Dashboard];

    C --> E{Action?};
    E -- Login (Email) --> F[Submit Credentials];
    E -- Login (Google) --> G[Redirect to Google];
    E -- Go to Sign Up --> H[Sign Up Page];

    F --> I{Credentials Valid?};
    I -- Yes --> D;
    I -- No --> C;

    G --> J[Google Auth & Callback];
    J --> K{Auth Successful?};
    K -- Yes --> D;
    K -- No --> C;

    H --> L{Action?};
    L -- Sign Up (Email) --> M[Submit Credentials];
    L -- Sign Up (Google) --> G;
    L -- Go to Login --> C;

    M --> N{Sign Up Valid?};
    N -- Yes --> O[Email Confirmation? / Redirect to Dashboard];
    N -- No --> H;

    D --> P{Action?};
    P -- Click Logout --> Q[Sign Out Function];
    Q --> C;
    P -- Use App --> D;

    Notes on Conditional Logic/States
UI should handle loading states while authentication calls are in progress.

Error messages should be displayed clearly near the relevant input fields or form.

The specific redirect behavior after login/signup (to Dashboard vs. originally requested page) needs implementation.

Handling the OAuth callback requires specific routes/listeners in the Next.js app.

State management (knowing if a user is logged in) is crucial and needs to be accessible throughout the app (likely via React Context provided by Supabase Auth helpers).