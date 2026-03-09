"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

export function ResendButton({ email }: { email?: string | null }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleResend = async () => {
        if (!email) {
            toast.error("Could not determine your email address.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            if (!res.ok) {
                throw new Error("Failed to resend");
            }

            toast.success("Verification email resent! Please check your inbox.");
        } catch (error) {
            toast.error("Failed to resend verification email.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleResend}
            disabled={isLoading || !email}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 text-muted-foreground" />}
            Resend Verification Email
        </button>
    );
}
