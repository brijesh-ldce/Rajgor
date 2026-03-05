"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [aadharFile, setAadharFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setAadharFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (!aadharFile) {
      toast.error("Please upload your Aadhar ID for verification.");
      return;
    }

    try {
      setIsLoading(true);

      const presignedRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: aadharFile.name, contentType: aadharFile.type, type: "aadhar" })
      });

      if (!presignedRes.ok) throw new Error("Could not get upload URL");
      const { url, key } = await presignedRes.json();

      await fetch(url, {
        method: "PUT",
        body: aadharFile,
        headers: { "Content-Type": aadharFile.type }
      });

      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          city: data.city,
          state: data.state,
          password: data.password,
          aadharUrl: key,
        }),
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.error || "Failed to register");
      }

      toast.success("Registration successful! Please wait for admin approval.", { duration: 5000 });
      router.push("/pending-approval");

    } catch (error: any) {
      toast.error(error.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-card p-10 rounded-xl shadow-lg border border-border">
        <div>
          <h2 className="mt-6 text-center text-3xl font-heading font-extrabold text-primary">
            Join Rajgor Brahmin Samaj
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Connect with our community, find employment, and grow your business.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Full Name</label>
              <input
                {...register("name")}
                type="text"
                className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary"
                placeholder="Jaydeep Rajgor"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

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
              <label className="block text-sm font-medium text-foreground">Phone Number</label>
              <input
                {...register("phone")}
                type="text"
                className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary"
                placeholder="9876543210"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">City</label>
              <input
                {...register("city")}
                type="text"
                className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary"
                placeholder="Ahmedabad"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">State</label>
              <input
                {...register("state")}
                type="text"
                className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary"
                placeholder="Gujarat"
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Password</label>
              <input
                {...register("password")}
                type="password"
                className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Confirm Password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Aadhar Card Verification (For Identity)</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"
                }`}
            >
              <input {...getInputProps()} />
              {aadharFile ? (
                <p className="text-sm font-medium text-green-600">Selected: {aadharFile.name}</p>
              ) : (
                <p className="text-sm text-gray-500">Drag & drop your Aadhar image/pdf here, or click to select</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already a member? </span>
            <Link href="/login" className="font-medium text-primary hover:text-orange-600">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
