import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const {
            businessName, category, description, established, website,
            location, city, state, contactEmail, contactPhone, logo, photos,
            helpRequests // array of { type, description }
        } = await req.json();

        const business = await prisma.business.create({
            data: {
                userId: session.user.id,
                businessName,
                category,
                description,
                established,
                website,
                location,
                city,
                state,
                contactEmail,
                contactPhone,
                logo,
                photos: photos || [],
                isApproved: false,
                helpNeeded: {
                    create: helpRequests?.map((hr: any) => ({
                        helpType: hr.type,
                        description: hr.description,
                    })) || []
                }
            }
        });

        return NextResponse.json({ success: true, businessId: business.id });
    } catch (error: any) {
        console.error("[VYAPAR_POST]", error);
        return NextResponse.json({ error: "Failed to list business" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(req.url);
        const search = url.searchParams.get("search") || "";
        const category = url.searchParams.get("category") || "";

        const businesses = await prisma.business.findMany({
            where: {
                isApproved: true,
                isActive: true,
                ...(category && { category }),
                ...(search && {
                    OR: [
                        { businessName: { contains: search, mode: "insensitive" } },
                        { description: { contains: search, mode: "insensitive" } },
                    ]
                })
            },
            include: {
                user: { select: { name: true } },
                helpNeeded: {
                    where: { isResolved: false },
                    select: { id: true, helpType: true } // only selection needed for badges
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        return NextResponse.json(businesses);
    } catch (error) {
        console.error("[VYAPAR_GET]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
