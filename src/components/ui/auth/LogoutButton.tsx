// src/components/auth/LogoutButton.tsx
'use client'; // This component needs to be a client component

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Use Shadcn button
import { createClient } from '@/lib/supabase/client'; // Use client-side Supabase client

export default function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        console.log('Logging out...');

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Error logging out:', error.message);
            // Optionally show an error toast message here
            // import { toast } from 'sonner';
            // toast.error(`Logout failed: ${error.message}`);
            setIsLoading(false);
        } else {
            console.log('Logout successful, redirecting to login.');
            // Redirect to login page after successful logout
            router.push('/login');
            // router.refresh(); // Optional: Force refresh server components
        }
        // No need to setIsLoading(false) on success as we are navigating away
    };

    return (
        <Button
            variant="outline" // Or choose another variant
            size="sm" // Make it small
            onClick={handleLogout}
            disabled={isLoading}
        >
            {isLoading ? 'Logging Out...' : 'Log Out'}
        </Button>
    );
}