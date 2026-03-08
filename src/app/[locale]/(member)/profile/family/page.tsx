"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Trash2, UserPlus, Users, Loader2 } from "lucide-react";

type FamilyMember = {
    id: string;
    name: string;
    relation: string;
    phone: string | null;
    occupation: string | null;
};

export default function FamilyManagementPage() {
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>();

    // Fetch existing family members
    const fetchFamily = async () => {
        try {
            const res = await fetch("/api/user/family");
            if (!res.ok) throw new Error("Failed to load");
            const data = await res.json();
            setMembers(data);
        } catch (error) {
            toast.error("Could not load family members.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFamily();
    }, []);

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/user/family", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to add member");

            toast.success("Family member added!");
            reset(); // Clear form
            fetchFamily(); // Reload list
        } catch (error) {
            toast.error("Failed to add family member.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this family member?")) return;

        try {
            const res = await fetch(`/api/user/family/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");

            setMembers(members.filter(m => m.id !== id));
            toast.success("Family member removed.");
        } catch (error) {
            toast.error("Failed to remove member.");
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">
            <h1 className="text-3xl font-heading font-bold text-foreground flex items-center gap-2">
                <Users className="w-8 h-8 text-primary" />
                My Family Details
            </h1>

            {/* Add New Member Form */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sm:p-8">
                <h2 className="text-xl font-heading font-semibold mb-6 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary" />
                    Add Family Member
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name *</label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                className="w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary text-sm"
                                placeholder="e.g. Ramesh Rajgor"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Relation *</label>
                            <select
                                {...register("relation", { required: "Relation is required" })}
                                className="w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary text-sm"
                            >
                                <option value="">Select Relation...</option>
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Son">Son</option>
                                <option value="Daughter">Daughter</option>
                                <option value="Brother">Brother</option>
                                <option value="Sister">Sister</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.relation && <p className="text-red-500 text-xs mt-1">{errors.relation.message as string}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number <span className="text-muted-foreground text-xs">(Optional)</span></label>
                            <input
                                {...register("phone")}
                                type="tel"
                                className="w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary text-sm"
                                placeholder="9876543210"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Occupation <span className="text-muted-foreground text-xs">(Optional)</span></label>
                            <input
                                {...register("occupation")}
                                className="w-full border border-input rounded-md px-3 py-2 bg-background focus:ring-primary focus:border-primary text-sm"
                                placeholder="e.g. Teacher, Engineer, Student"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-primary hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                            Add Member
                        </button>
                    </div>
                </form>
            </div>

            {/* List Existing Members */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-muted/20">
                    <h3 className="text-lg font-medium text-foreground">Current Members ({members.length})</h3>
                </div>

                {isLoading ? (
                    <div className="p-10 flex justify-center text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : members.length === 0 ? (
                    <div className="p-10 text-center text-muted-foreground">
                        No family members added yet. Add one above!
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {members.map(member => (
                            <div key={member.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-muted/10 transition-colors">
                                <div>
                                    <h4 className="font-bold text-foreground text-lg">{member.name}</h4>
                                    <div className="flex gap-2 items-center mt-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                            {member.relation}
                                        </span>
                                        {member.phone && <span className="text-sm text-muted-foreground">• {member.phone}</span>}
                                    </div>
                                    {member.occupation && <p className="text-sm text-muted-foreground mt-2">💼 {member.occupation}</p>}
                                </div>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    className="self-start sm:self-center text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors"
                                    title="Remove member"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
