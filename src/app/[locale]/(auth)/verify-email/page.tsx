"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email address...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Missing verification token.");
            return;
        }

        fetch(`/api/auth/verify-email?token=${token}`)
            .then(res => res.json().then(data => ({ ok: res.ok, data })))
            .then(({ ok, data }) => {
                if (ok) {
                    setStatus("success");
                    setMessage(data.message || "Email verified successfully!");
                } else {
                    setStatus("error");
                    setMessage(data.error || "Failed to verify email.");
                }
            })
            .catch(() => {
                setStatus("error");
                setMessage("Something went wrong verifying your email.");
            });
    }, [token]);

    return (
        <div className="text-center">
            {status === "loading" && (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-muted-foreground">{message}</p>
                </div>
            )}

            {status === "success" && (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                    <h3 className="text-xl font-bold text-foreground">Verified!</h3>
                    <p className="text-muted-foreground">{message}</p>
                    <Link href="/login" className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600">
                        Continue to Login
                    </Link>
                </div>
            )}

            {status === "error" && (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <XCircle className="w-16 h-16 text-red-500" />
                    <h3 className="text-xl font-bold text-foreground">Verification Failed</h3>
                    <p className="text-muted-foreground px-4">{message}</p>

                    <div className="mt-6 flex flex-col gap-3 w-full">
                        <Link href="/login" className="w-full flex justify-center py-2 px-4 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-muted">
                            Go to Login
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-card p-10 rounded-xl shadow-lg border border-border">
                <h2 className="text-center text-3xl font-heading font-extrabold text-primary mb-2">
                    Email Verification
                </h2>

                <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </div>
    );
}
