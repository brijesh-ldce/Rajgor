"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";

const resetSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

type ResetFormValues = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<ResetFormValues>({
        resolver: zodResolver(resetSchema),
    });

    const onSubmit = async (data: ResetFormValues) => {
        if (!token) {
            toast.error("Missing reset token in URL");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: data.password })
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || "Failed to reset password");
            }

            toast.success("Password reset securely. You can now login.");
            router.push("/login");

        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center text-red-500 bg-red-50 p-4 rounded-md border border-red-200">
                Invalid or missing password reset token. Please request a new link.
            </div>
        );
    }

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground">New Password</label>
                    <input
                        {...register("password")}
                        type="password"
                        className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary"
                        placeholder="••••••••"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground">Confirm New Password</label>
                    <input
                        {...register("confirmPassword")}
                        type="password"
                        className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary"
                        placeholder="••••••••"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Reset Password
                </button>
            </div>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-card p-10 rounded-xl shadow-lg border border-border">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-heading font-extrabold text-primary">
                        Set New Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Please enter your new desired password below.
                    </p>
                </div>

                <Suspense fallback={<div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
                    <ResetPasswordForm />
                </Suspense>

                <div className="text-center text-sm mt-4">
                    <Link href="/login" className="font-medium text-primary hover:text-orange-600 flex justify-center items-center gap-2">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
