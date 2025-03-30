// src/app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr'; // Use the server client from @supabase/ssr

// Handles GET requests to /auth/callback
export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'; // Default redirect to dashboard

    console.log(`Auth Callback: Received code - ${code ? 'Yes' : 'No'}`);
    console.log(`Auth Callback: Redirecting to - ${next}`);

    if (code) {
        const cookieStore = cookies(); // Get cookie store
        const supabase = createServerClient( // Create server client specific to this request
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    // Provide getter/setter functions for cookie management
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options) {
                        cookieStore.delete({ name, ...options });
                    },
                },
            }
        );

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            console.log('Auth Callback: Code exchange successful. Redirecting...');
            // Redirect to the intended destination after successful login/signup
            return NextResponse.redirect(`${origin}${next}`);
        } else {
            console.error('Auth Callback: Error exchanging code:', error.message);
            // Handle error: redirect to an error page or login page with an error message
            // For simplicity, redirect back to login for now
            return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
        }
    } else {
        console.error('Auth Callback: No code found in URL.');
        // Handle case where no code is present (e.g., direct access attempt)
        return NextResponse.redirect(`${origin}/login?error=no_code_provided`);
    }
}