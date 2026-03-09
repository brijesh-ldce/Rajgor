"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const forgotSchema = z.object({
    email: z.string().email("Invalid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormValues>({
        resolver: zodResolver(forgotSchema),
    });

    const onSubmit = async (data: ForgotFormValues) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                throw new Error("Failed to send reset link");
            }

            setSuccess(true);
            toast.success("Check your email for a reset link.");

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-card p-10 rounded-xl shadow-lg border border-border">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-heading font-extrabold text-primary">
                        Forgot Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Enter your email to receive a password reset link.
                    </p>
                </div>

                {success ? (
                    <div className="bg-green-50 text-green-800 p-4 rounded-md text-sm text-center border border-green-200">
                        If an account exists with that email, we have sent a password reset link. Please check your inbox.
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground">Email address</label>
                                <input
                                    {...register("email")}
                                    type="email"
                                    className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary"
                                    placeholder="you@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                            >
                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Send Reset Link
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center text-sm mt-4">
                    <Link href="/login" className="font-medium text-primary hover:text-orange-600 flex justify-center items-center gap-2">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
