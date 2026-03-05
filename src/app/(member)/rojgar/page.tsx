import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { Briefcase, MapPin, Building, Search, Plus } from "lucide-react";

export default async function RojgarBrowsePage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const session = await getServerSession(authOptions);

    const search = searchParams.search;
    const whereClause: any = { isApproved: true, isActive: true };

    if (search) {
        whereClause.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { companyName: { contains: search, mode: "insensitive" } },
        ];
    }

    const jobs = await prisma.jobPosting.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: 20,
    });

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-border">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground">Employment (Rojgar)</h1>
                    <p className="mt-2 text-muted-foreground">Find opportunities inside our Samaj</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                    <Link
                        href="/rojgar/post"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Post a Job
                    </Link>
                </div>
            </div>

            <div className="mb-6 flex">
                <div className="relative flex-1 max-w-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <form action="/rojgar" method="GET">
                        <input
                            type="text"
                            name="search"
                            defaultValue={search || ""}
                            className="block w-full pl-10 pr-3 py-2 border border-input rounded-md leading-5 bg-background placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="Search by job title, company..."
                        />
                    </form>
                </div>
            </div>

            <div className="space-y-4">
                {jobs.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-xl border border-border border-dashed shadow-sm">
                        <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <Link key={job.id} href={`/rojgar/${job.id}`} className="block">
                            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow group flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-primary/50">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors">{job.title}</h2>
                                        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-xs font-medium text-accent-foreground border border-accent/20 capitalize">
                                            {job.jobType.replace("_", " ").toLowerCase()}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm text-muted-foreground">
                                        {job.companyName && (
                                            <div className="flex items-center">
                                                <Building className="w-4 h-4 mr-1.5" />
                                                {job.companyName}
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1.5" />
                                            {job.location} ({job.workMode})
                                        </div>
                                        {job.salaryMin && job.salaryMax && (
                                            <div className="flex items-center">
                                                <span className="font-medium mr-1 text-foreground">₹</span>
                                                {job.salaryMin.toLocaleString('en-IN')} - {job.salaryMax.toLocaleString('en-IN')}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-start md:items-end justify-between self-stretch">
                                    <div className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded inline-block">
                                        Posted {formatDistanceToNow(new Date(job.createdAt))} ago
                                    </div>
                                    <div className="mt-4 md:mt-0 text-primary font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform">
                                        View Details →
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
