import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { type, id, action } = await req.json();

        if (!type || !id || !action) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        let result;
        const isApproved = action === "APPROVE";

        if (action === "REJECT") {
            // On reject, we simply delete the pending content. Or we could add a `status` field, but for simplicity we'll delete it.
            if (type === "BIODATA") {
                result = await prisma.biodata.delete({ where: { id } });
            } else if (type === "BUSINESS") {
                result = await prisma.business.delete({ where: { id } });
            } else if (type === "JOB") {
                result = await prisma.jobPosting.delete({ where: { id } });
            }
            return NextResponse.json({ success: true, message: "Content rejected and removed." });
        }

        if (action === "APPROVE") {
            if (type === "BIODATA") {
                result = await prisma.biodata.update({ where: { id }, data: { isApproved } });
            } else if (type === "BUSINESS") {
                result = await prisma.business.update({ where: { id }, data: { isApproved } });
            } else if (type === "JOB") {
                result = await prisma.jobPosting.update({ where: { id }, data: { isApproved } });
            }
            return NextResponse.json({ success: true, item: result });
        }

        return NextResponse.json({ error: "Invalid action or type" }, { status: 400 });
    } catch (error: any) {
        console.error("[ADMIN_CONTENT_PATCH]", error);
        return NextResponse.json({ error: "Failed to process content" }, { status: 500 });
    }
}
