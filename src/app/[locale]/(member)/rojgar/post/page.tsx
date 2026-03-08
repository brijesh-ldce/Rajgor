"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PostJobPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        try {
            setIsLoading(true);

            const skillsArray = data.skills
                ? data.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
                : [];

            const payload = {
                ...data,
                skills: skillsArray
            };

            const res = await fetch("/api/rojgar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Could not post job");

            toast.success("Job posted! Pending admin approval.");
            router.push("/rojgar");
        } catch (e: any) {
            toast.error(e.message || "Failed to post job");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
            <div className="mb-6">
                <Link href="/rojgar" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Jobs
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-foreground">Post a Job</h1>
                <p className="mt-2 text-muted-foreground">Hire talent from the Rajgor Brahmin Samaj community.</p>
            </div>

            <div className="bg-card border border-border shadow rounded-xl p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Job Title *</label>
                            <input {...register("title", { required: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary" placeholder="e.g. Senior Accountant" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Company Name</label>
                            <input {...register("companyName")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary" placeholder="Your Company Ltd (Optional)" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Job Description *</label>
                            <textarea {...register("description", { required: true })} rows={4} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary" placeholder="Describe the responsibilities and requirements..." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Job Type *</label>
                            <select {...register("jobType", { required: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary">
                                <option value="FULL_TIME">Full Time</option>
                                <option value="PART_TIME">Part Time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERNSHIP">Internship</option>
                                <option value="FREELANCE">Freelance</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Work Mode *</label>
                            <select {...register("workMode", { required: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary">
                                <option value="ONSITE">On-site</option>
                                <option value="REMOTE">Remote</option>
                                <option value="HYBRID">Hybrid</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Location *</label>
                            <input {...register("location", { required: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary" placeholder="City, State" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Qualification Needed</label>
                            <input {...register("qualification")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary" placeholder="e.g. B.Com / M.Com" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Min Salary (Monthly/Yearly - Optional)</label>
                            <input type="number" {...register("salaryMin")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary" placeholder="e.g. 20000" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Max Salary (Optional)</label>
                            <input type="number" {...register("salaryMax")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary" placeholder="e.g. 50000" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Experience Min (Years)</label>
                            <input type="number" {...register("experienceMin")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary" placeholder="0" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Experience Max (Years)</label>
                            <input type="number" {...register("experienceMax")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary" placeholder="5" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Skills (Comma separated)</label>
                            <input {...register("skills")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary" placeholder="Tally, GST, MS Office" />
                        </div>

                        <div className="md:col-span-2 pt-4 border-t border-border">
                            <h3 className="text-lg font-heading font-medium mb-4">Contact Information for Applicants</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Contact Email *</label>
                            <input type="email" {...register("contactEmail", { required: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Contact Phone</label>
                            <input type="text" {...register("contactPhone")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Last Date to Apply</label>
                            <input type="date" {...register("lastDateToApply")} className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary" />
                        </div>
                    </div>

                    <div className="pt-6 border-t flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            {isLoading ? "Posting..." : "Submit Job for Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
