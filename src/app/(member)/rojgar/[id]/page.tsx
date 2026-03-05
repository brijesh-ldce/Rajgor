import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Building, MapPin, Briefcase, IndianRupee, Clock, Mail, Phone, CalendarDays } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    const job = await prisma.jobPosting.findUnique({
        where: { id: params.id },
        include: {
            user: {
                select: { name: true }
            }
        }
    });

    if (!job || (!job.isApproved && (session.user as any).role !== "ADMIN" && job.userId !== session.user.id)) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold">Job post not found or pending approval.</h1>
                <Link href="/rojgar" className="text-primary mt-4 inline-block hover:underline">Return to Jobs</Link>
            </div>
        );
    }

    if (job.userId !== session.user.id) {
        await prisma.jobPosting.update({
            where: { id: job.id },
            data: { views: { increment: 1 } }
        });
    }

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="mb-6">
                <Link href="/rojgar" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Jobs
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card rounded-xl shadow border border-border p-8">
                        <h1 className="text-3xl font-heading font-bold text-foreground">{job.title}</h1>

                        {job.companyName && (
                            <div className="flex items-center text-lg text-primary font-medium mt-2">
                                <Building className="w-5 h-5 mr-2" />
                                {job.companyName}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6 pb-6 border-b border-border text-sm text-foreground">
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                {job.location}
                            </div>
                            <div className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                                <span className="capitalize">{job.jobType.replace("_", " ").toLowerCase()}</span>
                                <span className="mx-2 text-muted-foreground">•</span>
                                <span className="capitalize">{job.workMode.toLowerCase()}</span>
                            </div>
                            {(job.salaryMin || job.salaryMax) && (
                                <div className="flex items-center">
                                    <IndianRupee className="w-4 h-4 mr-1 text-muted-foreground" />
                                    {job.salaryMin?.toLocaleString('en-IN') || "Not specified"} - {job.salaryMax?.toLocaleString('en-IN') || "Not specified"}
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-heading font-semibold mb-4">Job Description</h2>
                            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                                {job.description}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border">
                            <h2 className="text-xl font-heading font-semibold mb-4">Requirements & Skills</h2>
                            {job.qualification && (
                                <div className="mb-4">
                                    <span className="font-medium text-foreground">Education:</span> <span className="text-muted-foreground">{job.qualification}</span>
                                </div>
                            )}

                            {(job.experienceMin !== null || job.experienceMax !== null) && (
                                <div className="mb-4">
                                    <span className="font-medium text-foreground">Experience:</span> <span className="text-muted-foreground">{job.experienceMin || 0} to {job.experienceMax || "Any"} Years</span>
                                </div>
                            )}

                            {job.skills && job.skills.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {job.skills.map((skill: string) => (
                                        <span key={skill} className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card rounded-xl shadow border border-border p-6">
                        <h3 className="text-lg font-heading font-semibold border-b border-border/50 pb-3 mb-4">Apply for Job</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            To apply for this position, please contact the employer directly using the information below.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <Mail className="w-5 h-5 mr-3 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Email Resume to</p>
                                    <a href={`mailto:${job.contactEmail}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                                        {job.contactEmail}
                                    </a>
                                </div>
                            </div>

                            {job.contactPhone && (
                                <div className="flex items-start">
                                    <Phone className="w-5 h-5 mr-3 text-primary mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Call / WhatsApp</p>
                                        <a href={`tel:${job.contactPhone}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                                            {job.contactPhone}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow border border-border p-6">
                        <h3 className="text-lg font-heading font-semibold border-b border-border/50 pb-3 mb-4">Job Overview</h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-3 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Date Posted</p>
                                    <p className="text-sm font-medium text-foreground">{formatDistanceToNow(new Date(job.createdAt))} ago</p>
                                </div>
                            </div>

                            {job.lastDateToApply && (
                                <div className="flex items-center">
                                    <CalendarDays className="w-5 h-5 mr-3 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Apply Before</p>
                                        <p className="text-sm font-medium text-red-600">{format(new Date(job.lastDateToApply), 'dd MMM, yyyy')}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center">
                                <Briefcase className="w-5 h-5 mr-3 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Posted By Member</p>
                                    <p className="text-sm font-medium text-foreground">{job.user.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!job.isApproved && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                            <h3 className="text-yellow-800 font-semibold mb-2">Pending Review</h3>
                            <p className="text-sm text-yellow-700">
                                This job posting is currently visible only to you and admins. It will appear on the public board once approved.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
