// src/app/(auth)/signup/page.tsx (With White Logo)
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image'; // Import Image

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
} from '@/components/ui/form';
import { Toaster, toast } from 'sonner';

// Import Supabase client creator
import { createClient } from '@/lib/supabase/client';

// Validation Schema
const signupSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoadingEmail, setIsLoadingEmail] = React.useState(false);
    const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: { email: '', password: '', confirmPassword: '' },
    });

    const handleEmailSignup = async (values: SignupFormValues) => {
        setIsLoadingEmail(true);
        const { data, error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });

        if (error) {
            toast.error(`Sign up failed: ${error.message}`);
        } else if (data.user && data.user.identities?.length === 0) {
             toast.info('Please check your email inbox and spam folder to confirm your email address.');
        } else if (data.session) {
            toast.success('Sign up successful! Redirecting...');
            router.push('/dashboard');
        } else {
            toast.info('Sign up successful! Please check your email inbox and spam folder to confirm your account.');
        }
        setIsLoadingEmail(false);
    };

    const handleGoogleSignup = async () => {
        setIsLoadingGoogle(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) {
            toast.error(`Google sign up failed: ${error.message}`);
            setIsLoadingGoogle(false);
        }
    };

    return (
        <>
            <Toaster richColors position="top-center" />

            {/* Logo Section */}
            <div className="mb-6">
                 <Image
                    src="/strive-logo-white-on-transparent.png" // White logo file
                    alt="Strive Logo"
                     // --- ADJUST size for login/signup page ---
                    width={200}
                    height={50}
                     // --- End Adjust ---
                    priority
                />
            </div>
            {/* End Logo Section */}

            {/* Sign Up Form Card */}
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>Enter your email and password to sign up</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleEmailSignup)} className="space-y-4">
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="name@example.com" type="email" disabled={isLoadingEmail || isLoadingGoogle} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Create a password (min 8 chars)" disabled={isLoadingEmail || isLoadingGoogle} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" placeholder="Confirm your password" disabled={isLoadingEmail || isLoadingGoogle} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Button type="submit" className="w-full" disabled={isLoadingEmail || isLoadingGoogle}>
                                {isLoadingEmail ? 'Creating Account...' : 'Sign Up with Email'}
                            </Button>
                        </form>
                    </Form>
                    <div className="relative my-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or sign up with</span></div></div>
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignup} disabled={isLoadingEmail || isLoadingGoogle}>
                        {isLoadingGoogle ? 'Redirecting...' : 'Sign Up with Google'}
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                    Already have an account? 
                    <a href="/login" className="underline hover:text-primary">Log In</a>
                </CardFooter>
            </Card>
        </>
    );
}