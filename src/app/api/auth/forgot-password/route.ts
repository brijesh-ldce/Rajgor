import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as z from "zod";
import {
    generateToken,
    hashToken,
    addMinutesToNow,
    defaultExpiryMinutes,
} from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";

const forgotSchema = z.object({
    email: z.string().email(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = forgotSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        // Always return success to avoid leaking whether an account exists
        if (!user) {
            return NextResponse.json({
                message: "If an account with that email exists, a password reset link has been sent.",
            });
        }

        // Delete any existing password reset tokens for this user
        await prisma.verificationToken.deleteMany({
            where: { identifier: `password-reset:${user.email}` },
        });

        // Generate new token
        const rawToken = generateToken();
        const hashedToken = hashToken(rawToken);

        await prisma.verificationToken.create({
            data: {
                identifier: `password-reset:${user.email}`,
                token: hashedToken,
                expires: addMinutesToNow(defaultExpiryMinutes.passwordReset),
            },
        });

        await sendPasswordResetEmail(user.email, user.name, rawToken);

        return NextResponse.json({
            message: "If an account with that email exists, a password reset link has been sent.",
        });
    } catch (error: any) {
        console.error("[FORGOT_PASSWORD]", error);
        return NextResponse.json(
            { error: "Failed to process password reset request." },
            { status: 500 }
        );
    }
}
