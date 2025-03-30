// src/app/(auth)/login/page.tsx
'use client'; // Mark this as a Client Component

import React from 'react';
import { useRouter } from 'next/navigation'; // For redirection after login
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image'; // Import the Next.js Image component

// Import Shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'; // Use Shadcn Form components
import { Toaster, toast } from 'sonner'; // Import Sonner

// Import Supabase client creator (assuming path is correct)
import { createClient } from '@/lib/supabase/client';

// --- 1. Define Validation Schema ---
const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }), // Basic check: not empty
    // Add more password rules later if needed (min length, etc.)
});

// Infer the TypeScript type from the schema
type LoginFormValues = z.infer<typeof loginSchema>;

// --- 2. Create the Login Page Component ---
export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient(); // Create Supabase client instance

    // For loading state to disable buttons during submission
    const [isLoadingEmail, setIsLoadingEmail] = React.useState(false);
    const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);


    // --- 3. Setup React Hook Form ---
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema), // Integrate zod schema for validation
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // --- 4. Email/Password Login Handler ---
    const handleEmailLogin = async (values: LoginFormValues) => {
        setIsLoadingEmail(true); // Set loading state
        console.log('Logging in with:', values); // Debug log

        const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        });

        if (error) {
            console.error('Login error:', error.message);
            toast.error(`Login failed: ${error.message}`); // Show error toast
        } else {
            toast.success('Login successful! Redirecting...');
            // Redirect to dashboard or intended page.
            router.push('/dashboard');
            // Consider router.refresh() if needed later for server component updates
        }
        setIsLoadingEmail(false); // Reset loading state
    };

    // --- 5. Google OAuth Login Handler ---
    const handleGoogleLogin = async () => {
        setIsLoadingGoogle(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Ensure this matches Supabase config and Task 2.4 route handler
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('Google login error:', error.message);
            toast.error(`Google login failed: ${error.message}`);
            setIsLoadingGoogle(false);
        }
        // On success, browser redirects via Supabase, so no need to reset loading state here
    };

    // --- 6. Render the Form UI ---
    return (
        <>
            {/* Toaster component is needed to render the toasts */}
            <Toaster richColors position="top-center" />

            {/* Logo Section */}
            <div className="mb-6"> {/* Adds space below the logo */}
                <Image
                    // Make sure this filename is EXACTLY correct
                    // and the file is inside your /public directory
                    src="/Strive full colour with padding.png"
                    alt="Strive Logo"
                    // --- ADJUST these based on your image's actual aspect ratio ---
                    width={250} // Example width
                    height={60} // Example height
                    // --- End Adjust ---
                    priority // Load this image early
                />
            </div>
            {/* End Logo Section */}

            {/* Login Form Card */}
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Log In</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Shadcn Form component wrapping the form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleEmailLogin)} className="space-y-4">
                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="name@example.com"
                                                type="email"
                                                autoCapitalize="none"
                                                autoComplete="email"
                                                autoCorrect="off"
                                                disabled={isLoadingEmail || isLoadingGoogle}
                                                {...field} // Connects input to react-hook-form
                                            />
                                        </FormControl>
                                        <FormMessage /> {/* Shows validation errors for email */}
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Your password"
                                                disabled={isLoadingEmail || isLoadingGoogle}
                                                {...field} // Connects input to react-hook-form
                                            />
                                        </FormControl>
                                        <FormMessage /> {/* Shows validation errors for password */}
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button for Email/Password */}
                            <Button type="submit" className="w-full" disabled={isLoadingEmail || isLoadingGoogle}>
                                {isLoadingEmail ? 'Logging In...' : 'Log In with Email'}
                            </Button>
                        </form>
                    </Form>

                    {/* Divider */}
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Google Login Button */}
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={isLoadingEmail || isLoadingGoogle}
                    >
                        {isLoadingGoogle ? 'Redirecting...' : 'Log In with Google'}
                        {/* Consider adding a Google SVG icon here later */}
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                    Don't have an account? 
                    {/* Link to the Sign Up page */}
                    <a href="/signup" className="underline hover:text-primary">
                        Sign Up
                    </a>
                </CardFooter>
            </Card>
            {/* End Login Form Card */}
        </>
    );
}