// src/app/layout.tsx (Corrected Cookie Handling for Supabase Client)
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';

import { cookies } from 'next/headers'; // Import cookies function
import { createServerClient, type CookieOptions } from '@supabase/ssr'; // Import Supabase server client and types

import LogoutButton from '@/components/ui/auth/LogoutButton'; // Ensure path is correct

export const metadata: Metadata = {
    title: 'Strive App',
    description: 'Track your tasks and habits, achieve your goals.',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = cookies(); // We still need this for direct access later if needed, but not passed directly to client config below

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            // *** CORRECTED COOKIE CONFIG ***
            // Pass the getter/setter functions directly using the imported cookies()
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    // Server Components cannot set cookies. This function needs to be passed
                    // but might not be called in this read-only context. If called, it would
                    // ideally throw an error or be handled in Middleware/Actions.
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // Log error perhaps
                        console.warn('Warning: Server Component tried to set cookie (set)', { name });
                    }
                },
                remove(name: string, options: CookieOptions) {
                     // Server Components cannot delete cookies.
                    try {
                        cookieStore.set({ name, value: '', ...options }); // Attempt to clear cookie
                    } catch (error) {
                        console.warn('Warning: Server Component tried to set cookie (remove)', { name });
                    }
                },
            },
             // *** END CORRECTED COOKIE CONFIG ***
        }
    );

    // --- Fetch user session server-side SAFELY ---
    let user = null;
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
        console.error('RootLayout: Error fetching user:', userError.message);
    } else if (userData?.user) {
        user = userData.user;
        console.log('RootLayout: User session checked server-side. User:', user.email);
    } else {
         console.log('RootLayout: User session checked server-side. User: Not logged in');
    }
    // --- End Safe Fetch ---

    return (
        <html lang="en" className={GeistSans.className}>
            <body className="bg-background text-foreground dark">
                <header className="sticky top-0 z-40 w-full border-b bg-background">
                    <div className="container flex h-16 items-center justify-between space-x-4 sm:space-x-0">
                        <div className="font-bold">Strive</div> {/* Header text */}
                        <div className="flex items-center space-x-4">
                            {user ? <LogoutButton /> : null}
                        </div>
                    </div>
                </header>
                <main className="container mt-4 flex-grow">
                    {children}
                </main>
            </body>
        </html>
    );
}