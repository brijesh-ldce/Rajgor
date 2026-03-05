import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { action, reason } = await req.json();

        const user = await prisma.user.findUnique({ where: { id: params.id } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        if (action === "APPROVE") {
            const updatedUser = await prisma.user.update({
                where: { id: params.id },
                data: { isApproved: true }
            });

            // Send welcome email
            await sendApprovalEmail(updatedUser.email, updatedUser.name);

            return NextResponse.json({ success: true, user: updatedUser });
        }
        else if (action === "REJECT") {
            // In a real scenario we might just delete or mark as rejected
            await prisma.user.delete({ where: { id: params.id } });

            // Send rejection email
            await sendRejectionEmail(user.email, user.name, reason || "Documents did not meet samaj verification criteria.");

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        console.error("[ADMIN_USER_PATCH]", error);
        return NextResponse.json({ error: "Failed to process Action" }, { status: 500 });
    }
}
