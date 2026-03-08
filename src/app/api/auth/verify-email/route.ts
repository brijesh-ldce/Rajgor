import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const token = url.searchParams.get("token");

        if (!token) {
            return NextResponse.json({ error: "Missing verification token." }, { status: 400 });
        }

        const hashedToken = hashToken(token);

        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                token: hashedToken,
                expires: { gt: new Date() },
            },
        });

        if (!verificationToken) {
            return NextResponse.json({ error: "Invalid or expired verification link." }, { status: 400 });
        }

        // Mark user as verified
        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { isVerified: true },
        });

        // Delete the used token
        await prisma.verificationToken.delete({
            where: { id: verificationToken.id },
        });

        return NextResponse.json({ message: "Email verified successfully. You can sign in now." });
    } catch (error: any) {
        console.error("[VERIFY_EMAIL]", error);
        return NextResponse.json({ error: "Failed to verify email." }, { status: 500 });
    }
}
