import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Briefcase, Building2, Award, Heart, ArrowRight, ShieldCheck, Star } from "lucide-react";

export default async function MemberDashboard() {
    const session = await getServerSession(authOptions);

    // Fetch live site stats
    const [totalMembers, totalJobs, totalBusinesses, recentBadges] = await Promise.all([
        prisma.user.count({ where: { isApproved: true, role: "MEMBER" } }),
        prisma.jobPosting.count({ where: { isApproved: true } }),
        prisma.business.count({ where: { isApproved: true } }),
        prisma.prideBadge.findMany({
            take: 3,
            orderBy: { awardedAt: "desc" },
            include: { user: { select: { name: true } } }
        })
    ]);

    const modules = [
        {
            icon: Heart,
            title: "Matrimony (Vivah)",
            desc: "Find your ideal life partner from within the community.",
            href: "/matrimony",
            cta: "Browse Profiles",
            secondaryHref: "/matrimony/my-biodata/edit",
            secondaryCta: "My Biodata",
            color: "bg-pink-50 text-pink-600",
            hoverColor: "group-hover:bg-pink-600",
        },
        {
            icon: Briefcase,
            title: "Employment (Rojgar)",
            desc: "Grow your career. Hire trusted talent from within the Samaj.",
            href: "/rojgar",
            cta: "Browse Jobs",
            secondaryHref: "/rojgar/post",
            secondaryCta: "Post a Job",
            color: "bg-blue-50 text-blue-600",
            hoverColor: "group-hover:bg-blue-600",
        },
        {
            icon: Building2,
            title: "Business (Vyapar)",
            desc: "Discover community businesses and help each other grow.",
            href: "/vyapar",
            cta: "Directory",
            secondaryHref: "/vyapar/list",
            secondaryCta: "List Business",
            color: "bg-purple-50 text-purple-600",
            hoverColor: "group-hover:bg-purple-600",
        },
        {
            icon: Award,
            title: "Pride (Garv)",
            desc: "Celebrate community heroes, earn badges, climb the leaderboard.",
            href: "/garv",
            cta: "Leaderboard",
            secondaryHref: "/profile",
            secondaryCta: "My Profile",
            color: "bg-amber-50 text-amber-600",
            hoverColor: "group-hover:bg-amber-600",
        },
    ];

    const communityStats = [
        { label: "Verified Members", value: totalMembers, icon: Users },
        { label: "Open Jobs", value: totalJobs, icon: Briefcase },
        { label: "Businesses Listed", value: totalBusinesses, icon: Building2 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-warm-cream to-orange-50/30">
            {/* Welcome Hero */}
            <div className="relative bg-gradient-to-r from-primary/90 via-primary to-secondary/80 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white blur-3xl" />
                    <div className="absolute bottom-0 left-20 w-48 h-48 rounded-full bg-gold blur-2xl" />
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="w-5 h-5 text-green-300" />
                                <span className="text-sm font-medium text-green-200">Verified Member</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-heading font-bold">
                                જય ગૌ માતા 🙏 {session?.user?.name?.split(" ")[0]}!
                            </h1>
                            <p className="mt-2 text-orange-100 text-base max-w-lg">
                                Welcome to the Rajgor Brahmin Samaj portal — your trusted community hub for matrimony, career, business, and more.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/profile"
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-primary font-semibold rounded-lg hover:bg-orange-50 transition-colors shadow-md text-sm"
                            >
                                <Users className="w-4 h-4" /> My Profile
                            </Link>
                            {session?.user?.role === "ADMIN" && (
                                <Link
                                    href="/admin"
                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/80 transition-colors shadow-md text-sm"
                                >
                                    <ShieldCheck className="w-4 h-4" /> Admin Panel
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Community Stats Row */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 pt-6 border-t border-white/20">
                        {communityStats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-2xl sm:text-3xl font-bold font-heading">{stat.value}+</p>
                                <p className="text-xs sm:text-sm text-orange-100 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Module Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h2 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                    Community Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {modules.map((mod) => (
                        <div
                            key={mod.title}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${mod.color} group-hover:scale-110 transition-transform`}>
                                    <mod.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-heading font-bold text-lg text-foreground">{mod.title}</h3>
                                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{mod.desc}</p>
                            </div>
                            <div className="px-6 pb-5 flex items-center justify-between border-t border-gray-50 pt-4 mt-2">
                                <Link
                                    href={mod.href}
                                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
                                >
                                    {mod.cta} <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                                <Link
                                    href={mod.secondaryHref}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {mod.secondaryCta}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                {recentBadges.length > 0 && (
                    <div className="mt-10">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider">
                                Recent Recognitions
                            </h2>
                            <Link href="/garv" className="text-sm text-primary font-medium hover:underline">
                                View all →
                            </Link>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {recentBadges.map((badge) => (
                                <div
                                    key={badge.id}
                                    className="flex-1 bg-white rounded-xl border border-amber-100 p-4 flex items-center gap-3 shadow-sm"
                                >
                                    <span className="text-2xl">⭐</span>
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">{badge.user.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{badge.badge.replace(/_/g, " ")}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Quick Actions
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/matrimony/my-biodata/edit" className="px-4 py-2 bg-pink-50 text-pink-700 rounded-lg text-sm font-medium hover:bg-pink-100 transition-colors">💍 Edit My Biodata</Link>
                        <Link href="/rojgar/post" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">📋 Post a Job</Link>
                        <Link href="/vyapar/list" className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors">🏪 List My Business</Link>
                        <Link href="/garv" className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors">🏆 View Leaderboard</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
