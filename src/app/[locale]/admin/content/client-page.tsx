"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminContentClient({ initialData }: { initialData: any }) {
    const [activeTab, setActiveTab] = useState<"BIODATA" | "BUSINESS" | "JOB">("BIODATA");

    const [data, setData] = useState({
        biodatas: initialData.biodatas,
        businesses: initialData.businesses,
        jobs: initialData.jobs,
    });

    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const handleAction = async (type: string, id: string, action: "APPROVE" | "REJECT") => {
        try {
            setIsProcessing(id);

            const confirmMsg = action === "APPROVE" ? "Approve this content for public viewing?" : "Reject and delete this content permanently?";
            if (!window.confirm(confirmMsg)) {
                setIsProcessing(null);
                return;
            }

            const res = await fetch(`/api/admin/content`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, id, action })
            });

            if (!res.ok) throw new Error("Action failed");

            // Optimistic UI update
            if (type === "BIODATA") {
                setData(prev => ({ ...prev, biodatas: prev.biodatas.filter((item: any) => item.id !== id) }));
            } else if (type === "BUSINESS") {
                setData(prev => ({ ...prev, businesses: prev.businesses.filter((item: any) => item.id !== id) }));
            } else if (type === "JOB") {
                setData(prev => ({ ...prev, jobs: prev.jobs.filter((item: any) => item.id !== id) }));
            }

            toast.success(`Content automatically ${action.toLowerCase()}d.`);

        } catch (e: any) {
            toast.error(e.message || "Something went wrong.");
        } finally {
            setIsProcessing(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="flex border-b border-gray-200">
                    {["BIODATA", "BUSINESS", "JOB"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors
                 ${activeTab === tab ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
               `}
                        >
                            {tab === "BIODATA" ? `Matrimony Biodatas (${data.biodatas.length})` :
                                tab === "BUSINESS" ? `Vyapar Listings (${data.businesses.length})` :
                                    `Rojgar Postings (${data.jobs.length})`}
                        </button>
                    ))}
                </div>

                <div className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted By</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content Summary</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">

                                {/* BIODATAS */}
                                {activeTab === "BIODATA" && data.biodatas.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.user.name}</div>
                                            <div className="text-xs text-gray-500">{item.user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{item.fullName}</div>
                                            <div className="text-sm text-gray-500 line-clamp-1">{item.education} • {item.occupation}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(item.createdAt), 'dd MMM yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/matrimony/${item.id}`} target="_blank" className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-md transition-colors" title="View Profile">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                {isProcessing === item.id ? <span className="text-gray-400 text-xs ml-2">...</span> : (
                                                    <>
                                                        <button onClick={() => handleAction("BIODATA", item.id, "REJECT")} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md transition-colors" title="Reject">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleAction("BIODATA", item.id, "APPROVE")} className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-md transition-colors" title="Approve">
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {/* BUSINESS */}
                                {activeTab === "BUSINESS" && data.businesses.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.user.name}</div>
                                            <div className="text-xs text-gray-500">{item.user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{item.businessName}</div>
                                            <div className="text-sm text-gray-500 line-clamp-1">{item.category} • {item.city}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(item.createdAt), 'dd MMM yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/vyapar/${item.id}`} target="_blank" className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-md transition-colors" title="View Listing">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                {isProcessing === item.id ? <span className="text-gray-400 text-xs ml-2">...</span> : (
                                                    <>
                                                        <button onClick={() => handleAction("BUSINESS", item.id, "REJECT")} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md transition-colors" title="Reject">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleAction("BUSINESS", item.id, "APPROVE")} className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-md transition-colors" title="Approve">
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {/* JOBS */}
                                {activeTab === "JOB" && data.jobs.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.user.name}</div>
                                            <div className="text-xs text-gray-500">{item.user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{item.title}</div>
                                            <div className="text-sm text-gray-500 line-clamp-1">{item.companyName || "No Company"} • {item.workMode}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(item.createdAt), 'dd MMM yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/rojgar/${item.id}`} target="_blank" className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-md transition-colors" title="View Job">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                {isProcessing === item.id ? <span className="text-gray-400 text-xs ml-2">...</span> : (
                                                    <>
                                                        <button onClick={() => handleAction("JOB", item.id, "REJECT")} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md transition-colors" title="Reject">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleAction("JOB", item.id, "APPROVE")} className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-md transition-colors" title="Approve">
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {/* EMPTY STATES */}
                                {activeTab === "BIODATA" && data.biodatas.length === 0 && (
                                    <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">No pending Biodatas for review.</td></tr>
                                )}
                                {activeTab === "BUSINESS" && data.businesses.length === 0 && (
                                    <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">No pending Business Listings for review.</td></tr>
                                )}
                                {activeTab === "JOB" && data.jobs.length === 0 && (
                                    <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">No pending Job Postings for review.</td></tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
