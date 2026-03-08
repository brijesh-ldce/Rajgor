import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch the current user's family members
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const familyMembers = await prisma.familyMember.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json(familyMembers);
    } catch (error: any) {
        console.error("[FAMILY_GET]", error);
        return NextResponse.json({ error: "Failed to fetch family members" }, { status: 500 });
    }
}

// POST: Add a new family member
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, relation, phone, occupation, maritalStatus, dateOfBirth } = body;

        if (!name || !relation) {
            return NextResponse.json({ error: "Name and relation are required" }, { status: 400 });
        }

        const newMember = await prisma.familyMember.create({
            data: {
                userId: session.user.id,
                name,
                relation,
                phone: phone || null,
                occupation: occupation || null,
                maritalStatus: maritalStatus || null,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            }
        });

        return NextResponse.json(newMember);
    } catch (error: any) {
        console.error("[FAMILY_POST]", error);
        return NextResponse.json({ error: "Failed to add family member" }, { status: 500 });
    }
}
