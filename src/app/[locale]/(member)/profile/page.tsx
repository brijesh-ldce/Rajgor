import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserCircle, ShieldCheck, Mail, Phone, MapPin, Award, Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default async function TopLevelProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            prideBadges: {
                orderBy: { awardedAt: 'desc' }
            },
            biodata: true,
            businessList: true,
            jobPostings: true
        }
    });

    if (!user) return <div>User not found.</div>;

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="bg-card rounded-2xl shadow border border-border overflow-hidden">

                {/* Header Cover */}
                <div className="h-32 bg-gradient-to-r from-primary to-orange-500 w-full relative"></div>

                <div className="px-6 sm:px-10 pb-10">
                    {/* Avatar and Basic Info */}
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-5">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full border-4 border-card shadow-md flex items-center justify-center text-4xl font-heading font-bold text-primary">
                                {user.name.charAt(0)}
                            </div>
                            <div className="pb-2">
                                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground flex items-center gap-2">
                                    {user.name}
                                    {user.isApproved && <ShieldCheck className="w-6 h-6 text-green-500" />}
                                </h1>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{user.role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">

                        {/* Left Column - Details */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">Contact Info</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center text-foreground">
                                        <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center text-foreground">
                                        <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                                        <span>{user.phone}</span>
                                    </div>
                                    <div className="flex items-center text-foreground">
                                        <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
                                        <span>{user.city}, {user.state}</span>
                                    </div>
                                    <div className="flex items-center text-foreground">
                                        <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                                        <span>Joined {format(new Date(user.createdAt), 'MMM yyyy')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">Account Verification</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Status</span>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {user.isApproved ? 'Approved' : 'Pending Review'}
                                        </span>
                                    </div>
                                    {user.aadharUrl && (
                                        <div className="flex justify-between items-center pt-3 border-t border-border/30">
                                            <span className="text-muted-foreground">ID Document</span>
                                            <a href={`/api/r2-url?key=${user.aadharUrl}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-orange-600 font-medium inline-flex items-center">
                                                <ShieldCheck className="w-4 h-4 mr-1" /> View Aadhar
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">My Activity</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Biodata Profiles</span>
                                        <span className="font-semibold">{user.biodata ? 1 : 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Businesses Listed</span>
                                        <span className="font-semibold">{user.businessList.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Jobs Posted</span>
                                        <span className="font-semibold">{user.jobPostings.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Badges and Garv */}
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center">
                                <Award className="w-6 h-6 mr-2 text-primary" />
                                My Garv (Pride Badges)
                            </h2>

                            {user.prideBadges.length === 0 ? (
                                <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Award className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium text-foreground mb-2">No Badges Yet</h3>
                                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                                        Start contributing to the Samaj platform by offering help to businesses or posting jobs to earn recognition.
                                    </p>
                                    <Link href="/vyapar" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600">
                                        Explore Vyapar to Help
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {user.prideBadges.map(badge => (
                                        <div key={badge.id} className="bg-gradient-to-br from-card to-background border border-border rounded-xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="w-12 h-12 rounded-full bg-accent/20 flex flex-shrink-0 items-center justify-center text-2xl shadow-sm border border-accent/20">
                                                {badge.badge === "SAMAJ_SEVAK" ? "🤝" : badge.badge === "ROZGAR_DOOT" ? "💼" : "🌟"}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-foreground capitalize">{badge.badge.replace("_", " ")}</h4>
                                                <p className="text-xs text-muted-foreground mt-1 mb-2">{badge.earnedFor}</p>
                                                <span className="text-[10px] uppercase font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                    {format(new Date(badge.awardedAt), 'MMMM d, yyyy')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
