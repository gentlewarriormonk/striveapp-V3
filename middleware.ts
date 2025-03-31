// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    console.log('--- Middleware Start ---', request.nextUrl.pathname); // Log path
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    // If the cookie is set, update the request and response cookies
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    // If the cookie is removed, update the request and response cookies
                    request.cookies.set({ name, value: '', ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    // Refresh session if expired - THIS IS THE KEY PART
    // It also essential for Server Components to get the correct session
    const { data: { session } } = await supabase.auth.getSession();
     console.log('Middleware: getSession completed. Session found:', !!session);


    // Optional: Redirect logic (we'll add this in Task 3.1)
    // For now, just ensure the session is managed correctly by getSession()

    console.log('--- Middleware End ---');
    return response; // Return the response object (potentially with updated cookies)
}

// Ensure the middleware is only called for relevant paths.
export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico (favicon file)
        * Feel free to modify this pattern to include more paths.
        */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};