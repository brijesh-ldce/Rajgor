import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Award, Star, TrendingUp, Users } from "lucide-react";

export default async function GarvPage() {
    const session = await getServerSession(authOptions);

    // Get users ordered by number of badges
    const topUsers = await prisma.user.findMany({
        where: { isApproved: true },
        select: {
            id: true,
            name: true,
            city: true,
            prideBadges: true,
            _count: {
                select: { prideBadges: true }
            }
        },
        orderBy: {
            prideBadges: {
                _count: 'desc'
            }
        },
        take: 10
    });

    const recentBadges = await prisma.prideBadge.findMany({
        include: {
            user: { select: { name: true, city: true } }
        },
        orderBy: { awardedAt: 'desc' },
        take: 10
    });

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="mb-8 text-center pb-8 border-b border-border">
                <h1 className="text-4xl font-heading font-bold text-foreground">Community Pride (Garv)</h1>
                <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Recognizing and celebrating the members who actively contribute to the growth and wellbeing of the Rajgor Brahmin Samaj.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Leaderboard */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-heading font-bold text-foreground">Top Contributors Leaderboard</h2>
                    </div>

                    <div className="bg-card rounded-xl shadow border border-border overflow-hidden">
                        {topUsers.map((user, index) => (
                            <div key={user.id} className={`p-4 sm:p-6 flex items-center gap-4 ${index !== topUsers.length - 1 ? 'border-b border-border' : ''}`}>
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-heading font-bold text-lg shrink-0
                  ${index === 0 ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' :
                                        index === 1 ? 'bg-gray-100 text-gray-700 border-2 border-gray-300' :
                                            index === 2 ? 'bg-orange-100 text-orange-800 border-2 border-orange-300' :
                                                'bg-secondary/10 text-secondary'}`}>
                                    #{index + 1}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-foreground truncate">{user.name}</h3>
                                    <p className="text-sm text-muted-foreground">{user.city}</p>
                                </div>

                                <div className="flex flex-col items-end text-right">
                                    <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full">
                                        <Star className="w-4 h-4 fill-primary text-primary" />
                                        <span className="font-bold">{user._count.prideBadges}</span>
                                        <span className="hidden sm:inline text-xs uppercase tracking-wider font-semibold">Badges</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {topUsers.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                No badges have been awarded yet. Be the first to earn one!
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary to-orange-600 rounded-xl shadow-lg p-6 text-white">
                        <h3 className="text-xl font-heading font-bold mb-2 flex items-center">
                            <Award className="w-6 h-6 mr-2" />
                            How to Earn Badges
                        </h3>
                        <p className="text-white/80 text-sm mb-4">
                            Badges are awarded automatically for community participation or manually by Samaj Admins for significant contributions.
                        </p>
                        <ul className="space-y-3 text-sm font-medium">
                            <li className="flex items-start">
                                <span className="bg-white/20 p-1 rounded mr-3 mt-0.5">🤝</span>
                                <span><strong className="text-white block">Samaj Sevak</strong> Offer help to businesses in Vyapar.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-white/20 p-1 rounded mr-3 mt-0.5">💼</span>
                                <span><strong className="text-white block">Rojgar दाता</strong> Post job opportunities for the Samaj.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-white/20 p-1 rounded mr-3 mt-0.5">🌟</span>
                                <span><strong className="text-white block">Garv Icon</strong> Awarded by admins for outstanding real-world service.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-card rounded-xl shadow border border-border p-6">
                        <h3 className="text-lg font-heading font-semibold mb-4 border-b border-border/50 pb-2 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-muted-foreground" />
                            Recent Recognitions
                        </h3>

                        <div className="space-y-4">
                            {recentBadges.slice(0, 5).map(badge => (
                                <div key={badge.id} className="flex gap-3 items-start">
                                    <div className="w-8 h-8 rounded-full bg-accent/20 flex flex-shrink-0 items-center justify-center text-lg shadow-sm border border-accent/30 text-accent-foreground mt-1">
                                        {badge.badge === "SAMAJ_SEVAK" ? "🤝" : badge.badge === "ROZGAR_DOOT" ? "💼" : "🌟"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            <span className="font-bold">{badge.user.name}</span> earned <span className="text-primary font-semibold">{badge.badge.replace("_", " ")}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{badge.earnedFor}</p>
                                    </div>
                                </div>
                            ))}
                            {recentBadges.length === 0 && (
                                <p className="text-sm text-muted-foreground">No recent activities.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
