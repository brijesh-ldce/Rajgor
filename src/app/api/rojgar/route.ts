import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const {
            title, companyName, description, jobType, workMode, location,
            salaryMin, salaryMax, experienceMin, experienceMax, skills,
            qualification, contactEmail, contactPhone, lastDateToApply
        } = await req.json();

        const job = await prisma.jobPosting.create({
            data: {
                userId: session.user.id,
                title,
                companyName,
                description,
                jobType: jobType as any,
                workMode: workMode as any,
                location,
                salaryMin: salaryMin ? parseInt(salaryMin) : null,
                salaryMax: salaryMax ? parseInt(salaryMax) : null,
                experienceMin: experienceMin ? parseInt(experienceMin) : null,
                experienceMax: experienceMax ? parseInt(experienceMax) : null,
                skills: skills || [],
                qualification,
                contactEmail,
                contactPhone,
                lastDateToApply: lastDateToApply ? new Date(lastDateToApply) : null,
                isApproved: false, // Requires admin approval
            }
        });

        return NextResponse.json({ success: true, jobId: job.id });
    } catch (error: any) {
        console.error("[ROJGAR_POST]", error);
        return NextResponse.json({ error: "Failed to post job" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(req.url);
        const search = url.searchParams.get("search") || "";

        const jobs = await prisma.jobPosting.findMany({
            where: {
                isApproved: true,
                isActive: true,
                ...(search && {
                    OR: [
                        { title: { contains: search, mode: "insensitive" } },
                        { companyName: { contains: search, mode: "insensitive" } },
                        { skills: { hasSome: [search] } }
                    ]
                })
            },
            include: {
                user: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        return NextResponse.json(jobs);
    } catch (error) {
        console.error("[ROJGAR_GET]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
