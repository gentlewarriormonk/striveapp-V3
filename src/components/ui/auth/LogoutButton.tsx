// src/components/ui/auth/LogoutButton.tsx (Modified handleLogout)
'use client';

import React from 'react';
// useRouter is no longer strictly needed if using window.location
// import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner'; // Import toast if you want error messages

export default function LogoutButton() {
    // const router = useRouter(); // We might not need this anymore
    const supabase = createClient();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        console.log('Logging out...');

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Error logging out:', error.message);
            toast.error(`Logout failed: ${error.message}`); // Show error toast
            setIsLoading(false);
        } else {
            console.log('Logout successful, redirecting to login via full reload.');
            // Redirect using a full page reload instead of router.push
            window.location.assign('/login');
            // No need to reset isLoading state as the page is navigating away
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
        >
            {isLoading ? 'Logging Out...' : 'Log Out'}
        </Button>
    );
}