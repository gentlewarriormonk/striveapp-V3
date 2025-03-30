// src/app/(auth)/signup/page.tsx
'use client'; // Mark this as a Client Component

import React from 'react';
import { useRouter } from 'next/navigation'; // For redirection
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

// Import Supabase client creator
import { createClient } from '@/lib/supabase/client';

// --- 1. Define Validation Schema ---
// Add password confirmation and refine rules
const signupSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    // Add more complexity rules later if needed (uppercase, number, symbol)
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    // Add refinement to check if passwords match
    message: "Passwords don't match",
    path: ["confirmPassword"], // Show error message on the confirmPassword field
});

// Infer the TypeScript type from the schema
type SignupFormValues = z.infer<typeof signupSchema>;

// --- 2. Create the Sign Up Page Component ---
export default function SignupPage() {
    const router = useRouter();
    const supabase = createClient();

    // Loading states
    const [isLoadingEmail, setIsLoadingEmail] = React.useState(false);
    const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);

    // --- 3. Setup React Hook Form ---
    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    // --- 4. Email/Password Sign Up Handler ---
    const handleEmailSignup = async (values: SignupFormValues) => {
        setIsLoadingEmail(true);
        console.log('Signing up with:', values); // Debug log

        const { data, error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                // Optional: Add data to be stored in auth.users.user_metadata
                // data: {
                //   full_name: 'Optional Name',
                // }
                // This 'data' is accessible in the 'handle_new_user' trigger!
                // We set the redirect here too, Supabase might handle it after confirmation
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('Signup error:', error.message);
            toast.error(`Sign up failed: ${error.message}`);
        } else if (data.user && data.user.identities?.length === 0) {
            // This condition might indicate email confirmation is required but the user already exists without confirmation.
            // Supabase behavior might vary, testing is needed.
             console.warn('User exists but is unconfirmed:', data.user);
             toast.info('Please check your email inbox and spam folder to confirm your email address.');
             // Don't redirect yet, user needs to confirm
        } else if (data.session) {
             // If session is returned directly (e.g., email confirmation disabled)
            toast.success('Sign up successful! Redirecting...');
            router.push('/dashboard');
        }
         else {
            // Likely case: Email confirmation is required, email sent.
            // data.user might contain the user object even without a session
            console.log('Signup successful, confirmation email sent to:', values.email);
            toast.info('Sign up successful! Please check your email inbox and spam folder to confirm your account.');
            // Optionally clear form or redirect to a "check email" page
            // form.reset(); // Clear the form fields
        }

        setIsLoadingEmail(false);
    };

    // --- 5. Google OAuth Sign Up Handler ---
    // This is identical to the login handler, Supabase handles user creation
    // if the Google account isn't already linked.
    const handleGoogleSignup = async () => {
        setIsLoadingGoogle(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('Google sign up error:', error.message);
            toast.error(`Google sign up failed: ${error.message}`);
            setIsLoadingGoogle(false);
        }
        // On success, browser redirects via Supabase
    };

    // --- 6. Render the Form UI ---
    return (
        <>
            {/* Toaster component */}
            <Toaster richColors position="top-center" />

            {/* Logo Section */}
            <div className="mb-6">
                <Image
                    // Ensure this matches the file in /public
                    src="/Strive full colour with padding.png"
                    alt="Strive Logo"
                    // --- ADJUST width/height as needed ---
                    width={250}
                    height={60}
                    // --- End Adjust ---
                    priority
                />
            </div>
            {/* End Logo Section */}

            {/* Sign Up Form Card */}
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>
                        Enter your email and password to sign up
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleEmailSignup)} className="space-y-4">
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
                                                disabled={isLoadingEmail || isLoadingGoogle}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                                                placeholder="Create a password (min 8 chars)"
                                                disabled={isLoadingEmail || isLoadingGoogle}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Confirm Password Field */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Confirm your password"
                                                disabled={isLoadingEmail || isLoadingGoogle}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage /> {/* Will show "Passwords don't match" here */}
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button type="submit" className="w-full" disabled={isLoadingEmail || isLoadingGoogle}>
                                {isLoadingEmail ? 'Creating Account...' : 'Sign Up with Email'}
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
                                Or sign up with
                            </span>
                        </div>
                    </div>

                    {/* Google Button */}
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleSignup}
                        disabled={isLoadingEmail || isLoadingGoogle}
                    >
                        {isLoadingGoogle ? 'Redirecting...' : 'Sign Up with Google'}
                        {/* Add Google Icon here later */}
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                    Already have an account? 
                    {/* Link back to the Login page */}
                    <a href="/login" className="underline hover:text-primary">
                        Log In
                    </a>
                </CardFooter>
            </Card>
            {/* End Sign Up Form Card */}
        </>
    );
}