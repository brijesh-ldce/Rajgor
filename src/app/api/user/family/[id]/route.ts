import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify ownership
        const existing = await prisma.familyMember.findUnique({ where: { id: params.id } });
        if (!existing || existing.userId !== session.user.id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        const body = await req.json();
        const { name, relation, phone, occupation, maritalStatus, dateOfBirth } = body;

        const updatedMember = await prisma.familyMember.update({
            where: { id: params.id },
            data: {
                name: name !== undefined ? name : existing.name,
                relation: relation !== undefined ? relation : existing.relation,
                phone: phone !== undefined ? phone : existing.phone,
                occupation: occupation !== undefined ? occupation : existing.occupation,
                maritalStatus: maritalStatus !== undefined ? maritalStatus : existing.maritalStatus,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : existing.dateOfBirth,
            }
        });

        return NextResponse.json(updatedMember);
    } catch (error: any) {
        console.error("[FAMILY_PATCH]", error);
        return NextResponse.json({ error: "Failed to update family member" }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify ownership
        const existing = await prisma.familyMember.findUnique({ where: { id: params.id } });
        if (!existing || existing.userId !== session.user.id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        await prisma.familyMember.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[FAMILY_DELETE]", error);
        return NextResponse.json({ error: "Failed to delete family member" }, { status: 500 });
    }
}
