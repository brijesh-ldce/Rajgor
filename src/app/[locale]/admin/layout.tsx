import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, LayoutDashboard, FileText, Settings, ArrowLeft } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    const locale = await getLocale();

    if (!session || !session.user) {
        redirect({ href: "/login", locale });
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: session!.user!.id },
        select: { role: true }
    });

    if (dbUser?.role !== "ADMIN") {
        redirect({ href: "/dashboard", locale });
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
                    <Link href="/admin" className="text-xl font-heading font-bold text-white tracking-tight flex items-center gap-2">
                        <span className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-sm">RB</span>
                        Admin Panel
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        <Link href="/admin" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white group">
                            <LayoutDashboard className="w-5 h-5 mr-3 text-slate-400 group-hover:text-white" />
                            Overview
                        </Link>
                        <Link href="/admin/users" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white group">
                            <Users className="w-5 h-5 mr-3 text-slate-400 group-hover:text-white" />
                            Members
                        </Link>
                        <Link href="/admin/content" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white group">
                            <FileText className="w-5 h-5 mr-3 text-slate-400 group-hover:text-white" />
                            Content Approvals
                        </Link>
                    </nav>
                </div>
                <div className="p-4 border-t border-slate-800">
                    <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white group">
                        <ArrowLeft className="w-5 h-5 mr-3 text-slate-400" />
                        Back to App
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
                    <div className="md:hidden font-heading font-bold text-lg">Admin Panel</div>
                    <div className="ml-auto flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">{session?.user?.name}</span>
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                            {session?.user?.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
