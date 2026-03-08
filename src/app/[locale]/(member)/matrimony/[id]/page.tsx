import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Download, Eye, Heart, MapPin, Phone, Mail } from "lucide-react";

export default async function BiodataDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    const biodata = await prisma.biodata.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                    city: true,
                    state: true,
                }
            }
        }
    });

    if (!biodata || (!biodata.isApproved && session.user.role !== "ADMIN" && biodata.userId !== session.user.id)) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold">Biodata not found or pending approval.</h1>
                <Link href="/matrimony" className="text-primary mt-4 inline-block hover:underline">Return to Matchmaking</Link>
            </div>
        );
    }

    // Record a view (in a real app, you'd want to do this via a client-side API call to avoid triggering Next.js static rendering issues or deduping, but for MVP this is fine inside a dynamic route)
    if (biodata.userId !== session.user.id) {
        await prisma.biodata.update({
            where: { id: biodata.id },
            data: { views: { increment: 1 } }
        });
    }

    const age = new Date().getFullYear() - new Date(biodata.dateOfBirth).getFullYear();

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
                <Link href="/matrimony" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Browse
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column - Photos and Quick Actions */}
                <div className="col-span-1 space-y-6">
                    <div className="bg-card rounded-xl shadow border border-border overflow-hidden">
                        {biodata.photos && biodata.photos.length > 0 ? (
                            <img src={biodata.photos[0]} alt="Profile" className="w-full h-80 object-cover" />
                        ) : (
                            <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400">No Photo</span>
                            </div>
                        )}

                        {biodata.photos && biodata.photos.length > 1 && (
                            <div className="flex gap-2 p-4 overflow-x-auto">
                                {biodata.photos.map((photo: string, i: number) => (
                                    <img key={i} src={photo} alt={`Gallery ${i + 1}`} className="w-16 h-16 object-cover rounded-md border border-border" />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-card rounded-xl shadow border border-border p-6 text-center">
                        <button className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 mb-3">
                            <Heart className="w-5 h-5" />
                            Show Interest
                        </button>
                        <p className="text-xs text-muted-foreground">This will notify the member</p>

                        {biodata.horoscope && (
                            <a href={biodata.horoscope} target="_blank" rel="noopener noreferrer" className="mt-4 w-full bg-secondary text-white py-3 rounded-md font-medium hover:bg-red-800 transition-colors flex items-center justify-center gap-2">
                                <Download className="w-5 h-5" />
                                Download Kundli
                            </a>
                        )}
                    </div>
                </div>

                {/* Right Column - Detailed Info */}
                <div className="col-span-1 md:col-span-2 space-y-8">

                    <div className="bg-card rounded-xl shadow border border-border p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-heading font-bold text-foreground">
                                    {biodata.fullName}
                                    {!biodata.isApproved && <span className="ml-3 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full uppercase">Pending Review</span>}
                                </h1>
                                <p className="text-lg text-primary font-medium mt-1">
                                    {biodata.education} • {biodata.occupation}
                                </p>
                                <div className="flex items-center text-muted-foreground mt-2">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {biodata.user.city}, {biodata.user.state}
                                </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground flex flex-col items-end">
                                <span className="flex items-center"><Eye className="w-4 h-4 mr-1" /> {biodata.views} Views</span>
                                <span className="mt-1">ID: #{biodata.id.slice(-6).toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border/50">
                            <div>
                                <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Age</span>
                                <span className="font-semibold text-foreground">{age} yrs</span>
                            </div>
                            <div>
                                <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Height</span>
                                <span className="font-semibold text-foreground">{biodata.height}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Gotra</span>
                                <span className="font-semibold text-foreground">{biodata.gotra}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Manglik</span>
                                <span className="font-semibold text-foreground">{biodata.manglik ? "Yes" : "No"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-card rounded-xl shadow border border-border p-8">
                            <h3 className="text-xl font-heading font-semibold text-secondary border-b border-border/50 pb-3 mb-5">Personal Details</h3>
                            <ul className="space-y-4 text-sm">
                                <li className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Birth Date:</span> <span className="col-span-2 font-medium">{new Date(biodata.dateOfBirth).toLocaleDateString()}</span></li>
                                <li className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Birth Time:</span> <span className="col-span-2 font-medium">{biodata.birthTime || "Not specified"}</span></li>
                                <li className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Birth Place:</span> <span className="col-span-2 font-medium">{biodata.birthPlace || "Not specified"}</span></li>
                                <li className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Blood Group:</span> <span className="col-span-2 font-medium">{biodata.bloodGroup || "Not specified"}</span></li>
                                <li className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Complexion:</span> <span className="col-span-2 font-medium">{biodata.complexion || "Not specified"}</span></li>
                                <li className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Kuldevi:</span> <span className="col-span-2 font-medium">{biodata.kuldevi || "Not specified"}</span></li>
                            </ul>
                        </div>

                        <div className="bg-card rounded-xl shadow border border-border p-8">
                            <h3 className="text-xl font-heading font-semibold text-secondary border-b border-border/50 pb-3 mb-5">Education & Career</h3>
                            <ul className="space-y-4 text-sm">
                                <li className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Education:</span> <span className="col-span-2 font-medium">{biodata.education}</span></li>
                                <li className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Occupation:</span> <span className="col-span-2 font-medium">{biodata.occupation}</span></li>
                                <li className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Income:</span> <span className="col-span-2 font-medium">{biodata.annualIncome || "Not specified"}</span></li>
                                <li className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Work Location:</span> <span className="col-span-2 font-medium">{biodata.workLocation || "Not specified"}</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow border border-border p-8">
                        <h3 className="text-xl font-heading font-semibold text-secondary border-b border-border/50 pb-3 mb-5">Family Background</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Father:</span> <span className="col-span-2 font-medium">{biodata.fatherName}</span></div>
                            <div className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Father's Occ.:</span> <span className="col-span-2 font-medium">{biodata.fatherOccupation || "Not specified"}</span></div>
                            <div className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Mother:</span> <span className="col-span-2 font-medium">{biodata.motherName}</span></div>
                            <div className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Mother's Occ.:</span> <span className="col-span-2 font-medium">{biodata.motherOccupation || "Not specified"}</span></div>
                            <div className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Siblings:</span> <span className="col-span-2 font-medium">{biodata.siblings || "None"}</span></div>
                            <div className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Family Type:</span> <span className="col-span-2 font-medium capitalize">{biodata.familyType.toLowerCase()}</span></div>
                            <div className="grid grid-cols-3"><span className="text-muted-foreground font-medium">Status:</span> <span className="col-span-2 font-medium">{biodata.familyStatus || "Not specified"}</span></div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow border border-border p-8">
                        <h3 className="text-xl font-heading font-semibold text-secondary border-b border-border/50 pb-3 mb-5">Partner Expectations</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                                <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Age Max/Min</span>
                                <span className="font-semibold text-foreground">{biodata.partnerAgeMin || "Any"} - {biodata.partnerAgeMax || "Any"} yrs</span>
                            </div>
                            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                                <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Min Height</span>
                                <span className="font-semibold text-foreground">{biodata.partnerHeightMin || "Any"}</span>
                            </div>
                            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                                <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">Education</span>
                                <span className="font-semibold text-foreground">{biodata.partnerEducation || "Any"}</span>
                            </div>
                            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                                <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">City/Location</span>
                                <span className="font-semibold text-foreground">{biodata.partnerCity || "Any"}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
