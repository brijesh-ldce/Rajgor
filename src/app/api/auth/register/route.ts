import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    aadharUrl: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = registerSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 });
        }

        const { name, email, phone, city, state, password, aadharUrl } = parsed.data;

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                phone,
                city,
                state,
                password: passwordHash,
                aadharUrl,
                isApproved: false, // Explicitly false, awaiting admin approval
                isVerified: false,
            },
        });

        try {
            // Send email notification to Admin about new pending registration
            const { sendAdminNewRegistrationEmail } = await import("@/lib/email");
            await sendAdminNewRegistrationEmail(user.name, user.email);
        } catch (emailError) {
            console.error("Failed to send admin notification email", emailError);
            // We don't fail the registration if email fails
        }

        return NextResponse.json(
            { message: "Registration successful. Please wait for admin approval.", userId: user.id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("[REGISTER_ERROR]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
