"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Welcome back!");
      // Determine navigation post-login, router push to generic app page
      // E.g., check `getSession()` to properly route to member vs pending vs admin,
      // but for now redirecting to dashboard which can handle checks
      router.push("/dashboard");
      router.refresh();

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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Rajgor Brahmin Samaj Portal
          </p>
        </div>
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

            <div>
              <label className="block text-sm font-medium text-foreground">Password</label>
              <input
                {...register("password")}
                type="password"
                className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">New to Samaj? </span>
            <Link href="/register" className="font-medium text-primary hover:text-orange-600">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
