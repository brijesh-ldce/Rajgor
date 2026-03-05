import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { helpRequestId, message, contactInfo } = await req.json();

        const helpOffer = await prisma.helpOffer.create({
            data: {
                userId: session.user.id,
                helpRequestId,
                message,
                contactInfo
            }
        });

        // Award first help badge if not already
        const badges = await prisma.prideBadge.findMany({
            where: { userId: session.user.id, badge: "SAMAJ_SEVAK" }
        });

        if (badges.length === 0) {
            await prisma.prideBadge.create({
                data: {
                    userId: session.user.id,
                    badge: "SAMAJ_SEVAK",
                    earnedFor: "Offered first help to a Vyapar business"
                }
            });
        }

        return NextResponse.json({ success: true, helpOfferId: helpOffer.id });
    } catch (error: any) {
        console.error("[HELP_POST]", error);
        return NextResponse.json({ error: "Failed to offer help" }, { status: 500 });
    }
}
