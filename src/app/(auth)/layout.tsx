import React from 'react';

// This layout component will wrap the Login and Sign Up pages.
// It uses Tailwind CSS classes to center the content vertically and horizontally.
export default function AuthLayout({
    children, // Layout components must accept and render a `children` prop
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            {/*
             * Explanation of Tailwind classes:
             * - min-h-screen: Ensures the div takes at least the full height of the viewport.
             * - flex: Enables Flexbox layout for centering.
             * - flex-col: Stacks flex items vertically (though here we only have one child, the content).
             * - items-center: Centers content vertically within the flex container.
             * - justify-center: Centers content horizontally within the flex container.
             * - bg-background: Sets the background color using the 'background' variable defined in globals.css/theme (useful with shadcn/ui). If shadcn isn't fully set up, you might use a specific color like 'bg-slate-900' for dark mode.
             * - p-4: Adds some padding around the content area.
             */}
            {children} {/* This is where the actual Login or Sign Up page content will be rendered */}
        </div>
    );
}