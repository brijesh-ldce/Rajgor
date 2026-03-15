"use client";

import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Check, X, Eye } from "lucide-react";

export default function AdminUsersClient({ initialUsers }: { initialUsers: any[] }) {
    const [users, setUsers] = useState(initialUsers);
    const [filter, setFilter] = useState("PENDING"); // PENDING | APPROVED | ALL
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const filteredUsers = users.filter((u) => {
        if (filter === "PENDING") return !u.isApproved;
        if (filter === "APPROVED") return u.isApproved;
        return true;
    });

    const handleAction = async (userId: string, action: "APPROVE" | "REJECT") => {
        try {
            setIsProcessing(userId);
            const reason = action === "REJECT" ? prompt("Enter reason for rejection (will be emailed to user):") : undefined;

            if (action === "REJECT" && reason === null) {
                setIsProcessing(null);
                return; // Cancelled
            }

            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, reason })
            });

            if (!res.ok) throw new Error("Action failed");

            if (action === "APPROVE") {
                setUsers(users.map(u => u.id === userId ? { ...u, isApproved: true } : u));
                toast.success("User approved and notified.");
            } else {
                setUsers(users.filter(u => u.id !== userId));
                toast.success("User rejected and notified.");
            }


        } catch (e: any) {
            toast.error(e.message || "Something went wrong.");
        } finally {
            setIsProcessing(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Member Verification</h1>

                <div className="flex bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                    {["PENDING", "APPROVED", "ALL"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm font-medium border-x border-gray-100 flex-1 sm:flex-none ${filter === f ? 'bg-primary text-white border-primary' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                            {f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhar Proof</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">Reg: {format(new Date(user.createdAt), 'dd MMM yy')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                        <div className="text-sm text-gray-500">{user.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.city}</div>
                                        <div className="text-sm text-gray-500">{user.state}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.aadharUrl ? (
                                            <a href={`/api/r2-url?key=${user.aadharUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                                                <Eye className="w-4 h-4 mr-1" /> View Aadhar
                                            </a>
                                        ) : (
                                            <span className="text-sm text-red-500 font-medium">Missing</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {user.isApproved ? 'Approved' : 'Pending Review'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {isProcessing === user.id ? (
                                            <span className="text-gray-500">Processing...</span>
                                        ) : !user.isApproved ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleAction(user.id, "REJECT")} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md transition-colors" title="Reject & Delete">
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleAction(user.id, "APPROVE")} className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-md transition-colors" title="Approve Member">
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">Resolved</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                                        No users found for this filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
