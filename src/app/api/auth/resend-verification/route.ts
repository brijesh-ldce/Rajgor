import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as z from "zod";
import {
    generateToken,
    hashToken,
    addMinutesToNow,
    defaultExpiryMinutes,
} from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

const resendSchema = z.object({
    email: z.string().email(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = resendSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        // Always return success to avoid leaking whether an account exists
        if (!user || user.isVerified) {
            return NextResponse.json({
                message: "If that account exists, a new verification email is on the way.",
            });
        }

        // Delete any existing verification tokens for this user
        await prisma.verificationToken.deleteMany({
            where: { identifier: user.email },
        });

        // Generate new token
        const rawToken = generateToken();
        const hashedToken = hashToken(rawToken);

        await prisma.verificationToken.create({
            data: {
                identifier: user.email,
                token: hashedToken,
                expires: addMinutesToNow(defaultExpiryMinutes.verification),
            },
        });

        await sendVerificationEmail(user.email, user.name, rawToken);

        return NextResponse.json({
            message: "If that account exists, a new verification email is on the way.",
        });
    } catch (error: any) {
        console.error("[RESEND_VERIFICATION]", error);
        return NextResponse.json(
            { error: "Failed to resend verification email." },
            { status: 500 }
        );
    }
}
