import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { hashToken } from "@/lib/tokens";

const resetSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token, password } = resetSchema.parse(body);

        const hashedToken = hashToken(token);

        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                token: hashedToken,
                identifier: { startsWith: "password-reset:" },
                expires: { gt: new Date() },
            },
        });

        if (!verificationToken) {
            return NextResponse.json(
                { error: "Invalid or expired reset link." },
                { status: 400 }
            );
        }

        // Extract email from the identifier (format: "password-reset:email@example.com")
        const email = verificationToken.identifier.replace("password-reset:", "");

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        // Delete the used token
        await prisma.verificationToken.delete({
            where: { id: verificationToken.id },
        });

        return NextResponse.json({
            message: "Password has been reset successfully. You can now sign in.",
        });
    } catch (error: any) {
        console.error("[RESET_PASSWORD]", error);
        return NextResponse.json(
            { error: "Failed to reset password." },
            { status: 500 }
        );
    }
}
