import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MatrimonyBrowsePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const session = await getServerSession(authOptions);

    const resolvedSearchParams = await searchParams;
    const gender = resolvedSearchParams.gender;
    const whereClause: any = { isApproved: true, isActive: true };

    if (gender) {
        whereClause.gender = gender;
    }

    const biodatas = await prisma.biodata.findMany({
        where: whereClause,
        include: {
            user: {
                select: { city: true, state: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-border">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground">Matrimony (Vivah)</h1>
                    <p className="mt-2 text-muted-foreground">Find your ideal life partner</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <Link
                        href="/matrimony/my-biodata/edit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Manage My Biodata
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="col-span-1 border border-border bg-card rounded-xl p-6 h-fit sticky top-20 shadow-sm">
                    <h3 className="font-heading font-semibold text-lg border-b pb-2 mb-4">Filters</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Gender</label>
                            <select name="gender" defaultValue={gender || ""} className="mt-1 block w-full border border-input rounded-md px-3 py-2 text-sm bg-background">
                                <option value="">All</option>
                                <option value="MALE">Male (Groom)</option>
                                <option value="FEMALE">Female (Bride)</option>
                            </select>
                        </div>

                        <button type="submit" className="w-full bg-secondary text-white py-2 rounded-md text-sm hover:bg-red-800 transition-colors">
                            Apply Filters
                        </button>
                    </form>
                </div>

                {/* Results Grid */}
                <div className="col-span-1 md:col-span-3">
                    {biodatas.length === 0 ? (
                        <div className="text-center py-20 bg-card rounded-xl border border-border border-dashed shadow-sm">
                            <p className="text-muted-foreground">No biodatas found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {biodatas.map((bio) => (
                                <div key={bio.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                                    <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {bio.photos.length > 0 ? (
                                            <img src={bio.photos[0]} alt="Profile" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <span className="text-gray-400">No Photo</span>
                                        )}
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-lg font-heading font-bold text-foreground truncate">{bio.fullName.split(" ")[0]} ****</h3>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{bio.education} • {bio.occupation}</p>
                                        <div className="mt-4 flex-1">
                                            <div className="flex justify-between text-sm py-1 border-b border-border/50">
                                                <span className="text-muted-foreground">Age</span>
                                                <span className="font-medium">{new Date().getFullYear() - new Date(bio.dateOfBirth).getFullYear()} yrs</span>
                                            </div>
                                            <div className="flex justify-between text-sm py-1 border-b border-border/50">
                                                <span className="text-muted-foreground">Height</span>
                                                <span className="font-medium">{bio.height}</span>
                                            </div>
                                            <div className="flex justify-between text-sm py-1 border-b border-border/50">
                                                <span className="text-muted-foreground">Gotra</span>
                                                <span className="font-medium">{bio.gotra}</span>
                                            </div>
                                            <div className="flex justify-between text-sm py-1">
                                                <span className="text-muted-foreground">Location</span>
                                                <span className="font-medium truncate max-w-[120px] text-right">{bio.user.city}</span>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-border">
                                            <Link href={`/matrimony/${bio.id}`} className="block w-full text-center text-sm font-medium text-primary hover:text-orange-600 hover:underline">
                                                View Full Profile
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
