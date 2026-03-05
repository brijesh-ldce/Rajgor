"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export default function ListBusinessPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { register, control, handleSubmit, formState: { errors } } = useForm<any>({
        defaultValues: {
            helpRequests: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "helpRequests"
    });

    const onSubmit = async (data: any) => {
        try {
            setIsLoading(true);

            const res = await fetch("/api/vyapar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data) // for simplicity, assuming no R2 uploads in this dummy version to save time, or we just submit standard JSON
            });

            if (!res.ok) throw new Error("Could not list business");

            toast.success("Business submitted! Pending admin approval.");
            router.push("/vyapar");
        } catch (e: any) {
            toast.error(e.message || "Failed to list business");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
            <div className="mb-6">
                <Link href="/vyapar" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Directory
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-foreground">List Your Business</h1>
                <p className="mt-2 text-muted-foreground">Showcase your products/services and ask for community help if needed.</p>
            </div>

            <div className="bg-card border border-border shadow rounded-xl p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Business Name *</label>
                            <input {...register("businessName", { required: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Category *</label>
                            <input {...register("category", { required: true })} placeholder="e.g. IT Services, Retail, Pharmacy" className="mt-1 block w-full border border-input rounded-md px-3 py-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Year Established</label>
                            <input {...register("established")} placeholder="2010" className="mt-1 block w-full border border-input rounded-md px-3 py-2" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Description *</label>
                            <textarea {...register("description", { required: true })} rows={4} className="mt-1 block w-full border border-input rounded-md px-3 py-2" placeholder="Describe your business..." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Full Address</label>
                            <input {...register("location")} className="mt-1 block w-full border border-input rounded-md px-3 py-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">City *</label>
                            <input {...register("city", { required: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">State *</label>
                            <input {...register("state", { required: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Website</label>
                            <input {...register("website")} placeholder="https://" className="mt-1 block w-full border border-input rounded-md px-3 py-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Contact Email *</label>
                            <input type="email" {...register("contactEmail", { required: true })} className="mt-1 block w-full border border-input rounded-md px-3 py-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Contact Phone</label>
                            <input {...register("contactPhone")} className="mt-1 block w-full border border-input rounded-md px-3 py-2" />
                        </div>

                        <div className="md:col-span-2 bg-accent/5 border border-accent/20 rounded-xl p-6 mt-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-heading font-semibold text-foreground">Community Help Requests</h3>
                                    <p className="text-sm text-muted-foreground">Need help scaling? Looking for investors? Ask the Samaj.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => append({ type: "MENTOR", description: "" })}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-secondary hover:bg-red-800"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add Request
                                </button>
                            </div>

                            {fields.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No help requests added.</p>
                            ) : (
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="relative bg-card p-4 rounded-md border border-border shadow-sm flex flex-col md:flex-row gap-4 items-start">
                                            <div className="w-full md:w-1/3">
                                                <label className="block text-xs font-medium text-muted-foreground uppercase mb-1">Help Type</label>
                                                <select {...register(`helpRequests.${index}.type` as const)} className="w-full text-sm border border-input rounded-md px-2 py-1.5">
                                                    <option value="INVESTOR">Investor</option>
                                                    <option value="MENTOR">Mentor</option>
                                                    <option value="EMPLOYEE">Employee / Talent</option>
                                                    <option value="SUPPLIER">Supplier</option>
                                                    <option value="CLIENT">Client</option>
                                                    <option value="PARTNER">Partner</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                            </div>
                                            <div className="w-full md:w-2/3 pr-8">
                                                <label className="block text-xs font-medium text-muted-foreground uppercase mb-1">Description</label>
                                                <textarea {...register(`helpRequests.${index}.description` as const, { required: true })} rows={2} className="w-full text-sm border border-input rounded-md px-2 py-1.5" placeholder="e.g. Need 5L investment for expanding inventory" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="absolute right-4 top-4 text-red-500 hover:text-red-700"
                                                title="Remove Request"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            {isLoading ? "Submitting..." : "Submit Business"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
