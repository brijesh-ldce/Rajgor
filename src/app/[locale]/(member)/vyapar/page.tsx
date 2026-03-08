import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Search, MapPin, Building2, Plus, Users } from "lucide-react";

export default async function VyaparBrowsePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const session = await getServerSession(authOptions);

    const resolvedSearchParams = await searchParams;
    const search = resolvedSearchParams.search;
    const category = resolvedSearchParams.category;

    const whereClause: any = { isApproved: true, isActive: true };

    if (category) whereClause.category = category;
    if (search) {
        whereClause.OR = [
            { businessName: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    const businesses = await prisma.business.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true } },
            helpNeeded: {
                where: { isResolved: false },
                select: { id: true, helpType: true }
            }
        },
        take: 20,
    });

    // Fetch categories for filter
    const allBusinesses = await prisma.business.findMany({ where: { isApproved: true, isActive: true }, select: { category: true } });
    const categories = Array.from(new Set(allBusinesses.map((b) => b.category)));

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-border">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground">Business (Vyapar)</h1>
                    <p className="mt-2 text-muted-foreground">Support our Samaj businesses</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                    <Link
                        href="/vyapar/list"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        List Business
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="col-span-1 border border-border bg-card rounded-xl p-6 h-fit sticky top-20 shadow-sm">
                    <h3 className="font-heading font-semibold text-lg border-b pb-2 mb-4">Filters</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Search</label>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={search || ""}
                                    className="pl-8 block w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:ring-primary focus:border-primary"
                                    placeholder="Name or keyword..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select name="category" defaultValue={category || ""} className="mt-1 block w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:ring-primary focus:border-primary">
                                <option value="">All Categories</option>
                                {categories.map((cat, i) => (
                                    <option key={i} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="w-full bg-secondary text-white py-2 rounded-md text-sm hover:bg-red-800 transition-colors">
                            Apply Filters
                        </button>
                    </form>
                </div>

                {/* Results */}
                <div className="col-span-1 md:col-span-3">
                    {businesses.length === 0 ? (
                        <div className="text-center py-20 bg-card rounded-xl border border-border border-dashed shadow-sm">
                            <p className="text-muted-foreground">No businesses found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {businesses.map((business) => (
                                <Link key={business.id} href={`/vyapar/${business.id}`} className="block h-full">
                                    <div className="bg-card border border-border rounded-xl p-6 h-full hover:shadow-md transition-shadow group flex flex-col hover:border-primary/50">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 border border-border flex items-center justify-center shrink-0 overflow-hidden">
                                                {business.logo ? (
                                                    <img src={business.logo} alt={business.businessName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Building2 className="w-8 h-8 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                    {business.businessName}
                                                </h2>
                                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                    <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded text-xs font-medium truncate max-w-[150px]">
                                                        {business.category}
                                                    </span>
                                                    <span className="mx-2">•</span>
                                                    <span className="flex items-center truncate max-w-[120px]">
                                                        <MapPin className="w-3 h-3 mr-1 shrink-0" />
                                                        {business.city}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="mt-4 text-sm text-muted-foreground line-clamp-2 flex-1">
                                            {business.description}
                                        </p>

                                        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                                            <div>
                                                {business.helpNeeded && business.helpNeeded.length > 0 ? (
                                                    <div className="flex items-center text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded-md">
                                                        <Users className="w-3 h-3 mr-1" />
                                                        Needs Help ({business.helpNeeded.length})
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Active Business</span>
                                                )}
                                            </div>
                                            <span className="text-primary text-sm font-medium group-hover:underline">Contact →</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
