// src/app/layout.tsx (Relying on Middleware for Session State)
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';

import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import Image from 'next/image';

import LogoutButton from '@/components/ui/auth/LogoutButton';

export const metadata: Metadata = {
    title: 'Strive App',
    description: 'Track your tasks and habits, achieve your goals.',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    console.log('\n--- RootLayout Start (Relying on Middleware) ---');
    const cookieStore = cookies();

    // Create client - primarily needed if other parts of layout fetch Supabase data
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    // Still might trigger await error, but let's see
                    return cookieStore.get(name)?.value;
                },
                 // Add set/remove stubs in case getUser internally needs them,
                 // even if server components shouldn't call them directly.
                set(name: string, value: string, options: CookieOptions) { },
                remove(name: string, options: CookieOptions) { },
            },
        }
    );

    // Fetch user session data - expecting middleware to have handled refresh/expiry
    console.log('Layout (Relying on Middleware): Calling supabase.auth.getUser()...');
    const { data: { user } } = await supabase.auth.getUser(); // Keep the direct destructure for now

     if (user) {
         console.log('Layout (Relying on Middleware): User FOUND. User:', user.email);
     } else {
          console.log('Layout (Relying on Middleware): User NOT FOUND.');
     }
     console.log('--- RootLayout End (Relying on Middleware) ---');


    return (
         <html lang="en" className={GeistSans.className}>
             <body className="bg-background text-foreground dark">
                 <header className="sticky top-0 z-40 w-full border-b bg-background">
                     <div className="container flex h-16 items-center justify-between space-x-4 sm:space-x-0">
                          <div className="flex items-center">
                              <Image
                                  src="/strive-logo-white-on-transparent.png"
                                  alt="Strive Logo"
                                  width={100}
                                  height={25}
                                  priority
                              />
                          </div>
                         <div className="flex items-center space-x-4">
                             {/* The conditional render based on the fetched user */}
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