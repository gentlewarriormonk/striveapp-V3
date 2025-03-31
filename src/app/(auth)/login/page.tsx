// src/app/(auth)/login/page.tsx (With White Logo)
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
const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoadingEmail, setIsLoadingEmail] = React.useState(false);
    const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const handleEmailLogin = async (values: LoginFormValues) => {
        setIsLoadingEmail(true);
        const { error } = await supabase.auth.signInWithPassword(values);
        if (error) {
            toast.error(`Login failed: ${error.message}`);
        } else {
            toast.success('Login successful! Redirecting...');
            router.push('/dashboard');
        }
        setIsLoadingEmail(false);
    };

    const handleGoogleLogin = async () => {
        setIsLoadingGoogle(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) {
            toast.error(`Google login failed: ${error.message}`);
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

            {/* Login Form Card */}
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Log In</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleEmailLogin)} className="space-y-4">
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@example.com" type="email" disabled={isLoadingEmail || isLoadingGoogle} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Your password" disabled={isLoadingEmail || isLoadingGoogle} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" className="w-full" disabled={isLoadingEmail || isLoadingGoogle}>
                                {isLoadingEmail ? 'Logging In...' : 'Log In with Email'}
                            </Button>
                        </form>
                    </Form>
                    <div className="relative my-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div></div>
                    <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoadingEmail || isLoadingGoogle}>
                        {isLoadingGoogle ? 'Redirecting...' : 'Log In with Google'}
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                    Don't have an account? 
                    <a href="/signup" className="underline hover:text-primary">Sign Up</a>
                </CardFooter>
            </Card>
        </>
    );
}