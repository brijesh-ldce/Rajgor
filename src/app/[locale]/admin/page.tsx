import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, Building2, Briefcase, Heart } from "lucide-react";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    // Aggregate Stats
    const userCount = await prisma.user.count({ where: { role: 'MEMBER' } });
    const pendingUsers = await prisma.user.count({ where: { isApproved: false } });

    const businessCount = await prisma.business.count();
    const pendingBusiness = await prisma.business.count({ where: { isApproved: false } });

    const jobCount = await prisma.jobPosting.count();
    const pendingJobs = await prisma.jobPosting.count({ where: { isApproved: false } });

    const biodataCount = await prisma.biodata.count();
    const pendingBiodata = await prisma.biodata.count({ where: { isApproved: false } });

    const stats = [
        { name: 'Total Members', value: userCount, pending: pendingUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Matrimony Profiles', value: biodataCount, pending: pendingBiodata, icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' },
        { name: 'Vyapar Listings', value: businessCount, pending: pendingBusiness, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-100' },
        { name: 'Rojgar Jobs', value: jobCount, pending: pendingJobs, icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
                        <div className={`p-3 rounded-lg mr-4 ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                {stat.pending > 0 && (
                                    <p className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                        {stat.pending} pending
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Recent Activity Log</h3>
                </div>
                <div className="p-6 text-center text-sm text-gray-500">
                    Activity feed visualization will appear here. Navigate to specific sections to process pending approvals.
                </div>
            </div>
        </div>
    );
}
