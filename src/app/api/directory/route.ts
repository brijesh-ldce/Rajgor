import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Ensure ONLY logged in AND approved members can view the directory
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { isApproved: true }
        });

        if (!dbUser?.isApproved) {
            return NextResponse.json({ error: "Your account must be approved to view the directory." }, { status: 403 });
        }

        // Fetch all approved members to list in the directory
        const members = await prisma.user.findMany({
            where: {
                isApproved: true,
                role: "MEMBER" // Exclude admins from the community directory by default
            },
            select: {
                id: true,
                name: true,
                phone: true,
                city: true,
                state: true,
                village: true,
                profilePhoto: true,
                familyMembers: {
                    select: {
                        id: true,
                        name: true,
                        relation: true,
                        occupation: true,
                        dateOfBirth: true,
                        maritalStatus: true
                    },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(members);
    } catch (error: any) {
        console.error("[DIRECTORY_GET]", error);
        return NextResponse.json({ error: "Failed to fetch directory" }, { status: 500 });
    }
}
